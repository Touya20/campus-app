# Campus Student Portal

The Campus Student Portal frontend uses React, TypeScript, and Vite. It connects to the sibling Express API.

## Local setup

1. Install dependencies with `npm install`.
2. Keep `VITE_API_BASE_URL=/api/v1` in `.env.local` (or copy `.env.example`). Vite proxies API requests to `http://127.0.0.1:7000` during development.
3. Start the backend in `campus-api` with `npm run dev`.
4. Start the frontend here with `npm run dev` and open the Vite URL.

For a deployed frontend, set `VITE_API_BASE_URL` to the public HTTPS API base, such as `https://api.example.edu/api/v1`, and set the backend `CLIENT_ORIGIN` to the exact deployed frontend origin.

## Screens

Sign-in and student registration, dashboard, courses and materials, assignments with text drafts/submissions, weekly schedule, announcements, released grades, and profile.

JWT access tokens are held in memory only. Reloading the page requires signing in again. Password reset and assignment file uploads are not available in the current API.

## Security

`VITE_API_BASE_URL` is public browser configuration. Never put `DATABASE_URL`, `JWT_SECRET`, or other server credentials in a `VITE_` variable.
