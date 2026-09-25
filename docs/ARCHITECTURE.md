# BPO Profile — Architecture

**Style:** Nuxt 4 SPA/SSR frontend + Laravel 13 REST JSON API  
**Auth:** Laravel Sanctum (SPA cookie auth for the first-party Nuxt app)  
**Database:** PostgreSQL  
**Hosting shape (later):** two apps, one database, object storage for media

This document describes how the two apps fit together and the frontend file structure to use when implementation starts. It is not a scaffold.

The product requirements come from [BPO Profile.pdf](BPO%20Profile.pdf): discovery and profile relationships (pp. 14-25), search priorities (p. 23), measurement (p. 37), and accessibility (pp. 38-39). Nuxt, Laravel, PostgreSQL, cookie authentication, and the workflows below are implementation decisions that support that brief; the PDF does not prescribe a stack. Delivery phases follow [PLAN.md](PLAN.md).

---

## 1. System diagram

```
                    ┌──────────────┐
   Browser ─────────│  Nuxt 4 app  │
                    │  Vue 3 + TS  │
                    └──────┬───────┘
                           │ JSON + cookies (same-site)
                           ▼
                    ┌──────────────┐
                    │ Laravel 13   │
                    │ REST API     │
                    │ Sanctum SPA  │
                    └──────┬───────┘
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        PostgreSQL     File disk      Mail
                       (S3 later)    (inquiries)
```

Nuxt owns pages, SEO HTML, and UI. Laravel owns users, profiles, search queries, inquiries, and authorization.

---

## 2. Why this split

- Company and sales-pro pages must be indexable. Nuxt renders those routes on the server.
- Dashboards are authenticated and can be client-heavy.
- Laravel keeps validation, policy, and ranking rules in one place so a future mobile client can reuse the API.
- Sanctum SPA mode avoids a separate OAuth server for a first-party site.

---

## 3. Frontend (Nuxt 4)

### Responsibilities

- Public marketing and discovery pages
- SSR for home, directories, profiles, service/industry/location landings, articles
- Auth screens and role-aware dashboards
- Form UX for profile editors and inquiries
- Talk to Laravel only through a typed API client
- Responsive brand components and accessible interactions, including keyboard navigation, visible focus, labeled forms, descriptive errors, appropriate alt text, and status indicators that do not depend on color alone
- Browser measurement of actual displayed profiles, search-result impressions, and user actions; fetching a public API response does not itself count as a view

### Frontend file structure

Follow the organization used in `myblog/frontend`: route files live in `app/pages/`, feature UI lives in `app/components/features/`, and each feature's `Index.vue` composes its own sections. For example, `features/home/Index.vue` imports and renders `features/home/Banner.vue`.

The following is the planned layout inside `frontend/`. Only the documentation exists here today; create implementation files as their features are built. The feature names below are BPO Profile examples, using the same organization as the reference project.

