# Remediation Batch C — Decision workflows and investor analytics

This batch turns the visual foundation into a decision-oriented investor workspace. It intentionally uses only fields available from the current API and labels derived or missing data rather than inventing finance semantics.

## Overview

- `/` and `/dashboard` now open a real investor overview.
- The overview prioritizes pending decisions, near/overdue deadlines, deployed visible capital and the next derived maturity.
- Direct task links take users to the decision queue, opportunity book, invested positions or new-opportunity workflow.

## Opportunities

- Search/status/page/sort state is represented in the URL.
- Column headers are sortable for the fetched page with explicit sort direction.
- Clear-filter state and active-filter count are visible.
- Users can persist local saved views and column visibility.
- Visible results can be exported as CSV.
- The inspector is reduced to screening facts not already shown in the row: minimum creditor sales, collateral, ratings/document counts and geographic coverage.
- Sorting/export explicitly state that they apply to the fetched page until the API provides full-book sort/export semantics.

## Credit requests

- The duplicate Queue intelligence rail is removed.
- Requests are prioritized by deadline severity and requested amount where available.
- Deadline text distinguishes overdue, due today, within seven days, within thirty days and later dates.
- Requested capital and risk/rating context are in the primary scan path.
- Missing risk is displayed as `Not supplied`, not guessed.
- Row selection supports export of selected records. No unaudited bulk approve/reject action is invented without an API contract.

## Invested positions

- The maturity ladder now has an explicit month axis.
- Bar length is defined as contractual tenor only, never percentage allocation.
- The page derives maturity date from invested date + tenor and labels concentration as a share of visible capital.
- Duplicate exposure notes are replaced with decision facts: largest visible concentration, positions maturing within 12 months and visible counterparty count.

## Institution profile

- Canvas use is tightened and relationship information is retained.
- Governance/access, compliance/verification and audit-history modules render when the API supplies data.
- Missing enterprise fields display `Not supplied`; no compliance/security state is fabricated.

## Demo safety

- Demo mode has a prominent environment banner.
- Supported create/edit/profile/status/decision actions persist to browser demo storage.
- Unsupported demo endpoints fail explicitly instead of silently returning generic empty/success responses.

## Backend contract

`docs/BACKEND_UI_CONTRACT_GAPS.md` records fields and endpoints needed for full audited bulk decisions, real portfolio valuation/events, enterprise governance, HttpOnly session security and server-side full-book sorting/export.

## Visual implementation

`pihub-workflows.css` is a transitional stylesheet for this PR only. Batch D folds it into the canonical CSS bundle while retiring the legacy cascade and global DOM runtimes.

Refs #1.
