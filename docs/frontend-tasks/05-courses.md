# 05 — Courses, modules, materials

## Objective

Browse enrolled courses and approved materials.

## Prerequisites and dependencies

01–04; fixtures available.

## Actionable tasks

- [ ] Build paged course list; detail; ordered modules; materials.
- [ ] Use API instructor fields only when present.
- [ ] Handle inaccessible ID as not found.
- [ ] Link only returned approved URLs; null URL is unavailable.
- [ ] Safe external links and responsive layout.

## Expected outputs

Course list/detail/modules/materials screens.

## Acceptance criteria

Only returned courses display; stable order; no link for null URL; inaccessible ID safely handled.

## Relevant API endpoints and database tables

`GET /courses`, `/:courseId`, `/:courseId/modules`, `/:courseId/materials`; courses/enrollments/semesters/modules/materials.

## MVP versus later enhancements

MVP read-only; later search/discussion/authoring/file hosting.

## Assumptions and follow-up decisions

Backend filters enrollment and allowlists HTTPS material hosts.


