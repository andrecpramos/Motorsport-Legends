# Measurement plan — AI rollout for {{project.name}}

*Written {{meta.date}}. Baseline window: **{{answers.baselineWindow}}**.*

The argument this plan exists to settle: AI adoption raises throughput and lowers delivery
stability at the same time, because generation gets faster while verification does not. Whether
that trade lands well here is an empirical question about this team, and it cannot be answered
after the fact without a baseline.

---

## Baseline first

Collect **{{answers.baselineWindow}}** of data before broad enablement. No baseline means no
conclusion — you will be comparing against a memory, and memory of past velocity is reliably
flattering.

### The four DORA metrics, axes kept separate

Two measure throughput, two measure stability. Collapsing them into a single "productivity" number
is how measurement programmes die, because the composite hides the exact trade you are trying to
observe.

| Axis | Metric | How it is collected here |
|---|---|---|
| Throughput | Deployment frequency | TODO(setup) |
| Throughput | Change lead time (commit → production) | TODO(setup) |
| Stability | Change failure rate | TODO(setup) |
| Stability | Failed deployment recovery time | TODO(setup) |

{{#if answers.metricsNone}}
> **None of these are currently collected.** That is the common starting position and it is worth
> being blunt about what it means: without them there is no way to tell whether this rollout helped,
> and the question will get answered by whoever argues most confidently instead.
>
> Do not try to build all four at once. **Deployment frequency and change failure rate are the pair
> to start with** — one per axis, both derivable from deployment records you probably already have,
> and together they capture the trade this whole plan exists to observe.
{{/if}}
{{#if answers.metricsPartial}}
> Some of these are available. Fill in the rows you can collect today and leave the rest marked
> TODO rather than substituting a proxy — a metric that is nearly the right one produces confident
> conclusions about the wrong thing.
{{/if}}

### The fifth number, which is the one to watch

**Rework rate** — unplanned deploys made to fix a user-visible issue. It captures the specific
failure mode of an AI rollout: shipping fast, then shipping again to undo it. If exactly one metric
gets instrumented properly, make it this one.

### The qualitative half

Collect developer-reported effectiveness too, and treat disagreement between the reported and the
measured as **information rather than noise to resolve**. METR's randomised trial found experienced
developers took measurably longer with AI on repositories they knew well while believing they were
substantially faster. Later, larger cohorts pulled the effect size close to zero with a wide
confidence interval — so the honest summary is not "AI makes people slower", it is **self-report is
not measurement**, and the gap is widest exactly where people are most confident.

## Never apply these to individuals

These are system-level diagnostics. Attached to a performance review they get gamed within a
quarter, and the gaming destroys the signal for everyone, permanently. If leadership asks for a
per-developer productivity number, offer team-level DORA plus a qualitative review and explain the
gaming failure mode concretely.

## The rollback trigger

Decided in advance, on purpose. Deciding what counts as failure after you are already invested is
not a decision, it is a negotiation.

> **{{answers.rollbackTrigger}}**

If that condition is met, enablement is paused and the cause is investigated before it is resumed.
Pausing is not a verdict on the tooling — it usually means the verification capacity downstream
needs work first, which is the finding this whole plan is designed to surface.

## Guardrails during the rollout

- Batch size: watch median lines changed per pull request. AI's stability cost is partly a
  batch-size problem, and batch size is the cheapest thing on this list to measure and control.
- Review latency: if time-to-first-review climbs, the queue has formed and the bottleneck has moved
  to review, exactly as predicted.
- Revert rate on AI-authored changes specifically, if you can attribute them.

## What a good outcome looks like

Throughput up, stability flat or better, rework rate flat. If throughput is up and stability is
down, the tooling is working and the pipeline is the constraint — that is a platform investment,
not a reason to turn the tooling off.
