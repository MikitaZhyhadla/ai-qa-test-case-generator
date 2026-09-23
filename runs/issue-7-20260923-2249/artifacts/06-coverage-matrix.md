# Coverage Matrix

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | coverage-aggregator |
| Revision | 2 |
| Generated | 2026-09-23 23:45 |
| Inputs | 01-requirements.md, 02-functional-tests.md, 03-negative-tests.md, 04-edge-case-tests.md |

## Requirement coverage

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression | Status |
|---|---|---|---|---|---|
| AC-1 | TC-FUN-001 | - | - | - | Covered |
| AC-2 | TC-FUN-002 | - | - | - | Covered |
| AC-3 | TC-FUN-003 | TC-NEG-001 | - | - | Covered |
| AC-4 | TC-FUN-004, TC-FUN-005, TC-FUN-006 | TC-NEG-002, TC-NEG-003 | TC-EDGE-001 | - | Covered |
| AC-5 | TC-FUN-007 | TC-NEG-002, TC-NEG-003, TC-NEG-004, TC-NEG-005 | - | - | Covered |
| AC-6 | TC-FUN-014, TC-FUN-016, TC-FUN-021 | TC-NEG-006, TC-NEG-008 | TC-EDGE-009, TC-EDGE-011 | - | Covered |
| AC-7 | TC-FUN-015, TC-FUN-016, TC-FUN-021 | TC-NEG-006, TC-NEG-007, TC-NEG-008, TC-NEG-037, TC-NEG-046 | TC-EDGE-011, TC-EDGE-012, TC-EDGE-014, TC-EDGE-015 | - | Covered |
| AC-8 | TC-FUN-008 | TC-NEG-005, TC-NEG-009, TC-NEG-010, TC-NEG-011 | - | - | Covered |
| AC-9 | TC-FUN-009, TC-FUN-010 | TC-NEG-003, TC-NEG-039 | - | - | Covered |
| AC-10 | TC-FUN-023 | TC-NEG-014, TC-NEG-045 | - | - | Covered |
| AC-11 | TC-FUN-022 | TC-NEG-010, TC-NEG-015, TC-NEG-016 | TC-EDGE-016, TC-EDGE-019 | - | Covered |
| AC-12 | TC-FUN-024 | TC-NEG-018 | TC-EDGE-017, TC-EDGE-018, TC-EDGE-020 | - | Covered |
| AC-13 | TC-FUN-035 | TC-NEG-020 | - | - | Covered |
| AC-14 | TC-FUN-027 | TC-NEG-021, TC-NEG-022, TC-NEG-030, TC-NEG-049 | TC-EDGE-022, TC-EDGE-023, TC-EDGE-024, TC-EDGE-025 | - | Covered |
| AC-15 | TC-FUN-028 | TC-NEG-023, TC-NEG-024, TC-NEG-025, TC-NEG-049 | TC-EDGE-026, TC-EDGE-028, TC-EDGE-031 | - | Covered |
| AC-16 | TC-FUN-026 | TC-NEG-026, TC-NEG-044 | TC-EDGE-036, TC-EDGE-037 | - | Covered |
| AC-17 | TC-FUN-026 | - | - | - | Covered |
| AC-18 | TC-FUN-026 | - | - | - | Covered |
| AC-19 | TC-FUN-032 | TC-NEG-028 | - | - | Covered |
| AC-20 | TC-FUN-033, TC-FUN-034 | TC-NEG-030 | - | - | Covered |
| AC-21 | TC-FUN-018 | TC-NEG-001, TC-NEG-011, TC-NEG-031, TC-NEG-032, TC-NEG-033, TC-NEG-035, TC-NEG-036, TC-NEG-038 | - | - | Covered |
| AC-22 | TC-FUN-011, TC-FUN-017 | TC-NEG-031, TC-NEG-037, TC-NEG-038, TC-NEG-039 | - | - | Covered |
| AC-23 | TC-FUN-012 | TC-NEG-040 | TC-EDGE-001, TC-EDGE-002, TC-EDGE-003 | - | Covered |
| AC-24 | TC-FUN-029 | TC-NEG-041, TC-NEG-042 | TC-EDGE-034, TC-EDGE-035 | - | Covered |
| AC-25 | TC-FUN-030 | TC-NEG-043, TC-NEG-044 | - | - | Covered |
| AC-26 | TC-FUN-019 | TC-NEG-007, TC-NEG-045 | - | - | Covered |
| AC-27 | TC-FUN-020, TC-FUN-021 | TC-NEG-046 | TC-EDGE-012, TC-EDGE-013, TC-EDGE-014, TC-EDGE-015 | - | Covered |
| AC-28 | TC-FUN-025 | - | - | - | Covered |
| AC-29 | TC-FUN-013 | TC-NEG-047 | TC-EDGE-004 | - | Covered |
| AC-30 | TC-FUN-031 | TC-NEG-048, TC-NEG-049 | - | - | Covered |

