# BPO Profile — API

**Base:** `/api`  
**Format:** JSON  
**Auth:** Laravel Sanctum SPA session for first-party Nuxt  
**Public endpoints:** no auth  
**Write endpoints:** auth unless noted

Errors use Laravel-style validation (`422` with `errors` object) and `401` / `403` / `404`.

This contract implements [BPO Profile.pdf](BPO%20Profile.pdf); framework, route names, and workflow details are implementation decisions. Basic company claims and verification are Phase 1 launch features (PDF page 25). Editorial resources and curated discovery landings expand in Phase 2; billing and individual professional plans are deferred to Phase 3. Untagged endpoints are Phase 1 unless their section states otherwise.

---

## 1. Auth

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/sanctum/csrf-cookie` | no | Set CSRF cookie (Sanctum, not under `/api` if default) |
| POST | `/api/register` | no | Create account for an existing-company claim or team invitation |
| POST | `/api/register/company` | no | Create user + company |
| POST | `/api/register/professional` | no | Create user + pending professional affiliation |
| POST | `/api/login` | no | Validate password and send login code; session remains anonymous |
| POST | `/api/login/verify` | pending challenge | Verify code and complete authenticated session |
| POST | `/api/login/resend` | pending challenge | Replace code for the same pending session |
| POST | `/api/logout` | yes | End session |
| GET | `/api/me` | yes | Current user + memberships |
| POST | `/api/forgot-password` | no | Send reset link |
| POST | `/api/reset-password` | no | Set new password |

Every authenticated endpoint requires a completed password/code login, a non-deleted email-verified user, and a current session `auth_version`. “Pending challenge” permits only verification/resend in its bound anonymous session, never dashboard access.

All first-party browser writes follow the [Sanctum auth flow](ARCHITECTURE.md#5-auth-flow), including public forms and events: initialize CSRF, send credentials and the URL-decoded cookie as `X-XSRF-TOKEN`, and request JSON responses. “No auth” means no account required; it does not disable CSRF protection.

`POST /api/register` takes `first_name`, `last_name`, `email`, `password`, and `password_confirmation`. It creates no company, professional, or membership; the verified user completes a claim or invitation flow below. This is provider onboarding, not a buyer-account feature. Registration, login, verification, and reset endpoints are rate limited.

### Password and email-code login

All provider and platform-admin accounts use this flow on every fresh sign-in. Registration returns `201` with `{ "next_action": "login" }`, leaves `email_verified_at = null`, and creates no authenticated session. The first successful code check verifies the current email. There are no separate `/api/email/verify/...` or verification-notification endpoints in this contract.

`POST /api/login` takes `email` and `password`. Valid credentials start a pending challenge and return `202`:

```json
{
  "status": "email_code_required",
  "challenge_id": "f8d4c2a7-073b-4e0a-a219-7cd01340ec4e",
  "masked_email": "a***@example.com",
  "expires_in": 600,
  "resend_after": 60
}
```

The session remains anonymous: `/api/me`, dashboards, claims, and admin routes return `401` until the code succeeds. Invalid credentials or an unavailable account return the same generic `401`, without a challenge or account-status details. Starting a replacement challenge revokes the earlier challenge in that browser.

`POST /api/login/verify` takes:

```json
{
  "challenge_id": "f8d4c2a7-073b-4e0a-a219-7cd01340ec4e",
  "code": "012345"
}
```

Keep the code as a six-character string, including leading zeros. Verify only with the original anonymous session and valid CSRF header; the challenge ID alone grants no authority. On success, atomically consume the challenge, verify the account email if needed, regenerate the session ID/CSRF token, and return `200` with `{ "status": "authenticated" }`. Authentication is carried by the HttpOnly session cookie, with no bearer token in JSON. Read the updated CSRF cookie before another write, then fetch `/api/me`. Replays, superseded codes, expired/revoked challenges, or a wrong session return a generic `422`; account/IP throttling returns `429` with `Retry-After`. Protected endpoints also reject stale `auth_version` sessions.

`POST /api/login/resend` takes only `challenge_id`, requires its pending session and CSRF header, and returns `202` with the same challenge shape and remaining `expires_in`. It does not accept a replacement email address or extend the original ten-minute deadline. Wait 60 seconds between sends; allow at most three sends including the initial one per account per 15 minutes. Resending invalidates the previous code but preserves the five-failed-attempt budget. At the fifth failure revoke the challenge; restarting requires the password and remains subject to aggregate account/IP limits. Concurrent verification/resend requests must share the same locked state.

Cookie attributes, keyed code storage, delivery failures, and session invalidation follow the [architecture auth flow](ARCHITECTURE.md#5-auth-flow) and [login challenge schema](DATABASE.md#417-login_challenges). Forgotten-password responses are generic regardless of account existence. A successful password reset revokes old sessions/challenges and requires a fresh password/code login; it never authenticates the reset request.

### `POST /api/register/company`

```json
{
  "first_name": "Ana",
  "last_name": "Reyes",
  "email": "ana@example.com",
  "password": "********",
  "password_confirmation": "********",
  "company_name": "Northshore CX"
}
```

Company registration creates a draft company, sets `claimed_at`, and creates an accepted `owner` membership in one transaction. Email verification is required before claims, invitation acceptance, affiliation approval, and submission for publication. Registration does not automatically verify or publish the company. A new listing may lack `inquiry_email` while draft, but a validated fallback inbox is required before publication.

### `POST /api/register/professional`

```json
{
  "first_name": "Luis",
  "last_name": "Cruz",
  "email": "luis@example.com",
  "password": "********",
  "password_confirmation": "********",
  "company_id": 12,
  "job_title": "Director of Business Development"
}
```

`company_id` and `job_title` are required. The company must exist and be available for registration. Create the user and a draft professional with `affiliation_status = pending` in one transaction; do not create a `company_users` membership yet. After completing password/code login, the user may edit their own private draft, but has no company-management or company-inbox access. An accepted company owner/admin or platform admin reviews affiliation. Approval creates an accepted `professional` membership (preserving any existing owner/admin role); publication still requires platform-admin review. Reject attempts to create a second professional for the same user.

### `GET /api/me` (shape)

```json
{
  "id": 1,
  "first_name": "Ana",
  "last_name": "Reyes",
  "email": "ana@example.com",
  "email_verified_at": "2026-09-25T08:00:00Z",
  "platform_role": "user",
  "companies": [
    { "id": 10, "name": "Northshore CX", "slug": "northshore-cx", "role": "owner" }
  ],
  "professional": { "id": 44, "slug": "ana-reyes", "company_id": 10, "affiliation_status": "approved" }
}
```

`companies` includes accepted memberships only; a pending or rejected affiliation is exposed through the user's own `professional` object. Account-only users can have an empty `companies` array and `professional = null`.

---

## 2. Public catalogs

Used by SSR pages. Taxonomies and locations require `is_active = true` and `deleted_at IS NULL`; they have no publication status. Plans require `is_active = true` and have no soft-delete column. Return company plans at launch; individual professional plans require the Phase 3 assignment and entitlement model before they can be offered.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/services` | Service list |
| GET | `/api/industries` | Industry list |
| GET | `/api/capabilities` | Capability list |
| GET | `/api/languages` | Language list |
| GET | `/api/technologies` | Technology list |
| GET | `/api/locations` | Location tree or filtered list |
| GET | `/api/plans` | Public plan comparison |

