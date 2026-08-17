/**
 * Turning answers into the values templates actually need.
 *
 * The renderer has no expressions on purpose — no comparisons, no helpers, no logic inside the
 * markdown. That keeps the templates readable as documents, which matters because they are meant
 * to be edited by hand before they are ever rendered. The cost is that every conditional and every
 * label a template needs has to be computed here first, explicitly.
 *
 * That trade is worth taking. A template you can read in a markdown preview is a template people
 * will maintain; one full of branching logic is a program that happens to be mostly prose.
 */

import { AGENT_ROSTER as AGENT_CATALOGUE, SKILL_CATALOGUE } from './steps.mjs';

const SURFACE_LABELS = {
  auth: 'authentication and sessions',
  personal: 'personal data',
  money: 'money and payments',
  untrusted: 'user-supplied content',
};

/** What specifically goes wrong on each surface, so the threat model prioritises rather than lists. */
const SURFACE_CONCERNS = {
  auth: 'Authorisation checks placed on the wrong side of a decision, and session handling that looks correct because the happy path works. Generated auth code is confident and frequently subtly permissive.',
  personal: 'Personal data reaching a log, a prompt, a test fixture or an error message. The leak is almost never the database — it is the diagnostic path nobody threat-modelled.',
  money: 'Silent misvaluation. Floating-point arithmetic, rounding inside a loop, and off-by-one on tier or interval boundaries all produce plausible numbers that are wrong, and no exception is raised.',
  untrusted: 'Injection of every kind, unsafe deserialisation, path traversal — and content that reaches an agent as instructions rather than as data.',
};

const ARCHITECTURE_LABELS = {
  'modular-monolith': 'modular monolith',
  services: 'set of distributed services',
  library: 'library / SDK',
  cli: 'command-line tool',
  frontend: 'frontend application',
};

const CLASSIFICATION_LABELS = {
  public: 'public / open source',
  internal: 'internal business code',
  regulated: 'regulated or customer data',
};

const PRIVILEGE_LABELS = {
  'read-only': 'a read-only local checkout',
  push: 'the ability to push branches and open pull requests',
  ci: 'CI credentials or deploy access',
};

const DEPENDENCY_LABELS = {
  never: 'assistants may not add dependencies; they propose and stop',
  ask: 'a new dependency needs explicit approval in the pull request',
  allowed: 'dependencies may be added within existing conventions',
};

const REVIEW_LABELS = {
  always: 'always reviewed by a named human, who is not the person who prompted the change',
  'risk-based': 'risk-based — hot paths always reviewed, low-risk changes may auto-merge',
  'same-as-human': 'the same rules that apply to human-authored changes',
};

const CI_LABELS = {
  github: 'GitHub Actions',
  gitlab: 'GitLab CI',
  none: 'none configured yet',
};

/** Split "suggestion — reason" into the two table cells the AGENTS.md template renders. */
function toRows(lines) {
  const rows = lines
    .map((line) => {
      const [suggestion, ...rest] = line.split(/\s+(?:—|--|-|:)\s+/);
      return {
        // Pipes would break out of the markdown table cell they live in.
        suggestion: suggestion.trim().replaceAll('|', '\\|'),
        reason: (rest.join(' ').trim() || 'TODO(setup): why this is rejected here').replaceAll('|', '\\|'),
      };
    })
    .filter((row) => row.suggestion);

  if (rows.length) return rows;

  // An empty table looks like an oversight. A seeded row shows the shape and says what to do,
  // and the placeholder marker makes the drift check remind you about it.
  return [
    {
      suggestion: 'TODO(setup): the first suggestion you reject twice',
      reason: 'Add a row the moment you explain the same rejection to an assistant a second time',
    },
  ];
}

/**
 * Compute every derived value the templates reference. Mutates `context` in place, because the
 * same object is what gets handed to the renderer.
 *
 * @param {{ project: Record<string, any>, answers: Record<string, any> }} context
 */
