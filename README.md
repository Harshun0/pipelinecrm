# Opportunity Hub (PipelineCRM)

A lightweight sales pipeline app for tracking opportunities from first contact through close. Built with TanStack Start, React, and Tailwind CSS, with a separate Express + MongoDB API.

## Features

- User registration and JWT authentication (2-hour session)
- Opportunity dashboard with search
- Create, edit, and delete opportunities
- Responsive UI with shadcn/ui components

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), React 19, Tailwind CSS 4 |
| Deployment | [Nitro](https://nitro.build) (Vercel) |
| Backend | Express, Mongoose, in-memory MongoDB for local dev |

## Project structure

```
opportunity-hub/     # Frontend (this repo)
backend/             # REST API (sibling folder in monorepo)
```

## Prerequisites

- Node.js 20+
- npm (or pnpm / bun)

## Local development

### 1. Backend API

```bash
cd ../backend
cp .env.example .env
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

### 2. Frontend

```bash
cd opportunity-hub
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:5000` in `.env`.

The app runs at `http://localhost:8080` by default (falls back to the next free port if 8080 is taken). The backend must be running separately on port 5000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build (Nitro + Vite) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Deploy to Vercel

This project uses the [Nitro Vite plugin](https://vercel.com/docs/frameworks/full-stack/tanstack-start) so TanStack Start runs on Vercel Functions.

1. Import the `opportunity-hub` directory as a Vercel project.
2. Framework preset: **Other** (or auto-detected via Nitro).
3. Build command: `npm run build`
4. Output directory: leave default (Nitro handles output).
5. Add environment variable:
   - `VITE_API_URL` — your deployed backend URL (e.g. `https://your-api.example.com`)

Deploy the backend separately (Railway, Render, Fly.io, etc.) and point the frontend at it.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL of the backend API |

## API routes (backend)

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/opportunities` | List opportunities |
| POST | `/api/opportunities` | Create opportunity |
| PUT | `/api/opportunities/:id` | Update opportunity |
| DELETE | `/api/opportunities/:id` | Delete opportunity |

All opportunity routes require a `Bearer` token from login.

## License

Private — all rights reserved.
