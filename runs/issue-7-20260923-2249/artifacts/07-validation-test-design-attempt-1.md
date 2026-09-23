# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | validator |
| Scope | test-design |
| Attempt | 1 |
| Generated | 2026-09-23 23:20 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 1), 04-edge-case-tests.md (revision 1), 06-coverage-matrix.md (revision 1) |

## Result

**FAIL** - Traceability, IDs, sources, and the coverage matrix are correct, but 20 test cases in 03 and 04 duplicate earlier cases (G4), and TC-NEG-012 has the same title as TC-FUN-010 (G3).

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | - | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | - | - |
| G3 | All 11 fields in template order, non-empty, allowed values; planner artifact layout | Fail | TC-NEG-012 has the same title as TC-FUN-010 ("Send no reset email to an unregistered address"). The skill requires titles to be unique within the run. All other blocks, allowed values, and all 3 artifact layouts are correct. | negative-test-planner |
| G4 | No two active test cases have the same intent, steps, and expected result | Fail | Duplicates (later case listed first, earlier case in parentheses). 03-negative-tests.md: TC-NEG-012 (TC-FUN-010: unregistered address, no email); TC-NEG-013 (TC-FUN-023 steps 1-3: superseded link shows expired page); TC-NEG-017 (TC-FUN-024: unused link opened well after 60 min, 3 h vs 75 min, same partition); TC-NEG-019 (TC-FUN-035: reopened used link shows expired page); TC-NEG-027 (TC-FUN-032: session in another browser signed out after reset); TC-NEG-029 (TC-FUN-034 step 2: previous password rejected after reset); TC-NEG-034 (TC-FUN-018: invalid submissions do not count toward the rate limit, then 5 valid requests are accepted). 04-edge-case-tests.md: TC-EDGE-005 (TC-NEG-031: 5 spaces as email); TC-EDGE-006 (TC-FUN-017: case and space variants count as one address, 6th blocked); TC-EDGE-007 (TC-FUN-014: 5 requests accepted); TC-EDGE-008 (TC-FUN-015: 6th request after exactly 5 accepted is blocked); TC-EDGE-010 (TC-FUN-016: rate limit on an unregistered address, 1-5 accepted, 6th blocked); TC-EDGE-021 (TC-FUN-008: reset email sent within 1 minute); TC-EDGE-027 (TC-NEG-024: password with digits only, no Latin letter); TC-EDGE-029 (TC-NEG-023: password with letters only, no digit); TC-EDGE-030 (TC-NEG-025: letters are Cyrillic only); TC-EDGE-032 (TC-FUN-028: uppercase Latin letters plus digits accepted); TC-EDGE-033 (TC-FUN-029: special characters without spaces accepted); TC-EDGE-038 (TC-FUN-030: new password differs from the current one in the last character); TC-EDGE-039 (TC-NEG-048: all four password rules violated at once) | negative-test-planner (NEG), edge-case-planner (EDGE) |
| G5 | Every AC has a positive and a negative / security case unless marked Not applicable (T3) | Pass | - | - |
| G6 | IDs are unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, and the prefix matches the artifact and the allowed Type | Pass | - | - |
| G7 | Every Source URL is listed in Research sources and opens; cases based on a standard have a real URL | Pass | - | - |
| G8 | Every `IA-<n>` has at least one TC-REG case (T4) | Not applicable | regression-impact-analyzer was not selected (change_type: new-feature) | - |
| G9 | The coverage matrix lists exactly the active test case IDs, and its totals match a recount (T5) | Pass | - | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| negative-test-planner | G3, G4 | For each duplicate, either change the case so it has a distinct intent (for example a security-specific angle not already covered by the functional case), or replace its body with `Removed: duplicate of <ID>`. Keep all IDs. Cases: TC-NEG-012 (dup of TC-FUN-010; also gives it a unique title if it is kept), TC-NEG-013 (TC-FUN-023), TC-NEG-017 (TC-FUN-024), TC-NEG-019 (TC-FUN-035), TC-NEG-027 (TC-FUN-032), TC-NEG-029 (TC-FUN-034), TC-NEG-034 (TC-FUN-018). G5 must still pass afterwards: after these removals AC-9, AC-10, AC-12, AC-13, AC-19, AC-20, and AC-21 are still covered by TC-NEG-003/039, TC-NEG-014/045, TC-NEG-018, TC-NEG-020, TC-NEG-028, TC-NEG-030, and TC-NEG-001/031-033/035/036/038. | coverage-aggregator, then validator (test-design) |
| edge-case-planner | G4 | For each duplicate, either change the case to test a boundary or partition that no other case covers, or replace its body with `Removed: duplicate of <ID>`. Keep all IDs. Cases: TC-EDGE-005 (dup of TC-NEG-031), TC-EDGE-006 (TC-FUN-017), TC-EDGE-007 (TC-FUN-014), TC-EDGE-008 (TC-FUN-015), TC-EDGE-010 (TC-FUN-016), TC-EDGE-021 (TC-FUN-008), TC-EDGE-027 (TC-NEG-024), TC-EDGE-029 (TC-NEG-023), TC-EDGE-030 (TC-NEG-025), TC-EDGE-032 (TC-FUN-028), TC-EDGE-033 (TC-FUN-029), TC-EDGE-038 (TC-FUN-030), TC-EDGE-039 (TC-NEG-048). | coverage-aggregator, then validator (test-design) |

