# PiHub Investor Design System V3

## Product thesis

PiHub is an investor operations workspace, not a marketing site and not a luxury-brand showcase. The interface must make credit opportunities, requests, portfolio positions, amounts, statuses and next actions easy to scan under time pressure.

The visual target is **institutional precision**: calm, high-trust, compact, contemporary and data-first. The interface should feel closer to modern financial operating software than a generic admin template.

## Visual thesis

- **Mood:** precise, controlled, modern, calm, high-trust.
- **Visual metaphor:** a financial command desk with layered information surfaces.
- **Primary contrast:** deep midnight navigation against a cool light workspace.
- **Accent:** cobalt is used for action and focus only. Semantic colors are reserved for status.
- **Typography:** IBM Plex Sans for UI and headings. IBM Plex Mono for monetary values, dates, IDs and tabular data.
- **Density:** compact-comfortable. Data is dense, but every interaction target remains at least 44px.
- **Shape:** 10-14px radii for product surfaces. Pills only for statuses and compact segmented controls.
- **Elevation:** borders first, low diffuse shadows second. No decorative glassmorphism in dense data regions.
- **Decoration:** extremely restrained. No serif display type, gold luxury styling, oversized editorial headlines, decorative circles or ornamental gradients.

## Interaction thesis

Motion communicates state and hierarchy. It never competes with financial data.

- **Personality:** corporate-premium, decisive, no bounce.
- **Quick:** 120ms for press and hover feedback.
- **Standard:** 220ms for controls, filters and small state changes.
- **Slow:** 360ms for page/section entrance.
- **Entrance easing:** `power3.out` / CSS `cubic-bezier(0.2, 0, 0, 1)`.
- **Exit easing:** `power2.in` / CSS `cubic-bezier(0.3, 0, 1, 1)`.
- **Page entrance:** 10-18px translate + opacity, hero first, supporting regions 35-45ms stagger.
- **Rows:** animate at most the first 8 visible rows, 25-30ms stagger.
- **Hover:** maximum 1-2px displacement. No card zooming in dense tables.
- **Reduced motion:** no spatial transforms, no Three.js animation, direct state changes only.

## Color tokens

### Core

| Token | Value | Usage |
|---|---|---|
| `--pi-bg` | `#F5F7FA` | application background |
| `--pi-surface` | `#FFFFFF` | primary surfaces |
| `--pi-surface-subtle` | `#F8FAFC` | table headers / secondary surfaces |
| `--pi-surface-hover` | `#F2F6FC` | interactive row hover |
| `--pi-sidebar` | `#0B1220` | primary navigation |
| `--pi-sidebar-raised` | `#111A2B` | active navigation |
| `--pi-text` | `#0F172A` | primary text |
| `--pi-text-secondary` | `#475569` | secondary text |
| `--pi-text-tertiary` | `#64748B` | captions |
| `--pi-border` | `#E2E8F0` | standard border |
| `--pi-border-strong` | `#CBD5E1` | active/strong border |
| `--pi-primary` | `#2457E6` | primary action |
| `--pi-primary-hover` | `#1E49C7` | primary hover |
| `--pi-focus` | `#60A5FA` | focus ring |

### Semantic

| Token | Value |
|---|---|
| `--pi-success` | `#15803D` |
| `--pi-success-bg` | `#ECFDF3` |
| `--pi-warning` | `#B45309` |
| `--pi-warning-bg` | `#FFF7E6` |
| `--pi-danger` | `#B42318` |
| `--pi-danger-bg` | `#FEF3F2` |
| `--pi-info` | `#175CD3` |
| `--pi-info-bg` | `#EFF8FF` |

## Typography

Font stack:

```css
--pi-font-sans: "IBM Plex Sans", Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
--pi-font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
```

