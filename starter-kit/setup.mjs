#!/usr/bin/env node
/**
 * The AI-SDLC foundation wizard.
 *
 *   node starter-kit/setup.mjs                 set up the current directory
 *   node starter-kit/setup.mjs --target=../app  set up somewhere else
 *   node starter-kit/setup.mjs --dry-run        show the plan, write nothing
 *   node starter-kit/setup.mjs --yes            accept every default, no questions
 *   node starter-kit/setup.mjs --only=security  re-run one phase
 *
 * What it produces is a foundation, not a finished project: instruction files an agent will
 * actually read, an ADR log, a review checklist, a threat model, a pipeline, SLOs, and two
 * deterministic checks that run in CI. Everything it writes is meant to be edited afterwards.
 *
 * No dependencies, deliberately — the whole point is that this still runs in two years, on a
 * machine that has Node and nothing else, without an `npm install` that resolves differently
 * than it did today.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stdout } from 'node:process';

import { UI, colour as c } from './lib/ui.mjs';
import { Writer } from './lib/writer.mjs';
import { render } from './lib/render.mjs';
import { detect, stackInfo, stackOptions } from './lib/detect.mjs';
import { loadState, saveState, STATE_FILE } from './lib/state.mjs';
import { steps } from './lib/steps.mjs';
import { derive } from './lib/derive.mjs';
import { assess } from './lib/assess.mjs';

const KIT_ROOT = dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = join(KIT_ROOT, 'templates');

// --- arguments ---------------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const match = args.find((a) => a.startsWith(`--${name}=`));
  return match ? match.slice(name.length + 3) : null;
};

if (flag('help') || flag('h')) {
  stdout.write(readFileSync(join(KIT_ROOT, 'README.md'), 'utf8'));
  process.exit(0);
}

const targetArg = value('target') ?? '.';
const target = isAbsolute(targetArg) ? targetArg : resolve(process.cwd(), targetArg);
const dryRun = flag('dry-run');
const force = flag('force');
const only = value('only');
// `--interactive` forces the questions on even when stdin does not look like a terminal. Some
// terminal emulators and task runners report no TTY while stdin is perfectly readable, and it is
// also how the wizard gets driven by a script.
const interactive = !flag('yes') && (Boolean(process.stdin.isTTY) || flag('interactive'));

const ui = new UI({ interactive });

// --- guards ------------------------------------------------------------------------------------

if (!existsSync(target)) {
  ui.fail(`Target directory does not exist: ${target}`);
  process.exit(1);
}

const detected = detect(target);

// Running the wizard against the study repository that ships it would scaffold a foundation on top
// of the worked examples. That is almost never what someone means, so it takes an explicit answer.
//
// The test is deliberately narrow. `starter-kit/` being present cannot be the signal on its own —
// the documented way to use this kit is to copy that directory into your project, so the signal
// would fire on every correct use. What distinguishes the kit's own repository is that the kit is
// the only thing in it: no manifest, no source tree, nothing to set up. A project that has code is
// a project, whether or not it carries a copy of the kit.
const kitIsInTarget = existsSync(join(target, 'starter-kit', 'lib', 'steps.mjs'));
const targetHasProject = detected.stack !== 'other' || detected.sourceDirs.some(
  (dir) => dir !== '.' && existsSync(join(target, dir)),
);

// --dry-run writes nothing, so there is nothing to guard against — and the note below has always
// told people to reach for it.
if (kitIsInTarget && !targetHasProject && !dryRun && !flag('here')) {
  ui.blank();
  ui.warn('This looks like the repository that ships the kit, not a project to set up.');
  ui.note(
    'No manifest and no source tree were found here, only the kit itself. Use ' +
      '--target=../your-project to set up a real project, --dry-run to see what would be written, ' +
      'or --here if this genuinely is the project you mean.',
  );
  // Exiting 0 here made an aborted run indistinguishable from a successful one, which is a bad
  // thing for a script to do and a worse thing for a CI step to do.
  if (!interactive || !(await ui.confirm('Continue anyway?', false))) {
    ui.close();
    process.exit(1);
  }
}

// --- intro -------------------------------------------------------------------------------------

const state = loadState(target);

ui.blank();
stdout.write(
  '  ' + c.bold(c.cyan('AI in the SDLC')) + c.dim(' — project foundation setup') + '\n',
);
ui.blank();
ui.say(
  'This walks through ten phases of the software lifecycle and, at each one, asks the few questions ' +
    'no template can answer for you. At the end it writes a foundation: the instruction files that ' +
    'make AI assistants useful in this repository, the decision log that keeps them consistent, and ' +
    'the checks that catch what review will not.',
);
ui.say(
  'It is safe to re-run. Nothing you have edited is overwritten without being asked, and your ' +
    `answers are kept in ${STATE_FILE} so you can stop and come back.`,
);

if (state.corrupt) {
  ui.warn(`${STATE_FILE} could not be parsed, so previous answers were not restored.`);
}
if (state.completedPhases.length && interactive) {
  ui.note(`Resuming — ${state.completedPhases.length} of ${steps.length} phases already answered.`);
}
if (dryRun) ui.note('Dry run: the plan will be shown and nothing will be written.');
if (!interactive) ui.note('Non-interactive: every question takes its default.');

// --- project identity --------------------------------------------------------------------------

ui.heading('About this project');

const project = { ...detected, ...state.project };

project.name = await ui.ask('Project name', project.name);
project.description = await ui.ask(
  'One sentence: what does it do, and what breaks if it is wrong?',
  project.description || `TODO(setup): one sentence describing ${project.name}`,
);
project.stack = await ui.select('Primary stack', stackOptions(), project.stack);

// A command the user typed on a previous run is kept — but only while the stack is still the one
// they typed it for. Someone who switches this project from Node to Go and keeps being offered
// `npm test` would reasonably conclude the question does nothing.
const stack = stackInfo(project.stack);
const stackUnchanged = state.project?.stack === project.stack;
const remembered = stackUnchanged ? state.project : {};

// When the user confirms the stack that was detected, the *detected* commands win over the generic
// per-stack ones. They are the same commands with the project's working directory already applied,
// and dropping back to the generic form here is what would send `npm install` to a directory that
// has no package.json.
const suggested = project.stack === detected.stack ? detected : stack;

project.stackLabel = stack.label;
project.ciSetup = suggested.ciSetup;
project.workdir = project.stack === detected.stack ? detected.workdir : '';
project.testCommand = remembered.testCommand || suggested.testCommand;
project.lintCommand = remembered.lintCommand ?? suggested.lintCommand;
project.buildCommand = remembered.buildCommand ?? suggested.buildCommand;
project.installCommand = remembered.installCommand || suggested.installCommand;
project.runCommand = remembered.runCommand || suggested.runCommand;
project.toolCheck = stack.toolCheck;
project.sourceDirs = remembered.sourceDirs || (stackUnchanged ? detected.sourceDirs : suggested.sourceDirs);
project.sourceExtensions = stack.sourceExtensions;

// Assessed after the stack is settled, since which files count as source and test depends on it.
const assessment = assess(target, { ...detected, ...project });

const context = {
  project,
  assessment,
  answers: { ...state.answers },
  meta: {
    date: new Date().toISOString().slice(0, 10),
    year: String(new Date().getFullYear()),
  },
};

// --- the ten phases ------------------------------------------------------------------------------

const selected = only
  ? steps.filter((step) => step.id === only || String(step.num) === only)
  : steps;

if (only && selected.length === 0) {
  ui.fail(`No phase matches --only=${only}. Valid ids: ${steps.map((s) => s.id).join(', ')}`);
  ui.close();
  process.exit(1);
}

/** @type {Array<{ step: object, files: Array<{ template?: string, copy?: string, dest: string }> }>} */
const plan = [];