## Notes

- G4 counted two cases as duplicates when they test the same partition with the same steps and the same outcomes, even if their fictional data values differ, or when the later case adds nothing that the earlier case does not already check. The following pairs overlap strongly but are not failed, because the later case adds a distinct check: TC-NEG-006 vs TC-FUN-016 (adds requests 7-8), TC-NEG-045 vs TC-FUN-019 (completes the reset with the kept link), TC-NEG-037 vs TC-FUN-017 (bypass attempt starting from an exhausted limit, checks no email), TC-NEG-002 vs TC-FUN-007 (compares HTTP status and response body), TC-NEG-042 vs TC-EDGE-034/TC-EDGE-035 (combined leading and trailing space vs single), TC-FUN-031 vs TC-NEG-048 (adds a successful correction). The owners may choose to merge them.
- Source URLs checked with WebFetch, all opened successfully: OWASP Forgot Password Cheat Sheet, OWASP Session Management Cheat Sheet, OWASP Input Validation Cheat Sheet, OWASP WSTG v4.2 WSTG-ATHN-09, RFC 3696 Erratum 1690, NIST SP 800-63B, and TimeChange.org Europe DST 2026. Every Source URL is listed in the Research sources of its artifact. The research-only URLs (Wikipedia boundary-value analysis and equivalence partitioning, RFC 5321) are not used as a Source and were not fetched.
- Many steps combine several actions, which goes against the skill guideline "one user or system action per step". Examples: TC-FUN-007 steps 1-3, TC-FUN-032 step 1, TC-FUN-034 step 1, TC-NEG-014 step 1, and the frequent "Enter X and click Send reset link". This did not fail G3, which checks fields, order, allowed values, and layout, but the owners should split these steps when they next revise the artifacts.
- The scope of 02-functional-tests.md says exact boundary values are left to the edge-case planner, but TC-FUN-014 and TC-FUN-015 test exactly the 5th and 6th request. Because of this overlap, the boundary pair TC-EDGE-007 and TC-EDGE-008 is reported as duplicate. The coordinator may instead give the boundary cases to edge-case-planner and change the functional cases.
- TC-NEG-004 uses a qualitative expected result ("response times overlap"), because the requirements define no timing threshold. This is acceptable but only loosely verifiable.
- Coverage matrix recount matches: 123 active cases (FUN 35, NEG 49, EDGE 39). By type: Functional 10/16/9/0, Negative 0/6/19/0, Security 12/12/0/0, Boundary 0/13/9/2, Equivalence 0/1/14/0 (Critical/High/Medium/Low).
