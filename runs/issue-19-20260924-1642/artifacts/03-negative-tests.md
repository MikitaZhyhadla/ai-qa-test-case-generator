# Negative and Security Test Cases

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | negative-test-planner |
| Revision | 2 |
| Generated | 2026-09-24 17:12 |

## Scope
This artifact covers negative and security behavior of the Notely footer newsletter subscription with double opt-in: invalid or empty input, invalid value combinations, repeated and concurrent submissions, failure of the email service, invalid or tampered confirmation links, and security checks derived from OWASP guidance (injection, enumeration, token handling, abuse). It deliberately does not cover the normal responses defined by the acceptance criteria (covered by `functional-test-planner`), exact boundary values such as 254 and 255 characters (covered by `edge-case-planner`), or the out-of-scope topics unsubscribing, newsletter content, and sending schedule.

## Research sources
- [Email Validation and Verification - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) - rules on verification tokens (cryptographically random, single-use, never activated before verification, not logged), rate limiting, consistent responses to prevent enumeration, and email canonicalization
- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - rules on allowlist validation of email syntax, mandatory server-side validation (client-side validation can be bypassed), and validation as a complement to parameterized queries and output encoding

## Test cases

### TC-NEG-001 - Prevent duplicate subscription when Subscribe is double-clicked

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Error guessing |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor
- No subscription exists for `anna.test@example.com`

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. Type `anna.test@example.com` into the footer "Email" field.
2. Double-click the "Subscribe" button quickly (two clicks within 200 ms).
3. Check the mailbox of `anna.test@example.com` and the subscription records.

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- Exactly one subscription record exists for `anna.test@example.com`, with a pending (not active) state.
- No server error page or technical error message is shown.

### TC-NEG-002 - Keep the email address out of the URL after submitting the form

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor
- Browser developer tools (Network tab) are open

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. Type `anna.test@example.com` into the footer "Email" field.
2. Click "Subscribe".
3. Inspect the address bar URL and the recorded request URL and headers in the Network tab.

**Expected result**
- The address bar URL does not contain `anna.test@example.com` or any encoded form of it (for example `anna.test%40example.com`).
- The request URL of the submission does not contain the email address in the query string; the address is sent in the request body.
- The page shows "Thanks! Please check your inbox to confirm your subscription."

### TC-NEG-003 - Reject submission of an empty email field

Removed: duplicate of TC-FUN-004 (same empty-field input, steps, and expected result). AC-3 remains covered by TC-NEG-004.

### TC-NEG-004 - Reject submission of an email field that contains only spaces

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor

**Test data**
- Email: five space characters (`     `)

**Steps**
1. Type five space characters into the footer "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved.
- No confirmation email is sent.

### TC-NEG-005 - Reject an email address without the @ symbol

Removed: duplicate of TC-FUN-005 (same address without "@", same steps and expected result). AC-4 remains covered by TC-NEG-006, TC-NEG-007, and TC-NEG-008.

### TC-NEG-006 - Reject email addresses with a missing local part, a missing top-level domain, or a double @

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-4 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor

**Test data**
- Email 1: `@example.com`
- Email 2: `anna.test@example`
- Email 3: `anna@@example.com`

**Steps**
1. Type `@example.com` into the footer "Email" field and click "Subscribe".
2. Reload the page, type `anna.test@example` into the footer "Email" field and click "Subscribe".
3. Reload the page, type `anna@@example.com` into the footer "Email" field and click "Subscribe".

**Expected result**
- After each submission, the page shows "Enter a valid email address."
- No subscription record is saved for any of the three values.
- No confirmation email is sent for any of the three values.

### TC-NEG-007 - Reject and neutralize a script payload entered in the email field

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-4 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor

**Test data**
- Email: `<script>alert(1)</script>@example.com`

**Steps**
1. Type `<script>alert(1)</script>@example.com` into the footer "Email" field.
2. Click "Subscribe".
3. Observe the page and the rendered message.

**Expected result**
- The page shows "Enter a valid email address."
- No JavaScript dialog appears and no script from the input is executed.
- If the entered value is displayed again on the page, it is shown as escaped plain text.
- No subscription record is saved.

