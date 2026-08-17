# SLOs and telemetry — {{project.name}}

Two of the four DORA metrics are stability metrics, and both are measured here. If AI assistance
moves change failure rate or recovery time, operations is where you find out — which makes this the
feedback loop for every phase upstream of it.

---

## The service level objective

**Indicator:** {{answers.primarySli}}

**Objective:** {{answers.sloTarget}}

TODO(setup): write the precise definition of the indicator — which requests count, which are
excluded, and measured at which point in the stack. An SLO whose numerator and denominator are
ambiguous produces arguments during incidents, which is the worst possible time to be having them.

## The error budget, which is the point

The objective above implies a budget: the amount of failure allowed in the window before the
objective is missed. At {{answers.sloTarget}}, work out what that is in minutes or in requests and
write it here.

The budget is what makes an SLO more than a number on a wall. It converts "should we ship this
risky change?" from an argument about temperament into arithmetic about how much budget remains.
When the budget is healthy, ship and take the risk. When it is nearly spent, stop shipping features
and spend the effort on reliability instead.

**Policy when the budget is exhausted:** TODO(setup). Write it now, while nothing is on fire. A
budget policy invented mid-incident is a negotiation, not a policy.

## What to instrument

Structured events, not prose log lines. The difference is whether a question can be answered by a
query or only by reading.

- **The SLI itself**, recorded at the boundary the user experiences — not deep inside where it
  looks better.
- **Deploy markers.** Without them you cannot correlate a regression with a release, which is the
  single most common thing you will want to do at 2am.
- **The business-critical quantities.** Whatever this system produces that matters if it is wrong:
  totals, counts, balances, decisions. Alert on the aggregate moving unexpectedly, not only on
  errors — the worst incidents produce no errors at all, just wrong answers delivered successfully.
- **Saturation.** Queue depths, connection pools, disk. These predict the incident rather than
  reporting it.

## Tracing

TODO(setup): name the tracing setup, if there is one.

Span attributes worth adding wherever they exist, because they are the ones you will filter on:

- The identifier of the entity being operated on, so a single user's problem can be found.
- The version or commit that served the request, so "since when" is answerable.
- Whether the operation was a retry.

## Alerting

**Alert on symptoms, not causes.** "Success rate below target" is worth waking someone up for.
"CPU above 80%" is not — it might be entirely fine, and pages that are sometimes fine train people
to dismiss pages.

Every alert needs three things or it should not exist:

1. A human-readable statement of what the user is experiencing right now.
2. A link to the runbook entry for it — see [runbook.md](runbook.md).
3. A named first responder. {{#unless answers.onCall}}TODO(setup): there is no on-call rotation for this service yet. Decide who gets paged before writing an alert that pages them.{{/unless}}

An alert with no runbook is a page that says "something is wrong, good luck", and the person
receiving it will be least equipped to improvise at the hour it fires.

## Where AI helps in operations

Genuinely well:

- Correlating an anomaly with recent deploys, config changes and dependency updates. Mechanical
  cross-referencing across sources, done fast, under time pressure.
- Summarising a long noisy log into the three lines that changed.
- Drafting the postmortem timeline from the raw event stream — see
  [postmortem-template.md](postmortem-template.md). This saves real hours at a moment when the
  people who have the context are exhausted.

Where it should not be:

- Deciding to roll back. That is an accountable judgment under uncertainty with real consequences,
  and the value of having a human on call is precisely that someone is answerable for it.
- Anything that acts on production directly. The [permission line](../security/agent-permissions.md)
  does not relax because there is an incident on; if anything it matters more, because that is when
  approvals are most likely to be rushed.
