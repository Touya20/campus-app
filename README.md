# Campus Student Portal

The Campus Student Portal frontend uses React, TypeScript, and Vite. It connects to the Laravel API in the sibling `campus-api-laravel` folder through the shared Axios client in `src/lib/axios.js`. Pages use backend responses rather than local demo fixtures.

## Local setup

1. Install dependencies with `npm install`.
2. Keep `VITE_API_BASE_URL=/api/v1` in `.env.local` (or copy `.env.example`). Vite proxies API requests to `http://127.0.0.1:8000` during development.
3. Configure the Laravel `.env` with Neon PostgreSQL credentials and enable PHP `pdo_pgsql`. See `campus-api-laravel/README.md` for backend setup.
4. Start Laravel from `campus-api-laravel` with `php artisan serve --host=127.0.0.1 --port=8000`.
5. Start the frontend here with `npm run dev` and open the Vite URL.

For a deployed frontend, set `VITE_API_BASE_URL` to the public HTTPS API base, such as `https://api.example.edu/api/v1`, and set Laravel's `CLIENT_ORIGIN` to the exact deployed frontend origin.

## Screens

Sign-in and student registration, dashboard, courses and materials, assignments with text drafts/submissions, weekly schedule, announcements, released grades, and profile.

JWT access tokens are stored in `sessionStorage` and sent as bearer tokens by the Axios client. Password reset and assignment file uploads are not available in the current API.

## Security

`VITE_API_BASE_URL` is public browser configuration. Never put `DATABASE_URL`, `JWT_SECRET`, or other server credentials in a `VITE_` variable.
