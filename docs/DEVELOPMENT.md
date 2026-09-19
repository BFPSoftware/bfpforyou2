# Development and delivery

Day-to-day practice for humans and AI working in this repo. Project-wide AI rules live in `AGENTS.md`; this file details Issues, verification, and git.

## Package and commands

- Use **Yarn** (`yarn.lock`). Do not add npm/pnpm lockfiles.
- Common commands:
  - `yarn dev` — local development
  - `yarn lint` — Next.js lint
  - `yarn build` — production build (also validates TypeScript compile)
  - `yarn start` — run production server after build

There is **no automated test suite** in the repo today. Do not claim “all tests passed.” Prefer adding checks only when an Issue asks for them.

## GitHub Issues as the work list

Issues are the shared queue for humans and AI.

A useful Issue usually includes:

- Problem or requested improvement
- Desired result
- Scope (in / out)
- Acceptance criteria
- Important constraints
- Relevant notes or decisions

When working an Issue, treat it as the source of truth for that task. Reference the Issue in commits and PRs when practical (e.g. `#123`).

### Scope discipline

AI (and contributors) may notice other bugs, debt, or improvements. **Do not silently expand the current task.** Open or suggest a separate Issue instead.

### Updating the Issue

Add useful progress and a final outcome (what shipped to review, what remains). Do **not** paste internal chain-of-thought or step-by-step tool logs into the Issue.

## Task workflow

For a normal Issue:

1. **Understand** — Read the Issue; inspect relevant code, architecture (`docs/ARCHITECTURE.md`), domain (`docs/DOMAIN.md`), and existing behavior.
2. **Plan** — Briefly note: what will change, where, what must not change, how it will be verified, and risks. For low-risk work, continue. For architectural, security, data, auth, or unclear business-rule decisions, **stop and ask**.
3. **Implement** — Smallest change that meets acceptance criteria. Prefer existing patterns and libraries.
4. **Test / verify** — Run relevant available checks (see below).
5. **Fix and repeat** — Until criteria are met, checks pass, or human input is required.
6. **Review summary** — Before calling the work ready for humans, summarize: what changed, what was verified, important files, risks/assumptions, what a human should look at.

### Status language

| Status | Meaning | Who decides |
|--------|---------|-------------|
| **Implemented** | Code changes exist for the Issue | Contributor / AI |
| **Verified** | Relevant checks and acceptance criteria have been exercised successfully | Contributor / AI (honestly) |
| **Shipped** | Merged / deployed / released as the team intends | **Human only** |

Never mark work as shipped.

## Verification (current project)

Until a test suite exists, verification for a change typically includes whatever applies:

- `yarn lint`
- `yarn build` (catches many type errors)
- Manual or browser check of the affected public form, admin path, or API behavior
- Confirm env-dependent paths are not broken by accidental hardcoding

If a check cannot be run (missing secrets, no Kintone access), say so explicitly in the review summary — do not imply verification that did not happen.

## Human-controlled decisions

Stop and ask before:

- Major architectural changes
- Database / Kintone schema or migration-like changes that could affect or destroy data
- Authentication or authorization changes
- Security-sensitive changes
- Important business-rule changes when requirements are unclear
- Production or deployment changes
- Other irreversible or high-impact actions

When unsure, ask rather than guess.

## Quality priorities

In order of importance for this workflow:

1. Correctness against the Issue
2. Consistency with existing architecture and patterns
3. Maintainability and clear documentation when needed
4. Safe, reversible changes
5. Appropriate verification

Do **not** maximize volume of AI-written code. Do not rewrite working code only for style. Do not make unrelated improvements in the same change.

## Git discipline

Before commit or PR:

- Inspect the full diff
- Remove unrelated or accidental changes (including generated files, local env, debug leftovers)
- Ensure docs match the change when behavior or process changed
- Never commit secrets (`.env`, keys, tokens)
- Keep the change traceable to its GitHub Issue

Prefer small, reviewable PRs over large mixed bundles.
