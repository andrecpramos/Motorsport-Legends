# Readiness assessment — Motorsport Legends

*Generated 2026-08-16 by the AI-SDLC starter kit, before any questions were asked.*

## Verdict: Not ready

This project has neither automated tests nor a pipeline, which means there is nothing downstream to absorb additional generated code. Adding AI assistance here will raise authoring speed into a system with no verification capacity, and the result shows up as delivery instability rather than as delivery. Build the verification half first — this kit will write the scaffolding for it, but the tests themselves are yours.

---

## Why this is the question

The finding worth internalising about AI in the software lifecycle is that adoption correlates with
higher throughput and better code quality, **and simultaneously with higher delivery instability**.
Those are not in tension by accident — they share a mechanism, and the mechanism is volume. Code
gets generated faster than review, testing and deployment can absorb it. The work is not removed,
it is relocated downstream.

Which makes AI an amplifier rather than a fix. In a project with good tests and a real pipeline it
improves speed and stability together, because the absorptive capacity is already there. In a
project without them it magnifies the friction that was already present. **The same tooling
produces opposite outcomes, and the variable is the project, not the tooling.**

So the useful question is not "is AI tooling configured here". It is: *can this project absorb more
code than it is currently producing?* Everything below is organised around that.

## What is here

| | |
|---|---|
| Files scanned | 187 |
| Source files | 106 |
| Test files | 0 (ratio 0.00) |
| Pipeline files | 0 |
| Commits | 14 from 1 contributor(s) |

Most common file types:
- `.tsx` — 60
- `.md` — 42
- `.ts` — 30
- `.glb` — 11
- `.mjs` — 11
- `.json` — 7

## The checks

6 of 15 checks satisfied. 2 critical gaps, 2 high.

### 🔴 Automated tests

*Verification capacity · critical gap*

No test files found. This is the single most important gap on this list.

**What happens about it:** Write tests before enabling AI broadly. Generated code without tests is unverified volume, which is exactly the failure mode DORA measures as instability.

### 🔴 Continuous integration

*Verification capacity · critical gap*

No CI pipeline found. Nothing runs automatically when a change arrives.

**What happens about it:** Phase 7 writes one. A pipeline is the absorptive capacity — without it, faster authoring just makes a longer queue of unverified changes.

### ✅ Declared test command

*Verification capacity*

Detected `cd app && npm test` from the Node / JavaScript / TypeScript conventions.

**What happens about it:** Phase 5 asks you to confirm it. It ends up in AGENTS.md and in the dev script, so both a human and an agent can run it without guessing.

### ✅ Agent instruction file

*Agent context*

Found: CLAUDE.md.

**What happens about it:** Phase 3 will not overwrite it — the generated version is written alongside for you to merge.

### ⚠️ Recorded decisions (ADRs)

*Agent context · high*

No decision log. Constraints live in people's heads, which means an assistant cannot see them and will re-propose rejected designs indefinitely.

**What happens about it:** Phase 2 creates the log and seeds it with your invariants.

### ⚠️ Subagent definitions

*Agent context · gap*

No subagent definitions. Every review, audit and triage starts from a blank prompt written from memory, so the quality of the work depends on who is asking and how tired they are.

**What happens about it:** Phase 3 installs a roster carrying the lessons from each lifecycle phase.

### ⚠️ Pull request template

*Review and traceability · gap*

No pull request template. Nothing prompts an author to say what they verified or which issue a change implements.

**What happens about it:** Phase 4 writes one, deliberately short — a template long enough to be annoying gets filled with "n/a".

### ⚠️ Ownership rules

*Review and traceability · gap*

No CODEOWNERS. Nothing routes changes in sensitive areas to the people who understand them.

**What happens about it:** Not written by this kit — it needs real usernames. Worth adding by hand for the hot paths you name in Phase 7.

### ✅ Meaningful history

*Review and traceability*

14 commits from 1 contributor, starting 2026-06-08.

**What happens about it:** The release risk scorer in Phase 7 reads this history.

### ✅ No committed secrets

*Security posture*

No .env files or key material found in the tree.

**What happens about it:** Phase 6 adds a scan to keep it that way.

### ✅ Secrets excluded from version control

*Security posture*

.gitignore covers .env files.

**What happens about it:** Phase 6 records the exclusion list, and it is worth adding those patterns to .gitignore by hand as well.

### ✅ Dependency lockfile

*Security posture*

A lockfile is present, so dependency versions are pinned.

**What happens about it:** Phase 6 covers the dependency policy; the lockfile itself is a hot path in the risk scorer.

### ⚠️ A way to run it locally

*Operability · high*

No single entry point for running this locally. Every new contributor — and every agent — reconstructs the commands from the README or from guesswork.

**What happens about it:** Phase 3 generates a dev script covering setup, check and run, and points AGENTS.md at it.

### ⚠️ README

*Operability · gap*

No README.

**What happens about it:** Phase 9 maps documentation by what a reader is doing, and the drift check keeps its links honest.

### ⚠️ Runbook or operational docs

*Operability · gap*

No runbook. The rollback procedure, if there is one, exists only in somebody's memory — and it will be needed at the hour that memory is least reliable.

**What happens about it:** Phase 8 writes one, including the prompt to actually exercise the rollback path.


## Reading this honestly

Every check above is a heuristic run against the file tree. It can see that test files exist; it
cannot see whether those tests assert anything meaningful, and a suite of assertion-free tests
passes this assessment while protecting nothing. See
[testing/test-strategy.md](testing/test-strategy.md) for why that distinction matters more than the
count.

It also cannot see the things that are not in the repository: whether branch protection is on,
whether anyone reads the pipeline output, whether the rollback path has ever been exercised. Those
are usually where the real gaps are, and the wizard asks about them directly because no amount of
scanning would find them.

Treat this as the starting point of a conversation with your team, not as a score.

## What to do with the gaps

In this order, because the order is what makes the difference:

1. **Critical gaps first, before broad AI enablement.** A project with no tests and no pipeline
   does not need a better instruction file first. It needs somewhere for the extra output to land.
2. **Then agent context** — `AGENTS.md` and the decision log. Highest ratio of impact to effort
   once the foundations hold.
3. **Then everything else**, at whatever pace the team can sustain.

Re-run `node starter-kit/setup.mjs --dry-run` after closing a gap to see this assessment change.
