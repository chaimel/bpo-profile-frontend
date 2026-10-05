# BPO Profile — frontend

Nuxt 4 + Vue 3 + TypeScript + SCSS + Pinia. The UI is **static**: every screen renders from
Pinia stores that answer from typed seed data shaped exactly like the Laravel API payloads in
`docs/API.md`. No requests are made yet.

Keep this frontend disconnected during Phase 1 investor review. Revise screens, local fixtures,
and simulated flows here while the API is developed/tested separately. Wiring requires an
explicit instruction to connect; it is not a follow-up to this documentation review.

Planning documents live in `docs/` (product plan, architecture, API, database, setup).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also rebuilds the icon sprite)
```

`predev` / `prebuild` run `app/icons/build-icons.js`, which turns the SVGs in
`app/icons/src/` into `public/icons/sprite.svg` and the typed icon list in
`app/data/ui/icons.ts`. Add an SVG there to get a new `MIcon` name.

## Structure

```text
app/
  assets/scss/          base/ partials (tokens, reset, type, layout) + _component.scss (every m-* style)
  components/
    base/               M* primitives — auto-imported (MButton, MInput, MModal, MTable…)
    core/               composed UI shared across features (cards, search, inquiry form, inbox, stats…)
    layout/             Header, Footer, Logo, panel/ Sidebar + Topbar
    features/<page>/    page sections; each Index.vue composes its sections
  composables/          useModal, useCanonical, features/directory/useDirectoryQuery
  stores/               Pinia data layer: app/session + features/{catalog,directory,dashboard,admin,onboarding}
  data/features/        seed records the stores answer from, plus static page copy (site, home, about, legal, pricing)
  layouts/              default · auth · dashboard · admin
  pages/                route files: pick the feature, set meta, load data, pass props
  types/                api/ · app/ · base/ · features/
  utils/                labels (enum → text/tone/icon) and formatters
```

Browse `/styleguide` (noindex) for every base and core component with its variants.

For investors and other reviewers, `/static/guide` covers the business (the goal, who it serves,
the business model, growth, roadmap and risks, from the brief and `docs/PLAN.md`), then how the
static demo works, with four guided tours. `/static/sitemap` lists every screen with a link to each
of its states. Both are noindex and not linked from the site's menus, so share the URL directly.
Their copy lives in `app/data/features/guide.ts` and `sitemap.ts`: update the sitemap when you add
a route or a `?state=` preview, and the guide when the plan changes.

## Routes

| Area | Routes |
| --- | --- |
| Public | `/` `/find` `/companies` `/companies/[slug]` `/professionals` `/professionals/[slug]` `/services` `/industries` `/locations` `/pricing` `/contact` `/about` `/terms` `/privacy` |
| Onboarding | `/claim` `/claim/[token]` `/invitations/[token]` |
| Auth | `/login` `/login/verify` `/register` `/forgot-password` `/reset-password` `/onboarding` |
| Company + sales dashboard | `/dashboard` `/dashboard/profile` `/dashboard/inquiries` `/dashboard/stats` `/dashboard/account` `/dashboard/companies/[companyId]` (+ `/services` `/locations` `/team` `/team/[professionalId]` `/inquiries` `/stats`) |
| Platform admin | `/admin` `/admin/companies` `/admin/companies/[id]` `/admin/professionals` `/admin/professionals/[id]` `/admin/claims` `/admin/inquiries` `/admin/users` `/admin/taxonomies/[taxonomy]` `/admin/locations` |
| Demo reference (noindex) | `/static/guide` `/static/sitemap` (`/static` redirects to the guide) `/styleguide` |

Screens with several states take a `state` prop that the page reads from `?state=` while the
UI is static — for example `/find?state=error`, `/login?state=verify`, `/login?state=linked`,
`/login/verify?account=new`, `/onboarding?state=pending`, `/claim/any-token?state=invalid` and
`/dashboard/account?google=stale`. When the API is connected, the page derives the state from
responses instead.

Google sign-in is a Laravel browser redirect (`/auth/google/redirect` → Google → callback →
`/login/verify`). The static button goes straight to `/login/verify`; from the register page it
previews a first-time account, which continues to `/onboarding`.

## Wiring the API later

The independent Phase 1 catalog changes are implemented: pricing and admin plan choices read the local catalog, and unknown plan codes have display fallbacks. Open `/pricing?state=expanded` for a six-tier mock preview; the default pricing page still shows the three initial tiers. Missing feature comparisons say `Ask us` rather than promise benefits. Run `npm run test:plans` with Node 22.18+ or Node 24+ to check these behaviors using Node's built-in test runner.

This section is future guidance only. Do not apply it during the current investor-review track.

- Every API-shaped read goes through a store (`app/stores/README.md`). Wiring the API means
  changing the stores' members to call the typed client — pages and components already use the
  stores and receive API-shaped props.
- `useSessionStore` stands in for `GET /api/me`; `useDirectoryStore` for `GET /api/companies`,
  `/api/companies/{slug}`, `/api/professionals` and `/api/professionals/{slug}`.
- Forms emit API-shaped payloads (see `types/features/inquiry.ts`) and currently fake success.
- Add route middleware (`app/middleware/README.md`) and a session store when auth is live.

## Conventions

Follows `myblog/PROMPT.md`: BEM blocks named after the component file, scoped SCSS in every
section, tokens only (no hex in components), `block > .wrapper > .block__con` section markup,
snake_case locals, typed props with `withDefaults`. Headings are `MHeading` and paragraphs are
`MText`, sized from the type scale in `base/_typography.scss`, not with scoped font sizes.
Types live in `app/types/`, never in data or component files.
