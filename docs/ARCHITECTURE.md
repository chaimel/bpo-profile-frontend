# BPO Profile — Architecture

**Style:** Nuxt 4 SPA/SSR frontend + Laravel 13 REST JSON API  
**Auth:** Laravel Sanctum (SPA cookie auth for the first-party Nuxt app)  
**Database:** PostgreSQL  
**Hosting shape (later):** two apps, one database, object storage for media

This document describes how the two apps fit together. It is not a scaffold.

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

- Session user loaded from `GET /api/me`
- Company dashboard selection is explicit in `/api/dashboard/companies/{companyId}/...`; Laravel validates an accepted owner/admin membership for every request
- An account awaiting onboarding may have no professional profile or company membership; a pending professional may edit their own draft without gaining company permissions
- Public listings fetched per page (SSR `useAsyncData`)
- No local copy of the full directory

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

- `Auth` — register, login, logout, password reset, `/api/me`
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

First-party SPA:

1. Nuxt calls `GET /sanctum/csrf-cookie`
2. `POST /api/login` with email/password
3. Subsequent requests send session cookie + `X-XSRF-TOKEN`
4. `GET /api/me` returns user, platform_role, accepted company memberships, and a professional profile (or null) with affiliation state
5. `POST /api/logout` destroys the session

Registration:

- `POST /api/register` creates an account only for company/sales users entering a claim or invitation flow. It creates neither a company nor a professional and does not introduce buyer accounts.
- `POST /api/register/company` creates user + draft company + accepted `company_users.owner`. The new listing is claimed, but neither verified nor published automatically.
- `POST /api/register/professional` requires `company_id` and `job_title`; it creates user + draft professional with `affiliation_status = pending`. The company FK is always present. No company membership is granted yet.
- An email-verified company owner/admin or platform admin reviews affiliation. Approval of a self-registered professional requires their verified email, records `affiliation_reviewed_by` / `affiliation_reviewed_at`, and creates an accepted professional membership. Only platform admins publish the profile, and only after affiliation is approved. Rejection leaves a private draft with no company access.
- Platform admins are created by an existing admin, not public register

Authorization lives in Laravel policies. Nuxt hides buttons; the API still rejects forbidden writes.

Team invitations:

1. An accepted company owner/admin creates an approved roster profile and a `team_invitations` row bound to that profile, company, and intended email. A roster profile may have `user_id = null`.
2. The recipient signs in or creates an account without generating another professional, then verifies the intended email.
3. Acceptance validates the hashed, unexpired, unused, unrevoked token and the matching non-deleted company/profile and verified email. In one transaction, it attaches the user, creates the accepted membership, and consumes the invitation. A token cannot take over an already owned profile or create a second professional for the same user.

Company claims:

1. An authenticated user with verified email requests an unclaimed company, creating a pending `company_claims` record. A request grants no editing rights.
2. A platform admin reviews authority to represent the company. Approval issues an emailed token in `claim_tokens`, linked by `company_claim_id` and bound to the intended user/email; rejection grants nothing.
3. Acceptance requires the approved claim, the intended active authenticated user with matching verified email, and an unexpired, unused, unrevoked token. Laravel locks the company and claim/token records, confirms the company is non-deleted and still unclaimed with no accepted owner, creates or promotes the accepted owner membership, sets `claimed_at`, marks the claim fulfilled, consumes the token, and revokes competing unused tokens atomically.

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

Phase 1: Laravel stores files on local or S3 disk, records `media` rows, and returns public URLs and `alt_text` through the API. Nuxt never writes to storage directly. Images: company logo/cover and professional photo; article images accompany Phase 2 content. Validate file type/size and use descriptive alternatives for meaningful images; decorative images get empty alternatives. Captions are required if video is introduced later.

---

## 8. Environments

| Concern | Phase 1 intent |
| --- | --- |
| Nuxt origin | e.g. `https://bpoprofile.com` |
| API origin | same domain `/api` via reverse proxy, or `https://api.bpoprofile.com` |
| Sanctum stateful domains | the Nuxt origin |
| Mail | transactional provider |
| Search | PostgreSQL |

Preferred later topology: one public domain, reverse proxy `/` → Nuxt and `/api` + `/sanctum` → Laravel. Simpler cookies, simpler CORS.

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
