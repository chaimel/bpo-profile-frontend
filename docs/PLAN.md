# BPO Profile — Product Plan

**Domain:** bpoprofile.com  
**Positioning:** A professional BPO discovery network where businesses find outsourcing providers, understand what they offer, and connect directly with the sales professionals who represent them.  
**North star journey:** Discover → Understand → Connect → Opportunity  
**Master message:** Find BPO companies. Meet the people behind them.

This plan is derived from [BPO Profile.pdf](<BPO Profile.pdf>). PDF page references below use the PDF's 1-based page numbers. It is planning-only. It does not include scaffolding, install commands, or application code. Product requirements come from the brief; the stack, anonymous-buyer flow, single-company affiliation, and delivery phases are implementation decisions documented here.

---

## 1. Product goal

Build a centralized directory and lead-generation platform for the global BPO industry with two connected discovery layers:

1. **Company discovery** — find the right BPO provider by service, industry, location, size, language, work model, and capabilities.
2. **People discovery** — find the sales executive or business development professional who represents that company.

The product is not a generic business directory, job board, social network, or lead marketplace. Those may appear later. Launch is a trusted, searchable professional directory with clear contact paths.

Success at launch means:

- A buyer can search, evaluate a company, meet the sales team, and send an inquiry without creating an account.
- A BPO company can register, complete a company profile, and add sales professionals.
- A sales professional can have a dedicated public profile affiliated with a company.
- An eligible company representative can claim an existing listing, and platform admins can manually verify companies and professionals before public launch (PDF p. 25).
- Paid listing tiers exist as a product model, even if payment processing ships after the core directory.

---

## 2. Users

| Role | Who they are | Account required at launch? | Primary job |
| --- | --- | --- | --- |
| Buyer / potential client | Business looking for BPO, CX, contact center, back-office, IT, healthcare BPO, or related outsourcing | No | Search, evaluate, contact |
| Company admin | Owner or marketing/ops lead at a BPO | Yes | Claim or create the company profile, manage team, handle inquiries |
| Sales professional | Sales exec or BD representative at a BPO | Yes | Maintain personal profile, receive routed inquiries |
| Platform admin | Internal BPO Profile staff | Yes | Moderate listings, verify profiles, manage taxonomy and content |

### Buyer needs

- Find qualified providers faster than searching the open web.
- Compare services, industries, locations, and capabilities.
- Identify the right human contact.
- Start a conversation (inquiry, quote request, or direct contact).

### Company needs

- Professional online presence and discoverability.
- Showcase services, industries, locations, capabilities, and people.
- Generate qualified inquiries.
- Claim and control the official company listing.

### Sales professional needs

- Personal professional visibility tied to the company.
- Direct inbound conversations.
- Search discoverability by expertise, services, industries, markets, languages, and location.

### Platform admin needs

- Approve, verify, feature, and suspend listings.
- Maintain service, industry, location, language, and capability taxonomies.
- Review inbound platform inquiries; add a dedicated reported-profile queue in Phase 2.

---

## 3. Core concept

```
BPO Company  →  Sales Professional  →  Potential Client
     |                  |                      |
  Profile           Profile              Inquiry / Quote
```

Every public page should push the next action: search → profile → sales team → connect.

---

## 4. Product scope by phase

Phase 1 is the public directory launch, including the minimum claim and verification workflows. Phase 2 adds content and growth features; Phase 3 adds billing and paid individual listings. Features below are Phase 1 unless explicitly tagged otherwise. See section 8 for release boundaries.

### 4.1 Public discovery — Phase 1, with later additions

- Home with hero search, popular services, industries, locations, Why BPO Profile, how it works, and a company-listing CTA (PDF p. 18). Hero primary action: **Find a BPO**; secondary: **Get Listed**; offer **Find a Sales Pro** as an alternate discovery path (PDF pp. 23, 35). Featured company/professional placements and resource previews are Phase 2.
- Find a BPO: keyword search plus filters and sort.
- BPO company directory with result cards.
- Sales professional directory with result cards.
- Service, industry, and location indexes that link to useful filtered results. Curated SEO landing pages (country → region/city) are Phase 2.
- Phase 2: combined landing pages only where content is real (service + location, industry + service). No thin generated pages.
- Phase 2: resources listing and article pages (CMS-lite), covering outsourcing and buyer guides, industry insights, company stories, sales/business-development insights, and case studies/success stories (PDF pp. 20, 31–32).
- Pricing comparison page for listing packages, clearly labeling future capabilities and manual company-plan assignment; checkout is Phase 3.
- Contact Us.
- Static trust pages: about, terms, privacy.

