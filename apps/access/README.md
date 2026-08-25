# Access application target

This directory reserves the future shared PiHub access application.

Target responsibility:

- present the PiHub module/workspace selector;
- authenticate users through the approved shared server session/SSO contract;
- read server-authorized module access;
- route users to the correct independently deployed application;
- handle safe return/continuation destinations without placing credentials or tokens in URLs.

The access application must not contain Borrower, Investor or Advisory business screens. It is an entry and identity surface, not a fourth business module.

Current state: **scaffold only**. The production Investor login remains in `/app` until a dedicated access/auth migration is implemented and verified.

Target origin: `https://access.pihub-pi.com`.
