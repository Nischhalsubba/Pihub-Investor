# PiHub Figma Flow Implementation

## Decision

The legacy PiHub Figma file `HILxD1DKnfALKo4Q5L1IfE` is a **functional and workflow reference**, not the production visual source of truth.

The current Investor application and `packages/ui` remain authoritative for typography, color, spacing, navigation, header utilities, cards, forms, tables, account menus, responsive behavior, accessibility and motion.

This prevents a legacy screen collection from reintroducing a second visual system while still recovering the business capabilities and workflow states documented in the original product design.

## Creditor / Borrower mapping

| Figma node | Functional intent | Current implementation |
| --- | --- | --- |
| `2:8777` Corporate Information | borrower profile, financing need, collateral, NDA, ratings, corporate documents | `apps/borrower/src/CorporateInformation.jsx` |
| `2:9172` Search Field | search by credit type, amount, industry, deadline and term | `apps/borrower/src/ProductMarketplace.jsx` |
| `2:9380` Search Result | financing product search results | `apps/borrower/src/ProductMarketplace.jsx` |
| `2:9253` Product view all | browse all financing products | `apps/borrower/src/ProductMarketplace.jsx` |
| `2:9547` Product Single (on halt) | detailed product terms and product availability state | `apps/borrower/src/ProductDetail.jsx` |
| `2:9046` Product Applied | product detail after an application has been started | `apps/borrower/src/ProductDetail.jsx` + current application state |
| `2:9102` Products I applied for | application history and status | `apps/borrower/src/Applications.jsx` |
| `2:9611` legacy Creditor signup | account creation / onboarding | superseded by the single central PiHub access contract and Admin-governed account request/provisioning flow |
| `2:9587` legacy Creditor sign-in | authentication | superseded by the single central PiHub login surface; module-owned credential forms remain forbidden |

### Borrower lifecycle

`Financing products -> Product detail -> New application -> Corporate information -> Financing request -> Project -> Financials -> Documents / requests -> Submit -> Advisory -> Investor decision -> Admin compliance -> Funding / closing`

The browser-local demo persists the owning application's form state and uses the canonical PiHub workflow handoff for cross-application continuation. Production persistence and authorization remain server-owned requirements.

## Investor mapping

Investor Figma screens are treated as historical functional references only. The production Investor implementation already contains the newer PiHub design system and richer opportunity/product workflows.

The current `OpportunityForm` already covers the core legacy product-creation intent: product title, geography, industry/service, credit amounts, duration, collateral, ratings and attachments. Investor is therefore **not visually rewritten from legacy Figma**.

Any recovered Investor capability must be implemented using the current Investor components and existing route contracts, not copied from the old Figma chrome.

## Admin mapping

The old Admin design groups platform operations into Investor accounts, Creditor accounts, request queues and reference-data settings. Those functions are implemented as first-class routes inside the current Investor-derived Admin shell.

| Legacy functional area | Current implementation |
| --- | --- |
| Investor accounts | `/investor-accounts` via `Operations.jsx` |
| Borrower/Creditor accounts | `/borrower-accounts` via `Operations.jsx` |
| Add new account | `/accounts/new` via `AccountCreate.jsx` |
| Account requests / approvals | `/account-requests` via `Operations.jsx` |
| Product catalog governance | `/products` via `AdminCatalog.jsx` |
| Product requests | `/product-requests` via `Operations.jsx` |
| Credit requests | `/credit-requests` via `Operations.jsx` |
| Email templates | `/settings/email-templates` via `EmailTemplates.jsx` |
| State / County | `/settings/geography` via `ReferenceData.jsx` |
| Services | `/settings/services` via `ReferenceData.jsx` |
| Industries | `/settings/industries` via `ReferenceData.jsx` |
| Ratings | `/settings/ratings` via `ReferenceData.jsx` |
| 404 / recovery | `NotFound.jsx` |
| Modern governance | Organizations, Users & roles, Compliance, Access policies, Audit and Platform routes remain retained |

## Shared design contract

All independent applications continue to consume the Investor-derived shared UI rather than the legacy Figma visual language.

Required platform properties:

- IBM Plex Sans / IBM Plex Mono typography.
- Midnight navigation and cobalt action color.
- Shared Investor-style header utilities and account menu.
- Consistent 44px minimum interaction targets.
- Border-first financial surfaces and restrained elevation.
- Explicit loading, empty, error, success and disabled states.
- Keyboard and reduced-motion behavior.
- Responsive layouts without page-level horizontal overflow.
- No module-specific fallback login screens.

## Production boundary

The current applications are separate Vercel origins. Browser `localStorage` cannot provide durable, automatic cross-origin synchronization. The demo proves workflow shape and canonical identifiers; production implementation still requires shared server authentication, authorization, canonical deal/product/account APIs and durable audit/event persistence.

No URL handoff may include passwords, authentication tokens or private personal data.