### 4.2 Company profiles — Phase 1

Public company profile behaves like a small professional site:

- Header: logo, name, verification, primary location, primary CTA.
- About / overview, including optional company-supplied client proof or attributed testimonials as profile copy (PDF p. 16); public buyer reviews remain later.
- Services, industries, capabilities, locations.
- Company size, work model, languages, technology.
- Why choose us / differentiators.
- Certifications.
- Website and social links.
- Sales team roster linking to sales profiles.
- Contact / request-a-quote form.
- Claimed / verified / completeness indicators. Featured placement indicators accompany Phase 2 placements.

### 4.3 Sales professional profiles — Phase 1

- Header: photo, name, title, company, location/time zone, verification, Connect CTA.
- About, expertise, services represented, industries, markets served, languages, experience highlights.
- Company affiliation block.
- Professional links (LinkedIn, website).
- Contact options: inquiry form, ask a question, request a quote, visit company, share profile.
- Profiles feel professional, not social-media-like. No public feed, likes, or comments at launch.

### 4.4 Lead generation — Phase 1

- Company inquiry.
- Sales professional inquiry.
- Request a quote (company or professional as target).
- Inquiry routing: derive the company from the selected professional; reject a supplied company ID that does not match. Route to the active, email-verified professional user with accepted membership and approved affiliation; otherwise use the company inbox fallback. Company-only inquiries also route to the company inbox. A validated company fallback email is required before publication.
- Confirmation to the buyer by email.
- Notification to the recipient by email + in-dashboard inbox.
- Trackable events: profile views, search impressions, CTA clicks, website outbound clicks, inquiry submits (PDF p. 37).

The browser records each actual profile view, displayed search-result card, CTA click, or website click once, using a UUID `event_key` for retry deduplication. Inquiry events are server-only and recorded once per successfully stored, valid inquiry. Do not generate impressions for results that were never displayed.

For launch reporting, a **lead conversion** means an accepted, non-spam provider inquiry, including contact, question, and quote requests; it does not imply a won sale. Contact/question/quote counts come from `inquiries.type`, excluding platform contacts and spam/deleted inquiries. The inquiry-to-view rate is eligible inquiries / profile views for the same target and UTC time window; zero views returns null and the UI shows unavailable. This aggregate activity ratio can exceed 1 and does not represent unique-buyer attribution. Company totals include the sales team, while company-profile views and sales-profile views are also shown separately; individual professional stats cover that person alone. Phase 1 shows basic counts; Phase 2 adds richer breakdowns and trends. These are implementation definitions for the brief's measurements.

Buyer accounts, saved profiles, multi-provider RFQs, and in-app messaging are not launch features.

### 4.5 Accounts and dashboards — Phase 1

- Register / sign in through Laravel Passport browser-cookie authentication backed by live Laravel sessions. A password or a linked Google identity starts sign-in; every fresh sign-in then requires an emailed code, including company users, sales professionals, account-only claim/invitation users, and platform admins. Socialite handles Google; there is no trusted-device bypass at launch.
- Registration paths:
  - Create a company (becomes company admin).
  - Register as a sales professional with required `company_id` and `job_title`; create a draft profile with `affiliation_status = pending`.
  - Create an ordinary account for claim/invitation onboarding through `POST /api/register`; this adds no buyer role or company membership.
  - Invite-only platform admin.
