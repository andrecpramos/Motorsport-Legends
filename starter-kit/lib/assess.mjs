/**
 * Project assessment: what is already here, what is missing, and what that means.
 *
 * This runs before the first question, and it exists because of the Phase 0 argument. AI adoption
 * raises throughput and lowers delivery stability at the same time, and the mechanism is volume —
 * code gets generated faster than review, testing and deployment can absorb it. Which means the
 * useful question about a repository is not "does it have AI tooling configured", it is
 * **"can this project absorb more code than it is currently producing?"**
 *
 * So the checks below are organised around absorptive capacity rather than around a feature list.
 * A project with no tests and no pipeline does not need a better instruction file first; it needs
 * somewhere for the extra output to land. Saying that plainly, before the wizard starts writing
 * documents, is the most useful thing this kit can do.
 *
 * Everything here is read-only and heuristic. It reports what it can see, and says so where it
 * cannot see — a check that quietly assumes absence is worse than one that admits uncertainty.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, extname } from 'node:path';

import { isInsideGitRepo } from './detect.mjs';

/** The five capacities a project needs before extra generated code is an asset rather than debt. */
export const DIMENSIONS = {
  verification: 'Verification capacity',
  context: 'Agent context',
  review: 'Review and traceability',
  security: 'Security posture',
  operability: 'Operability',
};

const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.venv', 'venv', '__pycache__', 'dist', 'build',
  'target', 'vendor', '.next', '.cache', 'coverage', '.idea', '.gradle',
]);

/** Walk the tree, bounded, so assessing a huge repository does not take longer than the wizard. */
function walk(dir, out = [], depth = 0) {
  if (depth > 8 || out.length > 20000) return out;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    try {
      if (statSync(full).isDirectory()) walk(full, out, depth + 1);
      else out.push(full);
    } catch { /* unreadable — skip */ }
  }
  return out;
}

const TEST_HINT = /(^|[\\/.])(test|tests|spec|specs|__tests__)([\\/.]|$)/i;

/** "1 test file", "3 test files". The report is prose and `(s)` reads like a form. */
const plural = (count, singular, pluralForm = `${singular}s`) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

