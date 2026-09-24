# PBI: Show the order number in the order confirmation email

## Context

Product: ShopNest, a fictional online store. The order confirmation email is already sent after payment (see the issue "Context: current ShopNest shopping cart and checkout behavior"). Customers contact support because the email does not contain the order number.

## User story

As a shopper, I want to see my order number in the order confirmation email, so that I can refer to my order when I contact support.

## Acceptance criteria

1. The subject of the order confirmation email is "Your ShopNest order <order number>".
2. The first line of the email body shows "Order number: <order number>".
3. The order number in the email is the same as the one shown on the order confirmation page and in the order history.
4. All other content of the email stays unchanged.

## Out of scope

- Changing the format of order numbers
