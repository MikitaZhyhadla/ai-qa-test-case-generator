# Coverage Matrix

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | coverage-aggregator |
| Revision | 2 |
| Generated | 2026-09-24 17:30 |
| Inputs | 01-requirements.md, 02-functional-tests.md, 03-negative-tests.md, 04-edge-case-tests.md |

## Requirement coverage

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression | Status |
|---|---|---|---|---|---|
| AC-1 | TC-FUN-001 | - | - | - | Covered |
| AC-2 | TC-FUN-002 | TC-NEG-001, TC-NEG-002 | TC-EDGE-001, TC-EDGE-003, TC-EDGE-004 | - | Covered |
| AC-3 | TC-FUN-004 | TC-NEG-004 | - | - | Covered |
| AC-4 | TC-FUN-005 | TC-NEG-006, TC-NEG-007, TC-NEG-008 | TC-EDGE-006, TC-EDGE-010 | - | Covered |
| AC-5 | TC-FUN-007 | TC-NEG-009 | TC-EDGE-001 | - | Covered |
| AC-6 | TC-FUN-008 | - | - | - | Covered |
| AC-7 | TC-FUN-009, TC-FUN-012 | TC-NEG-011 | - | - | Covered |
| AC-8 | TC-FUN-015 | TC-NEG-012, TC-NEG-013 | - | - | Covered |
| AC-9 | TC-FUN-006 | TC-NEG-015 | TC-EDGE-002 | - | Covered |
| AC-10 | TC-FUN-014 | TC-NEG-013, TC-NEG-016 | - | - | Covered |
| AC-11 | TC-FUN-003 | TC-NEG-017, TC-NEG-018, TC-NEG-020 | TC-EDGE-003 | - | Covered |
| AC-12 | TC-FUN-016, TC-FUN-017 | TC-NEG-019, TC-NEG-020 | - | - | Covered |
| AC-13 | TC-FUN-010 | - | - | - | Covered |
| AC-14 | TC-FUN-011 | - | - | - | Covered |
| AC-15 | TC-FUN-013 | TC-NEG-021, TC-NEG-022, TC-NEG-023 | - | - | Covered |

## Impacted area coverage

Not applicable for this run - regression analysis was not selected.

## Test case inventory