- Password registration creates an unverified account and the appropriate draft records, returns `201` with `next_action = login`, and does not sign the user in. Password acceptance starts a session-bound email challenge (`202`); Google sign-in starts the same challenge. A successful code check creates the authenticated web session (`200`) and sets `email_verified_at` on first verification. The browser then refreshes CSRF and obtains its Passport cookie from `GET /auth/session` before accessing protected API routes.
- Google identities are linked by their stable provider subject, not automatically merged by matching email. Existing users sign in through an existing method and explicitly link Google after a recent completed login. A new Google account has no password, company, professional, or membership initially; after the emailed-code check it can complete company/professional onboarding or an existing claim/invitation. Google sign-in never creates platform-admin privileges.
- Authentication uses both an `HttpOnly` Laravel session cookie and Passport's encrypted JWT `laravel_token` cookie (`Secure` in production, `SameSite=Lax`); the separate CSRF cookie remains readable by the frontend. Every protected browser API request, including `GET`, sends the CSRF header and must pass Passport plus a live-session check for the same user and current `auth_version`. Do not return credentials in JSON or store tokens in localStorage/sessionStorage. Cookie scope, code expiry, attempt/resend limits, and API details are defined in the [auth flow](ARCHITECTURE.md#5-auth-flow) and [setup intent](SETUP.md#4-auth-setup-intent).
- Passport migrations and signing keys are provisioned now for future integrations. External OAuth clients and authorization/token issuance endpoints remain disabled at launch; later integrations require authorization code with PKCE, explicit consent/scopes, and their own API authorization design.
- Password reset/change, email change, account deletion/restoration, and platform-role changes invalidate prior sessions and pending challenges. Authorization always uses the current account, role, and accepted membership.
- Company dashboard: edit company profile, manage locations/services/industries, manage team, view inquiries, view basic stats.
- Sales dashboard: edit own profile, view own inquiries, view basic stats.
- An email-verified company owner/admin or platform admin reviews pending professional affiliations. Approval of a self-registered applicant requires their verified email and adds accepted company membership. Only platform admins publish approved affiliations. Affiliation approval and platform verification are separate decisions.
- Email invitations use `team_invitations`. An authenticated user with the verified intended email accepts the token; acceptance attaches an existing roster row where applicable, without creating a duplicate professional.
- Claim unclaimed company records, including unpublished records created by admins or imports. A public claim landing page can lead to sign-in/registration; submitting a claim requires an authenticated, email-verified account. A `company_claims` request remains pending until platform-admin approval; the approved claimant receives an emailed token, whose acceptance atomically grants ownership and marks the listing claimed. Claiming does not automatically verify or publish a listing.
- Profile completeness score shown in dashboard and used in ranking.

### 4.6 Trust — Phase 1

Meaningful badges only:

| Badge | Meaning |
| --- | --- |
| Claimed | An authenticated company admin controls the listing |
| Verified company | Platform reviewed legal/website identity |
| Verified professional | Platform confirmed the person belongs to the affiliated company |
| Profile complete | Completeness score meets the published threshold |
| Featured | Phase 2: paid or editorially selected placement |

No decorative badges. Manual company/professional verification and basic company claims are launch requirements (PDF p. 25); automated evidence collection can follow later.

### 4.7 Monetization — Phase 1 model, Phase 3 billing

Freemium company listing plans exist in data from Phase 1, with admin-managed assignment and a basic pricing comparison. The table describes intended packages across phases, not a promise that every benefit is available at launch. Label unavailable benefits as forthcoming. API enforcement of paid entitlements and checkout are Phase 3.

| Plan | Who | Intended package / delivery |
| --- | --- | --- |
| Basic (free) | Company | Standard listing and basic visibility at launch; plan-gated media and seats in Phase 3 |
| Professional | Company | Intended fuller profile/media and seat allowance, with basic analytics; paid entitlement enforcement in Phase 3 |
| Premium | Company | Intended featured eligibility, promotional slots, advanced analytics, and final ranking tie-breaker; placements/analytics start in Phase 2, paid enforcement in Phase 3 |
| Pro listing | Sales professional | Phase 3/future only: optional individual boost; requires a separate individual-plan assignment model before implementation |

Enhanced lead-generation tools are a future Premium direction (PDF pp. 26, 38); define their scope and entitlement model before offering them as available benefits.

Premium placement never overrides relevance, completeness, verification, location/service match, or quality. It is the final product-ranking tie-breaker, followed only by a stable record ID for deterministic ordering (PDF p. 23).

### 4.8 Platform administration — Phase 1, with later additions

