# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | validator |
| Scope | test-design |
| Attempt | 1 |
| Generated | 2026-09-24 13:15 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 1), 04-edge-case-tests.md (revision 1), 06-coverage-matrix.md (revision 1) |

## Result

**FAIL** - 3 duplicate test cases in `04-edge-case-tests.md` (G4) and 2 cases with a `Source` URL that does not open (G7); all other gates pass.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | AC-1 to AC-11 are all referenced | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All refs point to AC-1 to AC-11; no IA refs used | - |
| G3 | All 11 fields in template order, non-empty, allowed values; planner artifact layout | Pass | 02, 03 and 04 follow the layout; all 54 blocks have every field with allowed Type, Priority and Technique values; titles are unique and 100 characters or fewer | - |
| G4 | No two active test cases have the same intent, steps, and expected result | Fail | (1) TC-EDGE-010 duplicates TC-FUN-006: patient with 0 upcoming appointments books one free slot; identical steps (select doctor, date, slot, confirm) and identical expected result (confirmation with doctor, date, time, booking number; patient has 1 upcoming appointment). (2) TC-EDGE-012 duplicates TC-FUN-008: patient with 3 upcoming appointments books a 4th; identical steps and identical expected result (rejected, message "You already have the maximum of 3 upcoming appointments. Cancel one to book a new appointment.", still exactly 3 upcoming appointments, slot remains available). (3) TC-EDGE-013 duplicates TC-FUN-008: patient with 3 upcoming appointments across 3 different doctors books a 4th with another doctor; identical steps and identical expected result (only the doctor names differ). TC-EDGE-012 and TC-EDGE-013 also overlap each other. No other duplicate pairs found across 02, 03 and 04 | edge-case-planner |
| G5 | Every AC has a positive and a negative / security case unless `Negative testing` is `Not applicable` (T3) | Pass | AC-1 to AC-9 each have at least one TC-FUN and one TC-NEG case; AC-10 and AC-11 are `Not applicable` for negative testing and have TC-FUN-007 and TC-FUN-012 | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed `Type` | Pass | TC-FUN-001 to 014 (Functional), TC-NEG-001 to 020 (Negative / Security), TC-EDGE-001 to 020 (Boundary / Equivalence); no gaps, no repeats | - |
| G7 | Every `Source` URL is listed in `Research sources`, opens with WebFetch; cases relying on an external standard have a real URL | Fail | `https://www.timeanddate.com/time/change/poland/warsaw` (Source of TC-EDGE-019 and TC-EDGE-020) returns HTTP 403 with WebFetch and does not open; the artifact's own Research sources note says the page was not opened. The other 4 unique Source URLs open (OWASP IDOR Prevention, OWASP Business Logic Security, OWASP Input Validation, GeeksforGeeks Equivalence Partitioning Method) and are all listed in the Research sources of their artifacts. No case relies on an external standard while using `N/A` | edge-case-planner |
| G8 | When `regression-impact-analyzer` is selected, every IA has a TC-REG case (T4) | Not applicable | Regression analysis was not selected; no `05-regression-impact.md` | - |
| G9 | `06-coverage-matrix.md` lists exactly the active test case IDs and correct totals (T5) | Pass | 54 IDs match the artifacts exactly (14 FUN, 20 NEG, 20 EDGE); the per-AC rows, inventory, and totals (Critical 4, High 34, Medium 16, Low 0, Total 54) match a recount. Will need regeneration after the G4 and G7 fixes | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| edge-case-planner | G4, G7 | G4: resolve TC-EDGE-010 (duplicate of TC-FUN-006), TC-EDGE-012 and TC-EDGE-013 (duplicates of TC-FUN-008). Either replace the block body with `Removed: <reason>` (keep the heading, do not renumber) or make the case genuinely distinct in intent, steps and expected result, and append any new case with the next free number (TC-EDGE-021). Note that TC-EDGE-012 and TC-EDGE-013 also overlap each other, so keeping both unchanged is not enough. G7: replace the `Source` of TC-EDGE-019 and TC-EDGE-020 (and the matching entry in `Research sources`) with a URL that opens successfully with WebFetch, or use `N/A - derived from requirements` if no verifiable URL is found. Update the `Notes and assumptions` if a boundary inventory statement changes | coverage-aggregator, then validator (test-design) |

## Notes

- Gate G7 was applied strictly: a URL that returns HTTP 403 does not "open successfully", even though the artifact discloses this in its Research sources.
- The coverage matrix and totals are correct for the current artifacts; they only need regeneration once `04-edge-case-tests.md` changes (removed cases are excluded from the active inventory and listed in the matrix notes).
- TC-EDGE-019 and TC-EDGE-020 rely on seeded data (an appointment 31 days ahead), as documented in the artifact assumptions; this does not fail a gate.
- If TC-EDGE-012 is marked removed, the limit-plus-one boundary for AC-6 stays covered by TC-FUN-008 and TC-NEG-012; if TC-EDGE-010 is marked removed, the minimum-count boundary stays covered by TC-FUN-006.