`GET /api/locations?type=country`  
`GET /api/locations?parent_id=63` for children.

Taxonomy item:

```json
{
  "id": 3,
  "name": "Contact Center",
  "slug": "contact-center",
  "description": null
}
```

---

## 3. Public discovery

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/companies` | Directory + search |
| GET | `/api/companies/{slug}` | Company profile |
| GET | `/api/professionals` | Sales directory + search |
| GET | `/api/professionals/{slug}` | Sales profile |
| GET | `/api/services/{slug}` | Phase 2: curated service landing payload |
| GET | `/api/industries/{slug}` | Phase 2: curated industry landing payload |
| GET | `/api/locations/{countrySlug}` | Phase 2: country landing |
| GET | `/api/locations/{countrySlug}/{placeSlug}` | Phase 2: region or direct-child city landing |
| GET | `/api/locations/{countrySlug}/{regionSlug}/{citySlug}` | Phase 2: city within a region |
| GET | `/api/home` | Launch search/catalog/value-proposition/how-it-works/CTA content; featured and resource blocks added in Phase 2 |
| GET | `/api/articles` | Phase 2: resource index |
| GET | `/api/articles/{slug}` | Phase 2: article |
| GET | `/api/landings/{slug}` | Phase 2: approved service/location or industry/service landing |

Public company queries require `status = published` and no soft deletion. Public professional queries additionally require `affiliation_status = approved` and a published, non-deleted parent company; this applies to search, homepage blocks, embedded teams, and show endpoints. Public articles require `status = published` and no soft deletion. Catalog landing targets must be active and non-deleted.

Phase 2 combination landings use curated editorial content plus approved filters over the existing directory. Return `filters`, `content`, paginated `data`, `seo_title`, `seo_description`, `breadcrumbs`, and `canonical_url`. Only editorially approved combinations with useful original content and at least one eligible listing are indexable; a single listing alone does not meet the content requirement. Unknown, inactive, empty, or unapproved landings return `404`. Arbitrary filter permutations do not generate indexable landings. Each geographic path segment resolves under its immediate parent, so same-named cities in different regions remain unambiguous. Storage and editorial administration for curated landings are Phase 2 extensions; they add no required Phase 1 table.

### Company search query

`GET /api/companies`

| Param | Meaning |
| --- | --- |
| q | keyword |
| service | slug or id |
| industry | slug or id |
| location | location id |
| country | country slug |
| size | company_size value |
| capability | slug or id |
| work_model | value |
| language | slug or id |
| technology | slug or id |
| sort | `relevance` (default), `newest`, `name` |
| page | paginator |

Professional search supports `q`, `service`, `industry`, `location`, `country`, `language`, `sort`, and `page`.

Geographic filters match the selected active, non-deleted location and its active, non-deleted descendants. Companies match any operating `company_locations` row in that subtree, not just HQ. Professionals match their primary `location_id`; `professional_markets` describes served markets and does not imply physical presence. A `country` slug resolves to a country root. When both `country` and `location` are given, intersect them and require the location to belong to that country; invalid, inactive, deleted, or conflicting selections return `422`. Thus a country or region search includes companies/professionals recorded at a city below it.

For `sort=relevance`, apply the brief's priorities in order: relevance, profile completeness, verification, location/service match, quality, then eligible premium visibility (PDF page 23). Use `id ASC` only to break remaining ties. The shared scoring and placement-eligibility rules are in `DATABASE.md`; premium placement cannot skip an earlier priority. `newest` and `name` are explicit alternative sorts, never a bypass of visibility or filtering rules.

### Company card (list)

```json
{
  "id": 10,
  "slug": "northshore-cx",
  "name": "Northshore CX",
  "tagline": "Bilingual customer support for US healthcare.",
  "hq": { "id": 88, "name": "Manila", "country": "Philippines" },
  "services": [{ "name": "Customer Support", "slug": "customer-support" }],
  "industries": [{ "name": "Healthcare", "slug": "healthcare" }],
  "claimed": true,
  "verified": false,
  "featured": false,
  "completeness_score": 82,
  "logo_url": "https://...",
  "logo_alt_text": "Northshore CX logo"
}
```

### Company profile (show)

Extends the card with `overview`, `why_choose_us`, `founded_year`, `company_size`, `work_model`, `locations`, `capabilities`, `technologies`, `languages`, `certifications`, `website_url`, `linkedin_url`, `other_social_json`, `phone`, `cover_url`, `cover_alt_text`, `seo_title`, `seo_description`, and eligible `professionals[]` cards. Company-supplied client proof/testimonials can be included in `overview` as attributed company content; they are not platform-verified buyer reviews. Return available inquiry actions (`contact`, `question`, `quote`) without exposing the internal `inquiry_email` or assignment data.

### Professional card

```json
{
  "id": 44,
  "slug": "luis-cruz",
  "first_name": "Luis",
  "last_name": "Cruz",
  "job_title": "Director of Business Development",
  "company": { "id": 10, "name": "Northshore CX", "slug": "northshore-cx" },
  "location": { "id": 88, "name": "Manila", "country": "Philippines" },
  "expertise": "Healthcare CX programs",
  "verified": false,
  "photo_url": "https://...",
  "photo_alt_text": "Luis Cruz"
}
```

### Professional profile (show)

Extends the card with `bio`, `experience_summary`, `services[]`, `industries[]`, `languages[]`, `markets[]` (locations served, distinct from primary `location`), `timezone`, `linkedin_url`, `website_url`, configured `public_email`, `phone`, `featured`, `completeness_score`, `seo_title`, and `seo_description`. Include the company card and available inquiry actions so the page can offer contact, ask-a-question, and quote forms (PDF pages 16 and 22). Nullable fields remain `null`; taxonomy and market arrays use `{id, name, slug}` items. Media responses include their stored alt text; do not return private user email, claim tokens, or inbox recipients.

List responses are paginated:

```json
{
  "data": [],
  "meta": { "current_page": 1, "last_page": 8, "per_page": 20, "total": 146 }
}
```

Public GETs have no analytics side effects. Browser instrumentation records actual profile views and displayed search-result impressions through `/api/events`; SSR fetches, prefetches, and retries do not each count as a view.

---

## 4. Public inquiries

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/inquiries` | no |
| POST | `/api/contact` | no |

