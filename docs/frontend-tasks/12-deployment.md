# 12 — Deployment and hand-off

## Objective

Prepare static app release and operational notes.

## Prerequisites and dependencies

01–11; host/domain/API URL decided.

## Actionable tasks

- [ ] Set public HTTPS `VITE_API_BASE_URL`; match backend `CLIENT_ORIGIN`.
- [ ] Build and inspect for secrets/demo credentials/local URLs.
- [ ] Configure SPA fallback.
- [ ] Document environment/build/smoke check and rollback owner.
- [ ] Confirm production registration policy; never seed production.
- [ ] Record known issues.

## Expected outputs

Deployable frontend and hand-off guide.

## Acceptance criteria

Build succeeds; nested routes work; CORS exact; no secrets/demo data shipped.

## Relevant API endpoints and database tables

Production API `/api/v1`; no direct DB.

## MVP versus later enhancements

MVP static hosting; later CI/CD/monitoring/CDN.

## Assumptions and follow-up decisions

Hosting/domain/API URL/deployment owner need product decisions.


