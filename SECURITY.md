# Security baseline

PiHub Investor treats authentication, authorization, financial integrity, dependency security, and controlled production release as independent verification boundaries.

## Repository and CI controls

- Pull requests and `main` run the independent Security workflow.
- Repository hygiene rejects tracked runtime `.env` files and committed private-key material.
- CodeQL analyzes JavaScript/TypeScript with least-privilege workflow permissions.
- Production dependencies are installed from the committed lockfile and `npm audit --omit=dev --audit-level=high` blocks high and critical runtime findings.
- Ordinary feature, maintenance, and security changes do not authorize production deployment.
- The protected manual release workflow remains the only production release path.

## 2026-09-02 runtime dependency remediation

The first blocking production dependency audit identified:

- React Router advisories through the aliased `react-router-dom-v6@6.30.1` path.
- `counterpart@0.18.6`, which was used as a narrow English/German dictionary runtime and has an unfixed prototype-pollution advisory.

The security baseline remediation:

- upgraded the React Router v6 alias to `react-router-dom@6.30.6` using npm so package-lock integrity and transitive resolution were regenerated normally;
- removed `counterpart` and replaced its small runtime role with a local PiHub translator that uses the existing English/German dictionaries, rejects unsafe prototype-path segments, supports the interpolation/plural behavior needed by the application, and falls back safely to English;
- changed the i18n architecture check so vulnerable or deprecated translation runtimes, including `counterpart`, cannot be silently reintroduced;
- verified the resulting production dependency graph with the blocking audit before committing the regenerated lockfile.

Do not hand-edit `package-lock.json`, use broad `npm audit fix --force`, or suppress production vulnerability findings merely to make CI green.

## Financial application rule

Client-side visibility and route guards are user experience, not authorization. Authoritative financial values and state transitions must be validated or calculated by trusted server-side/data-layer controls, and cross-user or cross-role access must be denied independently of the frontend.
