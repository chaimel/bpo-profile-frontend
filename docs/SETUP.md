# BPO Profile — Setup (high level)

How this would be built later. Not a scaffold. No install command dump. Product references are to [BPO Profile.pdf](<BPO Profile.pdf>), using 1-based PDF page numbers; framework and infrastructure choices are implementation defaults.

---

## 1. Two apps

| App | Stack | Role |
| --- | --- | --- |
| `web` | Nuxt 4, Vue 3, TypeScript | Public site + dashboards |
| `api` | Laravel 13, compatible PHP runtime, PostgreSQL, Sanctum | JSON API |

Prefer one public hostname later (`bpoprofile.com`) with `/api` and `/sanctum` proxied to Laravel.

Before scaffolding, verify supported PHP, Node, database, framework, and package versions against the selected releases' official requirements. This planning document does not establish a tested compatibility matrix.

---

## 2. Build order (when coding starts)

1. Laravel project, PostgreSQL, migrations matching `docs/DATABASE.md`
2. Seed plans, services, industries, languages, capabilities, technologies, countries
3. Sanctum SPA auth, email verification, and `/api/me`
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
- Laravel app URL
- Sanctum stateful domain
- PostgreSQL connection
- Mailer
- File disk (local, then S3)
- App key / session encryption

Exact `.env` keys belong in the repos when they exist, not here.

---

## 4. Auth setup intent

- Sanctum in SPA mode for the Nuxt origin
- CSRF cookie before login
- Session cookie on API responses
- Email verification built alongside auth; claims and invitation acceptance require the authenticated user's verified intended email
- Professional self-registration requires company and job title, creates a draft/pending affiliation, and grants company membership only after owner/admin or platform-admin approval
- Ordinary account registration supports claim/invitation onboarding without creating a buyer role or implicit company membership
- Company dashboard routes include `companyId`; authorize each request against that user's accepted membership and role in the selected company
- Claim approval precedes token issuance; token acceptance grants ownership atomically. Invitation acceptance attaches an existing roster profile where applicable, without duplication
- Platform admin seeded once, not registered from the public form

---

## 5. Frontend setup intent

- Nuxt 4 with TypeScript
- Server-rendered public pages so profiles are indexable
- A small API module (fetch wrappers) rather than scattering URLs
- Brand tokens from the brief (PDF pp. 26–28): blue `#2389C2`, slate `#394454`, black `#1E1E1E`; typography includes Poppins and Calibri
- Card layouts for companies and sales professionals as specified in the brief

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

Before launch, check keyboard navigation/focus, field labels and errors, color contrast, informative/decorative image alternatives, mobile layout, and each empty/error state on the actual search, profile, and inquiry flows.

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
- Email verification and team-invitation emails
- Claim-company token email after platform-admin approval
- Password reset
- Logo, cover, photo uploads with size and type checks
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
| `docs/ARCHITECTURE.md` | How Nuxt and Laravel meet |
| `docs/API.md` | Endpoints and payloads |
| `docs/SETUP.md` | This file |

When implementation is requested, start from Phase 1 in `PLAN.md` and the tables in `DATABASE.md`.
