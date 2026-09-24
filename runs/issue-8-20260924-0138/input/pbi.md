# PBI Source

| Field | Value |
|---|---|
| Issue | #8 |
| URL | https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/8 |
| Title | PBI: Apply a promo code in the shopping cart |
| Labels | enhancement |
| State | open |
| Fetched at | 2026-09-24 01:38 |

## Body

## Context

Product: ShopNest, a fictional online store. The cart page already shows the items, quantities, subtotal, delivery fee, and order total (see the issue "Context: current ShopNest shopping cart and checkout behavior"). Marketing wants to run promo campaigns.

## User story

As a shopper, I want to enter a promo code in my cart, so that I get a discount on my order.

## Acceptance criteria

1. The cart page has a "Promo code" field and an "Apply" button.
2. A valid code reduces the order total by the discount of its campaign (a percentage or a fixed amount).
3. An invalid code shows an error message.
4. The applied code and the discount are shown in the order summary, and the shopper can remove the code.
5. The discount is kept when the shopper continues to checkout.

## Notes

- Codes are created by marketing in the admin panel.
- Some campaigns have a minimum order value.

## Comments

- None
