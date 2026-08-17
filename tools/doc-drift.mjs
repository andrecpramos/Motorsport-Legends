#!/usr/bin/env node
/**
 * Documentation drift detection.
 *
 *   node tools/doc-drift.mjs
 *
 * Documentation drift is the gap between what the docs claim and what the code does. It is
 * invisible — nothing fails, nothing goes red — and it compounds until the docs are actively
 * misleading, at which point people stop reading them, at which point writing them was wasted.
 *
 * The insight that makes this tractable: MOST DRIFT IS MECHANICALLY DETECTABLE. A link to a file
 * that no longer exists, a placeholder nobody came back to, a reference to a function that was
 * deleted — none of that needs a language model. It needs a script that runs in CI.
 *
 * Reserve AI for the part that genuinely requires reading: "does this paragraph still describe
 * what this function does?" Run the cheap check first so the expensive one has less to look at.
 *
 * Configuration comes from .sdlc-kit.json. No dependencies, deliberately.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';

const REPO = process.cwd();

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// --- configuration -----------------------------------------------------------------------------

let config = {};
try {
  config = JSON.parse(readFileSync(join(REPO, '.sdlc-kit.json'), 'utf8'));
} catch {
  // Running without the state file is fine — the link check, which is the one that earns this
  // script, needs no configuration at all.
}

const sourceDirs = config.project?.sourceDirs ?? ['src'];
const sourceExtensions = config.project?.sourceExtensions ?? ['.js', '.mjs', '.ts', '.py', '.go'];

const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.venv', 'venv', '__pycache__', 'dist', 'build',
  'target', 'vendor', '.next', '.cache', 'coverage', '.vscode', '.idea',
  // The setup kit itself, when it was copied in — which is the documented way to use it. Its
  // templates are unrendered sources, not documentation: their links are relative to where each
  // file will eventually be written rather than to where it currently sits, and they still contain
  // {{placeholders}} by definition. Scanning them reports every one of those as a broken link and
  // an unfilled marker, which is precisely the false-positive flood this check must not produce —
  // a check that fails a fresh setup on its own scaffolding is one nobody keeps enabled.
  'starter-kit',
]);

function walk(dir, out = []) {
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
      if (statSync(full).isDirectory()) walk(full, out);
      else out.push(full);
    } catch { /* symlink to nowhere, permission denied — not this script's problem */ }
  }
  return out;
}

const allFiles = walk(REPO);
const markdown = allFiles.filter((f) => f.endsWith('.md'));
const rel = (f) => relative(REPO, f).split(sep).join('/');

const findings = [];
const add = (severity, file, title, detail) => findings.push({ severity, file, title, detail });

// --- Check 1: relative links that point at nothing ----------------------------------------------
//
// The most common drift by a wide margin, and it appears the instant a file is renamed. In a repo
// where documents cross-reference each other — and a generated foundation cross-references heavily
// on purpose — this is the check that earns the script on its own.

const LINK = /\[([^\]]*)\]\(([^)]+)\)/g;
let linksChecked = 0;

