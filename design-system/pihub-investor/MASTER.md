# PiHub Investor Design System

Status: **Canonical**

This document is the source of truth for the PiHub Investor interface. Older design notes, screenshots and exploratory design-DNA files are historical references only when they conflict with this file.

## Product thesis

PiHub is a professional investor workspace for credit opportunities, decision queues and invested positions. The UI optimizes for analytical precision, trust and fast decision-making.

The product is not a consumer investing app, a generic SaaS dashboard, or a decorative trading terminal.

## Non-negotiable rule: every pixel earns its place

A visible UI element must do at least one of the following:

1. communicate data;
2. communicate state;
3. explain structure or hierarchy;
4. enable an action;
5. improve orientation or recovery.

If its only justification is "it looks sophisticated", remove it.

Therefore operational screens do **not** use decorative technical grids, permanent route numbers, editorial folios, ornamental lines, fake telemetry, gratuitous glass, or 3D scenery.

## Visual system

### Shell

- Midnight navigation rail for stable workspace orientation.
- Light analytical workspace for reading and comparison.
- Flat surfaces and hairline separators before cards and shadows.
- Content should use available desktop width instead of floating as a narrow centered dashboard.
- One active-navigation signal: a slim signal-blue edge. Do not stack edge + underline + numbered index + colored icon for the same state.

### Color

- Night 950: `#07101C`
- Ink 950: `#0A1020`
- Ink 700: `#354158`
- Ink 600: `#536078`
- Fog 100: `#EEF2F6`
- Fog 50: `#F6F8FA`
- Paper: `#FBFCFD`
- Signal: `#5F80FF`
- Positive: `#0B7D63`
- Warning: `#A96912`
- Danger: `#C23F48`

Status meaning must never rely on color alone. Always pair color with text and, where useful, shape/iconography.

### Typography

- Primary: IBM Plex Sans.
- Numerical/technical metadata: IBM Plex Mono.
- Body text: 13–15px desktop, 16px minimum for mobile form controls.
- Never shrink operational copy to create the appearance of density.
- Monetary values use tabular/monospaced numerals where comparison benefits.
- Uppercase mono labels are reserved for short metadata, not prose.

### Shape

- Operational controls: 2–4px radius.
- Data tables/ledgers: mostly square geometry.
- Avoid card-within-card nesting.
- Use spacing, grouping and separators before containers.

## Information architecture

Primary workspace destinations:

1. Opportunities
2. Credit requests
3. Invested positions
4. Institution profile

Primary creation action:

- New opportunity

Future target home/overview:

- decisions requiring attention;
- upcoming maturities/payment events;
- capital exposure/concentration;
- recent activity and operational alerts.

## Page anatomy

Operational pages use:

1. Task title
2. One concise explanatory sentence when needed
3. One primary page action when needed
4. Decision-relevant summary metrics
5. Primary working surface
6. Contextual detail only when it adds information not already visible

Do not repeat the same route name in the sidebar, top bar, a folio and the page title. The page title is authoritative.

## Navigation and utilities

Sidebar:

- text + icon destinations;
- slim active edge;
- no permanent route numbers;
- no decorative baseline trace;
- creation action separated from destinations;
- demo/live environment indicator may remain because it changes how data should be interpreted.

Top bar:

- command menu;
- language;
- notifications;
- account menu.

The top bar does not repeat the current page title. Keyboard shortcut labels must match the user's platform.

## Data-heavy screens

### Opportunities

The table/ledger is the primary surface. It should support:

- search;
- status filters;
- sortable columns;
- URL-persisted view state;
- clear active filter/reset state;
- a detail inspector only when it adds information not already in the row;
- native table semantics or complete equivalent ARIA semantics;
- sticky headers for long result sets;
- export/saved views when backed by real data needs.

### Credit requests

Prioritize decisions rather than repeat counts. Target decision fields include:

- requested amount;
- deadline/SLA;
- counterparty;
- facility;
- risk/rating;
- current decision state;
- owner/assignee when available.

### Invested positions

Show portfolio information that changes decisions. Maturity visualizations require a real scale or axis. Never use a full-width bar that implies 100% without defining what 100% means.

## Forms

Long institutional forms must be task-grouped, not decorated with fake step numbers.

Required behavior:

- persistent visible labels;
- required/optional clarity;
- exact numeric fields for exact financial values;
- inline error message associated to the input;
- error summary after failed submit for long forms;
- focus the first invalid field;
- disabled/loading state while saving;
- save-success confirmation;
- draft/autosave for long workflows when persistence is available;
- unsaved-change protection;
- Cancel/Back path;
- sticky action region on long forms;
- upload constraints, selected-file state and progress/error state.

Range sliders may supplement numeric inputs only when approximate exploration is useful. They are not the primary input for precise credit amounts.

## Motion

Motion style: restrained analytical feedback.

- press feedback: 100–160ms;
- control/state transition: 160–220ms;
- panel/inspector continuity: 180–260ms;
- page transition: 220–320ms maximum;
- enter uses ease-out; exit uses ease-in;
- animate transforms and opacity where possible;
- no bounce, elastic motion, decorative looping, or animation on every data refresh.

The application should have **one** GSAP orchestration layer. Motion must respect `prefers-reduced-motion` and must not carry information that disappears when motion is disabled.

## Three.js policy

Three.js is allowed only in authentication/onboarding atmosphere where it cannot compete with financial data. It must:

- have a static/reduced-motion fallback;
- cap device pixel ratio;
- pause when hidden;
- dispose renderer, geometry and materials;
- never run continuously behind operational tables/forms.

## Accessibility and interaction

- WCAG AA contrast: 4.5:1 normal text, 3:1 large text/UI graphics where applicable.
- 44×44px minimum touch targets where practical.
- complete keyboard access.
- visible `:focus-visible` state.
- correct label/input association.
- semantic buttons for actions and links for navigation.
- status never conveyed by color alone.
- modal/command palette traps focus and restores focus on close.
- reduced-motion support.
- mobile form controls at least 16px to avoid browser zoom.

## Responsive targets

Validate at minimum:

- 375px
- 768px
- 1024px
- 1440px
- 1920px

Desktop analytical density must not become microscopic text. On small screens, prioritize essential columns and explicit horizontal scrolling over crushed layouts.

## Engineering guardrails

- New design work must not add another global CSS patch layer without consolidating an older one.
- New motion work must not add another global animation runtime.
- New entity detail routes should be URL-addressable by ID.
- Search/filter/sort state should move toward URL parameters.
- Demo data belongs behind an explicit demo adapter and must never masquerade as production persistence.
- CI must run on both `main` and `develop`, including tests and a production build.

## Review checklist

Before merging a UI change, ask:

- What user decision does this element support?
- Is any information repeated without adding context?
- Can the task be completed with keyboard only?
- Does refresh/deep-linking preserve the user's place?
- Are loading, empty, error and success states covered?
- Is the interaction understandable without animation?
- Is the text readable at 100% browser zoom?
- Does the layout still work at 375/768/1024/1440/1920?
- Did this change reduce or increase CSS/interaction complexity?
