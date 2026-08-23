# Backend / UI contract gaps

The frontend remediation deliberately does not invent financial data or security guarantees the current API does not expose. These gaps must be resolved at the API/session layer before the related experience can be considered complete end-to-end.

## Authentication/session security

The frontend now removes persistent bearer-token storage and clears sessions on 401. The complete target is an API-issued session cookie with:

- `HttpOnly`
- `Secure`
- an appropriate `SameSite` policy
- server-side expiry/revocation
- CSRF protection where required by the chosen cookie policy

Until that contract exists, the browser still possesses a bearer credential during the active tab session and therefore cannot make an XSS-compromised page safe by itself.

## Credit decision queue

The UI can prioritize visible requests with data it actually receives. For professional triage and audited bulk operations, the list/detail API should expose:

- `requested_amount`
- normalized risk/rating summary
- decision owner/assignee
- SLA / due-at timestamp separate from business payment dates
- decision history with actor/timestamp/reason
- version/etag or equivalent concurrency guard
- server-authorized bulk decision endpoint if bulk approve/reject is required

The frontend does not fabricate owner, risk or SLA values when absent. Missing values are labelled as not supplied.

## Invested positions

The current client can derive contractual maturity from invested date plus tenor and can compute concentration from visible invested amounts. True portfolio monitoring requires explicit API fields such as:

- contractual maturity date
- current carrying/market value
- yield / return measure and definition
- next payment/event date and type
- counterparty identifier
- normalized risk/rating
- industry/geography classification
- repayment/default/watchlist state
- currency if multi-currency positions are introduced

Derived values in the UI are labelled as derived and must not be confused with accounting or valuation data.

## Institution governance

The profile surface can display governance data when present. A complete enterprise profile contract should provide:

- stable institution/legal-entity identifier
- roles and permissions
- compliance/KYC status and review timestamps
- verification/compliance documents and lifecycle
- active session/security-session metadata
- audit history with actor/timestamp/action
- account/security review timestamps

Missing governance fields are rendered as `Not supplied`; the frontend does not synthesize compliance facts.

## Large datasets

Current sorting/export in the transitional UI is explicitly scoped to the visible fetched page. For complete books, the API should support:

- server-side sort field + direction
- server-side search/filter semantics
- stable pagination/cursor contract
- total counts by active filter
- export job/endpoint for the full filtered dataset
- saved-view persistence at account level if views need to roam across devices

When these endpoints exist, client-side page sorting/export can be replaced without changing the visible interaction model.
