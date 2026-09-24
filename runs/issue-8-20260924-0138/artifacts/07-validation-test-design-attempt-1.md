# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | validator |
| Scope | test-design |
| Attempt | 1 |
| Generated | 2026-09-24 03:15 |
| Artifacts checked | 01-requirements.md (revision 4), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 1), 04-edge-case-tests.md (revision 1), 05-regression-impact.md (revision 1), 06-coverage-matrix.md (revision 1) |

## Result

**FAIL** - Gate G4 fails because two pairs of test cases across artifacts duplicate each other's intent, steps, and expected result (TC-FUN-006/TC-NEG-003 and TC-FUN-004/TC-EDGE-020); all other gates (G1, G2, G3, G5, G6, G7, G8, G9) pass.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC-<n> referenced by at least one test case (T1) | Pass | AC-1 through AC-9 are all referenced and shown as "Covered" in `06-coverage-matrix.md`; recount against the planner artifacts confirms this | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All `AC-<n>` and `IA-<n>` references in the 50 test cases across `02`-`05` resolve to an existing ID in `01-requirements.md` or `05-regression-impact.md` | - |
| G3 | All 11 template fields present, non-empty, allowed values; artifact layout matches the skill | Pass | All 50 test case blocks in `02`-`05` have Type, Priority, Requirement refs, Technique, Source, Preconditions, Test data, Steps, Expected result plus ID/Title in the heading, all non-empty and using allowed values; all four artifacts follow the `# Title` / document-info table / `## Scope` / `## Research sources` / `## Test cases` / `## Notes and assumptions` layout, and `05-regression-impact.md` includes the required `## Impacted areas` section in the correct position | - |
| G4 | No two active test cases share the same intent, steps, and expected result | Fail | (1) TC-FUN-006 (`02-functional-tests.md`) and TC-NEG-003 (`03-negative-tests.md`) both test "enter an unrecognized promo code, click Apply" against a 45.00 EUR subtotal with no code applied, and both expect an invalid-code error with the order total unchanged and no code/discount shown; the only difference is the literal code string (`NOTREAL2024` vs `NOTAREALCODE`), which is not a distinct equivalence class. (2) TC-FUN-004 (`02-functional-tests.md`) and TC-EDGE-020 (`04-edge-case-tests.md`) both test "apply a second promo code while a first code is already applied" and both expect the second code to replace the first per BR-6, with the first code's discount no longer shown and the total recalculated for the new code; only the code names/amounts differ, not the test procedure or the equivalence class exercised | negative-test-planner (TC-NEG-003, later artifact of the pair); edge-case-planner (TC-EDGE-020, later artifact of the pair) |
| G5 | Every AC has a positive and a negative/security case unless `Negative testing` is `Not applicable - <reason>` (T3) | Pass | AC-1 and AC-5 are `Not applicable` and have only positive cases (TC-FUN-001; TC-FUN-002/003/004); AC-2, AC-3, AC-4, AC-6, AC-7, AC-8, AC-9 are `Applicable` and each has at least one positive case (functional-test-planner) and one negative/security case (negative-test-planner) | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed `Type` values | Pass | FUN-001..011, NEG-001..011, EDGE-001..020, REG-001..008 are each sequential with no gaps or duplicate numbers; prefixes match their artifact file; every `Type` value used (Functional/Negative/Security/Boundary/Equivalence/Regression) matches the prefix's allowed types in the skill | - |
| G7 | Every `Source` URL is listed in its artifact's Research sources and opens successfully; external-standard-reliant cases have a real URL | Pass | Unique Source URLs used - OWASP Input Validation Cheat Sheet, OWASP Injection Prevention Cheat Sheet, qadecoded.com coupon/promo testing article, Wikipedia ISO 4217 - are all listed in `03-negative-tests.md`/`04-edge-case-tests.md` Research sources and all resolved successfully via WebFetch; no test case title/steps cite an external standard (OWASP/RFC/ISO/WCAG) while using `N/A - derived from requirements` as Source | - |
| G8 | Every `IA-<n>` has at least one `TC-REG` case (T4) | Pass | IA-1 (TC-REG-001, TC-REG-002), IA-2 (TC-REG-003), IA-3 (TC-REG-004, TC-REG-005), IA-4 (TC-REG-006), IA-5 (TC-REG-007, TC-REG-008) all have at least one regression case | - |
| G9 | `06-coverage-matrix.md` lists exactly the active test case IDs and totals match a recount (T5) | Pass | Recounting priorities per type from `02`-`05` (Functional 1/6/4/0=11, Negative 0/4/3/2=9, Security 1/1/0/0=2, Boundary 0/10/5/0=15, Equivalence 0/0/4/1=5, Regression 1/5/2/0=8, Total 3/26/18/3=50) matches `06-coverage-matrix.md`'s Totals table exactly; the inventory table lists all 50 IDs from the four planner artifacts with no extra or missing IDs and no removed cases exist in any artifact | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| negative-test-planner | G4 | TC-NEG-003 duplicates TC-FUN-006's intent, steps, and expected result (unrecognized code -> generic invalid-code error, total unchanged). Revise TC-NEG-003 to cover a genuinely distinct negative scenario for AC-4 (for example an expired code, since AC-4 covers "not recognized, expired, or otherwise not usable" and only the "not recognized" path is currently tested here and in TC-FUN-006), or remove it (`Removed: <reason>`) since TC-NEG-004/005/006 already cover the malformed and injection-style invalid-input paths for AC-4 | coverage-aggregator, then validator (test-design) |
| edge-case-planner | G4 | TC-EDGE-020 duplicates TC-FUN-004's intent, steps, and expected result (applying a second code replaces the first per BR-6). Revise TC-EDGE-020 to exercise a genuinely distinct boundary aspect of the single-applied-code limit (for example attempting to apply the same code again while it is already applied, or applying a second code in immediate succession before the first apply completes) so it is not a restatement of TC-FUN-004, or remove it (`Removed: <reason>`) since TC-FUN-004 already covers the replacement flow | coverage-aggregator, then validator (test-design) |

## Notes

- TC-FUN-011 (`02-functional-tests.md`, AC-9) and TC-NEG-011 (`03-negative-tests.md`, AC-9) both use item removal as the trigger that drops the subtotal below the campaign minimum and produce a structurally similar outcome. This was not failed under G4 because TC-FUN-011's steps describe the trigger generically ("reduce the cart ... for example by removing one item") while TC-NEG-011 and TC-NEG-010 deliberately split AC-9's two stated triggers (item removal vs. quantity reduction) into separate negative cases; however, the owners should consider tightening TC-FUN-011 to a quantity-change trigger (or otherwise sharpening the distinction) in a future revision to reduce overlap with TC-NEG-011.
- The Research sources entry for Boundary-value analysis (`04-edge-case-tests.md`) states it was "applied to all TC-EDGE-0xx boundary cases" for technique design, but only TC-EDGE-015/016 cite an actual Source URL (ISO 4217); this does not violate G7 (which only requires that URLs used as a Source field appear in Research sources) but is worth noting for consistency.
