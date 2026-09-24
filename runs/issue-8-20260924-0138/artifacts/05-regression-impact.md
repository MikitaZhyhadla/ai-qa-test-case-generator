# Regression Impact Analysis

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | regression-impact-analyzer |
| Revision | 1 |
| Generated | 2026-09-24 02:30 |

## Scope

This artifact covers the impact of adding promo-code entry, application, display, removal, and persistence (issue #8) on the pre-existing ShopNest cart and checkout behavior documented in issue #10: subtotal/delivery-fee/order-total calculation, cart quantity recalculation, checkout summary, order confirmation email, order history, monthly sales report, and cart persistence for logged-in shoppers and the mobile app. It designs regression checks that confirm this existing behavior still works, both when no promo code is involved and when a promo code is involved and other features consume the resulting data. It does not re-test the new acceptance criteria (AC-1 through AC-9) themselves; those are covered by the functional, negative, and edge-case planners.

## Research sources

- [#10 Context: current ShopNest shopping cart and checkout behavior](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/10) - documents the pre-existing cart/checkout behavior this PBI builds on: item list with quantity selector (1-10), immediate subtotal recalculation on quantity/removal change, delivery fee of 4.99 EUR waived at 50.00 EUR subtotal, order summary with subtotal/delivery fee/order total rounded to 2 decimals, cart saved for logged-in shoppers and restored on next login and on the mobile app, "Continue to checkout" disabled on empty cart, checkout order summary, order confirmation email with totals after payment, and order history page and monthly sales report showing order total for every order. Used to identify the impacted areas below.

## Impacted areas

| ID | Area | Why it is impacted | Risk |
|---|---|---|---|
| IA-1 | Order total calculation for carts without a promo code (subtotal + delivery fee, 50.00 EUR free-delivery threshold, BR-3) | The PBI changes the order-total recalculation logic (BR-4, BR-5) to fold in a discount; the pre-existing no-discount formula must still produce the same results when no code is applied | High |
| IA-2 | Cart quantity/item-removal recalculation flow (immediate subtotal recalculation on change) | AC-9 hooks the same quantity/removal change flow to auto-remove a code when the minimum order value is no longer met; the plain recalculation without any code applied must remain unaffected | Medium |
| IA-3 | Checkout order summary and order confirmation email (existing consumers of the order total) | Checkout must still show correct totals for orders without a code (unaffected) and correctly carry the discounted total through to the confirmation email for orders with a code (AC-7 dependency) | High |
| IA-4 | Order history page and monthly sales report (existing consumers of order total) | Both features display the order total of every order; they must correctly reflect a discounted total for orders placed with a promo code, without breaking for orders without one | Medium |
| IA-5 | Cart persistence for logged-in shoppers across sessions and the mobile app | BR-9 extends the existing cart-save/restore mechanism to also persist an applied promo code; pre-existing saved carts (created before this feature, with no code) must still restore correctly, and the new code data must not corrupt or block restoring existing item data | High |

## Test cases

### TC-REG-001 - Order total for a cart without a promo code still equals subtotal plus delivery fee

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

### TC-REG-002 - Free-delivery threshold still waives the delivery fee without a promo code

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

### TC-REG-003 - Changing item quantity without a promo code still recalculates subtotal and order total immediately

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

### TC-REG-004 - Checkout order summary still shows correct totals for an order without a promo code

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

### TC-REG-005 - Order confirmation email reflects the discounted order total for an order placed with a promo code

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

### TC-REG-006 - Order history shows the correct discounted order total for a past order placed with a promo code

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

### TC-REG-007 - Pre-existing saved cart without a promo code still restores correctly after login

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

### TC-REG-008 - Applied promo code persists with the saved cart for a logged-in shopper across sessions and on the mobile app

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

## Notes and assumptions

- None
