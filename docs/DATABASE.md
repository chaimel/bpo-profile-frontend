# BPO Profile — Database

**Engine:** PostgreSQL  
**App:** Laravel 13 (Eloquent)  
**Conventions:** `snake_case` tables and columns, `id` bigint primary keys and `created_at` / `updated_at` unless a table below explicitly defines a composite key or creation-only timestamps. `deleted_at` exists only where listed. Slugs on soft-deleted entities are unique among non-deleted rows, enforced by partial unique indexes. Pivots and append-only events are explicit exceptions to the default key/timestamp convention; Laravel infrastructure tables retain their framework defaults.

This model covers the directory foundation and the verification/claim workflows required before public launch ([BPO Profile.pdf](BPO%20Profile.pdf), pp. 24-25), plus company plan/entitlement fields needed for later billing. The tables and workflow details are implementation decisions, not a schema prescribed by the PDF. Individual professional plan assignments and curated combination SEO pages require explicit later schema design; they are not implemented by the current company plan relationship.

---

## 1. Entity map

```
users
  ├── company_users (role at a company)
  │     └── companies
  │           ├── company_locations → locations
  │           ├── company_service (services)
  │           ├── company_industry (industries)
  │           ├── company_capability (capabilities)
  │           ├── company_language (languages)
  │           ├── company_technology (technologies)
  │           ├── company_certifications
  │           └── professionals
  │                 ├── professional_service
  │                 ├── professional_industry
  │                 ├── professional_language
  │                 └── professional_markets → locations
  ├── inquiries (optional company_id / professional_id)
  └── articles

plans ← companies.plan_id
media ← companies / professionals / articles (via media table)
company_claims ← companies / users
claim_tokens ← company_claims
team_invitations ← companies / professionals / users
profile_events (analytics)
```

---

## 2. Relationships

| From | To | Type | Rule |
| --- | --- | --- | --- |
| User | Company | many-to-many via `company_users` | A user may manage multiple companies; only accepted memberships grant access; a user still has at most one professional profile |
| Company | Professional | one-to-many | A professional belongs to exactly one company |
| Professional | User | optional one-to-one | Unclaimed roster rows have `user_id = null` |
| Company | Location | many-to-many | HQ flagged on pivot |
| Professional | Location | many-to-one | Primary city/country |
| Company / Professional | Service, Industry, Language | many-to-many | Taxonomy pivots |
| Company | Capability, Technology | many-to-many | Taxonomy pivots |
| Inquiry | Company | many-to-one, nullable | Required unless only platform contact |
| Inquiry | Professional | many-to-one, nullable | Set when the buyer contacted a person |
| Company | Plan | many-to-one | Default Basic; assigned plan must have `audience = company` |
| Company claim | User / Company | many-to-one | Admin-reviewed ownership request; approval alone grants no access |
| Team invitation | Professional / Company | many-to-one | Binds a verified-email user to the matching approved roster row on acceptance |
| Article | User | many-to-one | Author (platform admin) |

---

## 3. Roles and access

`users.platform_role`

| Value | Meaning |
| --- | --- |
| `user` | Default. Company access comes from accepted `company_users`; an applicant may edit their own pending professional profile by `professionals.user_id` |
| `admin` | Platform admin |

`company_users.role`

| Value | Meaning |
| --- | --- |
| `owner` | Full company control, billing contact later |
| `admin` | Edit company, manage team, see all company inquiries |
| `professional` | Edit own sales profile, see own inquiries |

A sales professional who also runs the listing is `owner` or `admin` on `company_users` **and** has a `professionals` row linked to the same user.

Every company-scoped authorization check requires an active user, a non-deleted company, and `company_users.accepted_at IS NOT NULL`. Pending or rejected affiliation grants no company/team/inquiry access. Own-profile draft editing is permitted by the linked `user_id`, but cannot change `company_id`, affiliation review fields, verification, or premium placement. Only platform admins set `published` or `suspended`; an approved, email-verified professional may submit `pending_review` or return to `draft`, without overriding an admin suspension.

Buyers have no rows in `users` at launch.

---

## 4. Tables

### 4.1 `users`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| platform_role | varchar(32) | `user`, `admin` |
| first_name | varchar(100) | |
| last_name | varchar(100) | |
| email | varchar(255) | unique |
| email_verified_at | timestamptz | nullable |
| password | varchar(255) | |
| remember_token | varchar(100) | nullable |
| last_login_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Indexes: unique `email`, index `platform_role`.

