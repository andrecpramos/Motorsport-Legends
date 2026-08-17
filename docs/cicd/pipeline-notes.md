# Pipeline — Motorsport Legends

CI system: **GitHub Actions**.

The pipeline is where the governance argument gets settled. It is the absorptive capacity — the
thing that decides whether more generated code becomes more delivered value, or just a longer queue
of unverified changes. Every hour spent here is worth several spent choosing an assistant.

---

## Anatomy

`build → test → scan → artifact → deploy`

**The ordering principle: cheapest and most likely to fail goes first.** A developer waiting twelve
minutes to be told about a lint error has been failed by the pipeline design, not by the linter.
Order the stages by (probability of failure) ÷ (time to run), highest first, and the median
feedback time drops without removing a single check.

## What gates, and what only reports

This distinction is the most consequential design choice in the file, and it is usually made by
accident.

| Stage | Gates the merge? | Why |
|---|---|---|
| Tests | **Yes** | A red suite is a factual claim that something is broken |
| Lint | **Yes** | Cheap, fast, unambiguous |
| Coverage | **No** — reported only | A coverage gate produces tests written to raise coverage. See [../testing/test-strategy.md](../testing/test-strategy.md) |
| Secret scan | **Yes** | A hit is treated as a leak and triggers rotation, not assessment |
| Release risk | No — comments on the pull request | It is an input to a human decision, not a verdict |
| Documentation drift | **Yes**, on broken links only | A broken link is a fact; "is this paragraph still accurate" is a judgment and stays advisory |

The general rule: **gate on facts, report on judgments.** A gate that fires on a judgment call gets
argued with, then bypassed, then removed — and it takes the credibility of the other gates with it.

## Least privilege

The pipeline's token defaults to read-only and is widened per job. A broad default token is the
blast radius from [../security/threat-model.md](../security/threat-model.md), pre-authorised.

```yaml
permissions:
  contents: read
```

## The release risk score

`node tools/release-risk.mjs` scores a diff out of 100 from named rules, and comments the result on
the pull request.

**It is deterministic on purpose, and that is the interesting design decision.** Risk assessment
has to be reproducible, explainable to an auditor, and identical on every run for the same diff.
Ask a model how risky a release is and you get a different answer each time, with no way to justify
it to a change advisory board. Every point in this score is attributable to a rule with a name.

The right place for AI is the layer *above* it: explaining why a flagged file is risky, drafting
the release note, and triaging the failure when the pipeline goes red. Knowing which half is which
is most of the skill.

The hot-path table lives in `.sdlc-kit.json`. **Update it after every postmortem** — it should be
derived from where incidents actually came from, not from intuition about where they might.

## Deployment

TODO(setup): describe how a change reaches production, and — more importantly — how it is taken
back out.

The rollback path is the part to write down, because it is the part you will need under pressure.
A rollback procedure that has never been executed is a hypothesis. Exercise it on a quiet
afternoon, not during the incident.