```text
frontend/
|-- docs/                         # Planning documents
|-- app/
|   |-- app.vue                   # App shell: layout and current page
|   |-- pages/                    # Routes and page-level orchestration
|   |   |-- index.vue             # Loads features/home/Index.vue
|   |   |-- companies/
|   |   |   |-- index.vue         # Loads features/companies/Index.vue
|   |   |   `-- [slug].vue        # Loads features/company/Index.vue
|   |   `-- professionals/
|   |       |-- index.vue         # Loads features/professionals/Index.vue
|   |       `-- [slug].vue        # Loads features/professional/Index.vue
|   |-- components/
|   |   |-- base/                 # UI primitives: MButton, MInput, MModal
|   |   |-- core/                 # Shared composed UI: search, profile cards
|   |   |-- layout/               # Header, Footer, dashboard navigation
|   |   `-- features/
|   |       |-- home/
|   |       |   |-- Index.vue     # Composes the home sections
|   |       |   |-- Banner.vue
|   |       |   `-- DirectorySearch.vue
|   |       |-- companies/
|   |       |   |-- Index.vue     # Company directory
|   |       |   |-- Filters.vue
|   |       |   `-- list/
|   |       |       |-- Index.vue # Composes results and pagination
|   |       |       `-- Items.vue
|   |       |-- company/
|   |       |   |-- Index.vue     # Company profile
|   |       |   |-- Overview.vue
|   |       |   `-- Team.vue
|   |       |-- professionals/   # Professional directory and its sections
|   |       `-- professional/    # Professional profile and its sections
|   |-- layouts/                 # Page shells: default, dashboard, admin
|   |-- composables/
|   |   |-- api/                 # Typed API access
|   |   |-- app/                 # App-wide behavior, such as modal state
|   |   `-- features/            # Reusable feature behavior
|   |-- plugins/                 # App integration, such as the API client
|   |-- middleware/              # Route auth and onboarding checks
|   |-- types/                   # api/, app/, base/, features/ type groups
|   |-- data/                    # Static UI content; no live directory copy
|   |-- stores/                  # Shared state when needed
|   `-- assets/
|       `-- scss/
|           |-- main.scss        # Global stylesheet entry
|           |-- _component.scss  # Shared M-component styles
|           `-- base/
|               |-- _index.scss # Forwards the base partials in order
|               |-- _fonts.scss # Font loading
|               |-- _colors.scss # Palette and CSS custom properties
|               |-- _normalize.scss # Browser baseline
|               |-- _reset.scss # Project reset
|               |-- _preset.scss # Tokens and document defaults
|               |-- _typography.scss # Type scale and text utilities
|               `-- _layout.scss # Shared containers and layout helpers
|-- public/                      # Files served directly
`-- nuxt.config.ts
```

Apply the same page-to-feature pattern to auth, onboarding, dashboards, admin, and later resource pages. Add folders as those routes are implemented, following the phases in [PLAN.md](PLAN.md).

#### Page and feature composition

Keep route files small. They select the feature, set page metadata/layout/middleware, and handle route parameters, page-level data loading, and SEO where needed. Pass fetched data to the feature through props; reusable request logic belongs in composables and the typed API client.

For the home route, `app/pages/index.vue` loads the feature entry component:

```vue
<script setup lang="ts">
import Home from '@/components/features/home/Index.vue'
</script>

<template>
  <Home />
</template>
```

Then `app/components/features/home/Index.vue` assembles its sections:

```vue
<script setup lang="ts">
import Banner from './Banner.vue'
import DirectorySearch from './DirectorySearch.vue'
</script>

<template>
  <div class="home">
    <Banner />
    <DirectorySearch />
  </div>
