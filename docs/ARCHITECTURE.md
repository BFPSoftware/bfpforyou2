# Architecture

How this application is built. Prefer existing patterns here over inventing new ones.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Forms | react-hook-form + Zod |
| Server actions | next-safe-action (`lib/safe-action.ts`) |
| Package manager | Yarn (`yarn.lock`) |
| Runtime | Node.js 20 (see Dockerfile) |

There is **no traditional application database**. Persistent data lives in **Cybozu Kintone**.

## Repository layout

| Path | Role |
|------|------|
| `app/` | Routes, layouts, API `route.ts` handlers, some server actions under `app/[lang]/actions/` |
| `features/` | Domain UI and logic: forms (FAC + immigrant) and admin dashboards |
| `components/` | Shared UI, header/footer, email HTML templates |
| `lib/` | Integrations and helpers (email, Kintone upload helpers, Azure translation, utils) |
| `hooks/` | Client/server helpers (e.g. Kintone client wrapper) |
| `common/` | Env accessors, locales, shared error logging |
| `types/` | Shared TypeScript types (programs, locales, Kintone field shapes) |
| `public/` | Static assets |

Localized pages live under `app/[lang]/…`. Supported locales: `en`, `he`, `ru`, `es`, `fr` (`types/locales.ts`). Dictionaries are JSON under `common/locales/` with `Dictionary-provider` — not a full i18next runtime, despite some i18next packages in `package.json`.

## Request flow (high level)

1. User opens a locale path (or is redirected by `middleware.ts`).
2. Public home: ticket/code → `checkCode` server action → master + beneficiary Kintone apps → program route.
3. Program forms submit via feature hooks → Kintone API routes (`app/api/kintone/…`) and confirmation email routes.
4. Admin dashboards: access code → verify-access API → session cookies → guarded pages via middleware.

## Middleware

`middleware.ts` handles:

- Optional maintenance redirect (`MAINTENANCE_MODE=true`)
- Locale prefix enforcement
- Admin route guards:
  - FAC: cookie `teacherId` (except login at `…/admin`)
  - Immigrant admin: cookie `immigrantAdminId` (except login at `…/admin/immigrant`)

API routes (`/api/…`) are excluded from the matcher.

## Data and integrations

### Kintone

Credentials and app IDs come from env via `common/env.ts`. Important apps include:

- Master settings (`BFPFORYOU_MASTER_APPID`) — ticket/code ranges and program mapping
- Beneficiary / immigrant applications
- FAC applications and original-response apps
- Teachers/coordinators (`KINTONE_TEACHERS_APP_ID` / `KINTONE_COORDINATORS_APP_ID`)
- Error logs

Client: `@kintone/rest-api-client` via `hooks/useKintone.ts` and related helpers.

**File uploads:** Prefer `POST /api/kintone/uploadFile`. Images may be compressed client-side before upload. Older server-action upload paths are deprecated.

### Email

Gmail via Google OAuth2 + nodemailer (`lib/email-service.ts`, `GOOGLE_*` env vars). Contact and confirmation endpoints under `app/api/email/`. Do not assume SendGrid is active despite leftover naming in places.

### Azure Translator

Used for FAC post-submission translation (`lib/fac/azureTranslation.ts`, `AZURE_TRANSLATOR_*` env vars).

### Admin session

Cookie-based (not end-user OAuth). Access codes are validated against the coordinators/teachers Kintone app. Dual-role records can receive both FAC and immigrant cookies (`features/admin/shared/setAdminSessionCookies.ts`).

Admin review “seen” state can be stored in browser `localStorage` (client-only; not Kintone).

## API surface (overview)

Under `app/api/`:

- `admin/` — verify-access, logout, download-file, get-original-responses (+ `immigrant/` variants)
- `kintone/` — post records (FAC / immigrant), uploadFile
- `email/` — confirmation, contact
- `log-error/` — server-side error logging to Kintone

## Deployment

Two supported targets:

1. **Vercel** — `vercel.json` sets `maxDuration: 20` for API and action paths. `next.config.ts` uses `output: "standalone"` and a large server-action body limit for uploads.
2. **Docker (Windows containers)** — `Dockerfile` builds a standalone Node server on port 3000; image conventionally tagged `ghcr.io/bfpsoftware/bfpforyou2`.

Document deploy or env changes carefully; production changes need human approval.

## Constraints for changes

- Prefer extending existing feature folders and API routes over new top-level frameworks.
- Keep Kintone as the system of record unless a human decides otherwise.
- Do not introduce a new ORM/DB, auth system, or UI kit without an explicit decision.
- Match existing TypeScript, Tailwind, and form patterns in neighboring files.
