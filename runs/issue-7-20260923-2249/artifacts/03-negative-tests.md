# Negative and Security Test Cases

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | negative-test-planner |
| Revision | 2 |
| Generated | 2026-09-23 23:40 |

## Scope
This artifact covers negative, validation, and security-oriented behavior of the Notely self-service password reset flow: invalid and malicious email input, account enumeration, rate limiting and its bypass attempts, reset token misuse (superseded, expired, used, tampered, cross-account), password policy violations, session invalidation, and failure of the email dependency. It deliberately does not cover positive happy-path flows (owned by `functional-test-planner`) or exact boundary values such as 7/8/64/65-character passwords, 254/255-character email addresses, the exact 5th/6th request, or the exact 60-minute link expiry (owned by `edge-case-planner`). AC-1, AC-2, AC-17, AC-18, and AC-28 are marked `Negative testing: Not applicable` in the requirements and are not covered here.

## Research sources
- [Forgot Password - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) - consistent message and uniform response time for existent and non-existent accounts; rate limiting per account; tokens random, sufficiently long, single-use, and expiring; do not build reset URLs from the Host header; reset URLs must use HTTPS; require a normal login after reset and invalidate existing sessions.
- [Session Management - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) - invalidate previous sessions server-side after a password change and require re-authentication.
- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - email syntax (two parts separated by one `@`, allowed domain characters), total length below 254 characters, avoid dangerous characters such as quotes, and client-side validation can be bypassed with a proxy, so server-side checks are mandatory.
- [WSTG v4.2 - Testing for Weak Password Change or Reset Functionalities](https://owasp.github.io/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities) - reset tokens must be randomly generated with a secure algorithm that cannot be derived, and the reset is completed only after the user visits the emailed link.

## Test cases

### TC-NEG-001 - Reject reset request with an empty email field

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-3, AC-21 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- The user is not logged in
- The "Reset password" page is open

**Test data**
- Email: empty value

**Steps**
1. Leave the email address field empty.
2. Click "Send reset link".

**Expected result**
- The inline error "Enter a valid email address." is displayed next to the email field.
- The message "If an account exists for this email, we sent a reset link." is not displayed.
- No reset request is sent to the server (no request is visible in the browser network log) and no email is sent.

### TC-NEG-002 - Show identical response for an unregistered email address

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-4, AC-5 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- No account exists with email `ghost.user@example.com`
- Neither address has reset requests in the last 60 minutes

**Test data**
- Registered email: `anna.test@example.com`
- Unregistered email: `ghost.user@example.com`

**Steps**
1. Open the "Reset password" page, enter `anna.test@example.com`, and click "Send reset link".
2. Save the displayed page (screenshot and response body from the browser network log).
3. Open the "Reset password" page again, enter `ghost.user@example.com`, and click "Send reset link".
4. Save the displayed page (screenshot and response body).
5. Compare both saved pages and responses.

**Expected result**
- Both pages show exactly "If an account exists for this email, we sent a reset link."
- Both pages contain the same fields and buttons, and the HTTP status codes of both responses are identical.
- Neither page nor response contains text, fields, or data that indicate whether the account exists.

### TC-NEG-003 - Show identical response and send no email for a deactivated account

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-4, AC-5, AC-9 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- A deactivated account exists with email `ben.inactive@example.com`
- An active account exists with email `anna.test@example.com`
- Neither address has reset requests in the last 60 minutes
- Access to the test mailbox of `ben.inactive@example.com` is available

**Test data**
- Deactivated email: `ben.inactive@example.com`
- Active email: `anna.test@example.com`

**Steps**
1. Submit a reset request for `anna.test@example.com` and save the displayed page and response.
2. Submit a reset request for `ben.inactive@example.com` and save the displayed page and response.
3. Compare both pages and responses.
4. Wait 5 minutes and check the mailbox of `ben.inactive@example.com`.

**Expected result**
- Both pages show exactly "If an account exists for this email, we sent a reset link." with the same fields, buttons, and HTTP status code.
- No text on the page indicates that the account is deactivated.
- No reset email arrives in the mailbox of `ben.inactive@example.com`.

### TC-NEG-004 - Keep response time independent of account existence

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-5 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- Active accounts exist for `anna.test@example.com` and `carl.demo@example.com`
- No accounts exist for `ghost.user@example.com` and `nobody.demo@example.com`
- None of the addresses has reset requests in the last 60 minutes

**Test data**
- Registered emails: `anna.test@example.com`, `carl.demo@example.com`
- Unregistered emails: `ghost.user@example.com`, `nobody.demo@example.com`

**Steps**
1. Submit one reset request for each registered address and record the server response time from the browser network log.
2. Submit one reset request for each unregistered address and record the server response time.
3. Repeat steps 1-2 twice more, using the same addresses (staying within 5 requests per address).
4. Compare the response times of the registered group with those of the unregistered group.

**Expected result**
- The response times of the registered group and the unregistered group overlap; there is no consistent gap that sorts every registered address into one group and every unregistered address into the other.
- All responses show the message "If an account exists for this email, we sent a reset link."

### TC-NEG-005 - Keep response neutral when the email service is unavailable

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-5, AC-8 |
| Technique | Error guessing |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- No account exists with email `ghost.user@example.com`
- The outgoing email service is made unavailable in the test environment (for example, the SMTP stub is stopped)

**Test data**
- Registered email: `anna.test@example.com`
- Unregistered email: `ghost.user@example.com`

**Steps**
1. Submit a reset request for `anna.test@example.com` and save the displayed page.
2. Submit a reset request for `ghost.user@example.com` and save the displayed page.
3. Compare both pages.

**Expected result**
- Both pages are identical in message, fields, and buttons.
- Neither page shows a stack trace, a technical error text, a server name, or any hint that an email could not be delivered to an existing account.

### TC-NEG-006 - Apply the rate limit to an unregistered address

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-6, AC-7 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- No account exists with email `ghost.user@example.com`
- The address has no reset requests in the last 60 minutes

**Test data**
- Email: `ghost.user@example.com`
- Number of requests: 8 within 5 minutes

**Steps**
1. Submit 8 reset requests for `ghost.user@example.com` within 5 minutes.
2. Record the message shown after each request.

**Expected result**
- Requests 1-5 show "If an account exists for this email, we sent a reset link."
- Requests 6-8 show "Too many requests. Try again later."
- The sequence of messages is the same as for a registered address, so the rate limit does not reveal whether the account exists.

### TC-NEG-007 - Block excess requests in a burst of 10 requests

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-7, AC-26 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The address has no reset requests in the last 60 minutes
- Access to the test mailbox of `anna.test@example.com` is available

**Test data**
- Email: `anna.test@example.com`
- Number of requests: 10 within 5 minutes

**Steps**
1. Submit 10 reset requests for `anna.test@example.com` within 5 minutes.
2. Record the message shown after each request.
3. Wait 5 minutes and count the reset emails in the mailbox.

**Expected result**
- Requests 6-10 show "Too many requests. Try again later."
- Exactly 5 reset emails arrive in the mailbox; requests 6-10 produce no email.

### TC-NEG-008 - Enforce the rate limit for concurrent parallel requests

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-6, AC-7 |
| Technique | Error guessing |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The address has no reset requests in the last 60 minutes
- An HTTP client that can send parallel requests is available (for example, a load test tool)

**Test data**
- Email: `anna.test@example.com`
- Number of parallel requests: 20, sent at the same moment

**Steps**
1. Send 20 reset requests for `anna.test@example.com` in parallel.
2. Count the responses with "If an account exists for this email, we sent a reset link." and with "Too many requests. Try again later."
3. Wait 5 minutes and count the reset emails in the mailbox.

**Expected result**
- At most 5 responses show "If an account exists for this email, we sent a reset link."; all other responses show "Too many requests. Try again later."
- At most 5 reset emails arrive in the mailbox.
- No response returns a server error.

### TC-NEG-009 - Build the reset link from the trusted domain despite a forged Host header

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-8 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- An intercepting proxy is available to modify request headers

**Test data**
- Email: `anna.test@example.com`
- Forged headers: `Host: attacker-demo.example.net` and `X-Forwarded-Host: attacker-demo.example.net`

**Steps**
1. Submit a reset request for `anna.test@example.com` through the proxy.
2. Replace the `Host` header with `attacker-demo.example.net` and add `X-Forwarded-Host: attacker-demo.example.net` before forwarding the request.
3. Open the received reset email and inspect the reset link.

**Expected result**
- Either the request is rejected by the server, or the reset email contains a link that points to the official Notely domain.
- No reset email contains a link to `attacker-demo.example.net`.

### TC-NEG-010 - Generate unpredictable HTTPS reset links

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-8, AC-11 |
| Technique | Security check |
| Source | https://owasp.github.io/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities |

**Preconditions**
- Active accounts exist for `anna.test@example.com` and `carl.demo@example.com`
- Neither address has reset requests in the last 60 minutes

**Test data**
- Emails: `anna.test@example.com`, `carl.demo@example.com`

**Steps**
1. Submit two reset requests for `anna.test@example.com`, one minute apart.
2. Submit one reset request for `carl.demo@example.com`.
3. Compare the tokens of the three received reset links.

**Expected result**
- All three links start with `https://`.
- All three tokens are different, have no visible sequential pattern, and do not contain the email address, the user ID, or a readable timestamp.

### TC-NEG-011 - Reject a reset request that carries two email addresses

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-8, AC-21 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- An intercepting proxy is available
- Access to the test mailboxes of `anna.test@example.com` and `mallory.demo@example.org` is available

**Test data**
- Variant A: request body with a duplicated parameter `email=anna.test@example.com&email=mallory.demo@example.org`
- Variant B: field value `anna.test@example.com,mallory.demo@example.org`

**Steps**
1. Submit a reset request for `anna.test@example.com` through the proxy and change the body to variant A.
2. Submit a reset request using the field value of variant B.
3. Wait 5 minutes and check both mailboxes.

**Expected result**
- Variant B shows "Enter a valid email address."
- No reset email arrives in the mailbox of `mallory.demo@example.org` for either variant.
- No response shows a server error.

### TC-NEG-012 - Send no reset email to an unregistered address

Removed: duplicate of TC-FUN-010

### TC-NEG-013 - Show the expired page for a superseded reset link

Removed: duplicate of TC-FUN-023

### TC-NEG-014 - Reject a password submitted from a form opened by a superseded link

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-10 |
| Technique | State transition |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- The address has no reset requests in the last 60 minutes

**Test data**
- Email: `anna.test@example.com`
- New password: `N3wPass2026`

**Steps**
1. Submit a reset request and open the received link 1 in browser tab A; the password form is displayed.
2. In browser tab B, submit a new reset request for the same address and wait for link 2.
3. In tab A, enter `N3wPass2026` in "New password" and "Confirm password" and submit the form.
4. Try to log in with `OldPass2026`, then with `N3wPass2026`.

**Expected result**
- The submission in tab A is rejected and the page shows "This link has expired. Please request a new one."
- Login with `OldPass2026` succeeds; login with `N3wPass2026` is rejected.

### TC-NEG-015 - Deny the password form for a tampered or missing reset token

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-11 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- A valid reset link was received for this account

**Test data**
- Variant A: the valid token with its last character changed
- Variant B: the link with the token parameter removed
- Variant C: the link with the token replaced by `' OR '1'='1`

**Steps**
1. Open the reset link using variant A.
2. Open the reset link using variant B.
3. Open the reset link using variant C.

**Expected result**
- For every variant, the "New password" and "Confirm password" fields are not displayed.
- No page shows the account email address, a stack trace, or a database error.
- The original valid link still opens the password form afterwards.

### TC-NEG-016 - Prevent resetting another user's password with a valid token

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-11 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- Active accounts exist for `anna.test@example.com` (password `OldPass2026`) and `carl.demo@example.com` (password `CarlPass2026`)
- A valid reset link was received for `anna.test@example.com`
- An intercepting proxy is available

**Test data**
- New password: `N3wPass2026`
- Added parameters: `email=carl.demo@example.com` and, if a user identifier is visible in the request, the identifier of Carl's account

**Steps**
1. Open Anna's reset link and enter `N3wPass2026` in both password fields.
2. Before forwarding the submission, add `email=carl.demo@example.com` (and Carl's user identifier, if the request contains one) to the request body.
3. Try to log in as `carl.demo@example.com` with `CarlPass2026`, then with `N3wPass2026`.

**Expected result**
- Login as `carl.demo@example.com` with `CarlPass2026` succeeds.
- Login as `carl.demo@example.com` with `N3wPass2026` is rejected.
- Carl's existing sessions remain active.

### TC-NEG-017 - Show the expired page for a link opened 3 hours after sending

Removed: duplicate of TC-FUN-024

### TC-NEG-018 - Reject a password submission after the link expired while the form was open

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-12 |
| Technique | State transition |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A reset link was sent 30 minutes ago

**Test data**
- New password: `N3wPass2026`
- Waiting time with the open form: 45 minutes (link age at submission: 75 minutes)

**Steps**
1. Open the reset link; the password form is displayed.
2. Leave the form open for 45 minutes.
3. Enter `N3wPass2026` in both password fields and submit the form.
4. Try to log in with `OldPass2026`.

**Expected result**
- The submission is rejected and the page shows "This link has expired. Please request a new one."
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-019 - Show the expired page when reopening a used reset link

Removed: duplicate of TC-FUN-035

### TC-NEG-020 - Reject a replayed password submission with a used token

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-13 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- An intercepting proxy is available

**Test data**
- First new password: `N3wPass2026`
- Replayed new password: `Attack3rPass9`

**Steps**
1. Open the reset link and submit `N3wPass2026` in both password fields; capture the submission request in the proxy.
2. Resend the captured request with both password values changed to `Attack3rPass9`.
3. Try to log in with `Attack3rPass9`, then with `N3wPass2026`.

**Expected result**
- The replayed request is rejected and does not change the password.
- Login with `Attack3rPass9` is rejected; login with `N3wPass2026` succeeds.

### TC-NEG-021 - Reject a clearly too short new password

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-14 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `ab12` (4 characters)

**Steps**
1. Enter `ab12` in "New password" and "Confirm password".
2. Submit the form.
3. Try to log in with `OldPass2026`.

**Expected result**
- The message "Password must be 8-64 characters long." is displayed.
- No other password error message is displayed.
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-022 - Reject a clearly too long new password

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-14 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `Pass1` repeated 20 times (100 characters)

**Steps**
1. Enter the 100-character value in "New password" and "Confirm password".
2. Submit the form.
3. Try to log in with `OldPass2026`.

**Expected result**
- The message "Password must be 8-64 characters long." is displayed.
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-023 - Reject a new password without a digit

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-15 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `NotelyPassword`

**Steps**
1. Enter `NotelyPassword` in "New password" and "Confirm password".
2. Submit the form.
3. Try to log in with `OldPass2026`.

**Expected result**
- The message "Password must contain at least one letter and one digit." is displayed.
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-024 - Reject a new password without a Latin letter

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-15 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `20262026!#`

**Steps**
1. Enter `20262026!#` in "New password" and "Confirm password".
2. Submit the form.
3. Try to log in with `OldPass2026`.

**Expected result**
- The message "Password must contain at least one letter and one digit." is displayed.
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-025 - Reject a new password whose only letters are non-Latin

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-15 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `пароль2026` (Cyrillic letters and digits)
- New password and confirmation (second attempt): `éèàü2026` (accented letters and digits)

**Steps**
1. Enter `пароль2026` in "New password" and "Confirm password" and submit the form.
2. Enter `éèàü2026` in "New password" and "Confirm password" and submit the form.
3. Try to log in with `OldPass2026`.

**Expected result**
- After each submission, the message "Password must contain at least one letter and one digit." is displayed.
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-026 - Reject mismatching new and confirmation passwords

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-16 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password: `N3wPass2026`
- Confirm password: `N3wPass2027`

**Steps**
1. Enter `N3wPass2026` in "New password".
2. Enter `N3wPass2027` in "Confirm password".
3. Submit the form.
4. Try to log in with `OldPass2026`, then with `N3wPass2026`.

**Expected result**
- The message "Passwords do not match." is displayed.
- Login with `OldPass2026` succeeds; login with `N3wPass2026` is rejected.

### TC-NEG-027 - Sign out a session in another browser after a successful reset

Removed: duplicate of TC-FUN-032

### TC-NEG-028 - Reject a replayed pre-reset session cookie

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-19 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- The user is logged in and the session cookie value was copied before the reset
- An HTTP client (for example, a proxy or command-line client) is available

**Test data**
- Copied pre-reset session cookie
- New password: `N3wPass2026`

**Steps**
1. Complete the password reset with `N3wPass2026` through a valid reset link.
2. Send a request for the notes list with the copied pre-reset session cookie.
3. Send a request that creates a note titled `Demo note` with the copied cookie.

**Expected result**
- Both requests are rejected as unauthenticated (redirect to the login page or HTTP 401).
- No notes data is returned and no note titled `Demo note` is created.

### TC-NEG-029 - Reject login with the previous password after a reset

Removed: duplicate of TC-FUN-034

### TC-NEG-030 - Keep the current password after a failed reset attempt

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-20, AC-14 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- Rejected new password: `ab12`

**Steps**
1. Enter `ab12` in both password fields and submit the form.
2. Open the login page.
3. Log in with `anna.test@example.com` and `ab12`.
4. Log in with `anna.test@example.com` and `OldPass2026`.

**Expected result**
- The form shows "Password must be 8-64 characters long."
- Login with `ab12` is rejected.
- Login with `OldPass2026` succeeds.

### TC-NEG-031 - Reject an email address consisting only of spaces

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-21, AC-22 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Email: five space characters

**Steps**
1. Enter five spaces in the email address field.
2. Click "Send reset link".

**Expected result**
- The inline error "Enter a valid email address." is displayed.
- The message "If an account exists for this email, we sent a reset link." is not displayed and no email is sent.

### TC-NEG-032 - Reject an email address without the @ sign

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-21 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Email: `anna.testexample.com`

**Steps**
1. Enter `anna.testexample.com` in the email address field.
2. Click "Send reset link".

**Expected result**
- The inline error "Enter a valid email address." is displayed.
- No reset request is sent and no email is sent.

### TC-NEG-033 - Reject email addresses with a missing domain or two @ signs

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-21 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Email A: `anna.test@`
- Email B: `anna@@example.com`
- Email C: `anna.test@exa_mple!.com`

**Steps**
1. Enter email A and click "Send reset link".
2. Enter email B and click "Send reset link".
3. Enter email C and click "Send reset link".

**Expected result**
- After each submission, the inline error "Enter a valid email address." is displayed.
- No reset request is sent and no email is sent for any of the values.

### TC-NEG-034 - Exclude invalid submissions from the rate limit

Removed: duplicate of TC-FUN-018

### TC-NEG-035 - Handle SQL-injection-like text in the email field safely

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-21 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Email A: `' OR '1'='1`
- Email B: `anna.test@example.com' OR '1'='1`

**Steps**
1. Enter email A and click "Send reset link".
2. Enter email B and click "Send reset link".
3. Repeat steps 1-2 through an intercepting proxy, bypassing the browser validation.

**Expected result**
- Every submission shows "Enter a valid email address."
- No response contains a database error, stack trace, or account data.
- No reset email is sent to any account.

### TC-NEG-036 - Do not execute script input in the email field

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-21 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Email: `<script>alert(1)</script>@example.com`

**Steps**
1. Enter the test value in the email address field.
2. Click "Send reset link".
3. Repeat the submission through an intercepting proxy, bypassing the browser validation.

**Expected result**
- The inline error "Enter a valid email address." is displayed.
- No alert dialog appears; if the value is shown on the page, it is shown as plain text.
- No reset email is sent.

### TC-NEG-037 - Prevent rate limit bypass with case and space variants

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-22, AC-7 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- 5 accepted reset requests for `anna.test@example.com` were made within the last 10 minutes

**Test data**
- Variant A: `ANNA.TEST@EXAMPLE.COM`
- Variant B: `  Anna.Test@Example.com ` (leading and trailing spaces)

**Steps**
1. Submit a reset request with variant A.
2. Submit a reset request with variant B.
3. Wait 5 minutes and count new reset emails in the mailbox.

**Expected result**
- Both requests show "Too many requests. Try again later."
- No new reset email arrives in the mailbox.

### TC-NEG-038 - Reject an email address with a space inside it

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-22, AC-21 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Email: `anna .test@example.com`

**Steps**
1. Enter `anna .test@example.com` in the email address field.
2. Click "Send reset link".

**Expected result**
- The inline error "Enter a valid email address." is displayed.
- No reset request is sent and no email is sent.

### TC-NEG-039 - Send no email for a case variant of a deactivated account address

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-22, AC-9 |
| Technique | Security check |
| Source | N/A - derived from requirements |

**Preconditions**
- A deactivated account exists with email `ben.inactive@example.com`
- The address has no reset requests in the last 60 minutes

**Test data**
- Email: `  BEN.Inactive@Example.COM ` (leading and trailing spaces, mixed case)

**Steps**
1. Submit a reset request with the test value.
2. Wait 5 minutes and check the mailbox of `ben.inactive@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- No reset email arrives in the mailbox of `ben.inactive@example.com`.

### TC-NEG-040 - Truncate pasted text far longer than 254 characters

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-23 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The "Reset password" page is open

**Test data**
- Clipboard text: 400 characters (`a` repeated 388 times followed by `@example.com`)

**Steps**
1. Paste the 400-character text into the email address field.
2. Count the characters in the field.
3. Click "Send reset link".

**Expected result**
- The field contains exactly the first 254 characters of the pasted text.
- The submission shows "Enter a valid email address." because the truncated value has no `@` sign.
- No email is sent.

### TC-NEG-041 - Reject a new password with a space in the middle

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-24 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `Notely 2026pass`

**Steps**
1. Enter `Notely 2026pass` in "New password" and "Confirm password".
2. Submit the form.
3. Try to log in with `OldPass2026`.

**Expected result**
- The message "Password must not contain spaces." is displayed.
- Login with `OldPass2026` succeeds; the password is not changed.

### TC-NEG-042 - Reject a new password with leading and trailing spaces

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-24 |
| Technique | Error guessing |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: ` N3wPass2026 ` (one leading and one trailing space)

**Steps**
1. Enter ` N3wPass2026 ` in "New password" and "Confirm password".
2. Submit the form.
3. Try to log in with `N3wPass2026`.

**Expected result**
- The message "Password must not contain spaces." is displayed; the spaces are not silently removed.
- Login with `N3wPass2026` is rejected; the password is not changed.

### TC-NEG-043 - Reject a new password equal to the current password

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-25 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password and confirmation: `OldPass2026`

**Steps**
1. Enter `OldPass2026` in "New password" and "Confirm password".
2. Submit the form.
3. Open the same reset link again.

**Expected result**
- The message "New password must be different from your current password." is displayed.
- The reset link is not consumed: opening it again shows the "New password" and "Confirm password" fields.

### TC-NEG-044 - Skip the current-password check while the confirmation does not match

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-25, AC-16 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password: `OldPass2026`
- Confirm password: `OldPass2027`

**Steps**
1. Enter `OldPass2026` in "New password".
2. Enter `OldPass2027` in "Confirm password".
3. Submit the form.

**Expected result**
- The message "Passwords do not match." is displayed.
- The message "New password must be different from your current password." is not displayed.
- The password is not changed; login with `OldPass2026` succeeds.

### TC-NEG-045 - Keep an earlier reset link valid after a blocked request

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-26, AC-10 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- 5 accepted reset requests for this address were made within the last 10 minutes; the link from the 5th request is kept as "link 5"

**Test data**
- New password: `N3wPass2026`

**Steps**
1. Submit a further reset request for `anna.test@example.com`.
2. Open link 5.
3. Enter `N3wPass2026` in both password fields and submit the form.

**Expected result**
- Step 1 shows "Too many requests. Try again later." and no new email arrives.
- Link 5 opens the "New password" and "Confirm password" fields.
- The password is changed; login with `N3wPass2026` succeeds.

### TC-NEG-046 - Keep blocking requests while 5 accepted requests remain in the window

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-27, AC-7 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- 5 accepted reset requests for this address were made between 30 and 25 minutes ago

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. Submit a reset request for `anna.test@example.com`.
2. Wait 10 minutes and submit another reset request.

**Expected result**
- Both requests show "Too many requests. Try again later."
- No reset email is sent for either request.

### TC-NEG-047 - Reject an overlong email address that bypasses the UI limit

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-29 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- An intercepting proxy or HTTP client is available
- No reset requests were made for the test address in the last 60 minutes

**Test data**
- Email: `a` repeated 288 times followed by `@example.com` (300 characters)

**Steps**
1. Submit a reset request for a short valid address and intercept it in the proxy.
2. Replace the email value with the 300-character address and forward the request.
3. Repeat step 2 six more times.

**Expected result**
- Every response shows "Enter a valid email address."
- No reset email is sent.
- None of the 7 submissions shows "Too many requests. Try again later."

### TC-NEG-048 - Show all violated password rule messages at the same time

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-30 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password: `ab cd` (too short, no digit, contains a space)
- Confirm password: `xyz`

**Steps**
1. Enter `ab cd` in "New password".
2. Enter `xyz` in "Confirm password".
3. Submit the form.

**Expected result**
- All four messages are displayed at the same time: "Password must be 8-64 characters long.", "Password must contain at least one letter and one digit.", "Password must not contain spaces.", and "Passwords do not match."
- The password is not changed; login with `OldPass2026` succeeds.

### TC-NEG-049 - Show length and composition messages when both password fields are empty

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-30, AC-14, AC-15 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPass2026`
- A valid reset link for this account is open

**Test data**
- New password: empty value
- Confirm password: empty value

**Steps**
1. Leave "New password" and "Confirm password" empty.
2. Submit the form.

**Expected result**
- The messages "Password must be 8-64 characters long." and "Password must contain at least one letter and one digit." are displayed at the same time.
- The message "Passwords do not match." is not displayed.
- The password is not changed; login with `OldPass2026` succeeds.

## Notes and assumptions
- TC-NEG-004 checks timing-based enumeration as part of AC-5 ("does not reveal whether an account exists"), following the OWASP Forgot Password Cheat Sheet; the requirements define no numeric timing threshold, so the expected result is a qualitative comparison of overlapping response times.
- TC-NEG-005 assumes that AC-5 (identical page for all syntactically valid addresses) also applies when the email service fails; the requirements define no specific error behavior for an email outage.
- TC-NEG-009, TC-NEG-011, TC-NEG-015, and TC-NEG-016 accept either a rejected request or a safe outcome, because the requirements define no specific error message for forged headers, tampered parameters, or invalid tokens; the mandatory outcome is that no account is compromised and no data is disclosed.
- TC-NEG-043 assumes that a rejected submission does not consume the reset link, because AC-13 marks a link as used only after a successful password reset.
- TC-NEG-047 relies on assumption A-7: an overlong address rejected by the server does not count toward the rate limit.
- Exact boundary values (7/8/64/65-character passwords, 254/255-character email addresses, the exact 5th/6th request, and a link age of exactly 60 minutes) are deliberately left to `edge-case-planner`; this artifact uses clearly invalid values instead.
- The WSTG "latest" page returned HTTP 404 through WebFetch in this run; the WSTG v4.2 page was used instead.
- All email addresses, passwords, and domains are fictional; `example.com`, `example.org`, and `example.net` are reserved example domains.
- Revision 2: TC-NEG-012 removed as a duplicate of TC-FUN-010 (gates G3, G4); AC-9 remains covered by TC-NEG-003 and TC-NEG-039.
- Revision 2: TC-NEG-013 removed as a duplicate of TC-FUN-023 (gate G4); AC-10 remains covered by TC-NEG-014 and TC-NEG-045.
- Revision 2: TC-NEG-017 removed as a duplicate of TC-FUN-024 (gate G4); AC-12 remains covered by TC-NEG-018.
- Revision 2: TC-NEG-019 removed as a duplicate of TC-FUN-035 (gate G4); AC-13 remains covered by TC-NEG-020.
- Revision 2: TC-NEG-027 removed as a duplicate of TC-FUN-032 (gate G4); AC-19 remains covered by TC-NEG-028.
- Revision 2: TC-NEG-029 removed as a duplicate of TC-FUN-034 (gate G4); AC-20 remains covered by TC-NEG-030.
- Revision 2: TC-NEG-034 removed as a duplicate of TC-FUN-018 (gate G4); AC-21 remains covered by TC-NEG-001, TC-NEG-011, TC-NEG-031 to TC-NEG-033, TC-NEG-035, TC-NEG-036, and TC-NEG-038, and AC-6 by TC-NEG-006 and TC-NEG-008.
