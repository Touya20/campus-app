# Campus Student Portal — Frontend task breakdown

For the existing `campus-app` React + TypeScript + Vite scaffold and sibling `campus-api`. This is Campus Student Portal, not Owlio.

## Recommended task order

1. [00 — Overview and prerequisites](00-overview.md)
2. [01 — Project setup and API foundation](01-project-setup.md)
3. [02 — Design system and application layout](02-design-layout.md)
4. [03 — Sign-in and session](03-authentication.md)
5. [04 — Dashboard and profile](04-dashboard-profile.md)
6. [05 — Courses, modules, materials](05-courses.md)
7. [06 — Assignments, drafts, submissions](06-assignments.md)
8. [07 — Weekly schedule](07-schedule.md)
9. [08 — Released grades](08-grades.md)
10. [09 — Announcements and read state](09-announcements.md)
11. [10 — Security, validation, accessibility](10-security-accessibility.md)
12. [11 — API integration and verification](11-integration.md)
13. [12 — Deployment and hand-off](12-deployment.md)

Phases 04–09 may proceed in parallel after shared API/auth/layout foundation. Security and accessibility run continuously.

## Shared assumptions

- Preserve existing React, TypeScript, Vite, React Router, and Tailwind scaffold.
- Local API: `http://localhost:7000/api/v1`; set public `VITE_API_BASE_URL`.
- Follow `campus-api/docs/API.md` and `docs/FRONTEND_INTEGRATION.md`; normalize mixed field casing in one adapter.
- JWT remains memory-only; no refresh endpoint; reload requires sign-in.
- Submission is text-only. Never expose `DATABASE_URL` or `JWT_SECRET` to browser code.
- No Figma design was inspected.

## Unresolved assumptions

Confirm whether registration is shown, campus branding, browser/language support, campus timezone, production host/domain/API URL, and release owner. Assign owners and record decisions before dependent work. Use non-production data for integration.

