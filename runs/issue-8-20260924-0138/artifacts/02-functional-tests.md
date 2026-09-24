# Functional Test Cases

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | functional-test-planner |
| Revision | 1 |
| Generated | 2026-09-24 01:45 |

## Scope

This artifact covers positive functional behavior for the promo-code feature described in `01-requirements.md`: display of the promo-code field, successfully applying percentage and fixed-amount discount codes, replacing an applied code, removing an applied code, carrying the applied code through checkout, session persistence for logged-in shoppers, the distinct minimum-order-value message, and automatic removal after a cart change. It deliberately does not cover invalid/malicious input handling beyond one representative invalid-code case, boundary values (exact minimums, exact capping/flooring points), or regression risk to unrelated areas; those are covered by `negative-test-planner`, `edge-case-planner`, and `regression-impact-analyzer` respectively.

## Research sources

- None - derived from requirements

## Test cases

### TC-FUN-001 - Display the Promo code field and Apply button in the cart order summary

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

---

### TC-FUN-002 - Apply a valid percentage-discount promo code and recalculate the order total

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

---

### TC-FUN-003 - Apply a valid fixed-amount-discount promo code and recalculate the order total

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

---

### TC-FUN-004 - Applying a new promo code replaces the previously applied code

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

---

### TC-FUN-005 - Apply a fixed-amount discount when the subtotal qualifies for free delivery

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

---

### TC-FUN-006 - Enter an unrecognized promo code and receive an invalid-code error

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

---

### TC-FUN-007 - Enter a valid campaign code that does not meet the minimum order value

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

---

### TC-FUN-008 - Remove an applied promo code from the cart

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

---

### TC-FUN-009 - Applied promo code and discount carry over from cart to checkout

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

---

### TC-FUN-010 - Applied promo code persists with the saved cart across a session for a logged-in shopper

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

---

### TC-FUN-011 - Promo code is automatically removed when a cart change drops the order below the campaign minimum

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

## Notes and assumptions

- AC-4's exact error-message wording is not specified in the requirements; TC-FUN-006 describes the observable outcome (an error indicating the code is invalid, total unchanged) rather than exact copy.
- AC-8's exact error-message wording is not specified beyond "states the required minimum order value"; TC-FUN-007 assumes representative wording that names the 50.00 EUR minimum.
- AC-9's explanatory message wording is not specified; TC-FUN-011 assumes representative wording explaining the automatic removal.
- BR-1 is a scope-definition rule (promo codes are created and configured in a separate admin panel) rather than a testable shopper-facing behavior; no dedicated test case is created for it, consistent with assumption A-1 in the requirements.
- BR-3 is established pre-existing behavior from issue #10 (delivery fee of 4.99 EUR, waived at 50.00 EUR subtotal); it is exercised indirectly within this artifact's order-total calculations but is not independently retested here.
- BR-5's discount-capping boundary (a fixed discount equal to or exceeding the subtotal) is a boundary condition; per this planner's design rules it is left to `edge-case-planner`, and TC-FUN-003/TC-FUN-005 use clearly valid, non-boundary values instead.
- AC-5 (display of the applied code and discount) has no dedicated case; it is verified as part of the expected results of TC-FUN-002, TC-FUN-003, TC-FUN-004, and TC-FUN-005, consistent with the requirements' own note that AC-5 is covered by AC-2 and AC-3.
