# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | validator |
| Scope | test-design |
| Attempt | 3 |
| Generated | 2026-09-24 14:10 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 2), 03-negative-tests.md (revision 2), 04-edge-case-tests.md (revision 2), 06-coverage-matrix.md (revision 3) |

## Result

**PASS** - all gates G1-G9 pass (G8 not applicable); the review-feedback priority changes (TC-FUN-010 and TC-NEG-015 to Critical) are reflected in the coverage matrix and totals.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | AC-1 to AC-11 are all referenced | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All refs point to AC-1 to AC-11; no IA refs used | - |
| G3 | All 11 fields in template order, non-empty, allowed values; planner artifact layout | Pass | 02, 03 and 04 follow the layout; all 51 active blocks have every field with allowed Type, Priority and Technique values; titles are unique and 100 characters or fewer; TC-EDGE-010, TC-EDGE-012 and TC-EDGE-013 keep their headings with the body `Removed: <reason>`; the rev 2 changes to 02 and 03 are priority values only (Critical is allowed) plus notes | - |
| G4 | No two active test cases have the same intent, steps, and expected result | Pass | All pairs across 02, 03 and 04 compared. Near-overlaps (TC-FUN-008 and TC-NEG-012; TC-FUN-013 and TC-NEG-019; TC-FUN-010 and TC-NEG-015: simultaneous confirmation by two patients versus one patient double-submitting; TC-FUN-001 and TC-EDGE-002; TC-FUN-002 and TC-EDGE-009; TC-EDGE-015, TC-EDGE-018 and TC-EDGE-019) differ in steps, data or expected result. Steps and expected results are unchanged since attempt 2. No duplicates found | - |
| G5 | Every AC has a positive and a negative / security case unless `Negative testing` is `Not applicable` (T3) | Pass | AC-1 to AC-9 each have at least one TC-FUN and one TC-NEG case; AC-10 and AC-11 are `Not applicable` for negative testing and have TC-FUN-007 and TC-FUN-012 | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed `Type` | Pass | TC-FUN-001 to 014 (Functional), TC-NEG-001 to 020 (Negative / Security), TC-EDGE-001 to 020 (Boundary / Equivalence, 3 removed); no gaps, no repeats | - |
| G7 | Every `Source` URL is listed in `Research sources`, opens with WebFetch; cases relying on an external standard have a real URL | Pass | 5 unique Source URLs all opened: OWASP IDOR Prevention, OWASP Business Logic Security, OWASP Input Validation, GeeksforGeeks Equivalence Partitioning Method, kidsinthecity.pl Time change in Poland. Each is listed in the Research sources of its artifact. No case relies on an external standard while using `N/A` | - |
| G8 | When `regression-impact-analyzer` is selected, every IA has a TC-REG case (T4) | Not applicable | Regression analysis was not selected; no `05-regression-impact.md` | - |
| G9 | `06-coverage-matrix.md` lists exactly the active test case IDs and correct totals (T5) | Pass | 51 active IDs match the artifacts exactly (14 FUN, 20 NEG, 17 EDGE); removed IDs TC-EDGE-010, 012, 013 are absent from the inventory and listed in the notes; inventory priorities match the artifacts (TC-FUN-010 and TC-NEG-015 are Critical); per-AC rows match; totals recounted (Critical/High/Medium/Low = Total): Functional 2/7/5/0 = 14, Negative 1/8/4/0 = 13, Security 3/4/0/0 = 7, Boundary 0/12/4/0 = 16, Equivalence 0/0/1/0 = 1, Regression 0, Total 6/31/14/0 = 51 | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| - | - | - | - |

## Notes

- This is a re-validation after human review feedback rev 2, not a gate retry.
- TC-EDGE-019 and TC-EDGE-020 rely on seeded data (an appointment 31 days ahead), as documented in the artifact assumptions; this does not fail a gate.
- The ISTQB guide listed in `Research sources` of 04 is not used as a `Source` of any case; this does not fail a gate.