### TC-NEG-008 - Reject invalid input sent directly to the server, bypassing client-side validation

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-4 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- An HTTP client (for example a browser developer tools "Edit and resend" feature or a proxy) is available
- The subscription request captured from a valid submission of `anna.test@example.com` can be replayed

**Test data**
- Email: `' OR '1'='1`

**Steps**
1. Submit a valid subscription in the browser and capture the subscription request.
2. Replace the email value in the captured request body with `' OR '1'='1`, so client-side validation is not involved.
3. Send the modified request to the server.
4. Check the response and the subscription records.

**Expected result**
- The server rejects the value; the response contains "Enter a valid email address."
- The response contains no database error text, stack trace, or query fragment.
- No subscription record is saved for the value `' OR '1'='1`, and no existing record is changed or returned.
- No confirmation email is sent.

### TC-NEG-009 - Handle failure of the email service after a valid submission

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-5 |
| Technique | Error guessing |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor
- The outgoing email service is unavailable (simulated by disabling the mail relay in the test environment)
- No subscription exists for `anna.test@example.com`

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. Type `anna.test@example.com` into the footer "Email" field.
2. Click "Subscribe".
3. Observe the page and check the subscription records.
4. Restore the email service.

**Expected result**
- The page does not show a stack trace, raw exception text, server internals, or a confirmation link.
- No subscription for `anna.test@example.com` is in the active state.
- No confirmation email is delivered while the email service is unavailable.
- The page remains usable and the footer form can be submitted again.

### TC-NEG-010 - Send no confirmation email when the submitted address is invalid

Removed: same value and outcome as TC-NEG-005, which is itself removed as a duplicate of TC-FUN-005. AC-5 remains covered by TC-NEG-009.

### TC-NEG-011 - Activate only the matching subscription when a confirmation link is opened

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-7 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html |

**Preconditions**
- Two pending subscriptions exist: `anna.test@example.com` and `boris.test@example.com`
- The confirmation link from the email to `anna.test@example.com` is available

**Test data**
- Email A: `anna.test@example.com`
- Email B: `boris.test@example.com`

**Steps**
1. Open the confirmation link from the email sent to `anna.test@example.com`.
2. Check the state of the subscription for `anna.test@example.com`.
3. Check the state of the subscription for `boris.test@example.com`.

**Expected result**
- The subscription for `anna.test@example.com` becomes active.
- The subscription for `boris.test@example.com` stays pending (not active).
- The confirmation link does not contain the email address of another subscriber and shows no data of other subscribers.

### TC-NEG-012 - Create one record when two visitors submit the same new address at the same time

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in two separate browser sessions as anonymous visitors
- No subscription exists for `anna.test@example.com`

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. In both browser sessions, type `anna.test@example.com` into the footer "Email" field.
2. Click "Subscribe" in both sessions at the same time (within 1 second).
3. Check the subscription records for `anna.test@example.com`.

**Expected result**
- Both sessions show "Thanks! Please check your inbox to confirm your subscription."
- Exactly one subscription record exists for `anna.test@example.com`.
- No server error page or database error message is shown in either session.

### TC-NEG-013 - Give indistinguishable responses for new, pending, and active addresses

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-8, AC-10 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html |

**Preconditions**
- No subscription exists for `new.test@example.com`
- A pending subscription exists for `pending.test@example.com`
- An active subscription exists for `active.test@example.com`
- An HTTP client or browser developer tools (Network tab) is available to record status codes, bodies, and timing

**Test data**
- Email 1: `new.test@example.com`
- Email 2: `pending.test@example.com`
- Email 3: `active.test@example.com`

**Steps**
1. Submit `new.test@example.com` and record the HTTP status code, response body, visible page, and response time.
2. Submit `pending.test@example.com` and record the same values.
3. Submit `active.test@example.com` and record the same values.
4. Repeat steps 1-3 ten times with fresh addresses of the same three kinds and compare the averages of the response times.

**Expected result**
- All three submissions return the same HTTP status code.
- All three pages show the same message "Thanks! Please check your inbox to confirm your subscription." with the same page structure and no additional text, hint, or link that reveals the subscription state.
- The average response times of the three kinds differ by less than 200 ms.

### TC-NEG-014 - Handle a very long email address without a server error

Removed: duplicate of TC-FUN-006 (same over-long address, steps, and expected result). AC-9 remains covered by TC-NEG-015.

