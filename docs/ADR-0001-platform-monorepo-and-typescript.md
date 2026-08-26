# ADR-0001: PiHub platform monorepo and TypeScript direction

- **Status:** Accepted
- **Date:** 2026-08-26
- **Scope:** Investor, Borrower, Advisory, Admin and Access

## Context

PiHub contains three independently deployable business applications plus a supporting Admin control plane and central Access surface. The applications must share design primitives, identity contracts, domain records and release standards without becoming one oversized SPA or importing one another's implementation code.

The mature Investor application is already production-tested. A framework rewrite would combine product expansion, authentication migration, visual-system migration and runtime migration in one blast radius. That is not a sensible way to make a financial platform more dependable.

## Decision

1. Keep one repository with independently deployable React/Vite applications.
2. Use npm workspaces and a pinned Turborepo task graph for affected builds and tests.
3. Make **TypeScript the required language for new shared contracts, domain services, API clients and newly created features**.
4. Migrate legacy Investor JavaScript incrementally behind existing tests. Do not perform a big-bang rewrite.
5. Maintain strict dependency direction:
   - applications may import shared packages;
   - shared packages never import applications;
   - applications never import one another.
6. Keep Investor as the UI source of truth through `@pihub/ui`.
7. Use one modular backend first, implemented in TypeScript with PostgreSQL, rather than premature microservices.
8. Require backend-enforced RBAC/ABAC, canonical deal/document/workflow records, optimistic concurrency, immutable audit events and a transactional outbox for cross-module effects.

## Target structure

```text
app/                 # existing Investor production application
apps/
  borrower/
  advisory/
  admin/
  access/
packages/
  ui/                # tokens, shell, primitives, motion and accessibility
  domain/            # domain rules and demo fixtures
  contracts/         # TypeScript API/event contracts
  platform/          # routing, auth/session and workflow handoffs
  api-client/        # generated production clients (next phase)
  auth/              # shared identity contracts (next phase)
  testing/           # shared fixtures and test helpers (next phase)
```

## UI contract

Independent applications import one Investor-derived stylesheet entrypoint and use shared shell/account/primitives. Module CSS may describe only role-specific workflow composition. It may not redefine global tokens, typography, navigation, forms, tables, account menus or breakpoints.

## Workflow contract

A material feature is complete only when it defines its initiating actor, canonical entity, state transition, downstream module visibility, next owner, terminal state, recovery behavior and audit event. Frontend demo handoffs may prove this lifecycle, but production data synchronization belongs to the shared API and database.

## Motion and visual effects

PiHub uses restrained corporate motion for feedback and orientation. GSAP timelines must be lifecycle-safe, interruptible and reduced-motion aware. Three.js is limited to non-blocking authentication/brand atmosphere with a static fallback. Operational financial screens do not gain clarity from decorative WebGL.

## Consequences

- Shared visual drift becomes an architecture failure, not subjective polish.
- Each module can deploy independently while retaining one design and domain language.
- Existing Investor reliability is preserved during migration.
- A root lockfile and package-name imports remain a follow-up once the existing Vercel install contract can be migrated safely.
- Production cross-module behavior remains blocked until the shared backend contracts are implemented.
