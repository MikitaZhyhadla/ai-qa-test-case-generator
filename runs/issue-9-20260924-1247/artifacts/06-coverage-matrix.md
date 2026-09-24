# Coverage Matrix

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | coverage-aggregator |
| Revision | 3 |
| Generated | 2026-09-24 14:00 |
| Inputs | 01-requirements.md, 02-functional-tests.md, 03-negative-tests.md, 04-edge-case-tests.md |

## Requirement coverage

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression | Status |
|---|---|---|---|---|---|
| AC-1 | TC-FUN-001 | TC-NEG-001, TC-NEG-002, TC-NEG-003 | TC-EDGE-001, TC-EDGE-002, TC-EDGE-003, TC-EDGE-004, TC-EDGE-017 | - | Covered |
| AC-2 | TC-FUN-002, TC-FUN-003 | TC-NEG-003, TC-NEG-004, TC-NEG-005 | TC-EDGE-005, TC-EDGE-006, TC-EDGE-007, TC-EDGE-008, TC-EDGE-009 | - | Covered |
| AC-3 | TC-FUN-004 | TC-NEG-006 | - | - | Covered |
| AC-4 | TC-FUN-005 | TC-NEG-007, TC-NEG-008 | - | - | Covered |
| AC-5 | TC-FUN-006, TC-FUN-014 | TC-NEG-009, TC-NEG-010, TC-NEG-011, TC-NEG-014 | - | - | Covered |
| AC-6 | TC-FUN-008, TC-FUN-009 | TC-NEG-012, TC-NEG-013, TC-NEG-014 | TC-EDGE-011 | - | Covered |
| AC-7 | TC-FUN-010 | TC-NEG-015 | - | - | Covered |
| AC-8 | TC-FUN-011, TC-FUN-014 | TC-NEG-016, TC-NEG-017, TC-NEG-018 | TC-EDGE-014, TC-EDGE-015, TC-EDGE-018, TC-EDGE-019 | - | Covered |
| AC-9 | TC-FUN-013 | TC-NEG-018, TC-NEG-019, TC-NEG-020 | TC-EDGE-016, TC-EDGE-020 | - | Covered |
| AC-10 | TC-FUN-007 | - | - | - | Covered |
| AC-11 | TC-FUN-012 | - | - | - | Covered |

## Impacted area coverage

Not applicable for this run - regression analysis was not selected.

## Test case inventory

