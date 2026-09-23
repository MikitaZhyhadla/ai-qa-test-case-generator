# Context: current ShopNest shopping cart and checkout behavior

## Purpose

This issue documents the behavior of the existing, already released ShopNest cart and checkout. It is context for future changes, not a new requirement.

## Current behavior

1. The cart page lists every item with name, unit price, quantity selector (1-10), and line total.
2. Changing a quantity or removing an item recalculates the subtotal immediately.
3. The delivery fee is 4.99 EUR; delivery is free when the subtotal is 50.00 EUR or more.
4. The order summary shows subtotal, delivery fee, and order total, rounded to 2 decimal places.
5. The cart is saved for logged-in shoppers and restored after the next login, also on the mobile app.
6. The "Continue to checkout" button is disabled when the cart is empty.
7. Checkout shows the same order summary and sends an order confirmation email with the totals after payment.
8. The order history page and the monthly sales report show the order total of every order.
