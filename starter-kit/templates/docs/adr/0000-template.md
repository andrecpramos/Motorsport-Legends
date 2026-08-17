# ADR-NNNN: <short title, phrased as the decision made>

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Deciders:** <names — a decision with no name attached is a rumour>

## Context

What is true that forces a decision now? Constraints, requirements, the thing that broke, the scale
you have to hold. Write this before writing the decision — if this section is thin, the decision is
not ready, and writing it out is how you find that out cheaply.

State the forces in tension explicitly. A decision with no trade-off was not a decision.

## Decision

One paragraph, in the active voice, stating what will be done. Precise enough that a reader can
tell whether a given pull request complies with it.

> We will …

## Consequences

### What this makes easy

### What this makes hard

Be honest here. This section is what a future reader uses to decide whether the decision still
holds, and an ADR with no downsides listed reads as advocacy rather than analysis.

### What this forbids

The part an agent needs most. Name the plausible-looking changes this decision rules out, because
those are exactly the ones that will be proposed.

## Alternatives considered

### <Alternative A>

Why it was rejected. Not "it was worse" — the specific property that disqualified it.

### <Alternative B>

## How this is enforced

A decision that is only written down decays. Say what makes it stick:

- A test that fails if it is violated — the strongest option, always prefer it.
- A lint rule or type.
- A line in `AGENTS.md`, so assistants see it.
- A review checklist item.
- Nothing yet. Acceptable, but say so, so the gap is visible rather than assumed covered.
