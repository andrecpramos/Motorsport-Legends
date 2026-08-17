/**
 * Work out what kind of project this is before asking the user about it.
 *
 * Detection is a courtesy, not a decision — every value here becomes the *default* of a question
 * the user still gets asked. Guessing wrong and proceeding silently is how scaffolding tools earn
 * their reputation.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

/**
 * Per-stack knowledge: how the project is installed, run, tested and built, and what a CI job has
 * to do before any of that works.
 *
 * `installCommand` and `runCommand` matter more than they look. They are what turns the generated
 * `dev` script into a real entry point, and they are the two things an agent most often has to
 * guess at — "how do I actually start this?" is the question no repository answers reliably, so
 * the kit makes the project answer it once, in a place both a human and an agent will find.
 *
 * The `ciSetup` strings are pre-indented for a GitHub Actions `steps:` block.
 */
const STACKS = {
  node: {
    label: 'Node / JavaScript / TypeScript',
    installCommand: "npm install",
    runCommand: "npm start",
    toolCheck: "node --version",
    testCommand: 'npm test',
    lintCommand: 'npm run lint --if-present',
    buildCommand: 'npm run build --if-present',
    sourceDirs: ['src'],
    sourceExtensions: ['.js', '.mjs', '.ts', '.tsx', '.jsx'],
    ciSetup: [
      '      - uses: actions/setup-node@v4',
      '        with:',
      "          node-version: '22'",
      "          cache: 'npm'",
      '',
      '      - name: Install',
      '        run: npm ci',
    ].join('\n'),
  },
  python: {
    label: 'Python',
    installCommand: "pip install -e \".[dev]\"",
    runCommand: "python -m src",
    toolCheck: "python --version",
    testCommand: 'pytest',
    lintCommand: 'ruff check .',
    buildCommand: '',
    sourceDirs: ['src'],
    sourceExtensions: ['.py'],
    ciSetup: [
      '      - uses: actions/setup-python@v5',
      '        with:',
      "          python-version: '3.12'",
      '',
      '      - name: Install',
      '        run: |',
      '          python -m pip install --upgrade pip',
      '          pip install -e ".[dev]" || pip install -r requirements.txt',
    ].join('\n'),
  },
  go: {
    label: 'Go',
    installCommand: "go mod download",
    runCommand: "go run ./...",
    toolCheck: "go version",
    testCommand: 'go test ./...',
    lintCommand: 'go vet ./...',
    buildCommand: 'go build ./...',
    sourceDirs: ['.'],
    sourceExtensions: ['.go'],
    ciSetup: [
      '      - uses: actions/setup-go@v5',
      '        with:',
      "          go-version: '1.23'",
    ].join('\n'),
  },
  rust: {
    label: 'Rust',
    installCommand: "cargo fetch",
    runCommand: "cargo run",
    toolCheck: "cargo --version",
    testCommand: 'cargo test',
    lintCommand: 'cargo clippy -- -D warnings',
    buildCommand: 'cargo build --release',
    sourceDirs: ['src'],
    sourceExtensions: ['.rs'],
    ciSetup: [
      '      - uses: dtolnay/rust-toolchain@stable',
      '        with:',
      '          components: clippy',
    ].join('\n'),
  },
  java: {
    label: 'Java / Kotlin (JVM)',
    installCommand: "./gradlew dependencies",
    runCommand: "./gradlew run",
    toolCheck: "java -version",
    testCommand: './gradlew test',
    lintCommand: '',
    buildCommand: './gradlew build',
    sourceDirs: ['src/main'],
    sourceExtensions: ['.java', '.kt'],
    ciSetup: [
      '      - uses: actions/setup-java@v4',
      '        with:',
      "          distribution: 'temurin'",
      "          java-version: '21'",
    ].join('\n'),
  },
  dotnet: {
    label: '.NET / C#',
    installCommand: "dotnet restore",
    runCommand: "dotnet run",
    toolCheck: "dotnet --version",
    testCommand: 'dotnet test',
    lintCommand: 'dotnet format --verify-no-changes',
    buildCommand: 'dotnet build --configuration Release',
    sourceDirs: ['src'],
    sourceExtensions: ['.cs'],
    ciSetup: [
      '      - uses: actions/setup-dotnet@v4',
      '        with:',
      "          dotnet-version: '8.0.x'",
    ].join('\n'),
  },
  other: {
    label: 'Something else',
    installCommand: "",
    runCommand: "",
    toolCheck: "",
    testCommand: '',
    lintCommand: '',
    buildCommand: '',
    sourceDirs: ['src'],
    sourceExtensions: [],
    // Left empty on purpose. A CI file that pretends to set up a toolchain it knows nothing about
    // is worse than one that says plainly that a human has to fill this in.
    ciSetup: '      # TODO(setup): install the toolchain this project needs.',
  },
};

/** Marker files, in the order they should win when a repository contains several. */
const MARKERS = [
  ['go.mod', 'go'],
  ['Cargo.toml', 'rust'],
  ['pyproject.toml', 'python'],
  ['requirements.txt', 'python'],
  ['setup.py', 'python'],
  ['build.gradle', 'java'],
  ['build.gradle.kts', 'java'],
  ['pom.xml', 'java'],
  ['package.json', 'node'],
];

/** Directories that never contain the manifest we are looking for. */
const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.venv', 'venv', '__pycache__', 'dist', 'build',
  'target', 'vendor', '.next', '.cache', 'coverage', '.idea', '.gradle',
  'starter-kit', 'docs', 'examples', 'example', 'samples', 'test', 'tests',
]);

/** .NET has no single fixed filename, so it is found by extension rather than by marker. */
function hasDotnetProject(dir) {
  try {
    return readdirSync(dir).some((e) => e.endsWith('.csproj') || e.endsWith('.sln'));
  } catch {
    return false; // unreadable directory — treat as no match and let the user say
  }
}

