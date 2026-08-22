# PiHub Investor — UI, UX and Engineering Audit

Date: 2026-08-22
Scope: current React frontend, repository structure, deployed screenshots and Vercel/Git integration available to this session.

## Executive summary

The application has a credible analytical visual direction, but the implementation currently behaves like three generations of frontend layered on top of one another. The biggest risk is not color or typography. It is **system drift**: old Bootstrap/Sass rules, newer page-specific styles, analytical redesign styles, QA patches and purpose-polish patches all participate in the same cascade. That makes regressions easy and explains why visually unrelated fixes can break the sidebar, header or forms.

The target is a professional institutional-investor workspace where every visible element supports data, state, structure, action, orientation or recovery.

---

# 1. UI issues

## P0 / high impact

### U1. The CSS cascade is visibly inconsistent across screens
- Analytical list pages and legacy forms do not look like one system.
- Add/Edit screens still show rounded nested field panels while list pages use flat ledger geometry.
- The same concepts use different spacing, borders and typography depending on which stylesheet wins.

### U2. Excessive unused canvas on large desktops
- Core content is visually detached from the sidebar.
- Important data occupies a small island inside a 2048px viewport.
- This reduces scan efficiency and makes the product feel like a resized template rather than a purpose-built workstation.

### U3. Operational typography is still too small in secondary areas
- Small uppercase mono labels remain difficult to read at 100% zoom.
- Status, metadata, secondary descriptions and right-rail data are particularly vulnerable.
- Analytical density must come from information architecture, not microscopic type.

### U4. Decorative workspace grid/technical scenery has no decision value
- The operational background grid and sidebar technical overlays are decorative.
- They increase visual noise and contradict the product rule that every element serves a purpose.

### U5. Redundant route/context indicators
- Route identity appears in multiple places: sidebar, top utility bar, page title and historical folio/index conventions.
- Permanent numbers such as 01/02/03 do not help the user complete a finance workflow.

### U6. Active navigation has historically been over-signalled
- The system has used edge signal, underline/baseline, index color and icon changes for one state.
- One strong active indicator is sufficient.

## Products / opportunities

### U7. Search/filter bar is visually weaker than the data it controls
- Search, filters and Search button look like separate small controls rather than one coherent query tool.
- `QRY` is unexplained internal-style jargon.

### U8. Opportunity table is not visually optimized for comparison
- No visible sortable headers.
- Monetary/tenor columns need stronger alignment for rapid comparison.
- Selected-row state is subtle.
- Pagination is visually detached from the result set.

### U9. Inspector repeats data instead of adding analysis
- Classification/status/facility/industry often repeat row data.
- The right rail should add borrower/risk/document/decision context, not echo the ledger.

## Credit requests

### U10. Queue intelligence rail duplicates the summary tape
- Pending, deadline, facilities and conversions are already represented above or in the queue.
- The rail consumes space without adding enough new decision information.

### U11. Decision rows lack risk and urgency hierarchy
- Deadline is shown but not prioritised as due/overdue/approaching.
- Requested amount, risk/rating and decision owner are absent from the main scan path.

## Invested positions

### U12. Maturity bar is visually misleading without a scale
- A single position can become a full-width bar, visually implying 100% without defining the denominator.
- The graphic needs an actual month scale or should be replaced by a more honest representation.

### U13. Exposure rail repeats top metrics
- Visible positions, average tenor, largest position and total allocated largely repeat the tape.
- It needs concentration/risk/maturity/event information or should be removed.

## Profile

### U14. Institution profile is too sparse for the amount of canvas used
- Large empty areas dominate the page.
- Relationship and account-status modules repeat fields already shown in the identity sheet.

### U15. Institutional profile lacks important enterprise concepts
- Roles/permissions
- compliance/verification documents and history
- account/security sessions
- institution identifiers
- audit history

## Edit profile

### U16. Three-column contact form is difficult to scan
- Horizontal scanning is high.
- It is fragile at intermediate responsive widths.
- Contact records should be repeatable vertical cards/rows or an editable list.

### U17. Low-value social fields dominate institutional profile editing
- Facebook and Twitter receive the same visual weight as operational identity/contact data.
- LinkedIn/company site/documentation are more relevant; social fields should be optional/secondary.

### U18. Long profile form lacks persistent actions
- Save is easy to lose at the bottom of a long page.
- No visible Cancel, save state, dirty state or unsaved-changes protection.

## New opportunity / edit opportunity

### U19. Card-within-card form treatment looks templated
- Each field/group sits inside another rounded panel.
- The hierarchy comes from containers rather than task grouping.

