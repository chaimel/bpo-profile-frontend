# BPO Profile — Setup (high level)

How this would be built later. Not a scaffold. No install command dump. Product references are to [BPO Profile.pdf](<BPO Profile.pdf>), using 1-based PDF page numbers; framework and infrastructure choices are implementation defaults.

---

## 1. Two apps

| App | Stack | Role |
| --- | --- | --- |
| `web` | Nuxt 4, Vue 3, TypeScript | Public site + dashboards |
| `api` | Laravel 13, compatible PHP runtime, PostgreSQL, Passport, Socialite | JSON API + Google sign-in |

Prefer one public hostname later (`bpoprofile.com`) with `/api` and `/auth` proxied to Laravel, including the Google callback. When using local public media, serve `/storage/**` from Laravel's public disk. Other routes go to Nuxt; server-rendered data requests use a separate absolute Laravel API base. Keep external OAuth authorization/token issuance routes unavailable at launch; provisioning Passport does not authorize third-party integrations.

Before scaffolding, verify supported PHP, Node, database, framework, and package versions against the selected releases' official requirements. This planning document does not establish a tested compatibility matrix.

---

## 2. Build order (when coding starts)

1. Laravel project, PostgreSQL, migrations matching `docs/DATABASE.md`
2. Seed plans, services, industries, languages, capabilities, technologies, countries
3. Passport browser-cookie auth with live Laravel sessions, password or Google sign-in followed by an emailed code, first-login email verification, and `/api/me`
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
- Laravel session and Passport cookie security flags, session lifetime, and optional cookie domain (host-only by default)
- Passport signing keys, kept server-side and provisioned separately from the Laravel app key
- Google OAuth client ID, client secret, and exact server callback URL for Socialite; these identify the app to Google, not clients of our Passport OAuth server
- PostgreSQL connection and server-side session store
- Shared cache/rate-limit store across API instances
- Mailer and login-code delivery configuration
- File disk (`public` for local public media, then S3) and public media URL
- App key / session encryption

Exact `.env` keys belong in the repos when they exist, not here.

---

## 4. Auth setup intent

The launch sign-in default is a password or a linked Google account, followed by the same emailed-code check for every company, professional, account-only onboarding user, and platform admin. Passport is selected now for future OAuth integration readiness; Socialite handles Google sign-in. These are implementation choices, not login mechanisms prescribed by the PDF; there is no trusted-device bypass at launch.

- Install Passport's framework migrations and provision its signing keys; configure the API guard for Passport and the Laravel `web` session middleware for browser routes. Socialite is the separate Google OAuth client. Follow the [auth flow](ARCHITECTURE.md#5-auth-flow) and [environment rules](ARCHITECTURE.md#8-environments) for middleware order, cookies, CSRF, and optional subdomain CORS
- Both the Laravel session cookie and Passport's encrypted JWT `laravel_token` cookie are `HttpOnly`, with `Secure` in production, `SameSite=Lax`, `Path=/`, and host-only scope for the default same-origin deployment. Keep the separate `XSRF-TOKEN` cookie JavaScript-readable. Send credentials and `X-XSRF-TOKEN` on every protected browser API request, including `GET`, and on every browser write. Do not return credentials in JSON or store tokens in localStorage/sessionStorage
- Provide a custom `GET /auth/csrf-cookie` endpoint under Laravel's web middleware. Browser API routes require Passport `auth:api` plus a live web session for the same active, email-verified user and current `auth_version`; Passport cookie validation alone does not prove that the server-side session still exists. Reject bearer credentials on these Phase 1 browser routes
- Registration creates an unverified user and the appropriate draft records, returns `201` with `next_action = login`, and grants no authenticated session
- A valid password at `POST /api/login` returns `202` with `email_code_required`. A successful Google sign-in starts the same pending challenge. Both remain bound to the pre-authentication session; `/api/me` and protected routes return `401` while the challenge is pending. `POST /api/login/verify` consumes the code, marks `email_verified_at` on first verification, regenerates the authenticated web session, and returns `200` without a Passport cookie. The browser refreshes CSRF, calls authenticated `GET /auth/session` to receive the Passport cookie, then loads `/api/me`
- Google sign-in uses `GET /auth/google/redirect` and `GET /auth/google/callback`; retain Socialite's session-bound state verification and do not use `stateless()`. Bind identities by Google's stable subject ID in `social_accounts`, never by email alone. A matching existing email requires the user to sign in through an existing method and explicitly link Google through `POST /api/account/google/link` after a recent completed login. Do not persist Google access/refresh tokens
- A new Google identity creates only an unverified account with a nullable password and no company, professional, or membership. After completing the emailed code, the user can use `POST /api/onboarding/company` or `/api/onboarding/professional` under the registration rules, or proceed with an existing claim/invitation
- `POST /api/login/resend` returns `202`. Planned defaults: cryptographically random six-digit code, 10-minute expiry, five failed attempts across resends, 60-second resend cooldown, and at most three sends including the initial email per account per 15 minutes. Enforce shared account and IP limits; resending neither extends the challenge deadline nor resets failed attempts
- Claims and invitation acceptance require the authenticated user's verified intended email; login email verification does not confer company/professional verification badges
- Password reset/change, email change, account deletion/restoration, and platform-role changes invalidate existing sessions and pending challenges through `auth_version`; every protected request also checks the current account, role, and membership. Logout destroys the web session and expires both authentication cookies; a copied or late-written Passport cookie must fail the live-session/version check
- Professional self-registration requires company and job title, creates a draft/pending affiliation, and grants company membership only after owner/admin or platform-admin approval
- Ordinary account registration supports claim/invitation onboarding without creating a buyer role or implicit company membership
- Company dashboard routes include `companyId`; authorize each request against that user's accepted membership and role in the selected company
- Claim approval precedes token issuance; token acceptance grants ownership atomically. Invitation acceptance attaches an existing roster profile where applicable, without duplication
- Platform admin seeded once, not registered from the public form; Google sign-in never assigns administrative roles
- Do not enable external OAuth clients or expose `/oauth` authorization/token issuance endpoints in Phase 1. When an integration is approved later, define its separate bearer routes, consent, exact redirect allowlist, least-privilege scopes, authorization code with PKCE, and refresh-token rotation/revocation. Do not enable password or implicit grants

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

Auth checks must cover every account type and both password and Google entry paths: registration, password acceptance, and a Google callback alone cannot open a dashboard. A valid emailed code creates a fresh web session; protected API access also requires the subsequent Passport cookie bootstrap. Test missing/incorrect CSRF on protected `GET` requests, both cookies' production flags, bearer rejection, and live-session rejection of a copied Passport cookie after logout, reset, email change, deletion, or restoration. Verify expired, replayed, exhausted, replaced, or differently session-bound codes fail; resend limits work across instances; and delivery failure grants no access. Google checks cover wrong/replayed state, duplicate subject identities, email conflicts without automatic merging, explicit linking with a recent completed login, and first-time account onboarding. Confirm external OAuth issuance endpoints remain unavailable. Preserve non-secret form input on recoverable errors and clear passwords/codes after use. Never automatically replay a failed write after session or CSRF expiry.

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
