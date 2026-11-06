# 07 — Weekly schedule

## Objective

Show recurring classes in campus timezone.

## Prerequisites and dependencies

01–05; timezone configured or from response.

## Actionable tasks

- [ ] Render weekly/list view.
- [ ] Display course, weekday, times, room, instructor, safe meeting URL.
- [ ] Read `meta.timeZone`; map PG weekday 0–6.
- [ ] Add validated previous/next week with `weekOf`; show empty state and scheduled date.
- [ ] Use daily groups on mobile.

## Expected outputs

Schedule and week navigation.

## Acceptance criteria

Times/day match metadata; invalid dates handled; empty weeks clear.

## Relevant API endpoints and database tables

`GET /schedule`, `/schedule/week?weekOf=`; class_sessions/courses/enrollments/semesters.

## MVP versus later enhancements

MVP weekly recurring; later calendar export/holidays/conflicts.

## Assumptions and follow-up decisions

Week Monday–Sunday; use API timezone.