| Test case | Type | Priority | Requirement refs | Artifact |
|---|---|---|---|---|
| TC-FUN-001 | Functional | High | AC-1 | 02-functional-tests.md |
| TC-FUN-002 | Functional | High | AC-2 | 02-functional-tests.md |
| TC-FUN-003 | Functional | Medium | AC-2 | 02-functional-tests.md |
| TC-FUN-004 | Functional | Medium | AC-3 | 02-functional-tests.md |
| TC-FUN-005 | Functional | High | AC-4 | 02-functional-tests.md |
| TC-FUN-006 | Functional | Critical | AC-5 | 02-functional-tests.md |
| TC-FUN-007 | Functional | High | AC-10 | 02-functional-tests.md |
| TC-FUN-008 | Functional | High | AC-6 | 02-functional-tests.md |
| TC-FUN-009 | Functional | Medium | AC-6 | 02-functional-tests.md |
| TC-FUN-010 | Functional | Critical | AC-7 | 02-functional-tests.md |
| TC-FUN-011 | Functional | High | AC-8 | 02-functional-tests.md |
| TC-FUN-012 | Functional | Medium | AC-11 | 02-functional-tests.md |
| TC-FUN-013 | Functional | High | AC-9 | 02-functional-tests.md |
| TC-FUN-014 | Functional | Medium | AC-5, AC-8 | 02-functional-tests.md |
| TC-NEG-001 | Negative | High | AC-1 | 03-negative-tests.md |
| TC-NEG-002 | Negative | Medium | AC-1 | 03-negative-tests.md |
| TC-NEG-003 | Security | High | AC-1, AC-2 | 03-negative-tests.md |
| TC-NEG-004 | Negative | High | AC-2 | 03-negative-tests.md |
| TC-NEG-005 | Negative | Medium | AC-2 | 03-negative-tests.md |
| TC-NEG-006 | Negative | High | AC-3 | 03-negative-tests.md |
| TC-NEG-007 | Negative | High | AC-4 | 03-negative-tests.md |
| TC-NEG-008 | Security | High | AC-4 | 03-negative-tests.md |
| TC-NEG-009 | Negative | Medium | AC-5 | 03-negative-tests.md |
| TC-NEG-010 | Negative | High | AC-5 | 03-negative-tests.md |
| TC-NEG-011 | Security | Critical | AC-5 | 03-negative-tests.md |
| TC-NEG-012 | Negative | High | AC-6 | 03-negative-tests.md |
| TC-NEG-013 | Security | High | AC-6 | 03-negative-tests.md |
| TC-NEG-014 | Security | Critical | AC-5, AC-6 | 03-negative-tests.md |
| TC-NEG-015 | Negative | Critical | AC-7 | 03-negative-tests.md |
| TC-NEG-016 | Negative | Medium | AC-8 | 03-negative-tests.md |
| TC-NEG-017 | Security | Critical | AC-8 | 03-negative-tests.md |
| TC-NEG-018 | Security | High | AC-8, AC-9 | 03-negative-tests.md |
| TC-NEG-019 | Negative | High | AC-9 | 03-negative-tests.md |
| TC-NEG-020 | Negative | High | AC-9 | 03-negative-tests.md |
| TC-EDGE-001 | Boundary | High | AC-1 | 04-edge-case-tests.md |
| TC-EDGE-002 | Boundary | High | AC-1 | 04-edge-case-tests.md |
| TC-EDGE-003 | Boundary | High | AC-1 | 04-edge-case-tests.md |
| TC-EDGE-004 | Boundary | High | AC-1 | 04-edge-case-tests.md |
| TC-EDGE-005 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-006 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-007 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-008 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-009 | Equivalence | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-011 | Boundary | High | AC-6 | 04-edge-case-tests.md |
| TC-EDGE-014 | Boundary | High | AC-8 | 04-edge-case-tests.md |
| TC-EDGE-015 | Boundary | High | AC-8 | 04-edge-case-tests.md |
| TC-EDGE-016 | Boundary | High | AC-9 | 04-edge-case-tests.md |
| TC-EDGE-017 | Boundary | Medium | AC-1 | 04-edge-case-tests.md |
| TC-EDGE-018 | Boundary | Medium | AC-8 | 04-edge-case-tests.md |
| TC-EDGE-019 | Boundary | Medium | AC-8 | 04-edge-case-tests.md |
| TC-EDGE-020 | Boundary | Medium | AC-9 | 04-edge-case-tests.md |

## Totals

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 2 | 7 | 5 | 0 | 14 |
| Negative | 1 | 8 | 4 | 0 | 13 |
| Security | 3 | 4 | 0 | 0 | 7 |
| Boundary | 0 | 12 | 4 | 0 | 16 |
| Equivalence | 0 | 0 | 1 | 0 | 1 |
| Regression | 0 | 0 | 0 | 0 | 0 |
| **Total** | 6 | 31 | 14 | 0 | 51 |

## Traceability findings

| Check | Gate | Status | Findings | Owner |
|---|---|---|---|---|
| T1 | G1 | Pass | - | - |
| T2 | G2 | Pass | - | - |
| T3 | G5 | Pass | - | - |
| T4 | G8 | Not applicable | Regression analysis was not selected | - |

## Notes

- Removed test cases (not counted in the inventory): TC-EDGE-010 (Removed: duplicate of TC-FUN-006), TC-EDGE-012 (Removed: duplicate of TC-FUN-008), TC-EDGE-013 (Removed: duplicate of TC-FUN-008 and overlap with TC-EDGE-012).
- AC-10 and AC-11 have `Negative testing` = Not applicable, so a missing Negative / Security case is not a T3 failure.
- Rebuild after retry of functional-test-planner and negative-test-planner (rev 2, priority changes only): TC-FUN-010 and TC-NEG-015 are now Critical.
