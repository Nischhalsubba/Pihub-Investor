# Remediation Batch A — Routing, resilience and accessibility

This batch is the first reviewable slice of the 79-finding remediation epic (#1). It deliberately avoids a visual rewrite of the opportunity/profile forms; those are isolated into Batch B so routing and error recovery can be reviewed independently.

## Addressed in this batch

- Durable, refresh-safe canonical entity URLs:
  - `/opportunities/:productId`
  - `/opportunities/:productId/edit`
  - `/credit-requests/:productId/:applicationId`
  - `/positions/:productId/:applicationId`
- Legacy state-based URLs continue to work and migrate to canonical URLs.
- Opportunity search/status/page state is persisted in the URL and survives browser back/forward.
- Route-level lazy loading is enabled.
- A real authenticated 404 route is enabled.
- Route changes restore focus to main content; the existing skip link remains the keyboard entry point.
- Entity routes receive an explicit back path through the shared page header.
- Async failures no longer disappear into the console for products, credit requests, positions and profile reads; a global recovery banner exposes retry/dismiss actions.
- Axios query params are used for live API traffic. The legacy in-browser demo adapter keeps URL parsing temporarily and is removed in Batch D.
- Product FormData serialization is centralized, eliminating duplicated side-effect `.map()` loops in product actions.
- Profile FormData side effects are converted to `forEach` and error reporting is normalized.
- Session bearer tokens are no longer persisted across browser restarts. A one-time migration moves existing `localStorage` tokens to `sessionStorage`, and 401 responses clear the session.
- Auth/session helper coverage is expanded.

## Deliberately deferred to Batch B

The current Edit Opportunity form contains an unnamed Redux Form field that historically created a property literally named `undefined`. Batch A preserves that compatibility value to avoid a data-loss regression. Batch B replaces the Add/Edit form implementation and removes the compatibility key permanently.

## Security note

Moving a bearer credential from persistent `localStorage` to `sessionStorage` reduces persistence but does **not** make a bearer token immune to XSS. The complete C25 remediation requires the API to issue an HttpOnly + Secure + SameSite session cookie. That backend dependency is tracked in the final platform contract rather than being falsely claimed as a frontend-only fix.

## Verification target

- unit tests pass;
- production build succeeds;
- Vercel preview succeeds;
- canonical entity URL survives refresh;
- browser back/forward restores opportunity query state;
- unknown authenticated route renders the 404 state;
- 401 clears the client session and returns to sign-in;
- reduced motion loses no information (no new decorative motion is introduced in this batch).
