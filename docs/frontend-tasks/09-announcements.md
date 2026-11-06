# 09 — Announcements and read state

## Objective

Show visible campus/course posts and own read state.

## Prerequisites and dependencies

01–05; fixtures for both audiences.

## Actionable tasks

- [ ] Build newest-first paged feed and optional course filter.
- [ ] Add detail and inaccessible state.
- [ ] Mark read on open or action per UX decision; reflect own state.
- [ ] Preserve filters on back.
- [ ] Render as text (no arbitrary HTML).
- [ ] Add loading/empty/error.

## Expected outputs

Announcement feed/detail/read UI.

## Acceptance criteria

Audience-scoped; read update idempotent; no other student's state displayed.

## Relevant API endpoints and database tables

`GET /announcements`, `/:announcementId`, `POST /:announcementId/read`; announcements/reads/enrollments/courses.

## MVP versus later enhancements

MVP list/detail/read; later pinning/scheduling/push/authoring.

## Assumptions and follow-up decisions

Null course means campus-wide; course filter omits campus-wide; immediate publishing.