| Test case | Type | Priority | Requirement refs | Artifact |
|---|---|---|---|---|
| TC-FUN-001 | Functional | High | AC-1 | 02-functional-tests.md |
| TC-FUN-002 | Functional | Critical | AC-2 | 02-functional-tests.md |
| TC-FUN-003 | Functional | Medium | AC-11 | 02-functional-tests.md |
| TC-FUN-004 | Functional | High | AC-3 | 02-functional-tests.md |
| TC-FUN-005 | Functional | High | AC-4 | 02-functional-tests.md |
| TC-FUN-006 | Functional | Medium | AC-9 | 02-functional-tests.md |
| TC-FUN-007 | Functional | Critical | AC-5 | 02-functional-tests.md |
| TC-FUN-008 | Functional | High | AC-6 | 02-functional-tests.md |
| TC-FUN-009 | Functional | Critical | AC-7 | 02-functional-tests.md |
| TC-FUN-010 | Functional | High | AC-13 | 02-functional-tests.md |
| TC-FUN-011 | Functional | Medium | AC-14 | 02-functional-tests.md |
| TC-FUN-012 | Functional | Medium | AC-7 | 02-functional-tests.md |
| TC-FUN-013 | Functional | High | AC-15 | 02-functional-tests.md |
| TC-FUN-014 | Functional | High | AC-10 | 02-functional-tests.md |
| TC-FUN-015 | Functional | High | AC-8 | 02-functional-tests.md |
| TC-FUN-016 | Functional | Medium | AC-12 | 02-functional-tests.md |
| TC-FUN-017 | Functional | Medium | AC-12 | 02-functional-tests.md |
| TC-NEG-001 | Negative | High | AC-2 | 03-negative-tests.md |
| TC-NEG-002 | Security | High | AC-2 | 03-negative-tests.md |
| TC-NEG-004 | Negative | Medium | AC-3 | 03-negative-tests.md |
| TC-NEG-006 | Negative | Medium | AC-4 | 03-negative-tests.md |
| TC-NEG-007 | Security | Critical | AC-4 | 03-negative-tests.md |
| TC-NEG-008 | Security | Critical | AC-4 | 03-negative-tests.md |
| TC-NEG-009 | Negative | High | AC-5 | 03-negative-tests.md |
| TC-NEG-011 | Security | High | AC-7 | 03-negative-tests.md |
| TC-NEG-012 | Negative | High | AC-8 | 03-negative-tests.md |
| TC-NEG-013 | Security | High | AC-8, AC-10 | 03-negative-tests.md |
| TC-NEG-015 | Negative | Medium | AC-9 | 03-negative-tests.md |
| TC-NEG-016 | Security | High | AC-10 | 03-negative-tests.md |
| TC-NEG-017 | Negative | Medium | AC-11 | 03-negative-tests.md |
| TC-NEG-018 | Negative | Medium | AC-11 | 03-negative-tests.md |
| TC-NEG-019 | Negative | High | AC-12 | 03-negative-tests.md |
| TC-NEG-020 | Negative | High | AC-11, AC-12 | 03-negative-tests.md |
| TC-NEG-021 | Negative | High | AC-15 | 03-negative-tests.md |
| TC-NEG-022 | Security | Critical | AC-15 | 03-negative-tests.md |
| TC-NEG-023 | Security | Critical | AC-15 | 03-negative-tests.md |
| TC-EDGE-001 | Boundary | High | AC-2, AC-5 | 04-edge-case-tests.md |
| TC-EDGE-002 | Boundary | High | AC-9 | 04-edge-case-tests.md |
| TC-EDGE-003 | Boundary | Medium | AC-2, AC-11 | 04-edge-case-tests.md |
| TC-EDGE-004 | Boundary | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-006 | Boundary | Medium | AC-4 | 04-edge-case-tests.md |
| TC-EDGE-010 | Equivalence | Medium | AC-4 | 04-edge-case-tests.md |

## Totals

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 3 | 8 | 6 | 0 | 17 |
| Negative | 0 | 6 | 5 | 0 | 11 |
| Security | 4 | 4 | 0 | 0 | 8 |
| Boundary | 0 | 2 | 3 | 0 | 5 |
| Equivalence | 0 | 0 | 1 | 0 | 1 |
| Regression | 0 | 0 | 0 | 0 | 0 |
| **Total** | 7 | 20 | 15 | 0 | 42 |

## Traceability findings

| Check | Gate | Status | Findings | Owner |
|---|---|---|---|---|
| T1 | G1 | Pass | - | - |
| T2 | G2 | Pass | - | - |
| T3 | G5 | Pass | - | - |
| T4 | G8 | Not applicable | Regression analysis was not selected | - |

## Notes

- Removed test cases (not counted): TC-NEG-003 (duplicate of TC-FUN-004), TC-NEG-005 (duplicate of TC-FUN-005), TC-NEG-010 (same value and outcome as TC-NEG-005), TC-NEG-014 (duplicate of TC-FUN-006).
- Removed test cases (not counted): TC-EDGE-005 (duplicate of TC-NEG-004), TC-EDGE-007 (duplicate of TC-FUN-003), TC-EDGE-008 (duplicate of TC-FUN-002), TC-EDGE-009 (duplicate of TC-FUN-005 and TC-NEG-005), TC-EDGE-011 (covered by TC-NEG-006), TC-EDGE-012 (duplicate of TC-FUN-017), TC-EDGE-013 (duplicate of TC-FUN-016), TC-EDGE-014 (duplicate of TC-FUN-012).
- AC-1, AC-6, AC-13, and AC-14 have no Negative / Security case because their `Negative testing` value is Not applicable.
- Revision 2 rebuilt after retry of negative-test-planner (revision 2) and edge-case-planner (revision 2).