for (const file of markdown) {
  const content = readFileSync(file, 'utf8');
  const base = dirname(file);

  for (const [, text, href] of content.matchAll(LINK)) {
    if (/^(https?:|mailto:|#|<)/.test(href)) continue;
    linksChecked += 1;

    const target = resolve(base, href.split('#')[0]);
    if (!existsSync(target)) {
      add(
        'high',
        rel(file),
        `Broken link: [${text}](${href})`,
        'The target does not exist. Renamed or moved without updating the reference.',
      );
    }
  }
}

// --- Check 2: placeholders nobody came back to --------------------------------------------------
//
// Specific to a generated foundation, and the highest-value check in the first month of a project.
// A scaffolded document that still says TODO(setup) where a real decision belongs is worse than an
// empty file, because it looks like the decision was made.

const PLACEHOLDER = /TODO\(setup\)|\{\{[\w.]+\}\}/g;

for (const file of markdown) {
  const lines = readFileSync(file, 'utf8').split('\n');
  const hits = [];

  lines.forEach((line, index) => {
    // A line explaining the convention is not itself a placeholder. Without these two exclusions
    // the documents that describe the marker report themselves — a self-reference bug that only
    // appears once the tool is run against a repository that documents it.
    //
    // Precision matters more than recall here for the reason in docs/review/review-checklist.md:
    // a check with false positives gets ignored, then disabled, and its true positives go with it.
    if (/^\s*(<!--|#|\/\/|\*)/.test(line)) return;
    const withoutCodeSpans = line.replace(/`[^`]*`/g, '');

    for (const match of withoutCodeSpans.matchAll(PLACEHOLDER)) {
      hits.push({ line: index + 1, text: match[0] });
    }
  });

  if (hits.length) {
    add(
      'medium',
      rel(file),
      `${hits.length} unfilled placeholder${hits.length === 1 ? '' : 's'}`,
      `Line${hits.length === 1 ? '' : 's'} ${hits.slice(0, 6).map((h) => h.line).join(', ')}${hits.length > 6 ? ', …' : ''} — a decision the setup wizard could not make for you.`,
    );
  }
}

// --- Check 3: documented identifiers that no longer exist ---------------------------------------
//
// Catches the case where a function is deleted or renamed while the prose keeps describing it.
//
// Advisory only, always. Architecture documents legitimately describe INTENDED interfaces that no
// module exports yet, and prose legitimately discusses deleted things in the past tense. Neither is
// drift. This check produces a list for a human to glance at, never a build failure.

const sourceFiles = allFiles.filter((file) => {
  const path = rel(file);
  const inSource = sourceDirs.some((dir) => dir === '.' || path.startsWith(`${dir}/`));
  return inSource && sourceExtensions.some((extension) => path.endsWith(extension));
});

const declared = new Set();
const DECLARATION = /(?:^|\s)(?:export\s+)?(?:async\s+)?(?:function|def|func|const|class|fn)\s+(\w+)/gm;
for (const file of sourceFiles) {
  for (const [, name] of readFileSync(file, 'utf8').matchAll(DECLARATION)) declared.add(name);
}

const CALL = /`(\w+)\(\)`/g;
const KNOWN_EXTERNAL = new Set(['require', 'describe', 'it', 'test', 'expect', 'fetch', 'console', 'print']);

if (sourceFiles.length > 0) {
  for (const file of markdown) {
    const content = readFileSync(file, 'utf8');
    const discussesRemoval = /\b(deleted|removed|no longer|dead code|superseded)\b/i.test(content);

    for (const [, name] of content.matchAll(CALL)) {
      if (KNOWN_EXTERNAL.has(name) || declared.has(name)) continue;
      if (!/^[a-z][a-zA-Z0-9_]+$/.test(name)) continue;

      add(
        'low',
        rel(file),
        `References \`${name}()\`, which is not declared in the source tree`,
        discussesRemoval
          ? 'This document discusses removals, so it may be an intentional historical reference.'
          : 'Either it was renamed or deleted, or the documentation describes something that never existed.',
      );
    }
  }
}

// --- Report --------------------------------------------------------------------------------------

console.log(c.bold('\n  Documentation drift check\n'));
console.log(
  c.dim(
    `  ${markdown.length} markdown files · ${linksChecked} internal links · ` +
      `${sourceFiles.length} source files · ${declared.size} declared symbols\n`,
  ),
);

if (findings.length === 0) {
  console.log(c.green('  ✓ No drift detected.\n'));
} else {
  const order = { high: 0, medium: 1, low: 2 };
  const colour = { high: c.red, medium: c.yellow, low: c.dim };

  for (const finding of findings.sort((a, b) => order[a.severity] - order[b.severity])) {
    console.log(`  ${colour[finding.severity](finding.severity.toUpperCase().padEnd(6))} ${c.bold(finding.file)}`);
    console.log(`         ${finding.title}`);
    console.log(c.dim(`         ${finding.detail}\n`));
  }

  const high = findings.filter((f) => f.severity === 'high').length;
  console.log(c.bold(`  ${findings.length} finding(s) — ${high} high\n`));
}

console.log(
  c.dim(
    '  What this check deliberately does NOT do: judge whether prose still describes behaviour\n' +
      '  correctly. That needs a reader. Run the cheap mechanical check first so the expensive\n' +
      '  semantic review has less to look at.\n',
  ),
);

// Exit non-zero only on high findings — broken links are facts, everything else is a judgment call,
// and a check that fails the build on judgment calls gets disabled within a month.
process.exit(findings.some((f) => f.severity === 'high') ? 1 : 0);