for (const step of selected) {
  ui.phase(step.num, step.title);
  for (const paragraph of step.why) ui.say(paragraph);

  await step.ask(context, ui);

  const files = step.plan(context);
  plan.push({ step, files });

  if (files.length) {
    ui.note('This phase will write: ' + files.map((f) => f.dest).join(', '));
  }

  if (!state.completedPhases.includes(step.id)) state.completedPhases.push(step.id);
}

// --- the plan ------------------------------------------------------------------------------------

// Everything the templates reference beyond the raw answers — labels, conditionals, pre-rendered
// table cells. Done once, after all ten phases have been answered, because several derived values
// depend on answers from more than one phase.
//
// Derived onto a copy so the saved state file keeps only what the user actually answered. A state
// file full of computed booleans is one nobody will hand-edit, and hand-editing it — the hot-path
// table especially — is the intended workflow.
const renderContext = derive(structuredClone(context));

const allFiles = plan.flatMap(({ files }) => files);

ui.phase('—', 'Review the plan');
ui.say(
  `${allFiles.length} files will be written into ${target}. Existing files that differ are never ` +
    'overwritten without asking.',
);

for (const { step, files } of plan) {
  if (!files.length) continue;
  stdout.write(`  ${c.dim(String(step.num).padStart(2))} ${c.bold(step.title)}\n`);
  for (const file of files) stdout.write(`       ${c.dim('·')} ${file.dest}\n`);
}
ui.blank();