### `POST /api/inquiries`

```json
{
  "type": "quote",
  "company_id": 10,
  "professional_id": 44,
  "sender_name": "Jordan Lee",
  "sender_email": "jordan@buyer.com",
  "sender_company": "Harbor Retail",
  "sender_phone": "+1...",
  "message": "We need overnight chat support for two brands.",
  "meta": { "services": ["customer-support"], "timeline": "60 days" }
}
```

Rules:

- `type`: `contact` | `question` | `quote`
- At least one of `company_id` or `professional_id` is required.
- Targets must satisfy public-profile visibility rules and have a working recipient path. When `professional_id` is supplied, always derive `company_id` from that professional; reject a supplied mismatching company with `422`.
- Company inquiries use `assigned_user_id = null` and go to the shared company inbox, notifying `inquiry_email` and accepted owner/admin users with verified email (deduplicate recipients). Professional inquiries are assigned to the linked active, email-verified user with accepted company membership and approved affiliation; a roster professional without such a user falls back to the company inbox and those recipients.
- Company inbox reads and writes require accepted owner/admin membership in the target company. A professional sees only inquiries for their own profile assigned to their user. Platform admins may moderate all inquiries.
- Apply a honeypot and IP/email rate limits. Reject invalid or spam submissions before counting an accepted inquiry. Reclassification as spam excludes the inquiry from reporting.
- Store the inquiry and one server-created `inquiry` event in a single transaction, with a unique `inquiry_id` reference. Send notifications after commit. Clients cannot submit inquiry events or set assignment/status fields.

