# Functional Test Cases

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | functional-test-planner |
| Revision | 1 |
| Generated | 2026-09-24 16:55 |

## Scope
This artifact covers the positive and specified-behavior flows of the Notely newsletter subscription: footer form, valid submission, confirmation email, double opt-in activation, confirmation page, and handling of repeated subscriptions. Rejection messages for empty, malformed, and over-long addresses are checked once each with a clearly invalid value. It deliberately does not cover exact limits (254 characters, exact link-expiry moments), injection or tampering attacks beyond a single altered link, or regression of existing features; those belong to the edge-case, negative, and regression planners. Unsubscribing, newsletter content, and sending schedule are out of scope.

## Research sources
- None - derived from requirements

## Test cases

### TC-FUN-001 - Show Email field and Subscribe button in the website footer

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

### TC-FUN-002 - Accept a valid email address and show the check-your-inbox message

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

### TC-FUN-003 - Trim leading and trailing spaces and accept the address

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

### TC-FUN-004 - Reject an empty email field with a validation message

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

### TC-FUN-005 - Reject an email address without the local@domain.tld format

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

### TC-FUN-006 - Reject a clearly over-long email address with a validation message

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

### TC-FUN-007 - Send a confirmation email with a confirmation link after a valid submission

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

### TC-FUN-008 - Keep the subscription pending until the confirmation link is opened

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

### TC-FUN-009 - Activate the subscription when the confirmation link is opened

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

### TC-FUN-010 - Show a confirmation page stating that the subscription is active

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

### TC-FUN-011 - Keep the subscription active and show the same page when the link is opened again

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

### TC-FUN-012 - Activate the subscription with a confirmation link opened long after it was sent

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

### TC-FUN-013 - Show an error page and activate nothing for a tampered confirmation link

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

### TC-FUN-014 - Resend a confirmation email when the address is already pending

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

### TC-FUN-015 - Show the same message and send no email when the address is already active

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

### TC-FUN-016 - Treat a different-case address as a repeat of an active subscription

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

### TC-FUN-017 - Treat a different-case address as a repeat of a pending subscription

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

## Notes and assumptions
- The requirements do not define how a tester views subscription status or subscriber records. Cases TC-FUN-002, 006, 008, 009, 011, 012, 013 assume the test environment offers a subscriber list, admin view, or database query showing status (pending or active) per address; the status labels "pending" and "active" follow the wording of the requirements.
- The requirements do not give the text of the confirmation page or the error page. Expected results describe the observable outcome only (page states the subscription is active; an error page is shown). The exact wording should be confirmed during execution.
- The requirements do not state the sender, subject, or body of the confirmation email; only the presence of a confirmation link is verified.
- AC-3, AC-4, AC-9, and AC-15 describe rejection behavior. They have one case each with a clearly invalid value to satisfy the one-happy-path-per-criterion rule; the requirement rules that would need exact limits, whitespace-only input, and other malformed variants are left to negative-test-planner and edge-case-planner.
- TC-FUN-012 assumes that a confirmation email 30 days old can be produced by seeding data or shifting the test environment clock. Exact expiry moments are not tested here since BR-8 states links never expire.
- Assumption A-1 (anonymous visitor, no login) and A-2 (English messages exactly as quoted in the PBI) from the requirements are applied to all cases.
- Business rule coverage: BR-1 (TC-FUN-002, 006), BR-2 (TC-FUN-008, 009), BR-3 (TC-FUN-014, 015, 016, 017), BR-4 (TC-FUN-004, 005, 006), BR-5 (TC-FUN-003, 005), BR-6 (TC-FUN-016, 017), BR-7 (TC-FUN-014, 015, 016, 017), BR-8 (TC-FUN-012).
