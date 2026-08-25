# PiHub platform routing and application isolation

## Purpose

PiHub is one product platform, but Borrower, Investor and Advisory must remain independent applications. Sharing one Git repository must never allow one module to claim another module's routes, depend on another application's private implementation, or force an unrelated production release.

This document is the routing and dependency contract for that architecture.

## Target application origins

The preferred long-term topology is separate origins behind one PiHub domain family:

| Surface | Target origin | Responsibility |
| --- | --- | --- |
| Access | `https://access.pihub-pi.com` | Shared entry point and future authentication/session handoff |
| Investor | `https://investor.pihub-pi.com` | Capital-provider, underwriting and portfolio workflows |
| Borrower | `https://borrower.pihub-pi.com` | Financing application, documents and borrower progress |
| Advisory | `https://advisory.pihub-pi.com` | Mandates, structuring, counterparties and execution |
| Admin | `https://admin.pihub-pi.com` | Platform administration, compliance and governance |
| API | `https://api.pihub-pi.com` | Shared server-authorized business/domain APIs |

These are target origins, not a claim that every application or DNS record is already live.

## Why separate origins

Each application owns its own router. Investor must not mount `/borrower/*`, `/advisory/*` or `/admin/*` inside the Investor SPA. A failure or route change in one application therefore cannot accidentally shadow another module.

Cross-module navigation is a normal browser navigation to an allowlisted HTTP(S) origin. React Router remains responsible only for routes inside the current application.

```text
access.pihub-pi.com
        |
        +--> investor.pihub-pi.com   own router / build / release
        +--> borrower.pihub-pi.com   own router / build / release
        +--> advisory.pihub-pi.com   own router / build / release
        +--> admin.pihub-pi.com      own router / build / release
                         |
                         +--> shared API/domain services
```

## Current compatibility state

Investor is still the only production application. Its verified Vercel contract remains:

```text
source       /app
install      npm ci --prefix app --legacy-peer-deps
build        npm --prefix app run build
output       app/dist
```

Phase 2 must not change that contract.

The shared access selector can expose `/login/borrower` and `/login/advisory` as **selection/status routes only** while those applications do not exist. Those pages do not mount Borrower or Advisory product routes and do not accept credentials for those modules.

When a future application gets a configured absolute origin, the selector navigates to that application's own `/login` instead.

## Runtime module registry

Application locations are deployment configuration, not hardcoded route guesses:

| Variable | Meaning |
| --- | --- |
| `REACT_APP_PIHUB_MODULE_ID` | Identity of the currently built app; Investor defaults to `investor` |
| `REACT_APP_INVESTOR_APP_URL` | External Investor origin when referenced from another PiHub app |
| `REACT_APP_BORROWER_APP_URL` | External Borrower origin |
| `REACT_APP_ADVISORY_APP_URL` | External Advisory origin |

The current application always uses local routes internally even if its own public URL is configured. Other modules are considered navigable only when their configured location is an absolute `http://` or `https://` origin.

Relative cross-module locations such as `/borrower` are deliberately rejected.

## URL ownership rules

### Investor application

Investor owns its existing business URLs such as:

- `/dashboard`
- `/products`
- `/opportunities/*`
- `/credit-request`
- `/credit-requests/*`
- `/products-invested`
- `/positions/*`
- `/user/*`

It does **not** own these application roots:

- `/borrower/*`
- `/advisory/*`
- `/admin/*`
- `/access/*`

`/login/:moduleId` is a temporary access-selection route, not a module product namespace.

### Future applications

Each future app may define its own internal route tree under its own origin. No application should need another application's router to resolve a business page.

## Source-code dependency rules

The dependency direction is intentionally one-way:

```text
apps/investor  ----+
apps/borrower  ----+----> packages/*
apps/advisory  ----+
apps/admin     ----+
apps/access    ----+

packages/*     -X-> apps/*
apps/A         -X-> apps/B
future apps    -X-> legacy /app
legacy /app    -X-> future apps
```

Allowed:

- applications importing stable shared packages;
- shared packages importing other shared packages according to their documented dependency graph;
- applications calling shared APIs through shared clients/contracts.

Forbidden:

- Borrower importing Investor components;
- Advisory importing Borrower state/actions;
- any shared package importing an app;
- future apps importing code directly from the legacy `/app` directory;
- the legacy Investor app importing future `apps/*` implementation code.

The CI command `npm run check:platform` scans source imports and Investor route declarations and fails when these rules are violated.

## Authentication boundary

The current Investor implementation still stores its legacy session token on the Investor origin. Browser storage does not safely become shared authentication merely because the applications are in one repository.

Therefore:

1. credentials are accepted only by the current application's real login;
2. an undeployed module never pretends to authenticate;
3. tokens are never placed in query strings or copied between origins;
4. future shared sign-in should use an API-managed secure session/SSO contract with server-authorized module access;
5. backend authorization remains authoritative for organization, module, action and record scope.

A module selector is navigation, not authorization.

## Vercel isolation model

The target deployment model is one Vercel project per deployable application, all sourced from the same repository:

```text
PiHub repository
  |
  +-- Investor Vercel project  -> apps/investor   (after dedicated cutover)
  +-- Borrower Vercel project  -> apps/borrower
  +-- Advisory Vercel project  -> apps/advisory
  +-- Admin Vercel project     -> apps/admin
  +-- Access Vercel project    -> apps/access
```

Each project gets its own root directory, environment variables, preview deployments, production alias and rollback history. A Borrower failure must not replace the Investor production artifact.

Until the Investor cutover is proven, the existing Vercel project remains on `/app`.

## CI and future Turborepo adoption

Phase 2 adds dependency/route boundary checks to the existing Investor CI without changing dependency installation or the Vercel build.

Turborepo should be introduced when the second real application has its own package manifest. At that point the migration can atomically add:

- root workspace package metadata and one deterministic lockfile;
- `turbo.json` task graph;
- application/shared-package dependency declarations;
- `turbo boundaries` rules;
- affected-package build/test execution;
- remote caching if useful.

Adding Turborepo before real workspaces exist would add deployment risk without providing isolation or caching value.

## Failure containment

If a future module is unhealthy:

- remove or disable its configured application URL;
- the Investor build continues to use local routes;
- Investor does not import the failing module;
- Vercel can roll back the affected application independently;
- shared-package changes still require regression testing across every dependent application.

## Migration sequence

1. Keep current Investor Vercel contract green.
2. Enforce route and import boundaries in CI.
3. Make the login screen platform-aware without authenticating undeployed modules.
4. Build Borrower as the first independent application in `apps/borrower`.
5. Introduce the real root workspace/Turborepo graph with Borrower and Investor represented as packages.
6. Give Borrower its own Vercel project and origin.
7. Repeat the pattern for Advisory, Admin and Access.
8. Move legacy Investor from `/app` to `apps/investor` only in a dedicated parity/cutover release.
9. Replace origin-local legacy token behavior with the approved shared secure-session contract.

## Non-negotiable release rule

No application-root, Vercel-root, authentication-boundary or shared-package change is considered complete until its affected app tests pass and the exact deployed commit is verified. Repository convenience never outranks application isolation.