Response `201` with `{ "ok": true }`. Do not echo internal assignment.

### `POST /api/contact`

Platform inbox only (`type = platform`). Same sender fields + message; reject company/professional targets. These messages do not count as provider leads or generate provider `inquiry` events.

### `POST /api/events`

Public, rate limited. Record one profile action or displayed search-result impression:

```json
{
  "event": "website_click",
  "event_key": "13c06e75-a835-470a-a8a2-5acba732f840",
  "company_id": 10
}
```

Allowed client events: `view`, `search_impression`, `cta_click`, and `website_click`. Require a fresh UUID `event_key` per action or displayed result, reused for retries; a unique key prevents duplicate rows. Require a public company or professional target, derive the parent company for professional events, and reject mismatched IDs. A repeated key with the same payload is a successful no-op; reuse with a different event/target is `422`. A search impression means a result actually displayed in a rendered result list, not every row fetched. A profile view means a displayed profile page, not an API GET. `inquiry` events are server-only and reference the saved inquiry.

---

## 5. Company dashboard

All require auth and accepted `owner` or `admin` membership in `{companyId}`; platform admins may act through the same policies. Every nested resource must belong to that company. A missing or foreign nested resource returns `404`; being a member of a different company never grants access.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/dashboard/companies/{companyId}` | Company profile for editing |
| PUT | `/api/dashboard/companies/{companyId}` | Update profile fields |
| POST | `/api/dashboard/companies/{companyId}/logo` | Upload logo + alt text |
| POST | `/api/dashboard/companies/{companyId}/cover` | Upload cover + alt text |
| PUT | `/api/dashboard/companies/{companyId}/taxonomies` | Replace service/industry/etc. IDs |
| PUT | `/api/dashboard/companies/{companyId}/locations` | Replace location IDs + HQ |
| POST | `/api/dashboard/companies/{companyId}/certifications` | Add certification |
| PUT | `/api/dashboard/companies/{companyId}/certifications/{id}` | Update certification |
| DELETE | `/api/dashboard/companies/{companyId}/certifications/{id}` | Soft-delete certification |
| GET | `/api/dashboard/companies/{companyId}/team` | Professionals, affiliation requests, and pending invitations |
| POST | `/api/dashboard/companies/{companyId}/team` | Create company-owned roster professional |
| GET | `/api/dashboard/companies/{companyId}/team/{professionalId}` | Team profile for editing |
| PUT | `/api/dashboard/companies/{companyId}/team/{professionalId}` | Update team profile |
| POST | `/api/dashboard/companies/{companyId}/team/{professionalId}/photo` | Upload photo + alt text |
| PUT | `/api/dashboard/companies/{companyId}/team/{professionalId}/taxonomies` | Replace services, industries, languages, and markets |
| PATCH | `/api/dashboard/companies/{companyId}/team/{professionalId}/affiliation` | Approve or reject pending affiliation |
| DELETE | `/api/dashboard/companies/{companyId}/team/{professionalId}` | Soft-delete professional and remove public team visibility |
| POST | `/api/dashboard/companies/{companyId}/team/{professionalId}/invitations` | Invite user to claim an unlinked roster professional |
| DELETE | `/api/dashboard/companies/{companyId}/team/{professionalId}/invitations/{id}` | Revoke an unused invitation |
| GET | `/api/dashboard/companies/{companyId}/inquiries` | Company inbox |
| PATCH | `/api/dashboard/companies/{companyId}/inquiries/{id}` | Mark read / replied / archived / spam |
| GET | `/api/dashboard/companies/{companyId}/stats` | Impressions, views, clicks, inquiries, conversion |

### `PUT /api/dashboard/companies/{companyId}` (subset)

```json
{
  "name": "Northshore CX",
  "tagline": "...",
  "overview": "...",
  "why_choose_us": "...",
  "website_url": "https://...",
  "linkedin_url": "https://...",
  "founded_year": 2014,
  "company_size": "201_500",
  "work_model": "offshore",
  "inquiry_email": "sales@northshore.example",
  "phone": "+63...",
  "status": "pending_review"
}
```

Company users may request `draft` or `pending_review`; they cannot override a platform-admin suspension. Only platform admins set `published` / `suspended`, verification, featured status, or plan assignment. Updates cannot change ownership or bypass moderation. All image-upload endpoints accept validated JPEG/PNG/WebP with `alt_text`; enforce content, byte-size, and dimension checks plus the [media processing rules](ARCHITECTURE.md#7-media). Taxonomy/location IDs must be active and valid.

### Company locations and headquarters

`PUT /api/dashboard/companies/{companyId}/locations` accepts `location_ids` and nullable `hq_location_id`. All selected locations must be active and non-deleted; HQ, when set, must be in `location_ids`. In one transaction, lock the company, replace its operating-location pivots, set `companies.hq_location_id`, and flag exactly that pivot as `is_headquarters`. A null HQ clears all HQ flags. Removing the existing HQ requires a replacement or explicit null. Reject inconsistent input with `422`; general profile writes cannot update HQ separately. Admin location changes follow the same rule.

### Team affiliation and invitations

All access-changing operations and related deletion/restoration follow the [shared transaction and locking rules](DATABASE.md#44-company_users). Recheck user/session state and actor permissions inside the transaction, not only in request middleware.

Creating a roster professional requires `first_name`, `last_name`, and `job_title`. The route supplies `company_id`; `user_id` remains `null`, affiliation is company-approved, and publication status starts as `draft`. Company staff may manage this roster profile before it has a login.

Affiliation review accepts `{ "decision": "approved" }` or `{ "decision": "rejected" }` from a verified company owner/admin or platform admin. Record `affiliation_status`, `affiliation_reviewed_by`, and `affiliation_reviewed_at`. Approval of a self-registered professional requires their verified email, creates an accepted membership, and preserves a pre-existing owner/admin role. Affiliation approval does not set platform verification or publish the professional. Rejected applicants retain access to their own draft but gain no company membership or inbox access.

An invitation takes `{ "email": "luis@example.com" }` for an unlinked roster row and creates `team_invitations` with a hashed, expiring, single-use token emailed to that address. A new invitation revokes any prior unused invitation for the same roster row. It does not create an accepted membership or grant dashboard access.

`POST /api/team-invitations/accept` requires an active authenticated user with verified email and `{ "token": "..." }`. In one transaction, take the applicable user, company, roster, membership, and invitation locks in the shared order, then validate the unused/unrevoked token, expiry, intended email, non-deleted company, and non-deleted unlinked roster row with approved affiliation; attach `user_id`, create an accepted `professional` membership (preserving owner/admin), and mark the invitation accepted. Reject conflicting existing user/profile links or duplicate ownership of the roster; do not silently merge or transfer profiles. Approved affiliation remains approved. Acceptance does not change platform publication or verification status.

Removing a team professional revokes pending invitations. Remove a `professional`-only membership that exists for that profile; preserve an independent owner/admin membership. Soft deletion prevents public discovery and new personal inquiries. Restoring a professional resets publication to draft, affiliation to pending, and verification/review fields to null; it restores neither professional membership nor invitations. Approval and publication must run again.

### Dashboard statistics

Both company and professional stats accept inclusive `from` and `to` dates (`YYYY-MM-DD`, UTC), defaulting to the last 30 calendar days including today. Return `search_impressions`, `profile_views`, `cta_clicks`, `website_clicks`, accepted `inquiries` grouped by `contact` / `question` / `quote`, and `lead_conversion_rate`. Company scope includes its professional events and inquiries, counted once per row. It also returns `company_profile_views` (no professional target) and `sales_profile_views` (professional target); their sum is the company-wide `profile_views`. Professional scope filters that person's ID only. These counts use the same UTC event window and do not represent unique visitors.

For the same target scope and date window, `lead_conversion_rate = accepted non-spam provider inquiries / profile_views`. Return `null` when views are zero. This is an inquiry-per-view ratio, not a unique-buyer funnel or a won-deal rate; it can exceed 1. Platform contacts are excluded, and quotes/questions count as inquiries. Compute inquiry totals from saved, non-deleted, non-spam inquiries linked to their unique server events so later moderation updates the totals (PDF page 37).

---

## 6. Sales dashboard

These routes address only the authenticated user's linked, non-deleted professional in a non-deleted company. Approved affiliations require accepted membership for profile editing. Inbox and stats require both approved affiliation and accepted membership. Membership-free editing is limited to the linked user's private `draft` with `pending` or `rejected` affiliation. A retained user/profile link after restoration grants no access to an approved or published profile. Company owners/admins use company-scoped team routes under their independent accepted role. Never infer another professional from the user's first company membership.

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/dashboard/professional` | Own profile |
| PUT | `/api/dashboard/professional` | Update |
| POST | `/api/dashboard/professional/photo` | Upload photo + alt text |
| PUT | `/api/dashboard/professional/taxonomies` | Services, industries, languages, markets |
| GET | `/api/dashboard/professional/inquiries` | Own inbox |
| PATCH | `/api/dashboard/professional/inquiries/{id}` | Mark own assigned inquiry read / replied / archived / spam |
| GET | `/api/dashboard/professional/stats` | Own stats |

