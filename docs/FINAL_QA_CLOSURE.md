# Final QA closure gate

This branch closes the post-modernization quality gap left after PR #5 was merged.

## Required before merge

- deterministic dependency install with `npm ci`;
- unit tests green;
- production Vite build green;
- bundle budget green;
- Chromium smoke suite green on desktop and mobile;
- demo login persists through refresh;
- critical workspace routes survive direct navigation and refresh;
- authenticated 404 is recoverable;
- no serious/critical Axe WCAG A/AA findings on login and dashboard;
- no page-level horizontal overflow on covered routes;
- Playwright traces/screenshots are uploaded when the browser gate fails;
- Vercel reports a successful deployment for the final commit;
- `develop` is synchronized with the verified `main` commit after merge.