/**
 * Find the manifest that identifies this project's stack.
 *
 * The root wins outright when it has one. Failing that, one level of subdirectories is searched,
 * because the layout where all the code lives in `app/`, `client/`, `service/` or similar is
 * extremely common and a root-only search reports such a repository as having no stack and no
 * source files at all — which is not a courteous default, it is a wrong one that then flows into
 * the readiness verdict.
 *
 * Only one level, deliberately. Deeper than that and the "project" being described is more likely a
 * workspace of several, which is a different question than this wizard asks.
 *
 * @returns {{ stack: string, dir: string }} `dir` is relative to target, '' when it is the root.
 */
function findManifest(target) {
  for (const [marker, name] of MARKERS) {
    if (existsSync(join(target, marker))) return { stack: name, dir: '' };
  }
  if (hasDotnetProject(target)) return { stack: 'dotnet', dir: '' };

  let entries = [];
  try {
    entries = readdirSync(target, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name) && !e.name.startsWith('.'));
  } catch { /* unreadable — fall through to `other` */ }

  // Marker order decides ties, so a directory holding both go.mod and package.json reads as Go for
  // the same reason the root search does.
  let best = null;
  for (const entry of entries) {
    const dir = join(target, entry.name);
    MARKERS.forEach(([marker, name], rank) => {
      if (existsSync(join(dir, marker)) && (!best || rank < best.rank)) {
        best = { stack: name, dir: entry.name, rank };
      }
    });
    if (!best && hasDotnetProject(dir)) best = { stack: 'dotnet', dir: entry.name, rank: MARKERS.length };
  }

  return best ? { stack: best.stack, dir: best.dir } : { stack: 'other', dir: '' };
}

/**
 * The CI setup block, pointed at the directory the manifest actually lives in.
 *
 * Only the stacks whose setup block installs something need adjusting; the rest are toolchain
 * actions that do not care where they run. Getting this wrong is not subtle — `npm ci` in a
 * directory with no `package.json` fails the pipeline on its first execution, and a dependency
 * cache keyed on a lockfile path that does not exist silently never hits.
 */
function ciSetupFor(stack, workdir) {
  if (!workdir) return STACKS[stack].ciSetup;

  if (stack === 'node') {
    return [
      '      - uses: actions/setup-node@v4',
      '        with:',
      "          node-version: '22'",
      "          cache: 'npm'",
      `          cache-dependency-path: ${workdir}/package-lock.json`,
      '',
      '      - name: Install',
      `        run: cd ${workdir} && npm ci`,
    ].join('\n');
  }

  if (stack === 'python') {
    return [
      '      - uses: actions/setup-python@v5',
      '        with:',
      "          python-version: '3.12'",
      '',
      '      - name: Install',
      '        run: |',
      `          cd ${workdir}`,
      '          python -m pip install --upgrade pip',
      '          pip install -e ".[dev]" || pip install -r requirements.txt',
    ].join('\n');
  }

  return STACKS[stack].ciSetup;
}

/**
 * Whether `target` is inside a git working tree — not whether it *is* the root of one.
 *
 * `existsSync(target/.git)` answers the second question, and answering it in place of the first
 * reports a subdirectory of a busy repository as having no history at all, which then reads as a
 * brand-new project in the assessment.
 */
export function isInsideGitRepo(target) {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd: target, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch {
    return false; // not a repo, or no git binary on PATH
  }
}

/**
 * @param {string} target absolute path to the project being set up
 */
export function detect(target) {
  const { stack, dir: manifestDir } = findManifest(target);
  const manifestRoot = manifestDir ? join(target, manifestDir) : target;

  let name = manifestDir || basename(target);
  let description = '';

  if (stack === 'node' && existsSync(join(manifestRoot, 'package.json'))) {
    try {
      const manifest = JSON.parse(readFileSync(join(manifestRoot, 'package.json'), 'utf8'));
      if (manifest.name) name = manifest.name;
      if (manifest.description) description = manifest.description;
    } catch { /* a malformed manifest is not this tool's problem to report */ }
  }

  const isGitRepo = isInsideGitRepo(target);
  const hasGithub = existsSync(join(target, '.github'));

  // Every command has to run where the manifest is, not where the wizard was pointed. Without this
  // the generated dev script and CI job run `npm install` in a directory that has no package.json.
  const inWorkdir = (command) =>
    command && manifestDir ? `cd ${manifestDir} && ${command}` : command;

  // The set of source directories that actually exist, so generated config points at real paths.
  const candidateDirs = STACKS[stack].sourceDirs.map((dir) =>
    manifestDir ? (dir === '.' ? manifestDir : `${manifestDir}/${dir}`) : dir,
  );
  const sourceDirs = candidateDirs.filter((dir) => dir === '.' || existsSync(join(target, dir)));

  return {
    stack,
    ...STACKS[stack],
    ciSetup: ciSetupFor(stack, manifestDir),
    installCommand: inWorkdir(STACKS[stack].installCommand),
    runCommand: inWorkdir(STACKS[stack].runCommand),
    testCommand: inWorkdir(STACKS[stack].testCommand),
    lintCommand: inWorkdir(STACKS[stack].lintCommand),
    buildCommand: inWorkdir(STACKS[stack].buildCommand),
    sourceDirs: sourceDirs.length ? sourceDirs : candidateDirs,
    workdir: manifestDir,
    name,
    description,
    isGitRepo,
    hasGithub,
  };
}

export function stackOptions() {
  return Object.entries(STACKS).map(([value, meta]) => ({ value, label: meta.label }));
}

export function stackInfo(stack) {
  return STACKS[stack] ?? STACKS.other;
}
