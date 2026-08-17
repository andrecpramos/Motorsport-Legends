# AI-SDLC starter kit

A guided setup that gives a new project the foundation this repository spends ten phases arguing
for: instruction files an assistant will actually read, a decision log that keeps it consistent, a
threat model that reflects what agents can reach, a pipeline, SLOs, and two deterministic checks
that run in CI.

It reads the repository first and tells you what it found, asks around thirty-five questions across
ten phases, explains why each one matters, and writes roughly thirty files. Everything it writes is
meant to be edited afterwards.

---

## Use it

Copy the `starter-kit/` directory into a project and run it:

```bash
cp -r starter-kit /path/to/your-project/
cd /path/to/your-project
node starter-kit/setup.mjs
```

Or run it against another directory without copying anything:

```bash
node starter-kit/setup.mjs --target=../your-project
```

On Windows, `starter-kit\setup.cmd` does the same thing and can be double-clicked. On macOS and
Linux, `./starter-kit/setup.sh`.

**Requirements:** Node 22 or newer. No dependencies, and there never will be — the point is that
this still runs in two years without an `npm install` that resolves differently than it does today.

## Flags

| Flag | Effect |
|---|---|
| `--target=<dir>` | Set up a different directory. Defaults to the current one. |
| `--dry-run` | Show the full plan and write nothing. |
| `--yes` | Accept every default. No questions asked. |
| `--only=<phase>` | Re-run one phase — by id (`security`) or number (`6`). Leaves `docs/FOUNDATION.md` alone. |
| `--force` | Overwrite existing files instead of asking. Rarely what you want. |
| `--interactive` | Ask the questions even when stdin is not a terminal. Useful under task runners that report no TTY, and for driving the wizard from a script. |
| `--here` | Proceed even though the target looks like the kit's own repository rather than a project. |
| `--help` | This file. |

The kit refuses to run when the target contains nothing but the kit itself — no manifest, no source
tree — because that is almost always the repository that ships it rather than a project someone
means to set up. Carrying a copy of `starter-kit/` is *not* on its own a reason to refuse, since
copying it in is the documented way to use it. `--dry-run` bypasses the check, as nothing is
written; `--here` overrides it outright.

## The assessment

Before the first question, the kit reads the file tree and answers one thing: **can this project
absorb more code than it is currently producing?**

That is the question, rather than "is AI tooling configured", because of the finding underneath all
of this — AI adoption raises throughput and code quality and simultaneously raises delivery
instability, since generation gets faster while review, testing and deployment do not. AI is an
amplifier, and what it amplifies is whatever is already there.

So it scores fifteen checks across five capacities — verification, agent context, review and
traceability, security posture, operability — and returns a verdict of **Not ready**, **Fragile**,
**Workable** or **Ready**. A project with no tests and no pipeline gets told plainly that it does
not need a better instruction file first; it needs somewhere for the extra output to land. The
report is written to `docs/ASSESSMENT.md` as a dated baseline.

## The agent roster

Eight subagent definitions for `.claude/agents/`, each carrying the lesson from the phase it
belongs to: `code-reviewer`, `test-strategist`, `security-reviewer`, `requirements-auditor`,
`adr-author`, `build-triage`, `incident-responder`, `doc-keeper`.

The reason to define them as files rather than typing prompts is that a file is somewhere
corrections accumulate. When an agent gets something wrong, the fix goes into its definition and
every future run inherits it. All the reviewers are read-only, and none of them approve or merge.

## The skills

Six procedures for `.claude/skills/`: `write-adr`, `clarify-requirements`, `pre-pr-check`,
`assess-change-risk`, `draft-release-notes`, `write-postmortem`.

An agent is a role you delegate to — its own context, its own scoped tools, reports back. A skill is
a procedure the assistant you are already talking to loads on demand, so a recurring job gets done
the same way every time. Reviewing code is an agent; writing an ADR in this repository's format is a
skill.

