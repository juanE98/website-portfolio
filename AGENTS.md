# Repository Guidelines

## Project Structure & Module Organization

This is a statically exported Next.js portfolio. Routes and global styles live in `src/app/`; reusable UI is grouped by feature under `src/components/`, usually with a colocated `Component.module.scss`. Hooks, configuration, shared types, and static data belong in `src/hooks/`, `src/config/`, `src/types/`, and `src/data/`. Public images, icons, and local fonts are in `public/assets/`. Jest tests live in `tests/unit/`, while Playwright journeys live in `tests/e2e/`. Production output is generated in `out/` and should not be hand-edited.

## Build, Test, and Development Commands

- `npm ci` installs the locked dependency set (Node 20 is used in CI).
- `npm run dev` starts local development; open `http://localhost:3000/website-portfolio` because the app uses that base path.
- `npm run build` type-checks and creates the static export in `out/`.
- `npm run lint` runs the Next.js ESLint configuration.
- `npm test` runs Jest unit tests; `npm run test:watch` reruns them during development.
- `npm run test:e2e` builds and exercises both Chromium desktop and mobile projects. Add `-- --project=chromium` for a faster desktop-only run.

## Coding Style & Naming Conventions

Use strict TypeScript, functional React components, two-space indentation, single quotes, and semicolons, matching nearby files. Name components and component directories in PascalCase (`FplPredictions/FplPredictions.tsx`), hooks with a `use` prefix, and SCSS modules `Component.module.scss`. Prefer the `@/` alias for imports from `src/`. Keep styling component-scoped; shared colours belong in `src/styles/_variables.scss`. Preserve the static-export and `/website-portfolio` base-path assumptions when adding routes or asset URLs.

## Testing Guidelines

Use Jest with React Testing Library for components, hooks, and data logic; name files `*.test.ts` or `*.test.tsx`. Use Playwright for navigation, responsive behaviour, accessibility, and deployed-path integration; name files `*.spec.ts`. Run `npm test` and the relevant Playwright project before handing off changes. There is no numeric coverage gate, but new behaviour should include focused regression coverage.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit-style subjects such as `fix: ...`, `perf(mobile): ...`, and `chore(security): ...`. Keep the subject imperative, concise, and scoped when useful. Do not commit on behalf of the maintainer; provide a suggested commit message after tests pass. Pull requests should explain the change and validation performed, link relevant issues, and include before/after screenshots for visual work. Call out environment, CSP, or deployment changes explicitly.

## Security & Configuration

Keep API configuration in `NEXT_PUBLIC_FPL_API_URL`; never commit `.env.local` or secrets. When adding an external origin, update the CSP in `src/app/layout.tsx`. External links opened in a new tab must use `rel="noopener noreferrer"`.
