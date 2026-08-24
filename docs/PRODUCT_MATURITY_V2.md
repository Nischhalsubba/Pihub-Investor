# PiHub Investor — Product Maturity v2

This release turns the post-modernization product suite into a maintainable institutional workspace rather than adding another visual redesign.

## Delivered tracks

1. **CSS architecture** — 29 historical PiHub authoring stylesheets are consolidated into six order-preserving compatibility layers plus one canonical `pihub-system.css` layer. CI rejects new patch-style CSS files.
2. **Opportunity toolbar** — Search and status remain permanent; Export remains explicit; density, columns and Saved Views live behind one View control.
3. **i18n ownership** — the deprecated React translation compatibility packages are removed. `counterpart` plus PiHub-local React renderers own EN/DE behavior.
4. **Saved Views v3** — save, load, rename, delete, default, import/export and shareable opportunity URLs, while truthfully remaining browser-scoped until a server contract exists.
5. **Component boundaries** — the opportunity mega-component is split into page coordination, toolbar, View menu, ledger, inspector and formatting/model modules.
6. **Browser + visual QA** — Chromium desktop/mobile, Firefox desktop and WebKit desktop; Chromium visual baselines at canonical workspace widths.
7. **Design-system enforcement** — spacing, control, radius, z-index, motion and semantic surface tokens have a single canonical forward layer.
8. **Motion ownership** — one GSAP policy module owns durations, reduced-motion behavior, overlay transitions, sidebar FLIP and global route/press choreography.
9. **Decision information** — owner, risk/rating and next review are promoted on opportunities/credit queues; invested positions add expected yield and risk.
10. **Roadmap integrity** — Epic #16 and dependency issue #9 are reconciled only after the exact merged production commit passes Vercel.

## Explicit non-goals

- No Three.js/WebGL on operational investment screens.
- No fake cloud synchronization for browser Saved Views.
- No new visual patch stylesheet.
- No decorative animation that competes with financial data.

## Merge gates

The release is complete only when the exact PR head passes architecture checks, unit tests, production build, bundle budget, Chromium/Firefox/WebKit Playwright, responsive screenshots, reduced motion, keyboard workflows, WCAG A/AA serious/critical checks, canonical-width overflow checks, and the exact merged commit reports Vercel success.
