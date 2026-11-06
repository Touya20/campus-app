# 06 — Assignments, drafts, submissions

## Objective

Implement text-only assignment work lifecycle.

## Prerequisites and dependencies

01–05; understand API submission rules.

## Actionable tasks

- [ ] List/detail and due/status UI.
- [ ] Load/save text drafts; allow update/delete with confirmation.
- [ ] Submit text and prevent repeat clicks.
- [ ] Show status/late/time; display own submission.
- [ ] Preserve editor on recoverable failure.
- [ ] Explain drafts removed on submit and graded work locked.
- [ ] No uploads.

## Expected outputs

Assignment list/detail and text draft/submission UI.

## Acceptance criteria

Student-scoped; repeated clicks safe; API status authoritative; no upload control.

## Relevant API endpoints and database tables

`GET /assignments`, `/upcoming`, `/:id`; draft GET/POST/PATCH/DELETE; submission POST and `/submissions/me`; assignments/drafts/submissions/enrollments.

## MVP versus later enhancements

MVP text lifecycle; later private uploads/history/plagiarism/feedback.

## Assumptions and follow-up decisions

Late accepted by DB time; changed resubmission replaces until graded; identical retry idempotent.