if (interactive && !(await ui.confirm('Write these files?', true))) {
  ui.note('Nothing written. Your answers were still saved, so re-running picks up where you left off.');
  saveState(target, { ...state, project, answers: context.answers });
  ui.close();
  process.exit(0);
}

// --- write ---------------------------------------------------------------------------------------

ui.heading(dryRun ? 'Planned' : 'Writing');

const writer = new Writer({ target, templateRoot: TEMPLATE_ROOT, ui, dryRun, force });

for (const { files } of plan) {
  for (const file of files) {
    if (file.copy) await writer.copy(file.copy, file.dest);
    else await writer.file(file.template, file.dest, renderContext, { executable: file.executable });
  }
}

// The index, written last because it lists everything above it — and only on a full run. Under
// --only it would describe a single phase while claiming to be the index of the whole foundation,
// which is worse than not refreshing it at all.
if (!only) {
  const foundationContext = {
    ...renderContext,
    phases: plan.map(({ step, files }) => ({
      num: step.num,
      title: step.title,
      files: files.map((f) => ({ dest: f.dest })),
    })),
  };
  await writer.content(
    render(readFileSync(join(TEMPLATE_ROOT, 'FOUNDATION.md'), 'utf8'), foundationContext),
    'docs/FOUNDATION.md',
  );
} else {
  ui.note('docs/FOUNDATION.md left alone — it indexes the whole foundation, not one phase.');
}

// --- package scripts -----------------------------------------------------------------------------

const manifestPath = join(target, 'package.json');
const wantsScripts =
  existsSync(manifestPath) &&
  allFiles.some((f) => f.copy) &&
  (await ui.confirm('Add `check:docs` and `check:risk` scripts to package.json?', true));

if (wantsScripts && !dryRun) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifest.scripts ??= {};
    if (context.answers.installDocDrift) manifest.scripts['check:docs'] ??= 'node tools/doc-drift.mjs';
    if (context.answers.installRiskCheck) manifest.scripts['check:risk'] ??= 'node tools/release-risk.mjs';
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    ui.ok('package.json — scripts added');
  } catch {
    ui.warn('package.json could not be parsed; add the scripts by hand.');
  }
}

// --- state ---------------------------------------------------------------------------------------

if (!dryRun) {
  saveState(target, { ...state, project, answers: context.answers });
  ui.ok(STATE_FILE);
}

// --- close ---------------------------------------------------------------------------------------

ui.phase('✓', 'Done');

const created = writer.summary().filter((f) => f.status === 'created' || f.status === 'would create');
const skipped = writer.summary().filter((f) => f.status === 'skipped' || f.status === 'sidecar');

ui.say(
  dryRun
    ? `${created.length} files would be written. Re-run without --dry-run to create them.`
    : `${created.length} files written${skipped.length ? `, ${skipped.length} left alone` : ''}. ` +
        'Read docs/FOUNDATION.md first — it is the index of everything above and the list of what is ' +
        'still yours to fill in.',
);

if (!dryRun) {
  ui.heading('What to do next');
  ui.bullet('Open AGENTS.md and delete any rule you would not actually enforce in review.');
  ui.bullet('Grep the whole tree for TODO(setup) — those are the decisions the wizard could not make for you.');
  if (context.answers.installDocDrift) ui.bullet('Run `node tools/doc-drift.mjs` — it will list the placeholders still unfilled.');
  if (context.answers.installRiskCheck) ui.bullet('Run `node tools/release-risk.mjs` against a real diff to see the scoring.');
  ui.bullet(`Re-run any single phase later with --only=<id>, for example --only=security.`);
  ui.blank();
  ui.note(
    'The instruction files are the ones that repay attention. Every rule in AGENTS.md should be one ' +
      'an assistant got wrong at least once — it is a record of corrections, and it is only worth ' +
      'anything if you keep adding to it.',
  );
}

ui.close();