Sanctum personal access tokens use the default `personal_access_tokens` table.

### 4.2 `plans`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| slug | varchar(50) | unique: `basic`, `professional`, `premium` |
| name | varchar(100) | |
| audience | varchar(32) | `company`; `professional` reserved for a later assignment design |
| max_professional_seats | int | null = unlimited |
| max_images | int | |
| featured_eligible | boolean | default false |
| analytics_level | varchar(32) | `none`, `basic`, `advanced` |
| sort_order | int | |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

No payments table in Phase 1. Admin sets `companies.plan_id` and `companies.plan_expires_at`, validating that the plan is active and has `audience = company`. All three initial plan tiers belong to companies; the `professional` plan slug is a company tier name, not an individual subscription. Individual professional subscriptions and their entitlements are deferred to Phase 3 and require a separate assignment model.

### 4.3 `companies`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| plan_id | bigint FK → plans | default Basic |
| plan_expires_at | timestamptz | nullable; null = no expiry |
| name | varchar(200) | |
| slug | varchar(220) | unique among non-deleted |
| tagline | varchar(255) | nullable |
| overview | text | nullable |
| why_choose_us | text | nullable |
| website_url | varchar(500) | nullable |
| linkedin_url | varchar(500) | nullable |
| other_social_json | jsonb | nullable |
| founded_year | int | nullable |
| company_size | varchar(32) | see enum below; default `unknown` |
| work_model | varchar(32) | `onshore`, `offshore`, `nearshore`, `hybrid`, `unknown`; default `unknown` |
| hq_location_id | bigint FK → locations | nullable |
| year_established_note | varchar(255) | nullable extra display text |
| status | varchar(32) | `draft`, `pending_review`, `published`, `suspended`; default `draft` |
| claimed_at | timestamptz | nullable |
| verified_at | timestamptz | nullable |
| featured_until | timestamptz | nullable |
| completeness_score | int | 0–100, default 0; maintained by app |
| quality_score | int | 0–100, default 0; maintained by app using the shared quality rubric |
| inquiry_email | varchar(255) | nullable while draft; validated fallback inbox required before publication |
| phone | varchar(50) | nullable |
| seo_title | varchar(255) | nullable |
| seo_description | varchar(320) | nullable |
| published_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

**company_size:** `1_10`, `11_50`, `51_200`, `201_500`, `501_1000`, `1000_plus`, `unknown`

Indexes:

- partial unique `slug` where `deleted_at IS NULL` (required database constraint; application checks alone are insufficient)
- `status`, `plan_id`, `hq_location_id`
- `completeness_score`, `verified_at`, `featured_until`
- Search indexes must match the chosen query strategy; trigram indexes are optional, not a requirement to add a generic GIN index to a text column

### 4.4 `company_users`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | |
| user_id | bigint FK → users | |
| role | varchar(32) | `owner`, `admin`, `professional` |
| invited_at | timestamptz | nullable |
| accepted_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Unique `(company_id, user_id)`. Index `user_id`.

Rows created by affiliation approval, invitation acceptance, company registration, or claim acceptance set `accepted_at` in the same transaction. Invitations live in `team_invitations`; they do not confer membership before acceptance. Company registration creates the initial accepted owner and sets `companies.claimed_at`. Claim acceptance locks the company and refuses any company with `claimed_at` already set or an existing accepted owner.

### 4.5 `professionals`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | required |
| user_id | bigint FK → users | nullable until claimed |
| affiliation_status | varchar(32) | `pending`, `approved`, `rejected`; default `pending` |
| affiliation_reviewed_by | bigint FK → users | nullable; approving/rejecting company owner/admin or platform admin |
| affiliation_reviewed_at | timestamptz | nullable |
| first_name | varchar(100) | |
| last_name | varchar(100) | |
| slug | varchar(220) | unique among non-deleted |
| job_title | varchar(150) | |
| bio | text | nullable |
| expertise | text | nullable short positioning |
| experience_summary | text | nullable |
| timezone | varchar(64) | nullable IANA tz |
| location_id | bigint FK → locations | nullable |
| linkedin_url | varchar(500) | nullable |
| website_url | varchar(500) | nullable |
| public_email | varchar(255) | nullable; prefer form over exposing email |
| phone | varchar(50) | nullable |
| status | varchar(32) | `draft`, `pending_review`, `published`, `suspended` |
| verified_at | timestamptz | nullable |
| featured_until | timestamptz | nullable |
| completeness_score | int | 0–100 |
| quality_score | int | 0–100, default 0; maintained by app using the shared quality rubric |
| seo_title | varchar(255) | nullable |
| seo_description | varchar(320) | nullable |
| published_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Unique `user_id` where not null. Partial unique `slug` where `deleted_at IS NULL`. Indexes: `company_id`, `status`, `affiliation_status`, `location_id`, `completeness_score`. Both score columns have checks restricting them to 0–100, as do the company score columns.

