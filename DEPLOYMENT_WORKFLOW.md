# Deployment workflow

This project is intentionally conservative with Vercel deployments.

## Branches

- `work/*` — intermediate implementation work. **No automatic Vercel deployment.**
- `hardening/*` — internal cleanup/performance work. **No automatic Vercel deployment.**
- `preview/*` — final candidate that needs a Vercel preview after GitHub CI is green.
- `main` — production only.

## Release sequence

1. Make related changes as one batch on `work/*` or `hardening/*`.
2. Run the GitHub smoke suites and syntax checks.
3. When the batch is ready for browser validation, create/update a `preview/*` branch once.
4. Validate that single Vercel preview.
5. Merge the validated batch to `main` and verify the production deployment.

## Rules

- Do not push one commit per tiny visual change just to get another preview.
- Prefer one Git tree/commit for a related multi-file batch where practical.
- Do not deploy Special Education datasets globally; keep them on the dedicated page or lazy-load them after a special-school choice in AI Help.
- Do not merge when the homepage/mobile smoke, tutor regression, or Special Education smoke is red.
- For high-traffic periods, keep a known-good production deployment available for rollback.
