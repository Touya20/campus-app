# 08 — Released grades

## Objective

Display released results and points summary accurately.

## Prerequisites and dependencies

01–06; released-grade fixtures.

## Actionable tasks

- [ ] Build grade list/course view.
- [ ] Show assignment, score, possible points, feedback, date.
- [ ] Add API summary including courses without grades.
- [ ] Format decimal strings.
- [ ] Distinguish empty from error.
- [ ] Never infer grades or label points percentage GPA.

## Expected outputs

Grades views and points summary.

## Acceptance criteria

No unreleased results; totals match API; no GPA claim.

## Relevant API endpoints and database tables

`GET /grades`, `/grades/:courseId`, `/grades/summary`; grades/submissions/assignments/courses/enrollments.

## MVP versus later enhancements

MVP released grades; later GPA/transcript/weighting.

## Assumptions and follow-up decisions

Percentage is points ratio; null when no possible points.


