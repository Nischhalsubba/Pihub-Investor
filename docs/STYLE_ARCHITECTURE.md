# PiHub Investor style architecture

The canonical visual rules live in `design-system/pihub-investor/MASTER.md`. Runtime CSS is generated as one `pihub-bundle.css`, but authoring is now intentionally limited to a small ordered architecture.

## Ordered sources

1. `vendor` — Bootstrap, Boxicons, Tablesaw and historical base stylesheet.
2. `pihub-foundation.css` — consolidated foundational/auth/form/detail styles.
3. `pihub-analytical.css` — consolidated analytical data/form/responsive styles.
4. `pihub-hardening.css` — frozen compatibility rules required by the migrated application.
5. `pihub-shell.css` — global header/sidebar/profile shell.
6. `pihub-motion.css` — loading, motion and reduced-motion guardrails.
7. `pihub-product.css` — dashboard, product-suite and decision-workflow surfaces.
8. `pihub-system.css` — **canonical source for all new UI rules and design tokens.**

The exact order is declared in `app/scripts/style-manifest.mjs` and compiled by `app/scripts/build-css.mjs`.

## Rules for new work

- Do not create `*-fix.css`, `*-polish.css`, `*-contrast.css`, numbered `*-vN.css`, or another global patch layer.
- New UI tokens and shared component rules belong in `pihub-system.css`.
- Prefer the canonical 4/8 spacing rhythm and `--pihub-control: 44px` interaction rail.
- Keep operational typography readable; never shrink text to make a dense layout appear to fit.
- Status meaning is text/icon + color, never color alone.
- GSAP timing is owned by `src/_utils/motion.js`; components should consume that policy rather than inventing new curves.
- Three.js remains excluded from operational dashboard/table/form surfaces.
- `npm run check:styles` fails when the manifest is broken or a new patch-style CSS layer is introduced.

## Why historical rules remain grouped

The six consolidated PiHub layers preserve the exact contiguous order of the former 29 custom stylesheets. This removes authoring-layer sprawl without changing the cascade order in a risky mass rewrite. New product work moves forward in `pihub-system.css`; compatibility layers should shrink over time, not grow.