- Create, edit, moderate, soft-delete, and restore companies, professionals, and users; inspect and moderate inquiries without changing buyer messages or targets. Articles are Phase 2.
- Taxonomy management: services, industries, capabilities, languages, technologies. `work_model` is a fixed enum (`onshore`, `offshore`, `nearshore`, `hybrid`, `unknown`), not an admin-editable taxonomy.
- Location hierarchy: country → region/state → city.
- Claim/affiliation review and manual company/professional verification; featured placements in Phase 2.
- Soft-delete and restore.
- Phase 2: profile-report submission and a moderation queue, with its data/API model designed before implementation.

---

## 5. Explicitly later (not launch)

- Buyer accounts, favorites, saved searches.
- Direct messaging and meeting scheduling.
- Compare BPOs.
- Client RFQs and multi-provider inquiries.
- Buyer-submitted reviews and testimonials. Company-supplied client proof can appear in Phase 1 within `companies.overview`, labeled as company-provided content and distinct from platform verification.
- CRM integrations and third-party OAuth access. Passport is provisioned in Phase 1; client registration, delegated scopes/consent, and external authorization/token issuance remain later work.
- Full lead CRM for companies.
- Intelligent matching.
- Jobs / talent.
- Events / community.
- Paid ads beyond featured listings.

---

## 6. Public information architecture

Target primary nav (hide Phase 2 destinations until they have content):

- Find a BPO
- BPO Profiles
- Sales Pros
- Services
- Industries
- Locations
- Resources (Phase 2)
- Pricing

Primary CTA: **Get Listed**  
Secondary: **Sign In**

