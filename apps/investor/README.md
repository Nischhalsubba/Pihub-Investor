# Investor application migration target

The production Investor application still lives in `/app` and remains the only Vercel build target during Platform Foundation Phase 1.

This directory reserves the future `apps/investor` boundary. Do not switch Vercel, CI, or production routing to this path until a dedicated cutover pull request proves build, browser, accessibility, responsive, visual-regression, and preview-deployment parity.

Target ownership:
- opportunities and underwriting;
- due diligence and Investment Committee;
- commitments and allocations;
- positions, covenants, payments, maturities and watchlist;
- investor research and institution context.
