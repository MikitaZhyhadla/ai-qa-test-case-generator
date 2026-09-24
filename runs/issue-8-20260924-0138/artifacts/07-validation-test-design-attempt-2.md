# Validation Report - test-design

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | validator |
| Scope | test-design |
| Attempt | 2 |
| Generated | 2026-09-24 04:15 |
| Artifacts checked | 01-requirements.md (revision 4), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 2), 04-edge-case-tests.md (revision 2), 05-regression-impact.md (revision 1), 06-coverage-matrix.md (revision 2) |

## Result

**FAIL** - The two G4 duplicates from attempt 1 are resolved, but a new G4 duplicate (TC-FUN-007 / TC-NEG-009, both testing "code below campaign minimum" with only numeric values changed) and a G3 violation (TC-EDGE-006's title is 137 characters, over the 100-character limit) remain; all other gates (G1, G2, G5, G6, G7, G8, G9) pass.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| G1 | Every non-removed AC-<n> referenced by at least one test case (T1) | Pass | AC-1 through AC-9 are all referenced and shown as "Covered" in `06-coverage-matrix.md`; recount against the four planner artifacts confirms this | - |
| G2 | Every `Requirement refs` entry exists (T2) | Pass | All `AC-<n>` references (AC-1..AC-9) resolve in `01-requirements.md`; all `IA-<n>` references (IA-1..IA-5) resolve in `05-regression-impact.md`, across all 50 test cases in `02`-`05` | - |
| G3 | All 11 template fields present, non-empty, allowed values; artifact layout matches the skill | Fail | TC-EDGE-006's title ("Waive delivery fee when pre-discount subtotal equals the free-delivery threshold exactly, even though the discounted subtotal is below it", `04-edge-case-tests.md`) is 137 characters, exceeding the 100-character maximum set by the `test-case-template-formatter` skill. All other 49 test case blocks have all 11 fields present, non-empty, and using only allowed values, and all four artifacts follow the required document-info / Scope / Research sources / (Impacted areas) / Test cases / Notes-and-assumptions layout | edge-case-planner |
| G4 | No two active test cases share the same intent, steps, and expected result | Fail | TC-FUN-007 (`02-functional-tests.md`, AC-8) and TC-NEG-009 (`03-negative-tests.md`, AC-8) both test "enter a code linked to an active campaign whose minimum order value the current subtotal does not meet, click Apply" and both expect a distinct minimum-order-value error message, no code/discount shown, and the order total unchanged; the only differences are the literal code string (`BIGSPEND10` vs `BIG20`) and the specific subtotal/minimum amounts (25.00/50.00 vs 40.00/60.00), which is not a distinct equivalence class - the same issue pattern that was fixed for TC-FUN-006/TC-NEG-003 in revision 2 of `03-negative-tests.md` was not applied to this pair. (Attempt 1 did not flag this pair; it is raised now on full re-validation.) | negative-test-planner (TC-NEG-009, later artifact of the pair) |
| G5 | Every AC has a positive and a negative/security case unless `Negative testing` is `Not applicable - <reason>` (T3) | Pass | AC-1 and AC-5 are `Not applicable` and have only positive cases; AC-2, AC-3, AC-4, AC-6, AC-7, AC-8, AC-9 are `Applicable` and each has at least one positive case (functional-test-planner) and one negative/security case (negative-test-planner); this gate checks presence, not distinctness, so it passes independently of the G4 finding on AC-8's pair | - |
| G6 | IDs unique, match `TC-(FUN\|NEG\|EDGE\|REG)-NNN`, prefix matches artifact and allowed `Type` values | Pass | FUN-001..011, NEG-001..011, EDGE-001..020, REG-001..008 are each sequential with no gaps or duplicate numbers; prefixes match their artifact file; every `Type` value used (Functional/Negative/Security/Boundary/Equivalence/Regression) matches the prefix's allowed types in the skill | - |
| G7 | Every `Source` URL is listed in its artifact's Research sources and opens successfully; external-standard-reliant cases have a real URL | Pass | Unique Source URLs - OWASP Input Validation Cheat Sheet, OWASP Injection Prevention Cheat Sheet, qadecoded.com coupon/promo testing article, Wikipedia Boundary-value analysis, Wikipedia ISO 4217 - are all listed in the Research sources of their artifact and all resolved successfully via WebFetch in this validation pass; no test case title/steps cite an external standard (OWASP/RFC/ISO/WCAG) while using `N/A - derived from requirements` as Source | - |
| G8 | Every `IA-<n>` has at least one `TC-REG` case (T4) | Pass | IA-1 (TC-REG-001, TC-REG-002), IA-2 (TC-REG-003), IA-3 (TC-REG-004, TC-REG-005), IA-4 (TC-REG-006), IA-5 (TC-REG-007, TC-REG-008) all have at least one regression case | - |
| G9 | `06-coverage-matrix.md` lists exactly the active test case IDs and totals match a recount (T5) | Pass | Recounting priorities per type from `02`-`05` (Functional 1/6/4/0=11, Negative 0/4/3/2=9, Security 1/1/0/0=2, Boundary 0/10/5/0=15, Equivalence 0/0/4/1=5, Regression 1/5/2/0=8, Total 3/26/18/3=50) matches `06-coverage-matrix.md`'s Totals table exactly; the inventory and requirement/impacted-area coverage tables list all 50 IDs from the four planner artifacts, correctly mapped to their Requirement refs, with no extra or missing IDs and no removed cases in any artifact | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| negative-test-planner | G4 | TC-NEG-009 duplicates TC-FUN-007's intent, steps, and expected result (code below campaign minimum order value -> distinct error, total unchanged, only numbers/code string differ). Revise TC-NEG-009 to cover a genuinely distinct negative scenario for AC-8 (for example: entering a below-minimum code while a different valid code is already applied, and confirming the currently applied code/discount is NOT replaced or cleared by the failed apply attempt; or re-submitting the same below-minimum code twice in a row and confirming the error is shown consistently without side effects), or remove it (`Removed: <reason>`) if TC-EDGE-001 already provides sufficient distinct negative-adjacent boundary coverage for AC-8 | coverage-aggregator, then validator (test-design) |
| edge-case-planner | G3 | TC-EDGE-006's title is 137 characters, over the 100-character maximum. Shorten it to 100 characters or fewer while preserving the tested behavior (pre-discount subtotal equals the free-delivery threshold, discount still evaluated against it even though the discounted subtotal is lower), for example: "Waive delivery fee when pre-discount subtotal equals the free-delivery threshold exactly" (91 characters) | coverage-aggregator, then validator (test-design) |

## Notes

- TC-FUN-011 (`02-functional-tests.md`, AC-9) and TC-NEG-011 (`03-negative-tests.md`, AC-9) both use item removal as the trigger that drops the subtotal below the campaign minimum. This is not failed under G4, consistent with the attempt-1 assessment: TC-FUN-011's steps describe the trigger generically ("reduce the cart ... for example by removing one item") as the AC-9 positive confirmation, while TC-NEG-010/TC-NEG-011 deliberately split AC-9's two stated triggers (quantity reduction vs. item removal) into separate negative cases, and the discount types differ (fixed vs. percentage). The owners should still consider tightening TC-FUN-011 to a quantity-change trigger in a future revision to reduce overlap with TC-NEG-011.
- The Research sources entry for Boundary-value analysis (`04-edge-case-tests.md`) states it was "applied to all TC-EDGE-0xx boundary cases" for technique design, but only TC-EDGE-015/016 cite an actual Source URL (ISO 4217); this does not violate G7 (which only requires that URLs used as a Source field appear in Research sources) but is worth noting for consistency.
- This is a full re-validation, not a delta check; the G4 finding on TC-FUN-007/TC-NEG-009 and the G3 finding on TC-EDGE-006 were present since revision 1 of their artifacts but were not raised in `07-validation-test-design-attempt-1.md`. Fixing the two new findings should not reintroduce the two duplicates already resolved in revision 2 (TC-FUN-006/TC-NEG-003 and TC-FUN-004/TC-EDGE-020), which remain correctly distinct in this pass.
