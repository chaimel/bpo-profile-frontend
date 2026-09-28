# Route middleware

Empty while the UI is static. When the API is wired up, add:

- `auth` — protected `/dashboard/**` routes: load `GET /api/me` in the browser and send
  signed-out visitors to `/login` with a redirect back.
- `guest` — `/login` and `/register`: send an existing session to the dashboard.
- `admin` — `/admin/**`: require `platform_role = admin`.

Middleware only hides screens. Laravel still authorizes every request
(docs/ARCHITECTURE.md §5).
