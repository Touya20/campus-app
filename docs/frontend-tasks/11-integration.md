# 11 — API integration and verification

## Objective

Exercise flows against confirmed non-production API.

## Prerequisites and dependencies

01–10; local API/database/demo login available.

## Actionable tasks

- [ ] Align CORS and start both apps.
- [ ] Walk sign-in, profile, dashboard, course, draft, submission, schedule, grades, announcements.
- [ ] Check loading/empty/error/validation/expired/throttle/not-found.
- [ ] Compare payloads to `campus-api/docs/API.md`; fix casing centrally.
- [ ] Check mobile/keyboard and resource isolation.
- [ ] Record reproduction steps.
- [ ] Never use production data.

## Expected outputs

Integration notes and resolved contract issues.

## Acceptance criteria

Critical flows work non-production; privacy checks safe; mismatches fixed or documented.

## Relevant API endpoints and database tables

Phases 03–09 routes and full schema.

## MVP versus later enhancements

MVP manual verification; later automated tests/CI/contracts/load tests.

## Assumptions and follow-up decisions

Use backend Postman collection; confirm DB non-production before mutations/seeding.


