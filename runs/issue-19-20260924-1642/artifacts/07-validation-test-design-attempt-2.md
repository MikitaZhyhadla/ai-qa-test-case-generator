# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | validator |
| Scope | test-design |
| Attempt | 2 |
| Generated | 2026-09-24 17:35 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 2), 04-edge-case-tests.md (revision 2), 06-coverage-matrix.md (revision 2) |

## Result

**PASS** - All gates G1-G9 pass: the G3 and G4 findings of attempt 1 are fixed and the coverage matrix was rebuilt with 42 active test cases.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | AC-1 to AC-15 are all referenced by at least one active case | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All refs are AC-1 to AC-15; no IA refs used | - |
| G3 | All 11 fields in order, non-empty, allowed values; planner artifact layout followed | Pass | All active blocks follow the template (heading, 5-row field table, Preconditions, Test data, Steps, Expected result) with allowed Type, Priority, Technique, and Source values. All titles are at most 100 characters (TC-NEG-020 is now 79; the longest is TC-NEG-006 at 91) and unique. Removed cases (TC-NEG-003, 005, 010, 014; TC-EDGE-005, 007, 008, 009, 011, 012, 013, 014) keep their headings with a `Removed: <reason>` body. 02, 03, and 04 follow the planner artifact layout | - |
| G4 | No two active test cases have the same intent, steps, and expected result | Pass | All active pairs compared across 02, 03, and 04 (42 active cases); no duplicates. All 14 duplicates from attempt 1 are removed or made distinct (TC-EDGE-004 is now 253 characters, TC-EDGE-010 is now `mia.test@`). Overlaps that are not duplicates: see Notes | - |
| G5 | Every AC has a positive and a negative / security case unless Negative testing is Not applicable (T3) | Pass | AC-2 (FUN-002, NEG-001), AC-3 (FUN-004, NEG-004), AC-4 (FUN-005, NEG-006), AC-5 (FUN-007, NEG-009), AC-7 (FUN-009, NEG-011), AC-8 (FUN-015, NEG-012), AC-9 (FUN-006, NEG-015), AC-10 (FUN-014, NEG-013), AC-11 (FUN-003, NEG-017), AC-12 (FUN-016, NEG-019), AC-15 (FUN-013, NEG-021). AC-1, AC-6, AC-13, AC-14 are Not applicable per requirements | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed Type | Pass | TC-FUN-001 to 017 (Functional), TC-NEG-001 to 023 (Negative/Security), TC-EDGE-001 to 014 (Boundary/Equivalence); no gaps or duplicates; Types match the prefix | - |
| G7 | Every Source URL is listed in its artifact's Research sources and opens; external-standard cases have a real URL | Pass | Checked once each with WebFetch: OWASP Email Validation and Verification cheat sheet (opens), OWASP Input Validation cheat sheet (opens), RFC Erratum 1690 (opens). Each is listed in the Research sources of the artifact that uses it (03: both OWASP pages; 04: erratum). No case relies on an external standard while using `N/A` | - |
| G8 | When regression-impact-analyzer is selected, every IA has a TC-REG case (T4) | Not applicable | regression-impact-analyzer was not selected; 05-regression-impact.md does not exist | - |
| G9 | Coverage matrix contains exactly the active test case IDs and correct totals (T5) | Pass | Matrix inventory lists exactly the 42 active IDs (17 FUN, 19 NEG, 6 EDGE) with matching type, priority, refs, and artifact; the removed IDs are absent. Requirement rows match the case refs. Totals recount to Critical 7, High 20, Medium 15, Low 0, Total 42 (Functional 17, Negative 11, Security 8, Boundary 5, Equivalence 1, Regression 0) | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| - | - | - | - |

## Notes

- TC-FUN-013 (tampered token, last 5 characters replaced with `XXXXX`) overlaps TC-NEG-022 (three other tampered variants plus a no-disclosure check). The inputs and asserted outcomes differ, so this is not counted as a duplicate.
- TC-FUN-010 (confirmation page content) shares its first steps with TC-FUN-009 (status change) but asserts different outcomes. TC-NEG-018 (no "@" with surrounding spaces) and TC-EDGE-006 (value `a`) sit in the same partition as TC-FUN-005 but use distinct inputs and intents. None are counted as duplicates.
- The Research sources entry of 03-negative-tests.md names the OWASP Email Validation page "Email Validation and Verification - OWASP Cheat Sheet Series". The page title returned by WebFetch is "Email Validation and Verification". The URL is correct, so this does not fail G7.
- 04-edge-case-tests.md says the RFC erratum page was not opened by the planner. It opens successfully.
- 03-negative-tests.md notes that TC-NEG-016 (email throttling) may conflict with a literal reading of AC-10 (a new confirmation email is sent). This is a product question, not a gate failure.
