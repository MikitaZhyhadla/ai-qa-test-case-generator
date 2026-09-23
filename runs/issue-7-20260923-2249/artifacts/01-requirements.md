# Requirements

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | requirements-formalizer |
| Revision | 3 |
| Generated | 2026-09-23 22:49 |
| Source issue | [#7 PBI: Reset a forgotten password via an email link](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/7) |
| Status | Confirmed by user on 2026-09-23 22:59 |

## Summary

Notely, a fictional note-taking web app, gets a self-service password reset flow for registered users who forgot their password. From the login page the user opens a "Reset password" page, submits an email address, and, if the address belongs to an active account, receives a single-use reset link valid for 60 minutes. Through the link the user sets a new password that must satisfy length, composition, and no-reuse rules; afterwards all existing sessions are signed out. The flow must not reveal whether an account exists and limits reset requests to 5 per rolling 60 minutes per email address. The business goal is to replace the support-handled reset process, which takes up to two working days.

## User story

As a registered Notely user who forgot my password, I want to request a reset link by email, so that I can set a new password without contacting support.

## Acceptance criteria

| ID | Acceptance criterion | Negative testing |
|---|---|---|
| AC-1 | The login page displays a link with the text "Forgot password?". | Not applicable - static UI element without input or failure path |
| AC-2 | Clicking the "Forgot password?" link opens the "Reset password" page. | Not applicable - plain navigation without input or failure path |
| AC-3 | The "Reset password" page contains an email address input field and a "Send reset link" button; entering an email address and clicking the button submits the reset request. | Applicable |
| AC-4 | After submitting a syntactically valid email address, the page shows the message "If an account exists for this email, we sent a reset link." regardless of whether the address belongs to an active account, a deactivated account, or no account. | Applicable |
| AC-5 | The page shown after submitting a syntactically valid email address is identical (message, fields, buttons) for an active account, a deactivated account, and an unregistered address, so it does not reveal whether an account exists. | Applicable |
| AC-6 | Up to 5 reset requests for the same syntactically valid email address within a rolling 60-minute window are accepted and each shows the message from AC-4; the limit applies whether the address belongs to an active account, a deactivated account, or no account. | Applicable |
| AC-7 | A 6th reset request for the same email address within a rolling 60-minute window shows the message "Too many requests. Try again later." | Applicable |
| AC-8 | When a submitted email address belongs to an active account, the system sends an email containing a reset link to that address within 1 minute of the submission. | Applicable |
| AC-9 | When a submitted email address belongs to a deactivated account or to no account, no reset email is sent. | Applicable |
| AC-10 | Requesting a new reset link for an account invalidates all previously sent reset links for that account; opening an older link shows "This link has expired. Please request a new one." and a "Request a new link" button. | Applicable |
| AC-11 | Opening a valid reset link (not used, not superseded, less than 60 minutes after it was sent) opens a page with "New password" and "Confirm password" fields. | Applicable |
| AC-12 | Opening a reset link 60 minutes or more after it was sent shows "This link has expired. Please request a new one." and a "Request a new link" button. | Applicable |
| AC-13 | Opening a reset link that was already used for a successful password reset shows "This link has expired. Please request a new one." and a "Request a new link" button. | Applicable |
| AC-14 | A new password of 8 to 64 characters (inclusive) is accepted; a new password shorter than 8 or longer than 64 characters is rejected with the message "Password must be 8-64 characters long." and the password is not changed. | Applicable |
| AC-15 | A new password that contains at least one Latin letter (A-Z or a-z) and at least one digit is accepted; a new password without a Latin letter or without a digit is rejected with the message "Password must contain at least one letter and one digit." and the password is not changed. | Applicable |
| AC-16 | The password is changed only when the "New password" and "Confirm password" values match; if they differ, the reset is rejected with the message "Passwords do not match." and the password is not changed. | Applicable |
| AC-17 | After a successful reset, the message "Your password has been changed" is shown on the login page. | Not applicable - failure paths of the reset form are covered by AC-14, AC-15, AC-16, AC-24, and AC-25 |
| AC-18 | After a successful reset, the user is automatically redirected to the login page. | Not applicable - failure paths of the reset form are covered by AC-14, AC-15, AC-16, AC-24, and AC-25 |
| AC-19 | After a successful reset, all sessions of the user that existed before the reset are signed out; any further action in such a session requires a new login. | Applicable |
| AC-20 | After a successful reset, the user can log in with the new password, and a login attempt with the previous password is rejected. | Applicable |
| AC-21 | Submitting an empty or syntactically invalid email address shows the inline error "Enter a valid email address."; no reset request is sent, no email is sent, and the submission does not count toward the rate limit of AC-6 and AC-7. | Applicable |
| AC-22 | Leading and trailing spaces of the submitted email address are removed and letter case is ignored, so `  Anna.Test@Example.com ` is treated as the same address as `anna.test@example.com` for account matching and for the rate limit. | Applicable |
| AC-23 | The email address field accepts at most 254 characters: an address of up to 254 characters can be entered and submitted, typing stops at 254 characters, and pasted text is truncated to the first 254 characters. | Applicable |
| AC-24 | A new password that contains a space is rejected with the message "Password must not contain spaces." and the password is not changed; other special characters are allowed. | Applicable |
| AC-25 | A new password that satisfies all other password rules (AC-14, AC-15, AC-16, AC-24) but is the same as the current password is rejected with the message "New password must be different from your current password." and the password is not changed; this check is not performed while any other password rule is violated. | Applicable |
| AC-26 | A rate-limited (blocked) reset request sends no email and does not invalidate previously sent reset links; those links remain valid. | Applicable |
| AC-27 | Once fewer than 5 accepted requests for an email address fall within the last 60 minutes, a new reset request for that address is accepted again and shows the message from AC-4. | Applicable |
| AC-28 | Clicking the "Request a new link" button on the expired-link page opens the "Reset password" page. | Not applicable - plain navigation without input or failure path |
| AC-29 | When the UI limit is bypassed and a reset request with an email address longer than 254 characters reaches the server, the server rejects it and the message "Enter a valid email address." is shown; no email is sent. | Applicable |
| AC-30 | When a new password violates several of the rules in AC-14, AC-15, AC-16, and AC-24 at once, all matching error messages are shown at the same time and the password is not changed. | Applicable |

## Business rules

| ID | Rule |
|---|---|
| BR-1 | Requesting a new reset link invalidates all previously sent reset links for that account. |
| BR-2 | Deactivated accounts never receive a reset email, but the page shows the same message as for any syntactically valid email address (AC-4). |
| BR-3 | A reset link is single-use and expires 60 minutes after it was sent. |
| BR-4 | At most 5 reset requests are accepted per email address within a rolling 60-minute window; the limit applies to every syntactically valid address, whether or not an account exists. |
| BR-5 | Password policy for the new password: 8-64 characters; at least one Latin letter (A-Z or a-z) and at least one digit; no spaces; other special characters are allowed; "New password" and "Confirm password" must match. |
| BR-6 | The new password must be different from the current password. |
| BR-7 | Email addresses are normalized before matching and rate limiting: leading and trailing spaces are removed and letter case is ignored. |
| BR-8 | Empty or syntactically invalid email addresses are not submitted as reset requests and do not count toward the rate limit. |
| BR-9 | A rate-limited request sends no email and does not invalidate existing reset links. |
| BR-10 | An email address is at most 254 characters long: the UI field limits input to 254 characters (pasted text is truncated), and the server rejects longer addresses with "Enter a valid email address.". |
| BR-11 | New password validation reports all violated rules (length, letter and digit, no spaces, confirmation match) at the same time; the "different from current password" check runs only when all other rules pass. |

## Constraints and non-functional requirements

- Account enumeration protection: the reset request response must not reveal whether an account exists for the submitted email address (AC-4, AC-5).
- Delivery time: the reset email for an active account is sent within 1 minute of the request (AC-8).
- Email address length: at most 254 characters, enforced in the UI field (AC-23) and on the server (AC-29).
- Out of scope: password reset via SMS.
- Out of scope: changing the account email address.

## Assumptions

| ID | Assumption |
|---|---|
| A-1 | The reset flow is available only to users who are not logged in (they start from the login page). |
| A-2 | The 60-minute validity of a link is measured from the moment the reset email was sent, as stated in the PBI. |
| A-3 | The derived criterion AC-20 (new password works, previous password is rejected) follows directly from the user story "set a new password". |
| A-4 | All test data (email addresses, passwords, account names) is fictional, for example `anna.test@example.com`. |
| A-5 | Non-Latin letters (for example Cyrillic or accented letters) do not satisfy the letter rule of AC-15 and are treated as other allowed characters. Accepted by the user on 2026-09-23. |
| A-6 | Only accepted requests count toward the rolling 60-minute limit; blocked requests (AC-7) do not extend the window. Accepted by the user on 2026-09-23. |
| A-7 | An email address longer than 254 characters that is rejected by the server (AC-29) is treated like any other invalid address (AC-21): it does not count toward the rate limit of AC-6 and AC-7. |

## Open questions

| ID | Question | Why it matters | Proposed default |
|---|---|---|---|
| - | - | - | - |

## Clarifications

| ID | Question | Answer | Date |
|---|---|---|---|
| Q-1 | What happens when the user submits an empty or syntactically invalid email address, and is the email address trimmed and matched case-insensitively? | Proposed default accepted: inline error "Enter a valid email address."; no request is sent and it does not count toward the rate limit; leading/trailing spaces are removed and case is ignored. Additionally, the email field accepts at most 254 characters. | 2026-09-23 |
| Q-2 | How is the "5 per hour" limit measured, and does it apply to unregistered and deactivated addresses too? | Proposed default accepted: rolling 60 minutes per email address, applied to any syntactically valid email address whether or not an account exists. | 2026-09-23 |
| Q-3 | Does a blocked (6th or later) request send an email or invalidate previously sent links? | Proposed default accepted: a blocked request sends no email and previously sent links stay valid. | 2026-09-23 |
| Q-4 | Which error messages are shown for password rule violations, which characters count as a "letter", and are spaces allowed? | Default messages accepted ("Password must be 8-64 characters long.", "Password must contain at least one letter and one digit.", "Passwords do not match."). A letter is a Latin letter A-Z or a-z only. Spaces are not allowed and show "Password must not contain spaces."; other special characters are allowed. | 2026-09-23 |
| Q-5 | May the new password be the same as the current password? | No. It must be different; otherwise "New password must be different from your current password." is shown and the password is not changed. | 2026-09-23 |
| Q-6 | Where does the "Request a new link" button lead, and where is "Your password has been changed" shown? | Proposed default accepted: the button opens the "Reset password" page; the message is shown on the login page after an automatic redirect. | 2026-09-23 |
| Q-7 | Which final output formats are wanted, and should a summary comment be posted to issue #7? | output_formats=markdown+html; post_issue_comment=yes. | 2026-09-23 |
| Q-8 | What happens when the user tries to enter more than 254 characters in the email address field? | Proposed default accepted: typing stops at 254 characters and pasted text is truncated to the first 254 characters. Additionally, the server rejects an email address longer than 254 characters with "Enter a valid email address." if the UI limit is bypassed. | 2026-09-23 |
| Q-9 | When a new password violates several rules at once, which message or messages are shown? | Proposed default accepted: all matching password error messages are shown at the same time; the "different from current password" check (AC-25) runs only when all other rules pass. | 2026-09-23 |

## Execution profile

| Key | Value | Rationale |
|---|---|---|
| change_type | new-feature | Self-service password reset does not exist today (resets are handled by support); the PBI introduces a new flow |
| has_boundaries | yes | 60-minute link expiry, 1-minute delivery time, 8-64 character password length, 5 requests per rolling 60 minutes, 254-character email field limit |
| security_sensitive | yes | Authentication flow: password reset, account enumeration protection, session invalidation, rate limiting, password policy |
| output_formats | markdown+html | Confirmed by the user in clarification Q-7 |
| post_issue_comment | yes | Confirmed by the user in clarification Q-7 |

## Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-23 | Initial formalization from issue #7 |
| 2 | 2026-09-23 | Applied answers to Q-1 to Q-7: updated AC-6, AC-7, AC-14, AC-15, AC-16, AC-17, AC-18, BR-4, BR-5; added AC-21 to AC-28, BR-6 to BR-9, A-5, A-6; confirmed output_formats and post_issue_comment; added open questions Q-8 and Q-9 raised by the new 254-character limit and the new password messages |
| 3 | 2026-09-23 | Applied answers to Q-8 and Q-9: updated AC-23 and AC-25; added AC-29 (server-side 254-character check), AC-30 (combined password errors), BR-10, BR-11, A-7; marked A-5 and A-6 as accepted by the user; updated the email length constraint; no open questions remain |
| 3 | 2026-09-23 | Confirmed by user on 2026-09-23 22:59 (CONFIRM without corrections); the confirmation covers revision 3 in full, including assumption A-7, which the user reviewed and accepted |