export function assess(target, detected) {
  const files = walk(target);
  const relative = files.map((f) => f.slice(target.length + 1).split('\\').join('/'));

  const has = (path) => existsSync(join(target, path));
  const anyMatching = (predicate) => relative.some(predicate);

  // --- raw observations -------------------------------------------------------------------------

  const testFiles = relative.filter((p) => TEST_HINT.test(p) && detected.sourceExtensions.some((e) => p.endsWith(e)));
  const sourceFiles = relative.filter(
    (p) => detected.sourceExtensions.some((e) => p.endsWith(e)) && !TEST_HINT.test(p),
  );

  const byExtension = {};
  for (const path of relative) {
    const extension = extname(path);
    if (extension) byExtension[extension] = (byExtension[extension] ?? 0) + 1;
  }

  const workflows = relative.filter((p) => p.startsWith('.github/workflows/') || p === '.gitlab-ci.yml');
  // Asked of git rather than of the filesystem: `.git` only exists at the root of a working tree,
  // so testing for it reports every subdirectory of a busy repository as having no history.
  const hasGit = isInsideGitRepo(target);

  let commits = 0;
  let contributors = 0;
  let firstCommit = null;
  if (hasGit) {
    try {
      const log = execFileSync('git', ['log', '--format=%an|%aI'], {
        cwd: target, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      const lines = log ? log.split('\n') : [];
      commits = lines.length;
      contributors = new Set(lines.map((l) => l.split('|')[0])).size;
      firstCommit = lines.length ? lines[lines.length - 1].split('|')[1]?.slice(0, 10) : null;
    } catch { /* shallow clone, no history, or no git binary */ }
  }

  const gitignore = has('.gitignore') ? readFileSync(join(target, '.gitignore'), 'utf8') : '';
  const committedEnv = relative.filter((p) => /(^|\/)\.env(\.|$)/.test(p) && !p.includes('.example'));
  const keyMaterial = relative.filter((p) => /\.(pem|key|p12|pfx|jks)$/.test(p));

  const readme = relative.find((p) => /^readme(\.md|\.rst|\.txt)?$/i.test(p));
  const readmeLines = readme ? readFileSync(join(target, readme), 'utf8').split('\n').length : 0;

  // --- checks -------------------------------------------------------------------------------------

  /** @type {Array<{ dimension: string, title: string, status: string, severity: string, finding: string, action: string }>} */
  const checks = [];
  const check = (dimension, title, present, finding, action, severity = 'gap') =>
    checks.push({
      dimension: DIMENSIONS[dimension],
      dimensionKey: dimension,
      title,
      status: present ? 'present' : 'absent',
      present,
      severity: present ? 'ok' : severity,
      finding,
      action,
    });

  // Verification capacity — the one that decides whether AI helps or hurts.
  check(
    'verification',
    'Automated tests',
    testFiles.length > 0,
    testFiles.length > 0
      ? `${plural(testFiles.length, 'test file')} against ${plural(sourceFiles.length, 'source file')}.`
      : 'No test files found. This is the single most important gap on this list.',
    testFiles.length > 0
      ? 'Phase 5 documents what those tests must assert to be worth anything.'
      : 'Write tests before enabling AI broadly. Generated code without tests is unverified volume, which is exactly the failure mode DORA measures as instability.',
    'critical',
  );

  check(
    'verification',
    'Continuous integration',
    workflows.length > 0,
    workflows.length > 0
      ? `${plural(workflows.length, 'pipeline file')}: ${workflows.join(', ')}.`
      : 'No CI pipeline found. Nothing runs automatically when a change arrives.',
    workflows.length > 0
      ? 'Phase 7 will add the checks this kit installs to it, or write a new one alongside.'
      : 'Phase 7 writes one. A pipeline is the absorptive capacity — without it, faster authoring just makes a longer queue of unverified changes.',
    'critical',
  );

  check(
    'verification',
    'Declared test command',
    Boolean(detected.testCommand),
    detected.testCommand
      ? `Detected \`${detected.testCommand}\` from the ${detected.label} conventions.`
      : 'The stack has no conventional test command, so nothing can run the suite without being told how.',
    'Phase 5 asks you to confirm it. It ends up in AGENTS.md and in the dev script, so both a human and an agent can run it without guessing.',
  );

  // Agent context.
  const contextFiles = ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md', '.cursor/rules']
    .filter((p) => has(p));
  check(
    'context',
    'Agent instruction file',
    contextFiles.length > 0,
    contextFiles.length > 0
      ? `Found: ${contextFiles.join(', ')}.`
      : 'No AGENTS.md or equivalent. Every assistant working here starts with no project knowledge and infers your conventions from the code, which is how "correct in general, wrong here" gets committed.',
    contextFiles.length > 0
      ? 'Phase 3 will not overwrite it — the generated version is written alongside for you to merge.'
      : 'Phase 3 writes one. This is the highest ratio of impact to effort in the whole kit.',
    'high',
  );

  check(
    'context',
    'Recorded decisions (ADRs)',
    has('docs/adr') || has('adr') || has('doc/adr'),
    has('docs/adr') || has('adr') || has('doc/adr')
      ? 'A decision log exists.'
      : 'No decision log. Constraints live in people\'s heads, which means an assistant cannot see them and will re-propose rejected designs indefinitely.',
    'Phase 2 creates the log and seeds it with your invariants.',
    'high',
  );

  check(
    'context',
    'Subagent definitions',
    has('.claude/agents'),
    has('.claude/agents')
      ? 'A subagent roster exists.'
      : 'No subagent definitions. Every review, audit and triage starts from a blank prompt written from memory, so the quality of the work depends on who is asking and how tired they are.',
    'Phase 3 installs a roster carrying the lessons from each lifecycle phase.',
  );

  // Review and traceability.
  check(
    'review',
    'Pull request template',
    has('.github/PULL_REQUEST_TEMPLATE.md') || has('.github/pull_request_template.md'),
    has('.github/PULL_REQUEST_TEMPLATE.md') || has('.github/pull_request_template.md')
      ? 'A pull request template exists.'
      : 'No pull request template. Nothing prompts an author to say what they verified or which issue a change implements.',
    'Phase 4 writes one, deliberately short — a template long enough to be annoying gets filled with "n/a".',
  );

  check(
    'review',
    'Ownership rules',
    has('.github/CODEOWNERS') || has('CODEOWNERS') || has('docs/CODEOWNERS'),
    has('.github/CODEOWNERS') || has('CODEOWNERS')
      ? 'CODEOWNERS is present.'
      : 'No CODEOWNERS. Nothing routes changes in sensitive areas to the people who understand them.',
    'Not written by this kit — it needs real usernames. Worth adding by hand for the hot paths you name in Phase 7.',
    'low',
  );

  check(
    'review',
    'Meaningful history',
    commits >= 10,
    hasGit
      ? `${plural(commits, 'commit')} from ${plural(contributors, 'contributor')}${firstCommit ? `, starting ${firstCommit}` : ''}.`
      : 'Not a git repository, so change history, review and the release risk scorer have nothing to work with.',
    hasGit
      ? 'The release risk scorer in Phase 7 reads this history.'
      : 'Run `git init` before the rest of this is worth much.',
    hasGit ? 'low' : 'high',
  );

  // Security posture.
  check(
    'security',
    'No committed secrets',
    committedEnv.length === 0 && keyMaterial.length === 0,
    committedEnv.length || keyMaterial.length
      ? `Found ${[...committedEnv, ...keyMaterial].slice(0, 5).join(', ')}. Treat as leaked and rotate — assessing reachability costs more than rotating a key.`
      : 'No .env files or key material found in the tree.',
    committedEnv.length || keyMaterial.length
      ? 'Rotate, then remove from history. Phase 6 adds a scan so the next one fails the build.'
      : 'Phase 6 adds a scan to keep it that way.',
    'critical',
  );

  check(
    'security',
    'Secrets excluded from version control',
    /(^|\n)\s*\.env/.test(gitignore),
    has('.gitignore')
      ? (/(^|\n)\s*\.env/.test(gitignore)
          ? '.gitignore covers .env files.'
          : '.gitignore exists but does not mention .env. The first developer to create one will commit it.')
      : 'No .gitignore at all.',
    'Phase 6 records the exclusion list, and it is worth adding those patterns to .gitignore by hand as well.',
    'high',
  );

  check(
    'security',
    'Dependency lockfile',
    anyMatching((p) => /(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|Cargo\.lock|go\.sum|Gemfile\.lock)$/.test(p)),
    anyMatching((p) => /(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|poetry\.lock|Cargo\.lock|go\.sum|Gemfile\.lock)$/.test(p))
      ? 'A lockfile is present, so dependency versions are pinned.'
      : 'No lockfile. Builds are not reproducible, and a suggested-but-wrong package name can resolve to something real.',
    'Phase 6 covers the dependency policy; the lockfile itself is a hot path in the risk scorer.',
    'high',
  );

  // Operability.
  check(
    'operability',
    'A way to run it locally',
    has('dev.bat') || has('dev.sh') || has('Makefile') || has('Taskfile.yml') || has('docker-compose.yml'),
    has('dev.bat') || has('dev.sh') || has('Makefile') || has('docker-compose.yml')
      ? 'A local entry point exists.'
      : 'No single entry point for running this locally. Every new contributor — and every agent — reconstructs the commands from the README or from guesswork.',
    'Phase 3 generates a dev script covering setup, check and run, and points AGENTS.md at it.',
    'high',
  );

  check(
    'operability',
    'README',
    Boolean(readme) && readmeLines > 15,
    readme
      ? `${readme}, ${readmeLines} lines.${readmeLines <= 15 ? ' Short enough that it probably does not explain how to run or test this.' : ''}`
      : 'No README.',
    'Phase 9 maps documentation by what a reader is doing, and the drift check keeps its links honest.',
    'low',
  );

  check(
    'operability',
    'Runbook or operational docs',
    has('docs/ops') || has('RUNBOOK.md') || has('docs/runbook.md'),
    has('docs/ops') || has('RUNBOOK.md')
      ? 'Operational documentation exists.'
      : 'No runbook. The rollback procedure, if there is one, exists only in somebody\'s memory — and it will be needed at the hour that memory is least reliable.',
    'Phase 8 writes one, including the prompt to actually exercise the rollback path.',
  );

  // --- verdict ---------------------------------------------------------------------------------

  const critical = checks.filter((c) => c.severity === 'critical').length;
  const high = checks.filter((c) => c.severity === 'high').length;
  const present = checks.filter((c) => c.present).length;

  const hasTests = testFiles.length > 0;
  const hasCi = workflows.length > 0;

  let readiness;
  let verdict;

  if (!hasTests && !hasCi) {
    readiness = 'Not ready';
    verdict =
      'This project has neither automated tests nor a pipeline, which means there is nothing downstream to absorb additional generated code. Adding AI assistance here will raise authoring speed into a system with no verification capacity, and the result shows up as delivery instability rather than as delivery. Build the verification half first — this kit will write the scaffolding for it, but the tests themselves are yours.';
  } else if (!hasTests) {
    readiness = 'Fragile';
    verdict =
      'There is a pipeline but no test suite, so the pipeline is checking that the code builds rather than that it works. That is the gap AI-generated code exploits most reliably, because generated code compiles far more often than it is correct.';
  } else if (!hasCi) {
    readiness = 'Fragile';
    verdict =
      'There are tests but nothing runs them automatically, which makes their value dependent on somebody remembering. Phase 7 fixes this, and it is the cheapest large improvement available to this project.';
  } else if (critical + high <= 2) {
    readiness = 'Ready';
    verdict =
      'The verification capacity is in place: tests exist and something runs them. This project can absorb AI-assisted authoring, and the work now is context and review quality rather than foundations.';
  } else {
    readiness = 'Workable';
    verdict =
      'The essentials are present — tests and a pipeline — with real gaps around them. AI assistance is reasonable here, and the gaps below are worth closing in the order listed rather than all at once.';
  }

  return {
    readiness,
    verdict,
    checks,
    counts: {
      summary:
        `${present} of ${checks.length} checks satisfied. ` +
        (critical + high === 0
          ? 'No critical or high gaps.'
          : `${plural(critical, 'critical gap')}, ${high} high.`),
      total: checks.length,
      present,
      absent: checks.length - present,
      critical,
      high,
    },
    facts: {
      files: relative.length,
      sourceFiles: sourceFiles.length,
      testFiles: testFiles.length,
      testRatio: sourceFiles.length ? (testFiles.length / sourceFiles.length).toFixed(2) : '0.00',
      workflows: workflows.length,
      commits,
      contributors,
      firstCommit,
      topExtensions: Object.entries(byExtension)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([extension, count]) => ({ extension, count })),
    },
  };
}
