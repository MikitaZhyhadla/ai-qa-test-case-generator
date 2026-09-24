# Test Suite - Promo code in the shopping cart

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Source issue | [#8 PBI: Apply a promo code in the shopping cart](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/8) |
| Revision | 2 |
| Status | Draft - awaiting approval |
| Approved at | - |
| Generated | 2026-09-24 05:45 |

## 1. Summary

This suite covers the promo-code feature added to the ShopNest shopping cart: entering a code in a new "Promo code" field, applying percentage or fixed-amount discounts (with optional campaign minimum order values), removing an applied code, carrying the applied code and discount through checkout, and automatic removal when a cart change drops the order below a campaign's minimum. The testing approach combines functional coverage of the happy paths, negative and security coverage of invalid input and error conditions, boundary and equivalence coverage of the numeric thresholds and rounding/casing rules introduced by the feature, and a regression analysis of the pre-existing order-total calculation, checkout, order history, and cart-persistence behavior this change touches. All four planner agents ran because the feature has boundary-heavy calculations, multiple failure paths, and modifies an existing, already-released cart/checkout flow.

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 1 | 6 | 4 | 0 | 11 |
| Negative | 0 | 5 | 2 | 2 | 9 |
| Security | 1 | 1 | 0 | 0 | 2 |
| Boundary | 0 | 10 | 5 | 0 | 15 |
| Equivalence | 0 | 0 | 4 | 1 | 5 |
| Regression | 1 | 5 | 2 | 0 | 8 |
| **Total** | 3 | 27 | 17 | 3 | 50 |

## 2. Scope

**In scope**
- Display of the "Promo code" field and "Apply" button in the cart order summary
- Applying valid percentage-discount and fixed-amount-discount codes, including campaign minimum order value checks
- Discount calculation, order-total recalculation, capping, flooring, and rounding rules
- The free-delivery threshold evaluated against the original, pre-discount subtotal
- Invalid, expired, unrecognized, and malformed/malicious code input
- Removing an applied code and automatic removal after a cart change drops the order below the campaign minimum
- Carrying the applied code and discount through checkout
- Persistence of an applied code with the saved cart for logged-in shoppers, and session-only persistence for guest shoppers
- Regression impact on pre-existing order-total calculation, cart recalculation, checkout summary, order confirmation email, order history, monthly sales report, and cart persistence

**Out of scope**
- Creation and configuration of promo codes and campaigns in the admin panel (BR-1; out of scope per the requirements, admin panel not part of this PBI's testable UI)
- Performance, accessibility, and localization aspects (no non-functional requirements stated in the PBI)
- Authentication and payment-method processing beyond what is needed to exercise cart/checkout persistence

## 3. Requirements under test

| ID | Acceptance criterion |
|---|---|
| AC-1 | The cart page shows a "Promo code" text field and an "Apply" button in the order summary area, alongside the existing subtotal, delivery fee, and order total. |
| AC-2 | When the shopper enters a code linked to an active percentage-discount campaign and the order subtotal meets the campaign's minimum order value (if any), then clicks "Apply", the discount is calculated as the campaign's percentage of the subtotal, the order total is recalculated as (subtotal - discount) + delivery fee (the free-delivery threshold is evaluated against the original, pre-discount subtotal), and the reduced order total is displayed. |
| AC-3 | When the shopper enters a code linked to an active fixed-amount-discount campaign and the order subtotal meets the campaign's minimum order value (if any), then clicks "Apply", the discount is the campaign's fixed amount capped so it never exceeds the subtotal, the order total is recalculated as (subtotal - discount) + delivery fee and floored at the delivery fee amount (or at 0.00 EUR if delivery is also waived), with the free-delivery threshold evaluated against the original, pre-discount subtotal, and the reduced order total is displayed. |
| AC-4 | When the shopper enters a code that is not valid (not recognized, expired, or otherwise not usable) and clicks "Apply", an error message is displayed and the order total does not change. |
| AC-5 | After a code is successfully applied, the order summary shows the applied code and the resulting discount amount. |
| AC-6 | The shopper can remove an applied promo code from the cart; after removal, the order summary no longer shows the code or its discount, and the order total returns to the value it had without the discount. |
| AC-7 | When the shopper continues from the cart to checkout after applying a valid code, checkout shows the same applied code and discount, and the order total reflects the discount. |
| AC-8 | When the shopper enters a code linked to an active campaign but the order subtotal does not meet the campaign's minimum order value, and clicks "Apply", a distinct error message is displayed stating the required minimum order value, and the order total does not change. |
| AC-9 | If the shopper changes cart contents (changes a quantity or removes an item) after a code was applied, and the order subtotal no longer meets the campaign's minimum order value, the code is automatically removed, an explanatory message is displayed, and the order total returns to the value it had without the discount. |

## 4. Coverage matrix

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |
|---|---|---|---|---|
| AC-1 | TC-FUN-001 | - | - | - |
| AC-2 | TC-FUN-002, TC-FUN-004 | TC-NEG-001 | TC-EDGE-002, TC-EDGE-005, TC-EDGE-006, TC-EDGE-012, TC-EDGE-013, TC-EDGE-014, TC-EDGE-015, TC-EDGE-016, TC-EDGE-017, TC-EDGE-018, TC-EDGE-019, TC-EDGE-020 | TC-REG-006 |
| AC-3 | TC-FUN-003, TC-FUN-004, TC-FUN-005 | TC-NEG-002 | TC-EDGE-003, TC-EDGE-007, TC-EDGE-008, TC-EDGE-009, TC-EDGE-010, TC-EDGE-011 | - |
| AC-4 | TC-FUN-006 | TC-NEG-003, TC-NEG-004, TC-NEG-005, TC-NEG-006 | - | - |
| AC-5 | TC-FUN-002, TC-FUN-003, TC-FUN-004 | - | - | - |
| AC-6 | TC-FUN-008 | TC-NEG-007 | - | - |
| AC-7 | TC-FUN-009, TC-FUN-010 | TC-NEG-008 | - | TC-REG-005 |
| AC-8 | TC-FUN-007 | TC-NEG-009 | TC-EDGE-001 | - |
| AC-9 | TC-FUN-011 | TC-NEG-010, TC-NEG-011 | TC-EDGE-004 | - |

## 5. Test cases

### 5.1 Functional

#### TC-FUN-001 - Display the Promo code field and Apply button in the cart order summary

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-1 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with at least one item: 1x "Wireless Mouse" at 25.00 EUR

**Test data**
- None

**Steps**
1. Open the cart page.
2. Locate the order summary area (subtotal, delivery fee, order total).

**Expected result**
- A "Promo code" text field is displayed in the order summary area.
- An "Apply" button is displayed next to the "Promo code" field.
- The existing subtotal, delivery fee, and order total are still displayed unchanged.

#### TC-FUN-002 - Apply a valid percentage-discount promo code and recalculate the order total

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-2, AC-5 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 45.00 EUR (below the 50.00 EUR free-delivery threshold)
- An active percentage-discount campaign exists with code `SPRING20`, 20% off, minimum order value 30.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `SPRING20`
- Subtotal: 45.00 EUR
- Delivery fee (before discount logic): 4.99 EUR

**Steps**
1. Open the cart page.
2. Enter `SPRING20` in the "Promo code" field.
3. Click "Apply".

**Expected result**
- The discount is calculated as 20% of the 45.00 EUR subtotal, that is 9.00 EUR.
- The order summary shows the applied code `SPRING20` and a discount amount of 9.00 EUR.
- The order total is recalculated as (45.00 - 9.00) + 4.99 = 40.99 EUR and displayed.

#### TC-FUN-003 - Apply a valid fixed-amount-discount promo code and recalculate the order total

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-3, AC-5 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 38.00 EUR (below the 50.00 EUR free-delivery threshold)
- An active fixed-amount-discount campaign exists with code `FIX15`, 15.00 EUR off, minimum order value 20.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `FIX15`
- Subtotal: 38.00 EUR
- Delivery fee (before discount logic): 4.99 EUR

**Steps**
1. Open the cart page.
2. Enter `FIX15` in the "Promo code" field.
3. Click "Apply".

**Expected result**
- The discount is 15.00 EUR (the fixed campaign amount, which is less than the subtotal so no capping applies).
- The order summary shows the applied code `FIX15` and a discount amount of 15.00 EUR.
- The order total is recalculated as (38.00 - 15.00) + 4.99 = 27.99 EUR and displayed.

#### TC-FUN-004 - Applying a new promo code replaces the previously applied code

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-2, AC-3, AC-5 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 38.00 EUR
- Code `FIX15` (fixed 15.00 EUR off, minimum order value 20.00 EUR) is already applied, showing a discount of 15.00 EUR and an order total of 27.99 EUR
- An active percentage-discount campaign exists with code `SPRING20`, 20% off, minimum order value 30.00 EUR

**Test data**
- Currently applied code: `FIX15`
- New promo code: `SPRING20`
- Subtotal: 38.00 EUR

**Steps**
1. Open the cart page with `FIX15` already applied.
2. Enter `SPRING20` in the "Promo code" field.
3. Click "Apply".

**Expected result**
- Business rule BR-6 (only one code at a time) is enforced: `SPRING20` replaces `FIX15` as the applied code.
- The order summary shows only `SPRING20` and its discount; `FIX15` is no longer shown.
- The discount is recalculated as 20% of 38.00 EUR = 7.60 EUR, and the order total is recalculated as (38.00 - 7.60) + 4.99 = 35.39 EUR.

#### TC-FUN-005 - Apply a fixed-amount discount when the subtotal qualifies for free delivery

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 65.00 EUR (at or above the 50.00 EUR free-delivery threshold)
- An active fixed-amount-discount campaign exists with code `FIX15`, 15.00 EUR off, minimum order value 20.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `FIX15`
- Subtotal: 65.00 EUR

**Steps**
1. Open the cart page.
2. Enter `FIX15` in the "Promo code" field.
3. Click "Apply".

**Expected result**
- Business rule BR-4 is honored: the free-delivery threshold is evaluated against the original, pre-discount subtotal of 65.00 EUR, so delivery remains free (0.00 EUR) even though the discounted subtotal would otherwise still be above 50.00 EUR.
- The discount is 15.00 EUR.
- The order total is recalculated as (65.00 - 15.00) + 0.00 = 50.00 EUR and displayed.

#### TC-FUN-006 - Enter an unrecognized promo code and receive an invalid-code error

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 45.00 EUR and an order total of 49.99 EUR
- No promo code is currently applied
- The code `NOTREAL2024` is not linked to any campaign

**Test data**
- Promo code: `NOTREAL2024`
- Subtotal: 45.00 EUR

**Steps**
1. Open the cart page.
2. Enter `NOTREAL2024` in the "Promo code" field.
3. Click "Apply".

**Expected result**
- An error message is displayed indicating the code is not valid.
- No code or discount is added to the order summary.
- The order total remains 49.99 EUR, unchanged.

#### TC-FUN-007 - Enter a valid campaign code that does not meet the minimum order value

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 25.00 EUR and an order total of 29.99 EUR
- An active campaign exists with code `BIGSPEND10`, 10% off, minimum order value 50.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `BIGSPEND10`
- Subtotal: 25.00 EUR
- Campaign minimum order value: 50.00 EUR

**Steps**
1. Open the cart page.
2. Enter `BIGSPEND10` in the "Promo code" field.
3. Click "Apply".

**Expected result**
- A distinct error message is displayed stating the required minimum order value of 50.00 EUR for this code (business rule BR-2).
- No code or discount is added to the order summary.
- The order total remains 29.99 EUR, unchanged.

#### TC-FUN-008 - Remove an applied promo code from the cart

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 45.00 EUR
- Code `SPRING20` (20% off) is already applied, showing a discount of 9.00 EUR and an order total of 40.99 EUR
- A "Remove" control is visible next to the applied code

**Test data**
- Applied code: `SPRING20`

**Steps**
1. Open the cart page with `SPRING20` already applied.
2. Click the "Remove" control next to the applied code.

**Expected result**
- The order summary no longer shows the code `SPRING20` or its discount.
- The order total returns to 49.99 EUR (45.00 + 4.99), the value it had without the discount.

#### TC-FUN-009 - Applied promo code and discount carry over from cart to checkout

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-7 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 38.00 EUR
- Code `FIX15` (15.00 EUR off) is already applied, showing a discount of 15.00 EUR and an order total of 27.99 EUR

**Test data**
- Applied code: `FIX15`

**Steps**
1. Open the cart page with `FIX15` already applied.
2. Click "Continue to checkout".

**Expected result**
- The checkout page shows the same applied code `FIX15` and the same discount amount of 15.00 EUR.
- The checkout order total is 27.99 EUR, matching the discounted total from the cart.

#### TC-FUN-010 - Applied promo code persists with the saved cart across a session for a logged-in shopper

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-7 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper is logged in as `maria.santos@example.com`
- Shopper has a cart with subtotal 45.00 EUR
- Code `SPRING20` (20% off) is applied, showing a discount of 9.00 EUR and an order total of 40.99 EUR

**Test data**
- Account: `maria.santos@example.com`
- Applied code: `SPRING20`

**Steps**
1. With `SPRING20` applied, close the browser session (log out or end the session without removing the code).
2. Log in again as `maria.santos@example.com` in a new session.
3. Open the cart page.

**Expected result**
- Business rule BR-9 is honored: the saved cart loads with `SPRING20` still applied, the same way saved cart items persist.
- The order summary shows the code `SPRING20`, a discount of 9.00 EUR, and an order total of 40.99 EUR.

#### TC-FUN-011 - Promo code is automatically removed when a cart change drops the order below the campaign minimum

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has a cart with subtotal 38.00 EUR containing 2x "Desk Lamp" at 19.00 EUR each
- Code `FIX15` (15.00 EUR off, minimum order value 20.00 EUR) is applied, showing a discount of 15.00 EUR and an order total of 27.99 EUR

**Test data**
- Applied code: `FIX15`
- Campaign minimum order value: 20.00 EUR
- New subtotal after change: 15.00 EUR (1x "Desk Lamp" removed, 1 remains at 15.00 EUR after a quantity/price adjustment used for this scenario)

**Steps**
1. Open the cart page with `FIX15` already applied.
2. Reduce the cart so the subtotal becomes 15.00 EUR (below the 20.00 EUR campaign minimum), for example by removing one item.

**Expected result**
- Business rule BR-8 is honored: the code `FIX15` transitions from applied to automatically removed because the new subtotal no longer meets the campaign's minimum order value.
- An explanatory message is displayed stating that the promo code was removed because the order no longer meets the minimum order value.
- The order summary no longer shows the code or its discount.
- The order total returns to 19.99 EUR (15.00 + 4.99), the value it had without the discount.

### 5.2 Negative and security

#### TC-NEG-001 - Reject duplicate discount from rapid double-submission of a valid percentage code

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

#### TC-NEG-002 - Prevent applying a fixed-amount promo code to an empty cart

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

#### TC-NEG-003 - Show invalid-code error for a code linked to an expired campaign

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

#### TC-NEG-004 - Reject an excessively long or malformed promo code input gracefully

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

#### TC-NEG-005 - Neutralize a script-tag payload entered in the promo code field

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

#### TC-NEG-006 - Reject a SQL-injection-style payload entered in the promo code field

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

#### TC-NEG-007 - Handle Remove action safely when no promo code is currently applied

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

#### TC-NEG-008 - Auto-remove promo code at checkout when minimum order value is no longer met

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

#### TC-NEG-009 - Reject a below-minimum code without disturbing an already-applied valid code

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

#### TC-NEG-010 - Auto-remove promo code when reducing item quantity drops subtotal below minimum order value

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

#### TC-NEG-011 - Auto-remove promo code when removing an item drops subtotal below minimum order value

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

### 5.3 Boundary and edge cases

#### TC-EDGE-001 - Reject apply when subtotal is 0.01 EUR below the campaign minimum order value

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 29.99 EUR
- Delivery fee is 4.99 EUR (subtotal below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `SAVE10` (10% off) requires a minimum order value of 30.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 29.99 EUR (minimum minus 0.01 EUR)
- Campaign minimum order value: 30.00 EUR

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- An error message is displayed stating the required minimum order value of 30.00 EUR
- No code or discount is shown in the order summary
- The order total remains 34.98 EUR (29.99 + 4.99), unchanged

#### TC-EDGE-002 - Accept apply when subtotal equals the campaign minimum order value exactly

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 30.00 EUR
- Delivery fee is 4.99 EUR (subtotal below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `SAVE10` (10% off) requires a minimum order value of 30.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 30.00 EUR (exact minimum)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is calculated as 3.00 EUR (10% of 30.00 EUR)
- The order summary shows the applied code `SAVE10` and a discount of 3.00 EUR
- The order total is displayed as 31.99 EUR (30.00 - 3.00 + 4.99)

#### TC-EDGE-003 - Accept apply when subtotal is 0.01 EUR above the campaign minimum order value

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 20.01 EUR
- Delivery fee is 4.99 EUR (subtotal below the 50.00 EUR free-delivery threshold)
- Active fixed-amount-discount campaign code `FLAT5` (5.00 EUR off) requires a minimum order value of 20.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `FLAT5`
- Subtotal: 20.01 EUR (minimum plus 0.01 EUR)

**Steps**
1. Enter `FLAT5` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 5.00 EUR
- The order summary shows the applied code `FLAT5` and a discount of 5.00 EUR
- The order total is displayed as 20.00 EUR (20.01 - 5.00 + 4.99)

#### TC-EDGE-004 - Auto-remove code when a cart quantity change drops the subtotal 0.01 EUR below the campaign minimum

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 35.00 EUR with code `SAVE10` (10% off, minimum order value 30.00 EUR) already applied
- Applied discount is 3.50 EUR; order total is displayed as 36.49 EUR (35.00 - 3.50 + 4.99)

**Test data**
- Promo code: `SAVE10`
- Subtotal before change: 35.00 EUR
- Subtotal after change: 29.99 EUR (0.01 EUR below the 30.00 EUR minimum)

**Steps**
1. Decrease the quantity of a cart item so the subtotal becomes 29.99 EUR.
2. Observe the order summary.

**Expected result**
- The code `SAVE10` is automatically removed from the order summary
- An explanatory message is displayed stating the code was removed because the order no longer meets the campaign's minimum order value
- The order total returns to 34.98 EUR (29.99 + 4.99), the value without the discount

#### TC-EDGE-005 - Charge delivery fee when pre-discount subtotal is 0.10 EUR below the free-delivery threshold

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal (pre-discount) is 49.90 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Pre-discount subtotal: 49.90 EUR (0.10 EUR below the 50.00 EUR free-delivery threshold)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 4.99 EUR (10% of 49.90 EUR)
- The delivery fee of 4.99 EUR is still charged, because the pre-discount subtotal is below 50.00 EUR
- The order total is displayed as 49.90 EUR (49.90 - 4.99 + 4.99)

#### TC-EDGE-006 - Waive delivery fee when pre-discount subtotal equals the free-delivery threshold exactly

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal (pre-discount) is 50.00 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Pre-discount subtotal: 50.00 EUR (exact free-delivery threshold)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 5.00 EUR (10% of 50.00 EUR)
- The delivery fee is waived (0.00 EUR), because the free-delivery threshold is evaluated against the original 50.00 EUR subtotal, not the discounted 45.00 EUR subtotal
- The order total is displayed as 45.00 EUR (50.00 - 5.00 + 0.00)

#### TC-EDGE-007 - Waive delivery fee when pre-discount subtotal is 0.01 EUR above the free-delivery threshold

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal (pre-discount) is 50.01 EUR
- Active fixed-amount-discount campaign code `FLAT5` (5.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `FLAT5`
- Pre-discount subtotal: 50.01 EUR (0.01 EUR above the free-delivery threshold)

**Steps**
1. Enter `FLAT5` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 5.00 EUR
- The delivery fee is waived (0.00 EUR)
- The order total is displayed as 45.01 EUR (50.01 - 5.00 + 0.00)

#### TC-EDGE-008 - Floor order total at the delivery fee when the fixed discount equals the subtotal exactly

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 20.00 EUR
- Active fixed-amount-discount campaign code `MEGA20` (20.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA20`
- Subtotal: 20.00 EUR (equal to the fixed discount amount)

**Steps**
1. Enter `MEGA20` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount applied is 20.00 EUR, exactly consuming the subtotal
- The order total is floored at the delivery fee amount and displayed as 4.99 EUR (20.00 - 20.00 + 4.99)

#### TC-EDGE-009 - Apply full fixed discount when it is 0.01 EUR less than the subtotal

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 20.01 EUR
- Active fixed-amount-discount campaign code `MEGA20` (20.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA20`
- Subtotal: 20.01 EUR (0.01 EUR above the fixed discount amount)

**Steps**
1. Enter `MEGA20` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The full discount of 20.00 EUR is applied, uncapped
- The order total is displayed as 5.00 EUR (20.01 - 20.00 + 4.99)

#### TC-EDGE-010 - Cap fixed discount at the subtotal when the discount amount exceeds it, delivery fee still charged

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 15.00 EUR
- Active fixed-amount-discount campaign code `MEGA20` (20.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA20`
- Subtotal: 15.00 EUR (5.00 EUR less than the fixed discount amount)

**Steps**
1. Enter `MEGA20` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is capped at 15.00 EUR so the discounted subtotal does not go below 0.00 EUR
- The order total is floored at the delivery fee amount and displayed as 4.99 EUR (15.00 - 15.00 + 4.99)

#### TC-EDGE-011 - Cap fixed discount at the subtotal and floor order total at 0.00 EUR when delivery is also waived

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 55.00 EUR (at or above the 50.00 EUR free-delivery threshold)
- Active fixed-amount-discount campaign code `MEGA60` (60.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA60`
- Subtotal: 55.00 EUR (5.00 EUR less than the fixed discount amount)

**Steps**
1. Enter `MEGA60` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is capped at 55.00 EUR so the discounted subtotal does not go below 0.00 EUR
- Delivery is waived because the original subtotal (55.00 EUR) meets the free-delivery threshold
- The order total is floored at 0.00 EUR (55.00 - 55.00 + 0.00)

#### TC-EDGE-012 - Floor order total at the delivery fee with a 100% percentage discount, delivery fee still charged

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 25.00 EUR (below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `FULL100` (100% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `FULL100`
- Subtotal: 25.00 EUR
- Discount rate: 100% (maximum of the valid 0-100% percentage range)

**Steps**
1. Enter `FULL100` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount equals the full subtotal, 25.00 EUR
- The order total is floored at the delivery fee amount and displayed as 4.99 EUR (25.00 - 25.00 + 4.99)

#### TC-EDGE-013 - Floor order total at 0.00 EUR with a 100% percentage discount and delivery also waived

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 60.00 EUR (at or above the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `FULL100` (100% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `FULL100`
- Subtotal: 60.00 EUR
- Discount rate: 100%

**Steps**
1. Enter `FULL100` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount equals the full subtotal, 60.00 EUR
- Delivery is waived because the original subtotal meets the free-delivery threshold
- The order total is displayed as 0.00 EUR (60.00 - 60.00 + 0.00)

#### TC-EDGE-014 - Apply a 99% percentage discount, one step below the maximum

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR (below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `NEARFULL99` (99% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `NEARFULL99`
- Subtotal: 40.00 EUR
- Discount rate: 99% (maximum minus one step)

**Steps**
1. Enter `NEARFULL99` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 39.60 EUR (99% of 40.00 EUR)
- The order total is displayed as 5.39 EUR (40.00 - 39.60 + 4.99)

#### TC-EDGE-015 - Round a percentage discount down to 2 decimal places when the third decimal digit is below 5

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | https://en.wikipedia.org/wiki/ISO_4217 |

**Preconditions**
- Cart subtotal is 33.33 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 33.33 EUR
- Raw discount before rounding: 3.333 EUR (rounds down, third decimal digit is 3)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The displayed discount is rounded down to exactly 2 decimal places: 3.33 EUR
- The order total is displayed with exactly 2 decimal places: 34.99 EUR (33.33 - 3.33 + 4.99)

#### TC-EDGE-016 - Round a percentage discount up to 2 decimal places when the third decimal digit is 5 or above

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | https://en.wikipedia.org/wiki/ISO_4217 |

**Preconditions**
- Cart subtotal is 33.35 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 33.35 EUR
- Raw discount before rounding: 3.335 EUR (rounds up, third decimal digit is 5)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The displayed discount is rounded to exactly 2 decimal places: 3.34 EUR
- The order total is displayed with exactly 2 decimal places: 35.00 EUR (33.35 - 3.34 + 4.99)

#### TC-EDGE-017 - Accept a promo code entered in lowercase that matches a stored uppercase code

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Active percentage-discount campaign code is stored as `SAVE10` (10% off), no minimum order value
- No promo code is currently applied

**Test data**
- Entered code: `save10` (all lowercase)
- Subtotal: 40.00 EUR

**Steps**
1. Enter `save10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The code is matched case-insensitively and applied
- The order summary shows the applied code and a discount of 4.00 EUR
- The order total is displayed as 40.99 EUR (40.00 - 4.00 + 4.99)

#### TC-EDGE-018 - Accept a promo code entered with leading and trailing whitespace

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Entered code: `"  SAVE10  "` (two leading and two trailing spaces)
- Subtotal: 40.00 EUR

**Steps**
1. Enter `  SAVE10  ` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The whitespace is trimmed before validation and the code is applied
- The order summary shows the applied code `SAVE10` and a discount of 4.00 EUR
- The order total is displayed as 40.99 EUR (40.00 - 4.00 + 4.99)

#### TC-EDGE-019 - Accept a promo code entered with mixed case combined with leading whitespace

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Low |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Entered code: `" SaVe10"` (one leading space, mixed case)
- Subtotal: 40.00 EUR

**Steps**
1. Enter ` SaVe10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The whitespace is trimmed and the case-insensitive match succeeds; the code is applied
- The order summary shows the applied code `SAVE10` and a discount of 4.00 EUR
- The order total is displayed as 40.99 EUR (40.00 - 4.00 + 4.99)

#### TC-EDGE-020 - Re-apply the same already-applied code without exceeding the single-code limit of 1

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Percentage-discount code `SAVE10` (10% off, no minimum order value) is already applied, showing a 4.00 EUR discount and an order total of 40.99 EUR

**Test data**
- Already-applied code: `SAVE10`
- Re-entered code: `SAVE10` (same code, entered again)
- Subtotal: 40.00 EUR

**Steps**
1. With `SAVE10` already applied, enter `SAVE10` again in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The applied-code count stays at exactly 1: the order summary shows a single instance of `SAVE10`, not two
- The discount is not doubled or duplicated by the re-apply; it remains 4.00 EUR
- The order total remains 40.99 EUR (40.00 - 4.00 + 4.99), unchanged from before the re-apply action

### 5.4 Regression

#### TC-REG-001 - Order total for a cart without a promo code still equals subtotal plus delivery fee

| Field | Value |
|---|---|
| Type | Regression |
| Priority | Critical |
| Requirement refs | IA-1 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper is on the cart page with items in the cart
- No promo code has been entered or applied

**Test data**
- Cart items: 2x "Wireless Mouse" at 12.50 EUR = 25.00 EUR subtotal
- Delivery fee: 4.99 EUR (subtotal below 50.00 EUR threshold)

**Steps**
1. Open the cart page with the given items and no promo code applied.
2. Read the displayed subtotal, delivery fee, and order total.

**Expected result**
- Subtotal shows 25.00 EUR
- Delivery fee shows 4.99 EUR
- Order total shows 29.99 EUR (subtotal + delivery fee, rounded to 2 decimals)
- No promo code or discount line is shown in the order summary

#### TC-REG-002 - Free-delivery threshold still waives the delivery fee without a promo code

| Field | Value |
|---|---|
| Type | Regression |
| Priority | High |
| Requirement refs | IA-1 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper is on the cart page with items in the cart
- No promo code has been entered or applied

**Test data**
- Cart items: 1x "Office Chair" at 55.00 EUR = 55.00 EUR subtotal

**Steps**
1. Open the cart page with the given items and no promo code applied.
2. Read the displayed delivery fee and order total.

**Expected result**
- Delivery fee shows 0.00 EUR (waived, subtotal at or above 50.00 EUR)
- Order total shows 55.00 EUR
- No promo code or discount line is shown in the order summary

#### TC-REG-003 - Changing item quantity without a promo code still recalculates subtotal and order total immediately

| Field | Value |
|---|---|
| Type | Regression |
| Priority | Medium |
| Requirement refs | IA-2 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper is on the cart page with items in the cart
- No promo code has been entered or applied

**Test data**
- Cart item: "Desk Lamp" at 20.00 EUR, quantity changed from 1 to 3

**Steps**
1. Open the cart page with 1x "Desk Lamp" (subtotal 20.00 EUR, no code applied).
2. Change the quantity of "Desk Lamp" to 3.

**Expected result**
- Subtotal updates immediately to 60.00 EUR
- Delivery fee updates to 0.00 EUR (subtotal now at or above 50.00 EUR)
- Order total updates immediately to 60.00 EUR
- No promo code message is shown (none was applied)

#### TC-REG-004 - Checkout order summary still shows correct totals for an order without a promo code

| Field | Value |
|---|---|
| Type | Regression |
| Priority | High |
| Requirement refs | IA-3 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has items in the cart
- No promo code has been entered or applied

**Test data**
- Cart items: 1x "Backpack" at 39.00 EUR = 39.00 EUR subtotal
- Delivery fee: 4.99 EUR

**Steps**
1. On the cart page, confirm the order summary shows subtotal 39.00 EUR, delivery fee 4.99 EUR, order total 43.99 EUR, and no promo code field content.
2. Click "Continue to checkout".
3. Read the order summary on the checkout page.

**Expected result**
- Checkout order summary shows subtotal 39.00 EUR, delivery fee 4.99 EUR, and order total 43.99 EUR
- No promo code or discount line is shown on the checkout order summary

#### TC-REG-005 - Order confirmation email reflects the discounted order total for an order placed with a promo code

| Field | Value |
|---|---|
| Type | Regression |
| Priority | High |
| Requirement refs | IA-3, AC-7 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- Shopper has items in the cart with subtotal 80.00 EUR
- Promo code "SAVE10" (10% off, active, no minimum order value) is applied on the cart page

**Test data**
- Promo code: SAVE10 (10% percentage discount)
- Subtotal: 80.00 EUR, discount: 8.00 EUR, delivery fee: 0.00 EUR (free delivery, subtotal >= 50.00 EUR), order total: 72.00 EUR

**Steps**
1. Apply promo code "SAVE10" on the cart page and confirm the order total shows 72.00 EUR.
2. Click "Continue to checkout" and confirm checkout shows the same applied code and order total 72.00 EUR.
3. Complete payment for the order.
4. Open the order confirmation email sent for this order.

**Expected result**
- The order confirmation email shows the order total as 72.00 EUR
- The order confirmation email shows the applied promo code "SAVE10" and the discount amount of 8.00 EUR
- The email does not show the pre-discount total (80.00 EUR) as the order total

#### TC-REG-006 - Order history shows the correct discounted order total for a past order placed with a promo code

| Field | Value |
|---|---|
| Type | Regression |
| Priority | Medium |
| Requirement refs | IA-4, AC-2 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- A logged-in shopper has previously placed an order using promo code "SAVE10" (10% off) with subtotal 80.00 EUR, discount 8.00 EUR, and order total 72.00 EUR

**Test data**
- Order total for the historical order: 72.00 EUR

**Steps**
1. Log in as the shopper who placed the order.
2. Open the order history page.
3. Locate the order placed with promo code "SAVE10".

**Expected result**
- The order history entry shows the order total as 72.00 EUR (the discounted total actually charged)
- The order history entry does not show the pre-discount subtotal (80.00 EUR) as the order total

#### TC-REG-007 - Pre-existing saved cart without a promo code still restores correctly after login

| Field | Value |
|---|---|
| Type | Regression |
| Priority | High |
| Requirement refs | IA-5 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- A logged-in shopper has a cart saved before this feature was released, containing items but no promo code data (2x "Notebook" at 3.50 EUR)
- The shopper is currently logged out

**Test data**
- Saved cart: 2x "Notebook" at 3.50 EUR = 7.00 EUR subtotal

**Steps**
1. Log in as the shopper with the pre-existing saved cart.
2. Open the cart page.

**Expected result**
- The cart restores with 2x "Notebook" and subtotal 7.00 EUR
- Delivery fee shows 4.99 EUR and order total shows 11.99 EUR
- No promo code field shows any residual value and no error is displayed

#### TC-REG-008 - Applied promo code persists with the saved cart for a logged-in shopper across sessions and on the mobile app

| Field | Value |
|---|---|
| Type | Regression |
| Priority | High |
| Requirement refs | IA-5 |
| Technique | Regression check |
| Source | N/A - derived from requirements |

**Preconditions**
- A logged-in shopper has applied promo code "SAVE10" to a cart with subtotal 80.00 EUR (order total 72.00 EUR) on the web app
- The shopper then logs out

**Test data**
- Promo code: SAVE10, subtotal 80.00 EUR, order total 72.00 EUR

**Steps**
1. On the web app, apply promo code "SAVE10" to the cart and confirm order total 72.00 EUR, then log out.
2. Log back in on the web app and open the cart page.
3. Log in with the same account on the mobile app and open the cart page.

**Expected result**
- On web re-login, the cart restores with the same items, the applied code "SAVE10", the discount amount, and order total 72.00 EUR
- On the mobile app, the cart shows the same items, the applied code "SAVE10", the discount amount, and order total 72.00 EUR
- No cart items are lost or duplicated as a result of the code being persisted

## 6. Assumptions and risks

- Codes are managed in the admin panel, which is out of scope for this PBI's testable UI; test scope covers the shopper-facing apply/remove/checkout flow only, using codes assumed to already exist and be configured.
- The "Promo code" field and "Apply" button are placed within or adjacent to the existing order summary section on the cart page; the exact layout/position is not specified.
- Removing an applied code is done via a visible "Remove" control shown next to the applied code in the order summary; the exact control or label is not specified.
- AC-4's and AC-8's exact error-message wording, and AC-9's explanatory message wording, are not specified in the requirements; the affected test cases describe the observable outcome rather than exact copy.
- BR-1 (promo codes created/configured in a separate admin panel) is a scope-definition rule rather than a testable shopper-facing behavior; no dedicated test case is created for it.
- The rounding direction (round-half-up) used for currency rounding is an assumption, since the PBI states amounts are rounded to 2 decimal places but does not specify the rounding method.
- Test data throughout this suite (promo codes, campaign minimums, discount rates and amounts) is fictional and internally consistent, since actual campaign configuration lives in the admin panel; actual QA execution must substitute real campaign data.
- `security_sensitive` is `no` for this run; the included security checks (script-tag and SQL-injection-style payloads) are defense-in-depth checks on the free-text promo code input, not driven by a stated security requirement.

## 7. References

- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - used allowlisting, length-limit, and anchored-regex guidance to design the malformed/oversized and script-injection promo code input cases
- [Injection Prevention - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) - used guidance on treating free-text input as untrusted before it is matched against stored codes, for the SQL-injection-style payload case
- [Coupon, Discount, and Promo Testing | QA Decoded](https://www.qadecoded.com/topics/coupon-discount-promo-testing) - used concrete scenarios for duplicate/concurrent apply submission, re-evaluating the minimum-order threshold at checkout, and re-evaluating an applied code after a cart change
- [Boundary-value analysis](https://en.wikipedia.org/wiki/Boundary-value_analysis) - confirms the two-value BVA technique and the smallest-increment rule, applied to all boundary cases in this run
- [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) - confirms EUR has a minor unit of 2 decimal places; used for the currency-rounding cases

## 8. Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-24 | Initial draft |
| 2 | 2026-09-24 | Fixed suite gate findings: S2 |
