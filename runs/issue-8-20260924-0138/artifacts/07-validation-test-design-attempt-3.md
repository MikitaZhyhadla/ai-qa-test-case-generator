# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | validator |
| Scope | test-design |
| Attempt | 3 |
| Generated | 2026-09-24 05:30 |
| Artifacts checked | 01-requirements.md (revision 4), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 3), 04-edge-case-tests.md (revision 3), 05-regression-impact.md (revision 1), 06-coverage-matrix.md (revision 3) |

## Result

**PASS** - Both findings from attempt 2 are resolved (TC-EDGE-006's title is now 86 characters and TC-NEG-009 now exercises a genuinely distinct AC-8 scenario from TC-FUN-007), and a full re-check of all nine gates (G1-G9) finds no further violations.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC-<n> referenced by at least one test case (T1) | Pass | AC-1 through AC-9 are each referenced by at least one test case and shown as "Covered" in `06-coverage-matrix.md`; recount against the four planner artifacts confirms this | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All `AC-<n>` references (AC-1..AC-9) resolve in `01-requirements.md`; all `IA-<n>` references (IA-1..IA-5) resolve in `05-regression-impact.md`, across all 50 test cases in `02`-`05` | - |
| G3 | All 11 template fields present, non-empty, allowed values; artifact layout matches the skill | Pass | TC-EDGE-006's title ("Waive delivery fee when pre-discount subtotal equals the free-delivery threshold exactly") is now 86 characters, under the 100-character maximum. All 50 test case blocks have all 11 fields present, non-empty, with allowed `Type`/`Priority`/`Technique` values; all four artifacts (`02`-`05`) follow the required document-info / Scope / Research sources / (Impacted areas for `05`) / Test cases / Notes-and-assumptions layout | - |
| G4 | No two active test cases share the same intent, steps, and expected result | Pass | TC-NEG-009 (`03-negative-tests.md`, revision 3) now exercises applying a below-minimum code (`BIG20`) while a different valid code (`SAVE10`) is already applied, confirming the applied code is not disturbed - distinct from TC-FUN-007's fresh-apply-with-no-code-applied scenario for AC-8. Re-comparison of all 50 cases across `02`-`05` found no other pair sharing identical intent, steps, and expected result; the previously resolved pairs (TC-FUN-006/TC-NEG-003, TC-FUN-004/TC-EDGE-020) remain distinct | - |
| G5 | Every AC has a positive and a negative/security case unless `Negative testing` is `Not applicable - <reason>` (T3) | Pass | AC-1 and AC-5 are `Not applicable` and have only positive cases; AC-2, AC-3, AC-4, AC-6, AC-7, AC-8, AC-9 are `Applicable` and each has at least one positive case and one negative/security case | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed `Type` values | Pass | FUN-001..011, NEG-001..011, EDGE-001..020, REG-001..008 are each sequential with no gaps or duplicate numbers; prefixes match their artifact file; every `Type` value used matches the prefix's allowed types in the skill | - |
| G7 | Every `Source` URL is listed in its artifact's Research sources and opens successfully; external-standard-reliant cases have a real URL | Pass | The five unique Source URLs in use - OWASP Input Validation Cheat Sheet, OWASP Injection Prevention Cheat Sheet, qadecoded.com coupon/promo testing article, Wikipedia Boundary-value analysis, Wikipedia ISO 4217 - are all listed in their artifact's Research sources and all resolved successfully via WebFetch in this validation pass; no test case title/steps cite an external standard (OWASP/RFC/ISO/WCAG) while using `N/A - derived from requirements` as Source | - |
| G8 | Every `IA-<n>` has at least one `TC-REG` case (T4) | Pass | IA-1 (TC-REG-001, TC-REG-002), IA-2 (TC-REG-003), IA-3 (TC-REG-004, TC-REG-005), IA-4 (TC-REG-006), IA-5 (TC-REG-007, TC-REG-008) all have at least one regression case | - |
| G9 | `06-coverage-matrix.md` lists exactly the active test case IDs and totals match a recount (T5) | Pass | Recounting priorities per type from `02`-`05` (Functional 1/6/4/0=11, Negative 0/5/2/2=9, Security 1/1/0/0=2, Boundary 0/10/5/0=15, Equivalence 0/0/4/1=5, Regression 1/5/2/0=8, Total 3/27/17/3=50) matches `06-coverage-matrix.md`'s Totals table exactly; the inventory and requirement/impacted-area coverage tables list all 50 IDs correctly mapped to their Requirement refs, with no extra or missing IDs and no removed cases in any artifact | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| - | - | - | - |

## Notes

- TC-FUN-011 (`02-functional-tests.md`, AC-9) and TC-NEG-011 (`03-negative-tests.md`, AC-9) both use item removal as the trigger that drops the subtotal below the campaign minimum, but use different discount types (fixed vs. percentage), different codes, and different numeric data, and TC-FUN-011 describes the trigger generically ("for example by removing one item") as one instance of AC-9's positive confirmation while TC-NEG-010/TC-NEG-011 deliberately split AC-9's two stated triggers into separate negative cases; this does not meet G4's identical-intent/steps/expected-result bar.
- This is a full re-validation, not a delta check; all nine gates were re-verified against the current revisions of all six artifacts, not only the two items flagged in attempt 2.
