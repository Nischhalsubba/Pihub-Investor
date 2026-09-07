# Security policy

PiHub Investor handles financial-workflow concepts and may connect to authenticated PiHub services. Treat authentication, authorization, opportunity/credit decisions, document access, deployment configuration, and financial-state transitions as security-sensitive surfaces.

## Supported surface

Security fixes are accepted for the current `main` branch, its deployment configuration, application dependencies, browser authentication/session handling, API clients, and production workflows.

High-priority reports include:

- exposed credentials, tokens, or sensitive environment configuration;
- insecure transport or production URLs;
- authentication/session bypasses;
- broken object-level authorization or cross-organization data access;
- financial or credit-state transitions that bypass server authorization or workflow validation;
- unsafe document/download access;
- cross-site scripting, request forgery, or injection paths;
- GitHub Actions or deployment privilege escalation.

## Reporting

Use GitHub private vulnerability reporting/security advisories when available. Do not open a public issue containing credentials, private financial/customer data, exploit details, or other sensitive evidence.

## Engineering expectations

- The server remains authoritative for authorization, object ownership, financial-state transitions, idempotency, and audit records. Client-side guards are defense-in-depth and UX integrity only.
- Production endpoints must use HTTPS. Local development may use localhost HTTP when intentionally configured.
- Bearer credentials must not be persisted in long-lived browser storage.
- Secrets must remain outside source control and client bundles.
- Pull requests should pass the quality workflow plus dependency and CodeQL security checks before merge.
- High-severity dependency findings must be fixed or explicitly investigated; do not weaken the audit threshold simply to make CI green.
