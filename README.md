# BFP for You (`bfpforyou2`)

Multilingual Next.js application for **BFP for You** program applications (FAC Elementary, FAC Highschool, New Immigrant) and admin review dashboards. Application data is stored in **Kintone**.

## Stack (summary)

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS · shadcn/ui
- Yarn (`yarn.lock`)
- Kintone · Gmail (OAuth) email · Azure Translator (FAC)

More detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · domain rules: [docs/DOMAIN.md](docs/DOMAIN.md).

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Copy local secrets from your team’s env template into `.env` (never commit it). Required categories include Kintone credentials/app IDs, Google OAuth for mail, and optionally Azure Translator and `MAINTENANCE_MODE`.

Useful scripts: `yarn lint`, `yarn build`, `yarn start`.

## Working with AI and Issues

Development is Issue-driven: understand → plan → implement → verify → human review → ship.

- [AGENTS.md](AGENTS.md) — rules for AI assistants
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) — Issues, verification, git discipline

Only humans decide what is **shipped**.

## Kintone image uploads

Form image attachments (FAC, immigrant) are compressed client-side when needed (e.g. to stay under request body limits), then uploaded via **`POST /api/kintone/uploadFile`**. Prefer that API route over deprecated server-action upload helpers. No browser-to-Kintone CORS setup is required for this path.

## Deploy

- **Vercel** — see `vercel.json` (function duration limits for API/actions).
- **Docker** — Windows-container `Dockerfile`; image conventionally `ghcr.io/bfpsoftware/bfpforyou2`. Requires Next `output: "standalone"` (already set in `next.config.ts`).

Production and deployment changes need human approval.