</template>
```

These snippets illustrate composition only; page data, SEO, and section implementations are added during development.

#### Component placement and naming

- `pages/`: route entry files, using lowercase `index.vue` and dynamic names such as `[slug].vue`.
- `components/features/<feature>/Index.vue`: the feature entry component. Use capital `Index.vue`, import it under a descriptive name such as `Home`, and explicitly import its section components using relative paths.
- `components/features/<feature>/Banner.vue` and similar files: sections used by that feature. Keep them beside its `Index.vue`; a larger subsection can have its own folder and `Index.vue`, as shown by `companies/list/`.
- `components/base/`: small reusable UI primitives, following the reference project's `MButton.vue`, `MInput.vue`, and similar naming.
- `components/core/`: composed components reused across features. For example, a company card shared by home and directory results belongs here; a home-only banner stays in `features/home/`.
- `components/layout/`: shared header, footer, sidebar, and navigation components. `layouts/` assembles those into page shells.

Keep API access behind the typed client and authorization in Laravel as described below. This folder convention organizes UI; it does not change the system's responsibilities.

### SCSS structure and ownership

Use the SCSS organization from `myblog/frontend/app/assets/scss/` shown in the tree above. Global foundations and shared controls have one stylesheet entry; feature, core, and layout components keep their own presentation in `<style lang="scss" scoped>` blocks.

When implementation starts, load the global entry once through `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  css: ['~/assets/scss/main.scss'],
})
```

In `app/assets/scss/main.scss`, load the foundations before the shared component styles:

```scss
@use 'base';
@use 'component';
```

In `base/_index.scss`, preserve the reference project's base order:

```scss
@forward 'fonts';
@forward 'colors';
@forward 'normalize';
@forward 'reset';
@forward 'preset';
@forward 'typography';
@forward 'layout';
```

- `_fonts.scss` owns font loading; `_preset.scss` owns font-family tokens, shared radius/spacing tokens, and document defaults. Use BPO Profile's Poppins/Calibri roles and fallbacks from [SETUP.md](SETUP.md#typography-and-responsive-layout).
- `_colors.scss` owns the palette and exposes semantic CSS custom properties on `:root`, following the reference's color-map pattern. Define BPO Profile's blue `#2389C2`, slate `#394454`, and black `#1E1E1E` here, then use tokens such as `var(--brand)` and `var(--text-primary)` in components.
- `_normalize.scss` and `_reset.scss` establish the browser baseline. `_typography.scss` defines the responsive type scale and text utilities; `_layout.scss` owns shared containers such as `.section` and `.wrapper`, gutters, and layout helpers.
- `_component.scss` owns shared `M*` control styles and their variants/states, using `m-` prefixed selectors such as `.m-button` and `.m-input`. Keep those shared rules centralized rather than duplicating them in each control's scoped block.
- Each feature section owns its layout and responsive rules. For example, `features/home/Banner.vue` styles its banner; `features/home/Index.vue` styles only the composition of home sections when needed. Route files stay focused on page orchestration.
- Core and layout components use scoped SCSS for their own presentation and consume the same global tokens. Keep selectors tied to the component's root class; shared design changes belong in the global partials.
- Use `@use` and `@forward` for Sass modules. Do not import `main.scss` or other CSS-emitting global partials into every component. Component styles consume the shared CSS custom properties directly; any future Sass-only helpers should be imported explicitly where needed.

For example, the style block inside `app/components/features/home/Banner.vue` could be:

```vue
<style lang="scss" scoped>
.banner {
  color: var(--text-primary);

  &__title {
    color: var(--brand);
    font-family: var(--font-display);
  }
}
</style>
```

The banner template uses the matching `banner` and `banner__title` classes. This example assumes `_preset.scss` defines `--font-display` for Poppins. All SCSS paths and snippets here describe the future implementation.

### Suggested route groups

| Group | Rendering | Auth |
| --- | --- | --- |
| Public discovery | SSR | none |
| Resources, pricing, contact | SSR | none |
| Login / register | CSR fine | guest; redirect existing sessions to onboarding/dashboard |
| Claim / invitation landing | CSR fine | public entry; preserve the token through sign-in or account registration |
| Claim / invitation acceptance | CSR fine | authenticated intended user with verified email |
| `/dashboard/**` | CSR | Sanctum session |
| `/admin/**` | CSR | platform admin |

### State

- Session user loaded in the browser from `GET /api/me`; authenticated dashboard/admin routes render client-side
- Company dashboard selection is explicit in `/api/dashboard/companies/{companyId}/...`; Laravel validates an accepted owner/admin membership for every request
- An account awaiting onboarding may have no professional profile or company membership; a pending professional may edit their own draft without gaining company permissions
- Public listings fetched per page (SSR `useAsyncData` calling the typed API client)
- The browser API base is same-origin `/api`; SSR uses an absolute Laravel API base from server-only runtime configuration. Relative server-side `$fetch('/api/...')` targets Nuxt internally and does not pass through the external reverse proxy
- Public SSR requests are anonymous and do not forward user cookies. Load session-specific UI and protected data in the browser; authenticated SSR would need a separate cookie-forwarding design
- No local copy of the full directory

