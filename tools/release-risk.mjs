#!/usr/bin/env node
/**
 * Release risk scoring from the diff.
 *
 *   node tools/release-risk.mjs                  working tree vs HEAD
 *   node tools/release-risk.mjs HEAD~5           a range ending at HEAD
 *   node tools/release-risk.mjs main..HEAD       an explicit range
 *
 * WHY THIS IS DETERMINISTIC AND NOT AN LLM CALL: risk scoring has to be reproducible, explainable
 * to an auditor, and identical on every run for the same diff. A model asked "how risky is this
 * release?" gives a different answer each time and cannot justify it in a way a change advisory
 * board accepts.
 *
 * The scorer is the deterministic part. The right place for AI is the layer above — explaining WHY
 * a flagged file is risky, drafting the release note, and triaging the failure when the pipeline
 * goes red. Knowing which half is which is most of the skill.
 *
 * The hot-path table lives in .sdlc-kit.json. UPDATE IT AFTER EVERY POSTMORTEM: it should be
 * derived from where incidents actually came from, not from intuition about where they might.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = process.cwd();

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

const git = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

// --- configuration -------------------------------------------------------------------------------

let config = {};
try {
  config = JSON.parse(readFileSync(join(REPO, '.sdlc-kit.json'), 'utf8'));
} catch {
  console.log(c.yellow('\n  No .sdlc-kit.json found — scoring with structural rules only.\n'));
}

/** @type {Array<{ pattern: string, weight: number, why: string }>} */
const hotPaths = (config.answers?.hotPaths ?? []).map((entry) => ({
  ...entry,
  regex: new RegExp(entry.pattern),
}));

const sourceDirs = config.project?.sourceDirs ?? ['src'];
const isSource = (path) => sourceDirs.some((dir) => (dir === '.' ? true : path.startsWith(`${dir}/`)));
const isTest = (path) => /(^|\/)(tests?|spec|__tests__)\//.test(path) || /\.(test|spec)\.[\w]+$/.test(path);

// --- gather ---------------------------------------------------------------------------------------

const arg = process.argv[2];
let range = null;
let label;

try {
  if (arg) {
    range = arg.includes('..') ? arg : `${arg}..HEAD`;
    label = range;
  } else {
    const dirty = git(['status', '--porcelain']);
    if (dirty) {
      label = 'working tree vs HEAD (uncommitted)';
    } else {
      range = 'HEAD~1..HEAD';
      label = range;
    }
  }
} catch {
  label = 'working tree vs HEAD';
}

let numstat = '';
try {
  numstat = range ? git(['diff', '--numstat', range]) : git(['diff', '--numstat', 'HEAD']);
} catch {
  // A single-commit repository has no HEAD~1. Fall back to the initial commit's contents.
  range = null;
  label = 'initial commit';
  try {
    numstat = git(['show', '--numstat', '--format=', 'HEAD']);
  } catch {
    console.log(c.dim('\n  No git history to score.\n'));
    process.exit(0);
  }
}

const files = numstat
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [added, removed, path] = line.split('\t');
    return {
      path,
      added: added === '-' ? 0 : Number(added),
      removed: removed === '-' ? 0 : Number(removed),
    };
  });

// Untracked files are part of the change even though `git diff` cannot see them. Omitting them
// would systematically under-score exactly the releases that add new modules.
if (!range) {
  try {
    const untracked = git(['ls-files', '--others', '--exclude-standard']);
    for (const path of untracked.split('\n').filter(Boolean)) {
      let added = 0;
      try {
        added = readFileSync(path, 'utf8').split('\n').length;
      } catch { /* binary or unreadable */ }
      files.push({ path, added, removed: 0 });
    }
  } catch { /* not a git repository */ }
}

if (files.length === 0) {
  console.log(c.dim('\n  No changes to score. Commit something, or pass a range.\n'));
  process.exit(0);
}

let commits = 0;
let authors = new Set();
try {
  if (range) {
    const log = git(['log', '--format=%an', range]);
    commits = log ? log.split('\n').length : 0;
    authors = new Set(log ? log.split('\n') : []);
  }
} catch { /* single commit repo */ }

// --- score ------------------------------------------------------------------------------------------

const findings = [];
let score = 0;

const totalLines = files.reduce((sum, f) => sum + f.added + f.removed, 0);
const sourceFiles = files.filter((f) => isSource(f.path) && !isTest(f.path));
const testFiles = files.filter((f) => isTest(f.path));
const sourceLines = sourceFiles.reduce((sum, f) => sum + f.added + f.removed, 0);
const testLines = testFiles.reduce((sum, f) => sum + f.added + f.removed, 0);

// 1. Hot paths — files whose blast radius exceeds their line count.
for (const file of files) {
  const hot = hotPaths.find((entry) => entry.regex.test(file.path));
  if (hot) {
    score += hot.weight;
    findings.push({
      severity: hot.weight >= 20 ? 'high' : 'medium',
      points: hot.weight,
      title: `Touches ${file.path}`,
      detail: hot.why,
    });
  }
}

