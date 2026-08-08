# Website Portfolio
![Next.js](https://img.shields.io/badge/next.js-16-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-19-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5.7-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Build Status](https://github.com/juanE98/website-portfolio/actions/workflows/deploy.yml/badge.svg)

> **Note:** This project was migrated from Angular to Next.js. The original Angular project can be found at [website-portfolio-angular](https://github.com/juanE98/website-portfolio-angular).

Personal portfolio with a backend/terminal-themed dark UI: cyan + amber accents on a near-black background, JetBrains Mono for command-line / code chrome, Gugi + Work Sans for display + body copy. Includes a featured **FPL Predictions** page backed by a serverless API.

## Development server

The site is configured with `basePath: /website-portfolio`, so the dev URL lives **under that prefix** — the bare root will 404.

- `npm run dev` — start the dev server. Open **http://localhost:3000/website-portfolio** (and **/website-portfolio/fpl** for the FPL page). Hot-reload is on for source changes.
- `npm run dev -- -H 0.0.0.0` — host on your local network instead of localhost.

If the browser still shows old content after pulling new changes, clear the Next cache: `rm -rf .next` and restart the dev server.

## Build

- `npm run build` — produce the static export in `out/`.
- `npm start` — serve the production build (after `build`).

## Testing

- `npm audit` - fail if any installed dependency has a known vulnerability.
- `npm run lint` - run ESLint with the Next.js Core Web Vitals and TypeScript rules.
- `npm test` — Jest unit tests (`tests/unit/`).
- `npm run test:e2e` — Playwright desktop and mobile regression tests (`tests/e2e/`).

## FPL Predictions

The `/fpl` page renders predictions from a separate serverless backend. Configuration is environment-driven.

## Deployment

CI/CD via GitHub Actions. Pushes to `main` build the static export and deploy it to GitHub Pages. The workflow runs with read-only permissions by default; only the deploy job holds the elevated `pages: write` / `id-token: write` scopes.

## Security

GitHub Pages can't set HTTP response headers, so security headers are delivered as `<meta>` tags in the root layout:

- **Content-Security-Policy** — locked-down `default-src 'self'` policy with explicit allowances for the icon CDN (`img-src`) and the FPL API origin (`connect-src`, derived from `NEXT_PUBLIC_FPL_API_URL` at build time). `'unsafe-inline'` scripts are required by Next.js hydration on a static export.
- **Referrer-Policy** — `strict-origin-when-cross-origin`.

Dependencies are kept CVE-free via `npm audit`, with an `overrides` pin in `package.json` where a transitive dependency needs a floor version.
