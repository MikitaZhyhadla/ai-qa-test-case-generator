# Validation Report - suite

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | validator |
| Scope | suite |
| Attempt | 1 |
| Generated | 2026-09-24 06:00 |
| Artifacts checked | 08-test-suite.md (revision 1), 06-coverage-matrix.md (revision 3), 02-functional-tests.md (revision 1), 03-negative-tests.md (revision 3), 04-edge-case-tests.md (revision 3), 05-regression-impact.md (revision 1) |

## Result

**FAIL** - Gate S2 fails because section 4 of `08-test-suite.md` contains an extra "Impacted area coverage" table that is not part of `suite-template.md`'s fixed layout; gates S1 and S3 pass.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| S1 | Suite contains every active planner test case exactly once, unchanged IDs, no other cases (T6) | Pass | All 50 active test cases (TC-FUN-001..011, TC-NEG-001..011, TC-EDGE-001..020, TC-REG-001..008) from `02`-`05` appear in `08-test-suite.md` exactly once each, with unchanged IDs and byte-identical field values/wording; no removed cases exist in any planner artifact and no extra/foreign test case IDs appear in the suite | - |
| S2 | Suite follows `suite-template.md` exactly (doc info, sections 1-8, fixed numbering/order, 5.1-5.4 subsections, `####` headings, summary totals match matrix) | Fail | Section "4. Coverage matrix" (lines 72-78 of `08-test-suite.md`) contains a second table, "| Impacted area | Regression cases |" with rows IA-1..IA-5, immediately before "## 5. Test cases". `suite-template.md` section 4 defines exactly one table ("| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |") and no "Impacted area" table; the skill instructs to copy the structure exactly and not add sections or fields. All other structural checks pass: document-info fields (Run ID, Source issue, Revision, Status, Approved at, Generated) are present and correctly formatted; sections 1-3, the "Requirement" part of section 4, 5.1-5.4 (with ascending `####` headings TC-FUN-001..011, TC-NEG-001..011, TC-EDGE-001..020, TC-REG-001..008), 6, 7, and 8 all match the template's fixed order and numbering; the section 1 summary totals table (3/27/17/3/50 by priority/type) matches `06-coverage-matrix.md`'s Totals table exactly | test-suite-builder |
| S3 | Revision 1: `Not applicable`; revisions above 1: every feedback item addressed and logged | Not applicable | Suite revision is 1 (first draft, no prior review feedback file exists) | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| test-suite-builder | S2 | In `08-test-suite.md` section "4. Coverage matrix", remove the extra "| Impacted area | Regression cases |" table (currently listing IA-1 through IA-5) so the section contains only the single "| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |" table defined by `suite-template.md`; keep the "## 5. Test cases" heading and everything after it unchanged | validator (suite) |

## Notes

- The "Impacted area" data itself is accurate (it matches `06-coverage-matrix.md`'s "Impacted area coverage" table row for row: IA-1 -> TC-REG-001, TC-REG-002; IA-2 -> TC-REG-003; IA-3 -> TC-REG-004, TC-REG-005; IA-4 -> TC-REG-006; IA-5 -> TC-REG-007, TC-REG-008); the sole problem is that the template does not provide for this table inside the approved suite document.
- Section 7 References in the suite lists the same 5 unique research URLs (2x OWASP, qadecoded.com, Wikipedia Boundary-value analysis, Wikipedia ISO 4217) that were already verified as reachable and correctly attributed during `07-validation-test-design-attempt-3.md` (gate G7); no re-fetch was needed since the suite's Source/Research-sources content is copied verbatim from the already-validated planner artifacts.