### TC-NEG-015 - Handle an extremely large input in the email field without a server error

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-9 |
| Technique | Error guessing |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- An HTTP client is available to send the subscription request directly (browser field length limits do not apply)

**Test data**
- Email: 100000 letters `a` followed by `@example.com`

**Steps**
1. Send the subscription request with the test value as the email.
2. Record the response status, message, and response time.
3. Open the Notely website and submit a valid address `anna.test@example.com`.

**Expected result**
- The server responds with "Enter a valid email address." and no server error (no 5xx status, no timeout, no stack trace).
- No subscription record is saved for the large value.
- The follow-up valid submission in step 3 shows "Thanks! Please check your inbox to confirm your subscription.", so the site is still responsive.

### TC-NEG-016 - Limit repeated submissions of a pending address to prevent confirmation email flooding

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-10 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html |

**Preconditions**
- A pending subscription exists for `anna.test@example.com`
- A test mail server captures all outgoing email
- An HTTP client or script is available to send repeated requests

**Test data**
- Email: `anna.test@example.com`
- Number of submissions: 20 within 60 seconds

**Steps**
1. Submit `anna.test@example.com` 20 times within 60 seconds.
2. Wait 5 minutes and count the confirmation emails received by the test mail server for this address.
3. Check the subscription records for `anna.test@example.com`.

**Expected result**
- Fewer than 20 confirmation emails are delivered, which shows that the number of emails per address is throttled.
- Exactly one subscription record exists for `anna.test@example.com`, in the pending state.
- No response contains a server error or reveals the throttling state of the address in a way that differs from the neutral message "Thanks! Please check your inbox to confirm your subscription." for normal requests.

### TC-NEG-017 - Reject an email address with a space inside it after trimming

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-11 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor

**Test data**
- Email: `  anna .test@example.com  ` (two leading spaces, one space inside the local part, two trailing spaces)

**Steps**
1. Type the test value into the footer "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- Only leading and trailing spaces are trimmed; the space inside the address is kept and makes the address invalid.
- No subscription record is saved.

### TC-NEG-018 - Reject an invalid address that is surrounded by spaces

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-11 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in a browser as an anonymous visitor

**Test data**
- Email: `   anna.test.example.com   ` (three leading and three trailing spaces, no @ symbol)

**Steps**
1. Type the test value into the footer "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved.
- No confirmation email is sent.

### TC-NEG-019 - Create one record when two case variants of a new address are submitted at the same time

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-12 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website is open in two separate browser sessions as anonymous visitors
- No subscription exists for `anna.test@example.com` in any letter case

**Test data**
- Email 1: `Anna.Test@example.com`
- Email 2: `anna.test@EXAMPLE.COM`

**Steps**
1. In session 1, type `Anna.Test@example.com` into the footer "Email" field.
2. In session 2, type `anna.test@EXAMPLE.COM` into the footer "Email" field.
3. Click "Subscribe" in both sessions at the same time (within 1 second).
4. Check the subscription records.

**Expected result**
- Both sessions show "Thanks! Please check your inbox to confirm your subscription."
- Exactly one subscription record exists for the address, regardless of letter case.
- No server error page or database error message is shown in either session.

### TC-NEG-020 - Create no duplicate for an active address in upper case with surrounding spaces

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-11, AC-12 |
| Technique | Error guessing |
| Source | N/A - derived from requirements |

**Preconditions**
- An active subscription exists for `anna.test@example.com`
- A test mail server captures all outgoing email

**Test data**
- Email: `  ANNA.TEST@EXAMPLE.COM  ` (two leading and two trailing spaces, all capitals)

**Steps**
1. Type the test value into the footer "Email" field.
2. Click "Subscribe".
3. Check the subscription records and the test mail server.

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- Exactly one subscription record exists for the address and it stays active.
- No confirmation email is sent.

### TC-NEG-021 - Show an error page for a confirmation link with a missing or unknown token

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-15 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- A pending subscription exists for `anna.test@example.com`
- The valid confirmation link has the form `<confirmation URL>?token=<valid token>`

**Test data**
- Link 1: the confirmation URL without the `token` parameter
- Link 2: the confirmation URL with `token=` (empty value)
- Link 3: the confirmation URL with `token=00000000000000000000000000000000` (well-formed but never issued)

