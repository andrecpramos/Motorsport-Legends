/**
 * The ten phases, as a guided interview.
 *
 * Each step does three things in order: explain why the phase exists, ask the small number of
 * questions no template can answer for you, and declare which files it will produce.
 *
 * Questions are asked for all ten phases *before* anything is written. That is not just so the
 * plan can be reviewed in one piece — later answers genuinely change earlier files. Whether you
 * install the documentation drift check in Phase 9 decides whether the Phase 7 pipeline has a job
 * to run it. Writing as we went would mean writing some files twice.
 *
 * The prose is deliberately opinionated. A wizard that asks "enable security scanning? (y/n)"
 * without saying what it protects you from produces a configured repository and an uninformed
 * team, and the second one is what actually fails.
 */

import { stackInfo, stackOptions } from './detect.mjs';
import { colour as c } from './ui.mjs';

/**
 * The standard agent roster. Each entry is a role that recurs in every project, and each system
 * prompt carries the lesson from the lifecycle phase it belongs to — which is the whole reason to
 * define them rather than typing the prompt fresh each time. A prompt written from memory at 5pm
 * is not the prompt written at 10am; a file is.
 */
const AGENT_ROSTER = [
  { value: 'code-reviewer', label: 'code-reviewer', phase: '4 · Review', purpose: 'Correctness defects and the specific failure modes of generated code. Tuned for precision over recall.' },
  { value: 'test-strategist', label: 'test-strategist', phase: '5 · Testing', purpose: 'Finds what the suite does not actually pin down, by thinking in mutations rather than in coverage.' },
  { value: 'security-reviewer', label: 'security-reviewer', phase: '6 · Security', purpose: 'Vulnerabilities in the code, and the agent itself as an attack surface.' },
  { value: 'requirements-auditor', label: 'requirements-auditor', phase: '1 · Requirements', purpose: 'Attacks a brief for ambiguity, contradiction and untestable criteria before anything is built.' },
  { value: 'adr-author', label: 'adr-author', phase: '2 · Architecture', purpose: 'Drafts a decision record including what the decision forbids.' },
  { value: 'build-triage', label: 'build-triage', phase: '7 · CI/CD', purpose: 'Classifies a red build before anyone proposes a fix.' },
  { value: 'incident-responder', label: 'incident-responder', phase: '8 · Operations', purpose: 'Correlates anomalies with changes and drafts the postmortem. Never touches production.' },
  { value: 'doc-keeper', label: 'doc-keeper', phase: '9 · Documentation', purpose: 'Checks whether the prose still describes what the code does.' },
];

export { AGENT_ROSTER };

/**
 * Skills — procedures rather than personas.
 *
 * The distinction against the agent roster above is worth stating, because installing both without
 * understanding it produces eight agents and six skills that overlap and nobody uses. An *agent* is
 * a role you delegate to: it has its own context, its own scoped tools, and it comes back with
 * findings. A *skill* is a procedure the assistant you are already talking to loads on demand, so
 * it does the thing the same way every time.
 *
 * Which means the test for "should this be a skill" is: does the project do this repeatedly, in a
 * particular order, in a way a competent assistant would otherwise have to guess at? Writing an ADR
 * in this repository's format is a skill. Reviewing code is an agent.
 *
 * Each of these points at documents this kit generates, which is the reason they are worth
 * installing here rather than writing later — the procedure and the document it references arrive
 * together, and neither is much use alone.
 */
const SKILL_CATALOGUE = [
  { value: 'write-adr', label: 'write-adr', phase: '2 · Architecture', purpose: 'Draft a decision record in this project\'s format, including what the decision forbids.' },
  { value: 'clarify-requirements', label: 'clarify-requirements', phase: '1 · Requirements', purpose: 'Turn a request into acceptance criteria specific enough to become tests, and list what is still ambiguous.' },
  { value: 'pre-pr-check', label: 'pre-pr-check', phase: '4 · Review', purpose: 'Run the gate, walk the review checklist and fill the PR template before opening a pull request.' },
  { value: 'assess-change-risk', label: 'assess-change-risk', phase: '6 · Security', purpose: 'Check a change against the threat model and the hot-path table before it is proposed.' },
  { value: 'draft-release-notes', label: 'draft-release-notes', phase: '7 · CI/CD', purpose: 'Summarise a diff into release notes, with the deterministic risk score attached rather than re-guessed.' },
  { value: 'write-postmortem', label: 'write-postmortem', phase: '8 · Operations', purpose: 'Build an incident timeline from evidence and draft the postmortem without naming a culprit.' },
];

