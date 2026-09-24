# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | validator |
| Scope | test-design |
| Attempt | 1 |
| Generated | 2026-09-24 17:05 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 1), 04-edge-case-tests.md (revision 1), 06-coverage-matrix.md (revision 1) |

## Result

**FAIL** - Gates G3 and G4 fail: one title exceeds 100 characters (TC-NEG-020) and 14 test cases duplicate the intent, steps, and expected result of another active case.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | AC-1 to AC-15 are all referenced | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All refs are AC-1 to AC-15; no IA refs used | - |
| G3 | All 11 fields in order, non-empty, allowed values; planner artifact layout followed | Fail | TC-NEG-020 title is 102 characters (max 100). All other blocks have all fields in template order with allowed Type, Priority, Technique, and Source values; all three artifacts follow the planner artifact layout; titles are unique | negative-test-planner |
| G4 | No two active test cases have the same intent, steps, and expected result | Fail | Duplicate groups (kept case first, duplicates after it): (1) empty field: TC-FUN-004 = TC-NEG-003 = TC-EDGE-004. (2) whitespace-only input: TC-NEG-004 = TC-EDGE-005. (3) no "@" in address: TC-FUN-005 = TC-NEG-005 = TC-EDGE-009; TC-NEG-010 uses the same value as TC-NEG-005 and asserts the same outcome. (4) missing local part and missing TLD: TC-NEG-006 already checks `@example.com` and `anna.test@example`, so TC-EDGE-010 and TC-EDGE-011 duplicate its sub-steps. (5) over-long address: TC-FUN-006 = TC-NEG-014. (6) valid address with surrounding spaces: TC-FUN-003 = TC-EDGE-007. (7) plain valid address: TC-FUN-002 = TC-EDGE-008. (8) mixed-case repeat of active address: TC-FUN-016 = TC-EDGE-013. (9) upper-case repeat of pending address: TC-FUN-017 = TC-EDGE-012. (10) old confirmation link still activates: TC-FUN-012 = TC-EDGE-014. Duplicates to fix: TC-NEG-003, TC-NEG-005, TC-NEG-010, TC-NEG-014, TC-EDGE-004, TC-EDGE-005, TC-EDGE-007, TC-EDGE-008, TC-EDGE-009, TC-EDGE-010, TC-EDGE-011, TC-EDGE-012, TC-EDGE-013, TC-EDGE-014 | negative-test-planner, edge-case-planner |
| G5 | Every AC has a positive and a negative / security case unless Negative testing is Not applicable (T3) | Pass | AC-2 to AC-5, AC-7 to AC-12, and AC-15 each have a FUN and a NEG case; AC-1, AC-6, AC-13, AC-14 are Not applicable per requirements | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed Type | Pass | TC-FUN-001 to 017 (Functional), TC-NEG-001 to 023 (Negative/Security), TC-EDGE-001 to 014 (Boundary/Equivalence); no gaps or duplicates | - |
| G7 | Every Source URL is listed in its artifact's Research sources and opens; external-standard cases have a real URL | Pass | Checked once each with WebFetch: OWASP Email Validation and Verification cheat sheet (opens), OWASP Input Validation cheat sheet (opens), RFC Erratum 1690 (opens). All are listed in the Research sources of the artifact that uses them. No case relies on an external standard while using `N/A` | - |
| G8 | When regression-impact-analyzer is selected, every IA has a TC-REG case (T4) | Not applicable | regression-impact-analyzer was not selected | - |
| G9 | Coverage matrix contains exactly the active test case IDs and correct totals (T5) | Pass | Matrix inventory lists all 54 IDs (17 FUN, 23 NEG, 14 EDGE) with matching type, priority, refs, and artifact; requirement rows match the case refs; totals recount to 7 Critical, 23 High, 23 Medium, 1 Low, 54 total. Must be regenerated after the G4 fixes | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| negative-test-planner | G3, G4 | G3: shorten the title of TC-NEG-020 to at most 100 characters (currently 102). G4: TC-NEG-003 (duplicate of TC-FUN-004), TC-NEG-005 (duplicate of TC-FUN-005), TC-NEG-010 (same value and outcome as TC-NEG-005), TC-NEG-014 (duplicate of TC-FUN-006). Replace the body with `Removed: <reason>` or change the case so intent, steps, and expected result are genuinely different. Keep TC-NEG-004 (AC-3), TC-NEG-006 (AC-4), TC-NEG-009 (AC-5), and TC-NEG-015 (AC-9) so G5 stays satisfied | coverage-aggregator, validator (test-design) |
| edge-case-planner | G4 | TC-EDGE-004 (duplicate of TC-FUN-004), TC-EDGE-005 (duplicate of TC-NEG-004), TC-EDGE-007 (duplicate of TC-FUN-003), TC-EDGE-008 (duplicate of TC-FUN-002), TC-EDGE-009 (duplicate of TC-FUN-005), TC-EDGE-010 and TC-EDGE-011 (covered by TC-NEG-006), TC-EDGE-012 (duplicate of TC-FUN-017), TC-EDGE-013 (duplicate of TC-FUN-016), TC-EDGE-014 (duplicate of TC-FUN-012). Replace each body with `Removed: <reason>` or make it distinct (for example a different boundary or partition value). Keep the IDs; do not renumber. Keep TC-EDGE-001, TC-EDGE-002, TC-EDGE-003, TC-EDGE-006 | coverage-aggregator, validator (test-design) |

## Notes

- TC-FUN-013 (tampered token, AC-15) overlaps TC-NEG-022 (three tampered variants plus a no-disclosure check). TC-NEG-022 asserts additional outcomes, so this is not counted as a duplicate.
- TC-EDGE-006 (value `a`, no "@") is in the same partition as the "no @" cases but is kept as a boundary case (shortest non-empty input). It is not counted as a duplicate.
- The Research sources entry of 03-negative-tests.md names the OWASP Email Validation page "Email Validation and Verification - OWASP Cheat Sheet Series"; the real page title is "Email Validation and Verification in Identity Systems Cheat Sheet". The URL is correct, so this does not fail G7.
- 04-edge-case-tests.md lists the RFC erratum page as not opened during research. It opened successfully during this validation.
- After the G4 fixes the coverage matrix inventory and totals change; coverage-aggregator must rebuild 06-coverage-matrix.md before the next validation.
- 03-negative-tests.md notes that TC-NEG-016 may conflict with a literal reading of AC-10 (a new confirmation email is sent). This is a product question, not a gate failure.
