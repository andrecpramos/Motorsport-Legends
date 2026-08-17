# Copilot instructions — Motorsport Legends

> **The canonical instructions are in [AGENTS.md](../AGENTS.md).** Copilot code review reads
> `AGENTS.md` from the repository root automatically, and so do most other agents. This file exists
> for the inline-completion path, which benefits from a shorter, denser prompt than a full
> contributing guide. It restates only the rules that matter at the keystroke.

## Fast rules for completions

- Nothing in the entry graph (main.tsx, HomePage and everything it reaches) may statically import three, @react-three/* or gsap - it ships the 1.35 MB three chunk to every homepage visitor
- manualChunks must claim react/react-dom/scheduler before the three rule, or React is swallowed into the three chunk and the entry downloads all of Three.js just to boot
- Never use the drei `Environment preset` prop - it resolves to raw.githack.com and suspends inside the Canvas; pass `files={WAREHOUSE_HDR}` instead
- The SPA rewrite in app/vercel.json must keep excluding api/, assets/, models/, draco/, hdri/, videos/ and any dotted path - a blanket rewrite answers a missing .glb with HTML and a 200
- Colours are space-separated RGB tuples, never hex, so Tailwind opacity modifiers like bg-accent/60 work
- setDecoderPath must run before the first useGLTF call - every GLB in public/models declares Draco compression as required
- Match the surrounding code — its naming, its error handling, its comment density.
- No new dependencies. Standard library first.

## When completing a test

Assert a specific expected value, not a shape. `assert.equal(total, 63000)`, never
`assert.ok(total > 0)`. Boundary tests come in pairs: the value at the boundary and the value one
past it.

## When completing a comment

Explain why, not what. If the comment would restate the code below it, write nothing.

## When completing anything that touches money, time, identity or permissions

Stop and be conservative. These are the places where a plausible-looking completion is most likely
to be subtly wrong, and where being subtly wrong is most expensive.
