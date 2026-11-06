# 10 — Security, validation, accessibility

## Objective

Apply client safeguards and accessible patterns throughout.

## Prerequisites and dependencies

01–09 ongoing; final review before release.

## Actionable tasks

- [ ] Route protected requests through shared token client.
- [ ] Client validate for UX
- [ ] API enforces rules.
- [ ] Render text safely.
- [ ] Never persist/log token, password, PII.
- [ ] Handle 400/401/403/404/429 safely.
- [ ] Audit link protocols, keyboard, labels, focus, contrast, zoom, async announcements.
- [ ] Backend remains authorization authority.

## Expected outputs

Security/accessibility review and fixes.

## Acceptance criteria

No secrets persisted/logged; critical flows keyboard accessible; errors reveal no internals.

## Relevant API endpoints and database tables

All `/api/v1/*`; all student data tables.

## MVP versus later enhancements

MVP safe handling/accessibility; later formal audits/CSP/monitoring.

## Assumptions and follow-up decisions

Client validation is not authorization.


