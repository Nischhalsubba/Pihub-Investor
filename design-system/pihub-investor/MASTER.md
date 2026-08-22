# PiHub Investor Design System — Analytical Precision

## Product thesis
PiHub is an institutional investor workspace for evaluating credit opportunities, reviewing requests, and monitoring invested positions. The interface prioritizes analytical clarity, decision speed, trust, and dense but legible information over consumer-style delight.

## Visual thesis
Hybrid command center: a midnight navigation and command layer paired with a light analytical workspace. The visual identity is built from ledgers, rules, rails, continuous metric tapes, editorial folios, and persistent research/decision inspectors. Avoid rounded active-nav pills, bento-card walls, floating KPI tiles, decorative gradients, oversized radii, and generic segmented-control styling.

## Interaction thesis
Corporate/premium motion. Interactions are immediate, restrained, and causal. Use 120ms micro feedback, 190ms state transitions, and 320ms page entrances with `cubic-bezier(.2,0,0,1)`. Exits are faster. No bounce or elastic overshoot in data surfaces. Reduced-motion removes translation/stagger and preserves direct state changes.

## Tokens
### Color
- night-1000: #050A12
- night-950: #07101C
- night-900: #0A1423
- night-850: #0D192B
- night-800: #112039
- ink-950: #0A1020
- ink-850: #182236
- ink-700: #354158
- ink-600: #536078
- ink-500: #738097
- ink-400: #9AA5B7
- fog-200: #D9E0E9
- fog-150: #E5EAF0
- fog-100: #EEF2F6
- fog-50: #F6F8FA
- paper: #FBFCFD
- white: #FFFFFF
- signal: #5F80FF (lines/fills)
- signal-text: #4868D7 (accessible small text/action text)
- signal-2: #87A3FF
- signal-soft: #EDF1FF
- positive: #0B7D63
- positive-soft: #E6F5F0
- warning: #A96912 (marks)
- warning-text: #965D0C (accessible small text)
- warning-soft: #FFF2DF
- danger: #C23F48
- danger-soft: #FFF0F1
- info: #2D7390

### Typography
- Heading/body: IBM Plex Sans
- Financial/data: IBM Plex Mono
- H1: 28–32px / 600 / tight tracking
- H2: 20–24px / 600
- H3: 12–14px / 600
- Body: 12–14px / 400–500
- Label/overline: 8–10px / 600 / uppercase / 0.06–0.12em tracking
- Financial numbers: tabular figures in IBM Plex Mono

### Spacing
4px base. Primary scale: 4, 8, 12, 16, 20, 24, 32, 40.
Dense working surfaces use 8–16px gaps; page sections use 20–32px.

### Shape
- Operational controls: 2–4px radius
- Small utility surfaces: 4–6px radius
- No pill-shaped navigation selections
- Pills reserved only for compact semantic status tags
- Borders/rules are preferred to shadows for structure

### Elevation
- Low: 0 1px 2px rgba(7,16,30,.04)
- Medium: 0 8px 24px rgba(7,16,30,.07)
- High/menu: 0 18px 50px rgba(5,10,18,.24)
- Primary depth cues are contrast, dividers, and overlapping rails, not card shadows

### Motion
- micro: 120ms
- normal: 190ms
- macro: 320ms
- entrance: y 6–12px + opacity, ease-out
- exit: 120–180ms, ease-in
- row stagger: 24–32ms, max first 8 rows
- press scale: .985
- no bounce on tables, forms, or navigation

## Components
### Navigation
Midnight fixed rail. Active state is indicated by a 2px edge signal, baseline trace, brighter label/icon, and index emphasis. Never draw a rounded active container.

### Top bar
Compact contextual title/code, command entry, language control, notification, profile. Utility-first; avoid decorative boxed icon clusters.

### Page heading
Editorial folio number + title/description + at most one primary action. Strict horizontal alignment.

### Metric tape
Continuous ruled band, not detached cards. Metrics separated by vertical dividers and semantic micro-markers.

### Ledger/table
Flat analytical sheet with hairline dividers, mono IDs and financial values, predictable column rhythm, keyboard focus, and selected-row edge signal. Avoid floating-card table containers.

### Inspector / side analysis
Persistent right rail for selected opportunity/request/position analysis. Border-left structure, no card wall.

### Forms
Numbered docket sections with visible labels, compact inputs, direct helper/error text, and strong section rules. Long forms preserve context and use a validation/submission summary when practical.

### Profile
Institutional entity record, not a settings card grid. Identity hero + data sheet + relationship/access rail.

## Accessibility and responsiveness
- WCAG AA contrast for normal text.
- All functionality keyboard reachable; visible 2px focus indicator.
- Icon-only controls receive accessible names.
- Touch targets at least 44px on compact/mobile breakpoints.
- `prefers-reduced-motion` removes spatial animation and decorative grids.
- Breakpoints: 375, 768, 1024, 1440.
- Mobile uses horizontal nav strip or drawer-like rail and horizontally scrollable ledgers; no crushed desktop table.

## Forbidden patterns
- Rounded active navigation pills
- Bento grid as default layout
- Purple/pink AI gradients
- Oversized radius on every surface
- KPI card wall when a single analytical tape works
- Decoration-only animation or continuous motion in working screens
- 3D/WebGL inside dense operational views
- Emojis as structural icons
