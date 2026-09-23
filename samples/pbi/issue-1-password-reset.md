# PBI: Reset a forgotten password via an email link

## Context

Product: Notely, a fictional note-taking web app. Users who forget their password currently have to contact support, which takes up to two working days.

## User story

As a registered Notely user who forgot my password, I want to request a reset link by email, so that I can set a new password without contacting support.

## Acceptance criteria

1. The login page shows a "Forgot password?" link that opens the "Reset password" page.
2. On the "Reset password" page the user enters an email address and clicks "Send reset link".
3. For any syntactically valid email address, the page shows the same message: "If an account exists for this email, we sent a reset link." The page must not reveal whether an account exists.
4. If the email address belongs to an active account, the system sends an email with a single-use reset link within 1 minute.
5. The reset link expires 60 minutes after it was sent. Opening an expired or already used link shows "This link has expired. Please request a new one." and a "Request a new link" button.
6. The new password must be 8-64 characters long and contain at least one letter and one digit. The "New password" and "Confirm password" fields must match.
7. After a successful reset, the user sees "Your password has been changed", is redirected to the login page, and all existing sessions of the user are signed out.
8. A user can request at most 5 reset links per hour for the same email address. The 6th request within one hour shows "Too many requests. Try again later."

## Business rules

- Requesting a new reset link invalidates all previously sent links for that account.
- Deactivated accounts never receive a reset email, but the page shows the same message as in criterion 3.

## Out of scope

- Password reset via SMS
- Changing the account email address
