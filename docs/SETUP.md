# BPO Profile — Setup (high level)

High-level setup and rollout guidance for the existing frontend/API and their proposed extensions. For current API commands, see [the API README](../../api/README.md). Product references are to [BPO Profile.pdf](<BPO Profile.pdf>), using 1-based PDF page numbers; framework and infrastructure choices are implementation defaults. Future billing tables and endpoints below are not yet implemented.

**Current instruction:** keep Phase 1 frontend and Phase 1 API separate. The investor frontend uses typed local fixtures and simulated actions; Laravel is tested independently. Do not add API wiring or live service connections. Start integration only when the user explicitly asks to connect, as defined in [the Phase 1 tracks](PLAN.md#phase-1-frontend--investor-review).

---

## 1. Two apps

| App | Stack | Role |
| --- | --- | --- |
| `frontend` | Nuxt 4, Vue 3, TypeScript | Public site + dashboards |
| `api` | Laravel 13, compatible PHP runtime, MySQL, Passport, Socialite | JSON API + Google sign-in |

Target MySQL 8.0.16+ in Homestead and production, with separate connection settings and credentials. The API's `development` example is a SQLite convenience profile and its automated suite uses in-memory SQLite; neither verifies the MySQL-specific constraints. Use an isolated MySQL database for production-engine checks.

For future connected deployment, prefer one public hostname (`bpoprofile.com`) with `/api` and `/auth` proxied to Laravel, including the Google callback. When using local public media, serve `/storage/**` from Laravel's public disk. Other routes go to Nuxt; server-rendered data requests use a separate absolute Laravel API base. This is a later topology, not setup to apply to the current investor frontend. Keep external OAuth authorization/token issuance routes unavailable at launch; provisioning Passport does not authorize third-party integrations.

Before changing framework or deployment dependencies, verify installed versions against the selected releases' official requirements. This document does not establish a tested compatibility matrix.

---

## 2. Build and rollout order

Extend the existing apps within these independent tracks. One track's readiness does not authorize connecting it to the other.

| Track | Work and verification | Boundary |
| --- | --- | --- |
| Phase 1 frontend | Pages, dashboards/admin previews, responsive/accessibility states, local catalogs/plans, simulated auth/inquiries/uploads/analytics; verify with Laravel stopped | Keep Pinia fixtures and local previews. No API client wiring, live form submissions, OAuth redirect, or event delivery |
| Phase 1 API | Directory schema/catalogs, auth/session/policies, claims/invitations/moderation, inquiries/mail queue, compression/media, ranking/statistics, manual plans; use isolated API tests | No dependency on Nuxt; automated tests use local/fake providers and isolated data |
| Contract review | Compare `API.md`, frontend types/mock payloads, and API request/response tests; record intentional differences | Comparing shapes does not require a network connection or force UI-only changes into database migrations |
| Integration, later | Reconcile reviewed contracts, wire stores/auth/forms/uploads/events and deployment routing, then run connected acceptance checks | Requires an explicit instruction to connect; investor feedback alone does not start it |
| Phase 2 | Resources, curated SEO, featured placements, enhanced analytics | Follow the product phase; do not introduce these as Phase 1 prerequisites |
| Phase 3 | Configurable payment catalogs, versioned prices, billing records, verified webhooks, paid entitlements, individual packages | Future implementation under [the schema roadmap](DATABASE.md#9-extensibility-and-future-schema-roadmap) |

The eventual public release requires the minimum claim and manual verification workflows (PDF p. 25) and connected acceptance checks. The current investor review is a mock frontend milestone. Billing, messaging, and a custom search engine remain outside Phase 1.

---

## 3. Environment pieces

These settings describe the standalone API and eventual connected deployment. The current frontend uses only its own preview/build settings; do not populate an API base or proxy it to Laravel now.

- Nuxt public origin
- Laravel app URL and server-only absolute API base for Nuxt SSR
- Browser API base (same-origin `/api` by default)
- Laravel session and Passport cookie security flags, session lifetime, and optional cookie domain (host-only by default)
- Passport signing keys, kept server-side and provisioned separately from the Laravel app key
- Google OAuth client ID, client secret, and exact server callback URL for Socialite; these identify the app to Google, not clients of our Passport OAuth server
- MySQL connection and server-side session store
- Shared cache/rate-limit store across API instances
- Mailer and login-code delivery configuration
- Named `public` disk for current uploads and public media URL; selecting another disk requires the documented upload-service change
- App key / session encryption

### MySQL environment configuration

The API's root `.env` selects an environment with `ENV=development`, `ENV=homestead`, or `ENV=production`; connection settings belong in the corresponding `api/environments/.env.<profile>` file. Use `DB_CONNECTION=mysql` in Homestead and production. The development example selects SQLite for convenience; point a separate development/test profile at MySQL when verifying production-engine behavior.

| Profile | Database intent |
| --- | --- |
| `development` | SQLite convenience example; use separate MySQL settings when verifying production-engine behavior |
| `homestead` | Homestead MySQL at `192.168.56.56:3306` from Windows, database `bpoprofile_dev`, username `homestead` |
| `production` | Production MySQL server, database `bpoprofile_prod`, with dedicated production credentials |

The Homestead address above matches this project's host-side setup. If Laravel runs inside the VM, use `127.0.0.1:3306` for the VM's own MySQL server. Set the production host, port, and secrets through the deployment environment; local credentials are development-only.

Keep the MySQL version, InnoDB engine, `utf8mb4` character set/collations, SQL mode, and UTC connection time zone aligned between development and production. Follow the [MySQL schema conventions](DATABASE.md#mysql-schema-conventions) for types, conditional uniqueness, and enforced checks. Validate migrations and database-specific behavior against an isolated MySQL test database before release.

---

## 4. Auth setup intent

Implement and test the following inside Laravel independently. Frontend role/login/Google/code-entry screens remain local previews until the integration gate; they do not perform these requests now.

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
- Typed local fixtures behind the current Pinia stores, with simulated request/auth/form states. A typed API client, browser/SSR bases, and CSRF handling belong to later explicitly requested integration
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

For the frontend review, check keyboard navigation/focus, field labels and errors, color contrast, image alternatives, mobile layout, and loading/empty/error/success previews using local fixtures. Verify those screens with Laravel stopped and ensure interactions do not call API/auth/upload/event endpoints. Live anonymous SSR requests, inquiry submission, session/CSRF behavior, and media through the combined proxy topology are later integration checks.

Standalone API auth tests must cover every account type and both password and Google entry paths: registration, password acceptance, and a Google callback alone cannot open a dashboard. A valid emailed code creates a fresh web session; protected API access also requires the subsequent Passport cookie bootstrap. Test missing/incorrect CSRF on protected `GET` requests, both cookies' production flags, bearer rejection, and live-session rejection of a copied Passport cookie after logout, reset, email change, deletion, or restoration. Verify expired, replayed, exhausted, replaced, or differently session-bound codes fail; resend limits work across instances; and delivery failure grants no access. Google tests fake the identity provider and cover wrong/replayed state, duplicate subject identities, email conflicts, explicit linking, and onboarding. Confirm external OAuth issuance endpoints remain unavailable. The frontend previews matching states locally; repeat the browser flows against Laravel only after connection is requested.

---

## 6. Data setup intent

API seeders and frontend mock fixtures are separate data sources. Keep them contract-shaped where useful, without synchronizing either through live requests or coupling investor copy/layout changes to database migrations.

- Migrations first, then seeders for taxonomies and plans
- A handful of sample companies and professionals for UI work
- Soft deletes enabled on the tables listed in `docs/DATABASE.md`
- Slugs generated from names; unique among non-deleted rows
- `work_model` uses the fixed enum from `DATABASE.md`, not a seeded/admin-editable taxonomy
- Public taxonomy/location/plan catalogs use `is_active`; company/professional/article publication follows its own status rules
- Seed pending and approved affiliations plus unclaimed roster rows to exercise the trust and invitation workflows
- Match ranking to PDF p. 23: relevance, completeness, verification, location/service match, quality, then premium visibility; use a stable record ID only to resolve remaining ties

The database catalogs support additional rows. Nuxt retains local fixtures with flexible plan rendering and display fallbacks; `/pricing?state=expanded` previews six tiers. Independently, the API resolves active company plan slugs/IDs and protects the `basic` default through model saves/deletes. See [implementation status](DATABASE.md#98-current-implementation-follow-ups). Live catalog consumption is deferred. Additional payment methods follow the row-based approach only when billing is built. Workflow states and security roles remain controlled application rules.

`php artisan db:seed` now inserts missing catalog defaults without changing matching plans, locations, or taxonomy terms, including disabled and soft-deleted rows. Stable slugs identify defaults; keep those codes stable and use explicit data migrations for deliberate corrections. Existing IDs are never renumbered. The default seeder creates no sample companies or accounts. For disposable local/testing databases only, explicitly run `php artisan db:seed --class=DemoSeeder`; it requires compatible original catalog IDs and includes the sample directory and accounts. API tests cover preservation and demo guards; frontend tests use added mock rows. Live cache/SSR refresh tests wait for requested integration.

Image uploads use `MEDIA_DISK=public` by default. The selected disk must exist in `config/filesystems.php` and be allowed in `config/directory.php` (`public` and `s3` initially). S3 requires the appropriate filesystem adapter and bucket configuration before enabling it; this preparation does not install or connect a storage provider. Existing media URLs/deletion continue to use the row's stored disk, so retain old disk aliases. Compression remains WebP with the configured dimensions and quality.

### Basic analytics from Phase 1

Frontend charts/counts remain fixtures and interactions remain local previews. The following are standalone API rules and the future browser-event contract; do not wire event transmission now.

Capture browser events once per actual display/action: `view`, `search_impression`, `cta_click`, and `website_click`, with a UUID `event_key` to deduplicate retries. A search impression means a displayed result card, not merely an API response. Generate `inquiry` events only on the server, once per stored valid inquiry; the browser cannot submit them.

Keep accepted non-spam, non-deleted provider inquiries as the source for contact/question/quote counts and launch lead conversions, using `inquiries.type`; platform contacts are excluded. Compare inquiries and profile views for the same target and UTC time window when calculating the inquiry-to-view rate; zero views returns null and displays as unavailable. Company totals include the team, with company-profile and sales-profile views also returned separately; professional totals cover that person only. This activity ratio is not a unique-buyer funnel or evidence of a won sale. Phase 2 adds richer analytics views.

---

## 7. Mail and files

This section applies to the API track. The mock frontend does not send email, call storage, or change provider settings. Automated API verification uses fakes/local transports; this review does not configure real providers.

Email sending is selected by Laravel server configuration, not a Gmail-specific field or a Nuxt setting. Start with `MAIL_MAILER=smtp`; change the SMTP credentials and authorized sender to move providers. Production uses `QUEUE_CONNECTION=database` and a supervised worker on `MAIL_QUEUE=mail`. Inquiry notifications/confirmations, team invitations, and claim links queue after commit with encrypted payloads and retries. Login codes and password resets remain immediate. Restart workers after changing provider configuration.

The existing queue tables support this without a schema migration. `MAIL_MAILER=failover` can use a separately configured `smtp_backup`; production failures must not silently fall back to the log driver. HTTP-only services require their own transport and credentials; choosing a provider name alone is insufficient. Keep transactional delivery separate from marketing contact subscriptions.

Implementation and commands: [API email and queue setup](../../api/README.md#email-providers-and-queue-workers). Database boundaries: [queue and cache infrastructure](DATABASE.md#420-queue-and-cache-infrastructure).

- Inquiry notification to the assigned professional, or to the company fallback inbox and accepted email-verified owners/admins; deduplicate recipients
- Inquiry confirmation to sender
- Login-code emails, including first-login email verification, and team-invitation emails
- Claim-company token email after platform-admin approval
- Password reset
- Logo, cover, photo uploads follow the [media rules](ARCHITECTURE.md#7-media): JPEG/PNG/WebP, content/size/dimension checks, re-encoding, and generated filenames
- Meaningful image alternative text stored with uploaded media

### Future AWS S3 and Cloudflare R2 storage

Both providers fit the existing media schema. [Laravel supports S3-compatible storage](https://laravel.com/framework/docs/13.x/filesystem#amazon-s3-compatible-filesystems), including [Cloudflare R2's S3 API](https://developers.cloudflare.com/r2/api/s3/api/). Keep a separate named disk for each provider/bucket whose files remain in use:

| Destination | Upload setting | Preparation |
| --- | --- | --- |
| Local public files | `MEDIA_DISK=public` | Current default; retain `/storage` serving |
| AWS S3 | `MEDIA_DISK=s3` | Existing disk configuration; install the S3 filesystem adapter and supply bucket, region, credentials, and a readable image URL |
| Cloudflare R2 | `MEDIA_DISK=r2` | Future disk: add `r2` using driver `s3`, separate `R2_*` environment values, and add its name to `directory.media.allowed_disks` |

The S3 adapter (`league/flysystem-aws-s3-v3`, version compatible with the installed Laravel release) is not currently installed. The `r2` disk/allowlist entry is not implemented yet; changing the environment value alone will be rejected. R2 uses region `auto` and the bucket's account/jurisdiction-specific S3 endpoint. Configure its public image URL separately from that API endpoint: use an R2 custom domain for production; the managed `r2.dev` URL is for development. Public delivery is configured on the bucket/domain, not by assuming AWS object ACLs work on R2. See [Cloudflare public-bucket configuration](https://developers.cloudflare.com/r2/buckets/public-buckets/).

Changing `MEDIA_DISK` affects new uploads only. Existing rows retain their original disk/path for URLs and deletion; keep their original disk configuration and credentials available. Do not repoint an existing `s3` disk at R2 or another bucket while rows still reference it. To move old files, explicitly copy them, verify content and URLs, then update those rows' disk/path; retain the source until the move is verified. Compression remains in `MediaStore` before upload regardless of provider. Future activation should verify upload, public reads, replacement/deletion, and failed-write cleanup against the selected provider. No new provider tables, frontend connection, credentials, or live storage changes are required for this design.

### Future payment and provider setup

This is a later implementation sequence, not additional launch setup:

1. Select the first purchase flow and supported gateway; implement its allowlisted adapter and sandbox tests before enabling a catalog option.
2. Add the [payment catalogs](DATABASE.md#93-payment-method-catalogs-proposed-phase-3) and the required [billing records](DATABASE.md#94-prices-billing-history-and-entitlements) through additive migrations. Add recurring mappings only with subscription support.
3. Configure sandbox/live provider accounts explicitly and keep credentials in deployment secrets. Add methods/options/country-currency rules as rows, and expose only eligible public choices through the API.
4. Verify checkout authorization, more than five choices, restricted options, and sandbox/live isolation. Exercise duplicate browser keys across provider changes, competing requests for one invoice, expired provider retry windows, early/missing/duplicate events, pending refund reservations, disputes, and late callbacks to an old account. Run schema/backfill checks on isolated MySQL before production rollout.
5. Run supervised workers plus scheduled reconciliation for unknown/pending charges, refunds, and stored events. Monitor oldest pending age and failed processing; do not rely on callbacks alone to recover interrupted payments.
6. Backfill manual plan assignments and switch entitlement reads consistently. Require verified live capture/settlement before granting paid access; define renewal, expiry, cancellation, and downgrade handling without deleting customer content. Test delayed expiry workers, repeated renewal events, and remote subscription cancellation when an account/company is deleted.
7. Add email delivery history, an outbox, or audited mail account settings only with those features. Test multi-recipient outbox uniqueness, early callbacks, intended-recipient snapshots, and encryption-key rotation. Existing SMTP switching still needs no new tables; per-purpose routing requires resolver changes. Marketing campaigns require consent and suppression records first.

The [Musticker comparison](DATABASE.md#92-what-musticker-does-and-what-to-reuse) explains the catalog and adapter patterns to reuse. New methods supported by an existing adapter can be configuration/data changes; a new provider protocol still requires implementation. A payment-provider change also preserves old transactions and subscriptions on their original accounts.

---

## 8. What not to do at setup time

- Work in the existing `frontend/` and `api/` directories; do not generate a second application scaffold
- Keep a documentation review separate from executing migrations, provisioning providers, or deploying changes
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

When implementing another feature, use the current code plus the relevant phase in `PLAN.md`. Distinguish the existing tables from the proposed extensions in `DATABASE.md`; a design entry is not an applied migration.
