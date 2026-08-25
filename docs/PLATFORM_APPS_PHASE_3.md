# PiHub Platform Apps Phase 3

## Status

Phase 3 turns the previously reserved application boundaries into real frontend applications for Borrower, Advisory, Admin, and the Access gateway. The existing Investor app remains the production safety anchor under `/app` and its root Vercel contract is intentionally unchanged.

## Application ownership

| Application | Role | Primary ownership |
| --- | --- | --- |
| Investor | Business module | Opportunity review, underwriting, investment/credit decisions, commitments, portfolio monitoring |
| Borrower | Business module | Financing request, organization/project information, documents, PiHub requests, progress and closing |
| Advisory | Business module | Mandates, transaction pipeline, structuring, counterparties, due diligence and execution |
| Admin | Supporting application | Organizations, users/roles, compliance, authorization policy context, audit and platform governance |
| Access | Supporting application | Safe workspace discovery and future shared-session entry |

Admin and Access are not additional business modules. The business model remains Borrower + Investor + Advisory.

## Isolation contract

- Each application has its own package, entry point, route tree, build, test suite and Vercel configuration.
- New applications can import stable code from `packages/*` but do not import screens or implementation code from another application.
- New applications do not import the legacy Investor `/app` implementation.
- Shared packages do not import applications.
- Cross-application navigation uses absolute application origins only.
- The root Investor Vercel contract remains `npm ci --prefix app --legacy-peer-deps` -> `npm --prefix app run build` -> `app/dist` until the dedicated Investor parity migration is approved.

## Shared source of truth

The first shared packages now contain executable code:

- `packages/platform` owns application metadata and demo-session helpers.
- `packages/domain` owns shared demo deal, document, organization, user, compliance and audit records.
- `packages/ui` owns the common platform visual system and responsive shell styles.

The shared demo deal demonstrates how Borrower and Advisory can present different workflows around the same deal identity without copying another application's UI.

## Authentication truth

The new applications include explicit browser-local demo sign-in so their frontend journeys can be exercised independently. This is not production SSO and is not represented as such.

Production cross-application authentication remains backend-dependent and requires:

- API-managed secure sessions or an equivalent approved SSO/token-exchange design;
- HttpOnly/Secure cookie or short-lived authorization-code handling as appropriate;
- server-side module/action/record authorization;
- expiry/revocation and CSRF controls where required;
- allowlisted PiHub return origins;
- immutable audit events for access and governance changes.

Browser tokens must never be copied between applications through query strings or local-storage tricks.

## Build orchestration

The repository now has a root npm workspace manifest for Borrower, Advisory, Admin and Access plus a pinned Turborepo task graph. Investor is deliberately excluded from this root workspace during Phase 3 so its known-good package-lock and Vercel installation path are not changed as a side effect.

Turborepo orchestrates `build` and `test:unit` across the new applications. Shared package source is declared as a global dependency so a shared UI/platform/domain change invalidates the affected application tasks.

## Deployment model

Each new application is prepared for its own Vercel project and production origin:

- Borrower -> `borrower.pihub-pi.com`
- Advisory -> `advisory.pihub-pi.com`
- Admin -> `admin.pihub-pi.com`
- Access -> `access.pihub-pi.com`

A code-complete application is not called production-live until its independent Vercel project/origin has been linked and the exact deployed revision is verified.

## Next backend work

The frontend suite makes the module boundaries and workflows concrete, but financial/compliance truth must move to shared server contracts. The next hard dependencies are secure session/SSO, server RBAC, canonical deal/document APIs, workflow/event persistence, file storage/versioning, and immutable audit history.
