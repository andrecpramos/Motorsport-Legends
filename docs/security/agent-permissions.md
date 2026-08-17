# Agent permissions — Motorsport Legends

The line is **side effects, not intelligence**. An agent may read, reason and propose freely. It
needs an accountable human before anything with a consequence that outlives the session.

Current configuration: **the ability to push branches and open pull requests**.

---

## The matrix

| Action | Unattended | Needs approval | Never |
|---|---|---|---|
| Read source, tests, documentation | ✅ | | |
| Run the test suite | ✅ | | |
| Run linters and formatters | ✅ | | |
| Write files inside the working tree | ✅ | | |
| Create a branch | ✅ | | |
| Open a pull request | ✅ |  |  |
| Merge a pull request | | ✅ | |
| Install or add a dependency |  |  | ✅ |
| Run an arbitrary shell command | | ✅ | |
| Make an outbound network call to a new host | | ✅ | |
| Push to the default branch | | | ✅ |
| Deploy | | ✅ | |
| Read `.env`, `.env.*`, `*.pem`, `*.key`, `secrets/` | | | ✅ |
| Modify `AGENTS.md`, `CLAUDE.md` or CI workflows | | ✅ | |
| Rewrite git history | | | ✅ |

The last two rows are the ones people get wrong. An agent that can edit its own instruction file
can widen its own permissions, and an agent that can edit the pipeline can disable the check that
would have caught it. Both are privilege escalation even though neither looks like it.

## Least privilege in the pipeline

Default the CI token to read-only and widen it per job, never globally:

```yaml
permissions:
  contents: read
```

An agent that runs in CI inherits whatever the token can do. A broad default token is not a
convenience, it is the blast radius in the [threat model](threat-model.md), pre-authorised.


## Approval is not a formality

An approval that is always granted is a log entry, not a control. If every agent action gets waved
through, the gate has been removed and nobody noticed — which is worse than not having one, because
the risk register still says it is there.

If approvals are being rubber-stamped, the honest fix is to widen the unattended column for the
actions that genuinely do not matter, so the remaining approvals get real attention.
