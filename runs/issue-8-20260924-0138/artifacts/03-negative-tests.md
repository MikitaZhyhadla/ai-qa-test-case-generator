# Negative and Security Test Cases

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | negative-test-planner |
| Revision | 3 |
| Generated | 2026-09-24 04:45 |

## Scope

This artifact covers negative and security behavior for the promo-code cart/checkout feature described in `01-requirements.md`: applying invalid or unusable codes, applying a code without meeting a campaign's minimum order value, removing a code when none is applied, auto-removal after a cart change or at checkout, repeated/concurrent submission, and malformed or attack-pattern input in the promo code field. It deliberately does not cover boundary values (minimum/maximum thresholds and their neighbors), which belong to `edge-case-planner`, and does not cover happy-path apply/remove/checkout flows, which belong to `functional-test-planner`.

## Research sources

- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - used allowlisting, length-limit, and anchored-regex guidance to design the malformed/oversized and script-injection promo code input cases (TC-NEG-004, TC-NEG-005)
- [Injection Prevention - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) - used guidance on treating free-text input as untrusted before it is matched against stored codes, for the SQL-injection-style payload case (TC-NEG-006)
- [Coupon, Discount, and Promo Testing | QA Decoded](https://www.qadecoded.com/topics/coupon-discount-promo-testing) - used concrete scenarios for duplicate/concurrent apply submission, re-evaluating the minimum-order threshold at checkout, and re-evaluating an applied code after a cart change (TC-NEG-001, TC-NEG-008, TC-NEG-010, TC-NEG-011)

## Test cases

### TC-NEG-001 - Reject duplicate discount from rapid double-submission of a valid percentage code

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Error guessing |
| Source | https://www.qadecoded.com/topics/coupon-discount-promo-testing |

**Preconditions**
- Shopper is on the cart page with items in the cart; subtotal is 80.00 EUR
- Promo code "SPRING10" is linked to an active percentage-discount campaign (10%) with no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: SPRING10
- Subtotal: 80.00 EUR

**Steps**
1. Enter "SPRING10" in the Promo code field.
2. Click "Apply" twice in rapid succession (double-click) before the page finishes processing the first click.

**Expected result**
- The discount is applied exactly once (8.00 EUR, 10% of 80.00 EUR)
- The order summary shows a single applied code "SPRING10" and a single discount line
- The order total reflects only one discount deduction, not two

### TC-NEG-002 - Prevent applying a fixed-amount promo code to an empty cart

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper's cart contains no items (subtotal 0.00 EUR)
- Promo code "FLAT5" is linked to an active fixed-amount-discount campaign (5.00 EUR) with no minimum order value

**Test data**
- Promo code: FLAT5

**Steps**
1. Navigate to the cart page with an empty cart.
2. Enter "FLAT5" in the Promo code field.
3. Click "Apply".

**Expected result**
- No discount is applied to the order total
- An error or informational message indicates the code cannot be applied to an empty cart
- The order summary shows no applied code and no discount amount

### TC-NEG-003 - Show invalid-code error for a code linked to an expired campaign

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-4 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper is on the cart page with items in the cart; subtotal is 45.00 EUR
- No promo code is currently applied
- Promo code "SUMMER19" is linked to a percentage-discount campaign whose end date has already passed (the campaign is no longer active)

**Test data**
- Promo code: SUMMER19

**Steps**
1. Enter "SUMMER19" in the Promo code field.
2. Click "Apply".

**Expected result**
- An error message is displayed stating the code is invalid or not usable (AC-4 does not require the message to distinguish an expired code from any other not-usable code)
- The order total remains unchanged (45.00 EUR subtotal + applicable delivery fee)
- No code or discount is shown in the order summary

### TC-NEG-004 - Reject an excessively long or malformed promo code input gracefully

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Low |
| Requirement refs | AC-4 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- Shopper is on the cart page with items in the cart; subtotal is 45.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: a 500-character string of repeated letter "A" (e.g., "AAAA...A" x500)

**Steps**
1. Paste the 500-character string into the Promo code field.
2. Click "Apply".

**Expected result**
- The system rejects the input without a server error, timeout, or crash
- An error message indicates the code is invalid or exceeds the allowed format
- The order total remains unchanged and no code is shown as applied

### TC-NEG-005 - Neutralize a script-tag payload entered in the promo code field

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- Shopper is on the cart page with items in the cart; subtotal is 45.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `<script>alert(1)</script>`

**Steps**
1. Enter `<script>alert(1)</script>` in the Promo code field.
2. Click "Apply".

**Expected result**
- The input is treated as an unrecognized/invalid code; the generic invalid-code error is shown as plain text
- The script does not execute and no JavaScript dialog or code execution occurs
- The order total remains unchanged and no code is shown as applied

### TC-NEG-006 - Reject a SQL-injection-style payload entered in the promo code field

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-4 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html |

**Preconditions**
- Shopper is on the cart page with items in the cart; subtotal is 45.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `' OR '1'='1' --`

**Steps**
1. Enter `' OR '1'='1' --` in the Promo code field.
2. Click "Apply".

**Expected result**
- The generic invalid-code error is displayed; no code is applied
- No campaign data, other codes, or database/server error details are disclosed in the response
- The order total remains unchanged

### TC-NEG-007 - Handle Remove action safely when no promo code is currently applied

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Low |
| Requirement refs | AC-6 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper is on the cart page with items in the cart; subtotal is 45.00 EUR
- No promo code is currently applied (no code is shown, and the "Remove" control is either not shown or is a no-op)

**Test data**
- None

**Steps**
1. Navigate to the cart page with no promo code applied.
2. Attempt to trigger the "Remove" action for a promo code (via the UI control if present, or confirm no such control is available).

**Expected result**
- No error or unexpected state occurs; the removal action has no visible effect
- The order summary continues to show no applied code and no discount
- The order total remains unchanged

### TC-NEG-008 - Auto-remove promo code at checkout when minimum order value is no longer met

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-7, AC-9 |
| Technique | State transition |
| Source | https://www.qadecoded.com/topics/coupon-discount-promo-testing |

**Preconditions**
- Promo code "BIG20" is linked to an active percentage-discount campaign (20%) with a 60.00 EUR minimum order value
- Shopper applied "BIG20" in the cart while the subtotal was 65.00 EUR
- Before proceeding to checkout, the cart subtotal dropped to 55.00 EUR (e.g., a quantity was reduced)

**Test data**
- Promo code: BIG20
- Subtotal at apply: 65.00 EUR
- Subtotal at checkout load: 55.00 EUR

**Steps**
1. From the cart with the reduced subtotal, click "Proceed to checkout".
2. Observe the checkout page order summary.

**Expected result**
- The checkout page shows the promo code has been automatically removed
- An explanatory message states the order no longer meets the code's minimum order value
- The order total displayed at checkout reflects the value without the discount

### TC-NEG-009 - Reject a below-minimum code without disturbing an already-applied valid code

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Promo code "SAVE10" (10% off, no minimum order value) is already applied, showing a discount of 4.00 EUR and an order total of 40.99 EUR (40.00 - 4.00 + 4.99)
- Promo code "BIG20" is linked to a different active campaign with a 60.00 EUR minimum order value

**Test data**
- Currently applied code: SAVE10
- Attempted code: BIG20
- Subtotal: 40.00 EUR

**Steps**
1. With "SAVE10" already applied, enter "BIG20" in the Promo code field.
2. Click "Apply".

**Expected result**
- An error message distinct from the generic invalid-code message is displayed, stating the required minimum order value (60.00 EUR) for "BIG20"
- The previously applied code "SAVE10" remains applied, unchanged, with its discount still shown as 4.00 EUR (BR-6's replace-on-success rule does not trigger, since the "BIG20" apply attempt failed)
- The order total remains 40.99 EUR, unchanged

### TC-NEG-010 - Auto-remove promo code when reducing item quantity drops subtotal below minimum order value

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | State transition |
| Source | https://www.qadecoded.com/topics/coupon-discount-promo-testing |

**Preconditions**
- Promo code "BIG20" (20% off, 60.00 EUR minimum order value) is applied to a cart with subtotal 70.00 EUR
- A discount of 14.00 EUR is currently shown in the order summary

**Test data**
- Promo code: BIG20
- Initial subtotal: 70.00 EUR
- Subtotal after quantity reduction: 45.00 EUR

**Steps**
1. Decrease the quantity of an item so the subtotal drops to 45.00 EUR.
2. Observe the order summary.

**Expected result**
- The promo code "BIG20" and its discount are automatically removed from the order summary
- An explanatory message informs the shopper the code was removed because the order no longer meets the minimum order value
- The order total returns to the non-discounted value for the new subtotal

### TC-NEG-011 - Auto-remove promo code when removing an item drops subtotal below minimum order value

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | State transition |
| Source | https://www.qadecoded.com/topics/coupon-discount-promo-testing |

**Preconditions**
- Promo code "BIG20" (20% off, 60.00 EUR minimum order value) is applied to a cart with two item lines and subtotal 75.00 EUR

**Test data**
- Promo code: BIG20
- Initial subtotal: 75.00 EUR
- Subtotal after removing one item line: 30.00 EUR

**Steps**
1. Remove one full item line from the cart so the subtotal drops to 30.00 EUR.
2. Observe the order summary.

**Expected result**
- The promo code "BIG20" and its discount are automatically removed from the order summary
- An explanatory message informs the shopper the code was removed because the order no longer meets the minimum order value
- The order total returns to the non-discounted value for the new subtotal (30.00 EUR + applicable delivery fee)

## Notes and assumptions

- Test data uses fictional promo codes (SPRING10, FLAT5, BIG20) and campaign parameters not defined in the requirements; actual codes and campaign configuration are managed in the admin panel, which is out of scope for this PBI (BR-1, A-1).
- TC-NEG-007's scope follows `01-requirements.md`'s Notes and assumptions, which limit AC-6 negative testing to the case where no code is currently applied.
- TC-NEG-008's scope follows `01-requirements.md`'s Notes and assumptions, which limit AC-7 negative testing to a code that no longer meets the campaign's minimum order value by the time checkout loads, and ties this to the AC-9 auto-removal behavior.
- `security_sensitive` is `no` for this run; TC-NEG-005 and TC-NEG-006 are included as defense-in-depth checks on the free-text promo code input, derived from OWASP research, not because the feature was flagged as security-sensitive.
- No external-dependency-failure or missing-permission/expired-session cases are included: the requirements do not describe an external service call in the shopper-facing apply flow, and applying/removing a code does not require authentication (BR-9 allows guest shoppers to apply a code).
- Revision 2: per validation gate G4 (`07-validation-test-design-attempt-1.md`), TC-NEG-003 was revised from an unrecognized-code scenario (which duplicated TC-FUN-006's intent, steps, and expected result) to an expired-code scenario, so it now exercises a genuinely distinct path within AC-4's "not recognized, expired, or otherwise not usable" scope; TC-NEG-004/005/006 continue to cover the malformed and injection-style invalid-input paths for AC-4.
- Revision 3: per validation gate G4 (`07-validation-test-design-attempt-2.md`), TC-NEG-009 was revised because it duplicated TC-FUN-007's intent, steps, and expected result (a fresh below-minimum apply with no code previously applied, differing only in the code string and numeric amounts). It now exercises a genuinely distinct scenario for AC-8: attempting to apply a below-minimum code while a different valid code is already applied, and confirming the previously applied code and its discount are not replaced or cleared by the failed apply attempt (an interaction between AC-8's failure path and BR-6's single-code-replacement rule that neither TC-FUN-007 nor TC-EDGE-001 covers).
- Revision 3 self-check: all other TC-NEG-0xx cases were re-compared against `02-functional-tests.md` for duplication. No further duplicates were found - TC-NEG-001 (double-submission), TC-NEG-002 (empty cart), TC-NEG-003 (expired code), TC-NEG-004/005/006 (malformed/attack input), TC-NEG-007 (remove with none applied, vs. TC-FUN-008's remove-when-applied), TC-NEG-008 (checkout-time auto-removal discovered on page load, vs. TC-FUN-009's successful carry-over and TC-FUN-011's cart-page auto-removal), and TC-NEG-010/011 (auto-removal split by trigger type - quantity reduction vs. item removal, both against a discount type distinct from TC-FUN-011's) each exercise a scenario, trigger, or state distinct from any `02-functional-tests.md` case. All test case titles in this artifact were also re-checked and are 100 characters or fewer.
