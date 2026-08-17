---
name: pre-pr-check
description: Run the local gate, walk the review checklist and fill in the pull request template before opening a PR on {{project.name}}. Use when a change is finished and about to be proposed.
---

# Before opening a pull request

Review is where the volume problem lands. If authoring gets faster and review does not, the queue
forms here — and the way teams relieve that pressure is by reviewing less carefully, which is
invisible until something ships. Everything mechanical that can be settled before a human opens the
diff is review capacity handed back to them.

## Step 1 — run the gate

{{#if answers.hasDevScript}}
```
{{answers.devEntryPoint}} check
```

That is lint, then tests, then build — ordered cheapest-and-most-likely-to-fail first, the same
principle as the pipeline.
{{/if}}
{{#unless answers.hasDevScript}}
{{#if project.hasLintCommand}}
- Lint: `{{project.lintCommand}}`
{{/if}}
{{#if project.hasTestCommand}}
- Tests: `{{project.testCommand}}`
{{/if}}
{{#if project.hasBuildCommand}}
- Build: `{{project.buildCommand}}`
{{/if}}
{{/unless}}

**Actually run it.** Reporting a change as done without running the suite is the single fastest way
to lose a reviewer's trust, and it is not recoverable in one PR. If something fails and you cannot
fix it, say so plainly with the output — a failing gate reported honestly is useful; a failing gate
not mentioned is a defect you introduced into the review process.

{{#if answers.installDocDrift}}
Also run `node tools/doc-drift.mjs` if the change moved, renamed or deleted any documentation file.
{{/if}}
{{#if answers.installRiskCheck}}
Run `node tools/release-risk.mjs` on the diff. If it comes back HIGH, the right response is usually
to **split the change**, not to argue with the score.
{{/if}}

## Step 2 — review your own diff first

Read the whole diff, not just the files you remember editing. Walk
[`docs/review/review-checklist.md`](../../../docs/review/review-checklist.md), and look hardest at
the things that are cheap to miss:

- **Deletions.** Anything removed — a guard, a branch, a check — leaves no trace for a reader to
  reason about. Confirm every removal was deliberate.
- **Tests that would not fail.** For each new test: if you reverted the source change and kept the
  test, would it go red? If not, it asserts nothing.
- **Invariants.** Check the change against
  [`docs/adr/0002-project-invariants.md`](../../../docs/adr/0002-project-invariants.md). Breaking
  one is a defect even when the suite is green.
- **Scope.** Anything in the diff that is not required by the stated change — an unrelated rename, a
  drive-by reformat, an abstraction added for a future caller — comes out. It hides the real change
  from review, which is a cost paid by someone else.
{{#if answers.dependencyPolicyNever}}
- **Dependencies.** This project does not accept assistant-added dependencies. If the change needs
  one, stop and propose it separately.
{{/if}}

## Step 3 — fill in the PR description

Use [`.github/PULL_REQUEST_TEMPLATE.md`](../../../.github/PULL_REQUEST_TEMPLATE.md), and write it
for a reviewer who has not seen the conversation that produced the change.

{{#if answers.traceabilityRule}}
**Name the issue or decision this implements.** It is required here — untraceable changes are where
scope creep hides.
{{/if}}

State plainly which parts were AI-authored. Not as a disclaimer, but because it tells the reviewer
where to look: generated code fails in specific, recurring ways, and a reviewer who knows which
hunks to read that way finds more.

Say what you tested and what you did not. The gaps you name are the gaps a reviewer can cover; the
gaps you hide are the ones that ship.

## What this does not do

{{#if answers.humanReviewAlways}}
This does not substitute for review. Every change here is reviewed by a named human who is not the
person who prompted it, and nothing in this procedure changes that.
{{/if}}
{{#unless answers.humanReviewAlways}}
This does not substitute for review. It covers the mechanical layer; the judgment layer — should
this change exist, does it fit the architecture, was the requirement understood — is a human's.
{{/unless}}

Do not merge, and do not approve your own change.
