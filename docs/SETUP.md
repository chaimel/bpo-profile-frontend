# BPO Profile — Setup (high level)

How this would be built later. Not a scaffold. No install command dump. Product references are to [BPO Profile.pdf](<BPO Profile.pdf>), using 1-based PDF page numbers; framework and infrastructure choices are implementation defaults.

---

## 1. Two apps

| App | Stack | Role |
| --- | --- | --- |
| `web` | Nuxt 4, Vue 3, TypeScript | Public site + dashboards |
| `api` | Laravel 13, compatible PHP runtime, PostgreSQL, Sanctum | JSON API |

Prefer one public hostname later (`bpoprofile.com`) with `/api` and `/sanctum` proxied to Laravel. When using local public media, serve `/storage/**` from Laravel's public disk. Other routes go to Nuxt; server-rendered data requests use a separate absolute Laravel API base.

Before scaffolding, verify supported PHP, Node, database, framework, and package versions against the selected releases' official requirements. This planning document does not establish a tested compatibility matrix.

---

## 2. Build order (when coding starts)

1. Laravel project, PostgreSQL, migrations matching `docs/DATABASE.md`
2. Seed plans, services, industries, languages, capabilities, technologies, countries
3. Sanctum SPA auth with password plus emailed-code sign-in, first-login email verification, and `/api/me`
4. Company/professional write APIs, pending affiliation approval, and company-scoped policies
5. Public show/index + search
6. Nuxt public pages against those endpoints
7. Inquiry endpoint + mail
8. Dashboards
9. Admin moderation, reviewed company claims, team invitations, and manual company/professional verification
10. Media uploads
11. Completeness and quality scores, full ranking order, basic analytics, and manual company-plan assignment
12. Phase 1 acceptance checks in `PLAN.md`, including trust, inquiry routing, accessibility, and empty/error states
13. Phase 2 resources, curated SEO pages, featured placements, and enhanced analytics
14. Phase 3 billing, paid entitlement enforcement, and any separately modeled individual Pro plan

Phase 1 is public launch, so the minimum claim and manual verification workflows must be working before release (PDF p. 25). Do not start with billing, messaging, or a custom search engine.

---

## 3. Environment pieces (names only)

- Nuxt public origin
- Laravel app URL and server-only absolute API base for Nuxt SSR
- Browser API base (same-origin `/api` by default)
- Sanctum stateful frontend hosts and ports, session cookie security flags, and optional cookie domain (host-only by default)
- PostgreSQL connection and server-side session store
- Shared cache/rate-limit store across API instances
- Mailer and login-code delivery configuration
- File disk (`public` for local public media, then S3) and public media URL
- App key / session encryption

Exact `.env` keys belong in the repos when they exist, not here.

---

## 4. Auth setup intent

The launch sign-in default is password followed by an emailed code for every company, professional, account-only onboarding user, and platform admin. This is an implementation choice, not a login mechanism prescribed by the PDF; there is no trusted-device bypass at launch.