Suggested public routes (Nuxt):

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/find` | Search and filter |
| `/companies` | Company directory |
| `/companies/{slug}` | Company profile |
| `/professionals` | Sales directory |
| `/professionals/{slug}` | Sales profile |
| `/services` | Service index |
| `/industries` | Industry index |
| `/locations` | Location index |
| `/services/{slug}` | Curated service landing — Phase 2 |
| `/industries/{slug}` | Curated industry landing — Phase 2 |
| `/locations/{country}` | Curated country landing — Phase 2 |
| `/locations/{country}/{place}` | Curated region or direct-child city landing — Phase 2 |
| `/locations/{country}/{region}/{city}` | Curated city within a region — Phase 2 |
| `/landings/{slug}` | Approved service/location or industry/service combination — Phase 2 |
| `/resources` | Article index — Phase 2 |
| `/resources/{slug}` | Article — Phase 2 |
| `/pricing` | Plans |
| `/contact` | Platform contact |
| `/login` `/register` | Auth |
| `/dashboard` | Role-aware dashboard |
| `/claim/{token}` | Approved claim-token acceptance; sign-in and verified intended email required |
| `/invitations/{token}` | Team-invitation acceptance; sign-in and verified intended email required |

---

## 7. Search, ranking, and SEO

Search filters at launch:

- Keyword
- Service
- Industry
- Country / region / city
- Company size
- Capabilities
- Work model
- Language
- Technology

Default ranking order (PDF p. 23):

1. Relevance to query and filters
2. Profile completeness
3. Verification
4. Location / service match quality
5. Quality signals (usable imagery, substantive copy, valid contact information; shared rubric in `DATABASE.md`)
6. Premium visibility as a final, disclosed tie-breaker
7. Stable record ID for deterministic ordering when all product-ranking signals tie

SEO from day one:

- Unique title, meta description, H1, canonical, breadcrumbs per indexable page.
- Descriptive slugs.
- Organization / Person / Breadcrumb structured data.
- Internal links between company, people, and available service/industry/location indexes. Extend to curated landing pages in Phase 2.
- Do not generate empty combination pages.

Organic growth also includes shareable company/professional profile links and, as content grows in Phase 2, partner and industry-publication outreach, interviews, company stories, resource partnerships, and digital PR (PDF p. 36). These are editorial and promotion activities alongside the site, not additional launch application modules.

---

## 8. Phases

### Phase 0 — Foundations (this documentation track)

- Product plan (this document)
- Database model
- Architecture
- API contract
- High-level setup notes

### Phase 1 — Directory MVP and public launch

Ship a usable public directory and the minimum write-path:

- Passport browser-cookie authentication, password or Google sign-in followed by an emailed code, and first-login email verification (company admin + sales professional + platform admin, plus accounts awaiting claim/invitation onboarding)
- Taxonomies and locations
- Company and sales profiles (create, edit, publish)
- Public home, search, directories, profile pages
- Inquiry / request-quote forms and email notifications
- Basic admin moderation and affiliation approval
- Profile completeness and ranking
- Company claims with admin review and token acceptance, including the claimed badge
- Manual company and professional verification
- Team invitations and token acceptance
- Basic analytics events and counts, including search impressions and accepted provider inquiries
- Basic pricing comparison and manual company-plan assignment

This is the first public launch and includes the brief's launch trust features (PDF p. 25). Later automation can simplify their administration, but must not delay these minimum workflows.

### Phase 2 — Content, growth, and enhanced analytics

- Resources / articles across the content pillars in section 4.1
- SEO landing pages populated from real data
- Featured placements
- Enhanced dashboard analytics (breakdowns and trends for impressions, views, clicks, inquiries, and conversion rates)
- Optional verification evidence tooling beyond the launch manual process
- Profile-report submission and moderation queue after defining its storage and API

### Phase 3 — Monetization

- Plan entitlements enforced in API
- Checkout and billing
- Premium slots on home and directories
- Plan-gated seats, media, and analytics
- Optional paid individual Pro listing, after its assignment and entitlement model is defined

### Phase 4 — Networking layer (future direction, PDF p. 26)

- Buyer accounts and saved profiles
- Messaging / scheduling
- Compare, RFQs, reviews
- CRM-style lead tools

---

## 9. What we build first (Phase 1 scope)

In priority order:

1. Users, roles, Passport browser-cookie authentication with live sessions, Socialite Google sign-in, emailed-code checks, and first-login email verification
2. Services, industries, locations, and other taxonomies
3. Company entity and public company profile
4. Sales professional entity with pending/approved affiliation and team invitation acceptance
5. Public search + filters for companies and professionals
6. Inquiry form routed to company or professional
7. Company and sales dashboards for profile editing
8. Platform admin to publish, unpublish, soft-delete, review company claims, and manually verify companies/professionals
9. Profile completeness, deterministic ranking, basic analytics, and manual company-plan assignment

Out of Phase 1 even if useful:

- Stripe / billing
- Resources CMS and curated SEO landing pages
- Automated verification evidence collection (manual verification is required)
- Buyer accounts
- Paid individual Pro listings

Phase 1 acceptance checks:

- Every account type must complete password or Google sign-in and the emailed-code check before accessing protected routes. Registration and either initial sign-in step alone grant no authenticated session; first successful code verification marks the email verified without awarding a profile verification badge.
- Laravel session and Passport cookies are `HttpOnly` and `Secure` in production; the readable CSRF cookie and header protect browser writes and are also required for protected API `GET` requests. Tokens never enter localStorage/sessionStorage or JSON response payloads. The post-verification Passport bootstrap requires the live authenticated web session.
- Invalid/replayed Google state and duplicate provider identities fail; matching email never silently merges accounts. Explicit linking requires a recent completed login. First-time Google onboarding creates only the intended company/professional records, without administrative privileges.
- A copied Passport cookie cannot bypass a destroyed or stale web session. Phase 1 browser API routes reject bearer credentials, and external OAuth authorization/token issuance routes remain unavailable.
- Expired, reused, replaced, exhausted, or differently session-bound codes fail. Resend does not reset attempt counts or expiry; account and IP limits work across instances. Reset, email change, and deletion/restoration invalidate old sessions and challenges.
- A buyer can discover a company or professional and submit a valid inquiry without an account; a mismatched professional/company target is rejected.
- Pending professionals remain draft and cannot publish; affiliation approval creates membership without granting company-administration rights.
- Claim and invitation tokens require the intended verified email, expire, are single-use, and cannot produce duplicate professionals or conflicting ownership.
- Concurrent deletion and affiliation/invitation/claim acceptance cannot recreate access. Restoring an account grants neither old-session access nor editing/inbox/statistics access through a retained approved profile link without accepted membership.
- Admins can manually verify both company and professional identity; ownership, affiliation approval, publication, and verification remain distinct states.
- Search uses the complete ranking order in section 7; duplicate analytics retries do not inflate counts, and inquiries cannot be counted through browser-submitted events.
- Public flows work by keyboard and on mobile, with accessible forms and useful empty/error states as detailed in `SETUP.md` (PDF pp. 38–39).

---

## 10. Assumptions used so buyers can move

These are implementation defaults, not requirements prescribed by the PDF. Change them consistently across all five documents before database work if they are wrong.

1. **Buyers do not need accounts at launch.** Anyone can search and submit an inquiry.
2. **A sales professional references one company.** Self-registration requires company and job title, with affiliation pending until approved; multi-company representation is later.
3. **Company admin can invite team members by email.** Professionals can also register and request affiliation.
4. **Unclaimed companies can exist** so the directory can be seeded. Only claimed profiles are fully editable by the company.
5. **Nuxt/Vue/TypeScript, Laravel/Passport with Socialite for Google, and PostgreSQL** are the chosen stack. Passport is selected now for future OAuth readiness; confirm exact version compatibility when implementation begins.
6. **One inquiry table** covers contact, question, and quote-request via a `type` field.
7. **Soft deletes** on users, companies, professionals, inquiries, articles, and taxonomy terms.
8. **English-first UI.** Languages listed on profiles are capabilities, not a translated product in Phase 1.
9. **Media** is logo, cover, and professional photo stored as files referenced from the API. No video in Phase 1.
10. **Company plans exist in data** (`basic`, `professional`, `premium`) with a default of `basic`. Payment provider and any individual Pro plan are Phase 3 or later.
11. **Every fresh account sign-in requires a password or Google identity, then an emailed code.** Passport's `HttpOnly` browser cookie is paired with a live Laravel session; the first successful code check verifies the email. Google uses Socialite and does not replace the emailed-code requirement. The PDF does not prescribe this authentication mechanism or its code limits.

---

## 11. Risks to watch

- Directory quality dies if empty or thin profiles rank well. Completeness must affect ranking from Phase 1.
- Sales profiles become an afterthought if they are only a name on the company page. They need their own directory, URL, and CTA.
- Premium listings can destroy trust if they look like organic #1 results. Disclose featured placements.
- SEO combination pages can become junk. Generate them only from real associations.
- Claiming the wrong company creates support and legal cost. Claim tokens and admin review are required before a claim goes live.

---

## 12. Implementation decisions and source traceability

These defaults are treated as decided so database and API work can proceed; they are not claimed as exact instructions in the brief:

1. A sales professional belongs to **one company** at launch.
2. Buyers stay **anonymous inquirers** in Phase 1. No buyer accounts.
3. **No checkout in Phase 1.** Plans exist as fields. Platform admins apply upgrades manually until Phase 3 billing.
4. **Phase 1 is public launch.** Company claims, affiliation approval, completeness, and manual verification ship together.
5. **Password or Google sign-in, followed by an emailed code for all account types.** Google uses Socialite; Passport supplies browser-cookie API authentication after the code succeeds, with a live Laravel session check. First-login email verification is distinct from company/professional identity review.
6. **Passport now, delegated OAuth access later.** Passport's migrations and keys are planned for launch. Exposing external clients, scopes, consent, and authorization/token issuance is separate implementation work; Google login is the app acting as Google's client.

| PDF pages | Requirement carried into this plan |
| --- | --- |
| 16, 22 | Company client proof and complete professional profiles with company affiliation, time zone, and contact paths |
| 18–20, 23, 35 | Homepage discovery actions, directories, and service/industry/location navigation |
| 20, 31–32, 36 | Resource content pillars and organic growth through shareable profiles and editorial partnerships |
| 23 | Relevance, completeness, verification, location/service match, quality, then premium ranking |
| 25 | Launch company claims, verification, and profile completeness |
| 26 | Future networking features, outside the directory launch |
| 26–28 | Brand colors, Poppins, Calibri, and recommended responsive typography; frontend defaults in `SETUP.md` |
| 30–32 | Clear layouts, professional people-centered imagery, and clear/helpful/human brand voice |
| 37 | Search impressions, profile views, contact/quote activity, and conversion tracking |
| 38–39 | Accessibility, responsive layouts, and neutral error/empty-state messaging |
