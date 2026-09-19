# AGENTS.md

Instructions for AI assistants working in this repository. Humans should read `README.md` and `docs/` as well.

## Authority hierarchy

Follow documents in this order. Do not invent parallel process docs.

1. **This file** — project-wide AI rules and workflow
2. **`docs/ARCHITECTURE.md`** — how the system is built
3. **`docs/DOMAIN.md`** — programs, roles, business constraints
4. **`docs/DEVELOPMENT.md`** — Issues, verification, git discipline
5. **The GitHub Issue** — scope and acceptance for the current task
6. **Current conversation** — only for the active task; do not treat prior chats as lasting product truth

If documents conflict, prefer architecture/domain facts over habit, and prefer the Issue’s acceptance criteria for scope. If still unclear, ask a human.

## Purpose of AI help

AI should handle repetitive implementation, investigation, and verification. Humans keep important decisions and **shipping** (merge/deploy/release).

This is **not** fully autonomous development.

## Default workflow

For a normal GitHub Issue:

**Understand → plan → implement → test/verify → fix → review summary**

Then a **human** reviews and decides what is shipped.

Details: `docs/DEVELOPMENT.md`.

### Rules while working

- Use the Issue as the main task reference.
- Make the **smallest** change that satisfies acceptance criteria.
- Prefer existing patterns, folders, and libraries (`docs/ARCHITECTURE.md`).
- Do **not** silently expand scope. New bugs or debt → separate Issue (or propose one).
- Do **not** rewrite unrelated working code for cleanliness.
- Do **not** introduce new architecture, frameworks, ORMs, auth systems, or UI kits without an explicit human decision.
- Distinguish **implemented**, **verified**, and **shipped**. Only humans ship.

### When to stop and ask

Required before proceeding:

- Major architectural changes
- Kintone/data changes that could affect or destroy data
- Authentication or authorization changes
- Security-sensitive changes
- Unclear business-rule or policy changes (`docs/DOMAIN.md`)
- Production or deployment changes
- Other irreversible or high-impact actions

When unsure, ask rather than guess.

## Code and quality

Prioritize: correctness, simple architecture, consistency with this repo, maintainability, safe changes.

- Match neighboring TypeScript/React/Tailwind style.
- Use Yarn only.
- Do not commit secrets or `.env` files.
- Application code changes are out of scope unless the current Issue (or human) asks for them.

## Verification

There is no full automated test suite yet. For changes, run what applies (`yarn lint`, `yarn build`, and targeted manual/browser checks). Be honest about what was and was not verified. See `docs/DEVELOPMENT.md`.

## Review summary (before handing off)

Provide:

- What changed and why (tied to the Issue)
- What was verified
- Important files touched
- Risks or assumptions
- What a human should review before merge/deploy