Professional registration requires an existing, non-deleted `company_id` and creates a linked draft with pending affiliation and both scores initialized to zero. It does not create a `company_users` row. An email-verified accepted company owner/admin or platform admin reviews the affiliation; approval of a self-registered applicant requires their verified email, sets the review fields, and creates an accepted `professional` membership atomically, preserving any existing owner/admin role. Rejection leaves the draft private and grants no company access. An owner/admin-created unclaimed roster row has approved affiliation, records that actor as reviewer, and keeps `user_id = NULL` until invitation acceptance.

Affiliation approval and publication are separate decisions: the platform admin controls publication. A public professional must be non-deleted, `status = published`, `affiliation_status = approved`, and belong to a non-deleted published company. Their contact form routes to the linked verified-email user with accepted company membership, falling back to `companies.inquiry_email` for an unclaimed or unavailable representative. Publication requires this company fallback to be configured and valid; a public email field alone is not a reliable routing target.

### 4.6 Locations

`locations` is a hierarchy: country → region → city.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| parent_id | bigint FK → locations | null for countries |
| type | varchar(16) | `country`, `region`, `city` |
| name | varchar(150) | |
| slug | varchar(180) | unique per parent |
| iso_code | varchar(8) | ISO 3166-1 for countries |
| sort_order | int | |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Indexes: partial unique `(parent_id, slug)` where `deleted_at IS NULL AND parent_id IS NOT NULL`; partial unique `slug` where `deleted_at IS NULL AND parent_id IS NULL`; `type`, `iso_code`. The separate root index prevents duplicate country slugs despite a null parent.

`company_locations`

| Column | Type | Notes |
| --- | --- | --- |
| company_id | bigint FK | |
| location_id | bigint FK | city or country |
| is_headquarters | boolean | default false |
| created_at | timestamptz | |

PK or unique `(company_id, location_id)`.

`professional_markets` — markets the person sells into, not where they sit.

| Column | Type | Notes |
| --- | --- | --- |
| professional_id | bigint FK | |
| location_id | bigint FK | usually country |
| created_at | timestamptz | |

Unique `(professional_id, location_id)`.

### 4.7 Taxonomies

Same shape for `services`, `industries`, `capabilities`, `languages`, `technologies`.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| parent_id | bigint FK | nullable; services may nest later |
| name | varchar(150) | |
| slug | varchar(180) | unique among non-deleted rows |
| description | text | nullable; used on SEO landing pages |
| seo_title | varchar(255) | nullable |
| seo_description | varchar(320) | nullable |
| sort_order | int | |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Each taxonomy has a partial unique index on `slug` where `deleted_at IS NULL`. Public catalog reads require `is_active = true AND deleted_at IS NULL`.

`work_model` is a fixed API enum (`onshore`, `offshore`, `nearshore`, `hybrid`, `unknown`) backed by the `companies.work_model` field, not a taxonomy table. Curated service + location and industry + service SEO pages (PDF p.35) are a Phase 2 content model to design explicitly; taxonomy rows alone do not establish which combinations exist or have indexable content. Location landing paths follow the stored parent hierarchy, including the region segment for cities nested under regions.

Pivot tables (all: `*_id`, `company_id` or `professional_id`, `created_at`, unique pair):

- `company_service`
- `company_industry`
- `company_capability`
- `company_language`
- `company_technology`
- `professional_service`
- `professional_industry`
- `professional_language`

Seed services from the brief (expand later):

- Customer Support
- Contact Center
- Back Office
- Technical Support
- Finance & Accounting
- Healthcare BPO
- IT Outsourcing
- Sales Outsourcing
- Data Services
- Specialized Outsourcing

Seed industries:

- Healthcare
- E-commerce
- Financial Services
- Technology
- Real Estate
- Travel & Hospitality
- Telecommunications
- Retail

