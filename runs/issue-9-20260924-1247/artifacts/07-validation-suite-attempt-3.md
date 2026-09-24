# Validation Report - suite

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | validator |
| Scope | suite |
| Attempt | 3 |
| Generated | 2026-09-24 14:20 |
| Artifacts checked | 08-test-suite.md (revision 4), 06-coverage-matrix.md (revision 3), 02-functional-tests.md (revision 2), 03-negative-tests.md (revision 2), 04-edge-case-tests.md (revision 2), 09-review-feedback-rev-2.md |

## Result

**PASS** - all 51 active test cases are in the suite exactly once with bodies and priorities identical to the planner artifacts, the suite follows `suite-template.md`, and both feedback items are addressed and listed in the change log.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| S1 | Suite contains every active test case exactly once with unchanged IDs and no other test cases (T6) | Pass | The whole suite (lines 1-1594) was read, including lines 1287-1594. 51 active cases: TC-FUN-001 to 014 (14) in 5.1, TC-NEG-001 to 020 (20) in 5.2, TC-EDGE-001 to 009, 011, 014 to 020 (17) in 5.3, each once and in ascending order. Removed TC-EDGE-010, 012, 013 are absent. No other IDs. Every case body (title, Type, Priority, Requirement refs, Technique, Source, Preconditions, Test data, Steps, Expected result) was compared with its planner artifact and is identical. Priorities equal the planner artifacts, including TC-FUN-010 = Critical and TC-NEG-015 = Critical (also TC-FUN-006, TC-NEG-011, TC-NEG-014, TC-NEG-017 = Critical; all others unchanged). Section 4 rows and the summary totals equal `06-coverage-matrix.md` and match my recount (Functional 2/7/5/0 = 14, Negative 1/8/4/0 = 13, Security 3/4/0/0 = 7, Boundary 0/12/4/0 = 16, Equivalence 0/0/1/0 = 1, Regression 0; total 6/31/14/0 = 51) | - |
| S2 | Suite follows `suite-template.md` exactly | Pass | Document info has all 6 fields in order (Revision 4, Status `Draft - awaiting approval`, Approved at `-`). Sections 1-8 in fixed numbering and order; subsections 5.1-5.4 present; test cases use `####` headings; 5.4 uses `Not applicable for this run - <reason>.`; Summary has 4 sentences; Section 4 contains only the coverage table; Section 3 lists AC-1 to AC-11; Change log is a 3-column table | - |
| S3 | Revision above 1: every feedback item of the latest review feedback is addressed and listed in the change log | Pass | Feedback item 1 (raise every AC-7 double-booking case to Critical): TC-FUN-010 and TC-NEG-015 are Critical in the suite and in the planner artifacts; the change log (rev 4) explains why TC-NEG-007 (AC-4) and TC-NEG-013 (AC-6, two different slots) stay High. Feedback item 2 (positive case: patient with 3 upcoming appointments cancels one, then books a new slot): the change log (rev 4) records that no new case was added because TC-FUN-009 already covers exactly this scenario; TC-FUN-009 is present in the suite (steps: cancel one of 3 appointments, then book a new slot; expected: booking accepted, patient again has 3) | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| - | - | - | - |

## Notes

- Feedback item 2 is resolved by pointing to the existing TC-FUN-009, which was already in the suite at revision 2, and the human still asked for a case. The scenario matches TC-FUN-009 exactly, so S3 passes. The human reviewer may want to confirm this at approval.
- Change log has two rows for revision 4 (F-1 and F-2) and a row for revision 3; this is acceptable, no gate impact.
- Section 7 lists the ISTQB guide, which is not the `Source` of any case; it is listed in `Research sources` of `04-edge-case-tests.md`, no gate impact.
