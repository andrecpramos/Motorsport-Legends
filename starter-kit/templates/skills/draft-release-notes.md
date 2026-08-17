---
name: draft-release-notes
description: Summarise a range of commits into release notes for {{project.name}}, with the deterministic risk score attached rather than re-estimated. Use when preparing a release or a deployment.
---

# Drafting release notes

The split to hold onto: **the risk score is computed, the explanation is written.** Anything a
script can determine, a script determines — the same diff must produce the same score every time,
or it is not usable as a gate and not defensible to an auditor. What a model adds is the layer
above: what changed, who it affects, and what to watch after it ships.

## Step 1 — get the facts

```
git log <previous-tag>..HEAD --format='%h %s (%an)'
git diff <previous-tag>..HEAD --stat
```
{{#if answers.installRiskCheck}}
```
node tools/release-risk.mjs <previous-tag>
```

Attach that score and its named contributing rules verbatim. **Do not restate the risk in your own
words, do not average it against your intuition, and do not soften it.** If it reads HIGH, the notes
say HIGH and name the rules that made it so.
{{/if}}

## Step 2 — group by who is affected

Not by commit, and not by file. A reader wants to know whether this release affects them.

- **Behaviour changes users will notice** — first, always, in plain language. No internal
  identifiers, no ticket numbers standing in for a description.
- **Breaking changes** — with the migration step spelled out. If a consumer has to do something,
  that instruction is the most important text in the document.
- **Fixes** — what was wrong, stated as the symptom someone experienced, not as the internal cause.
- **Internal / maintenance** — brief. Nobody outside the team reads this section, and padding it
  makes the sections above harder to find.
- **Security** — follow the project's disclosure practice. If a fix is not yet released everywhere,
  say less, not more.

Drop anything with no reader-visible consequence. A release note that lists every refactor is one
people stop reading, and then they miss the breaking change too.

## Step 3 — say what to watch

{{#if answers.primarySli}}
This project's primary signal is: **{{answers.primarySli}}**, targeted at {{answers.sloTarget}}.
{{/if}}

Name the specific metric or dashboard that would show this release going wrong, and the rollback
path from [`docs/ops/runbook.md`](../../../docs/ops/runbook.md).

{{#unless answers.rollbackExercised}}
Note honestly that the rollback path has **not** been exercised deliberately. Until it has, it is a
hypothesis rather than a procedure, and the release notes should not imply otherwise — the moment
you need it is the worst possible moment to find that out.
{{/unless}}

## Rules

- **Never invent a change you cannot see in the log or the diff.** If a commit message is too vague
  to summarise, read the diff; if it is still unclear, list it under its own heading as needing an
  author's description rather than guessing. A plausible invented entry is worse than a missing one
  because it will be believed.
- Write for someone who was not in the room. Expand acronyms once.
- Do not tag, publish or deploy. Draft the notes; a human releases.
