# 03 — Sign-in and session

## Objective

Implement student login, protected routes, and logout.

## Prerequisites and dependencies

01–02; reachable API and non-production account.

## Actionable tasks

- [ ] Build accessible email/password form.
- [ ] Call `POST /auth/login`; normalize user/token.
- [ ] Keep JWT in memory only and attach bearer header centrally.
- [ ] Validate in-memory token with `GET /auth/me`.
- [ ] On 401 clear token and return to login.
- [ ] Logout via `/auth/logout` then clear token.
- [ ] Guard private pages.
- [ ] Registration UI only if approved, no role field.

## Expected outputs

Auth state, sign-in page, route guards, logout.

## Acceptance criteria

Valid login works; safe invalid/throttle messages; private routes guarded; reload requires sign-in; logout clears token.

## Relevant API endpoints and database tables

`POST /auth/login`, `GET /auth/me`, `POST /auth/logout`, optional `/auth/register`; `users`.

## MVP versus later enhancements

MVP memory token; later refresh/reset/MFA/SSO.

## Assumptions and follow-up decisions

No refresh endpoint; 15m default. Never persist credentials or token.