## Impacted area coverage

Not applicable for this run - regression analysis was not selected.

## Test case inventory

| Test case | Type | Priority | Requirement refs | Artifact |
|---|---|---|---|---|
| TC-FUN-001 | Functional | High | AC-1 | 02-functional-tests.md |
| TC-FUN-002 | Functional | High | AC-2 | 02-functional-tests.md |
| TC-FUN-003 | Functional | Critical | AC-3 | 02-functional-tests.md |
| TC-FUN-004 | Functional | High | AC-4 | 02-functional-tests.md |
| TC-FUN-005 | Functional | High | AC-4 | 02-functional-tests.md |
| TC-FUN-006 | Functional | High | AC-4 | 02-functional-tests.md |
| TC-FUN-007 | Functional | Critical | AC-5 | 02-functional-tests.md |
| TC-FUN-008 | Functional | Critical | AC-8 | 02-functional-tests.md |
| TC-FUN-009 | Functional | High | AC-9 | 02-functional-tests.md |
| TC-FUN-010 | Functional | High | AC-9 | 02-functional-tests.md |
| TC-FUN-011 | Functional | High | AC-22 | 02-functional-tests.md |
| TC-FUN-012 | Functional | Medium | AC-23 | 02-functional-tests.md |
| TC-FUN-013 | Functional | Medium | AC-29 | 02-functional-tests.md |
| TC-FUN-014 | Functional | High | AC-6 | 02-functional-tests.md |
| TC-FUN-015 | Functional | High | AC-7 | 02-functional-tests.md |
| TC-FUN-016 | Functional | High | AC-6, AC-7 | 02-functional-tests.md |
| TC-FUN-017 | Functional | Medium | AC-22 | 02-functional-tests.md |
| TC-FUN-018 | Functional | Medium | AC-21 | 02-functional-tests.md |
| TC-FUN-019 | Functional | High | AC-26 | 02-functional-tests.md |
| TC-FUN-020 | Functional | Medium | AC-27 | 02-functional-tests.md |
| TC-FUN-021 | Functional | Medium | AC-6, AC-7, AC-27 | 02-functional-tests.md |
| TC-FUN-022 | Functional | Critical | AC-11 | 02-functional-tests.md |
| TC-FUN-023 | Functional | Critical | AC-10 | 02-functional-tests.md |
| TC-FUN-024 | Functional | Critical | AC-12 | 02-functional-tests.md |
| TC-FUN-025 | Functional | Medium | AC-28 | 02-functional-tests.md |
| TC-FUN-026 | Functional | Critical | AC-16, AC-17, AC-18 | 02-functional-tests.md |
| TC-FUN-027 | Functional | High | AC-14 | 02-functional-tests.md |
| TC-FUN-028 | Functional | High | AC-15 | 02-functional-tests.md |
| TC-FUN-029 | Functional | Medium | AC-24 | 02-functional-tests.md |
| TC-FUN-030 | Functional | High | AC-25 | 02-functional-tests.md |
| TC-FUN-031 | Functional | Medium | AC-30 | 02-functional-tests.md |
| TC-FUN-032 | Functional | Critical | AC-19 | 02-functional-tests.md |
| TC-FUN-033 | Functional | Critical | AC-20 | 02-functional-tests.md |
| TC-FUN-034 | Functional | High | AC-20 | 02-functional-tests.md |
| TC-FUN-035 | Functional | Critical | AC-13 | 02-functional-tests.md |
| TC-NEG-001 | Negative | Medium | AC-3, AC-21 | 03-negative-tests.md |
| TC-NEG-002 | Security | Critical | AC-4, AC-5 | 03-negative-tests.md |
| TC-NEG-003 | Security | Critical | AC-4, AC-5, AC-9 | 03-negative-tests.md |
| TC-NEG-004 | Security | High | AC-5 | 03-negative-tests.md |
| TC-NEG-005 | Negative | High | AC-5, AC-8 | 03-negative-tests.md |
| TC-NEG-006 | Security | High | AC-6, AC-7 | 03-negative-tests.md |
| TC-NEG-007 | Security | High | AC-7, AC-26 | 03-negative-tests.md |
| TC-NEG-008 | Security | High | AC-6, AC-7 | 03-negative-tests.md |
| TC-NEG-009 | Security | Critical | AC-8 | 03-negative-tests.md |
| TC-NEG-010 | Security | High | AC-8, AC-11 | 03-negative-tests.md |
| TC-NEG-011 | Security | Critical | AC-8, AC-21 | 03-negative-tests.md |
| TC-NEG-014 | Security | Critical | AC-10 | 03-negative-tests.md |
| TC-NEG-015 | Security | Critical | AC-11 | 03-negative-tests.md |
| TC-NEG-016 | Security | Critical | AC-11 | 03-negative-tests.md |
| TC-NEG-018 | Security | High | AC-12 | 03-negative-tests.md |
| TC-NEG-020 | Security | Critical | AC-13 | 03-negative-tests.md |
| TC-NEG-021 | Negative | Medium | AC-14 | 03-negative-tests.md |
| TC-NEG-022 | Negative | Medium | AC-14 | 03-negative-tests.md |
| TC-NEG-023 | Negative | Medium | AC-15 | 03-negative-tests.md |
| TC-NEG-024 | Negative | Medium | AC-15 | 03-negative-tests.md |
| TC-NEG-025 | Negative | Medium | AC-15 | 03-negative-tests.md |
| TC-NEG-026 | Negative | Medium | AC-16 | 03-negative-tests.md |
| TC-NEG-028 | Security | Critical | AC-19 | 03-negative-tests.md |
| TC-NEG-030 | Negative | High | AC-20, AC-14 | 03-negative-tests.md |
| TC-NEG-031 | Negative | Medium | AC-21, AC-22 | 03-negative-tests.md |
| TC-NEG-032 | Negative | Medium | AC-21 | 03-negative-tests.md |
| TC-NEG-033 | Negative | Medium | AC-21 | 03-negative-tests.md |
| TC-NEG-035 | Security | High | AC-21 | 03-negative-tests.md |
| TC-NEG-036 | Security | High | AC-21 | 03-negative-tests.md |
| TC-NEG-037 | Security | High | AC-22, AC-7 | 03-negative-tests.md |
| TC-NEG-038 | Negative | Medium | AC-22, AC-21 | 03-negative-tests.md |
| TC-NEG-039 | Security | High | AC-22, AC-9 | 03-negative-tests.md |
| TC-NEG-040 | Negative | Medium | AC-23 | 03-negative-tests.md |
| TC-NEG-041 | Negative | Medium | AC-24 | 03-negative-tests.md |
| TC-NEG-042 | Negative | Medium | AC-24 | 03-negative-tests.md |
| TC-NEG-043 | Negative | Medium | AC-25 | 03-negative-tests.md |
| TC-NEG-044 | Negative | Medium | AC-25, AC-16 | 03-negative-tests.md |
| TC-NEG-045 | Negative | High | AC-26, AC-10 | 03-negative-tests.md |
| TC-NEG-046 | Negative | Medium | AC-27, AC-7 | 03-negative-tests.md |
| TC-NEG-047 | Security | High | AC-29 | 03-negative-tests.md |
| TC-NEG-048 | Negative | Medium | AC-30 | 03-negative-tests.md |
| TC-NEG-049 | Negative | Medium | AC-30, AC-14, AC-15 | 03-negative-tests.md |
| TC-EDGE-001 | Boundary | High | AC-23, AC-4 | 04-edge-case-tests.md |
| TC-EDGE-002 | Boundary | Medium | AC-23 | 04-edge-case-tests.md |
| TC-EDGE-003 | Boundary | Medium | AC-23 | 04-edge-case-tests.md |
| TC-EDGE-004 | Boundary | High | AC-29 | 04-edge-case-tests.md |
| TC-EDGE-009 | Equivalence | Medium | AC-6 | 04-edge-case-tests.md |
| TC-EDGE-011 | Equivalence | Medium | AC-6, AC-7 | 04-edge-case-tests.md |
| TC-EDGE-012 | Boundary | High | AC-7, AC-27 | 04-edge-case-tests.md |
| TC-EDGE-013 | Boundary | High | AC-27 | 04-edge-case-tests.md |
| TC-EDGE-014 | Equivalence | Medium | AC-7, AC-27 | 04-edge-case-tests.md |
| TC-EDGE-015 | Equivalence | Medium | AC-27, AC-7 | 04-edge-case-tests.md |
| TC-EDGE-016 | Boundary | High | AC-11 | 04-edge-case-tests.md |
| TC-EDGE-017 | Boundary | High | AC-12 | 04-edge-case-tests.md |
| TC-EDGE-018 | Boundary | Medium | AC-12 | 04-edge-case-tests.md |
| TC-EDGE-019 | Boundary | Low | AC-11 | 04-edge-case-tests.md |
| TC-EDGE-020 | Boundary | Low | AC-12 | 04-edge-case-tests.md |
| TC-EDGE-022 | Boundary | High | AC-14 | 04-edge-case-tests.md |
| TC-EDGE-023 | Boundary | High | AC-14 | 04-edge-case-tests.md |
| TC-EDGE-024 | Boundary | High | AC-14 | 04-edge-case-tests.md |
| TC-EDGE-025 | Boundary | High | AC-14 | 04-edge-case-tests.md |
| TC-EDGE-026 | Boundary | Medium | AC-15 | 04-edge-case-tests.md |
| TC-EDGE-028 | Boundary | Medium | AC-15 | 04-edge-case-tests.md |
| TC-EDGE-031 | Equivalence | Medium | AC-15 | 04-edge-case-tests.md |
| TC-EDGE-034 | Equivalence | Medium | AC-24 | 04-edge-case-tests.md |
| TC-EDGE-035 | Equivalence | Medium | AC-24 | 04-edge-case-tests.md |
| TC-EDGE-036 | Equivalence | Medium | AC-16 | 04-edge-case-tests.md |
| TC-EDGE-037 | Boundary | Medium | AC-16 | 04-edge-case-tests.md |