**Steps**
1. Open Link 1 in a browser.
2. Open Link 2 in a browser.
3. Open Link 3 in a browser.
4. Check the state of the subscription for `anna.test@example.com`.

**Expected result**
- Each link shows an error page and does not show the confirmation page that states the subscription is active.
- The error pages contain no stack trace, database error, or data of any subscriber.
- The subscription for `anna.test@example.com` stays pending.

### TC-NEG-022 - Reject a confirmation link whose token was modified

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-15 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html |

**Preconditions**
- A pending subscription exists for `anna.test@example.com`
- The valid confirmation link from the email is available

**Test data**
- Tampered link 1: the valid link with the last character of the token changed to a different character
- Tampered link 2: the valid link with the last 5 characters of the token removed
- Tampered link 3: the valid link with the token converted to upper case (if it contains lower-case letters)

**Steps**
1. Open tampered link 1 in a browser.
2. Open tampered link 2 in a browser.
3. Open tampered link 3 in a browser.
4. Check the state of the subscription for `anna.test@example.com`.

**Expected result**
- Each tampered link shows an error page.
- The subscription for `anna.test@example.com` is not activated by any tampered link and stays pending.
- The error page does not reveal the email address, the expected token, or any hint about which part of the token was wrong.

### TC-NEG-023 - Reject an injection payload in the confirmation token

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-15 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- A pending subscription exists for `anna.test@example.com`
- The valid confirmation link has the form `<confirmation URL>?token=<valid token>`

**Test data**
- Payload 1: `token=' OR '1'='1`
- Payload 2: `token=<script>alert(1)</script>`

**Steps**
1. Open the confirmation URL with Payload 1 as the token in a browser.
2. Open the confirmation URL with Payload 2 as the token in a browser.
3. Check the state of all subscriptions.

**Expected result**
- Both requests show an error page.
- No JavaScript dialog appears, and the payload is not rendered as active markup on the error page.
- The error page contains no database error text or stack trace.
- No subscription is activated; the subscription for `anna.test@example.com` stays pending.

## Notes and assumptions
- The requirements define no visitor message for a failure of the email service (TC-NEG-009). The expected results are limited to safe invariants (no technical details disclosed, no activation, page still usable) and do not assume a specific message.
- The requirements define no rate limit for confirmation emails. TC-NEG-016 applies the OWASP rate limiting guidance and conflicts with a literal reading of AC-10 ("a new confirmation email is sent") if the system sends an email for every submission without a limit. The threshold (fewer than 20 emails for 20 submissions in 60 seconds) is a test assumption and should be clarified with the product owner.
- The 200 ms response time tolerance in TC-NEG-013 is a pragmatic test assumption for detecting enumeration through timing; the requirements define no timing rule.
- BR-8 states that confirmation links do not expire, so no expired-link negative case is included. The OWASP guidance on time-limited and single-use tokens differs from BR-8 and from AC-14; this is not tested as a defect and is recorded here only as a security observation.
- Exact boundary values (254 and 255 characters, local part length limits) are left to `edge-case-planner`; TC-NEG-014 and TC-NEG-015 use clearly oversized values only.
- Security case count is 8 (TC-NEG-002, 007, 008, 011, 013, 016, 022, 023). Acceptance criteria AC-1, AC-6, AC-13, and AC-14 have `Negative testing: Not applicable` and have no case here.
- The `Source` of a case lists an OWASP URL only where the case is derived from that guidance; all other cases are derived from the requirements.
- Revision 2: TC-NEG-020 title shortened from 102 to 79 characters (gate G3).
- Revision 2: TC-NEG-003 marked as Removed (duplicate of TC-FUN-004); AC-3 stays covered by TC-NEG-004 (gate G4).
- Revision 2: TC-NEG-005 marked as Removed (duplicate of TC-FUN-005); AC-4 stays covered by TC-NEG-006 (gate G4).
- Revision 2: TC-NEG-010 marked as Removed (same value and outcome as TC-NEG-005); AC-5 stays covered by TC-NEG-009 (gate G4).
- Revision 2: TC-NEG-014 marked as Removed (duplicate of TC-FUN-006); AC-9 stays covered by TC-NEG-015 (gate G4).