### 4.8 `company_certifications`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK | |
| name | varchar(150) | e.g. ISO 27001 |
| issuer | varchar(150) | nullable |
| year | int | nullable |
| sort_order | int | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

### 4.9 `media`

Single table for logos, covers, photos, article images.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| owner_type | varchar(50) | `company`, `professional`, `article` |
| owner_id | bigint | |
| kind | varchar(32) | `logo`, `cover`, `photo`, `image` |
| disk | varchar(32) | `s3` / `local` |
| path | varchar(500) | |
| filename | varchar(255) | |
| mime_type | varchar(100) | |
| size_bytes | int | |
| alt_text | varchar(255) | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Indexes: `(owner_type, owner_id, kind)`.

### 4.10 `inquiries`

One table for contact, questions, and quote requests.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| type | varchar(32) | `contact`, `question`, `quote`, `platform` |
| company_id | bigint FK | nullable |
| professional_id | bigint FK | nullable |
| assigned_user_id | bigint FK → users | nullable routing target |
| sender_name | varchar(150) | |
| sender_email | varchar(255) | |
| sender_company | varchar(200) | nullable |
| sender_phone | varchar(50) | nullable |
| message | text | |
| meta_json | jsonb | optional service interest, budget, timeline |
| status | varchar(32) | `new`, `read`, `replied`, `archived`, `spam` |
| source_path | varchar(255) | page that submitted |
| ip_address | inet | nullable |
| user_agent | varchar(255) | nullable |
| read_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Indexes: `company_id`, `professional_id`, `assigned_user_id`, `status`, `created_at`, `sender_email`.

For `type = platform`, both target IDs and `assigned_user_id` are null. Other inquiry types require `company_id`. When `professional_id` is present, derive `company_id` from that professional on the server and reject a conflicting client-supplied company. Resolve both records under the public eligibility rules before accepting the inquiry; an inactive, suspended, deleted, or unapproved target cannot receive public submissions. `assigned_user_id`, when present, must be the target professional's linked active, verified-email user with accepted membership at that same company. Company-only inquiries and professional fallbacks use `assigned_user_id = NULL` and the shared company inbox; notify the validated `inquiry_email` and accepted owner/admin users with verified email, deduplicating recipients. Reject submissions without a valid delivery path, and keep the stored inquiry available to authorized company owners/admins. Notification is dispatched only after the inquiry/event transaction commits.

Enforce company/professional consistency with a unique key on `professionals(id, company_id)` and a composite foreign key from `inquiries(professional_id, company_id)`. Also add a check that a professional target implies a company target, and a check enforcing the platform/provider target split above. The transaction validates recipient membership; IDs supplied by a client never establish authorization. Professional-affiliation transfers are outside this schema's launch scope and must not be implemented by changing the company on an existing row with historical inquiries/events.

### 4.11 `claim_tokens`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK | |
| company_claim_id | bigint FK → company_claims | required; approved request that authorized this token |
| user_id | bigint FK → users | required intended claimant |
| email | varchar(255) | intended claimant |
| token_hash | varchar(64) | |
| expires_at | timestamptz | |
| used_at | timestamptz | nullable |
| revoked_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Index `company_id`, unique `token_hash`.

Store only the token hash; acceptance requires an unexpired, unused, unrevoked token, an approved matching claim request, and authentication as the active bound user with the same verified email. `company_id` and `user_id` must match the linked claim. Lock the non-deleted company, claim, and token and atomically create or promote an accepted owner membership, set `companies.claimed_at`, mark the request `fulfilled`, set `used_at`, and revoke competing unused tokens for that company. An already claimed company, existing accepted owner, wrong account, or invalid token must fail without partial changes. Reissuing a token revokes any prior unused tokens for that request.

### 4.12 `articles`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| author_id | bigint FK → users | |
| title | varchar(255) | |
| slug | varchar(220) | unique among non-deleted |
| excerpt | text | nullable |
| body | text | |
| status | varchar(32) | `draft`, `published` |
| seo_title | varchar(255) | nullable |
| seo_description | varchar(320) | nullable |
| published_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | soft delete |

Partial unique `slug` where `deleted_at IS NULL`. Can ship empty in Phase 1 and fill in Phase 2.

### 4.13 `profile_events`

