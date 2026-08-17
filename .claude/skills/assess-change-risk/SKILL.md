---
name: assess-change-risk
description: Check a proposed change to Motorsport Legends against the threat model, the hot-path table and the agent permission matrix before it is written or proposed. Use for anything touching input handling, auth, dependencies, CI or agent instruction files.
---

# Assessing a change before proposing it

Two kinds of risk matter here and they are different in kind. The first is ordinary: the change
introduces a vulnerability. The second is that the change alters what an *agent* can reach — and
that one is routinely missed, because the diff looks like configuration rather than like security.

## Step 1 — does this touch a hot path?

Hot paths are the files whose blast radius exceeds their line count. They are listed in
[`.sdlc-kit.json`](../../../.sdlc-kit.json) under `hotPaths`, with the reason each one is there.

```
node tools/release-risk.mjs
```

Use the score. Do not re-estimate it in prose — it is deterministic on purpose, so that the same
diff scores the same every time and every point is attributable to a named rule. Your job is to
*explain* what it flagged, which is the part it cannot do.

Four categories are hot in every project, regardless of what it does:

- **CI workflow files** — a change here can disable the checks that protect the release.
- **Agent instruction files** (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`,
  `.claude/`) — these affect every future generated change. This is the highest-value target in the
  repository and the least likely to be read carefully in review.
- **Lockfiles and dependency manifests** — supply chain surface.
- **Migrations** — hard to roll back.

## Step 2 — check the threat model

Read [`docs/security/threat-model.md`](../../../docs/security/threat-model.md).

This system handles authentication and sessions, personal data, user-supplied content. If the change touches any of that, the
threat model's section on it is the part to read closely rather than skim.

Then ask the questions generated code most often gets subtly wrong:

- **Is every authorisation check on the correct side of the decision?** Generated auth code is
  confident and frequently permissive — it works on the happy path, which is what makes it pass
  review.
- **Does anything sensitive reach a log, an error message, a test fixture or a prompt?** The leak is
  almost never the database; it is the diagnostic path nobody threat-modelled.
- **Is untrusted input treated as data everywhere it is used?** Including where it reaches a model.

## Step 3 — the agent as attack surface

This is the half that gets skipped. An agent reading an issue, a dependency README, a code comment
or a fetched page is reading **untrusted input, and that input can contain instructions**.

Prompt injection against a chatbot is embarrassing. Prompt injection against an agent holding a CI
token is a supply chain compromise, because the blast radius is not the conversation — it is
everything the agent can reach.


So, for this change:

- Does it widen what an agent can reach — new tool, new credential, new network egress, a broader
  permission in a workflow file?
- Does it add a path by which external content reaches an agent as if it were an instruction?
- Does it move any action with a side effect from "needs approval" to "unattended"? Check
  [`docs/security/agent-permissions.md`](../../../docs/security/agent-permissions.md).

The mitigation is never "detect injection better" — that is not reliably solvable. It is least
privilege plus human approval on side effects. Draw the line at **actions with consequences**, not
at anything about the model.

## Step 4 — secrets

Never read, echo, quote or paste the contents of: `.env`, `.env.*`, `*.pem`, `*.key`, `secrets/`.

If a secret is needed to test something, say which one and stop. If you find a committed secret,
report the file and stop — do not print the value, including "redacted" versions that reveal length
or prefix. Rotation is the fix; deleting the commit is not.

## Output

- Hot paths touched, with the reason each is hot.
- Threat model sections that apply, and specifically what could go wrong here.
- Whether the change alters the agent's reach — explicitly yes or no, never omitted.
- What you did not check.

Do not report a change as safe. Report what you checked and what you found; a human accepts the
risk.