Profile update payloads cannot change `company_id`, `user_id`, affiliation approval, verification, featured status, or plan assignment. Submission for publication requires approved affiliation, accepted company membership, and verified email; only platform admins publish or suspend. Own inbox queries additionally require `assigned_user_id` to match the signed-in user.

---

## 7. Claims

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/claims` | verified user | Submit claim request for admin review |
| POST | `/api/claims/accept` | verified intended user | Consume an approved claim's emailed token |

```json
{ "company_id": 10 }
```

```json
{ "token": "..." }
```

The public claim page may explain the process and guide visitors through login or account-only registration. Both write endpoints require authentication and verified email.

`POST /api/claims` validates an eligible, non-deleted, unclaimed company and stores a `company_claims` row with `company_id`, the requesting `user_id`, and `status = pending`. The current verified email comes from that user and is bound into the token when approved; the claim table does not duplicate email. Return `201` with the request's ID and status. A duplicate pending request for the same user/company returns `422`. A request alone neither creates ownership nor sends an ownership token.

An admin reviews the request through `PATCH /api/admin/claims/{id}` with `decision = approved` or `rejected` and an internal `review_note`. Approval records `reviewed_by_user_id` / `reviewed_at` and issues an expiring, hashed `claim_tokens` entry linked by `company_claim_id` to the request, intended user, and verified email. Email the raw token after commit; never expose token hashes in API responses. Rejection records the reason and issues no token. Reissuing an approved claim's token revokes the previous unused token first. Approval and token reissue recheck an active verified-email claimant and a non-deleted, still-unclaimed company without an accepted owner. Rejected or fulfilled requests cannot receive new tokens. Claim creation, review, reissue, acceptance, and lifecycle cleanup take the applicable user/company and child-row locks under the [shared locking rules](DATABASE.md#44-company_users).

Acceptance atomically takes the applicable user, company, membership, claim, and token locks in the shared order and rechecks eligibility: intended user and verified email must match; the token must be unused, unrevoked, and unexpired; the company must be non-deleted, still unclaimed, and without an accepted owner. Create or promote an accepted `owner` membership, set `claimed_at`, set the token's `used_at`, and mark the claim `fulfilled`. Reject competing pending/approved claims with an internal lifecycle note and revoke their unused tokens in the same transaction, preserving prior review evidence. Concurrent requests cannot grant a second initial owner or reuse a superseded approval after ownership later ends. Claim acceptance changes neither publication nor platform verification. Invalid, expired, revoked, or reused tokens and companies claimed in the meantime return `422` without granting partial access.

---

## 8. Platform admin

Prefix `/api/admin`. Requires an authenticated, email-verified user with `platform_role = admin`. Admin identity checks and manual verification must be available at launch.

| Method | Path | Purpose |
| --- | --- | --- |
| GET / POST | `/api/admin/companies` | List all statuses / create draft company |
| GET / PATCH / DELETE | `/api/admin/companies/{id}` | Inspect / update, moderate, verify, assign company plan / soft-delete |
| POST | `/api/admin/companies/{id}/restore` | Restore as draft; recheck slug and publication eligibility |
| GET / POST | `/api/admin/professionals` | List all statuses / create draft roster profile in a company |
| GET / PATCH / DELETE | `/api/admin/professionals/{id}` | Inspect / update, moderate, verify / soft-delete with membership and invitation cleanup |
| POST | `/api/admin/professionals/{id}/restore` | Restore as draft with pending affiliation; never restore access automatically |
| PATCH | `/api/admin/professionals/{id}/affiliation` | Apply the same affiliation-review rules as the company team endpoint |
| GET | `/api/admin/claims` | Pending and reviewed ownership requests |
| GET / PATCH | `/api/admin/claims/{id}` | Inspect request / approve or reject with review note |
| POST | `/api/admin/claims/{id}/token` | Reissue token for an approved, unfulfilled claim; revoke prior unused token |
| GET / POST | `/api/admin/{taxonomy}` | List / create services, industries, capabilities, languages, or technologies |
| GET / PATCH / DELETE | `/api/admin/{taxonomy}/{id}` | Inspect / update / soft-delete a term in that fixed allowlist |
| POST | `/api/admin/{taxonomy}/{id}/restore` | Restore term after checking active-slug uniqueness |
| GET / POST | `/api/admin/locations` | List tree / create location |
| GET / PATCH / DELETE | `/api/admin/locations/{id}` | Inspect / update / soft-delete location |
| POST | `/api/admin/locations/{id}/restore` | Restore after parent and sibling-slug checks |
| GET | `/api/admin/inquiries` | All provider inquiries and platform contacts |
| GET / PATCH / DELETE | `/api/admin/inquiries/{id}` | Inspect / update moderation status / soft-delete; do not rewrite sender content or target |
| POST | `/api/admin/inquiries/{id}/restore` | Restore inquiry; spam-exclusion rules still apply |
| GET / POST | `/api/admin/users` | List / create provider or platform-admin account; no ownership shortcut |
| GET / PATCH / DELETE | `/api/admin/users/{id}` | Inspect / update authorized account fields or platform role / soft-delete |
| POST | `/api/admin/users/{id}/restore` | Restore account without recreating revoked memberships or tokens |
| GET / POST | `/api/admin/articles` | Phase 2: list / create resource article |
| GET / PATCH / DELETE | `/api/admin/articles/{id}` | Phase 2: inspect / edit/publish / soft-delete |
| POST | `/api/admin/articles/{id}/restore` | Phase 2: restore as draft |

`verified` is the admin request boolean; the server sets or clears `verified_at` after identity review. Affiliation approval alone never sets that badge. `featured_until` is a Phase 2 field; company-plan assignment is manual in Phase 1 and must use an active company-audience plan. Platform admins granting ownership use the reviewed claim workflow above. Creation endpoints must honor the required database fields and defaults; admin-created companies remain unclaimed until ownership is accepted.

Deleting a company hides its professionals, removes company memberships, rejects its pending/approved claims with a lifecycle note, and revokes unused invitations/claim tokens. Restoring it does not restore permissions or published status; reset `claimed_at` and require a new claim and ownership review. Deleting a user revokes their sessions, removes memberships, rejects that user's pending/approved claims, and revokes their unused onboarding tokens; any linked public roster routes new inquiries to the company fallback. Preserve prior claim-review evidence during lifecycle rejection as specified in [DATABASE.md](DATABASE.md#416-company_claims). If the last accepted owner is removed, clear `claimed_at`; a later claimant needs a new request and review. Never silently recreate deleted relationships or reactivate old claims on restore.

Admin company patch example:

```json
{
  "status": "published",
  "verified": true,
  "plan_id": 3
}
```

---

## 9. Authz summary

| Action | Who |
| --- | --- |
| Read published profiles | anyone |
| Submit inquiry | anyone (rate limited) |
| Edit company | accepted company owner/admin; platform admin |
| Edit sales profile | linked user under the membership/private-draft rules in §6; accepted company owner/admin via company-scoped route; platform admin |
| Approve professional affiliation | verified company owner/admin or platform admin |
| Request / accept company claim | verified authenticated claimant; acceptance also requires admin approval and intended token |
| Publish / verify / feature / change plan | platform admin |
| Read another company's inquiries | platform admin only; ordinary provider accounts cannot cross company boundaries |

---

## 10. Status codes

| Code | When |
| --- | --- |
| 200 / 201 | OK / created |
| 202 | Login code challenge created or resent; not authenticated |
| 401 | Missing/expired/revoked authenticated session, pending login challenge, or invalid login credentials |
| 403 | Authenticated but not allowed |
| 404 | Unknown or publicly ineligible profile/landing; foreign nested dashboard resource |
| 419 | CSRF/session token expired or mismatched; preserve form input while refreshing auth/CSRF state |
| 422 | Validation |
| 429 | Public submission, event, auth, or token-flow rate limit |

Unpublished profiles return `404` on public show, not `403`, so slugs cannot be probed for drafts as easily.

---

## 11. Versioning

No `/v1` prefix at launch. Breaking changes wait until an external client exists. The Nuxt app is the only consumer in Phase 1.
