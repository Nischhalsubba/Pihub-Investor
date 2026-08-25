# Platform package

Future home for module metadata and shared platform contracts that are independent of any one PiHub application.

Phase 1 keeps the executable module registry inside `/app/src/_platform` so production can evolve without changing Vercel's build root. Extraction into this package happens only after the repository workspace is introduced and the Investor parity gate is green.
