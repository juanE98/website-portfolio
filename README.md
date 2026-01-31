# Website Portfolio
![Next.js](https://img.shields.io/badge/next.js-15-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-19-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/typescript-5.7-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Build Status](https://github.com/juanE98/website-portfolio/actions/workflows/deploy.yml/badge.svg)

> **Note:** This project was migrated from Angular to Next.js. The original Angular project can be found at [website-portfolio-angular](https://github.com/juanE98/website-portfolio-angular).

## Development server

- Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The application will automatically reload if you change any of the source files.

- Add the `-H 0.0.0.0` flag to host it in your local network: `npm run dev -- -H 0.0.0.0`

## Build

- Run `npm run build` to build the project. The build artifacts will be stored in the `out/` directory (static export).

## Testing

- Run `npm test` to run unit tests with Jest
- Run `npm run test:e2e` to run end-to-end tests with Playwright

## Deployment

- CI/CD is implemented with Github Actions. The workflow will be triggered by any push to the Main branch and then deployed automatically to Github Pages.

## Backlog
- Create backend to provide some stats, host on AWS
