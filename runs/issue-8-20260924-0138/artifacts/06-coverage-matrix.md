# Coverage Matrix

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | coverage-aggregator |
| Revision | 3 |
| Generated | 2026-09-24 05:00 |
| Inputs | 01-requirements.md, 02-functional-tests.md, 03-negative-tests.md, 04-edge-case-tests.md, 05-regression-impact.md |

## Requirement coverage

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression | Status |
|---|---|---|---|---|---|
| AC-1 | TC-FUN-001 | - | - | - | Covered |
| AC-2 | TC-FUN-002, TC-FUN-004 | TC-NEG-001 | TC-EDGE-002, TC-EDGE-005, TC-EDGE-006, TC-EDGE-012, TC-EDGE-013, TC-EDGE-014, TC-EDGE-015, TC-EDGE-016, TC-EDGE-017, TC-EDGE-018, TC-EDGE-019, TC-EDGE-020 | TC-REG-006 | Covered |
| AC-3 | TC-FUN-003, TC-FUN-004, TC-FUN-005 | TC-NEG-002 | TC-EDGE-003, TC-EDGE-007, TC-EDGE-008, TC-EDGE-009, TC-EDGE-010, TC-EDGE-011 | - | Covered |
| AC-4 | TC-FUN-006 | TC-NEG-003, TC-NEG-004, TC-NEG-005, TC-NEG-006 | - | - | Covered |
| AC-5 | TC-FUN-002, TC-FUN-003, TC-FUN-004 | - | - | - | Covered |
| AC-6 | TC-FUN-008 | TC-NEG-007 | - | - | Covered |
| AC-7 | TC-FUN-009, TC-FUN-010 | TC-NEG-008 | - | TC-REG-005 | Covered |
| AC-8 | TC-FUN-007 | TC-NEG-009 | TC-EDGE-001 | - | Covered |
| AC-9 | TC-FUN-011 | TC-NEG-010, TC-NEG-011 | TC-EDGE-004 | - | Covered |

## Impacted area coverage

| Impacted area | Regression cases | Status |
|---|---|---|
| IA-1 | TC-REG-001, TC-REG-002 | Covered |
| IA-2 | TC-REG-003 | Covered |
| IA-3 | TC-REG-004, TC-REG-005 | Covered |
| IA-4 | TC-REG-006 | Covered |
| IA-5 | TC-REG-007, TC-REG-008 | Covered |

## Test case inventory

| Test case | Type | Priority | Requirement refs | Artifact |
|---|---|---|---|---|
| TC-FUN-001 | Functional | Medium | AC-1 | 02-functional-tests.md |
| TC-FUN-002 | Functional | Critical | AC-2, AC-5 | 02-functional-tests.md |
| TC-FUN-003 | Functional | High | AC-3, AC-5 | 02-functional-tests.md |
| TC-FUN-004 | Functional | Medium | AC-2, AC-3, AC-5 | 02-functional-tests.md |
| TC-FUN-005 | Functional | Medium | AC-3 | 02-functional-tests.md |
| TC-FUN-006 | Functional | High | AC-4 | 02-functional-tests.md |
| TC-FUN-007 | Functional | High | AC-8 | 02-functional-tests.md |
| TC-FUN-008 | Functional | High | AC-6 | 02-functional-tests.md |
| TC-FUN-009 | Functional | High | AC-7 | 02-functional-tests.md |
| TC-FUN-010 | Functional | Medium | AC-7 | 02-functional-tests.md |
| TC-FUN-011 | Functional | High | AC-9 | 02-functional-tests.md |
| TC-NEG-001 | Negative | High | AC-2 | 03-negative-tests.md |
| TC-NEG-002 | Negative | Medium | AC-3 | 03-negative-tests.md |
| TC-NEG-003 | Negative | Medium | AC-4 | 03-negative-tests.md |
| TC-NEG-004 | Negative | Low | AC-4 | 03-negative-tests.md |
| TC-NEG-005 | Security | High | AC-4 | 03-negative-tests.md |
| TC-NEG-006 | Security | Critical | AC-4 | 03-negative-tests.md |
| TC-NEG-007 | Negative | Low | AC-6 | 03-negative-tests.md |
| TC-NEG-008 | Negative | High | AC-7, AC-9 | 03-negative-tests.md |
| TC-NEG-009 | Negative | High | AC-8 | 03-negative-tests.md |
| TC-NEG-010 | Negative | High | AC-9 | 03-negative-tests.md |
| TC-NEG-011 | Negative | High | AC-9 | 03-negative-tests.md |
| TC-EDGE-001 | Boundary | High | AC-8 | 04-edge-case-tests.md |
| TC-EDGE-002 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-003 | Boundary | Medium | AC-3 | 04-edge-case-tests.md |
| TC-EDGE-004 | Boundary | High | AC-9 | 04-edge-case-tests.md |
| TC-EDGE-005 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-006 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-007 | Boundary | Medium | AC-3 | 04-edge-case-tests.md |
| TC-EDGE-008 | Boundary | High | AC-3 | 04-edge-case-tests.md |
| TC-EDGE-009 | Boundary | Medium | AC-3 | 04-edge-case-tests.md |
| TC-EDGE-010 | Boundary | High | AC-3 | 04-edge-case-tests.md |
| TC-EDGE-011 | Boundary | High | AC-3 | 04-edge-case-tests.md |
| TC-EDGE-012 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-013 | Boundary | High | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-014 | Boundary | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-015 | Equivalence | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-016 | Equivalence | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-017 | Equivalence | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-018 | Equivalence | Medium | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-019 | Equivalence | Low | AC-2 | 04-edge-case-tests.md |
| TC-EDGE-020 | Boundary | Medium | AC-2 | 04-edge-case-tests.md |
| TC-REG-001 | Regression | Critical | IA-1 | 05-regression-impact.md |
| TC-REG-002 | Regression | High | IA-1 | 05-regression-impact.md |
| TC-REG-003 | Regression | Medium | IA-2 | 05-regression-impact.md |
| TC-REG-004 | Regression | High | IA-3 | 05-regression-impact.md |
| TC-REG-005 | Regression | High | IA-3, AC-7 | 05-regression-impact.md |
| TC-REG-006 | Regression | Medium | IA-4, AC-2 | 05-regression-impact.md |
| TC-REG-007 | Regression | High | IA-5 | 05-regression-impact.md |
| TC-REG-008 | Regression | High | IA-5 | 05-regression-impact.md |

## Totals

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 1 | 6 | 4 | 0 | 11 |
| Negative | 0 | 5 | 2 | 2 | 9 |
| Security | 1 | 1 | 0 | 0 | 2 |
| Boundary | 0 | 10 | 5 | 0 | 15 |
| Equivalence | 0 | 0 | 4 | 1 | 5 |
| Regression | 1 | 5 | 2 | 0 | 8 |
| **Total** | 3 | 27 | 17 | 3 | 50 |

## Traceability findings

| Check | Gate | Status | Findings | Owner |
|---|---|---|---|---|
| T1 | G1 | Pass | - | - |
| T2 | G2 | Pass | - | - |
| T3 | G5 | Pass | - | - |
| T4 | G8 | Pass | - | - |

## Notes

- Revision 3: rebuilt after retry of negative-test-planner and edge-case-planner. TC-NEG-009 priority updated from Medium to High (attempt 2 revision, technique changed to State transition) and TC-EDGE-006 title was shortened; neither change affects requirement or impacted-area coverage mappings.
