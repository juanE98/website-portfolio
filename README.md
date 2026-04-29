# Website Portfolio
![Next.js](https://img.shields.io/badge/next.js-15-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
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

- `npm test` — Jest unit tests (`tests/unit/`).
- `npm run test:e2e` — Playwright E2E tests (`tests/e2e/`).

## Project layout

```
src/
  app/
    layout.tsx              Root layout — Work Sans + JetBrains Mono via next/font
    page.tsx                Home page — composes section components
    fpl/page.tsx            FPL Predictions route
    globals.scss            Theme tokens, body texture, shared keyframes
  components/
    Header/                 Fixed nav, JE logo, IO-driven active section, mobile drawer
    Home/                   Hero — boot sequence, typewriter, portrait + circuit ring
    About/                  Section header + framed photo + prose + facts <dl>
    ImageCarousel/          Tech marquee + interactive focus card (Simple Icons CDN)
    Timeline/               Experience — vertical timeline with scroll-driven lit spine
    Projects/               Featured FPL Serverless API + editable mock IDE (3 tabs)
    Footer/                 "Let's chat." + email + LinkedIn / GitHub icon buttons
    FplPredictions/         Terminal-style table for the /fpl page
  hooks/
    useTypingAnimation      Cycles the hero typewriter
    useScrollVisibility     IO toggle of in-view / out-of-view classes
    useHeaderVisibility     Hide-on-scroll / show-on-scroll-up
    useScrollProgress       0..1 progress for the timeline lit spine
    useFplPredictions       SWR-cached fetch of /top?gameweek&position
    useLatestGameweek       SWR-cached fetch of /gameweek/latest
  data/timelineEvents.ts    Roles + education entries (newest first)
  styles/_variables.scss    SCSS color tokens (+ legacy aliases)
  types/fpl.ts              FplPlayer, Position
  config/api.ts             FPL_API_URL from env
public/assets/              Photos, icons, fonts
```

## FPL API

The FPL page is wired to a serverless backend. The client never holds an API key — the API Gateway is locked to the deployed origin via CORS + Usage Plans.

- `.env.local` → `NEXT_PUBLIC_FPL_API_URL` for local dev
- GitHub Actions secret of the same name for deployed builds
- Endpoints used:
  - `GET /gameweek/latest` → `{ gameweek }`
  - `GET /top?gameweek={gw}&position={pos}&limit=15&sort_by=haul&available_only=true` → `{ predictions: FplPlayer[] }`

## Deployment

- CI/CD via GitHub Actions. Pushes to `main` build and deploy the static export to GitHub Pages.

## Backlog

- Add `next_fixture` to the FPL API and surface a `Next` opponent column on the predictions table to match the design 1:1.
- Real GitHub repo URL for the FPL Serverless API project card (currently links to the user profile).