The server/browser request distinction follows [Nuxt's `$fetch` behavior](https://nuxt.com/docs/4.x/api/utils/dollarfetch).

### SEO

Nuxt sets title, meta, canonical, breadcrumbs, and JSON-LD from API payloads. Laravel stores `seo_title`, `seo_description`, and slugs for publishable entities. Public profile payloads include the full company/professional content and media descriptions, not just directory cards.

Phase 2 service, industry, location, and combined discovery landings need useful editorial content as well as relevant listings. The planned `GET /api/landings/{slug}` contract supplies approved combined-page content, filters, canonical URL, breadcrumbs, and SEO fields. A single matching listing is not by itself permission to generate an indexable page. Unknown, inactive, empty, or unapproved landings are not published. Curated landing-page storage is a Phase 2 extension, not an existing Phase 1 table.

### Brand and accessibility

Nuxt owns the PDF's blue `#2389C2`, slate `#394454`, black `#1E1E1E`, Poppins/Calibri typography, and responsive layout. The typography scale is a design recommendation, not a requirement to use fixed desktop sizes on mobile. [SETUP.md](SETUP.md) defines the frontend acceptance checks and error/empty-state copy. Accessibility is a Phase 1 release requirement, not a later enhancement.

---

## 4. Backend (Laravel 13)

### Responsibilities

- JSON API under `/api`
- Sanctum CSRF cookie + session for the Nuxt origin
- Eloquent models matching `docs/DATABASE.md`
- Policies: company owner/admin vs professional vs platform admin
- Inquiry validation, spam basics, mail
- Completeness score recalculation on profile save
- Search filters and ranking
- Media upload to disk
- Affiliation review, verified-email invitations, and admin-reviewed claims
- Public eligibility rules: published/non-deleted profiles and articles; active catalogs; approved professional affiliation with a published/non-deleted parent company
- Accepted-membership checks for company permissions and transaction-safe ownership changes

Search uses one shared ranking policy: relevance, completeness, verification, location/service match, quality, then premium visibility; an ID breaks remaining ties deterministically. The application maintains completeness and quality scores under documented, configurable rules. Featured eligibility never bypasses the earlier priorities (PDF p. 23).

### Suggested Laravel areas (logical, not generated)

- `Auth` — register, password/code login, resend, logout, password reset, `/api/me`
- `Taxonomy` — services, industries, locations, etc.
- `Companies` — public show/index + dashboard write
- `Professionals` — same
- `Onboarding` — affiliation review, team invitations, company claims, token acceptance
- `Inquiries` — public create + dashboard inbox
- `Admin` — moderation, plan assignment, verification flags
- `Content` — articles
- `Analytics` — validated browser events, authoritative inquiry events, and consistent metric definitions

---

## 5. Auth flow

### Session cookies and CSRF

Use Sanctum's server-side SPA sessions. The session cookie is `HttpOnly`, `Secure` in production, `SameSite=Lax`, and `Path=/`; prefer a host-only cookie for the same-origin deployment. JavaScript must not read the session identifier. Do not issue browser bearer tokens or put authentication credentials in localStorage/sessionStorage. Disable persistent remember-me login in Phase 1.

`XSRF-TOKEN` is a separate, deliberately JavaScript-readable cookie. The fetch wrapper URL-decodes it and sends `X-XSRF-TOKEN` on every `POST`, `PUT`, `PATCH`, and `DELETE`, including anonymous registration, inquiries, and events. Send credentials and `Accept: application/json`; preserve Origin/Referer through the proxy. HttpOnly does not replace CSRF protection.

Enable Laravel's `statefulApi` middleware and configure first-party hosts as described in [Sanctum SPA authentication](https://laravel.com/framework/docs/13.x/sanctum#spa-authentication). Production requires HTTPS and correct trusted-proxy configuration so Laravel issues secure cookies. Use the [environment rules](#8-environments) for optional sibling subdomains.

### Password and email-code login

The Phase 1 implementation default is an emailed code after the password for every fresh company, professional, onboarding-account, and platform-admin login. This adapts Musticker's verification-screen pattern to Sanctum sessions; it does not adopt its token-cookie implementation or trusted-device bypass.

1. The browser calls `GET /sanctum/csrf-cookie` with credentials enabled. This initializes a CSRF-protected anonymous session, not an authenticated account.
2. `POST /api/login` checks email/password without signing the user into the guard. Valid credentials create a short-lived `login_challenges` record bound to the active user, current email, `auth_version`, and anonymous browser session. Email a code and return `202` with the challenge details; `/api/me` and other protected endpoints still return `401`.
3. `POST /api/login/verify` submits the challenge ID and code using the same session and CSRF header. Lock the user then challenge; recheck the session binding, account state, current email/version, expiry, attempt budget, and unused/unrevoked state. Consume a matching code atomically; only one concurrent verification may succeed.
4. A successful code check sets `email_verified_at` if absent, signs the user into the session, regenerates the session ID and CSRF token, and records the challenge's validated `auth_version` in the session. Never replace that version with a newer one after a concurrent reset. Return `200`; Nuxt reads the fresh CSRF cookie before the next write and loads `GET /api/me`.
5. `POST /api/logout` logs out, invalidates the server session, regenerates CSRF, and clears the authentication cookie using the same path/domain attributes. Expired sessions require password and code again. Handle `401` and `419` without losing non-secret form input or blindly replaying writes; clear passwords and codes from frontend state after use.

Code defaults: six cryptographically random digits, a ten-minute challenge lifetime, and at most five failed code attempts per challenge. Resend requires the same pending session, waits at least 60 seconds, and replaces the previous code without extending the original deadline or resetting failed attempts. Allow at most three sends, including the initial send, per account per 15 minutes. Apply additional account/IP limits to login, verification, resend, registration, and password reset in a shared rate-limit store; new challenges and parallel requests must not bypass those limits. These are configurable launch defaults, not figures prescribed by the PDF.

Store only a keyed MAC of the code, never a plaintext code or an unkeyed hash of its small numeric space; keep the MAC key outside the database and use constant-time comparison. Store only a hash of the random session-binding nonce. Redact passwords, codes, reset/claim/invitation tokens, session cookies, and CSRF headers from application/proxy logs and analytics. Deliver mail after commit, protect any queued code payload, and discard it after delivery or expiry. A delivery failure leaves the user unauthenticated with a retry/resend path.

Starting a replacement challenge in the same browser invalidates its earlier challenge. Password reset/change, email change, account deletion/restoration, and platform-role changes increment `users.auth_version` and revoke pending challenges and existing sessions. Clear `email_verified_at` when the email changes; password reset never signs the user in automatically. Every protected request checks a non-deleted user, verified email, and the session's version against the current user row; sensitive access-changing transactions repeat that check under the user lock. A session written late after revocation remains unusable because its version is stale.

An email code confirms mailbox access; it is not phishing-resistant MFA or company identity verification. Stronger admin authentication, such as passkeys, can be added separately. See the [OWASP authentication-factor guidance](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html) and [session guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

### Registration and authorization

All registration routes create an unverified user and return `201` with `next_action = login`, without authenticating the session. The first successful password-plus-code login verifies the current email. There is no separate signed-link email-verification flow in Phase 1.

- `POST /api/register` creates an account only for company/sales users entering a claim or invitation flow. It creates neither a company nor a professional and does not introduce buyer accounts.
- `POST /api/register/company` creates user + draft company + accepted `company_users.owner`. The new listing is claimed, but neither verified nor published automatically; the owner cannot use protected routes until login completes.
- `POST /api/register/professional` requires `company_id` and `job_title`; it creates user + draft professional with `affiliation_status = pending`. The company FK is always present. No company membership is granted yet.
- An email-verified company owner/admin or platform admin reviews affiliation. Approval of a self-registered professional requires their verified email, records `affiliation_reviewed_by` / `affiliation_reviewed_at`, and creates an accepted professional membership. Only platform admins publish the profile, and only after affiliation is approved. Rejection leaves a private draft with no company access.
- Platform admins are created by an existing admin, not public registration; the same password/code login applies.

Authorization lives in Laravel policies. Nuxt hides buttons; the API still rejects forbidden writes. Approved professional editing requires accepted company membership. The membership-free exception covers only the linked user's non-deleted private draft with pending/rejected affiliation in a non-deleted company; independent owner/admin permissions use company-scoped routes. A retained user/profile link after restoration never restores access to an approved or published profile.

Claims, invitations, affiliation decisions, membership changes, and deletion/restoration share the [locking and eligibility-recheck rules](DATABASE.md#44-company_users), so concurrent requests cannot recreate access after cleanup.

### Team invitations

1. An accepted company owner/admin creates an approved roster profile and a `team_invitations` row bound to that profile, company, and intended email. A roster profile may have `user_id = null`.
2. The recipient signs in, or creates an account without generating another professional and completes password/code login for the intended email.
3. Acceptance validates the hashed, unexpired, unused, unrevoked token and the matching non-deleted company/profile and verified email. In one transaction, lock the applicable user, company, roster, membership, and invitation rows in the shared order, recheck eligibility, attach the user, create the accepted membership, and consume the invitation. A token cannot take over an already owned profile or create a second professional for the same user.

### Company claims

1. An authenticated user with verified email requests an unclaimed company, creating a pending `company_claims` record. A request grants no editing rights.
2. A platform admin reviews authority to represent the company. Approval issues an emailed token in `claim_tokens`, linked by `company_claim_id` and bound to the intended user/email; rejection grants nothing.
3. Acceptance requires the approved claim, the intended active authenticated user with matching verified email, and an unexpired, unused, unrevoked token. Laravel takes the shared user/company/membership/claim/token locks, confirms the company is non-deleted and still unclaimed with no accepted owner, creates or promotes the accepted owner membership, sets `claimed_at`, marks the claim fulfilled, consumes the token, rejects competing pending/approved claims with a lifecycle note, and revokes their unused tokens atomically. Company/claimant deletion also closes outstanding claims; restoration requires a fresh request and review, as specified in [DATABASE.md](DATABASE.md#5-soft-deletes).

Claim and invitation tokens contain at least 32 cryptographically random bytes before URL-safe encoding; store only SHA-256 hashes. Treat emailed links as secrets: use HTTPS, avoid third-party scripts/analytics on acceptance pages, and apply `Referrer-Policy: no-referrer`. Opening a link never grants access; acceptance is a CSRF-protected POST from the intended verified account.

These are Phase 1 workflows. Affiliation approval, ownership claims, email verification, and public company/professional verification are distinct checks; none automatically grants another badge or publication status.

---

## 6. Inquiry flow

```
Buyer (no account)
  → Nuxt public form
  → POST /api/inquiries
  → Laravel validates public targets and derives the company
  → Transaction: store inquiry + one authoritative inquiry event
  → After commit: mail recipient(s) + confirmation to sender
  → Company/sales dashboard inbox
```

Routing:

- If `professional_id` is present, derive `company_id` from that professional and reject a supplied mismatch. Both profiles must be published/non-deleted, and the affiliation must be approved.
- A professional inquiry is assigned to the active, email-verified affiliated user with accepted company membership; an unclaimed or unavailable roster contact falls back to the company inbox and its reachable contact email.
- Company-level inquiries use `assigned_user_id = null` for the shared company inbox, notifying `inquiry_email` and accepted email-verified owners/admins, with duplicate recipients removed. Publishing a contactable listing requires a validated company fallback inbox.
- Company inboxes are scoped to the inquiry's company and accepted owner/admin membership. A professional sees their own inquiries; platform admins may moderate across companies. Pending/rejected affiliations confer no company-inbox access.
- `POST /api/contact` sets `type = platform` server-side, has no company/professional target, and routes to platform admins. It is excluded from provider lead counts.

### Measurement

The browser sends `view`, `search_impression`, `cta_click`, and `website_click` to `POST /api/events` when the relevant profile/result/action is actually displayed or performed. Each occurrence has a fresh UUID `event_key`, reused on retries; the API validates targets, rate-limits ingestion, and deduplicates that key. SSR fetches, prefetches, and API retries do not generate view events.

The server creates one `inquiry` event per accepted provider inquiry, linked by `inquiry_id`; clients cannot submit it. Phase 1 defines a lead conversion as an accepted, non-spam provider inquiry, including questions and quote requests, not a closed sale. Contact/question/quote counts come from `inquiries.type`. The inquiry-to-view rate divides eligible inquiries by profile views for the same target and UTC period; zero views returns null. This is an aggregate activity ratio, not unique-visitor attribution, and it can exceed 1. Company-wide totals include the team and also expose `company_profile_views` plus `sales_profile_views`, whose sum is company-wide `profile_views`. Individual professional statistics cover only that person. Dashboard totals exclude platform contacts and inquiries subsequently marked spam or deleted.

---

## 7. Media

Phase 1: Laravel stores public profile images on its `public` disk (local files) or a configured S3 disk, records `media` rows, and returns public URLs and `alt_text` through the API. For local public files, expose Laravel's `public/storage` link at `/storage/**`; the default private `local` disk is not a public media URL source. See [Laravel's public disk](https://laravel.com/framework/docs/13.x/filesystem#the-public-disk). Nuxt never writes to storage directly. Images: company logo/cover and professional photo; article images accompany Phase 2 content. Validate file type/size and use descriptive alternatives for meaningful images; decorative images get empty alternatives. Captions are required if video is introduced later.

For Phase 1 uploads, allow JPEG, PNG, and WebP only. Validate decoded content, byte size, and pixel dimensions; re-encode accepted images, strip metadata, and generate server-owned filenames. Reject SVG/HTML and executable content, keep unprocessed originals private, and disable script execution in public media storage. These are implementation defaults following [OWASP upload guidance](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

Render user content as escaped text. Any supported rich text must pass a maintained server-side allowlist sanitizer before rendering; never send untrusted HTML directly to `v-html`. Validate website/social URLs against allowed `http`/`https` schemes and reject executable schemes, following [Vue's security guidance](https://vuejs.org/guide/best-practices/security.html).

---

## 8. Environments

| Concern | Phase 1 intent |
| --- | --- |
| Nuxt origin | e.g. `https://bpoprofile.com` |
| Browser API base | same-origin `/api` via reverse proxy; optional `https://api.bpoprofile.com/api` |
| SSR API base | absolute Laravel API URL in server-only runtime configuration |
| Sanctum stateful domains | frontend `host[:port]`, without a scheme; include development ports |
| Public media | `/storage/**` served from Laravel's public disk, or object-storage URLs |
| Mail | transactional provider |
| Search | PostgreSQL |

Preferred deployment: one public domain; route `/api/**` and `/sanctum/**` to Laravel, serve `/storage/**` from Laravel's public disk when using local media, and send other paths to Nuxt. The SSR API base must resolve to Laravel from the Nuxt server.

If using sibling subdomains, configure credentialed browser fetch, CORS with the exact frontend origin and credentials allowed, and a shared cookie domain such as `.bpoprofile.com`. Apply CORS to the API and CSRF-cookie routes. The SPA and API must share the same parent domain for this Sanctum design.

---

## 9. What each side must not do

Nuxt does not:

- Compute ranking
- Enforce plan limits
- Trust client-only “is admin” flags
- Write SQL

Laravel does not:

- Render public HTML
- Own brand layout or Poppins/color tokens
- Store session UI state

---

## 10. Phase boundaries

| Phase | Architecture change |
| --- | --- |
| 1 | Directory launch, safe inquiry routing, minimum affiliation/invitation/claim workflows, manual verification, accessibility, and raw event capture |
| 2 | Content and curated SEO landings, richer analytics, optional event rollups, and enhanced moderation |
| 3 | Billing provider webhooks and enforced entitlements; company plan fields already exist; individual professional plans require an explicit additional assignment model |
| 4 | New resources (threads, favorites) as additional API modules |