Each skill drives a document the kit writes in the same run. That pairing is the reason to install
them together: a procedure with nothing to reference is a prompt, and a document with no procedure
attached is one nobody opens at the moment it would have helped.

## The dev script

`dev.bat` and `dev.sh`, covering `setup`, `check`, `test`, `lint`, `build`, `run` and `audit`, with
the bare command running the whole loop. `AGENTS.md` points at it rather than listing commands
separately, so "how do I actually run this?" — the question no repository answers reliably — has
exactly one answer that a human and an assistant both read.

`dev.bat check` is the pre-PR gate: lint, then tests, then build, ordered cheapest-and-most-likely-
to-fail first, the same principle as the pipeline.

## What it produces

| Phase | Artifacts |
|---|---|
| — · Assessment | Readiness verdict and gap report, before anything is written |
| 0 · Governance | AI usage policy, measurement plan with a pre-committed rollback trigger |
| 1 · Requirements | Ambiguity audit prompt and checklist, story template, scenario template |
| 2 · Architecture | ADR log, template, and a decision record holding your invariants |
| 3 · Implementation | `AGENTS.md`, tool pointers, the dev script, the `.claude/agents/` roster and the `.claude/skills/` procedures |
| 4 · Review | Review checklist split by what humans and machines are each good at, PR template |
| 5 · Testing | Test strategy built around the coverage trap and mutation testing |
| 6 · Security | Threat model covering generated code *and* the agent as attack surface, permission matrix |
| 7 · CI/CD | Pipeline for GitHub Actions or GitLab CI, release risk scorer, failure triage prompt |
| 8 · Operations | SLOs and error budget, runbook, postmortem template |
| 9 · Documentation | Diátaxis map, documentation drift detector |

Plus `docs/FOUNDATION.md`, which indexes all of it and lists what is still yours to decide.

## Design notes

Three choices worth explaining, because they are the ones people usually get wrong.

**Defaults are real answers, not empty strings.** Every question has a default that a sensible team
would actually choose, which is what makes `--yes` produce something usable rather than a directory
of blanks. Where the wizard genuinely cannot decide, it writes `TODO(setup)` — and the documentation
drift check finds those, so the unfinished parts become a CI finding instead of a silent lie.

**Nothing you have edited is overwritten without being asked.** The kit is designed to be re-run —
after a postmortem, after a new hire, after the architecture changes. A scaffolder that clobbers an
edited `AGENTS.md` on its second run only ever gets run once.

**Your answers configure the checks, not just the prose.** `.sdlc-kit.json` is read at runtime by
`tools/release-risk.mjs` and `tools/doc-drift.mjs`. Naming your hot paths during setup configures a
CI gate; it does not just produce a paragraph nobody revisits.

## How it is put together

```
starter-kit/
  setup.mjs          the wizard
  lib/
    steps.mjs        the assessment plus ten phases: what each explains, asks and writes
    assess.mjs       the readiness checks — what is here, what is missing, what it means
    ui.mjs           prompts and terminal output
    render.mjs       a very small template renderer
    derive.mjs       answers to the labels and conditionals templates need
    detect.mjs       stack detection and per-stack commands
    writer.mjs       rendering to disk without destroying existing work
    state.mjs        .sdlc-kit.json
  templates/         everything it writes — plain markdown, readable as-is
```

The templates are the deliverable. They are ordinary Markdown with `{{placeholders}}`, meant to be
opened and edited directly. If a rule in one of them is wrong for your team, change the template
rather than the output — you will run this again.

## Adding a phase or changing a question

Edit [lib/steps.mjs](lib/steps.mjs). Each step declares its explanation, its questions and the files
it writes; adding one is a matter of appending an object to the array and dropping a template into
`templates/`. Anything a template needs beyond a raw answer — a label, a conditional — is computed
in [lib/derive.mjs](lib/derive.mjs), because the renderer deliberately has no expressions.