export { SKILL_CATALOGUE };

/**
 * Hot paths every project has, regardless of what it does. Merged with the ones the user names.
 * Weights are points added to a 100-point release risk score.
 */
const UNIVERSAL_HOT_PATHS = [
  { pattern: '^\\.github/workflows/', weight: 20, why: 'pipeline changes can disable the checks that protect the release' },
  { pattern: '^(AGENTS|CLAUDE)\\.md$|^\\.github/copilot-instructions\\.md$|^\\.cursor/', weight: 15, why: 'agent instruction files — a change here affects every future generated change' },
  { pattern: '(package-lock\\.json|yarn\\.lock|pnpm-lock\\.yaml|poetry\\.lock|Cargo\\.lock|go\\.sum)$', weight: 15, why: 'dependency change — supply chain surface' },
  { pattern: 'migrations?/', weight: 22, why: 'schema change — hard to roll back' },
  { pattern: '(^|/)(auth|authz|permissions|crypto|secrets)[./]', weight: 20, why: 'security boundary' },
];

/** Parse "path — reason" lines into hot path entries. Falls back to a generic reason. */
function parseHotPaths(lines) {
  return lines.map((line) => {
    const [path, ...rest] = line.split(/\s+(?:—|--|-|:)\s+/);
    const why = rest.join(' ').trim();
    return {
      pattern: path.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      weight: 20,
      why: why || 'named as high blast radius during setup',
    };
  });
}

