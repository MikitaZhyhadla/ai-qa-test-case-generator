# Requirements

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | requirements-formalizer |
| Revision | 4 |
| Generated | 2026-09-24 02:15 |
| Source issue | [#8 PBI: Apply a promo code in the shopping cart](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/8) |
| Status | Confirmed by user on 2026-09-24 01:50 |

## Summary

ShopNest shoppers currently see items, quantities, subtotal, delivery fee, and order total on the cart page (established behavior, see issue #10). This PBI adds a "Promo code" field and an "Apply" button so a shopper can enter a marketing-created code and get a discount (percentage or fixed amount) on the order, with some campaigns requiring a minimum order value. The applied code and discount must show in the order summary, be removable by the shopper, and must persist through checkout. The business goal is to support marketing promo campaigns that increase conversion by discounting the order total.

## User story

As a shopper, I want to enter a promo code in my cart, so that I get a discount on my order.

## Acceptance criteria

| ID | Acceptance criterion | Negative testing |
|---|---|---|
| AC-1 | The cart page shows a "Promo code" text field and an "Apply" button in the order summary area, alongside the existing subtotal, delivery fee, and order total. | Not applicable - display-only requirement, no invalid input path |
| AC-2 | When the shopper enters a code linked to an active percentage-discount campaign and the order subtotal meets the campaign's minimum order value (if any), then clicks "Apply", the discount is calculated as the campaign's percentage of the subtotal, the order total is recalculated as (subtotal - discount) + delivery fee (the free-delivery threshold is evaluated against the original, pre-discount subtotal), and the reduced order total is displayed. | Applicable |
| AC-3 | When the shopper enters a code linked to an active fixed-amount-discount campaign and the order subtotal meets the campaign's minimum order value (if any), then clicks "Apply", the discount is the campaign's fixed amount capped so it never exceeds the subtotal, the order total is recalculated as (subtotal - discount) + delivery fee and floored at the delivery fee amount (or at 0.00 EUR if delivery is also waived), with the free-delivery threshold evaluated against the original, pre-discount subtotal, and the reduced order total is displayed. | Applicable |
| AC-4 | When the shopper enters a code that is not valid (not recognized, expired, or otherwise not usable) and clicks "Apply", an error message is displayed and the order total does not change. | Applicable |
| AC-5 | After a code is successfully applied, the order summary shows the applied code and the resulting discount amount. | Not applicable - display state following the successful-apply flow already covered by AC-2 and AC-3 |
| AC-6 | The shopper can remove an applied promo code from the cart; after removal, the order summary no longer shows the code or its discount, and the order total returns to the value it had without the discount. | Applicable |
| AC-7 | When the shopper continues from the cart to checkout after applying a valid code, checkout shows the same applied code and discount, and the order total reflects the discount. | Applicable |
| AC-8 | When the shopper enters a code linked to an active campaign but the order subtotal does not meet the campaign's minimum order value, and clicks "Apply", a distinct error message is displayed stating the required minimum order value, and the order total does not change. | Applicable |
| AC-9 | If the shopper changes cart contents (changes a quantity or removes an item) after a code was applied, and the order subtotal no longer meets the campaign's minimum order value, the code is automatically removed, an explanatory message is displayed, and the order total returns to the value it had without the discount. | Applicable |

## Business rules

| ID | Rule |
|---|---|
| BR-1 | Promo codes are created and configured by marketing in a separate admin panel; this PBI's scope is limited to the shopper-facing cart/checkout experience of applying, displaying, and removing a code. |
| BR-2 | A campaign may define a minimum order value; a promo code is not applicable to an order that does not meet it (see AC-8). |
| BR-3 | The existing order total is computed as subtotal + delivery fee (4.99 EUR, waived when subtotal is 50.00 EUR or more), rounded to 2 decimal places (established behavior, see issue #10). |
| BR-4 | The promo-code discount is calculated against the subtotal, not the full order total; the order total is recalculated as (subtotal - discount) + delivery fee, and the free-delivery threshold (BR-3) is evaluated against the original, pre-discount subtotal. |
| BR-5 | A discount is capped so it never reduces the subtotal below 0.00 EUR; the resulting order total is floored at the delivery fee amount, or at 0.00 EUR if delivery is also waived. |
| BR-6 | Only one promo code can be applied to an order at a time; applying a new code while one is already applied replaces the previously applied code. |
| BR-7 | Promo code matching is case-insensitive, and leading/trailing whitespace in the entered code is trimmed before validation. |
| BR-8 | If a change to cart contents causes an applied code's order to no longer meet its campaign's minimum order value, the code is automatically removed and the shopper is shown an explanatory message. |
| BR-9 | An applied promo code persists with the saved cart for logged-in shoppers, the same way cart items do (see issue #10); for guest shoppers, an applied code is not persisted beyond the current session. |

## Constraints and non-functional requirements

- Order and discount amounts are in EUR and rounded to 2 decimal places, consistent with existing cart behavior (issue #10).
- No performance, accessibility, localization, or security non-functional requirements are stated in the PBI.

## Assumptions

| ID | Assumption |
|---|---|
| A-1 | Codes are managed in the admin panel, which is out of scope for this PBI's testable UI; test scope covers the shopper-facing apply/remove/checkout flow only, using codes assumed to already exist and be configured. |
| A-2 | The "Promo code" field and "Apply" button are placed within or adjacent to the existing order summary section on the cart page; the exact layout/position is not specified. |
| A-3 | Removing an applied code is done via a visible "Remove" control shown next to the applied code in the order summary; the exact control or label is not specified. |

## Notes and assumptions

- AC-6's negative testing scope covers the case where no code is currently applied (for example, the "Remove" control is not shown or removal is a no-op).
- AC-7's negative testing scope covers a code that no longer meets the campaign's minimum order value by the time checkout loads; see AC-9 for the automatic-removal behavior that applies in this case.

## Open questions

| ID | Question | Why it matters | Proposed default |
|---|---|---|---|

## Clarifications

| ID | Question | Answer | Date |
|---|---|---|---|
| Q-1 | Does the discount apply to the subtotal (before the delivery fee) or to the full order total (subtotal + delivery fee)? | Discount applies to the subtotal; order total = (subtotal - discount) + delivery fee, with the free-delivery threshold evaluated against the original subtotal. | 2026-09-24 |
| Q-2 | When a discount would reduce the order total below zero, is the total floored at 0.00 EUR, or is the discount capped so it never exceeds the subtotal? | Discount is capped at the subtotal; order total is floored at the delivery fee, or 0.00 EUR if delivery is also waived. | 2026-09-24 |
| Q-3 | Is "order does not meet the campaign's minimum order value" treated as the same "invalid code" error as AC-4, or does it show a distinct message (for example, stating the required minimum)? | A distinct message is shown, stating the required minimum order value. | 2026-09-24 |
| Q-4 | Can only one promo code be applied at a time (applying a new code replaces the previous one), or can multiple codes be combined? | Only one code can be applied at a time; a new code replaces the previous one. | 2026-09-24 |
| Q-5 | Is code entry case-sensitive, and are leading/trailing spaces trimmed before validation? | Matching is case-insensitive; whitespace is trimmed. | 2026-09-24 |
| Q-6 | If the shopper changes cart contents (quantity or removal) after applying a code so the order no longer meets the campaign's minimum order value, is the code automatically removed (with a message), or does it stay applied? | The code is automatically removed, with an explanatory message. | 2026-09-24 |
| Q-7 | Does the applied promo code persist with the cart that is saved for logged-in shoppers across sessions and the mobile app (per existing cart-save behavior in issue #10), and can guest shoppers (not logged in) also apply a code? | The code persists for logged-in shoppers like cart items; guest shoppers can apply a code, but it is not persisted beyond the session. | 2026-09-24 |

## Execution profile

| Key | Value | Rationale |
|---|---|---|
| change_type | existing-feature-change | The PBI adds promo-code entry to the already-released cart page and modifies the existing order total calculation, order summary display, and checkout summary (see issue #10) |
| has_boundaries | yes | Campaign minimum order values, percentage vs. fixed discount amounts, the 50.00 EUR free-delivery threshold, discount capping/flooring rules (BR-5), and rounding to 2 decimal places all introduce numeric boundaries |
| security_sensitive | no | The PBI does not involve authentication, personal data, payment method processing, or permission changes; it is a discount-calculation and display feature on top of the existing cart/checkout |
| output_formats | markdown+html | Selected by the user |
| post_issue_comment | yes | Selected by the user |

## Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-24 | Initial formalization from issue #8 |
| 2 | 2026-09-24 | Applied answers for Q-1 through Q-7 (discount calculation basis, capping/flooring, distinct minimum-order-value message, single-code policy, case-insensitive matching, auto-removal on cart change, persistence for logged-in vs. guest shoppers); moved Q-1..Q-7 to Clarifications; updated AC-2, AC-3, AC-7 and added AC-8, AC-9; added BR-4 through BR-9; confirmed output_formats and post_issue_comment as user-selected |
| 3 | 2026-09-24 | Confirmed by user on 2026-09-24 01:50; no content changes |
| 4 | 2026-09-24 | Format-only fix per validator gate R1 (07-validation-requirements-attempt-1.md): changed AC-6 and AC-7 Negative testing values to exactly "Applicable"; moved their explanatory notes to a new Notes and assumptions section; acceptance criteria text unchanged, so the 2026-09-24 01:50 user confirmation remains valid |
