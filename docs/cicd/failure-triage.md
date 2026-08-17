# Triaging a red pipeline

A failing build is the case where AI assistance pays off immediately and with almost no risk. The
input is a wall of log output, the task is finding the signal in it, and the cost of a wrong answer
is low because the next step is verification anyway.

The thing to be disciplined about: **AI proposes the diagnosis, the human confirms it before
anything is changed.** The failure mode is a plausible explanation accepted without checking, which
sends someone down a two-hour path fixing something that was not broken.

---

## The triage prompt

```text
A CI job failed. Below are the job configuration, the failing step's output, and the diff being
tested.

Answer in this order and stop when you cannot support an answer with evidence from the input:

1. CLASSIFICATION — one of:
   - Genuine defect in the change under test
   - Flaky test (timing, ordering, shared state, network)
   - Environment or infrastructure failure
   - Pipeline configuration error
   - Pre-existing failure unrelated to this change

2. EVIDENCE — quote the specific lines that support the classification. If the output does not
   contain enough to classify it, say so and name what additional output you would need.

3. FIRST ACTION — the single next thing a human should check. Not a list. The one thing.

4. CONFIDENCE — high, medium or low, and what would change it.

Do not propose a fix yet. Classification first; a fix proposed before the cause is understood is
how a flaky test becomes a permanently disabled test.

---
CONFIG:
<paste the job definition>

OUTPUT:
<paste the failing step's output, including the lines before the first error>

DIFF:
<paste the diff under test>
```

## Why classification comes before the fix

The five classes have completely different correct responses, and getting the class wrong is more
expensive than getting the fix wrong:

- A **genuine defect** should fail the build. Working around it is the worst outcome available.
- A **flaky test** must be fixed or quarantined with an owner and a date. Retrying it until it
  passes trains the whole team to ignore red builds, and that habit is nearly impossible to
  reverse.
- An **environment failure** is a retry — and if it recurs, a platform issue rather than a
  developer one.
- A **pipeline configuration error** is a change to the pipeline, which is a hot path in the risk
  scorer for exactly this reason.
- A **pre-existing failure** means the branch is not the problem, and the correct action is to stop
  and find out why main is red.

## Flaky tests specifically

Retrying a flaky test until it passes is the most damaging habit available in CI, because it works.
It removes the symptom, keeps the defect, and teaches everyone that red does not necessarily mean
broken.

The rule worth adopting: a test that has flaked gets an issue with a named owner and a date. It is
either fixed or removed. Quarantine with no expiry is deletion with extra steps and a worse
conscience.

## What not to hand to a model

The decision to override a failing gate. That is an accountability question, not a technical one,
and the value of a gate comes entirely from a human being answerable for bypassing it.
