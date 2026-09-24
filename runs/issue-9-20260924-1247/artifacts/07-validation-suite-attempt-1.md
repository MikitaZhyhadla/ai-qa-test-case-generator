# Validation Report - suite

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | validator |
| Scope | suite |
| Attempt | 1 |
| Generated | 2026-09-24 13:50 |
| Artifacts checked | 08-test-suite.md (revision 1), 06-coverage-matrix.md (revision 2), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 1), 04-edge-case-tests.md (revision 2) |

## Result

**FAIL** - S1 passes (all 51 active test cases present exactly once), but S2 fails because section 4 of the suite contains a line that is not in `suite-template.md`.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| S1 | Suite contains every active test case exactly once with unchanged IDs and no other test cases (T6) | Pass | 51 active cases found: TC-FUN-001 to 014 (14), TC-NEG-001 to 020 (20), TC-EDGE-001 to 009, 011, 014 to 020 (17). Each heading appears once, in the correct subsection (5.1 FUN, 5.2 NEG, 5.3 EDGE) and in ascending order. Removed cases TC-EDGE-010, 012 and 013 are absent, as required. No other IDs. Titles, fields and steps match the planner artifacts | - |
| S2 | Suite follows `suite-template.md` exactly | Fail | Section 4 "Coverage matrix": line 79 `Impacted area coverage: Not applicable for this run - regression analysis was not selected.` is not part of the template (section 4 holds only the coverage table; the `Impacted area coverage` text belongs to `06-coverage-matrix.md`, not to the suite). Remove this line. Everything else conforms: document info fields (Run ID, Source issue, Revision, Status, Approved at, Generated); sections 1-8 in fixed order and numbering; subsections 5.1-5.4; `####` test case headings; 5.4 uses `Not applicable for this run - <reason>.`; summary is 4 sentences; summary totals (Functional 14, Negative 13, Security 7, Boundary 16, Equivalence 1, Regression 0, Total 4/33/14/0 = 51) equal the coverage matrix totals and match a recount; section 4 rows match the coverage matrix | test-suite-builder |
| S3 | Revision above 1: every feedback item addressed and listed in the change log | Not applicable | Suite revision is 1 | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| test-suite-builder | S2 | In `08-test-suite.md` section 4, delete the line `Impacted area coverage: Not applicable for this run - regression analysis was not selected.` (and the blank line before it) so section 4 contains only the coverage matrix table. The regression-not-selected statement is already given in section 2 (Out of scope) and in 5.4. Change nothing else | validator (suite) |

## Notes

- The suite text of all test cases is identical to the planner artifacts; no unrequested wording changes were found.
- The suite was generated at 13:45 from `06-coverage-matrix.md` revision 2; all inputs are current (no newer planner artifact revisions).
- Section 7 lists the ISTQB guide, which is not the `Source` of any case; this is consistent with the `Research sources` of `04-edge-case-tests.md` and does not fail a gate.
