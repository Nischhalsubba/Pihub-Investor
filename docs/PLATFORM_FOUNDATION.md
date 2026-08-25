# PiHub Platform Foundation

## Purpose

Evolve the verified Investor application into a three-module PiHub Platform without breaking the current production deployment.

Primary business modules:
1. Borrower / Origination
2. Investor / Lender
3. Advisory / Structuring

Admin / Compliance is a shared platform capability rather than a fourth business module.

## Phase 1 safety contract

The first platform change is deliberately compatibility-first:

- `/app` remains the production Investor application.
- Root `vercel.json` remains unchanged.
- Vercel continues to install `app/package-lock.json`, build `/app`, and serve `app/dist`.
- The existing GitHub Actions quality workflow remains rooted in `/app`.
- `apps/borrower`, `apps/advisory`, `apps/admin`, and future shared packages are not production build targets yet.
- No future module is shown in the UI until both server-authorized access and a real application location exist.
- Every cutover step gets its own PR, quality run, Vercel preview/status check and rollback point.

## Phase 1 implementation

The existing Investor shell now contains a platform-aware module registry and an accessible module-switcher component. In the current deployment only Investor has a configured application location, so the switcher renders nothing and the visible production UI remains unchanged.

The root repository now also reserves future `apps/*` and `packages/*` boundaries with README contracts. These directories are scaffolding only; they do not affect the Vercel build.

## Migration sequence

### Phase 2: workspace orchestration
Introduce the root workspace/Turborepo task graph and affected-package CI while leaving `/app` as the production target.

### Phase 3: Investor parity migration
Create `apps/investor`, prove equivalent build output and complete browser/accessibility/visual parity, then change Vercel's build root in a dedicated cutover PR only after the preview is green.

### Phase 4: Borrower vertical slice
Implement a guided financing-request journey against shared domain/API contracts.

### Phase 5: Advisory vertical slice
Implement mandate/transaction structuring and execution against the same shared deal records.

## Rollback rule

Until the explicit Investor cutover, rollback is trivial because production continues to use the known `/app` path. After cutover, retain the previous successful Vercel deployment and production commit as the rollback target.