Lightweight analytics covering profile views, search visibility, contact actions, and accepted inquiries (PDF p.37). No buyer identity is stored in event rows.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| event | varchar(32) | `view`, `search_impression`, `cta_click`, `website_click`, `inquiry` |
| event_key | uuid | required unique key; reuse the same key when retrying an event submission |
| company_id | bigint FK | required; derived from the professional when a person is the target |
| professional_id | bigint FK | nullable |
| inquiry_id | bigint FK → inquiries | required only for server-generated `inquiry` events |
| occurred_on | date | UTC date derived from server `created_at`; for daily rollups later |
| created_at | timestamptz | |

Indexes: unique `event_key`; unique `inquiry_id` where not null; `(company_id, event, created_at)`, `(professional_id, event, created_at)`. A check requires `inquiry_id IS NOT NULL` exactly when `event = inquiry`; all other event types require it to be null. Every profile event requires `company_id`; `professional_id` optionally narrows the target to a person. Add the same composite professional/company foreign key as inquiries. For inquiry events, server-side validation also requires the event target to match the linked inquiry.

The browser may send only `view`, `search_impression`, `cta_click`, and `website_click`. Emit a view once per displayed profile page, an impression once per result card that becomes visible within a result display, and a click once per user action. A new display/action receives a new UUID; retries reuse it and do not add rows. The server validates public targets and derives company from professional; arbitrary client company IDs are not trusted. These are event counts, not counts of unique people.

An accepted provider inquiry creates one `inquiry` event in the inquiry transaction, with a server-generated event key and the new `inquiry_id`. Platform contacts do not create profile inquiry events. Metrics exclude linked inquiries later marked spam or deleted. Contact/question/quote totals derive from `inquiries.type`, not separate browser events. For launch reporting, a lead conversion means an accepted non-spam provider inquiry; it does not assert a sale or closed deal. Conversion rate is eligible inquiries divided by profile views for the same target and UTC time window, returned as null when views are zero. It is an activity ratio, not unique-visitor attribution, and can exceed 1. Company-wide totals include events whose `company_id` matches, including its professionals; professional totals filter that person's `professional_id`. Company statistics also expose `company_profile_views` where `professional_id IS NULL` and `sales_profile_views` where it is not null, whose sum equals company-wide `profile_views`.

Phase 1 may write raw rows. Phase 2 can add a daily aggregate table if volume grows, preserving deduplication and spam-exclusion rules.

### 4.14 `password_reset_tokens` / `sessions`

Use Laravel defaults if the Nuxt app uses cookie sessions through Sanctum SPA mode.

### 4.15 `team_invitations`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | |
| professional_id | bigint FK → professionals | required approved, unclaimed roster row at this company |
| email | varchar(255) | intended invitee; normalized using the same rule as user email |
| invited_by_user_id | bigint FK → users | accepted company owner/admin or platform admin |
| token_hash | varchar(64) | unique; never store the raw token |
| expires_at | timestamptz | |
| accepted_at | timestamptz | nullable |
| revoked_at | timestamptz | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Index `company_id`, `professional_id`, and `email`; unique `token_hash`. Composite foreign key `(professional_id, company_id)` references `professionals(id, company_id)`. Reissuing an invitation revokes earlier unused invitations for that roster row.

Acceptance requires an authenticated active user with matching verified email and an unexpired, unrevoked, unused token. In one transaction, lock the invitation and roster row, confirm both the company and professional are non-deleted and the row still has approved affiliation and no linked user, then bind `professionals.user_id`, create an accepted `professional` membership (preserving any existing owner/admin role), and set `accepted_at`. Reject a roster row already owned by another user or a user already linked to another professional; the unique `professionals.user_id` constraint also guards concurrent acceptance. Invitation acceptance grants no company admin/owner rights and does not publish the profile.

### 4.16 `company_claims`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | existing non-deleted, unclaimed listing |
| user_id | bigint FK → users | authenticated claimant |
| status | varchar(32) | `pending`, `approved`, `rejected`, `fulfilled` |
| reviewed_by_user_id | bigint FK → users | nullable; platform admin |
| reviewed_at | timestamptz | nullable |
| review_note | text | nullable; internal admin evidence/decision, not public |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Index `(company_id, status)` and `user_id`. Partial unique `(company_id, user_id)` where `status = pending` prevents duplicate pending requests. Admin approval records the reviewer and creates a claim token bound to this request, company, user, and email. It does not create membership or publish/verify a company. Ownership is granted only by the atomic acceptance flow in §4.11; multiple applicants may request a company, but locking and the unclaimed-company check serialize ownership assignment.

---

## 5. Soft deletes

Soft-deleted:

