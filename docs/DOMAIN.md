# Domain and business rules

Product context for BFP for You. If a rule here is unclear or conflicts with a GitHub Issue, stop and ask a human — do not invent policy.

## What this product is

A multilingual web app for **BFP for You** program applications and related admin review. Beneficiaries enter with a **ticket/code**; teachers and coordinators review submissions in admin dashboards. Data is stored in **Kintone**.

## Programs

Canonical program names (`types/program.ts`):

| Program | Public route (under `/[lang]/…`) | Typical audience |
|---------|-----------------------------------|------------------|
| `FAC Elementary` | `facelem` | FAC elementary applicants |
| `FAC Highschool` | `fachigh` | FAC high school applicants |
| `New Immigrant` | `immigrant` | New immigrant applicants |

Ticket validation (`checkCode`) maps an active master setting + ticket usage to one of these programs. Unknown program strings from Kintone are errors, not free-form routes.

## Public user flows

1. **Home / ticket entry** — User enters a numeric ticket/code. The app checks master settings (active ranges or exact codes) and whether the ticket was already used, then routes to the matching program form.
2. **Application forms** — Multi-step forms (FAC elem/high, immigrant) with Zod schemas. May include file attachments (compressed client-side when needed) uploaded to Kintone.
3. **Thank-you / confirmation** — After submit, confirmation email may be sent; user lands on a thank-you page.
4. **Contact us** — Separate contact form → email API.

Locales: English, Hebrew, Russian, Spanish, French. Locale is part of the URL and stored in a locale cookie for redirects.

## Admin roles

Admins authenticate with an **access code** against the BFP for You admins Kintone app (`BFPFORYOU_ADMINS_APPID`) — not end-user passwords.

| Role | Login path | Session cookies | Scope |
|------|------------|-----------------|-------|
| FAC teacher / school admin | `/[lang]/admin` | `teacherId`, `teacherName` | FAC-related dashboards; schools come from the Kintone `school` field |
| Immigrant coordinator | `/[lang]/admin/immigrant` | `immigrantAdminId`, `immigrantAdminName` | Immigrant applications filtered by `giftCodes` on the same record |

**Dual-role:** One Kintone record may qualify for both (has schools and gift codes). Login helpers can set both cookie pairs. Immigrant login requires non-empty `giftCodes`; FAC login accepts a matching access code more broadly.

Do not weaken access checks, broaden who can see applications, or change cookie/session behavior without human review.

## Important domain constraints

- **Tickets/codes** gate access to forms. Treat validation, reuse limits, and program mapping as sensitive business logic.
- **Gift codes** scope which immigrant applications a coordinator can load. Changing parse/filter rules can leak or hide data.
- **FAC vs immigrant** admin UIs and APIs are separate; do not casually merge permissions or data queries.
- **Original responses / translations** — FAC may store original submissions and run Azure translation after submit. Preserve that separation when touching FAC pipelines.
- **Maintenance mode** — When enabled via env, traffic is redirected to a maintenance page (except that page itself).

## What not to invent

- New programs or program name strings without updating `types/program.ts` and Kintone master data intentionally
- New admin roles or auth mechanisms
- New persistence backends for application data
- Business copy/policy changes in locale JSON without clear Issue acceptance criteria

When requirements are ambiguous (eligibility, who may see what, email content that implies policy), ask before implementing.