## Totals

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 10 | 16 | 9 | 0 | 35 |
| Negative | 0 | 3 | 19 | 0 | 22 |
| Security | 9 | 11 | 0 | 0 | 20 |
| Boundary | 0 | 10 | 6 | 2 | 18 |
| Equivalence | 0 | 0 | 8 | 0 | 8 |
| Regression | 0 | 0 | 0 | 0 | 0 |
| **Total** | 19 | 40 | 42 | 2 | 103 |

## Traceability findings

| Check | Gate | Status | Findings | Owner |
|---|---|---|---|---|
| T1 | G1 | Pass | - | - |
| T2 | G2 | Pass | - | - |
| T3 | G5 | Pass | - | - |
| T4 | G8 | Not applicable | - | - |

## Notes

- Removed in 03-negative-tests.md (revision 2), not counted as active: TC-NEG-012 (Removed: duplicate of TC-FUN-010), TC-NEG-013 (Removed: duplicate of TC-FUN-023), TC-NEG-017 (Removed: duplicate of TC-FUN-024), TC-NEG-019 (Removed: duplicate of TC-FUN-035), TC-NEG-027 (Removed: duplicate of TC-FUN-032), TC-NEG-029 (Removed: duplicate of TC-FUN-034), TC-NEG-034 (Removed: duplicate of TC-FUN-018).
- Removed in 04-edge-case-tests.md (revision 2), not counted as active: TC-EDGE-005 (Removed: duplicate of TC-NEG-031), TC-EDGE-006 (Removed: duplicate of TC-FUN-017), TC-EDGE-007 (Removed: duplicate of TC-FUN-014), TC-EDGE-008 (Removed: duplicate of TC-FUN-015), TC-EDGE-010 (Removed: duplicate of TC-FUN-016), TC-EDGE-021 (Removed: duplicate of TC-FUN-008), TC-EDGE-027 (Removed: duplicate of TC-NEG-024), TC-EDGE-029 (Removed: duplicate of TC-NEG-023), TC-EDGE-030 (Removed: duplicate of TC-NEG-025), TC-EDGE-032 (Removed: duplicate of TC-FUN-028), TC-EDGE-033 (Removed: duplicate of TC-FUN-029), TC-EDGE-038 (Removed: duplicate of TC-FUN-030), TC-EDGE-039 (Removed: duplicate of TC-NEG-048).
- AC-1, AC-2, AC-17, AC-18, and AC-28 are marked `Not applicable` for negative testing in `01-requirements.md`; they are counted as Covered with a Positive case only.
- Regression analysis (`regression-impact-analyzer`) was not selected for this run (`change_type: new-feature`), so no `IA-<n>` IDs exist and T4 is not applicable.
- Active test case counts by prefix: TC-FUN 35, TC-NEG 42, TC-EDGE 26, TC-REG 0; 103 active test cases in total (20 removed cases excluded).
- Revision 2 rebuilds the whole matrix after the retry of `negative-test-planner` and `edge-case-planner` (test-design retry 1: G3, G4).
