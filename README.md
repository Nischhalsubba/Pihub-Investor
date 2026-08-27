<div align="center">

# PiHub Investor

**Standalone investor workspace for opportunity review, underwriting, portfolio context and investor-side transaction workflows.**

![Top language](https://img.shields.io/github/languages/top/Nischhalsubba/Pihub-Investor?style=flat-square)
![Last commit](https://img.shields.io/github/last-commit/Nischhalsubba/Pihub-Investor/main?style=flat-square)
![Repo size](https://img.shields.io/github/repo-size/Nischhalsubba/Pihub-Investor?style=flat-square)

[Production](https://pihub-investor.vercel.app) · [Issues](https://github.com/Nischhalsubba/Pihub-Investor/issues)

</div>

## Repository boundary

`Pihub-Investor` owns the **Investor application only**. Borrower, Advisory, Admin and Access are separate applications and belong in their own repositories and deployment projects.

The production application lives in `/app`. The repository-level `vercel.json` intentionally installs, builds and publishes only `/app`.

## What belongs here

- investor authentication and account surfaces
- investor dashboard and opportunity discovery
- investor requests, portfolio and investment detail workflows
- investor-side module handoff/navigation integration
- Investor design system, accessibility and browser QA
- Investor Vercel production configuration

## What does not belong here

- Borrower application source
- Advisory application source
- Admin application source
- Access gateway source
- cross-application monorepo workspaces or Turborepo orchestration
- Vercel bootstrap logic for other applications

## Development

```bash
git clone https://github.com/Nischhalsubba/Pihub-Investor.git
cd Pihub-Investor/app
npm ci --legacy-peer-deps
npm run dev
```

Quality gates:

```bash
npm run check:styles
npm run check:i18n
npm run check:platform
npm run test:unit
npm run build
npm run test:e2e
```

## Deployment

Vercel project: `pihub-investor`

Production branch: `main`

Repository Root Directory: `.`. The root `vercel.json` delegates installation/build/output to `/app`, so other PiHub applications cannot accidentally be deployed from this repository.
