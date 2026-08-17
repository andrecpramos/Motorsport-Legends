---
name: clarify-requirements
description: Attack a feature request or issue for ambiguity, contradiction and untestable criteria, then rewrite it as acceptance criteria specific enough to become tests. Use before any implementation work on {{project.name}} begins.
---

# Clarifying a requirement before building it

A language model will not tell you that a requirement contradicts itself. It resolves the
contradiction silently, picks one reading, and builds it with total confidence. That is what makes
ambiguity more expensive than it used to be — it now gets implemented before anyone notices.

So the highest-value thing to do with a brief is **attack it**, not build it. This skill runs that
attack and produces criteria that can actually fail.

## Step 1 — attack the brief

Work through [`docs/requirements/ambiguity-checklist.md`](../../../docs/requirements/ambiguity-checklist.md)
and report, specifically:

- **Undefined terms.** Every noun that could mean two things to two readers. "Active user",
  "recent", "large file" — each needs a number or a definition.
- **Contradictions.** Two statements that cannot both be satisfied. Quote both.
- **Unhandled cases.** Empty, zero, one, maximum, negative, duplicate, concurrent, already-exists,
  already-deleted, partially-failed. Which does the brief not say anything about?
- **Untestable criteria.** Anything that cannot be made to fail. "Handles large volumes correctly"
  cannot fail. "150,000 units is charged €630.00" can.
- **Assumed context.** Things true of this project that the brief relies on without saying. Check
  them against [`AGENTS.md`](../../../AGENTS.md) and `docs/adr/` — a brief that quietly contradicts
  a decision record is the expensive case.

For each finding: quote the text, say what is ambiguous, and give the two or more readings that are
consistent with it. Two readings is the proof that it is ambiguous — without them it is an opinion.

## Step 2 — ask, do not resolve

Put the questions to a human. **Do not pick a reading and proceed.** Picking silently is precisely
the failure this skill exists to prevent, and a confident implementation of the wrong reading costs
more than the delay of asking.

If you must proceed without answers, state each assumption explicitly at the top of your output and
mark it `TODO(setup):` in whatever you write, so it surfaces rather than settling in.

## Step 3 — rewrite as testable criteria

Use [`docs/requirements/story-template.md`](../../../docs/requirements/story-template.md).

Every acceptance criterion must name **a concrete input and the exact expected output**. The test is
mechanical: could someone write a test from this line alone, and could that test fail?

| Not this | This |
|---|---|
| Handles invalid input gracefully | An empty `email` field returns 422 with `{"error":"email required"}` |
| Should be fast | The p95 for `GET /orders` stays under 300ms at 50 concurrent requests |
| Discount applies to bulk orders | 149,999 units → €0.0045/unit; 150,000 units → €0.0042/unit |

Note the third row. Where there is a threshold, write criteria for **both sides of the boundary**.
Boundaries are where the defects are, and a single-sided criterion produces a single-sided test.

## Step 4 — scenarios

Where the project uses them, express the criteria as Given/When/Then in
`docs/requirements/*.feature`, following [`example.feature`](../../../docs/requirements/example.feature).
One scenario per behaviour. If a scenario needs "and" three times in its Given, the setup is doing
too much and the scenario is testing more than one thing.

## Output

1. The ambiguity findings, most consequential first.
2. The open questions, as a numbered list a human can answer in one pass.
3. The rewritten criteria — clearly marked as provisional wherever it rests on an unanswered
   question.

Finish by naming what you did **not** cover, so nobody mistakes this for a complete specification.