| Role | Size | Weight | Line height |
|---|---:|---:|---:|
| Display | 36px | 600 | 1.12 |
| H1 | 30px | 600 | 1.2 |
| H2 | 24px | 600 | 1.25 |
| H3 | 18px | 600 | 1.35 |
| Body | 15px | 400 | 1.55 |
| Body small | 13px | 400 | 1.5 |
| Label | 12px | 500 | 1.4 |
| Caption | 11px | 500 | 1.4 |
| Overline | 10px | 600 | 1.3 |

Numeric values use tabular figures. Money, IDs and dates may use the mono family.

## Spacing

Base unit: 4px.

Scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

- App gutters: 24px desktop, 20px tablet, 16px mobile.
- Page section gap: 24-32px.
- Card interior: 16-20px.
- Dense row vertical padding: 14-16px.

## Layout

- Desktop shell: 232px sidebar + flexible workspace.
- Top bar: 64px.
- Max content width: 1600px.
- Breakpoints: 375 / 768 / 1024 / 1440.
- Desktop navigation uses a persistent sidebar.
- Mobile uses a compact horizontal top-level navigation strip; no nested drawer for the current four core destinations.
- Tables become horizontally scrollable only as a last resort. Priority columns remain visible first.

## Shape and elevation

- Radius small: 8px.
- Radius medium: 12px.
- Radius large: 16px.
- Radius pill: 999px.
- Border: subtle 1px.
- Shadow 1: `0 1px 2px rgba(15, 23, 42, .04)`.
- Shadow 2: `0 8px 24px rgba(15, 23, 42, .06)`.
- Shadow 3: `0 20px 50px rgba(15, 23, 42, .10)` for menus/modals only.

## Iconography

- Use the existing Boxicons set consistently until the icon system is migrated.
- Outline icons at 18-20px in navigation/actions.
- No emoji icons.
- Icon-only actions require accessible names and 44px hit targets.

## Components

### Buttons

- Primary: cobalt fill, white text, 10px radius.
- Secondary: white surface, strong border, dark text.
- Tertiary: transparent, text/icon only.
- Danger: pale red surface with danger text.
- States required: default, hover, focus, active, disabled.

### Inputs

- 44-48px height.
- Visible label above the control.
- White surface, neutral border, cobalt focus ring.
- Error below the field, never color-only.

### Cards

- Border-first surface with minimal shadow.
- Compact headers and aligned numeric values.
- No decorative ornaments inside data cards.

### Tables

- Sticky low-contrast header where possible.
- 14-16px row padding.
- First column carries the primary entity.
- Monetary and date columns use tabular figures.
- Status uses text + semantic color.
- Row hover is a subtle background shift only.

### Navigation

Primary destinations:

1. Opportunities
2. Credit requests
3. Portfolio
4. Applications

`New opportunity` is an action, not a navigation destination.

## Visual effects

Three.js is allowed only where it improves brand expression without obstructing workflow.

- Authentication visual: abstract capital topology / risk surface in muted cobalt and cyan.
- Renderer: transparent WebGL, DPR capped at 1.5.
- 3D remains decorative and `aria-hidden`.
- No WebGL in primary tables or transaction workflows.
- Low-power and reduced-motion fallback: static CSS gradient + grid.
- No bloom, chromatic aberration or heavy post-processing in the production workspace.

## Accessibility and quality bar

- Normal text contrast >= 4.5:1.
- Visible focus ring on every interactive element.
- Full keyboard access.
- Hit targets >= 44x44 CSS px.
- No status communicated through color alone.
- Reduced motion disables spatial animation and WebGL.
- Test layouts at 375, 768, 1024 and 1440px.
- Loading, empty, success and error states must be explicit.
- Search and filters must have labels.
- Route changes move focus to main content without stealing focus during ordinary form interaction.

## Forbidden patterns

- serif display typography
- gold/brass luxury palette
- giant 50-70px app-page headings
- pill buttons everywhere
- excessive glass blur
- decorative card circles
- bounce/elastic animation in financial workflows
- continuous motion in tables
- fake metrics or fabricated portfolio values
- icon-only navigation without labels
