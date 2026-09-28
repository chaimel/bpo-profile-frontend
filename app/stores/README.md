# Stores

Pinia stores are the data layer. Pages, layouts and components read API-shaped data only through
them. They never import `~/data/features/*` for it.

```text
stores/
  app/session.ts         useSessionStore     GET /api/me (the signed-in user) + dashboard/admin nav
  features/catalog.ts    useCatalogStore     taxonomies, location tree, time zones, plans (docs/API.md §2)
  features/directory.ts  useDirectoryStore   company + professional cards, profiles, search, counts (§3–4)
  features/dashboard.ts  useDashboardStore   company + sales dashboards, teams, inboxes, stats (§5–6)
  features/admin.ts      useAdminStore       platform admin lists, details, publication checks (§8)
  features/onboarding.ts useOnboardingStore  login challenges, onboarding account, claim/invitation results (§1, §7)
```

Stores are auto-imported (`pinia.storesDirs: ['stores/**']` in `nuxt.config.ts`). Use them like this:

```ts
const { findCompany } = useDirectoryStore()
```

While the UI is static, each store answers from the seed records in `~/data/features/`, which stand
in for the Laravel API. When the API is wired up, only the store changes: its members call the typed
client and keep fetched results as state. Catalog and seed collections are plain members rather than
state, so SSR doesn't serialize them into every page.

Static copy that isn't an API response stays in `~/data/`, and features import it directly:
`site`, `home`, `about`, `legal`, the pricing copy, and the UI mappings `taxonomyLabels`,
`serviceIcons`, `industryIcons`, `authPolicy` and `googleSignIn`.