- Sanctum SPA mode with stateful API middleware; follow the [auth flow](ARCHITECTURE.md#5-auth-flow) and [environment rules](ARCHITECTURE.md#8-environments) for credentials, CSRF headers, hosts/ports, and optional subdomain CORS
- Server-side sessions use an `HttpOnly` cookie with `Secure` in production, `SameSite=Lax`, `Path=/`, and host-only scope for the default same-origin deployment. Keep the separate `XSRF-TOKEN` cookie JavaScript-readable for the CSRF header; send credentials and CSRF headers on browser writes. Do not return access tokens in JSON or store them in localStorage/sessionStorage
- Registration creates an unverified user and the appropriate draft records, returns `201` with `next_action = login`, and grants no authenticated session
- A valid password at `POST /api/login` returns `202` with `email_code_required`. The pending challenge is bound to the current pre-authentication session; `/api/me` and protected routes return `401` until `POST /api/login/verify` succeeds with `200`. Success consumes the code, marks `email_verified_at` on first verification, and regenerates the authenticated session
- `POST /api/login/resend` returns `202`. Planned defaults: cryptographically random six-digit code, 10-minute expiry, five failed attempts across resends, 60-second resend cooldown, and at most three sends including the initial email per account per 15 minutes. Enforce shared account and IP limits; resending neither extends the challenge deadline nor resets failed attempts
- Claims and invitation acceptance require the authenticated user's verified intended email; login email verification does not confer company/professional verification badges
- Password reset/change, email change, account deletion/restoration, and platform-role changes invalidate existing sessions and pending challenges through `auth_version`; every protected request also checks the current account, role, and membership
- Professional self-registration requires company and job title, creates a draft/pending affiliation, and grants company membership only after owner/admin or platform-admin approval
- Ordinary account registration supports claim/invitation onboarding without creating a buyer role or implicit company membership
- Company dashboard routes include `companyId`; authorize each request against that user's accepted membership and role in the selected company
- Claim approval precedes token issuance; token acceptance grants ownership atomically. Invitation acceptance attaches an existing roster profile where applicable, without duplication
- Platform admin seeded once, not registered from the public form

---

## 5. Frontend setup intent

- Nuxt 4 with TypeScript
- Use the [frontend file structure in ARCHITECTURE.md](ARCHITECTURE.md#frontend-file-structure): `app/pages/` loads feature entry components from `app/components/features/`; each feature's `Index.vue` composes its own sections, such as `home/Banner.vue`.
- Use SCSS with the [stylesheet structure and ownership in ARCHITECTURE.md](ARCHITECTURE.md#scss-structure-and-ownership). When scaffolding, add a compatible Sass compiler, load `~/assets/scss/main.scss` once through the Nuxt `css` setting, and use scoped SCSS for feature sections. Verify that both global and component styles compile before building out the pages.
- Server-rendered public pages so profiles are indexable
- A small typed API module (fetch wrappers) with separate browser/SSR bases and centralized browser CSRF handling; public SSR stays anonymous and protected dashboard data loads client-side
- Brand tokens from the brief (PDF pp. 26–28): blue `#2389C2`, slate `#394454`, black `#1E1E1E`; typography includes Poppins and Calibri
- Card layouts for companies and sales professionals as specified in the brief

### Component coverage

Map the brief's UI system (PDF pp. 19, 28–30) into the [component folders](ARCHITECTURE.md#component-placement-and-naming):

- Base controls: primary, secondary, outline, and text/link buttons; labeled inputs, selects, and dialogs.
- Shared discovery UI: company/professional cards, search bar, filter chips, dropdown filters, mobile filter drawer, and sort control.
- Profile UI: avatars/logos, location and service/industry tags, meaningful verification/claimed/completeness indicators, and prominent contact actions.
- Navigation: desktop header, mobile navigation, breadcrumbs, and sidebar filters.
- Phase 2 content: featured cards, article cards, editorial testimonial/case-study sections, and richer statistics blocks.

Company cards show logo, name, location, key services, industries, short description, verification, and View Profile. Professional cards show photo, name, role, company, expertise, location, and Connect. Use the full profile payloads for detail pages; company-provided client proof belongs in overview content at launch.

### Typography and responsive layout

Use Poppins for headings/UI and Calibri for body copy, with suitable system sans-serif fallbacks when those fonts are unavailable. These role assignments and fallback stacks are implementation choices; the named fonts come from the brief. Do not assume every device has Calibri installed or bundle a font without suitable usage rights.

The recommended desktop heading scale (PDF p. 28) is:

| Level | Size | Weight |
| --- | --- | --- |
| H1 | 48px | Bold |
| H2 | 36px | Semi-bold |
| H3 | 28px | Semi-bold |
| H4 | 22px | Medium |
| H5 | 18px | Medium |
| H6 | 14px | Regular |

Adapt sizes and spacing to smaller viewports while preserving semantic heading order, readable body text, and usable controls. Cards, forms, filters, and dashboards must work on mobile without losing content or actions.

Use generous whitespace, clear hierarchy, restrained neutrals, and consistent cards. Imagery should emphasize approachable professionals and teams, with consistent portrait cropping and clean backgrounds (PDF pp. 30–31). Copy should be clear, confident, helpful, and human; use specific actions such as “Find a BPO” and “Request a Quote” (PDF pp. 32–35).

### Accessibility and system states

Apply the brief's accessibility guidance (PDF pp. 38–39): keyboard-operable navigation and controls, visible focus, clear form labels/instructions/errors, sufficient text and control contrast, and no meaning communicated by color alone. Provide descriptive alternative text for meaningful images and empty alternative text for decorative images. Honor text resizing and responsive layouts. Provide captions if video is introduced later; Phase 1 does not include video.

Use neutral, clear, non-blaming system language, with a useful recovery action. The brief's examples (PDF p. 39) are:

| State | Example copy | UI behavior |
| --- | --- | --- |
| No results | No BPOs found. Try adjusting your search. | Keep filters available and offer reset/edit actions |
| Failed search | Something went wrong. Please try again. | Preserve the query and offer retry |
| Empty profile | This profile is still being completed. | Use only on a permitted incomplete profile or dashboard; unpublished profiles remain unavailable publicly |
| Contact failure | We couldn't send your message. Please try again. | Retain form values and allow retry; do not claim success |

Before launch, check keyboard navigation/focus, field labels and errors, color contrast, informative/decorative image alternatives, mobile layout, and each empty/error state on the actual search, profile, and inquiry flows. Also verify anonymous SSR data loading, a first anonymous inquiry, login/logout and CSRF expiry, protected dashboard requests, and public media URLs through the intended proxy topology.

Auth checks must cover every account type: registration and password-only login cannot open a dashboard; a valid code verifies the email and creates a fresh authenticated session; expired, replayed, exhausted, replaced, or differently session-bound codes fail. Verify resend limits across instances, delivery-failure recovery without granting access, production cookie flags, readable CSRF-cookie handling, and session/challenge rejection after reset, email change, deletion, or restoration. Preserve non-secret form input on recoverable errors and clear passwords/codes after use. Never automatically replay a failed write after session or CSRF expiry.

---

## 6. Data setup intent

- Migrations first, then seeders for taxonomies and plans
- A handful of sample companies and professionals for UI work
- Soft deletes enabled on the tables listed in `docs/DATABASE.md`
- Slugs generated from names; unique among non-deleted rows
- `work_model` uses the fixed enum from `DATABASE.md`, not a seeded/admin-editable taxonomy
- Public taxonomy/location/plan catalogs use `is_active`; company/professional/article publication follows its own status rules
- Seed pending and approved affiliations plus unclaimed roster rows to exercise the trust and invitation workflows
- Match ranking to PDF p. 23: relevance, completeness, verification, location/service match, quality, then premium visibility; use a stable record ID only to resolve remaining ties

### Basic analytics from Phase 1

Capture browser events once per actual display/action: `view`, `search_impression`, `cta_click`, and `website_click`, with a UUID `event_key` to deduplicate retries. A search impression means a displayed result card, not merely an API response. Generate `inquiry` events only on the server, once per stored valid inquiry; the browser cannot submit them.

Keep accepted non-spam, non-deleted provider inquiries as the source for contact/question/quote counts and launch lead conversions, using `inquiries.type`; platform contacts are excluded. Compare inquiries and profile views for the same target and UTC time window when calculating the inquiry-to-view rate; zero views returns null and displays as unavailable. Company totals include the team, with company-profile and sales-profile views also returned separately; professional totals cover that person only. This activity ratio is not a unique-buyer funnel or evidence of a won sale. Phase 2 adds richer analytics views.

---

## 7. Mail and files

- Inquiry notification to the assigned professional, or to the company fallback inbox and accepted email-verified owners/admins; deduplicate recipients
- Inquiry confirmation to sender
- Login-code emails, including first-login email verification, and team-invitation emails
- Claim-company token email after platform-admin approval
- Password reset
- Logo, cover, photo uploads follow the [media rules](ARCHITECTURE.md#7-media): JPEG/PNG/WebP, content/size/dimension checks, re-encoding, and generated filenames
- Meaningful image alternative text stored with uploaded media

---

## 8. What not to do at setup time

- Do not generate the full Nuxt+Laravel monorepo in this planning folder
- Do not add package.json, artisan make output, or Docker files unless asked
- Do not create thin SEO pages for every service×city combination
- Do not implement buyer accounts or Stripe in the first coding slice

---

## 9. Doc map

| File | Use |
| --- | --- |
| `docs/PLAN.md` | What and why, phases |
| `docs/DATABASE.md` | Tables and rules |
| `docs/ARCHITECTURE.md` | How Nuxt and Laravel meet; frontend folders and page/feature/component conventions |
| `docs/API.md` | Endpoints and payloads |
| `docs/SETUP.md` | This file |

When implementation is requested, start from Phase 1 in `PLAN.md` and the tables in `DATABASE.md`.
