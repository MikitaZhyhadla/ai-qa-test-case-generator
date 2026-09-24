# Validation Report - requirements

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | validator |
| Scope | requirements |
| Attempt | 1 |
| Generated | 2026-09-24 02:30 |
| Artifacts checked | 01-requirements.md (revision 3) |

## Result

**FAIL** - Gate R1 fails because AC-6 and AC-7 set `Negative testing` to `Applicable - <text>` instead of the exact allowed value `Applicable`.

## Gate results

| Gate | Rule | Status | Findings | Owner |
|---|---|---|---|---|
| R1 | Acceptance criteria table valid: unique gapless IDs, each criterion observable/verifiable, `Negative testing` is `Applicable` or `Not applicable - <reason>` | Fail | IDs AC-1..AC-9 are unique, sequential, and gapless, and each criterion describes an observable, verifiable outcome with no vague wording - that part passes. However, AC-6 (`Applicable - covers the case where no code is currently applied`) and AC-7 (`Applicable - covers a code that no longer meets the minimum order value by the time checkout loads (see AC-9 for the automatic-removal behavior)`) do not use the exact allowed value `Applicable`; they append explanatory text that only the `Not applicable` form is permitted to carry. | requirements-formalizer |
| R2 | `Open questions` table empty; `Status` starts with `Confirmed by user on` | Pass | - | - |
| R3 | `Execution profile` has all 5 keys with allowed values, consistent with requirements | Pass | change_type=existing-feature-change, has_boundaries=yes (consistent: minimum order values, percentage vs. fixed discounts, 50.00 EUR free-delivery threshold, capping/flooring in BR-5, 2-decimal rounding), security_sensitive=no (consistent: no auth/payment/PII changes), output_formats=markdown+html, post_issue_comment=yes - all values allowed and consistent. | - |

## Retry plan

| Owner agent | Gates | Items to fix | Downstream to regenerate |
|---|---|---|---|
| requirements-formalizer | R1 | In the `Acceptance criteria` table, change the `Negative testing` value for AC-6 from `Applicable - covers the case where no code is currently applied` to exactly `Applicable` (move the explanatory note to `Notes and assumptions` or the criterion text itself if needed). Change AC-7's `Negative testing` value from `Applicable - covers a code that no longer meets the minimum order value by the time checkout loads (see AC-9 for the automatic-removal behavior)` to exactly `Applicable` (move the explanatory note elsewhere). | validator (requirements) |

## Notes

- None
