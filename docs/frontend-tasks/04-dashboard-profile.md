# 04 — Dashboard and profile

## Objective

Connect student landing metrics and editable own profile.

## Prerequisites and dependencies

01–03; migrated non-production demo fixtures.

## Actionable tasks

- [ ] Fetch dashboard summary/upcoming/recent announcements.
- [ ] Show counts/deadlines/news and loading/empty/error.
- [ ] Read `/students/me`; edit only fullName/program/yearLevel/section.
- [ ] PATCH allowed fields; show validation/success.
- [ ] Never edit student number/email/role/enrollment.
- [ ] Normalize casing in adapter.

## Expected outputs

Dashboard and profile pages.

## Acceptance criteria

Values match API; allowed edits persist; protected fields absent from form; errors safe.

## Relevant API endpoints and database tables

`GET /dashboard`, `/dashboard/upcoming`, `/dashboard/recent-announcements`, `GET/PATCH /students/me`; users/profiles/enrollments/assignments/announcements.

## MVP versus later enhancements

MVP summary/profile; later attendance/GPA trends/widgets.

## Assumptions and follow-up decisions

Dashboard uses active semester; mixed API casing.


