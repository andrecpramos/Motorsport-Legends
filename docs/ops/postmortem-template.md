# Postmortem: <short description of the user impact>

- **Date of incident:** YYYY-MM-DD
- **Duration:** <detection to resolution>
- **Author:** <name>
- **Status:** Draft | Reviewed

> **Blameless.** The purpose is to find the conditions that made the failure possible, not the
> person who was closest to it when it happened. A postmortem that names an individual as the cause
> stops being read honestly, and honest reading is the only thing it produces.

---

## Impact

What users experienced, in their terms and with numbers. "Four hundred customers received an
invoice with the wrong total" — not "the pricing service degraded". If the impact is expressed in
internal terms, the severity will be argued about instead of addressed.

## Timeline

All times UTC. Include the change that introduced the problem, even if it was weeks earlier — the
gap between introduction and detection is usually the most informative number in the document.

| Time | Event |
|---|---|
| | The change that introduced the fault was merged |
| | It reached production |
| | First user impact |
| | First detection — **and by what: an alert, or a customer?** |
| | Mitigation began |
| | Service restored |

If detection came from a customer rather than from monitoring, that is a finding on its own, and
usually a bigger one than the original bug.

## What happened

The technical narrative. Precise about mechanism: not "a rounding bug", but which operation rounded
at which point, and why that produced this magnitude of error.

## Why it was not caught

Walk each layer that should have stopped it and say specifically why it did not. Vagueness here is
what makes the action items useless.

- **Requirements:** was the correct behaviour actually specified?
- **Review:** was this change reviewed, and was the defect visible in the diff?
- **Tests:** was there a test for this behaviour? If it existed and passed, what was it asserting
  instead of the thing that mattered?
- **Pipeline:** would any gate have caught it?
- **Monitoring:** why did detection take as long as it did?

<!-- If the change was AI-assisted, say so plainly here and describe what the assistant did and
     what the human verified. Not to assign blame — to answer the question the governance
     measurement plan is asking, which is whether the failure mode is systematic. -->

## Root causes

Usually several, and rarely a single line of code. The bug is the proximate cause; the reason the
bug survived every check is the interesting part.

## Action items

Specific, owned, dated. Vague action items are how a postmortem becomes a document that was written
rather than a change that was made.

| Action | Type | Owner | Due |
|---|---|---|---|
| | Prevent / Detect / Mitigate | | |

Prefer **detect** items to **prevent** items when the choice exists. You cannot prevent every class
of defect, but you can shorten the time from introduction to detection, and that shortening applies
to the failures you have not imagined yet.

## What went well

Include this honestly. If the rollback was fast because someone had exercised it, that is the
practice you want repeated, and it is invisible unless it is written down.

## Follow-ups for the risk model

Update the hot-path table in `.sdlc-kit.json` if this incident came from a file that was not
weighted. **That table should be derived from incidents, not from intuition** — this is the moment
it gets more accurate, and it is the step most often skipped.
Add the failure to the "Common failures" section of [runbook.md](runbook.md).
