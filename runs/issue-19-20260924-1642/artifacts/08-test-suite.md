# Test Suite - Notely Newsletter Subscription

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Source issue | [#19 PBI: Subscribe to the product newsletter](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/19) |
| Revision | 1 |
| Status | Draft - awaiting approval |
| Approved at | - |
| Generated | 2026-09-24 17:45 |

## 1. Summary

Notely, a fictional note-taking web app, gets a newsletter subscription form in the website footer. A visitor enters an email address and clicks "Subscribe"; valid addresses receive a confirmation email and the subscription becomes active only after the confirmation link is opened (double opt-in). Invalid input is rejected and repeated subscriptions create no duplicates. The suite combines functional, negative and security, and boundary and equivalence test cases, because the feature has a 254-character limit and handles personal data with a tokenized link. Regression analysis was not run because the change is a new feature.

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 3 | 8 | 6 | 0 | 17 |
| Negative | 0 | 6 | 5 | 0 | 11 |
| Security | 4 | 4 | 0 | 0 | 8 |
| Boundary | 0 | 2 | 3 | 0 | 5 |
| Equivalence | 0 | 0 | 1 | 0 | 1 |
| Regression | 0 | 0 | 0 | 0 | 0 |
| **Total** | 7 | 20 | 15 | 0 | 42 |

## 2. Scope

**In scope**
- Footer form with the "Email" field and the "Subscribe" button
- Validation of the submitted email address (empty, format, length up to 254 characters, trimming, case-insensitive comparison)
- Confirmation email and double opt-in activation through the confirmation link
- Confirmation page, repeated opening of the link, and invalid or tampered links
- Repeated subscriptions of active and pending addresses
- Security behavior of the form and the confirmation link (injection, enumeration, token handling, abuse)

**Out of scope**
- Unsubscribing
- Newsletter content
- Newsletter sending schedule
- Regression testing of existing features - not selected because the change is a new feature and no existing behavior is modified

## 3. Requirements under test

| ID | Acceptance criterion |
|---|---|
| AC-1 | The website footer shows an "Email" field and a "Subscribe" button. |
| AC-2 | When a visitor submits a valid email address of at most 254 characters, the page shows "Thanks! Please check your inbox to confirm your subscription." |
| AC-3 | When a visitor submits an empty email field (including a value that is empty after trimming spaces), the page shows "Enter a valid email address." and no subscription record is saved. |
| AC-4 | When a visitor submits an email address that does not match the standard `local@domain.tld` format, the page shows "Enter a valid email address." and no subscription record is saved. |
| AC-5 | After a valid email address is submitted, the system sends a confirmation email to that address containing a confirmation link. |
| AC-6 | Until the confirmation link is opened, the subscription is not active. |
| AC-7 | When the visitor opens the confirmation link from the email, the subscription becomes active. |
| AC-8 | When a visitor submits an email address that already has an active subscription, the page shows "Thanks! Please check your inbox to confirm your subscription." (same message as AC-2), no confirmation email is sent, and no duplicate subscription is created. |
| AC-9 | When a visitor submits an email address longer than 254 characters, the page shows "Enter a valid email address." and no subscription record is saved. |
| AC-10 | When a visitor submits an email address whose subscription is pending (confirmation link not yet opened), the page shows "Thanks! Please check your inbox to confirm your subscription." (same message as AC-2), a new confirmation email is sent, and no duplicate subscription is created. |
| AC-11 | Leading and trailing spaces in the submitted email address are trimmed before validation and saving; an otherwise valid address surrounded by spaces is accepted as in AC-2. |
| AC-12 | Email addresses are compared case-insensitively: submitting an address that differs from an existing active or pending subscription only in letter case is handled as a repeated subscription (AC-8 or AC-10) and creates no duplicate. |
| AC-13 | After the visitor opens a valid confirmation link, a confirmation page states that the subscription is active. |
| AC-14 | When the visitor opens the same valid confirmation link again, the subscription stays active and the same confirmation page as in AC-13 is shown. |
| AC-15 | When the visitor opens an invalid or tampered confirmation link, an error page is shown and no subscription is activated. |

## 4. Coverage matrix

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |
|---|---|---|---|---|
| AC-1 | TC-FUN-001 | - | - | - |
| AC-2 | TC-FUN-002 | TC-NEG-001, TC-NEG-002 | TC-EDGE-001, TC-EDGE-003, TC-EDGE-004 | - |
| AC-3 | TC-FUN-004 | TC-NEG-004 | - | - |
| AC-4 | TC-FUN-005 | TC-NEG-006, TC-NEG-007, TC-NEG-008 | TC-EDGE-006, TC-EDGE-010 | - |
| AC-5 | TC-FUN-007 | TC-NEG-009 | TC-EDGE-001 | - |
| AC-6 | TC-FUN-008 | - | - | - |
| AC-7 | TC-FUN-009, TC-FUN-012 | TC-NEG-011 | - | - |
| AC-8 | TC-FUN-015 | TC-NEG-012, TC-NEG-013 | - | - |
| AC-9 | TC-FUN-006 | TC-NEG-015 | TC-EDGE-002 | - |
| AC-10 | TC-FUN-014 | TC-NEG-013, TC-NEG-016 | - | - |
| AC-11 | TC-FUN-003 | TC-NEG-017, TC-NEG-018, TC-NEG-020 | TC-EDGE-003 | - |
| AC-12 | TC-FUN-016, TC-FUN-017 | TC-NEG-019, TC-NEG-020 | - | - |
| AC-13 | TC-FUN-010 | - | - | - |
| AC-14 | TC-FUN-011 | - | - | - |
| AC-15 | TC-FUN-013 | TC-NEG-021, TC-NEG-022, TC-NEG-023 | - | - |

## 5. Test cases

### 5.1 Functional

#### TC-FUN-001 - Show Email field and Subscribe button in the website footer

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in (anonymous visitor)
- The Notely website home page is reachable in a desktop browser

**Test data**
- None

**Steps**
1. Open the Notely home page.
2. Scroll to the website footer.

**Expected result**
- The footer shows an input field labeled "Email".
- The footer shows a button labeled "Subscribe".
- The "Email" field is empty and both elements are enabled.

#### TC-FUN-002 - Accept a valid email address and show the check-your-inbox message

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-2 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- No subscription exists for `maria.kowalski@example.com`
- The test mailbox for `maria.kowalski@example.com` is accessible

**Test data**
- Email: `maria.kowalski@example.com` (26 characters, well within the allowed length per BR-1)

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `maria.kowalski@example.com` in the "Email" field.
3. Click "Subscribe".

**Expected result**
- The page shows the message "Thanks! Please check your inbox to confirm your subscription."
- A subscription record for `maria.kowalski@example.com` exists in the pending state.

#### TC-FUN-003 - Trim leading and trailing spaces and accept the address

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-11 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- No subscription exists for `tomas.berg@example.com`

**Test data**
- Email typed into the field: `   tomas.berg@example.com   ` (three spaces before and after)

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter the value `   tomas.berg@example.com   ` in the "Email" field.
3. Click "Subscribe".

**Expected result**
- The page shows the message "Thanks! Please check your inbox to confirm your subscription."
- The saved subscription record contains the address `tomas.berg@example.com` without leading or trailing spaces (BR-5).
- A confirmation email is delivered to `tomas.berg@example.com`.

#### TC-FUN-004 - Reject an empty email field with a validation message

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- The subscriber records contain no entries created during this test

**Test data**
- Email: (empty)

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Leave the "Email" field empty.
3. Click "Subscribe".

**Expected result**
- The page shows the message "Enter a valid email address."
- No subscription record is saved (BR-4).
- No confirmation email is sent.

#### TC-FUN-005 - Reject an email address without the local@domain.tld format

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- No subscription exists for `anna.test`

**Test data**
- Email: `anna.test` (no "@" and no domain)

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `anna.test` in the "Email" field.
3. Click "Subscribe".

**Expected result**
- The page shows the message "Enter a valid email address."
- No subscription record is saved (BR-4, BR-5).
- No confirmation email is sent.

#### TC-FUN-006 - Reject a clearly over-long email address with a validation message

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-9 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- The subscriber records contain no entry for the test address

**Test data**
- Email: the letter `a` repeated 290 times followed by `@example.com` (302 characters, clearly above the 254-character maximum of BR-1)

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Paste the 302-character address into the "Email" field.
3. Click "Subscribe".

**Expected result**
- The page shows the message "Enter a valid email address."
- No subscription record is saved (BR-1, BR-4).
- No confirmation email is sent.

#### TC-FUN-007 - Send a confirmation email with a confirmation link after a valid submission

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-5 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- No subscription exists for `lena.fischer@example.com`
- The test mailbox for `lena.fischer@example.com` is empty and accessible

**Test data**
- Email: `lena.fischer@example.com`

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `lena.fischer@example.com` in the "Email" field.
3. Click "Subscribe".
4. Open the test mailbox for `lena.fischer@example.com`.

**Expected result**
- Exactly one new email from Notely is present in the mailbox.
- The email contains a clickable confirmation link.

#### TC-FUN-008 - Keep the subscription pending until the confirmation link is opened

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- No subscription exists for `oliver.grant@example.com`
- The tester can view the subscription status of an address in the test environment (subscriber records or admin view)

**Test data**
- Email: `oliver.grant@example.com`

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `oliver.grant@example.com` in the "Email" field and click "Subscribe".
3. Do not open the confirmation link in the received email.
4. Check the subscription status of `oliver.grant@example.com`.

**Expected result**
- The subscription status is "pending" and not "active" (BR-2).
- No confirmation page has been shown and the status stays unchanged while the link is unopened.

#### TC-FUN-009 - Activate the subscription when the confirmation link is opened

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-7 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- A pending subscription exists for `sofia.marin@example.com` and its confirmation email is in the accessible test mailbox
- The tester can view the subscription status in the test environment

**Test data**
- Email: `sofia.marin@example.com`
- Confirmation link: the link from the received email

**Steps**
1. Open the confirmation email in the mailbox of `sofia.marin@example.com`.
2. Click the confirmation link.
3. Check the subscription status of `sofia.marin@example.com`.

**Expected result**
- The subscription status changes from "pending" to "active" (BR-2).
- The confirmation page is displayed (content is checked in TC-FUN-010).

#### TC-FUN-010 - Show a confirmation page stating that the subscription is active

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-13 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- A pending subscription exists for `david.okafor@example.com` and its confirmation email is in the accessible test mailbox

**Test data**
- Email: `david.okafor@example.com`

**Steps**
1. Open the confirmation email in the mailbox of `david.okafor@example.com`.
2. Click the confirmation link.

**Expected result**
- A confirmation page opens in the browser.
- The page states that the subscription is active.
- The page shows no error message.

#### TC-FUN-011 - Keep the subscription active and show the same page when the link is opened again

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-14 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- The subscription for `nina.petrova@example.com` is active, activated by opening its confirmation link once
- The same confirmation email is still in the test mailbox

**Test data**
- Email: `nina.petrova@example.com`
- Confirmation link: the link already used once

**Steps**
1. Open the confirmation email in the mailbox of `nina.petrova@example.com`.
2. Click the same confirmation link a second time.
3. Check the subscription status of `nina.petrova@example.com`.

**Expected result**
- The same confirmation page as after the first open is shown, stating that the subscription is active.
- The subscription status remains "active".
- Only one subscription record exists for `nina.petrova@example.com`.

#### TC-FUN-012 - Activate the subscription with a confirmation link opened long after it was sent

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-7 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- A pending subscription exists for `hugo.lindqvist@example.com`; its confirmation email was sent 30 days ago (or the test environment clock is set 30 days ahead after sending)
- The confirmation email is in the accessible test mailbox

**Test data**
- Email: `hugo.lindqvist@example.com`
- Age of the confirmation link: 30 days

**Steps**
1. Open the confirmation email in the mailbox of `hugo.lindqvist@example.com`.
2. Click the confirmation link.
3. Check the subscription status of `hugo.lindqvist@example.com`.

**Expected result**
- The confirmation page states that the subscription is active.
- The subscription status is "active"; the link did not expire (BR-8).

#### TC-FUN-013 - Show an error page and activate nothing for a tampered confirmation link

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-15 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- A pending subscription exists for `eva.novak@example.com` and its confirmation email is in the accessible test mailbox

**Test data**
- Email: `eva.novak@example.com`
- Tampered link: the original confirmation link with the last 5 characters of the token replaced by `XXXXX`

**Steps**
1. Open the confirmation email in the mailbox of `eva.novak@example.com` and copy the confirmation link.
2. Replace the last 5 characters of the token in the copied link with `XXXXX`.
3. Open the modified link in the browser.
4. Check the subscription status of `eva.novak@example.com`.

**Expected result**
- An error page is shown instead of the confirmation page.
- The subscription status of `eva.novak@example.com` remains "pending".

#### TC-FUN-014 - Resend a confirmation email when the address is already pending

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-10 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- A pending subscription exists for `carla.ruiz@example.com` (confirmation link not opened)
- The test mailbox for `carla.ruiz@example.com` contains exactly one confirmation email

**Test data**
- Email: `carla.ruiz@example.com`

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `carla.ruiz@example.com` in the "Email" field.
3. Click "Subscribe".
4. Open the test mailbox for `carla.ruiz@example.com`.

**Expected result**
- The page shows the message "Thanks! Please check your inbox to confirm your subscription."
- The mailbox now contains a second, new confirmation email with a confirmation link (BR-7).
- Only one subscription record exists for `carla.ruiz@example.com`, still in the pending state (BR-3).

#### TC-FUN-015 - Show the same message and send no email when the address is already active

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- An active subscription exists for `peter.hall@example.com`
- The test mailbox for `peter.hall@example.com` contains exactly one email (the original confirmation email)

**Test data**
- Email: `peter.hall@example.com`

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `peter.hall@example.com` in the "Email" field.
3. Click "Subscribe".
4. Open the test mailbox for `peter.hall@example.com`.

**Expected result**
- The page shows the message "Thanks! Please check your inbox to confirm your subscription."
- No new email is present in the mailbox (BR-7).
- Only one subscription record exists for `peter.hall@example.com`, still active (BR-3).

#### TC-FUN-016 - Treat a different-case address as a repeat of an active subscription

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-12 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- An active subscription exists for `julia.weber@example.com`
- The test mailbox for `julia.weber@example.com` contains exactly one email

**Test data**
- Email typed into the field: `Julia.Weber@Example.com`

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `Julia.Weber@Example.com` in the "Email" field.
3. Click "Subscribe".
4. Open the test mailbox for `julia.weber@example.com`.

**Expected result**
- The page shows the message "Thanks! Please check your inbox to confirm your subscription."
- No new email is sent (AC-8 behavior, BR-6, BR-7).
- No second subscription record is created; only one record exists for this address, still active (BR-3).

#### TC-FUN-017 - Treat a different-case address as a repeat of a pending subscription

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-12 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- The visitor is not logged in
- A pending subscription exists for `marco.rossi@example.com` (confirmation link not opened)
- The test mailbox for `marco.rossi@example.com` contains exactly one confirmation email

**Test data**
- Email typed into the field: `MARCO.ROSSI@EXAMPLE.COM`

**Steps**
1. Open the Notely home page and scroll to the footer.
2. Enter `MARCO.ROSSI@EXAMPLE.COM` in the "Email" field.
3. Click "Subscribe".
4. Open the test mailbox for `marco.rossi@example.com`.

**Expected result**
- The page shows the message "Thanks! Please check your inbox to confirm your subscription."
- A new confirmation email is delivered to the mailbox (AC-10 behavior, BR-6, BR-7).
- No second subscription record is created; only one record exists for this address, still pending (BR-3).

### 5.2 Negative and security

#### TC-NEG-001 - Prevent duplicate subscription when Subscribe is double-clicked

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

#### TC-NEG-002 - Keep the email address out of the URL after submitting the form

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

#### TC-NEG-004 - Reject submission of an email field that contains only spaces

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

#### TC-NEG-006 - Reject email addresses with a missing local part, a missing top-level domain, or a double @

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

#### TC-NEG-007 - Reject and neutralize a script payload entered in the email field

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

#### TC-NEG-008 - Reject invalid input sent directly to the server, bypassing client-side validation

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

#### TC-NEG-009 - Handle failure of the email service after a valid submission

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

#### TC-NEG-011 - Activate only the matching subscription when a confirmation link is opened

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

#### TC-NEG-012 - Create one record when two visitors submit the same new address at the same time

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

#### TC-NEG-013 - Give indistinguishable responses for new, pending, and active addresses

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

#### TC-NEG-015 - Handle an extremely large input in the email field without a server error

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

#### TC-NEG-016 - Limit repeated submissions of a pending address to prevent confirmation email flooding

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

#### TC-NEG-017 - Reject an email address with a space inside it after trimming

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

#### TC-NEG-018 - Reject an invalid address that is surrounded by spaces

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

#### TC-NEG-019 - Create one record when two case variants of a new address are submitted at the same time

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

#### TC-NEG-020 - Create no duplicate for an active address in upper case with surrounding spaces

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

#### TC-NEG-021 - Show an error page for a confirmation link with a missing or unknown token

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

#### TC-NEG-022 - Reject a confirmation link whose token was modified

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

#### TC-NEG-023 - Reject an injection payload in the confirmation token

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

### 5.3 Boundary and edge cases

#### TC-EDGE-001 - Accept an email address of exactly 254 characters (maximum)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2, AC-5 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690 |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address
- A mailbox that can receive mail for the test address is available

**Test data**
- Email of exactly 254 characters: `a` x 64 + `@` + `b` x 63 + `.` + `c` x 63 + `.` + `d` x 57 + `.com` (64 + 1 + 63 + 1 + 63 + 1 + 57 + 4 = 254 characters)

**Steps**
1. Enter the 254-character test email in the "Email" field.
2. Click "Subscribe".
3. Check the mailbox of the test address.

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- One subscription record exists for the address, with status pending.
- One confirmation email containing a confirmation link is received.

#### TC-EDGE-002 - Reject an email address of 255 characters (maximum plus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690 |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address

**Test data**
- Email of exactly 255 characters: `a` x 64 + `@` + `b` x 63 + `.` + `c` x 63 + `.` + `d` x 58 + `.com` (64 + 1 + 63 + 1 + 63 + 1 + 58 + 4 = 255 characters)

**Steps**
1. Enter the 255-character test email in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved for the address.
- No confirmation email is sent.

#### TC-EDGE-003 - Accept a 254-character email address surrounded by spaces (trimmed length 254)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2, AC-11 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address

**Test data**
- Email of 254 characters after trimming: `e` x 64 + `@` + `f` x 63 + `.` + `g` x 63 + `.` + `h` x 57 + `.com`
- Submitted value: 2 leading spaces + the email + 2 trailing spaces (258 characters before trimming)

**Steps**
1. Enter the submitted value with the surrounding spaces in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- One subscription record exists, and its saved address is the 254-character email without spaces.

#### TC-EDGE-004 - Accept an email address of exactly 253 characters (maximum minus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690 |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address

**Test data**
- Email of exactly 253 characters: `k` x 64 + `@` + `l` x 63 + `.` + `m` x 63 + `.` + `n` x 56 + `.com` (64 + 1 + 63 + 1 + 63 + 1 + 56 + 4 = 253 characters)

**Steps**
1. Enter the 253-character test email in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- One subscription record exists for the address, with status pending.

#### TC-EDGE-006 - Reject a single-character email value `a` (shortest non-empty input)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-4 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- The subscription store contains no records

**Test data**
- Email: `a` (1 character)

**Steps**
1. Enter `a` in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved.
- No confirmation email is sent.

#### TC-EDGE-010 - Reject an email value with an empty domain part (`mia.test@`)

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-4 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- The subscription store contains no records

**Test data**
- Email: `mia.test@` (9 characters, "@" is the last character and the domain part is empty)

**Steps**
1. Enter `mia.test@` in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved.
- No confirmation email is sent.

### 5.4 Regression

Not applicable for this run - regression analysis was not selected because the change is a new feature and no existing behavior is modified.

## 6. Assumptions and risks

- The form is available to anonymous visitors, with no login required.
- The messages are shown in English exactly as quoted in the PBI.
- The requirements do not define how a tester views subscription status or subscriber records; several cases assume the test environment offers a subscriber list, admin view, or database query showing the status (pending or active) per address.
- The requirements do not give the text of the confirmation page or the error page; expected results describe the observable outcome only, and the exact wording should be confirmed during execution.
- The requirements do not state the sender, subject, or body of the confirmation email; only the presence of a confirmation link is verified.
- TC-FUN-012 assumes that a confirmation email 30 days old can be produced by seeding data or shifting the test environment clock.
- The requirements define no visitor message for a failure of the email service (TC-NEG-009); expected results are limited to safe invariants.
- The requirements define no rate limit for confirmation emails. TC-NEG-016 applies rate limiting guidance and may conflict with a literal reading of AC-10 ("a new confirmation email is sent"); the threshold (fewer than 20 emails for 20 submissions in 60 seconds) is a test assumption to clarify with the product owner.
- The 200 ms response time tolerance in TC-NEG-013 is a test assumption for detecting enumeration through timing; the requirements define no timing rule.
- Confirmation links never expire (BR-8), so no expired-link case is included. Security guidance recommends time-limited and single-use tokens, which differs from BR-8 and AC-14; this is recorded as a risk observation, not tested as a defect.
- The requirements state no limits for the local part or domain labels; the length boundary cases use a 64-character local part and labels of at most 63 characters so that the total length is the only rule under test.
- The email address is personal data and must be handled accordingly; the requirements state no specific rule.

## 7. References

- [Email Validation and Verification - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Email_Validation_and_Verification_Cheat_Sheet.html) - rules on verification tokens, rate limiting, consistent responses to prevent enumeration, and email canonicalization
- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - allowlist validation of email syntax, mandatory server-side validation, and injection protection
- [3-value Boundary Value Analysis: Misconception and Reality (Medium)](https://medium.com/@giorgos.valamats/3-value-boundary-value-analysis-misconception-and-reality-25a008739660) - two-value boundary value analysis used to choose maximum and maximum plus one values
- [Boundary Value Analysis & Equivalence Partitioning Examples (Software Testing Help)](https://www.softwaretestinghelp.com/what-is-boundary-value-analysis-and-equivalence-partitioning/) - one representative value per partition and boundary values at the edges of a range
- [Erratum 1690 - RFC 3696](https://errata.rfc-editor.org/eid1690) - the upper limit for the length of an email address is 254 characters

## 8. Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-24 | Initial draft |