### U20. 01–08 row numbers look like steps but are not a real stepper
- They imply progression while the form is actually one continuous page.
- Decorative numbering should be removed unless it becomes functional section navigation/progress.

### U21. Mixed English/German placeholders
- `Auswählen` is hardcoded in the multiselect renderer.
- This creates mixed-language screens even when English is selected.

### U22. Range sliders are poor primary controls for exact financial values
- Minimum/maximum credit amount and minimum borrower revenue are exact underwriting inputs.
- Sliders reduce precision and accessibility.
- Use numeric/currency inputs; a slider may supplement only when approximation is useful.

### U23. File upload lacks operational detail
- No clear accepted file types.
- No visible size limit.
- No uploaded-file state/progress.
- No confidentiality guidance.
- Weak error/retry affordance.

### U24. Form actions are weakly placed
- Submit sits at the end/bottom-left.
- No Save draft, Review, Cancel or sticky action region.

---

# 2. UX issues

## P0 / high impact

### X1. No decision-oriented overview/home
The app opens into the opportunity list. Professional investors usually need a triage surface first:
- requests requiring a decision;
- upcoming deadlines/maturities;
- exposure/concentration;
- recent material activity;
- verification/operational alerts.

### X2. Detail/edit routes are not durable deep links
- Product detail uses `/product` + `location.state.id`.
- Product edit uses `/edit-product` + navigation state.
- Refresh/bookmark/direct navigation loses the entity context and can redirect users away.

Target: `/opportunities/:productId` and `/opportunities/:productId/edit`.

### X3. Search/filter state is not represented in the URL
- Back/forward navigation does not reliably restore the analytical view.
- Views cannot be shared/bookmarked.
- Filters should progressively move into URL query parameters.

### X4. Error handling is inconsistent and often invisible
- Several async actions only `console.log` failures.
- The user can be left looking at stale/loading data with no actionable recovery.

Every data surface needs loading, empty, error and retry states.

### X5. Long forms lack draft/recovery behavior
- No autosave/draft.
- No unsaved-changes warning.
- No clear save-in-progress/success state.
- A long institutional workflow should not lose work because of navigation or a network problem.

### X6. Demo mode can mask missing backend behavior
- Unknown demo GET requests return generic empty data.
- Generic demo actions can report success even when a real endpoint is not implemented.
- Demo mode must be visibly explicit and should fail loudly for unsupported workflows during development.

## Navigation and orientation

### X7. Keyboard shortcuts are not sufficiently task-oriented
- Numeric route shortcuts are discoverable only if permanently decorated or documented.
- Command palette is the better scalable shortcut surface.
- Platform shortcut label must match Windows/macOS.

### X8. Page titles and top context have been duplicated
- Duplicate context consumes attention without improving orientation.
- Sidebar + page title is sufficient for most screens.

### X9. No breadcrumb/back-context on entity workflows
- Product detail, request detail and edit workflows need a clear return path preserving the originating view.

## Data workflows

### X10. Opportunities lack professional table operations
Target capabilities when supported by data:
- sort;
- saved views;
- clear-all filters;
- active-filter count;
- export;
- column visibility;
- sticky table header;
- keyboard row navigation.

### X11. Credit queue lacks bulk/triage mechanics
- no bulk selection/action;
- no assignee/owner;
- no risk prioritization;
- no deadline severity;
- no explicit decision history.

### X12. Invested positions lack portfolio decision fields
Potentially useful fields:
- current value;
- yield/return;
- maturity date;
- counterparty;
- rating/risk;
- next payment/event;
- concentration by borrower/industry.

### X13. Data visualizations lack explicit scales/definitions
- Any bar, intensity, trend or progress visual must define what the encoded length/color/opacity means.

## Forms

### X14. Required vs optional fields are unclear
- Users must infer what is required.
- Institutional forms need explicit required/optional semantics.

### X15. Validation recovery is incomplete
Target behavior:
- inline message tied to field;
- error summary for long forms;
- focus first invalid input;
- preserve entered values;
- do not rely on tooltips for essential instructions.

### X16. Exact financial entry needs keyboard-efficient controls
- Currency fields should support direct numeric typing, formatting and validation.
- Sliders create unnecessary pointer precision work.

### X17. Language quality is inconsistent
- English locale contains typos/grammar issues.
- German and English terminology are mixed in some controls.
- Some product terms are ambiguous (`Minimum Sales Creditor`, `Rating for Credit`).

