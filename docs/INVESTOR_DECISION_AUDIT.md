# Investor decision evidence and UI audit protocol

> Status: contributor review checklist, not a claim that the product has passed an audit. This document introduces review expectations; it does not change application behavior.

## Why this exists

Keep investor workflows traceable, access-controlled and candid about uncertainty throughout opportunity review and portfolio tracking.

## Review rules

1. Separate disclosed issuer facts from computed estimates, user preferences and external assumptions. Every return, yield, status and fee claim needs an as-of date and computation/source.
2. Confirm that opportunity discovery, details, investment requests and portfolio summaries show the same identifiers, currency, units and state. Never infer acceptance, funding or settlement from a click alone.
3. Validate access by role and relationship: routes, API boundaries and deep links must not disclose another investor's files or transactions.
4. Record disclosure acknowledgements and consent boundaries; avoid prechecked financial consent and unexplained irreversible actions.
5. Review loading, stale-data, empty, denied, partially fulfilled and rejected states, plus keyboard and small-screen navigation.

## Verification

From `app/` run `npm run check:styles`, `npm run check:i18n`, `npm run check:platform`, `npm run test:unit`, `npm run build` and when browser behavior changes `npm run test:e2e`. These checks do not substitute for authorization or financial-domain review.

## Required evidence in a change request

PR: impacted investor journeys, data contracts, role matrix, example numeric calculation, screenshot/state matrix, test results, unresolved policy questions and owner signoff.

## Rollback and incident response

Restore the previous visible information state, preserve request/audit history and disable an affected action rather than manufacturing a transaction status.

## Acceptance criteria

- [ ] The change addresses a stated user or maintainer risk.
- [ ] Evidence and source-of-truth references are attached or explicitly marked unavailable.
- [ ] Relevant automated checks are reported with actual outcomes; unrun checks are not marked passing.
- [ ] Negative, failure and recovery states are accounted for.
- [ ] A reviewer can understand what changed, remaining risk and how to revert it.

Document owner: repository maintainers. Review this checklist when workflows, dependencies or public claims materially change.
