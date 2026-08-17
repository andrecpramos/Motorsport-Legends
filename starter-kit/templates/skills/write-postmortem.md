---
name: write-postmortem
description: Build an incident timeline from evidence and draft a blameless postmortem for {{project.name}}. Use during or after an incident, or when a near miss is worth recording.
---

# Drafting a postmortem

This is what AI is genuinely good at in operations: correlating a spike with a deploy, summarising a
noisy log, assembling a timeline from a raw event stream. It is not what should decide to roll back.
Keep the judgment with the human and give them a faster path to the evidence.

## While the incident is live

**Do not touch production.** Not to restart a service, not to scale a thing, not to "just check" by
running a command that has a side effect. Read, correlate, report.

The useful contribution during an incident is a timeline that is being built while people are busy,
so that afterwards nobody has to reconstruct it from memory — which is where postmortems lose their
accuracy.

## Step 1 — assemble the timeline from evidence

Every entry needs a timestamp, a source, and a link. Sources, in order of reliability:

1. Deploy and merge history — `git log`, the pipeline's run history.
2. Alerts and monitoring, with the exact firing time rather than the time someone noticed.
3. Logs at the boundary of the affected component.
4. Human accounts. Last, and marked as such: recollection is evidence, but it is the weakest kind
   and it reorders itself to fit the story people already believe.

Mark every inference as an inference. "Deploy at 14:02, error rate rose at 14:04" is an observation.
"The deploy caused it" is a hypothesis, and labelling it as one is the difference between a
postmortem and a story.

Correlation to check first, because it is right most often and cheap to test: **what changed?**
Most incidents follow a change. Not all — say so when the timeline does not support it, rather than
forcing the shape.

## Step 2 — draft the document

Use [`docs/ops/postmortem-template.md`](../../../docs/ops/postmortem-template.md).

Fill in what the evidence supports and leave `TODO(setup):` markers everywhere it does not. The gaps
are useful information — they show where the system could not be observed, and that is frequently
the most actionable finding in the whole document.

Include:

- **Impact in user terms first.** How many people, for how long, unable to do what. Not "the queue
  backed up" — "checkout failed for roughly 4% of users for 31 minutes".
- **Detection.** How was it found, and how long after it started? If a customer found it before
  monitoring did, that is the finding.
- **Contributing factors, plural.** Single root causes are usually an artifact of stopping the
  analysis early. Ask what made this failure possible, what made it hard to see, and what made it
  slow to fix — three different questions with three different answers.
- **Recovery**, and whether the documented procedure in the runbook actually worked.

## Step 3 — keep it blameless, properly

Blameless does not mean vague. It means the analysis targets the system, not the person: what made
this mistake easy to make and hard to catch?

- Never name an individual as a cause. Name the system that let the change through.
- "The engineer forgot to X" is not a finding. "Nothing checks X before deploy" is.
- Do not soften the technical facts to spare anyone. Vagueness protects nobody and teaches nothing.

## Step 4 — actions

Each one gets an owner and a date, or it is not an action. Prefer changes that make the failure
class impossible or immediately visible over changes that ask people to be more careful — "add
validation at the boundary" outlives "remember to check".

Then close the loop the rest of this repository depends on:

{{#if answers.installRiskCheck}}
- **Update the hot-path table** in [`.sdlc-kit.json`](../../../.sdlc-kit.json) if the incident came
  from a file the score did not flag. That table is meant to be derived from where incidents
  actually come from, not from intuition, and this is the moment that derivation happens.
{{/if}}
- **Add a rule to [`AGENTS.md`](../../../AGENTS.md)** if an assistant contributed to the incident.
  Instruction files are a record of corrections; this is a correction.
- **Write an ADR** if the fix changes something expensive to reverse.
- **Add a test** that would have caught it — before closing the incident, not "later".

## Output

The drafted postmortem, with every gap marked. Then, separately, the list of things you could not
determine from the evidence available — that list is what improves observability next quarter.

Do not assign blame, do not mark the incident resolved, and do not close actions. A human does all
three.
