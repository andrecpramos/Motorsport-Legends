# AI usage policy — {{project.name}}

*Written {{meta.date}}. Owner: TODO(setup). Review: every six months, and after any incident
involving generated code.*

The purpose of this document is to have written answers to six questions **before** an incident
rather than during one. Every question below has a real answer for this project; where it says
`TODO(setup)`, the answer has not been decided yet, and that is itself worth knowing.

Data classification for this repository: **{{answers.dataClassificationLabel}}**.

---

## 1. Model routing by data classification

What code and data may be sent to which model.

{{#if answers.classificationRegulated}}
This repository handles regulated or customer data, so routing is a compliance control and not a
preference.

| Content | May be sent to |
|---|---|
| Source code, tests, configuration without secrets | Approved enterprise endpoints with a zero-retention agreement |
| Customer data, production records, personal data | **Nothing.** Not to any model, not in a prompt, not as a test fixture |
| Secrets, credentials, key material | **Nothing**, ever |
| Logs and traces | Only after scrubbing — assume they contain identifiers until proven otherwise |

The relevant regimes are TODO(setup): name them — GDPR, the EU AI Act, sector rules. Where
inference physically runs matters for data residency, so record the region here.
{{/if}}
{{#unless answers.classificationRegulated}}
| Content | May be sent to |
|---|---|
| Source code, tests, configuration without secrets | Any approved assistant |
| Secrets, credentials, key material | **Nothing**, ever |
| Anything containing real user data | **Nothing** — and it should not be in the repository either |

If this project ever begins handling regulated or customer data, this table gets stricter *before*
that data arrives, not after.
{{/unless}}

## 2. Data residency and retention

- Where inference runs: TODO(setup).
- Where prompts are logged, and for how long: TODO(setup).
- Whether the vendor trains on this content: it must not. Confirm it in the contract, not the
  marketing page.

## 3. Intellectual property and licensing

- Generated code is treated as code the committing developer authored. They are accountable for it
  in review, and "the model wrote it" is not a defence.
- Verbatim-reproduction filters must be enabled where the vendor offers them.
- Attribution obligations from suggested code are the committer's to check. TODO(setup): name who
  answers a licensing question when one comes up.

## 4. Secret leakage

Secrets never go into prompts. Content exclusion is configured for: {{answers.secretPathList}}.

A secret that reaches a model is rotated, not assessed. Reasoning about whether it was retained
costs more than rotating a key, and being wrong is unrecoverable.

## 5. Human-in-the-loop gates

**The line is side effects, not intelligence.** An agent may read, reason, and propose freely. It
needs a human before it does anything with a consequence outside the working tree.

Current setting for this repository: agents have **{{answers.agentPrivilegesLabel}}**.

The full matrix is in [../security/agent-permissions.md](../security/agent-permissions.md).

## 6. Audit trail

For any change where it matters, you need to be able to answer: which model, which prompt, which
diff, which human approved it. You need this the first time a generated change causes an incident,
and you cannot reconstruct it afterwards.

Minimum viable version, which costs almost nothing: pull requests state when a change was
AI-authored, and the reviewer is a different person from the prompter.

---

## What this policy deliberately does not do

It does not restrict *which* problems people may use AI on, and it does not require disclosure of
routine completion use. Policies that try to police the boundary between "assisted" and
"unassisted" authoring are unenforceable, get ignored, and cost the credibility of the rules that
actually matter — the ones about data and side effects.
