# UI preview (dev-only)

Quick visual-validation harness for login UI components that are otherwise hard
to see in isolation (they normally require a configured ZITADEL backend with
matching identity providers). Currently covers the **branded IdP buttons**
(`src/components/idps/sign-in-with-generic.tsx`).

## Why this exists

The generic IdP buttons only appear in the real login when the backend returns
OAuth/OIDC/SAML/LDAP/JWT providers, and the brand glyphs only show when a
provider's display name matches `BRAND_ICONS`. Standing up a backend with
correctly-named providers just to eyeball a button is slow, so this route
renders the component directly — no backend, light + dark side by side.

## Run it

```bash
pnpm ui-preview
```

This single command (via `start-server-and-test`, with env from `.env.preview`
injected by `env-cmd` so it works in cmd.exe / PowerShell / bash alike):

1. starts `next dev` on port 3100 with a placeholder `ZITADEL_API_URL` (the
   middleware in `src/proxy.ts` throws without it),
2. waits for `/preview-idps` to respond,
3. writes a full-page screenshot to `screenshots/idp-brands.png` (gitignored),
4. tears the dev server down again.

To click around live instead, run `pnpm ui-preview:serve` and open
<http://127.0.0.1:3100/preview-idps>.

## Production safety

`preview-idps/page.tsx` calls `notFound()` when `NODE_ENV=production`, so the
deployed login returns **404** for this route — it is never publicly reachable.
Set `ENABLE_UI_PREVIEW=true` only if you deliberately need it against a prod
build (e.g. CI screenshots).

## Adding another component

Add a sibling route under `(preview)/` and a matching list/grid in a client
component. The `(preview)` route group has its own minimal root layout that
deliberately avoids the backend-dependent `(login)` layout.
