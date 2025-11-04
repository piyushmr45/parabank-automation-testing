# myPlaywright — ParaBank E2E

This repository contains Playwright end-to-end tests against the ParaBank demo site. It includes a complete E2E flow (registration, login, open account, transfer, bill pay) optimized for reproducible runs and CI.

What I changed to make this project ready
- Defensive global setup removed (tests run their own login/registration flows).
- Tests support a seeded-account mode (recommended for CI) or dynamic registration per run.
- Diagnostics written to `test-results/diagnostics/` on failure (HTML + screenshot).
- Added convenient npm scripts and a `.gitignore` that excludes generated artifacts and secrets.

Quick start (Windows PowerShell)

1) Install dependencies

```powershell
npm ci
```

2) Provide environment variables

- Option A (recommended for CI and stable runs): set seeded credentials and skip registration

  - Add to `.env` or set environment variables in CI:

    SEED_USERNAME=your_test_user
    SEED_PASSWORD=your_test_password
    SKIP_REGISTRATION=true

  Then run:

```powershell
npm test
```

- Option B: run registration-per-run (useful for local exploratory runs). Ensure `BASE_URL` points to the site under test.

  - `.env` example (already present in repo):
    BASE_URL=https://parabank.parasoft.com/parabank/index.htm
    USERNAME=piyush
    PASSWORD=p

  - Run (headed):

```powershell
npm run test:headed
```

Diagnostics
- If a test fails, diagnostics are saved in `test-results/diagnostics/` (HTML + PNG). These are ephemeral and intentionally ignored by git.

CI recommendations
- Use seeded credentials (set `SEED_USERNAME`/`SEED_PASSWORD` and `SKIP_REGISTRATION=true`) to avoid flaky registration flows.
- Do not commit generated artifacts (`allure-results`, `playwright-report`, `test-results`, `playwright/.auth`). These are now in `.gitignore`.

Troubleshooting
- Many failures we observed were caused by the remote ParaBank demo returning an "internal error" page during registration or login. That is a server-side issue and outside the test runner's control.
- Two reliable approaches:
  1. Use seeded credentials so tests skip registration.
  2. Run a local/mock server (I can add a static mock site if you'd like) so your CV demo is deterministic.

If you'd like, I can:
- Add a lightweight mock server and a config switch (DEV/CI) so tests can run offline.
- Create a sample GitHub Actions workflow that runs tests and uploads `allure-results` as artifacts.

---
If you want me to commit these changes to git and initialize a repository (and optionally create a GitHub repo), tell me and I will do it for you.