- users, companies, professionals
- inquiries, articles, media
- taxonomies and locations
- company_certifications

Not soft-deleted:

- company_users and all taxonomy/location pivots: rows removed when an association ends
- claim_tokens, team_invitations, company_claims: keep lifecycle history; use expiry, revocation, or review state
- profile_events: append-only measurement rows
- plans: disable with `is_active`

Public companies/articles require `status = published AND deleted_at IS NULL`; professional queries additionally enforce approved affiliation and a published, non-deleted parent company. Public taxonomies/locations use `is_active = true AND deleted_at IS NULL`. Plans use `is_active = true` and the supported audience filter; they have no `status` or `deleted_at`. The fixed work-model enum has neither publication nor soft-delete state. Apply these same rules to search, detail pages, sitemap generation, and public contact validation.

Lifecycle side effects must be transactional and match `API.md`:

- Deleting a professional revokes unused invitations and removes its professional-only membership, preserving independent owner/admin roles. Restore as draft with pending affiliation, null verification/review fields, and no automatically recreated membership or invitation.
- Deleting a company hides its team, revokes unused invitations/claim tokens, and removes company memberships. Restore the company as draft with `claimed_at = NULL`; ownership must be reviewed again.
- Deleting a user invalidates sessions, removes memberships, and revokes that user's unused onboarding tokens. Linked roster profiles retain their historical user association and route new inquiries to the company fallback. Clear `claimed_at` when the last accepted company owner is removed. Restoring an account does not restore revoked relationships or tokens.
- Restore operations check the partial unique slug constraints before clearing `deleted_at`; a reused slug requires a new unique slug. Articles restore as draft.

---

## 6. Completeness (stored, recomputed on save)

**Company (example weights, adjust in app):** name, logo, overview, website, HQ location, ≥1 service, ≥1 industry, ≥1 location, ≥1 professional, why_choose_us.

**Professional:** photo, name, title, company, bio, ≥1 service, location, ≥1 contact path.

Threshold for the “Profile complete” badge: score ≥ 80. These weights and the threshold are initial product defaults, not numerical requirements from the PDF; maintain them in shared configuration. Completeness never substitutes for affiliation review, moderation, verification, or a functioning contact route.

`quality_score` is a separate 0–100 application-maintained score using a documented shared rubric for usable imagery, substantive profile copy, and valid contact information. Start with equal weights across those three checks, normalizing to 0–100; the rubric is an implementation default subject to editorial tuning. A score must not be inferred from premium payment.

---

## 7. Search notes (database side)

Phase 1 search can be SQL:

- Filter publicly eligible companies/professionals by pivot IDs and `locations`, using the rules in §5.
- `ILIKE` / `pg_trgm` on name, tagline, job title.
- Apply the priority order in PDF p.23: relevance match count, `completeness_score`, verification, requested location/service match, profile quality, then premium placement. Sort each score descending, with `id ASC` as the deterministic final tie-breaker. Verification is a boolean (`verified_at IS NOT NULL`); quality uses `quality_score`. The premium ranking signal is neutral in Phase 1. From Phase 2 it is eligible only when the active assigned company plan allows it, the entitlement has not expired, and `featured_until > now()`. Professionals use the parent company's plan until individual plans are designed in Phase 3. Editorial featured slots may exist in Phase 2 without a premium ranking boost.
- Location/service match counts requested matches; no requested filter gives a neutral score. No text query gives neutral relevance. These computed scores and completeness/quality defaults must be shared across company and professional search. Premium status must never override a higher-priority match, completeness, verification, or quality tier.

Full-text `tsvector` columns can be added later without changing entities.

---

## 8. Seed vs user-generated

| Data | Source |
| --- | --- |
| plans | seed three company plans |
| services, industries, capabilities, languages, technologies | seed + admin edit |
| locations | seed countries; add cities as needed |
| companies / professionals | users + optional admin import |
| articles | platform admins |
| inquiries / events | runtime |

---

## 9. Out of this schema (later)

- `subscriptions`, `payments`, `invoices`
- individual professional plan assignments and entitlements (Phase 3; company `plan_id` does not implement them)
- curated service + location / industry + service SEO content records (Phase 2 design)
- profile-report submission and moderation queue (Phase 2 design)
- `messages`, `threads`
- `reviews`, `favorites`, `saved_searches`
- `rfqs`, `rfq_recipients`
- buyer `users` with a buyer role
- multi-company professional memberships
