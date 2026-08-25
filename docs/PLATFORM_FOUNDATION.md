# PiHub Platform Foundation

## Purpose

Evolve the verified Investor application into a three-module PiHub Platform without breaking the current production deployment.

Primary business modules:
1. Borrower / Origination
2. Investor / Lender
3. Advisory / Structuring

Admin / Compliance is a shared platform capability rather than a fourth business module. Access is a shared entry/authentication surface rather than a business module.

## Production safety contract

The platform migration remains compatibility-first:

- `/app` remains the production Investor application until a dedicated Investor cutover release.
- Root `vercel.json` keeps the verified `/app` install/build/output contract during the routing-isolation phase.
- The existing GitHub Actions quality workflow remains rooted in `/app` while Investor is the only production application.
- `apps/borrower`, `apps/advisory`, `apps/admin`, `apps/access`, and shared packages are not production build targets until they contain real independently deployable applications.
- A future module is not presented as a working sign-in destination until it has its own configured application origin.
- Every cutover step gets its own PR, quality run, Vercel status check and rollback point.

## Phase 1 — platform-aware shell: complete

The Investor shell gained a platform module registry, permission-aware module switcher and reserved `apps/*` / `packages/*` boundaries without moving the production build.

## Phase 2 — routing and application isolation

Phase 2 makes the boundaries enforceable before a second application is built:

- each module owns a separate application origin;
- Investor never mounts Borrower, Advisory, Admin or Access product namespaces;
- cross-module navigation uses an allowlisted absolute HTTP(S) application origin;
- relative cross-module route overrides are rejected;
- login can display module context without pretending an undeployed module can authenticate;
- CI scans imports and route declarations to prevent application-to-application coupling;
- current Investor Vercel install/build/output behavior remains unchanged.

See `docs/PLATFORM_ROUTING_AND_ISOLATION.md` for the full URL, authentication, source-dependency and deployment contract.

## Migration sequence

### Phase 3: Borrower application foundation
Create the first real independent application in `apps/borrower` with its own package manifest, router, tests and deployment contract. It consumes only stable shared packages/contracts.

### Phase 4: root workspace and Turborepo
Once Investor and Borrower are represented by real package boundaries, introduce the root workspace, deterministic shared lockfile, Turborepo task graph, dependency-boundary rules, affected-package CI and optional remote caching. Doing this after the second real package exists avoids adding a build orchestrator that has nothing useful to orchestrate.

### Phase 5: Borrower deployment
Give Borrower its own Vercel project/origin, verify its exact deployment, then configure the Investor/access module registry to navigate to that origin.

### Phase 6: Advisory, Admin and Access
Repeat the independent-app pattern for Advisory and supporting surfaces. Shared authentication is introduced only with an approved server session/SSO contract.

### Phase 7: Investor parity migration
Move the existing Investor application from `/app` into `apps/investor` only after equivalent build output, routes, browser behavior, accessibility, responsive geometry and visual regression are proven. Change Vercel's root/build path in a dedicated cutover PR.

## Rollback rule

Until the explicit Investor cutover, Investor rollback stays simple because production continues to use `/app`. A failed future application can be removed from module-location configuration without importing, routing through or redeploying Investor. After each application cutover, retain its previous successful Vercel deployment and exact production commit as the rollback target.