### X18. Demo/live distinction is too subtle
- A tiny footer indicator is easy to miss.
- Actions in demo mode should not be mistaken for real financial persistence.

---

# 3. Engineering / coding issues

## P0 / architecture

### C1. Legacy frontend foundation
`package.json` is still a Create React App-era React 16 application with React Router 5, react-scripts 3 and Redux Form 8. This increases maintenance cost and constrains modern tooling.

### C2. Twenty global CSS files are loaded into one cascade
The public HTML loads Bootstrap/legacy CSS plus multiple PiHub generations and two late patch layers. This is the main structural reason one page fix can repaint unrelated screens.

Target: consolidate to a small token/base/components/pages structure and retire obsolete layers incrementally.

### C3. Old Sass source and compiled CSS coexist without an active Sass build pipeline
- Source and generated styles can drift.
- It is unclear which source should be edited.

### C4. Multiple global JavaScript runtimes manipulate the DOM outside React
- jQuery/Bootstrap behavior
- Tablesaw
- Choices
- GSAP global script
- external PiHub motion runtime

This makes lifecycle ownership and cleanup harder.

### C5. Two animation systems have been loaded historically
`pihub-experience.js` and `pihub-analytical.js` both orchestrate GSAP-like workspace motion. Keep one animation owner.

### C6. Motion runs outside React lifecycle
`pihub-experience.js` listens globally and observes the root DOM with MutationObserver. Cleanup exists for Three.js, but React-aware animation ownership would be safer and easier to test.

### C7. Three.js is loaded dynamically from a CDN
- Build is not fully reproducible/pinned through package lock.
- CDN failure changes the experience.
- It is acceptable only as optional auth enhancement with a static fallback.

## Routing/state

### C8. Entity routes depend on `location.state`
Product and request detail pages are not durable URLs. IDs belong in route params.

### C9. Not-found handling is commented out
The imported `NoMatch` route is not active.

### C10. All route components are eagerly imported
No route-level code splitting/lazy loading despite a growing application surface.

## API/data

### C11. API response normalization is duplicated in UI/actions
Multiple helpers such as `toText`, `localizedText`, structured-error normalization and variant field extraction compensate for inconsistent payload shapes in many files.

Target: normalize/validate at the API boundary once.

### C12. `getProductById` creates an accidental property named `undefined`
The normalized detail object contains `undefined: extractDisplayNames(raw.industries)`. This is almost certainly an implementation error/dead field.

### C13. Several actions swallow errors
Credit-request, invested-list and profile fetch actions log to console rather than dispatch a usable error state.

### C14. Query strings are built manually
Use Axios `params` instead of string concatenation for filters/pagination.

### C15. FormData construction is duplicated
Product add/edit/profile actions manually append many fields with repeated mapping logic. Centralize serializers.

### C16. `.map()` is repeatedly used for side effects
Use `forEach`/loops when no returned array is needed. It communicates intent and avoids wasted allocations.

## Forms/components

### C17. Add and Edit product are huge duplicated class components
- Add: ~23KB
- Edit: ~31KB
- repeated field layout, ratings, upload, service/state/industry preparation

Target: shared OpportunityForm + field groups/hooks/adapters.

### C18. Product Add mutates data/state during submit
- mutates `formProps`;
- reverses the rating state array in place;
- calls `setState` and then immediately reads stale `this.state` for submission.

This can produce incorrect rating order/data.

### C19. Product Edit has a `files.lenght` typo
The typo prevents intended empty-file detection.

### C20. Multiselect renderer can mix locales and previously assumed `input.value[0]` exists
This is both a localization and resilience issue.

### C21. Obsolete `<font>` elements are used for validation errors
Errors need semantic text with `role=alert`/described-by relationships.

### C22. Radio IDs/labels are duplicated or mismatched
Multiple Yes/No fields use duplicate IDs such as `credit`, while visible labels reference different IDs. Clicking labels can fail to toggle the intended control.

### C23. `inputDoubleSlider` had a disabled `onChange`
A renderer exists for an interactive control whose change handler was commented out.

### C24. Tooltip instructions carry essential information
Tooltip-only guidance is weak for keyboard/touch users. Essential constraints belong inline.

## State/auth/security

### C25. Authentication token is stored in localStorage
This is XSS-sensitive. A future real backend should prefer HttpOnly + Secure + SameSite cookies where architecture permits.

### C26. Opaque tokens without expiry are accepted until the server rejects them
This is intentional compatibility behavior but means client expiration cannot be trusted for those sessions.

