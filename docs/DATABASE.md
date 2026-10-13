# BPO Profile — Database

**Engine:** MySQL 8.0.16+ target; Homestead locally and MySQL in production. The API development example and automated tests also support SQLite, which does not verify MySQL-specific constraints.\
**App:** Laravel 13 (Eloquent)  
**Conventions:** `snake_case` tables and columns, `id` bigint primary keys and `created_at` / `updated_at` unless a table below explicitly defines a composite key or creation-only timestamps. `deleted_at` exists only where listed. Slugs on soft-deleted entities are unique among non-deleted rows, enforced by unique functional indexes on conditional expressions. Pivots and append-only events are explicit exceptions to the default key/timestamp convention; Laravel infrastructure tables retain their framework defaults.

This model covers the directory foundation and the verification/claim workflows required before public launch ([BPO Profile.pdf](BPO%20Profile.pdf), pp. 24-25), plus company plan/entitlement fields needed for later billing. The tables and workflow details are implementation decisions, not a schema prescribed by the PDF. Individual professional plan assignments and curated combination SEO pages require explicit later schema design; they are not implemented by the current company plan relationship.

**Implementation boundary:** Section 4 describes the directory schema. [Section 9](#9-extensibility-and-future-schema-roadmap) records proposed extensions following the 2026-10-02 code review; future billing tables, migrations, and endpoints remain unimplemented. Section 9.8 records the Phase 1 catalog/plan/storage safeguards applied in code. Email-provider switching needs no new tables. Accepting payments will require a billing schema before paid checkout launches.

**Phase 1 separation:** this schema belongs to the standalone API. The frontend keeps its own typed mock fixtures for investor review and does not read this database through live API calls. Fixture-only layout/copy revisions do not require migrations. Review actual business/contract changes separately, and defer frontend-to-API integration until explicitly requested.

---

### MySQL schema conventions

- Use InnoDB and `utf8mb4` in development, Homestead, and production. Keep the MySQL version, collations, SQL mode, and UTC connection time zone aligned. Use MySQL 8.0.16 or later for the enforced `CHECK` constraints required by this schema; see [MySQL CHECK constraints](https://dev.mysql.com/doc/refman/8.0/en/create-table-check-constraints.html).
- `bigint` primary and foreign keys use matching unsigned types through Laravel's `id()` / `foreignId()`. Store all timestamps in UTC using MySQL `timestamp` columns and UTC application/connection settings; these columns do not retain the original time-zone offset. Framework-owned tables keep their migration-defined types.
- Use native `json`, `varchar(45)` for IPv4/IPv6 addresses, and `char(36)` for UUID values (Laravel's `uuid()` mapping). Validate IP addresses and UUIDs in the application.
- Conditional uniqueness uses MySQL unique functional indexes: each indexed expression returns its column value when the condition holds and `NULL` otherwise. MySQL permits multiple null entries in unique indexes. For example, `CREATE UNIQUE INDEX companies_active_slug_unique ON companies ((CASE WHEN deleted_at IS NULL THEN slug ELSE NULL END));` protects active slugs while allowing reuse after deletion. For conditional composite keys, wrap each key column in that same condition. See [MySQL functional indexes](https://dev.mysql.com/doc/refman/8.0/en/create-index.html#create-index-functional-key-parts).
- An ordinary unique index on a nullable column, such as `professionals.user_id` or `profile_events.inquiry_id`, already allows multiple null values. Do not use a unique `(slug, deleted_at)` index to enforce active-slug uniqueness: null `deleted_at` values would allow duplicate active slugs. Application prechecks complement the database constraints; they do not replace them.

## 1. Entity map

```
users
  ├── social_accounts (Google identity bindings)
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
login_challenges ← users / social_accounts (pending password-or-Google + email-code login)
sessions ← users (live Laravel browser sessions)
oauth_* (Passport infrastructure; external OAuth disabled in Phase 1)
```

---

## 2. Relationships

| From | To | Type | Rule |
| --- | --- | --- | --- |
| User | Social account | one-to-many | At most one identity per provider per user; a provider subject belongs to exactly one user |
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

Every protected browser API request requires Passport cookie authentication and a live Laravel server session for the same non-deleted, email-verified user with the current `auth_version`; Passport cookie validation alone grants no access. Company permissions additionally require a non-deleted company and an accepted membership with the required role. Own-professional access requires a matching `user_id` and non-deleted profile/company. Editing an approved affiliation requires accepted membership in that company. Own-professional inbox and statistics access require both approved affiliation and accepted membership. Without membership, the linked user may edit only a private profile with `status = draft` and `affiliation_status IN (pending, rejected)`; this exception grants no publication, inbox, or statistics access. Independent accepted owner/admin permissions remain valid through company-scoped routes. Restoring a user or company does not turn a retained `professionals.user_id` link into permission to edit an approved or published profile.

Own-profile writes cannot change `company_id`, affiliation review fields, verification, or premium placement. Only platform admins set `published` or `suspended`; a professional with approved affiliation, verified email, and accepted membership may submit `pending_review` or return to `draft`, without overriding an admin suspension.

Buyers have no rows in `users` at launch.

---

## 4. Tables

### 4.1 `users`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| platform_role | varchar(32) | `user`, `admin` |
| first_name | varchar(100) | nullable only while an account-only Google user awaits name completion |
| last_name | varchar(100) | nullable only while an account-only Google user awaits name completion |
| email | varchar(255) | unique; normalize consistently across registration, Google onboarding, and invitations |
| email_verified_at | timestamp | nullable |
| password | varchar(255) | nullable for Google-only accounts; otherwise Laravel-supported password hash, never plaintext |
| auth_version | bigint | default 0; monotonically incremented for session/challenge revocation |
| remember_token | varchar(100) | nullable; persistent remember-me disabled in Phase 1 |
| last_login_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

Indexes: unique `email`, index `platform_role`.

The standalone Phase 1 API uses Passport's encrypted JWT `laravel_token` cookie together with a live Laravel database session; both authentication cookies are `HttpOnly`. A password or a linked Google identity starts the same pending email-code challenge. The existing implementation requires the code on every fresh login for all account types; this frequency is an application decision, not a PDF requirement. The frontend currently simulates these states without connecting. Registration leaves `email_verified_at = NULL`; first successful code verification sets it, including for a Google-provided verified email. Google sign-in never assigns platform-admin privileges. Public payloads never expose password hashes, `auth_version`, or challenge secrets.

Password registration still requires first name, last name, and password. A newly created Google account may have missing names and no password, but cannot create a company or professional through onboarding until both names are supplied. A Google-only user may set a local password through the existing password-reset flow; this revokes prior authentication and requires a fresh completed login. The unique email constraint includes soft-deleted users, so Google sign-in cannot recreate or automatically merge an existing account by email.

### 4.2 `plans`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| slug | varchar(50) | unique stable code; initial seeds: `basic`, `professional`, `premium`; not a three-value database enum |
| name | varchar(100) | |
| audience | varchar(32) | `company`; `professional` reserved for a later assignment design |
| max_professional_seats | int | null = unlimited |
| max_images | int | |
| featured_eligible | boolean | default false |
| analytics_level | varchar(32) | `none`, `basic`, `advanced` |
| sort_order | int | |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

No payments table in Phase 1. Admin sets `companies.plan_id` and `companies.plan_expires_at`, validating that the plan is active and has `audience = company`. All three initial plan tiers belong to companies; the `professional` plan slug is a company tier name, not an individual subscription. Individual professional subscriptions and their entitlements are deferred to Phase 3 and require a separate assignment model.

Additional company tiers are rows in this table; their number is not fixed. The admin API resolves supplied slugs or IDs to active company plans and rejects conflicting slug/ID pairs. The independent frontend accepts arbitrary mock plan codes, derives labels/options from its local catalog, and displays fallback content when editorial details are missing. Preview six tiers at `/pricing?state=expanded`. Company creation uses the active company plan with slug `basic`; Eloquent model saves/deletes protect its code, audience, and active state while allowing a display-name change. Bulk queries and direct SQL bypass those model safeguards and must preserve the default explicitly. See [implementation status](#98-current-implementation-follow-ups). The existing entitlement columns cover known features, while new feature behavior requires application support. Future prices, subscriptions, and assignments belong in [separate billing records](#94-prices-billing-history-and-entitlements).

### 4.3 `companies`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| plan_id | bigint FK → plans | default Basic |
| plan_expires_at | timestamp | nullable; null = no expiry |
| name | varchar(200) | |
| slug | varchar(220) | unique among non-deleted |
| tagline | varchar(255) | nullable |
| overview | text | nullable |
| why_choose_us | text | nullable |
| website_url | varchar(500) | nullable |
| linkedin_url | varchar(500) | nullable |
| other_social_json | json | nullable |
| founded_year | int | nullable |
| company_size | varchar(32) | see enum below; default `unknown` |
| work_model | varchar(32) | `onshore`, `offshore`, `nearshore`, `hybrid`, `unknown`; default `unknown` |
| hq_location_id | bigint FK → locations | nullable |
| year_established_note | varchar(255) | nullable extra display text |
| status | varchar(32) | `draft`, `pending_review`, `published`, `suspended`; default `draft` |
| claimed_at | timestamp | nullable |
| verified_at | timestamp | nullable |
| featured_until | timestamp | nullable |
| completeness_score | int | 0–100, default 0; maintained by app |
| quality_score | int | 0–100, default 0; maintained by app using the shared quality rubric |
| inquiry_email | varchar(255) | nullable while draft; validated fallback inbox required before publication |
| phone | varchar(50) | nullable |
| seo_title | varchar(255) | nullable |
| seo_description | varchar(320) | nullable |
| published_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

Company-provided client proof/testimonials from the brief (PDF p. 16) can be stored as attributed text within `overview` at launch. This does not add a buyer-review table or imply platform verification of those statements.

**company_size:** `1_10`, `11_50`, `51_200`, `201_500`, `501_1000`, `1000_plus`, `unknown`

Indexes:

- unique functional index on `CASE WHEN deleted_at IS NULL THEN slug ELSE NULL END` (required database constraint; application checks alone are insufficient)
- `status`, `plan_id`, `hq_location_id`
- `completeness_score`, `verified_at`, `featured_until`
- Search indexes must match the chosen MySQL query strategy; use B-tree indexes for filters and eligible prefix searches, with optional `FULLTEXT` indexes for later full-text search

### 4.4 `company_users`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | |
| user_id | bigint FK → users | |
| role | varchar(32) | `owner`, `admin`, `professional` |
| invited_at | timestamp | nullable |
| accepted_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

Unique `(company_id, user_id)`. Index `user_id`.

Rows created by affiliation approval, invitation acceptance, company registration, or claim acceptance set `accepted_at` in the same transaction. Invitations live in `team_invitations`; they do not confer membership before acceptance. Company registration creates the initial accepted owner and sets `companies.claimed_at`. Claim acceptance takes the shared locks below and refuses any company with `claimed_at` already set or an existing accepted owner.

Access-changing transactions use one lock order: required existing actor/recipient `users`, `social_accounts`, `login_challenges`, `companies`, `professionals`, `company_users`, `company_claims`, `claim_tokens`, then `team_invitations`; sort multiple rows within each table by ID and skip unrelated tables. This covers login verification and revocation, Google linking, account onboarding, claims, invitation creation/reissue/revocation/acceptance, affiliation decisions, membership changes, and related deletion/restoration. Preliminary lookups discover IDs only. Under the locks, recheck non-deleted users, the actor's current session `auth_version`, verified email where required, current permissions, provider binding/challenge state, parent/profile eligibility, and token state before changing access. The parent company lock also serializes creation when a membership row does not yet exist. The user lock serializes one-time onboarding and Google binding creation; provider-subject uniqueness also resolves races involving different users.

User deletion locks the actor/target users before discovering and locking all companies affected by the target's memberships, profiles, claims, or onboarding tokens. Grants must lock the recipient user first, preventing new grants during cleanup; company deletion serializes grants on its company lock. Never acquire an earlier lock class after a later one; restart if an earlier lock is newly needed. Perform lifecycle cleanup and the state change in the same transaction.

### 4.5 `professionals`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | required |
| user_id | bigint FK → users | nullable until claimed |
| affiliation_status | varchar(32) | `pending`, `approved`, `rejected`; default `pending` |
| affiliation_reviewed_by | bigint FK → users | nullable; approving/rejecting company owner/admin or platform admin |
| affiliation_reviewed_at | timestamp | nullable |
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
| verified_at | timestamp | nullable |
| featured_until | timestamp | nullable |
| completeness_score | int | 0–100 |
| quality_score | int | 0–100, default 0; maintained by app using the shared quality rubric |
| seo_title | varchar(255) | nullable |
| seo_description | varchar(320) | nullable |
| published_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

Ordinary unique index on nullable `user_id`. Unique functional index on `CASE WHEN deleted_at IS NULL THEN slug ELSE NULL END`. Indexes: `company_id`, `status`, `affiliation_status`, `location_id`, `completeness_score`. Both score columns have checks restricting them to 0–100, as do the company score columns.

Professional registration requires an existing, non-deleted `company_id` and creates a linked draft with pending affiliation and both scores initialized to zero. It does not create a `company_users` row. An email-verified accepted company owner/admin or platform admin reviews the affiliation; approval of a self-registered applicant requires their verified email, sets the review fields, and creates an accepted `professional` membership atomically, preserving any existing owner/admin role. Rejection leaves the draft private and grants no company access. An owner/admin-created unclaimed roster row has approved affiliation, records that actor as reviewer, and keeps `user_id = NULL` until invitation acceptance.

Affiliation approval and publication are separate decisions: the platform admin controls publication. A public professional must be non-deleted, `status = published`, `affiliation_status = approved`, and belong to a non-deleted published company. Their contact form routes to the linked verified-email user with accepted company membership, falling back to `companies.inquiry_email` for an unclaimed or unavailable representative. Publication requires this company fallback to be configured and valid; a public email field alone is not a reliable routing target.

### 4.6 Locations

`locations` is a hierarchy: country → region → city, with a city also allowed directly under a country (PDF p. 20). Countries have no parent, regions belong to countries, and cities belong to regions or countries. Validate parent types and reject cycles.

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
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

Indexes: unique functional composite index on `parent_id` and `slug`, each conditional on `deleted_at IS NULL AND parent_id IS NOT NULL`; a separate unique functional index on `slug` conditional on `deleted_at IS NULL AND parent_id IS NULL`; ordinary indexes on `type`, `iso_code`. Each conditional expression returns `NULL` outside its condition, as described above. The separate root index prevents duplicate country slugs despite a null parent.

`company_locations`

| Column | Type | Notes |
| --- | --- | --- |
| company_id | bigint FK | |
| location_id | bigint FK | country, region, or city |
| is_headquarters | boolean | default false |
| created_at | timestamp | |

PK or unique `(company_id, location_id)`. Add a unique functional index on `CASE WHEN is_headquarters = 1 THEN company_id ELSE NULL END`, allowing at most one HQ pivot per company.

`companies.hq_location_id` must match the sole HQ pivot, or be null with no HQ flags. The locations write transaction locks the company, validates active/non-deleted locations, requires HQ to be one of the selected operating locations, replaces pivots, and synchronizes both representations. Removing HQ requires choosing a new HQ or explicitly clearing it; dashboard and admin writes share this rule.

`professional_markets` — markets the person sells into, not where they sit.

| Column | Type | Notes |
| --- | --- | --- |
| professional_id | bigint FK | |
| location_id | bigint FK | usually country |
| created_at | timestamp | |

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
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

Each taxonomy has a unique functional index on `CASE WHEN deleted_at IS NULL THEN slug ELSE NULL END`. Public catalog reads require `is_active = true AND deleted_at IS NULL`.

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
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

### 4.9 `media`

Single table for logos, covers, photos, article images.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| owner_type | varchar(50) | `company`, `professional`, `article` |
| owner_id | bigint | |
| kind | varchar(32) | `logo`, `cover`, `photo`, `image` |
| disk | varchar(32) | `public` (local public media) / `s3` |
| path | varchar(500) | |
| filename | varchar(255) | |
| mime_type | varchar(100) | |
| size_bytes | int | |
| alt_text | varchar(255) | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

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
| meta_json | json | optional service interest, budget, timeline |
| status | varchar(32) | `new`, `read`, `replied`, `archived`, `spam` |
| source_path | varchar(255) | page that submitted |
| ip_address | varchar(45) | nullable; validated IPv4 or IPv6 address |
| user_agent | varchar(255) | nullable |
| read_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

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
| expires_at | timestamp | |
| used_at | timestamp | nullable |
| revoked_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

Index `company_id`, unique `token_hash`.

Generate at least 32 cryptographically random bytes before URL-safe encoding and store only the SHA-256 token hash; acceptance requires an unexpired, unused, unrevoked token, an approved matching claim request, and authentication as the active bound user with the same verified email. `company_id` and `user_id` must match the linked claim. Take the applicable user, company, membership, claim, and token locks under §4.4 and atomically create or promote an accepted owner membership, set `companies.claimed_at`, mark the request `fulfilled`, set `used_at`, reject competing pending/approved claims with a lifecycle note, and revoke their unused tokens for that company. An already claimed company, existing accepted owner, wrong account, or invalid token must fail without partial changes. Reissuing a token revokes any prior unused tokens for that request.

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
| published_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | soft delete |

Unique functional index on `CASE WHEN deleted_at IS NULL THEN slug ELSE NULL END`. Can ship empty in Phase 1 and fill in Phase 2.

### 4.13 `profile_events`

Lightweight analytics covering profile views, search visibility, contact actions, and accepted inquiries (PDF p.37). No buyer identity is stored in event rows.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| event | varchar(32) | `view`, `search_impression`, `cta_click`, `website_click`, `inquiry` |
| event_key | char(36) | required unique key; reuse the same key when retrying an event submission |
| company_id | bigint FK | required; derived from the professional when a person is the target |
| professional_id | bigint FK | nullable |
| inquiry_id | bigint FK → inquiries | required only for server-generated `inquiry` events |
| occurred_on | date | UTC date derived from server `created_at`; for daily rollups later |
| created_at | timestamp | |

Indexes: unique `event_key`; ordinary unique index on nullable `inquiry_id`; `(company_id, event, created_at)`, `(professional_id, event, created_at)`. A check requires `inquiry_id IS NOT NULL` exactly when `event = inquiry`; all other event types require it to be null. Every profile event requires `company_id`; `professional_id` optionally narrows the target to a person. Add the same composite professional/company foreign key as inquiries. For inquiry events, server-side validation also requires the event target to match the linked inquiry.

The browser may send only `view`, `search_impression`, `cta_click`, and `website_click`. Emit a view once per displayed profile page, an impression once per result card that becomes visible within a result display, and a click once per user action. A new display/action receives a new UUID; retries reuse it and do not add rows. The server validates public targets and derives company from professional; arbitrary client company IDs are not trusted. These are event counts, not counts of unique people.

An accepted provider inquiry creates one `inquiry` event in the inquiry transaction, with a server-generated event key and the new `inquiry_id`. Platform contacts do not create profile inquiry events. Metrics exclude linked inquiries later marked spam or deleted. Contact/question/quote totals derive from `inquiries.type`, not separate browser events. For launch reporting, a lead conversion means an accepted non-spam provider inquiry; it does not assert a sale or closed deal. Conversion rate is eligible inquiries divided by profile views for the same target and UTC time window, returned as null when views are zero. It is an activity ratio, not unique-visitor attribution, and can exceed 1. Company-wide totals include events whose `company_id` matches, including its professionals; professional totals filter that person's `professional_id`. Company statistics also expose `company_profile_views` where `professional_id IS NULL` and `sales_profile_views` where it is not null, whose sum equals company-wide `profile_views`.

Phase 1 may write raw rows. Phase 2 can add a daily aggregate table if volume grows, preserving deduplication and spam-exclusion rules.

### 4.14 `password_reset_tokens` / `sessions`

Use Laravel's standard password-reset token table and database-backed session table. The Laravel session cookie carries an opaque session identifier; Passport's separate encrypted JWT `laravel_token` cookie supplies first-party API authentication. Both are `HttpOnly`, `Secure` in production, `SameSite=Lax`, and host-only with `Path=/` in the default same-origin deployment. The separate JavaScript-readable `XSRF-TOKEN` cookie supplies the required CSRF header, including on protected API `GET` requests. Cookies and credentials never appear in JSON responses or browser localStorage/sessionStorage.

Store the authenticated user's validated `auth_version` and completed-login timestamp in the server session payload. Enforce expiry and require Passport's authenticated user to match a live web session and the current user/version on every protected browser API request. The Passport cookie represents a transient first-party token; it has no corresponding `oauth_access_tokens` row. Revoking OAuth access-token rows alone therefore cannot invalidate a browser cookie. Browser routes reject bearer credentials. `GET /auth/session` issues the Passport cookie only after the email-code flow has created a valid authenticated web session, as detailed in [ARCHITECTURE.md](ARCHITECTURE.md#5-auth-flow).

Password reset/change, email change, account deletion/restoration, platform-role changes, and Google linking or other login-method changes increment the user's version, invalidate pending challenges, and remove existing sessions in the same lifecycle transaction. Once external OAuth is enabled, also revoke that user's external access/refresh credentials. Version checks prevent a racing request from reviving access by persisting an old session afterward. Logout destroys only the current session and expires both authentication cookies; a copied Passport cookie must fail without its live matching session. Password reset does not sign the user in; a Google-only user may establish a password through that flow and must then complete a fresh login.

### 4.15 `team_invitations`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | |
| professional_id | bigint FK → professionals | required approved, unclaimed roster row at this company |
| email | varchar(255) | intended invitee; normalized using the same rule as user email |
| invited_by_user_id | bigint FK → users | accepted company owner/admin or platform admin |
| token_hash | varchar(64) | unique; never store the raw token |
| expires_at | timestamp | |
| accepted_at | timestamp | nullable |
| revoked_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

Index `company_id`, `professional_id`, and `email`; unique `token_hash`. Composite foreign key `(professional_id, company_id)` references `professionals(id, company_id)`. Generate tokens from at least 32 cryptographically random bytes and store only SHA-256 hashes. Reissuing an invitation revokes earlier unused invitations for that roster row.

Acceptance requires an authenticated active user with matching verified email and an unexpired, unrevoked, unused token. In one transaction, take the applicable user, company, roster, membership, and invitation locks under §4.4, confirm both the company and professional are non-deleted and the row still has approved affiliation and no linked user, then bind `professionals.user_id`, create an accepted `professional` membership (preserving any existing owner/admin role), and set `accepted_at`. Reject a roster row already owned by another user or a user already linked to another professional; the unique `professionals.user_id` constraint also guards concurrent acceptance. Invitation acceptance grants no company admin/owner rights and does not publish the profile.

### 4.16 `company_claims`

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| company_id | bigint FK → companies | existing non-deleted, unclaimed listing |
| user_id | bigint FK → users | authenticated claimant |
| status | varchar(32) | `pending`, `approved`, `rejected`, `fulfilled` |
| reviewed_by_user_id | bigint FK → users | nullable; platform admin |
| reviewed_at | timestamp | nullable |
| review_note | text | nullable; internal admin evidence/decision, not public |
| created_at | timestamp | |
| updated_at | timestamp | |

Index `(company_id, status)` and `user_id`. A unique functional composite index on `company_id` and `user_id`, each expressed as `CASE WHEN status = 'pending' THEN <column> ELSE NULL END`, prevents duplicate pending requests. Admin approval records the reviewer and creates a claim token bound to this request, company, user, and email. It does not create membership or publish/verify a company. Ownership is granted only by the atomic acceptance flow in §4.11; multiple applicants may request a company, but locking and the unclaimed-company check serialize ownership assignment.

Claim creation, review, token reissue, acceptance, and lifecycle cleanup take the applicable user/company and child-row locks under §4.4. Approval/reissue require an active verified-email claimant and a non-deleted, still-unclaimed company without an accepted owner; token issuance requires an approved, unfulfilled request. Company deletion rejects its pending/approved claims; claimant deletion rejects that user's pending/approved claims; acceptance rejects all competing pending/approved claims. Append a lifecycle reason to `review_note`, preserve prior `reviewed_by_user_id` / `reviewed_at` and evidence, update `updated_at`, and revoke the corresponding unused tokens in the same transaction. Automatic rejection is not a new admin review. Fulfilled/rejected history remains unchanged. Restoration or later loss of the final owner requires a new request and review.

### 4.17 `login_challenges`

Short-lived state for a password- or Google-validated, still-unauthenticated login. Google proof replaces only the password step; both methods use the same email-code policy. This also provides initial mailbox verification; it is separate from company claims, invitations, and public verification badges.

| Column | Type | Notes |
| --- | --- | --- |
| id | char(36) PK | random UUID challenge identifier; not an authentication credential |
| user_id | bigint FK → users | intended active user |
| method | varchar(16) | `password` or `google` |
| social_account_id | bigint FK → social_accounts | nullable for password; required for Google and must belong to `user_id` |
| email | varchar(255) | current normalized local email snapshot; code delivery target |
| auth_version | bigint | user version validated when the initial password or Google credential was checked |
| session_binding_hash | char(64) | SHA-256 of a random nonce held only in the anonymous server session |
| code_mac | char(64) | nullable HMAC-SHA-256 over challenge ID and code; key stored outside the database |
| failed_attempts | smallint | default 0; maximum 5 across all resends |
| last_sent_at | timestamp | latest code dispatch; enforce at least 60 seconds before resend |
| expires_at | timestamp | ten minutes after creation; resend never extends it |
| consumed_at | timestamp | nullable; successful use |
| revoked_at | timestamp | nullable; replaced, exhausted, or invalidated |
| created_at | timestamp | |
| updated_at | timestamp | |

Index `user_id`, `social_account_id`, `session_binding_hash`, and `expires_at`. A check requires `social_account_id IS NULL` for `method = password` and non-null for `method = google`, rejecting all other methods. A composite foreign key `(social_account_id, user_id)` references `social_accounts(id, user_id)`; Google challenges must also reference provider `google`, rechecked under lock. Store no raw code or raw binding nonce here. Use cryptographically random six-digit strings, constant-time MAC comparison, and a separate securely configured MAC key. Clear `code_mac` when consumed, revoked, or expired; regularly purge expired challenge rows. Shared atomic account/IP rate limits cap initial sends plus resends at three per account per 15 minutes and constrain new password/challenge attempts as well. The limit survives replacement challenges and switching between password and Google sign-in.

Creation, resend, and verification lock the user, the linked social account when applicable, then the challenge rows under the shared order in §4.4; replacement revokes the previous challenge for that browser. Before verification or resend, recheck active user, the unchanged Google binding when applicable, matching local email/version/session binding, expiry, attempt budget, and unused/unrevoked state. Always mail the code to the user's current local email; provider email changes never replace that address. Resend replaces the MAC but retains the deadline and failed-attempt count. Count wrong codes atomically and revoke at the fifth failure. Only one concurrent successful verification may consume a challenge; mark `email_verified_at` if null in that transaction. Never sign in at the password-only step or Google callback. The authenticated session receives exactly the validated challenge version, then its ID and CSRF token are regenerated. The browser refreshes CSRF and calls `GET /auth/session` to obtain the Passport cookie before accessing protected API routes.

Apply all account-wide revocation events in §4.14, including Google linking/login-method changes; clear `email_verified_at` on local email change. A mail failure cannot complete login. The current API sends codes immediately after the challenge transaction commits; they do not enter the background queue. If code delivery is queued later, encrypt transient payloads and recheck the current code/version, account, and expiry before every send. Production code emails must not use the log mailer.

### 4.18 `social_accounts`

Google sign-in uses Laravel Socialite with session-bound state verification. The callback resolves Google's stable subject ID; an email address is never the identity key.

| Column | Type | Notes |
| --- | --- | --- |
| id | bigint PK | |
| user_id | bigint FK → users | bound local account |
| provider | varchar(32) | `google` at launch |
| provider_subject | varchar(255) | stable Google subject; case-sensitive `utf8mb4_bin` collation, never lowercase |
| provider_email | varchar(255) | nullable informational provider value; never overwrites `users.email` |
| created_at | timestamp | |
| updated_at | timestamp | |

Unique `(provider, provider_subject)` and `(user_id, provider)` prevent a subject belonging to multiple users and multiple Google identities on one user. Unique `(id, user_id)` supports the challenge ownership foreign key in §4.17. Store no Google access or refresh tokens. Retain the identity binding through local account soft deletion; a deleted user cannot sign in, create a replacement account, or move their binding to another user. Restoration requires a fresh completed login.

An unbound Google subject with a provider-verified email unused by any local user creates only an ordinary `users` row (`platform_role = user`, `password = NULL`, `email_verified_at = NULL`) and its binding in one transaction. Preserve provider-supplied names when available; missing names remain null until collected. Create no company, professional, or membership implicitly. Then start the usual email-code challenge; Google verification does not skip local mailbox verification. Existing bindings resolve by subject even if the provider email has changed, and codes still go only to current `users.email`.

An unbound subject whose email matches any existing account must not create or merge an account. The user first signs in through an existing method and explicitly starts `POST /api/account/google/link`. Linking requires a completed login within the last ten minutes, verified local email, and a provider-verified Google email matching that local address. Bind OAuth state/proof to the current account and linking purpose; recheck the recent completed login, current version, active account, and verified-email match under the user/social-account locks when the callback completes. A subject already bound to another user, or a different Google subject already bound to this user, is a conflict. Successful linking increments `auth_version`, invalidates sessions/challenges, and requires a fresh login; it never changes the user's role or company relationships.

After completing login, an account without any accepted company membership or existing professional may call `POST /api/onboarding/company` or `POST /api/onboarding/professional` for the authenticated user only. Both require `first_name` and `last_name`; company onboarding also requires `company_name`, while professional onboarding requires `company_id` and `job_title`. Under the shared locks, recheck the current user/version and absence of an accepted membership or any professional row, including a retained soft-deleted one, to serialize one-time onboarding. Persist the names and apply the existing registration rules in the same transaction: company onboarding creates a draft company and accepted owner membership with `claimed_at`; professional onboarding creates a draft with pending affiliation and no membership. A user may instead complete a valid claim or invitation without creating duplicate profile records.

### 4.19 Passport infrastructure

Install Passport's standard migrations for the selected supported release, including `oauth_clients`, `oauth_auth_codes`, `oauth_access_tokens`, and `oauth_refresh_tokens`, plus any additional tables required by that release. Retain the framework's identifier types, columns, indexes, and lifecycle defaults rather than replacing them with the directory's bigint conventions. Provision Passport signing keys now and keep private keys outside the database/source control, separately from the Laravel app key.

These tables prepare for future delegated OAuth integrations; the first-party browser cookie in §4.14 does not create access/refresh-token rows. External client registration, bearer API routes, and external OAuth authorization/token issuance remain disabled in Phase 1. Before enabling an integration, complete its authorization-code-with-PKCE flow, explicit consent and least-privilege scopes, exact redirect allowlist, separate route authorization, refresh-token rotation, and access/refresh revocation, including the account lifecycle rules above. Password and implicit grants remain disabled.

---

### 4.20 Queue and cache infrastructure

The migration review on 2026-10-02 found the existing infrastructure sufficient for background email and provider switching. This reviews the migration files; it does not assert that a deployed database has applied them.

| Tables | Responsibility | Provider changes |
| --- | --- | --- |
| `jobs` | Pending work, queue name, encrypted mail job payload, attempts, reservation and availability timestamps | Reused; no Gmail/BigMailer columns |
| `failed_jobs` | Exhausted jobs, encrypted mail payload, exception, and failure timestamp | Reused for investigation and selected retries; daily seven-day retention |
| `job_batches` | Laravel batch bookkeeping, already provisioned | Ordinary email delivery does not need batches |
| `cache`, `cache_locks` | Shared cache, rate limits, and worker restart signals | Independent of the email provider |
| `inquiries` | Authoritative inbound messages and business inbox status | `new/read/replied/archived/spam` are not email-delivery states |
| `claim_tokens`, `team_invitations` | Intended recipient, token hash, expiry, and used/revoked state | Remain the authority; queued messages recheck token validity before sending |
| `users`, `login_challenges`, `password_reset_tokens`, `sessions`, `oauth_*` | Account identity, sign-in and authorization infrastructure | Email transport changes do not change identity or grant permissions |
| `social_accounts` | External sign-in identity bindings | Its `provider` is an identity provider, not an email sending provider |
| Companies, professionals, memberships, taxonomies, plans, media, articles, and profile events | Directory content, access, and reporting | No transport-specific schema is needed |

Provider selection, SMTP/API secrets, sender settings, and queue selection live in the server environment and Laravel configuration. Keep these out of user/company rows, generic public settings, and API responses. Queue mail after the domain transaction commits; rollbacks discard those dispatches. The present enqueue step is not an atomic transactional outbox, so a crash between domain commit and dispatch can leave a saved record without a notification. Delivery retries may duplicate a message after an ambiguous provider timeout.

`jobs` is transient and `failed_jobs` is operational history, not a delivered/read/bounced email ledger. Add separate delivery/event tables only when implementing those features. Provider acceptance and actual inbox delivery are different outcomes. Retain database-backed inquiry history even if notification delivery fails.

The current queue-index and foreign-key structure is adequate for the initial single-worker setup. Use observed query plans and queue backlog before adding indexes or moving queues/cache to Redis. Verify MySQL-specific functional indexes and enforced checks on an isolated MySQL 8.0.16+ test database before launch; SQLite tests cannot exercise them.

## 5. Soft deletes

Soft-deleted:

- users, companies, professionals
- inquiries, articles, media
- taxonomies and locations
- company_certifications

Not soft-deleted:

- company_users and all taxonomy/location pivots: rows removed when an association ends
- claim_tokens, team_invitations, company_claims: keep lifecycle history; use expiry, revocation, or review state
- login_challenges: short-lived state; consume/revoke and purge expired rows under §4.17
- social_accounts: retain provider bindings through user soft deletion; reject login while the user is deleted
- sessions, password_reset_tokens, and Passport infrastructure: use framework expiry/revocation/cleanup with the account lifecycle rules above
- profile_events: append-only measurement rows
- plans: disable with `is_active`

Public companies/articles require `status = published AND deleted_at IS NULL`; professional queries additionally enforce approved affiliation and a published, non-deleted parent company. Public taxonomies/locations use `is_active = true AND deleted_at IS NULL`. Plans use `is_active = true` and the supported audience filter; they have no `status` or `deleted_at`. The fixed work-model enum has neither publication nor soft-delete state. Apply these same rules to search, detail pages, sitemap generation, and public contact validation.

Lifecycle side effects must be transactional, use the shared locking rules in §4.4, and match `API.md`:

- Deleting a professional revokes unused invitations and removes its professional-only membership, preserving independent owner/admin roles. Restore as draft with pending affiliation, null verification/review fields, and no automatically recreated membership or invitation.
- Deleting a company hides its team, rejects pending/approved claims under §4.16, revokes unused invitations/claim tokens, and removes company memberships. Restore the company as draft with `claimed_at = NULL`; ownership requires a new request and review.
- Deleting a user increments `auth_version`, invalidates sessions and pending login challenges, removes memberships, rejects that user's pending/approved claims under §4.16, and revokes their unused onboarding tokens; also revoke external OAuth access/refresh credentials once those integrations exist. Retain Google identity bindings and reject their login while the user is deleted. Linked roster profiles retain their historical user association and route new inquiries to the company fallback. Clear `claimed_at` when the last accepted company owner is removed. Restoring an account increments `auth_version` again and requires fresh password-or-Google plus email-code login; it does not restore revoked relationships, sessions, or tokens. A retained approved/published professional requires accepted membership before the restored user can edit it.
- Restore operations check the conditional unique slug constraints before clearing `deleted_at`; a reused slug requires a new unique slug. Articles restore as draft.

---

## 6. Completeness (stored, recomputed on save)

**Company (example weights, adjust in app):** name, logo, overview, website, HQ location, ≥1 service, ≥1 industry, ≥1 location, ≥1 professional, why_choose_us.

**Professional:** photo, name, title, company, bio, ≥1 service, location, ≥1 contact path.

Threshold for the “Profile complete” badge: score ≥ 80. These weights and the threshold are initial product defaults, not numerical requirements from the PDF; maintain them in shared configuration. Completeness never substitutes for affiliation review, moderation, verification, or a functioning contact route.

`quality_score` is a separate 0–100 application-maintained score using a documented shared rubric for usable imagery, substantive profile copy, and valid contact information. Start with equal weights across those three checks, normalizing to 0–100; the rubric is an implementation default subject to editorial tuning. A score must not be inferred from premium payment.

---

## 7. Search notes (database side)

Phase 1 search can be SQL:

- Filter publicly eligible companies/professionals by pivot IDs and `locations`, using the rules in §5. A geographic filter selects an active, non-deleted location and its active, non-deleted descendants: match company operating locations through `company_locations`, or a professional's primary `location_id`. Served markets remain distinct from physical location. Resolve `country` to its country root; combined country/location selections must agree and are intersected, with invalid or conflicting input rejected as `422` in the API.
- Use parameterized `LIKE` queries on name, tagline, and job title with a case-insensitive `utf8mb4` collation. Escape literal `%` and `_` in user search input. Leading-wildcard substring searches can scan rows; measure query plans and latency as the directory grows.
- Apply the priority order in PDF p.23: relevance match count, `completeness_score`, verification, requested location/service match, profile quality, then premium placement. Sort each score descending, with `id ASC` as the deterministic final tie-breaker. Verification is a boolean (`verified_at IS NOT NULL`); quality uses `quality_score`. The premium ranking signal is neutral in Phase 1. From Phase 2 it is eligible only when the active assigned company plan allows it, the entitlement has not expired, and `featured_until > now()`. Professionals use the parent company's plan until individual plans are designed in Phase 3. Editorial featured slots may exist in Phase 2 without a premium ranking boost.
- Location/service match counts requested matches; no requested filter gives a neutral score. No text query gives neutral relevance. These computed scores and completeness/quality defaults must be shared across company and professional search. Premium status must never override a higher-priority match, completeness, verification, or quality tier.

MySQL `FULLTEXT` indexes with `MATCH (...) AGAINST (...)` can be added later on supported text columns. Define and test token length, stopwords, and ranking behavior before switching from `LIKE`; preserve the product's relevance and ranking contract.

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

## 9. Extensibility and future schema roadmap

### 9.1 What should be configurable

Review scope: the local API migrations, catalog seeder, search/validation rules, mail/storage behavior, Nuxt catalog types/store/pricing presentation, and the Musticker reference code on 2026-10-02. This is a source-code review, not inspection of either production database. No database migration is part of this documentation update.

Use rows for business catalogs that grow, configuration for deployed integrations, and explicit application rules for permissions and state transitions. Adding a sixth payment method should insert a row; it should not create a sixth table, column, or database enum value. Adding a new payment gateway still requires a supported adapter, credentials, and integration tests.

| Area | Current implementation | Recommended change and trigger |
| --- | --- | --- |
| Services, industries, capabilities, languages, technologies | Separate catalog tables with hierarchy, active state, ordering, and association pivots | Already extensible by adding rows. Keep the five taxonomy families explicit; a new family needs its own API/search semantics. Do not merge everything into an untyped settings table. |
| Countries, regions, cities, served markets | Hierarchical `locations` and company/professional pivots | Reuse these rows. Payment eligibility can reference country-level locations without creating another conflicting country catalog. |
| Company plan tiers | `plans` rows and manual company assignment; protected active `basic` default; independent frontend supports additional mock tiers and fallbacks | No new columns per tier. A configurable default remains future work. Before selling plans, add §9.4 billing records. |
| Company size and work model | Fixed strings validated in application code and MySQL `CHECK` constraints; `DirectorySearch::SIZES` / `WORK_MODELS` | Keep the current contract at launch. If operators need to edit these choices, add dedicated `company_sizes` / `work_models` catalogs and migrate existing codes as described below. |
| Companies, professionals, memberships | Explicit foreign keys and fixed authorization rules | Keep. Individual subscriptions need their own billing target; multi-company affiliations require a separate relationship redesign, not a JSON list of company IDs. |
| Payment methods and providers | No billing tables or checkout implementation | Add the catalogs and financial records in §9.3–9.4 before the first paid checkout. No fixed limit of five methods. |
| Transactional email providers | Server environment and `config/mail.php`; existing queue tables | Already switchable for supported transports. Add tracking tables only when delivery history is needed, or account/routing tables when operators need an admin switching screen. See §9.5. |
| Identity providers | `social_accounts.provider` plus unique provider/subject and user/provider bindings; Google integration | Another identity needs callback, validation, linking, and revocation support, plus a migration for the current password/Google-only `login_challenges` check constraint. Keep separate from payment and email providers. |
| Roles, moderation, affiliation, claims, inquiry states | Fixed values tied to policies and lifecycle actions | Keep controlled state transitions in code. An admin-editable label must not create a permission or a new paid/refunded state. Consider role/permission tables only with a separately designed custom-access feature. |
| Certifications | Per-company records containing name, issuer, and year | Already accepts new certifications. Add a shared certification catalog only for consistent filtering/deduplication; retain company-specific evidence and dates. |
| Media and storage | `media.disk`, `path`, MIME type, byte size, and owner reference; new writes use allowlisted `MEDIA_DISK` (default `public`) | No table per storage vendor. Reads/removal retain each row's disk. If thumbnails/variants become necessary, add `media_variants(media_id, variant, disk, path, mime_type, size_bytes, width, height)` with unique `(media_id, variant)`. Existing file moves require copy/verification. |
| Articles, curated landings, reports | Articles exist; combined landing pages and report queues are later features | Add dedicated `landing_pages` with typed filter associations and `profile_reports` with review history when building Phase 2. More content is more rows. |
| Analytics | Append-only `profile_events` and business-derived inquiry metrics | Add daily rollup tables when measured query volume requires them. Event names retain documented counting/deduplication semantics. |
| Queue, cache, sessions, login challenges, OAuth infrastructure | Framework/lifecycle tables | Keep independent of providers. A queue/cache driver change is a deployment decision, not a new table for every vendor. |
| Marketing, editable settings, audit history | No campaign subscription or general audit model | Introduce purpose-specific consent records before campaigns; add `audit_events` alongside operator-editable payment, pricing, or mail settings. Avoid a public catch-all table containing credentials. |

If size/work-model catalogs are introduced, retain stable unique codes matching the current values, add name/order/active fields (and numeric min/max bounds for company sizes), then backfill new foreign keys without changing public filter codes. Replace the existing MySQL `companies_size_check` / `companies_work_model_check` rules as part of that rollout; merely adding rows cannot bypass those fixed-value checks. Validate unknown/inactive choices for new writes, preserve retired values on existing profiles, expose choices through catalog endpoints, and switch frontend forms and API validation together. This is an optional extension, not a claim that these enums are already editable.

### 9.2 What Musticker does and what to reuse

The reference inspected is `E:\accounts\EN_accounts\musticker`; paths below are relative to its `api/` directory. These observations describe the checked-out code, not its live configuration.

| Musticker source | Observed design | Decision for BPO Profile |
| --- | --- | --- |
| `app/Models/Payment/PaymentMethod.php`, `app/Repositories/Payment/PaymentMethodRepository.php` | `payment_methods` supplies codes/names; `payment_method_countries` enables and orders methods by country; visibility/allowed-user rules restrict choices; names support translation | Reuse catalog rows, server-side eligibility, ordering, and restricted test options. |
| `app/Services/Payments/Common/PaymentDataProvider.php`, `app/Models/Payment/PaymentMethodConfig.php` | Loads `payment_method_configs` per method and sandbox/production environment, including client/secret keys and provider configuration | Separate the gateway account from the customer-facing method so several methods can share one connection. Store a credential reference to deployment secrets instead of copying secrets into ordinary catalog rows. |
| `app/Models/Payment/PaymentMethodDetail.php` and its migration | Keeps descriptive provider fields separate from environment credentials | Preserve that distinction; validate provider-specific metadata and keep important searchable fields typed. |
| `app/Enums/PaymentType.php`, `app/Factories/PaymentFactory.php`, `app/Services/Payments/Common/PaymentServiceResolver.php` | More than five payment codes, with an explicit enum/factory mapping to implementations, including multiple methods through the same gateway | Dynamic rows alone do not implement a gateway. Use a code-owned adapter registry keyed by provider; map supported methods through validated provider codes. |
| `app/Models/Payment/PaymentSummary.php`, `PaymentTransaction.php`, `CancelledPaymentTransaction.php` | Separate payment summaries, transaction attempts, and cancellations/refunds | Reuse the separation of intent, attempts, and refunds; design records around directory plan purchases rather than Musticker's product/shipping orders. |
| `config/dynamic_mail.php`, `app/Services/Mail/DynamicMailService.php`, `app/Mail/DynamicBladeMail.php` | A template-key registry selects subject/view/mailer/sender and locale. The inspected service calls `send`; its mailable uses `Queueable` but does not implement `ShouldQueue` | This is configuration-driven templating, not a database mail-provider catalog. Retain BPO Profile's explicit queued/immediate policy. Consider template keys when message types grow. |
| `config/mail.php` | Environment-selected Laravel transports; the shown failover chain is SMTP then log | Retain BPO Profile's SMTP backup and visible failures; logging must not count as successful production delivery. |

Musticker is a useful payment reference because it already separates several concerns. Copying its whole commerce schema would bring product-specific behavior into a directory. The proposed changes below keep that useful separation while making gateway accounts, historical pricing, and payment retries explicit. No BigMailer adapter was found in the reviewed mail/configuration paths; this is not evidence of its live provider.

### 9.3 Payment method catalogs (proposed, Phase 3)

Distinguish the **method** a customer recognizes, the **provider** whose API processes it, and the **account** whose credentials and sandbox/live mode are used. One provider may process several methods, and the same method may be available through different providers.

| Proposed table | Key columns and constraints | Purpose |
| --- | --- | --- |
| `payment_methods` | `id`, unique stable `code`, `name`, `kind`, `logo_key`, `is_active`, `sort_order`, timestamps | Customer-facing choices, such as card, a named wallet, or bank transfer. A method is a row, not a column. |
| `payment_providers` | `id`, unique `code`, `name`, `adapter_key`, `is_active`, timestamps | Gateway catalog. `adapter_key` must resolve through a deployed allowlist; a DB value cannot load arbitrary code or endpoints. |
| `payment_provider_accounts` | `id`, `payment_provider_id` FK, unique stable `code`, `environment`, merchant identity, `credential_ref`, `accepts_new_payments`, timestamps | Merchant connection. Permit multiple accounts per provider/environment. Environment is an explicit sandbox/live choice, not inferred from the app environment; identity and environment cannot change after use. |
| `payment_options` | `id`, unique `public_id`, account FK, method FK, `provider_method_code`, `visibility` (`public`/`restricted`), `is_active`, `sort_order`; unique `(payment_provider_account_id, payment_method_id, provider_method_code)` | A supported method through a specific account. Credentials are shared by the account, not copied for every wallet/card choice. |
| `payment_option_allowed_users` | Option/user FKs, composite primary key | Explicit access to restricted pilot options; it never overrides billing ownership or environment restrictions. |
| `currencies` | `code` char(3) PK, `minor_unit`, `is_active` | Supported billing currencies and integer amount scale; new currencies are rows with verified provider support. |
| `payment_option_rules` | Option FK, country-location FK, currency FK, optional `min_amount_minor` / `max_amount_minor`; unique `(payment_option_id, country_location_id, currency_code)` | Explicit country/currency availability. Require country-type locations and valid amount bounds. No rows means unavailable; avoid nullable wildcard uniqueness. |

The catalog can hold six, twenty, or more choices. For example, enabling a wallet already supported by an installed adapter creates a method/option/rule as necessary. A brand-new gateway requires its adapter and webhook verification before its options can become selectable. Example method names do not promise merchant eligibility or support from any particular gateway.

Checkout eligibility intersects active catalogs, the server-selected account environment, option visibility/allowed users, country/currency/amount rules, and actual adapter capabilities (including recurring payments when relevant). Recheck these server-side at checkout creation, even if the browser previously fetched a list. The browser cannot select sandbox/live mode. Mock/sandbox payments never grant real paid entitlements, including for an allowed tester. Provider-hosted checkout can select its supported methods dynamically; avoid duplicating the provider's entire catalog unless the application needs its own controls. [Stripe's dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods) is an example of this capability, not a provider selection for this project.

Rotating credentials may update a secret reference only for the same merchant identity. A different merchant account or environment gets a new account row and code. Do not rebind an existing option to another account/method after transactions reference it. Retain old webhook verification material for the provider's supported rotation window. External object/event IDs and opaque idempotency keys require exact, case-sensitive comparison; do not inherit a case-insensitive catalog-name collation for their unique indexes.

Disabling an option prevents new checkouts while historical payments, refunds, and verified late webhooks remain processable through their original account. Use a separate operational incident procedure if an account must stop all API calls. Financial references use restrictive foreign keys; do not cascade-delete payment history when retiring a catalog entry.

### 9.4 Prices, billing history, and entitlements

Build this with paid billing, not merely to launch the free directory. The concrete first implementation should select the tables below needed by its supported one-time or recurring purchase flow.

| Proposed table | Core fields / invariant | Needed when |
| --- | --- | --- |
| `plan_prices` | Plan FK, unique price code, currency FK, integer `amount_minor`, `billing_interval`, `interval_count`, validity/active fields. Published prices are versioned: insert a new price instead of changing a purchased amount. | First paid plan |
| `billing_accounts` | Nullable unique `company_id` / `professional_id` FKs; enforce exactly one target. Separate billing contact data from permission-granting memberships. | First paid plan; professional target enabled only with individual packages |
| `invoices`, `invoice_items` | Billing-account FK; immutable issued line descriptions, quantities, unit amounts, currency, discount/tax amounts, totals, and billing identity snapshot. Items reference the purchased plan price where applicable. | First paid plan |
| `billing_requests` | Billing-account FK, server-owned environment, operation, opaque request key, canonical input hash, processing state, invoice/payment references, timestamps. Unique `(billing_account_id, environment, operation, request_key)` independent of gateway choice. | First checkout or refund write; reserves retries before contacting a provider |
| `payments` | Unique opaque `public_id`, invoice FK, intended amount/currency, controlled state, timestamps; local payment intent independent of any single gateway request. | First payment |
| `payment_attempts` | Payment FK, option/account references, provider object type/reference, idempotency key, request fingerprint, amount/currency, normalized state, timestamps. Unique account/object-type/reference and account/idempotency key; retain each logical provider operation separately. | First gateway integration |
| `refunds` | Captured attempt FK, amount/currency, provider refund reference, idempotency key, state and reason; unique `(account_id, provider_refund_reference)` and `(account_id, idempotency_key)`. Reserve pending refunds against the refundable balance as well as successful refunds. | Before enabling refunds |
| `payment_disputes` | Captured attempt/account references, external dispute ID, amount/currency, status, response deadline, outcome; unique account/external dispute ID | Before enabling a payment method that can generate disputes/chargebacks; separate from refunds |
| `credit_notes`, `credit_note_items` | Original invoice/item references, immutable numbered adjustment, amount/currency and reason; link any associated refund | Before issuing invoice corrections; a credit note does not itself confirm money was returned |
| `payment_webhook_events` | Account FK, external event ID/type, received/processed timestamps, processing state, and bounded redacted or encrypted payload. Unique `(payment_provider_account_id, external_event_id)`; index pending processing. | First asynchronous gateway integration |
| `plan_assignments` | Billing-account FK, plan FK, effective start/end, source (`manual` or `subscription`/`purchase`), optional subscription/invoice-item reference, revocation fields. Sources must belong to the same billing target. | Paid or individual entitlements; retain assignment history |
| `provider_customers`, `subscriptions` | Customer mappings reference the billing account and provider account; subscriptions reference billing account, price, original provider account/reference, period boundaries, cancellation/end timestamps, and normalized state. External IDs are unique within the provider account. | Recurring billing only |
| `provider_price_mappings` | Price FK, account FK, external product/price IDs; unique mapping per price/account | A provider requires its own product/price catalog |

Amounts use integer minor units and a currency, never binary floating-point calculations. Currency scales are not always two decimal places; freeze the amount scale used by an issued price/document. Keep amount, currency, ownership, and foreign references in typed columns; JSON is only for validated provider-specific extras. All invoice/payment/attempt/refund currencies and account associations must agree. Record sandbox/live mode on billing operations/documents and reject cross-environment references. Assign unique invoice/credit-note numbers within the chosen issuer/environment/series; finalized documents are corrected through adjustments, not overwritten. Enforce financial history retention independently of user/company soft deletion; do not store card numbers or security codes in these records.

Reserve the `billing_requests` key and persist the attempt before contacting the gateway. A browser retry must resolve the same local operation even if the default provider changed. Same key/different canonical input is a conflict. Provider retry keys are a second layer; reusing one logical attempt is not a new charge or a new attempt row on every HTTP retry. Serialize competing attempts against the same invoice, including requests with different keys, and allow only one unresolved charge operation at a time. Keep database transactions short: commit the reservation, call the provider, then persist/reconcile the result under locks.

Retry an uncertain request using that attempt/key and reconcile the provider's result. A timeout is not proof of payment failure and must not trigger an automatic charge through a different provider. After a provider's idempotency retention window expires, query/reconcile rather than blindly resubmitting. Keep local request history for the operation's retry/reconciliation lifecycle. Use the selected adapter's guarantees; providers without them need explicit reconciliation before any retry. [Stripe's idempotency behavior](https://docs.stripe.com/api/idempotent_requests) illustrates why request keys and matching parameters belong in the design.

Reserve refunds under the same captured-payment lock; successful plus pending/uncertain refund amounts cannot exceed the refundable balance. A timeout keeps its reservation until reconciliation proves the result. Authorization-only operations do not grant entitlements: confirm capture/settlement, and treat voids separately. Model dispute outcomes independently so a chargeback is not mistaken for a customer refund. Provider behavior varies; see the [refund lifecycle](https://docs.stripe.com/refunds) and [dispute lifecycle](https://docs.stripe.com/disputes/how-disputes-work) for examples. Defer partial capture, split tender, and multi-currency settlement unless explicitly supported and modeled in the first billing release.

Verify webhook signatures against the original account and raw request body before accepting events. Durably record valid events before acknowledging receipt, then process them with retries. Deduplicate event IDs and enforce idempotent business transitions: distinct events may describe the same settlement. Lock the affected payment/invoice when applying captures, refunds, or entitlements; delayed events must not reverse a newer state. Recover pending stored events if queue dispatch fails. Browser return URLs cannot mark an invoice paid. See [Stripe's webhook documentation](https://docs.stripe.com/webhooks) for duplicate, ordering, and signature examples; every adapter must implement its provider's equivalent contract.

Schedule bounded reconciliation of pending/unknown attempts, refunds, subscription renewals, and stored unprocessed events, with age/attempt indexes and an alert after repeated failure. A callback can arrive before the API response is saved: keep it pending until the local operation is correlated through trusted provider/account references; do not discard it or grant access based on browser metadata. Duplicate successful charges must enter an explicit overpayment/review path instead of granting the same plan twice. If manual bank transfer is offered, model an authenticated settlement action with operator, amount, currency, bank reference/evidence, and audit trail; an uploaded receipt alone never marks it paid.

`companies.plan_id` / `plan_expires_at` remain the launch authority. When assignments are introduced, backfill existing manual assignments and switch all entitlement reads to a shared resolver in one coordinated rollout. The company columns may remain a compatibility projection, but cannot become a second independent authority. Enforce at most one effective base-plan assignment per billing target using transactional locking and a database uniqueness rule for the active assignment marker; historical/future assignments can coexist. A unique purchase-grant key, such as billing account plus invoice item, prevents a replay from granting the same purchased period again even after expiry. Define how paid renewals, expiry, manual grants, refunds, and disputes change entitlements before enabling paid access.

Keep current typed entitlement columns until a growing feature set warrants `plan_features` plus `plan_feature_values(plan_id, feature_id, typed_value)`. Feature keys and types must be recognized by application handlers; inserting a feature name cannot implement a new capability. If a purchased offer promises fixed limits, snapshot or version those entitlements as well as the price. Never repurpose the company-tier slug `professional` as an individual subscription.

Validate the plan audience against the billing target and reject overlapping base-plan periods under the account lock, not just duplicate active markers. Recurring invoices need a unique account/external-invoice mapping and a deduplicated renewal-period grant. Define upgrade timing, prorations or their explicit absence, scheduled cancellation, past-due/grace handling, and downgrade behavior before subscriptions launch. Changing a plan price/catalog row cannot rewrite an existing subscription contract. A downgrade blocks new usage above a limit without silently deleting existing team profiles or images. Apply expiry checks when authorizing requests even if a scheduled expiry worker is delayed. Saved provider payment instruments/mandates, if needed for recurring charging, are account-scoped opaque references with consent/status; never raw card details.

Integrate recurring billing with account/company deletion before enabling it. A local soft delete does not cancel a remote subscription: persist the cancellation request, reconcile failures, and preserve historical billing records while denying new purchases/access. Company ownership changes keep billing attached to the company and re-evaluate who may access it; they must not silently transfer payment instruments or subscriptions between unrelated billing targets. These integrations are absent from the current directory-only lifecycle service.

Changing the default gateway affects new payments only. Existing refunds, subscriptions, stored provider customer references, and webhooks keep their original account mapping. Moving recurring customers to another gateway is a separate migration and may require a new payment authorization; it is not an environment-variable switch.

### 9.5 Mail, delivery history, and marketing

Keep the current environment/configuration approach for deployment-managed SMTP or installed API transports. [Laravel's mail configuration](https://laravel.com/docs/13.x/mail) already separates mailers from application messages. No `gmail_sender` column, per-provider message table, or `mail_services` table is necessary merely to change the sender service. BigMailer remains an unimplemented API integration; see the [integration boundary](../../api/README.md#bigmailer-integration-boundary).

Add these only with the corresponding product requirement:

| Requirement | Proposed records | Rules |
| --- | --- | --- |
| Inspect delivery across provider changes | `email_deliveries` (unique application message ID, message type, intended-recipient snapshot, optional user/business reference); `email_delivery_attempts` (delivery FK, attempt number, original account code, provider message ID, timestamps/outcome); `email_delivery_events` (nullable attempt FK, account code, external event ID/type, provider message reference) | One logical delivery per recipient, including guests with no user row. Track each provider attempt. Unique delivery/attempt number and account/external event ID. Keep early/unmatched verified callbacks pending for correlation. Acceptance is distinct from delivery/bounce; SMTP may offer no delivery webhooks. |
| Operator-managed connections | `mail_provider_accounts` (stable unique code, allowlisted driver, environment, sender identity, credential reference, active state); optional `mail_routes` (message purpose, account FK, priority) | Only add with a restricted, audited settings interface. Configuration changes invalidate cached resolutions and restart/reload workers. A DB row cannot install a missing transport. |
| Recover notifications after a commit-to-queue crash | `notification_outbox` (domain event key, message type, intended recipient key, encrypted payload/reference, expiry, dispatch state/attempts, timestamps); unique `(domain_event_key, message_type, recipient_key)` | Write with the domain transaction. One inquiry may notify several recipients and send a confirmation, so uniqueness cannot be on the domain event alone. Retry dispatch idempotently and recheck token expiry. This improves recovery, not exactly-once email delivery; no raw tokens in plaintext metadata. |
| Marketing campaigns | `marketing_contacts`, `marketing_subscriptions` keyed by contact/topic, append-only consent events, and scoped suppression/unsubscribe records | Transactional recipients are not automatically marketing subscribers. Preserve consent and suppression through provider changes. Keep these records independent of buyer-account permissions. |
| Operator changes to prices, catalogs, or mail routing | Append-only `audit_events` (actor, action, target, redacted before/after, timestamp) | Record who changed eligibility or routing. Exclude credentials, raw email bodies, login codes, and token URLs; define access and retention. |

Use a stable message-type/template key if email types multiply; templates can stay in version-controlled Blade/configuration. Database-managed template versions are a separate editorial feature, not a prerequisite for choosing Gmail or another provider. Keep login/reset delivery latency separate from marketing queues, and retain the current rule that inquiry business state is not email-delivery state.

Freeze the intended recipient for a logical delivery and define retention/access for address snapshots; a changed account email must not silently reroute an old token message. Keep provider-account codes stable across secret rotation, and create a new account record when the provider identity changes. Future route selection requires changing `QueuedMail::send`, which currently deliberately clears a queued mailer override to use the current default. Adding `mail_routes` rows alone will have no effect. Failover attempt tracking also needs transport-level instrumentation; the existing queue tables do not provide it. Preserve decryption of pending/failed jobs and outbox payloads during key rotation, and test multiple recipients, early callbacks, and duplicate provider acceptance.

### 9.6 Rollout and migration order

1. **Initial free launch:** keep the current tables and configured mail transports. Use existing taxonomy/location/plan rows. Do not run future billing migrations simply to reserve provider names.
2. **Operator catalogs:** the Phase 1 safeguards in [§9.8](#98-current-implementation-follow-ups) are implemented. Default seeds insert missing stable codes and preserve edited, disabled, and soft-deleted rows. Deliberate corrections use reviewed data migrations. Explicit demo seeding is restricted to local/testing databases with compatible fixture IDs. Keep frontend fixtures separate; live catalog/cache integration waits for an explicit instruction to connect. Do not renumber referenced IDs.
3. **First paid release:** add method/provider/account/option catalogs and the price, invoice, payment, event, and assignment records needed by the chosen purchase flow. Use additive migrations and explicit foreign keys/indexes; avoid a new table for each gateway. Add operator permissions/audit records with configuration editing.
4. **Enable a payment option only after verification:** exercise more than five methods, disabled/restricted/test options, sandbox/live isolation, and supported country/currency combinations. Test duplicate browser keys across provider changes, competing keys on one invoice, expired provider retry windows, missing/early/duplicate/out-of-order callbacks, pending refund reservations, disputes, renewal/expiry/downgrade behavior, and server reconciliation. Include a default switch with old payments still pending.
5. **Grow by requirement:** add recurring mappings when subscriptions launch, mail tracking/outbox when required, and editable size/work-model catalogs only if operators need them. Add languages/translations or shared certification catalogs with their actual features.
6. **Validate the production engine:** back up before schema rollout; test migrations and backfills on an isolated MySQL 8.0.16+ database. Verify uniqueness, check constraints, concurrent settlement/assignment behavior, and rollback strategy. SQLite-only tests cannot establish those guarantees.

### 9.7 Other later modules

The review does not make every field administrator-configurable. Keep these as distinct future features with explicit ownership and access rules:

- Curated discovery pages: `landing_pages` plus service/industry/location associations, publication workflow, unique canonical paths, and content/eligibility checks.
- Profile reporting: `profile_reports` and review actions; a reason catalog can grow independently of the fixed moderation workflow.
- Localized catalogs/content: dedicated translation rows keyed by entity, locale, and field if multilingual publishing is introduced; retain stable codes and foreign keys.
- Shared certification filters: a certification catalog plus company evidence records, without marking free-text claims as verified.
- Conversations: `threads`, participants, and `messages`; separate from inbound inquiry notification history.
- Reviews, favorites, saved searches, RFQs/recipients, and buyer accounts: new modules with their own authorization; payment or mail contacts alone do not create users.
- Multi-company professional affiliations: an explicit affiliation relation and ownership/visibility redesign; the current single `professionals.company_id` remains authoritative until then.

### 9.8 Current implementation follow-ups

The Phase 1 implementation now addresses the catalog, plan, and storage findings below. The frontend's disconnected state remains intentional for investor review. These changes need no new database tables; future billing and per-purpose mail routing remain proposals.

| Area | Implemented behavior | Remaining boundary |
| --- | --- | --- |
| Default company plan | Both creation paths use `Plan::defaultCompany()`; model saves/deletes protect `basic`, its company audience, and active state | Direct SQL/bulk updates bypass model events. If a configurable default is needed later, migrate both creation paths to a validated reference together. |
| Frontend catalogs deliberately use mock data | The Nuxt catalog store imports local taxonomy/location/plan fixtures | Keep this source during Phase 1 investor review. Change fixture values and presentation locally. Replacing it with live catalog requests is deferred integration work only. |
| Additional company plan codes | Admin assignment resolves active company rows by slug/ID. Frontend pricing, comparison headers, guide, admin options, and dashboard labels use the local catalog; missing comparisons show `Ask us` | `/pricing?state=expanded` demonstrates six mock tiers. Future editorial/price fields and live catalog loading need separate contract/integration work. |
| Catalog seeding | `DatabaseSeeder` only runs insert-only `CatalogSeeder`; matching stable codes include soft-deleted rows. Occupied IDs are preserved and new location parents resolve to actual IDs | Use explicit `DemoSeeder` only for disposable local/testing data; it checks fixture IDs before creating sample accounts. Stable-code renames and intentional corrections require a data migration. |
| Upload storage | `MEDIA_DISK` selects a configured disk allowed by `directory.media.allowed_disks`; disk name/instance are captured for writes, persisted metadata, and failure cleanup | Default is `public`; `s3` also requires its adapter/configuration before use. Old rows keep their disk for URLs/removal. Keep old disk aliases until files are moved and verified. `FILESYSTEM_DISK` alone does not switch uploads. |
| Per-purpose mail routes are not implemented | `QueuedMail::send` resets the mailer override; no delivery-attempt ledger exists | Keep default-provider switching as documented. Implement route resolution and actual transport attempt recording together if these tables are introduced. |

For current verification, API tests add/edit/retire catalog rows in an isolated database; frontend checks use extra local fixture rows and presentation fallbacks. A live cache/SSR refresh path and visibility without a frontend rebuild belong to later explicitly requested integration. Prefer stable IDs/codes and deterministic ordering. Retiring an API term must not delete historical associations; decide separately whether it remains selectable or publicly searchable. Required non-null sentinels such as `unknown` must remain available during a size/work-model migration.

### 9.9 In-app notification history (proposed)

Selective WebSocket updates need durable history/read state for offline users. Add a single `user_notifications` table when this feature is implemented; this documentation does not add a migration. The existing `inquiries`, `profile_events`, mail jobs, and future email-delivery tables do not represent a personal notification bell. Laravel's [database notifications](https://laravel.com/framework/docs/notifications#database-notifications) provide a persistence pattern; the fields below are this application's proposed user-specific design.

| Field | Proposed purpose |
| --- | --- |
| `id` | UUID primary key, exposed as the notification ID |
| `recipient_user_id` | Foreign key to the existing user receiving the notification; never derived from a client-supplied recipient |
| `domain_event_key` | Stable server-generated key for the originating transition, reused on retries; separate decisions on the same record have different keys |
| `kind` | Controlled application code, initially `inquiry_received`; later `claim_decided`, `affiliation_decided`, and `invitation_accepted` |
| `company_id` | Nullable company reference for scope; it does not grant membership or target access |
| `subject_type`, `subject_id` | Allowlisted domain reference resolved through the relevant current authorization policy |
| `data` | Minimal allowlisted presentation metadata; no message bodies, sender contact details, secrets, or acceptance/reset tokens |
| `read_at` | Nullable timestamp for this recipient's notification read state |
| `created_at`, `updated_at` | History ordering and state-change timestamps |

Unique `(recipient_user_id, domain_event_key)` prevents duplicate recipient records. Index `(recipient_user_id, created_at, id)` for history and `(recipient_user_id, read_at)` for unread queries. Save domain changes and recipient rows together; broadcast only after commit. The same inquiry may create separate rows for multiple authorized recipients, and reading one recipient's notification does not mark another's read or alter the shared inquiry status.

Keep durable rows independent of the transport, so polling and WebSockets read the same history. Resolve current target visibility for both lists and counts; remove access after membership/account changes and exclude deleted or inaccessible targets. Define user/target deletion and retention handling in the migration/lifecycle implementation; retain no orphaned access. Do not add tables per notification type/provider, a public recipient list, or a notification for a guest email address without an account. Changing transport alone requires no domain-table redesign.

This table is separate from the optional `notification_outbox` in §9.5: storing in-app history makes missed socket signals recoverable through HTTP; it does not guarantee email dispatch after a process crash. See [scope](PLAN.md#selective-real-time-notifications-planned), [proposed endpoints](API.md#13-selective-real-time-notifications-proposed), and [delivery flow](ARCHITECTURE.md#selective-real-time-notifications-planned).
