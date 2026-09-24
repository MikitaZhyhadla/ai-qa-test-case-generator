# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | validator |
| Scope | test-design |
| Attempt | 2 |
| Generated | 2026-09-24 13:40 |
| Artifacts checked | 01-requirements.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 1), 04-edge-case-tests.md (revision 2), 06-coverage-matrix.md (revision 2) |

## Result

**PASS** - all gates G1-G9 pass (G8 not applicable); the G4 duplicates and the G7 broken URL from attempt 1 are fixed.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC is referenced by at least one test case (T1) | Pass | AC-1 to AC-11 are all referenced | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All refs point to AC-1 to AC-11; no IA refs used | - |
| G3 | All 11 fields in template order, non-empty, allowed values; planner artifact layout | Pass | 02, 03 and 04 follow the layout; all 51 active blocks have every field with allowed Type, Priority and Technique values; titles are unique and 100 characters or fewer; TC-EDGE-010, TC-EDGE-012 and TC-EDGE-013 keep their headings with the body `Removed: <reason>` as the template allows | - |
| G4 | No two active test cases have the same intent, steps, and expected result | Pass | TC-EDGE-010, TC-EDGE-012 and TC-EDGE-013 are now `Removed`. All remaining pairs across 02, 03 and 04 were compared; near-overlaps (TC-FUN-008 and TC-NEG-012: UI flow versus direct server request; TC-FUN-013 and TC-NEG-019: UI versus direct request; TC-FUN-001 and TC-EDGE-002: calendar happy path versus the today boundary; TC-FUN-002 and TC-EDGE-009: slot grid versus partition check; TC-EDGE-015, TC-EDGE-018 and TC-EDGE-019: different clock, time zone and DST set-up) differ in steps, data or expected result. No duplicates found | - |
| G5 | Every AC has a positive and a negative / security case unless `Negative testing` is `Not applicable` (T3) | Pass | AC-1 to AC-9 each have at least one TC-FUN and one TC-NEG case; AC-10 and AC-11 are `Not applicable` for negative testing and have TC-FUN-007 and TC-FUN-012 | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed `Type` | Pass | TC-FUN-001 to 014 (Functional), TC-NEG-001 to 020 (Negative / Security), TC-EDGE-001 to 020 (Boundary / Equivalence, 3 removed); no gaps, no repeats | - |
| G7 | Every `Source` URL is listed in `Research sources`, opens with WebFetch; cases relying on an external standard have a real URL | Pass | 5 unique Source URLs all opened: OWASP IDOR Prevention, OWASP Business Logic Security, OWASP Input Validation, GeeksforGeeks Equivalence Partitioning Method, kidsinthecity.pl Time change in Poland (Source of TC-EDGE-019 and TC-EDGE-020, replaces the 403 URL). Each is listed in the Research sources of its artifact. No case relies on an external standard while using `N/A` | - |
| G8 | When `regression-impact-analyzer` is selected, every IA has a TC-REG case (T4) | Not applicable | Regression analysis was not selected; no `05-regression-impact.md` | - |
| G9 | `06-coverage-matrix.md` lists exactly the active test case IDs and correct totals (T5) | Pass | 51 active IDs match the artifacts exactly (14 FUN, 20 NEG, 17 EDGE); removed IDs TC-EDGE-010, 012, 013 are absent from the inventory and listed in the notes; per-AC rows match; totals recounted: Functional 1/8/5/0 = 14, Negative 0/9/4/0 = 13, Security 3/4/0/0 = 7, Boundary 0/12/4/0 = 16, Equivalence 0/0/1/0 = 1, Regression 0, Total 4/33/14/0 = 51 | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| - | - | - | - |

## Notes

- TC-EDGE-019 and TC-EDGE-020 rely on seeded data (an appointment 31 days ahead), as documented in the artifact assumptions; this does not fail a gate.
- The removed edge cases leave the minimum-count and limit-plus-one boundaries for AC-6 covered by TC-FUN-006, TC-FUN-008 and TC-NEG-012.
- The ISTQB guide listed in `Research sources` of 04 is not used as a `Source` of any case; this does not fail a gate.
