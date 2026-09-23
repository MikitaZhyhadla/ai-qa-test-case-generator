# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | validator |
| Scope | test-design |
| Attempt | 2 |
| Generated | 2026-09-23 23:50 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 2), 04-edge-case-tests.md (revision 2), 06-coverage-matrix.md (revision 2) |

## Result

**PASS** - The 20 duplicates from attempt 1 are now removed in place with their IDs kept, coverage of every AC still holds, and the coverage matrix matches a recount of 103 active cases.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | - | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | - | - |
| G3 | All 11 fields in template order, non-empty, allowed values; planner artifact layout | Pass | - | - |
| G4 | No two active test cases have the same intent, steps, and expected result | Pass | - | - |
| G5 | Every AC has a positive and a negative / security case unless marked Not applicable (T3) | Pass | - | - |
| G6 | IDs are unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, and the prefix matches the artifact and the allowed Type | Pass | - | - |
| G7 | Every Source URL is listed in Research sources and opens; cases based on a standard have a real URL | Pass | - | - |
| G8 | Every `IA-<n>` has at least one TC-REG case (T4) | Not applicable | regression-impact-analyzer was not selected (change_type: new-feature) | - |
| G9 | The coverage matrix lists exactly the active test case IDs, and its totals match a recount (T5) | Pass | - | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| - | - | - | - |

## Notes

- Attempt 1 findings resolved: TC-NEG-012, TC-NEG-013, TC-NEG-017, TC-NEG-019, TC-NEG-027, TC-NEG-029, TC-NEG-034 and TC-EDGE-005, TC-EDGE-006, TC-EDGE-007, TC-EDGE-008, TC-EDGE-010, TC-EDGE-021, TC-EDGE-027, TC-EDGE-029, TC-EDGE-030, TC-EDGE-032, TC-EDGE-033, TC-EDGE-038, TC-EDGE-039 keep their headings and now have the body `Removed: duplicate of <ID>`, as the skill requires. No IDs were renumbered or reused.
- The removed heading of TC-NEG-012 still has the same title as TC-FUN-010. This is accepted because the skill requires removed cases to keep their heading, and the title no longer belongs to an active case.
- G5 after the removals: each AC with `Negative testing: Applicable` still has at least one TC-NEG case. For example, AC-9 has TC-NEG-003 and TC-NEG-039, AC-10 has TC-NEG-014 and TC-NEG-045, AC-12 has TC-NEG-018, AC-13 has TC-NEG-020, AC-19 has TC-NEG-028, and AC-20 has TC-NEG-030. AC-1, AC-2, AC-17, AC-18, and AC-28 are marked `Not applicable - <reason>` and have a positive case only.
- G9 recount: 103 active cases (FUN 35, NEG 42, EDGE 26). By type (Critical/High/Medium/Low): Functional 10/16/9/0 = 35, Negative 0/3/19/0 = 22, Security 9/11/0/0 = 20, Boundary 0/10/6/2 = 18, Equivalence 0/0/8/0 = 8, Regression 0. Total 19/40/42/2 = 103. This matches `06-coverage-matrix.md` revision 2, and the inventory lists exactly the active IDs with the same Type, Priority, and Requirement refs.
- G7: In this attempt, each unique Source URL opened successfully with WebFetch: the OWASP Forgot Password, Session Management, and Input Validation Cheat Sheets; OWASP WSTG v4.2 WSTG-ATHN-09; RFC 3696 Erratum 1690; NIST SP 800-63B; and TimeChange.org Europe DST 2026. Each one is listed in the Research sources of the artifact that uses it.
- G4 re-check: no new duplicates. The strongly overlapping pairs from attempt 1 notes are still active, because the later case adds a distinct check: TC-NEG-006 vs TC-FUN-016, TC-NEG-045 vs TC-FUN-019, TC-NEG-037 vs TC-FUN-017, TC-NEG-002 vs TC-FUN-007, TC-NEG-042 vs TC-EDGE-034/TC-EDGE-035, and TC-FUN-031 vs TC-NEG-048. TC-NEG-021/TC-NEG-022 (clearly invalid lengths 4 and 100) and TC-EDGE-022/TC-EDGE-025 (boundary lengths 7 and 65) test different values.
- Non-blocking issue carried over from attempt 1: many steps combine several actions, for example TC-FUN-007 steps 1-3, TC-FUN-032 step 1, TC-NEG-014 step 1, and TC-NEG-025 steps 1-2. The owners should split these steps when they next revise the artifacts.
- The scope section of `02-functional-tests.md` still says exact boundary values are left to the edge-case planner. However, TC-FUN-014 and TC-FUN-015 now serve as the only 5th/6th request boundary cases, because TC-EDGE-007 and TC-EDGE-008 were removed. This is covered and consistent with the edge-case artifact notes, but the functional scope wording is slightly out of date.