// 2. Batch size. AI's stability cost is partly a batch-size problem, and batch size is the
//    cheapest thing on this list to both measure and control.
if (totalLines > 800) {
  score += 20;
  findings.push({
    severity: 'high',
    points: 20,
    title: `Large batch — ${totalLines} lines across ${files.length} files`,
    detail: 'Large diffs are reviewed less carefully per line and are harder to bisect when they break. Split it.',
  });
} else if (totalLines > 300) {
  score += 10;
  findings.push({
    severity: 'medium',
    points: 10,
    title: `Moderate batch — ${totalLines} lines across ${files.length} files`,
    detail: 'Above the size where review quality starts to degrade.',
  });
}

// 3. Test-to-source ratio.
if (sourceLines > 40 && testLines === 0) {
  score += 25;
  findings.push({
    severity: 'high',
    points: 25,
    title: `${sourceLines} lines of source changed with no test changes`,
    detail: 'Either the change is untested, or existing tests do not constrain it. Both are release risks.',
  });
} else if (sourceLines > 0 && testLines / sourceLines < 0.4) {
  score += 8;
  findings.push({
    severity: 'medium',
    points: 8,
    title: `Low test-to-source ratio (${testLines}:${sourceLines})`,
    detail: 'Below the ratio a change of this size normally warrants.',
  });
}

// 4. Deletions outnumbering additions in source — removed guards leave no signal in the diff for
//    review to reason about, which makes deletions the easiest defect class to miss.
const netRemoved = sourceFiles.reduce((sum, f) => sum + f.removed - f.added, 0);
if (netRemoved > 20) {
  score += 12;
  findings.push({
    severity: 'medium',
    points: 12,
    title: `Net ${netRemoved} lines removed from source`,
    detail: 'Confirm every removed guard was intentional. Deleted code leaves nothing for review to look at.',
  });
}

// 5. Timing. Recovery time is what suffers here, not failure rate.
const now = new Date();
const day = now.getDay();
const hour = now.getHours();
if (day === 5 && hour >= 15) {
  score += 15;
  findings.push({
    severity: 'high',
    points: 15,
    title: 'Friday afternoon deploy',
    detail: 'Nobody is around to notice or to fix it. Recovery time is the metric that suffers.',
  });
} else if (day === 0 || day === 6) {
  score += 10;
  findings.push({ severity: 'medium', points: 10, title: 'Weekend deploy', detail: 'Reduced on-call depth.' });
} else if (hour >= 18 || hour < 8) {
  score += 8;
  findings.push({
    severity: 'medium',
    points: 8,
    title: 'Outside business hours',
    detail: 'Slower detection and slower response.',
  });
}

// 6. Multi-author batches.
if (authors.size > 3) {
  score += 8;
  findings.push({
    severity: 'medium',
    points: 8,
    title: `${authors.size} authors in this range`,
    detail: 'No single person has the whole picture if it needs rolling back at 2am.',
  });
}

score = Math.min(100, score);

// --- report --------------------------------------------------------------------------------------------

const band =
  score >= 60 ? { name: 'HIGH', colour: c.red } :
  score >= 30 ? { name: 'MEDIUM', colour: c.yellow } :
  { name: 'LOW', colour: c.green };

console.log(c.bold(`\n  Release risk — ${label}\n`));
console.log(`  ${c.bold('Score:')} ${band.colour(`${score}/100  ${band.name}`)}`);
console.log(
  c.dim(
    `  ${files.length} files · +${files.reduce((s, f) => s + f.added, 0)} / ` +
      `-${files.reduce((s, f) => s + f.removed, 0)} lines` +
      `${commits ? ` · ${commits} commits · ${authors.size} author(s)` : ''}\n`,
  ),
);

if (findings.length === 0) {
  console.log(c.green('  No risk factors identified.\n'));
} else {
  const order = { high: 0, medium: 1, low: 2 };
  for (const finding of findings.sort((a, b) => order[a.severity] - order[b.severity])) {
    const mark = finding.severity === 'high' ? c.red('▲') : c.yellow('▲');
    console.log(`  ${mark} ${c.bold(finding.title)} ${c.dim(`+${finding.points}`)}`);
    console.log(`    ${c.dim(finding.detail)}\n`);
  }
}

const actions =
  score >= 60
    ? [
        'Deploy behind a feature flag, default off',
        'Canary to a small slice and hold before widening',
        'Named owner on standby through the rollout window',
        'Confirm the rollback path has been exercised, not just written down',
      ]
    : score >= 30
      ? [
          'Canary and hold for a meaningful observation window',
          'Watch the primary SLI dashboard through the rollout',
          'Confirm the rollback path',
        ]
      : ['Standard rolling deploy', 'Normal monitoring'];

console.log(c.bold('  Recommended:'));
for (const action of actions) console.log(`    · ${action}`);

console.log(
  c.dim(
    '\n  Deterministic by design: the same diff always scores the same, and every point is\n' +
      '  attributable to a named rule. That is what makes it usable as a gate and defensible to\n' +
      '  an auditor. Use AI for the layer above — explaining findings, drafting the release note,\n' +
      '  triaging the failure when it goes red.\n',
  ),
);

// Exits 0 always. This is an input to a human decision, not a verdict — a gate on a judgment call
// gets argued with, then bypassed, then removed, and it takes the other gates' credibility with it.
