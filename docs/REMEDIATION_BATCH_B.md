# Remediation Batch B — Opportunity and profile forms

This batch replaces the most fragile long-form workflows rather than adding another CSS patch over the legacy Redux Form implementation.

## Opportunity form

- One shared `OpportunityForm` now owns create and edit workflows.
- Exact tenor and financial values use keyboard-friendly numeric inputs instead of range sliders.
- Add/Edit duplication, state mutation and the `files.lenght` path are removed.
- The unnamed Redux Form field is removed; product normalization no longer creates an accidental property named `undefined`.
- Required fields are explicit and long-form validation provides both inline messages and a summary.
- Invalid submissions focus the first actionable field.
- Collateral/rating controls have unique semantic radio groups.
- Essential requirements are inline; the workflow does not depend on tooltips.
- Drafts auto-save to `sessionStorage`, with an explicit Save draft action.
- React Router `Prompt` plus `beforeunload` protects unsaved work.
- A review state summarizes decision-driving values before publishing.
- Persistent actions provide Cancel, Save draft, Review and Publish/Save.
- Uploads show accepted file types, an 8 MB per-file limit, selected files, confidentiality guidance and transfer progress when the browser reports it.
- The decorative 01–08 faux-step treatment and nested field cards are gone.

## Profile form

- Profile editing is a controlled workflow rather than another Redux Form page.
- Relationship contacts are vertical records, reducing horizontal scan cost.
- LinkedIn/documentation stays primary; Facebook and X/Twitter are placed under optional secondary links.
- Company/logo/document constraints and upload progress are explicit.
- Unsaved-change protection and a sticky Cancel/Save action region are included.
- Section numbering/card decoration is removed in favor of headings and separators.

## Data/error cleanup

- Product FormData normalization now accepts the shared form shape for create/update.
- Taxonomy/state/county requests surface errors rather than swallowing them in `console.log`.
- Legacy side-effect `.map()` loops in shared data transforms are replaced with map/filter/forEach patterns that express intent.
- Multipart requests share the same 401 session invalidation behavior as JSON requests.

## Tests

`opportunityValidation.test.js` protects range ordering and rating-required behavior in addition to the Batch A auth/session tests.

## Deliberately deferred

Full English/German copy ownership and terminology normalization is a platform concern and lands in Batch D, where locale state is consolidated. Batch B removes the mixed hard-coded `Auswählen`/legacy multiselect path from the opportunity form but does not pretend the entire product is localized yet.

Refs #1.