### C27. Demo backend is embedded in the production frontend bundle
The adapter is useful for demos, but it is large and masks unsupported endpoints. Prefer a dedicated mock layer/dev adapter and explicit mode gating.

## Localization

### C28. Locale state has multiple owners
Counterpart locale, localStorage and Redux language state all participate. Centralize language ownership.

### C29. Locale files contain terminology and copy debt
- spelling/grammar errors;
- old CreditTech terminology;
- mixed English/German keys/copy;
- unclear underwriting labels.

## Repo hygiene / performance

### C30. Empty/dead placeholder files remain
Examples include an empty `main-script.js` and empty `components/user/Profile.js`.

### C31. Duplicate legacy frontend assets remain
Examples: Bootstrap variants, duplicate icon files, old generated assets and unused source files.

### C32. Large icon font package is shipped globally
Boxicons font/SVG assets are heavy for the small icon subset actually used. Move toward a tree-shaken SVG icon set during modernization.

### C33. CI only validated `develop` and only built the app
Before this audit it did not validate `main`, run unit tests, E2E tests, accessibility checks, linting or security checks.

### C34. Build intentionally suppresses CRA warnings with `CI=false`
This avoids legacy build breakage but can hide useful warnings. Remove after the warning/dependency cleanup.

### C35. Node 16 is end-of-life
The legacy react-scripts stack is the blocker. Upgrade framework/tooling before moving CI/runtime to a supported Node baseline.

### C36. No meaningful automated test suite was present
The repo tree contains no established `.test.js`/`.spec.js` application suite. Critical auth, routing and decision workflows need coverage.

### C37. No browser/E2E smoke suite
At minimum automate:
- login/signup demo path;
- opportunities list/search/filter;
- opportunity detail deep link;
- credit request detail;
- invested position detail;
- profile edit save;
- add opportunity validation/save;
- responsive shell;
- keyboard command palette.

---

# 4. Motion / Three.js audit

## GSAP
Keep one GSAP owner and use motion only for:
- route continuity;
- inspector/detail selection;
- command/menu/dialog entry/exit;
- save/success/error feedback;
- small control press feedback.

Avoid animation on every data refresh/filter keystroke. Prefer transform/opacity. Respect `prefers-reduced-motion`.

## Three.js
Current best use is authentication atmosphere only. Do not place WebGL behind opportunity tables, forms or portfolio data. Auth Three.js must retain:
- DPR cap;
- static/reduced-motion fallback;
- visibility pause;
- geometry/material/renderer disposal;
- non-blocking loading.

---

# 5. Remediation order

## Phase 1 — foundation (now)
- remove decorative operational grid/context numbers;
- simplify sidebar active state;
- simplify top utility bar;
- remove duplicate motion runtime;
- fix shared form-field semantics and locale-aware placeholders;
- establish canonical design-system rules;
- add first automated auth tests;
- validate both `main` and `develop` in CI.

## Phase 2 — interaction architecture
- URL-addressable product/request/position routes;
- URL search/filter/sort state;
- real NotFound route;
- standardized async state component;
- consistent error/retry handling;
- page-level code splitting.

## Phase 3 — workflow rebuild
- shared OpportunityForm replacing Add/Edit duplication;
- precise numeric/currency inputs instead of financial sliders;
- draft/autosave/unsaved-change protection;
- profile contacts as repeatable records;
- sticky save/review actions;
- upload state/progress/constraints.

## Phase 4 — institutional analytics
- decision-focused home/overview;
- sortable/exportable opportunity table;
- risk/urgency/amount-driven decision queue;
- honest maturity/exposure visualization with scale;
- position events/returns/risk fields where backend data exists.

## Phase 5 — platform modernization
- migrate off React 16 / CRA 3 / Redux Form;
- consolidate CSS and retire legacy Sass/Bootstrap/jQuery layers;
- package GSAP/Three.js rather than CDN runtime loading where retained;
- modern supported Node baseline;
- E2E + accessibility + performance budgets.

---

# Definition of "UX bulletproof"

A release is not done because it looks polished. It is done when:
- the task is obvious at 100% zoom;
- every element has a reason to exist;
- keyboard-only completion works;
- refresh/deep-link/back navigation preserve context;
- loading/empty/error/success/retry are handled;
- long-form work is protected from accidental loss;
- statuses are not color-only;
- reduced motion loses no information;
- 375/768/1024/1440/1920 layouts are validated;
- critical workflows have automated smoke coverage;
- the CSS/motion implementation has one clear owner rather than another patch layer.