export const steps = [
  // ---------------------------------------------------------------------------------------------
  {
    num: 'A',
    id: 'assessment',
    title: 'Assessment — what this project already has',
    why: [
      'Before any questions, the kit reads the repository and works out what is here. The point is not an inventory. It is one specific question, and it is the question that decides whether everything after it helps or hurts: can this project absorb more code than it is currently producing?',
      'That framing comes from the finding underneath this whole discipline. AI adoption raises throughput and code quality and simultaneously raises delivery instability, because generation gets faster while review, testing and deployment do not. The work is relocated, not removed. So AI is an amplifier — in a project with tests and a pipeline it improves speed and stability together, and in a project without them it magnifies what was already fragile.',
      'What follows is what the file tree actually shows, and what it means. Where it finds a critical gap, the honest recommendation is to close that gap before enabling AI broadly, rather than to configure tooling on top of it.',
    ],
    async ask(context, ui) {
      const { assessment } = context;

      const badge =
        assessment.readiness === 'Ready' ? c.green(assessment.readiness)
          : assessment.readiness === 'Not ready' ? c.red(assessment.readiness)
            : c.yellow(assessment.readiness);

      ui.heading(`Verdict: ${badge}`);
      ui.say(assessment.verdict);

      ui.note(
        `${assessment.facts.sourceFiles} source files · ${assessment.facts.testFiles} test files ` +
          `· ${assessment.facts.workflows} pipeline file(s) · ${assessment.facts.commits} commits ` +
          `from ${assessment.facts.contributors} contributor(s)`,
      );

      const gaps = assessment.checks.filter((entry) => !entry.present);
      if (gaps.length === 0) {
        ui.ok('Every check passed. The rest of this is about quality rather than foundations.');
      } else {
        ui.heading(`${gaps.length} gap(s)`);
        const order = { critical: 0, high: 1, gap: 2, low: 3 };
        for (const gap of [...gaps].sort((a, b) => order[a.severity] - order[b.severity])) {
          const mark =
            gap.severity === 'critical' ? c.red('CRITICAL')
              : gap.severity === 'high' ? c.yellow('HIGH    ')
                : c.dim('note    ');
          ui.plain(`  ${mark}  ${c.bold(gap.title)}`);
          ui.plain(c.dim(`            ${gap.finding}`));
        }
        ui.blank();
      }

      const present = assessment.checks.filter((entry) => entry.present).length;
      ui.note(`${present} of ${assessment.checks.length} checks already satisfied.`);

      context.answers.writeAssessment = await ui.confirm(
        'Write this up as docs/ASSESSMENT.md? It is worth having as a dated baseline to compare against later.',
        context.answers.writeAssessment ?? true,
      );
    },
    plan: (context) =>
      context.answers.writeAssessment
        ? [{ template: 'docs/ASSESSMENT.md', dest: 'docs/ASSESSMENT.md' }]
        : [],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 0,
    id: 'governance',
    title: 'Governance, Strategy & Measurement',
    why: [
      'This is the phase teams skip, and skipping it is why AI rollouts get argued about instead of evaluated. The research finding worth internalising is that AI adoption correlates with higher throughput and better code quality, and simultaneously with higher delivery instability. Those are not in tension by accident — they share a mechanism.',
      'The mechanism is volume. Code gets generated faster than review, testing and deployment can absorb it. The work is not removed, it is relocated downstream. So AI is an amplifier: in a team with good tests and a real pipeline it improves speed and stability together, and in a weak team it magnifies the friction that was already there.',
      'What that means practically is that you need a baseline before you turn anything on, and a number written down in advance that would make you turn it back off. Deciding what counts as failure after you are already invested is not a decision, it is a negotiation.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.dataClassification = await ui.select(
        'What is the most sensitive thing in this codebase?',
        [
          { value: 'public', label: 'Public / open source', hint: 'no routing restrictions needed' },
          { value: 'internal', label: 'Internal business code', hint: 'no customer data in the repository' },
          { value: 'regulated', label: 'Regulated or customer data', hint: 'GDPR, health, financial — routing rules are mandatory' },
        ],
        answers.dataClassification ?? 'internal',
      );

      answers.teamSize = await ui.select(
        'How many people write code in this repository?',
        [
          { value: 'solo', label: 'Just me', hint: 'review rules need a different answer — see below' },
          { value: 'small', label: '2–5', hint: 'peer review is workable without process' },
          { value: 'medium', label: '6–20', hint: 'ownership routing starts to matter' },
          { value: 'large', label: '20+', hint: 'the queue forms in review; measure it' },
        ],
        answers.teamSize ?? 'small',
      );

      if (answers.teamSize === 'solo') {
        ui.note(
          'Working alone changes one thing materially: there is no second person to catch a change ' +
            'you already accepted the framing of. The substitute is time and mechanism — automated ' +
            'checks you cannot argue with, and a rule about not merging generated code the same hour ' +
            'you prompted it. The kit will assume that rather than pretending a reviewer exists.',
        );
      }

      answers.baselineWindow = await ui.ask(
        'How long a baseline will you take before enabling AI tooling broadly?',
        answers.baselineWindow ?? '4 weeks',
      );

      answers.metricsAvailable = await ui.select(
        'What delivery metrics can you actually get today?',
        [
          { value: 'none', label: 'None', hint: 'the plan starts by naming how to collect them' },
          { value: 'partial', label: 'Some — deploy frequency or similar', hint: 'the common case' },
          { value: 'full', label: 'All four DORA metrics' },
        ],
        answers.metricsAvailable ?? 'partial',
      );

      answers.rollbackTrigger = await ui.ask(
        'Write the rollback trigger now, as a sentence. What result would make you stop?',
        answers.rollbackTrigger ?? 'Change failure rate rises above 15% for two consecutive weeks and the increase is not explained by an unrelated incident',
      );
    },
    plan: () => [
      { template: 'docs/governance/ai-usage-policy.md', dest: 'docs/governance/ai-usage-policy.md' },
      { template: 'docs/governance/measurement-plan.md', dest: 'docs/governance/measurement-plan.md' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 1,
    id: 'requirements',
    title: 'Planning & Requirements',
    why: [
      'A language model will not tell you that your requirements contradict each other. It will resolve the contradiction silently, pick one reading, and build it with total confidence. That makes ambiguity more expensive than it used to be, because it now gets implemented before anyone notices.',
      'So the highest-value use of AI in this phase is not writing requirements — it is attacking them. Ask a model to find every ambiguity, every undefined term, every case the document does not cover, before you ask it to build anything.',
      'The artifact that matters here is an acceptance criterion specific enough to become a test. "Handles large volumes correctly" cannot fail. "150,000 units is charged €630.00" can.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.tracker = await ui.ask(
        'Where do requirements arrive? (issue tracker or document location)',
        answers.tracker ?? 'GitHub Issues',
      );

      answers.useGherkin = await ui.confirm(
        'Include a Given/When/Then scenario template? It is the cheapest way to make acceptance criteria testable.',
        answers.useGherkin ?? true,
      );
    },
    plan: (context) => [
      { template: 'docs/requirements/ambiguity-checklist.md', dest: 'docs/requirements/ambiguity-checklist.md' },
      { template: 'docs/requirements/story-template.md', dest: 'docs/requirements/story-template.md' },
      ...(context.answers.useGherkin
        ? [{ template: 'docs/requirements/example.feature', dest: 'docs/requirements/example.feature' }]
        : []),
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 2,
    id: 'architecture',
    title: 'Architecture & Design',
    why: [
      'Architecture decisions are the ones that are expensive to reverse, which is exactly why they need to be written down at the moment they are made, while the alternatives and the reasoning are still in someone\'s head. Six months later all that survives is the outcome, and nobody can tell whether it was reasoned or accidental.',
      'There is a second reason now, and it is the one that makes this phase pay for itself. An ADR log is the highest-value context you can give a coding agent. "Use integer cents for money" in a decision record with its rejected alternatives stops an assistant proposing floating point every single week — and it will, confidently, forever, unless something tells it not to.',
      'The invariants you name here are the ones that get copied into your agent instruction files in Phase 3. Take them seriously.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.architectureStyle = await ui.select(
        'What shape is this system?',
        [
          { value: 'modular-monolith', label: 'Modular monolith', hint: 'one deployable, enforced internal boundaries' },
          { value: 'services', label: 'Distributed services', hint: 'multiple independently deployed units' },
          { value: 'library', label: 'Library or SDK', hint: 'consumed by other code, public API surface' },
          { value: 'cli', label: 'CLI or batch tool', hint: 'runs and exits' },
          { value: 'frontend', label: 'Frontend application', hint: 'browser or mobile client' },
        ],
        answers.architectureStyle ?? 'modular-monolith',
      );

      ui.note(
        'Next: your invariants. These are the rules that are always true of this system and that a ' +
          'plausible-looking change could quietly break. Be concrete and be specific to this project — ' +
          '"money is integer cents, never a float" is an invariant, "write clean code" is not.',
      );

      answers.invariants = await ui.lines(
        'Name the rules that must never be violated in this codebase.',
        answers.invariants ?? [
          'TODO(setup): replace this with a real invariant — a rule a plausible change could silently break',
        ],
        6,
      );
    },
    plan: () => [
      { template: 'docs/adr/README.md', dest: 'docs/adr/README.md' },
      { template: 'docs/adr/0000-template.md', dest: 'docs/adr/0000-template.md' },
      { template: 'docs/adr/0001-record-architecture-decisions.md', dest: 'docs/adr/0001-record-architecture-decisions.md' },
      { template: 'docs/adr/0002-invariants.md', dest: 'docs/adr/0002-project-invariants.md' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 3,
    id: 'implementation',
    title: 'Implementation & Context Engineering',
    why: [
      'This is the phase with the highest ratio of impact to effort, and it is mostly one file. An agent working without project context writes code that is correct in general and wrong here — it does not know your conventions, your invariants, or the three things your team already learned the hard way.',
      'The discipline is that instruction files are a record of corrections, not a style guide. Every rule in yours should be one an assistant got wrong at least once. If you find yourself explaining the same thing to a model a second time, that is the signal to write it down — and writing it down is the whole job.',
      'Keep one source of truth. AGENTS.md is read by Claude Code, Cursor, Copilot code review and most other tools that honour the convention. Three drifting instruction files are worse than none, because you lose the ability to predict which rule an agent actually saw.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.agentTools = await ui.multiSelect(
        'Which assistants work in this repository?',
        [
          { value: 'agents', label: 'AGENTS.md', hint: 'the shared convention — always written' },
          { value: 'claude', label: 'Claude Code', hint: 'adds a CLAUDE.md pointer' },
          { value: 'copilot', label: 'GitHub Copilot', hint: 'adds .github/copilot-instructions.md' },
          { value: 'cursor', label: 'Cursor', hint: 'adds .cursor/rules/project.mdc' },
        ],
        answers.agentTools ?? ['agents', 'claude', 'copilot'],
      );
      if (!answers.agentTools.includes('agents')) answers.agentTools.push('agents');

      answers.dependencyPolicy = await ui.select(
        'May an assistant add a dependency on its own?',
        [
          { value: 'never', label: 'No — propose it and stop', hint: 'strongest defence against slopsquatting' },
          { value: 'ask', label: 'Only with explicit approval in the PR' },
          { value: 'allowed', label: 'Yes, within existing conventions' },
        ],
        answers.dependencyPolicy ?? 'never',
      );

      ui.note(
        'The next question is the one that makes an instruction file actually work. List the ' +
          '"improvements" an assistant keeps proposing that are wrong for this project. Leave it ' +
          'empty for now if you are starting fresh — you will fill it in within a fortnight.',
      );

      answers.rejectedSuggestions = await ui.lines(
        'Things that look like improvements here and are not. Format: suggestion — why it is rejected.',
        answers.rejectedSuggestions ?? [],
        6,
      );

      // --- the commands, which are the other half of context engineering ------------------------
      //
      // "How do I actually run this?" is the question no repository answers reliably, and it is the
      // one an agent most often has to guess at. Guessing produces a plausible command that does
      // not exist, then a confident report that something was verified when nothing ran.

      ui.heading('How this project runs');
      ui.say(
        'These three commands go into the dev script and into AGENTS.md, so a human and an assistant ' +
          'get the same answer to "how do I run this" — and so that answer lives in one place rather ' +
          'than in a README paragraph that drifts.',
      );

      context.project.installCommand = await ui.ask(
        'How are dependencies installed?',
        context.project.installCommand || 'TODO(setup): the install command',
      );

      context.project.runCommand = await ui.ask(
        'How is the application started locally?',
        context.project.runCommand || 'TODO(setup): the command that starts this locally',
      );

      answers.usesDocker = await ui.confirm(
        'Does local development need Docker services (a database, a queue, a cache)?',
        answers.usesDocker ?? false,
      );

      answers.envExample = await ui.confirm(
        'Does it need environment variables from a .env file?',
        answers.envExample ?? false,
      );

      answers.devScripts = await ui.multiSelect(
        'Which dev entry points should be written?',
        [
          { value: 'bat', label: 'dev.bat', hint: 'Windows' },
          { value: 'sh', label: 'dev.sh', hint: 'macOS and Linux' },
        ],
        answers.devScripts ?? ['bat', 'sh'],
      );

      // --- the agent roster ----------------------------------------------------------------------

      ui.heading('The agent roster');
      ui.say(
        'Named subagents with scoped tools and a system prompt each. The reason to define them as ' +
          'files rather than typing prompts is that a file is somewhere corrections accumulate: when ' +
          'an agent gets something wrong, the fix goes into its definition and every future run ' +
          'inherits it. All of the reviewers are read-only — a reviewer has no business writing to ' +
          'the tree.',
      );

      answers.agentRoster = await ui.multiSelect(
        'Which agents should be installed into .claude/agents/?',
        AGENT_ROSTER.map(({ value, label, phase }) => ({ value, label, hint: `phase ${phase.split(' · ')[0]}` })),
        answers.agentRoster ?? ['code-reviewer', 'test-strategist', 'security-reviewer', 'build-triage', 'doc-keeper'],
      );

      // --- skills ----------------------------------------------------------------------------------

      ui.heading('Skills');
      ui.say(
        'Skills are the other half of context engineering, and they are a different thing from the ' +
          'roster above. An agent is a role you hand work to — its own context, its own tools, and it ' +
          'reports back. A skill is a procedure the assistant you are already talking to loads when it ' +
          'becomes relevant, so a recurring job gets done the same way every time instead of being ' +
          'reinvented from whatever is in the window.',
      );
      ui.say(
        'The ones offered here each drive a document this kit is about to write — the ADR format, the ' +
          'review checklist, the threat model, the postmortem template. That pairing is the point: a ' +
          'procedure with no document to reference is a prompt, and a document with no procedure ' +
          'attached is one nobody opens at the moment it would have helped.',
      );

      answers.skills = await ui.multiSelect(
        'Which skills should be installed into .claude/skills/?',
        SKILL_CATALOGUE.map(({ value, label, phase }) => ({ value, label, hint: `phase ${phase.split(' · ')[0]}` })),
        answers.skills ?? ['write-adr', 'clarify-requirements', 'pre-pr-check', 'assess-change-risk'],
      );
    },
    plan: (context) => {
      const { agentTools = [], agentRoster = [], devScripts = [], skills = [] } = context.answers;
      return [
        { template: 'AGENTS.md', dest: 'AGENTS.md' },
        ...(agentTools.includes('claude') ? [{ template: 'CLAUDE.md', dest: 'CLAUDE.md' }] : []),
        ...(agentTools.includes('copilot')
          ? [{ template: 'copilot-instructions.md', dest: '.github/copilot-instructions.md' }]
          : []),
        ...(agentTools.includes('cursor')
          ? [{ template: 'cursor-rules.mdc', dest: '.cursor/rules/project.mdc' }]
          : []),
        ...(devScripts.includes('bat') ? [{ template: 'dev.bat', dest: 'dev.bat' }] : []),
        ...(devScripts.includes('sh') ? [{ template: 'dev.sh', dest: 'dev.sh', executable: true }] : []),
        ...agentRoster.map((name) => ({
          template: `agents/${name}.md`,
          dest: `.claude/agents/${name}.md`,
        })),
        // One directory per skill, which is the layout Claude Code expects — the folder name is the
        // skill name and SKILL.md is its entry point.
        ...skills.map((name) => ({
          template: `skills/${name}.md`,
          dest: `.claude/skills/${name}/SKILL.md`,
        })),
        ...(agentRoster.length || skills.length
          ? [{ template: 'docs/agents/README.md', dest: 'docs/agents/README.md' }]
          : []),
      ];
    },
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 4,
    id: 'review',
    title: 'Code Review & Quality',
    why: [
      'Review is where the volume problem from Phase 0 actually lands. If authoring gets faster and review does not, the queue forms here, and the way teams relieve the pressure is by reviewing less carefully — which is invisible until something ships.',
      'AI review is genuinely good at the mechanical layer: a missing null check, an unhandled error path, a resource that is not closed, an inconsistency with a convention you wrote down. It is unreliable at the layer that matters most — whether this change should exist, whether it fits the architecture, whether the requirement was understood.',
      'The trap to avoid is a reviewer with a high false-positive rate. It gets ignored, then muted, then disabled, and at that point its true positives are worth nothing either. Tune for precision over recall, always.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.humanReviewRule = await ui.select(
        'What is the human review rule for AI-authored changes?',
        [
          { value: 'always', label: 'Always a named human approver', hint: 'the author of the prompt is not the reviewer' },
          { value: 'risk-based', label: 'Risk-based', hint: 'hot paths always; low-risk changes may auto-merge' },
          { value: 'same-as-human', label: 'Same rules as human-authored changes' },
        ],
        answers.humanReviewRule ?? 'always',
      );

      answers.traceabilityRule = await ui.confirm(
        `Require every PR to name the issue or decision it implements? (recommended — untraceable changes are where scope creep hides)`,
        answers.traceabilityRule ?? true,
      );
    },
    plan: () => [
      { template: 'docs/review/review-checklist.md', dest: 'docs/review/review-checklist.md' },
      { template: 'PULL_REQUEST_TEMPLATE.md', dest: '.github/PULL_REQUEST_TEMPLATE.md' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 5,
    id: 'testing',
    title: 'Testing & QA',
    why: [
      'The single most useful thing to understand about AI and testing is the coverage trap. A model asked to raise coverage will write tests that execute code without asserting anything meaningful about it. Coverage goes up, confidence goes up, and the suite catches nothing. That is worse than having no tests, because now the number is lying to you.',
      'Mutation testing is how you tell the difference. Deliberately break the source — flip a comparison, change a constant, remove a guard — and see whether any test fails. A mutant that survives is a missing assertion, and it points at the exact line. Coverage tells you what ran; mutation tells you what is actually pinned down.',
      'This is also why a coverage percentage makes a bad merge gate. Gate on a number and you will get tests written to move the number. Report it, do not enforce it.',
    ],
    async ask(context, ui) {
      const answers = context.answers;
      const stack = stackInfo(context.project.stack);

      context.project.testCommand = await ui.ask(
        'What command runs the test suite?',
        context.project.testCommand || stack.testCommand || 'TODO(setup): the test command',
      );

      answers.coverageGate = await ui.confirm(
        'Gate merges on a coverage percentage? (recommended: no — report it instead)',
        answers.coverageGate ?? false,
      );

      answers.assertionRule = await ui.confirm(
        'Adopt the rule that tests assert specific expected values, never just "not null" or "greater than zero"?',
        answers.assertionRule ?? true,
      );
    },
    plan: () => [
      { template: 'docs/testing/test-strategy.md', dest: 'docs/testing/test-strategy.md' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 6,
    id: 'security',
    title: 'Security (DevSecOps)',
    why: [
      'Two threats matter here and they are different in kind. The first is that generated code has vulnerabilities — that is an old problem with a familiar answer, which is scanning and review.',
      'The second is new and much more interesting. An agent reading an issue, a dependency README or a fetched web page is reading untrusted input, and that input can contain instructions. Prompt injection against a chatbot is embarrassing. Prompt injection against an agent holding a CI token is a supply chain compromise, because the blast radius is not the conversation, it is everything the agent can reach.',
      'The mitigation is not "be better at detecting injection" — that is not reliably solvable. It is least privilege and human approval on side effects. Treat every piece of content the agent reads as data, never as instructions, and draw the approval line at actions with consequences rather than at anything about the model.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.agentPrivileges = await ui.select(
        'What can an agent running in this repository reach?',
        [
          { value: 'read-only', label: 'Read-only local checkout', hint: 'smallest blast radius' },
          { value: 'push', label: 'Can push branches and open PRs' },
          { value: 'ci', label: 'Has CI credentials or deploy access', hint: 'treat injection as a supply chain risk' },
        ],
        answers.agentPrivileges ?? 'push',
      );

      // What the system actually touches decides which half of the threat model is load-bearing.
      // A threat model that lists every risk equally is one nobody prioritises from.
      answers.sensitiveSurfaces = await ui.multiSelect(
        'What does this system handle? Pick everything that applies.',
        [
          { value: 'auth', label: 'Authentication or sessions' },
          { value: 'personal', label: 'Personal data', hint: 'GDPR and friends' },
          { value: 'money', label: 'Money or payments', hint: 'errors reach bank accounts' },
          { value: 'untrusted', label: 'User-supplied content or file uploads' },
        ],
        answers.sensitiveSurfaces ?? [],
      );

      answers.secretPaths = await ui.lines(
        'Paths an assistant must never read or echo.',
        answers.secretPaths ?? ['.env', '.env.*', '*.pem', '*.key', 'secrets/'],
        8,
      );

      answers.secretScanInCi = await ui.confirm(
        'Add a committed-secret scan to the pipeline?',
        answers.secretScanInCi ?? true,
      );
    },
    plan: () => [
      { template: 'docs/security/threat-model.md', dest: 'docs/security/threat-model.md' },
      { template: 'docs/security/agent-permissions.md', dest: 'docs/security/agent-permissions.md' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 7,
    id: 'cicd',
    title: 'Build, Release & CI/CD',
    why: [
      'The pipeline is where the Phase 0 argument gets settled. It is the absorptive capacity — the thing that decides whether more generated code becomes more delivered value or just a longer queue of unverified changes.',
      'One ordering principle covers most pipeline design: cheapest and most likely to fail goes first. A developer waiting twelve minutes to be told about a lint error has been failed by the pipeline, not by the linter.',
      'The release risk score this kit installs is deliberately deterministic rather than a model call. Risk assessment has to be reproducible, explainable to an auditor, and identical on every run for the same diff. Ask a model how risky a release is and you get a different answer each time and no way to justify it. Use AI for the layer above — explaining a flagged file, drafting the release note, triaging the failure when it goes red.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.ciProvider = await ui.select(
        'Which CI system?',
        [
          { value: 'github', label: 'GitHub Actions' },
          { value: 'gitlab', label: 'GitLab CI' },
          { value: 'none', label: 'None yet', hint: 'the checks are still installed and runnable locally' },
        ],
        answers.ciProvider ?? (context.project.hasGithub || context.project.isGitRepo ? 'github' : 'none'),
      );

      answers.deployTarget = await ui.ask(
        'How does a change reach production? One line is enough.',
        answers.deployTarget ?? 'TODO(setup): describe the path from merge to production',
      );

      answers.rollbackExercised = await ui.confirm(
        'Has the rollback path been executed at least once, deliberately? (an honest "no" here is useful)',
        answers.rollbackExercised ?? false,
      );

      if (!answers.rollbackExercised) {
        ui.note(
          'Then it is a hypothesis, not a procedure. The runbook in Phase 8 will say so, because the ' +
            'moment you need it is the worst possible moment to discover it does not work.',
        );
      }

      answers.installRiskCheck = await ui.confirm(
        'Install the release risk scorer? It scores a diff out of 100 from named, auditable rules.',
        answers.installRiskCheck ?? true,
      );

      if (answers.installRiskCheck) {
        ui.note(
          'Hot paths are the files whose blast radius exceeds their line count. This table is the ' +
            'thing to update after every postmortem — it should be derived from where your incidents ' +
            'actually came from, not from intuition. Universal ones (workflows, lockfiles, migrations, ' +
            'agent instruction files) are added automatically.',
        );

        // Defaulted to what was answered last time, not to an empty list. `answers.hotPaths` holds
        // the parsed and merged form, which cannot be offered back as text, so the raw lines are
        // kept alongside it — without them, re-running this one phase quietly discards every hot
        // path the project named, which is the opposite of the promise that this is safe to re-run.
        const named = await ui.lines(
          'Which files or directories here are riskier than their size suggests? Format: path — why.',
          answers.hotPathLines ?? [],
          6,
        );
        answers.hotPathLines = named;
        answers.hotPaths = [...parseHotPaths(named), ...UNIVERSAL_HOT_PATHS];
      } else {
        answers.hotPaths = UNIVERSAL_HOT_PATHS;
      }
    },
    plan: (context) => {
      const answers = context.answers;
      const files = [
        { template: 'docs/cicd/pipeline-notes.md', dest: 'docs/cicd/pipeline-notes.md' },
        { template: 'docs/cicd/failure-triage.md', dest: 'docs/cicd/failure-triage.md' },
      ];
      if (answers.ciProvider === 'github') {
        files.push({ template: 'ci/github-actions.yml', dest: '.github/workflows/ci.yml' });
      } else if (answers.ciProvider === 'gitlab') {
        files.push({ template: 'ci/gitlab-ci.yml', dest: '.gitlab-ci.yml' });
      }
      if (answers.installRiskCheck) {
        files.push({ copy: 'tools/release-risk.mjs', dest: 'tools/release-risk.mjs' });
      }
      return files;
    },
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 8,
    id: 'operations',
    title: 'Operate, Monitor & Maintain',
    why: [
      'Two of the four DORA metrics are stability metrics, and both of them are measured here. If AI moves change failure rate and recovery time, operations is where you find out — which makes this phase the feedback loop for everything upstream.',
      'The thing worth setting up properly is the error budget. An SLO with a budget converts an argument about whether to ship into an arithmetic question about how much budget is left. That is the single most useful property it has, and teams that write SLOs without budgets do not get it.',
      'AI is genuinely strong at incident work — correlating a spike with a deploy, summarising a noisy log, drafting a postmortem timeline from the raw event stream. It is not the thing that should decide to roll back. Keep the judgment with the human and give them a faster path to the evidence.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.primarySli = await ui.ask(
        'What is the one user-facing signal that most needs protecting?',
        answers.primarySli ?? 'Request success rate on the primary user-facing endpoint',
      );

      answers.sloTarget = await ui.ask(
        'What target, over what window?',
        answers.sloTarget ?? '99.9% over a rolling 30 days',
      );

      answers.onCall = await ui.confirm(
        'Is there a named on-call rotation for this service?',
        answers.onCall ?? false,
      );
    },
    plan: () => [
      { template: 'docs/ops/slos-and-telemetry.md', dest: 'docs/ops/slos-and-telemetry.md' },
      { template: 'docs/ops/runbook.md', dest: 'docs/ops/runbook.md' },
      { template: 'docs/ops/postmortem-template.md', dest: 'docs/ops/postmortem-template.md' },
    ],
  },

  // ---------------------------------------------------------------------------------------------
  {
    num: 9,
    id: 'documentation',
    title: 'Documentation & Knowledge',
    why: [
      'Documentation drift is the gap between what the docs claim and what the code does. It is invisible — nothing fails, nothing goes red — and it compounds until the docs are actively misleading, at which point people stop reading them, at which point writing them was wasted effort.',
      'The insight that makes this tractable is that most drift is mechanically detectable. A link to a file that no longer exists, a claim of forty tests when there are forty-two, a reference to a function that was deleted — none of that needs a language model. It needs a script that runs in CI. Reserve AI for the part that genuinely requires reading: does this paragraph still describe what this function does?',
      'There is a second reason to keep documentation current that did not exist five years ago. Your docs are agent context now. Stale documentation does not just mislead people, it actively degrades every AI-assisted change made against this repository.',
    ],
    async ask(context, ui) {
      const answers = context.answers;

      answers.installDocDrift = await ui.confirm(
        'Install the documentation drift check? It finds broken internal links and unfilled placeholders.',
        answers.installDocDrift ?? true,
      );

      answers.docDriftGatesCi =
        answers.installDocDrift &&
        (await ui.confirm(
          'Fail the build on broken internal links? (judgment-call findings stay advisory either way)',
          answers.docDriftGatesCi ?? true,
        ));
    },
    plan: (context) => [
      { template: 'docs/documentation/diataxis-map.md', dest: 'docs/documentation/diataxis-map.md' },
      ...(context.answers.installDocDrift
        ? [{ copy: 'tools/doc-drift.mjs', dest: 'tools/doc-drift.mjs' }]
        : []),
    ],
  },
];

export { stackOptions };
