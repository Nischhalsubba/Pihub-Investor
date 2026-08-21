# PiHub Investor V3 Design Audit

Date: 2026-08-21

Scope: full visual-system replacement, motion system, authentication experience, opportunity/credit/portfolio workflows, product detail, profile, notifications, account states, and legacy data-integrity cleanup.

## Critical

### Resolved

- Global visible `:focus-visible` treatment is present.
- A skip link and focusable main landmark are present in the authenticated application shell.
- Reduced-motion behavior is implemented in CSS and in the GSAP/Three.js runtime.
- Decorative Three.js content is outside the semantic content flow and its canvas is inside an `aria-hidden` visual region.
- Animation uses transforms/opacity rather than layout-property animation.
- The Three.js scene disposes geometries, materials and the renderer, stops on hidden pages, caps device pixel ratio, and is disabled on reduced-motion/low-power devices.
- Click actions introduced by the redesign use buttons/links rather than clickable non-semantic divs.
- Fabricated financial rows previously shipped in `AppliedList.js` were removed.
- Fabricated profile phone fallback and incorrect LinkedIn routing were removed.
- Hard-coded fake notification time text was removed.
- Password reset validation and forgot-password error handling defects were repaired.
- Signup now includes the phone value in the submitted payload.
- Credit decisions now require explicit confirmation before accept/reject.
- Product deletion now requires explicit confirmation.

## Important

### Resolved

- Primary app hierarchy changed from an editorial/luxury theme to a compact institutional-finance workspace.
- Status is communicated with text plus semantic color, not color alone.
- Opportunities, credit requests and portfolio positions now have explicit loading/empty states.
- List rows use stable domain identifiers where available rather than array-index keys.
- Product and credit details are grouped by decision task rather than raw backend field order.
- Tables use tabular/monospace numeric treatment for money, dates and identifiers.
- GSAP route animation is lifecycle-aware through a `pihub:route-ready` event rather than relying only on initial DOM load.
- Table entrance stagger is capped at the first eight rows.
- Signup, login, recovery, reset and account-status routes share one authentication shell.
- The previously blank product-applications route now renders an honest no-live-data state instead of an empty page.

### Requires browser/runtime verification

- Contrast should be verified with DevTools/Lighthouse in the rendered deployment, although palette choices were designed for WCAG AA.
- Keyboard tab order and focus restoration should be verified end-to-end in the browser.
- Responsive layouts need rendered QA at 375, 768, 1024 and 1440px.
- Chrome Performance should verify 60fps during the authentication Three.js scene and route transitions on a mid-range device profile.
- API-backed form submission loading/disabled states are still constrained by the existing Redux action architecture and should receive a dedicated async-state pass if the backend is revived.

## Nice to have

- Migrate the 2019 Create React App / React 16 application to a current React toolchain after the visual release is stable.
- Replace old Bootstrap/jQuery runtime dependencies incrementally rather than mixing a framework migration into the UI release.
- Add route-level code splitting after profiling bundle size.
- Virtualize result tables only if production result sets regularly exceed roughly 100 visible rows.
- Replace the legacy Boxicons dependency with one controlled SVG icon system in a later technical cleanup.

## Design-system compliance

Canonical design rules live in `MASTER.md` and the complete three-dimension Design DNA lives in `design-dna/pihub-v3.json`.

The V3 system forbids the patterns that caused the rejected V2 direction: serif display typography, gold/brass luxury styling, oversized editorial application headings, pill buttons everywhere, decorative card ornaments, bounce motion in financial workflows, fake metrics, and continuous motion in data tables.

## Deployment note

The repository's Vercel check is currently failing. The same Vercel check also fails on the preserved pre-redesign `develop` commit, so this is not evidence that the V3 UI introduced the deployment problem. Build logs were not accessible through the connected Vercel project listing in this session, so the deployment failure remains an external verification gap rather than a claimed pass.