export function derive(context) {
  const { project, answers } = context;

  // A command that is still a TODO marker is not a command. Templates that would otherwise emit it
  // as something to execute must treat it as absent — `call TODO(setup): the test command` in a
  // batch file fails on the parentheses and tells the reader nothing about why.
  const isRealCommand = (value) => Boolean(value) && !String(value).includes('TODO(setup)');
  project.hasToolCheck = isRealCommand(project.toolCheck);
  project.hasInstallCommand = isRealCommand(project.installCommand);
  project.hasTestCommand = isRealCommand(project.testCommand);
  project.hasLintCommand = isRealCommand(project.lintCommand);
  project.hasBuildCommand = isRealCommand(project.buildCommand);
  project.hasRunCommand = isRealCommand(project.runCommand);

  project.architectureLabel =
    ARCHITECTURE_LABELS[answers.architectureStyle] ?? 'system';

  answers.dataClassificationLabel =
    CLASSIFICATION_LABELS[answers.dataClassification] ?? 'internal business code';
  answers.classificationRegulated = answers.dataClassification === 'regulated';

  answers.dependencyPolicyLabel = DEPENDENCY_LABELS[answers.dependencyPolicy] ?? DEPENDENCY_LABELS.never;
  answers.dependencyPolicyNever = answers.dependencyPolicy === 'never';
  answers.dependencyPolicyAsk = answers.dependencyPolicy === 'ask';
  answers.dependencyPolicyAllowed = answers.dependencyPolicy === 'allowed';

  answers.agentPrivilegesLabel = PRIVILEGE_LABELS[answers.agentPrivileges] ?? PRIVILEGE_LABELS.push;
  answers.agentPrivilegesCi = answers.agentPrivileges === 'ci';
  answers.agentPrivilegesReadOnly = answers.agentPrivileges === 'read-only';

  answers.humanReviewRuleLabel = REVIEW_LABELS[answers.humanReviewRule] ?? REVIEW_LABELS.always;
  answers.humanReviewAlways = answers.humanReviewRule === 'always';

  answers.ciProviderLabel = CI_LABELS[answers.ciProvider] ?? CI_LABELS.none;

  answers.secretPathList = (answers.secretPaths ?? []).map((path) => `\`${path}\``).join(', ');
  answers.firstInvariant = answers.invariants?.[0] ?? 'the invariants in docs/adr/';
  answers.rejectedSuggestionRows = toRows(answers.rejectedSuggestions ?? []);

  answers.anyTooling = Boolean(answers.installDocDrift || answers.installRiskCheck);

  // Which dev entry point the documentation should name. Naming both in every sentence makes the
  // prose unreadable, so pick the one that was written and mention the other once.
  const devScripts = answers.devScripts ?? [];
  answers.devEntryPoint = devScripts.includes('bat') ? 'dev.bat' : devScripts.includes('sh') ? './dev.sh' : 'TODO(setup)';
  answers.hasDevScript = devScripts.length > 0;
  answers.soloDeveloper = answers.teamSize === 'solo';
  answers.metricsNone = answers.metricsAvailable === 'none';
  answers.metricsPartial = answers.metricsAvailable === 'partial';
  answers.hasSensitiveSurfaces = (answers.sensitiveSurfaces ?? []).length > 0;
  answers.sensitiveSurfaceList = (answers.sensitiveSurfaces ?? [])
    .map((key) => SURFACE_LABELS[key] ?? key)
    .join(', ');
  answers.surfaceRows = (answers.sensitiveSurfaces ?? []).map((key) => ({
    surface: SURFACE_LABELS[key] ?? key,
    concern: SURFACE_CONCERNS[key] ?? 'TODO(setup): what specifically goes wrong here',
  }));

  answers.agentRosterRows = (answers.agentRoster ?? []).map((name) => {
    const entry = AGENT_CATALOGUE.find((item) => item.value === name);
    return { name, phase: entry?.phase ?? '—', purpose: entry?.purpose ?? '' };
  });

  answers.skillRows = (answers.skills ?? []).map((name) => {
    const entry = SKILL_CATALOGUE.find((item) => item.value === name);
    return { name, phase: entry?.phase ?? '—', purpose: entry?.purpose ?? '' };
  });
  answers.hasAgents = (answers.agentRoster ?? []).length > 0;
  answers.hasSkills = (answers.skills ?? []).length > 0;

  // Pre-rendered table cells for the permission matrix: "unattended | approval | never".
  // Building these here rather than branching inside the markdown keeps that table readable.
  answers.cellOpenPr = answers.agentPrivilegesReadOnly ? ' | ✅ | ' : '✅ |  | ';
  answers.cellAddDependency = answers.dependencyPolicyNever
    ? ' |  | ✅'
    : answers.dependencyPolicyAllowed
      ? '✅ |  | '
      : ' | ✅ | ';

  // Assessment findings need a status mark and a severity note for the report template, since the
  // renderer has no comparisons of its own.
  if (context.assessment) {
    for (const check of context.assessment.checks) {
      check.statusMark = check.present ? '✅' : check.severity === 'critical' ? '🔴' : '⚠️';
      check.severityNote = check.present
        ? ''
        : ` · ${check.severity === 'critical' ? 'critical gap' : check.severity === 'high' ? 'high' : 'gap'}`;
    }
  }

  return context;
}
