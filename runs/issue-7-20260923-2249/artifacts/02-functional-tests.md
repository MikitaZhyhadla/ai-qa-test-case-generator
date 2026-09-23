# Functional Test Cases

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | functional-test-planner |
| Revision | 1 |
| Generated | 2026-09-23 23:05 |

## Scope
This artifact covers the positive functional behavior of the Notely self-service password reset flow: entry from the login page, submitting a reset request, the uniform confirmation message, reset email delivery, the rolling rate limit as designed behavior, reset link states (valid, superseded, expired, used), setting a new password that satisfies the policy, and the post-reset outcomes (redirect, message, session sign-out, login with the new password). Every acceptance criterion AC-1 to AC-30 is covered by at least one Happy path case, and every business rule BR-1 to BR-11 is exercised. Invalid input, attacks, and exact boundary values (for example 7/8/64/65 characters, 59/60 minutes, 254/255 characters) are deliberately left to the negative and edge-case planners.

## Research sources
- None - derived from requirements

## Test cases

### TC-FUN-001 - Display the "Forgot password?" link on the login page

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The tester is not logged in to Notely

**Test data**
- Login page URL: `https://notely.example.com/login`

**Steps**
1. Open `https://notely.example.com/login` in the browser.
2. Look at the login form.

**Expected result**
- The login page displays a link with the exact text "Forgot password?".

### TC-FUN-002 - Open the "Reset password" page from the "Forgot password?" link

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- The tester is not logged in to Notely
- The login page `https://notely.example.com/login` is open

**Test data**
- None

**Steps**
1. Click the "Forgot password?" link.

**Expected result**
- The "Reset password" page opens.

### TC-FUN-003 - Submit a reset request from the "Reset password" page

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-3 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Anna Test with email `anna.test@example.com`
- No reset request was made for `anna.test@example.com` in the last 60 minutes
- The "Reset password" page is open

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. Check that the page shows an email address input field and a "Send reset link" button.
2. Enter `anna.test@example.com` into the email address field.
3. Click "Send reset link".

**Expected result**
- The page contains an email address input field and a "Send reset link" button.
- After the click, the reset request is submitted: the page shows the message "If an account exists for this email, we sent a reset link."

### TC-FUN-004 - Show the confirmation message for an active account

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Ben Active with email `ben.active@example.com`
- No reset request was made for `ben.active@example.com` in the last 60 minutes
- The "Reset password" page is open

**Test data**
- Email: `ben.active@example.com`

**Steps**
1. Enter `ben.active@example.com` into the email address field.
2. Click "Send reset link".

**Expected result**
- The page shows exactly the message "If an account exists for this email, we sent a reset link."

### TC-FUN-005 - Show the same confirmation message for a deactivated account (BR-2)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- A deactivated account exists for Boris Inactive with email `boris.inactive@example.com`
- No reset request was made for `boris.inactive@example.com` in the last 60 minutes
- The "Reset password" page is open

**Test data**
- Email: `boris.inactive@example.com`

**Steps**
1. Enter `boris.inactive@example.com` into the email address field.
2. Click "Send reset link".

**Expected result**
- The page shows exactly the message "If an account exists for this email, we sent a reset link." (business rule BR-2).

### TC-FUN-006 - Show the same confirmation message for an unregistered address

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- No Notely account exists for `nobody.registered@example.com`
- No reset request was made for `nobody.registered@example.com` in the last 60 minutes
- The "Reset password" page is open

**Test data**
- Email: `nobody.registered@example.com`

**Steps**
1. Enter `nobody.registered@example.com` into the email address field.
2. Click "Send reset link".

**Expected result**
- The page shows exactly the message "If an account exists for this email, we sent a reset link."

### TC-FUN-007 - Show an identical result page for active, deactivated, and unregistered addresses

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-5 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `carla.active@example.com`
- A deactivated account exists with email `dirk.inactive@example.com`
- No Notely account exists for `emil.unknown@example.com`
- No reset request was made for any of these addresses in the last 60 minutes

**Test data**
- Active: `carla.active@example.com`
- Deactivated: `dirk.inactive@example.com`
- Unregistered: `emil.unknown@example.com`

**Steps**
1. Open the "Reset password" page, submit `carla.active@example.com`, and take a screenshot of the resulting page.
2. Open the "Reset password" page, submit `dirk.inactive@example.com`, and take a screenshot of the resulting page.
3. Open the "Reset password" page, submit `emil.unknown@example.com`, and take a screenshot of the resulting page.
4. Compare the three screenshots.

**Expected result**
- All three pages show the same message "If an account exists for this email, we sent a reset link."
- All three pages show the same fields and the same buttons, with no additional or missing element on any of them.
- Nothing on the pages indicates whether an account exists for the submitted address.

### TC-FUN-008 - Send the reset email to an active account within 1 minute

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-8 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Anna Test with email `anna.test@example.com`
- The tester has access to the test mailbox of `anna.test@example.com`
- No reset request was made for `anna.test@example.com` in the last 60 minutes

**Test data**
- Email: `anna.test@example.com`

**Steps**
1. Open the "Reset password" page.
2. Enter `anna.test@example.com` and click "Send reset link"; note the time of the click.
3. Open the test mailbox of `anna.test@example.com` and look for a new email from Notely.

**Expected result**
- A new email from Notely arrives in the mailbox of `anna.test@example.com`.
- The email contains a password reset link.
- The email was sent no later than 1 minute after the noted submission time (checked against the email timestamp).

### TC-FUN-009 - Send no reset email to a deactivated account (BR-2)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- A deactivated account exists for Boris Inactive with email `boris.inactive@example.com`
- The tester has access to the test mailbox of `boris.inactive@example.com`, and the mailbox contains no Notely emails
- No reset request was made for `boris.inactive@example.com` in the last 60 minutes

**Test data**
- Email: `boris.inactive@example.com`

**Steps**
1. Open the "Reset password" page.
2. Enter `boris.inactive@example.com` and click "Send reset link".
3. Wait 5 minutes.
4. Check the test mailbox of `boris.inactive@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- No reset email from Notely arrives in the mailbox of `boris.inactive@example.com` (business rule BR-2: deactivated accounts never receive a reset email).

### TC-FUN-010 - Send no reset email to an unregistered address

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- No Notely account exists for `nobody.registered@example.com`
- The tester has access to the test mailbox of `nobody.registered@example.com`, and the mailbox contains no Notely emails
- No reset request was made for `nobody.registered@example.com` in the last 60 minutes

**Test data**
- Email: `nobody.registered@example.com`

**Steps**
1. Open the "Reset password" page.
2. Enter `nobody.registered@example.com` and click "Send reset link".
3. Wait 5 minutes.
4. Check the test mailbox of `nobody.registered@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- No reset email from Notely arrives in the mailbox of `nobody.registered@example.com`.

### TC-FUN-011 - Match an address with surrounding spaces and mixed case to the account (BR-7)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-22 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Anna Test with email `anna.test@example.com`
- The tester has access to the test mailbox of `anna.test@example.com`
- No reset request was made for `anna.test@example.com` in the last 60 minutes

**Test data**
- Entered email: `  Anna.Test@Example.com ` (two leading spaces, one trailing space, mixed case)

**Steps**
1. Open the "Reset password" page.
2. Enter `  Anna.Test@Example.com ` exactly as given, including the spaces.
3. Click "Send reset link".
4. Check the test mailbox of `anna.test@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- A reset email with a reset link arrives in the mailbox of `anna.test@example.com` within 1 minute, confirming that the address was normalized per business rule BR-7 and matched to the account.

### TC-FUN-012 - Enter and submit a long email address within the 254-character limit (BR-10)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-23 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `elisabeth.very-long-display-name.for-qa-testing@notes-department.example.com`
- The tester has access to the test mailbox of this address
- No reset request was made for this address in the last 60 minutes

**Test data**
- Email: `elisabeth.very-long-display-name.for-qa-testing@notes-department.example.com` (well below 254 characters)

**Steps**
1. Open the "Reset password" page.
2. Type the email address from the test data into the email address field.
3. Check the value shown in the field.
4. Click "Send reset link".
5. Check the test mailbox of the address.

**Expected result**
- The field contains the complete address, with no character cut off (business rule BR-10 limits only addresses longer than 254 characters).
- The page shows "If an account exists for this email, we sent a reset link."
- A reset email arrives in the mailbox of the address within 1 minute.

### TC-FUN-013 - Accept a valid-length address on the server when the UI limit is bypassed (BR-10)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-29 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Felix Server with email `felix.server@example.com`
- The tester has access to the test mailbox of `felix.server@example.com`
- No reset request was made for `felix.server@example.com` in the last 60 minutes
- The "Reset password" page is open in a browser with developer tools available

**Test data**
- Email: `felix.server@example.com`

**Steps**
1. Open the browser developer tools and remove the 254-character input limit from the email address field.
2. Enter `felix.server@example.com` into the email address field.
3. Click "Send reset link".
4. Check the test mailbox of `felix.server@example.com`.

**Expected result**
- The server-side 254-character check of business rule BR-10 does not reject the address: the message "Enter a valid email address." is not shown.
- The page shows "If an account exists for this email, we sent a reset link."
- A reset email arrives in the mailbox of `felix.server@example.com` within 1 minute.

### TC-FUN-014 - Accept 5 reset requests for the same address within 60 minutes (BR-4)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Clara Limit with email `clara.limit@example.com`
- The tester has access to the test mailbox of `clara.limit@example.com`
- No reset request was made for `clara.limit@example.com` in the last 60 minutes

**Test data**
- Email: `clara.limit@example.com`
- Number of requests: 5, about 1 minute apart

**Steps**
1. Open the "Reset password" page, enter `clara.limit@example.com`, and click "Send reset link".
2. Repeat step 1 four more times, about 1 minute apart (5 requests in total).
3. Check the test mailbox of `clara.limit@example.com`.

**Expected result**
- Each of the 5 requests shows "If an account exists for this email, we sent a reset link."
- The message "Too many requests. Try again later." is not shown for any of the 5 requests (business rule BR-4 allows 5 requests per rolling 60 minutes).
- 5 reset emails arrive in the mailbox of `clara.limit@example.com`.

### TC-FUN-015 - Show the rate-limit message on the 6th request within 60 minutes (BR-4)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-7 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Dora Limit with email `dora.limit@example.com`
- Exactly 5 accepted reset requests were made for `dora.limit@example.com` within the last 10 minutes
- The "Reset password" page is open

**Test data**
- Email: `dora.limit@example.com`

**Steps**
1. Enter `dora.limit@example.com` into the email address field.
2. Click "Send reset link" (6th request within 60 minutes).

**Expected result**
- The page shows exactly the message "Too many requests. Try again later." (business rule BR-4).
- The message "If an account exists for this email, we sent a reset link." is not shown for this request.

### TC-FUN-016 - Apply the rate limit to an unregistered address (BR-4)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-6, AC-7 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- No Notely account exists for `ghost.user@example.com`
- No reset request was made for `ghost.user@example.com` in the last 60 minutes

**Test data**
- Email: `ghost.user@example.com`
- Number of requests: 6, about 1 minute apart

**Steps**
1. Open the "Reset password" page, enter `ghost.user@example.com`, and click "Send reset link".
2. Repeat step 1 four more times, about 1 minute apart (5 requests in total).
3. Repeat step 1 once more (6th request).

**Expected result**
- Requests 1 to 5 each show "If an account exists for this email, we sent a reset link."
- Request 6 shows "Too many requests. Try again later.", the same as for a registered address (business rule BR-4 applies whether or not an account exists).

### TC-FUN-017 - Count case and space variants of one address toward the same rate limit (BR-7)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-22 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Helen Case with email `helen.case@example.com`
- No reset request was made for `helen.case@example.com` in the last 60 minutes

**Test data**
- Request 1: `helen.case@example.com`
- Request 2: `HELEN.CASE@EXAMPLE.COM`
- Request 3: `  Helen.Case@Example.com ` (with leading and trailing spaces)
- Request 4: `helen.case@EXAMPLE.com  ` (with trailing spaces)
- Request 5: `Helen.case@example.com`
- Request 6: `helen.case@example.com`

**Steps**
1. Open the "Reset password" page and submit request 1 from the test data.
2. Submit requests 2 to 5 from the test data one after another, about 1 minute apart.
3. Submit request 6 from the test data.

**Expected result**
- Requests 1 to 5 each show "If an account exists for this email, we sent a reset link."
- Request 6 shows "Too many requests. Try again later.", because all six variants are normalized to `helen.case@example.com` per business rule BR-7 and counted as one address.

### TC-FUN-018 - Do not count empty and invalid submissions toward the rate limit (BR-8)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-21 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Ivan Check with email `ivan.check@example.com`
- The tester has access to the test mailbox of `ivan.check@example.com`
- No reset request was made for `ivan.check@example.com` in the last 60 minutes

**Test data**
- Empty value: nothing entered in the email address field
- Invalid value: `ivan.check@@example.com`
- Valid email: `ivan.check@example.com`

**Steps**
1. Open the "Reset password" page, leave the email address field empty, and click "Send reset link".
2. Enter `ivan.check@@example.com` and click "Send reset link".
3. Enter `ivan.check@example.com` and click "Send reset link".
4. Repeat step 3 four more times, about 1 minute apart (5 valid requests in total).
5. Check the test mailbox of `ivan.check@example.com`.

**Expected result**
- Steps 1 and 2 each show the inline error "Enter a valid email address."
- All 5 valid requests show "If an account exists for this email, we sent a reset link."; "Too many requests. Try again later." is not shown, because the empty and invalid submissions did not count toward the limit (business rule BR-8).
- Exactly 5 reset emails arrive in the mailbox of `ivan.check@example.com`.

### TC-FUN-019 - Keep the latest link valid and send no email after a blocked request (BR-9)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-26 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Julia Block with email `julia.block@example.com`
- The tester has access to the test mailbox of `julia.block@example.com`
- Exactly 5 accepted reset requests were made for `julia.block@example.com` within the last 10 minutes, and 5 reset emails were received

**Test data**
- Email: `julia.block@example.com`
- Link #5: the reset link from the most recent (5th) reset email

**Steps**
1. Open the "Reset password" page, enter `julia.block@example.com`, and click "Send reset link".
2. Wait 5 minutes and check the test mailbox of `julia.block@example.com`.
3. Open link #5 from the 5th reset email.

**Expected result**
- Step 1 shows "Too many requests. Try again later."
- No new (6th) reset email arrives in the mailbox.
- Link #5 opens the page with the "New password" and "Confirm password" fields, so the blocked request did not invalidate it (business rule BR-9).

### TC-FUN-020 - Accept a new request after earlier requests leave the 60-minute window

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-27 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Erik Recover with email `erik.recover@example.com`
- The tester has access to the test mailbox of `erik.recover@example.com`
- Exactly 5 accepted reset requests were made for `erik.recover@example.com` at 10:00, 10:01, 10:02, 10:03, and 10:04, and no other requests after that

**Test data**
- Email: `erik.recover@example.com`
- Time of the new request: 11:05 (all 5 earlier requests are older than 60 minutes)

**Steps**
1. At 11:05, open the "Reset password" page, enter `erik.recover@example.com`, and click "Send reset link".
2. Check the test mailbox of `erik.recover@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- A new reset email arrives in the mailbox within 1 minute.

### TC-FUN-021 - Move the rate limit through accepted, blocked, and accepted states in a rolling window

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-6, AC-7, AC-27 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Frank Window with email `frank.window@example.com`
- No reset request was made for `frank.window@example.com` in the last 60 minutes

**Test data**
- Email: `frank.window@example.com`
- Request times: 10:00, 10:10, 10:20, 10:30, 10:40, 10:45, 11:01, 11:05, 11:11

**Steps**
1. Submit a reset request for `frank.window@example.com` at 10:00, 10:10, 10:20, 10:30, and 10:40.
2. Submit a reset request at 10:45.
3. Submit a reset request at 11:01.
4. Submit a reset request at 11:05.
5. Submit a reset request at 11:11.

**Expected result**
- Step 1: each of the 5 requests shows "If an account exists for this email, we sent a reset link."
- Step 2 (6th request within 60 minutes, business rule BR-4): the page shows "Too many requests. Try again later."
- Step 3: the 10:00 request has left the window, so the request is accepted and shows "If an account exists for this email, we sent a reset link."
- Step 4: 5 accepted requests (10:10 to 10:40 and 11:01) are inside the window, so the page shows "Too many requests. Try again later."
- Step 5: the 10:10 request has left the window and the blocked requests did not count, so the request is accepted and shows "If an account exists for this email, we sent a reset link."

### TC-FUN-022 - Open a valid reset link and see the new password form

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-11 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Anna Test with email `anna.test@example.com`
- A reset link was requested for `anna.test@example.com` 5 minutes ago; it is the only link requested in the last 60 minutes and it has not been used

**Test data**
- Reset link age: 5 minutes

**Steps**
1. Open the reset email in the test mailbox of `anna.test@example.com`.
2. Click the reset link.

**Expected result**
- A page opens with a "New password" field and a "Confirm password" field.

### TC-FUN-023 - Invalidate an older reset link when a new link is requested (BR-1)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-10 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Karl Supersede with email `karl.supersede@example.com`
- The tester has access to the test mailbox of `karl.supersede@example.com`
- No reset request was made for `karl.supersede@example.com` in the last 60 minutes

**Test data**
- Email: `karl.supersede@example.com`
- Link #1: link from the first reset email
- Link #2: link from the second reset email

**Steps**
1. Request a reset link for `karl.supersede@example.com` and wait for the first reset email (link #1).
2. Request another reset link for `karl.supersede@example.com` and wait for the second reset email (link #2).
3. Open link #1.
4. Open link #2.

**Expected result**
- Link #1 shows "This link has expired. Please request a new one." and a "Request a new link" button (business rule BR-1).
- Link #2 opens the page with the "New password" and "Confirm password" fields.

### TC-FUN-024 - Show the expired-link page for a link opened 75 minutes after sending (BR-3)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-12 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Lena Timeout with email `lena.timeout@example.com`
- A reset link was sent to `lena.timeout@example.com` 75 minutes ago; it is the latest link and it has not been used

**Test data**
- Reset link age: 75 minutes

**Steps**
1. Open the reset email in the test mailbox of `lena.timeout@example.com`.
2. Click the reset link.

**Expected result**
- The page shows "This link has expired. Please request a new one." (business rule BR-3: a link expires 60 minutes after it was sent).
- A "Request a new link" button is displayed.
- The "New password" and "Confirm password" fields are not displayed.

### TC-FUN-025 - Open the "Reset password" page from the "Request a new link" button

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-28 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An expired reset link was opened, and the page shows "This link has expired. Please request a new one." with a "Request a new link" button

**Test data**
- None

**Steps**
1. Click "Request a new link".

**Expected result**
- The "Reset password" page opens with the email address input field and the "Send reset link" button.

### TC-FUN-026 - Reset the password with a valid matching new password

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-16, AC-17, AC-18 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Anna Test with email `anna.test@example.com` and current password `Old-Passw0rd1`
- A valid, unused reset link for `anna.test@example.com` was sent 5 minutes ago and is open, showing the "New password" and "Confirm password" fields

**Test data**
- New password: `N3w-Passw0rd!`
- Confirm password: `N3w-Passw0rd!`

**Steps**
1. Enter `N3w-Passw0rd!` into the "New password" field.
2. Enter `N3w-Passw0rd!` into the "Confirm password" field.
3. Click "Save new password".

**Expected result**
- No password error message is shown.
- The user is automatically redirected to the login page.
- The login page shows the message "Your password has been changed".

### TC-FUN-027 - Accept a new password with a length inside the 8-64 character range (BR-5)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-14 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Mia Length with email `mia.length@example.com` and current password `Old-Passw0rd1`
- A valid, unused reset link for `mia.length@example.com` is open, showing the "New password" and "Confirm password" fields

**Test data**
- New password: `Lumen2026abc` (12 characters)
- Confirm password: `Lumen2026abc`

**Steps**
1. Enter `Lumen2026abc` into the "New password" and "Confirm password" fields.
2. Click "Save new password".

**Expected result**
- The message "Password must be 8-64 characters long." is not shown (business rule BR-5 length rule).
- The user is redirected to the login page, which shows "Your password has been changed".

### TC-FUN-028 - Accept a new password with uppercase Latin letters and digits only (BR-5)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-15 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Noah Mix with email `noah.mix@example.com` and current password `Old-Passw0rd1`
- A valid, unused reset link for `noah.mix@example.com` is open, showing the "New password" and "Confirm password" fields

**Test data**
- New password: `QWERTY12345Z` (uppercase Latin letters and digits, 12 characters)
- Confirm password: `QWERTY12345Z`

**Steps**
1. Enter `QWERTY12345Z` into the "New password" and "Confirm password" fields.
2. Click "Save new password".

**Expected result**
- The message "Password must contain at least one letter and one digit." is not shown (business rule BR-5 letter and digit rule).
- The user is redirected to the login page, which shows "Your password has been changed".

### TC-FUN-029 - Accept a new password with special characters and no spaces (BR-5)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-24 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Olga Symbol with email `olga.symbol@example.com` and current password `Old-Passw0rd1`
- A valid, unused reset link for `olga.symbol@example.com` is open, showing the "New password" and "Confirm password" fields

**Test data**
- New password: `P@ss#2026_!~` (12 characters, special characters, no spaces)
- Confirm password: `P@ss#2026_!~`

**Steps**
1. Enter `P@ss#2026_!~` into the "New password" and "Confirm password" fields.
2. Click "Save new password".

**Expected result**
- The message "Password must not contain spaces." is not shown and no other password error is shown (business rule BR-5 allows special characters other than spaces).
- The user is redirected to the login page, which shows "Your password has been changed".

### TC-FUN-030 - Accept a new password that differs from the current password (BR-6)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-25 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Paul Differ with email `paul.differ@example.com` and current password `Old-Passw0rd1`
- A valid, unused reset link for `paul.differ@example.com` is open, showing the "New password" and "Confirm password" fields

**Test data**
- New password: `Old-Passw0rd2` (differs from the current password by the last character)
- Confirm password: `Old-Passw0rd2`

**Steps**
1. Enter `Old-Passw0rd2` into the "New password" and "Confirm password" fields.
2. Click "Save new password".

**Expected result**
- The message "New password must be different from your current password." is not shown (business rule BR-6).
- The user is redirected to the login page, which shows "Your password has been changed".

### TC-FUN-031 - Complete the reset after correcting a password with several rule violations (BR-11)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-30 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Rita Correct with email `rita.correct@example.com` and current password `Old-Passw0rd1`
- A valid, unused reset link for `rita.correct@example.com` is open, showing the "New password" and "Confirm password" fields

**Test data**
- First attempt: New password `ab c`, Confirm password `abcd`
- Second attempt: New password `N3w-Passw0rd!`, Confirm password `N3w-Passw0rd!`

**Steps**
1. Enter `ab c` into "New password" and `abcd` into "Confirm password".
2. Click "Save new password".
3. Replace both values with `N3w-Passw0rd!`.
4. Click "Save new password".

**Expected result**
- After step 2, these messages are shown at the same time: "Password must be 8-64 characters long.", "Password must contain at least one letter and one digit.", "Password must not contain spaces.", and "Passwords do not match." (business rule BR-11).
- After step 2, "New password must be different from your current password." is not shown, and the password is not changed.
- After step 4, the user is redirected to the login page, which shows "Your password has been changed".

### TC-FUN-032 - Sign out sessions that existed before the reset

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-19 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Sara Session with email `sara.session@example.com` and current password `Old-Passw0rd1`
- Browser B (for example Firefox) has a logged-in Notely session for `sara.session@example.com`, created before the reset
- Browser A (for example Chrome) is not logged in to Notely

**Test data**
- New password: `N3w-Passw0rd!`

**Steps**
1. In browser A, request a reset link for `sara.session@example.com`, open the link, and set the new password `N3w-Passw0rd!` in both fields.
2. Confirm in browser A that the login page shows "Your password has been changed".
3. In browser B, open any note or click any navigation item in the logged-in session.

**Expected result**
- In browser B, the action is not performed; the login page is shown and a new login is required.

### TC-FUN-033 - Log in with the new password after a successful reset

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-20 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Anna Test with email `anna.test@example.com`
- The password of this account was just reset from `Old-Passw0rd1` to `N3w-Passw0rd!` through a reset link
- The login page is open

**Test data**
- Email: `anna.test@example.com`
- Password: `N3w-Passw0rd!`

**Steps**
1. Enter `anna.test@example.com` into the email field of the login page.
2. Enter `N3w-Passw0rd!` into the password field.
3. Click the login button.

**Expected result**
- The login succeeds and the user sees the logged-in Notely start page.

### TC-FUN-034 - Reject the previous password after the password changes to the new one

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-20 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Tom Switch with email `tom.switch@example.com` and password `Old-Passw0rd1`
- The tester is not logged in to Notely

**Test data**
- Email: `tom.switch@example.com`
- Previous password: `Old-Passw0rd1`
- New password: `N3w-Passw0rd!`

**Steps**
1. Request a reset link for `tom.switch@example.com`, open it, set `N3w-Passw0rd!` in both fields, and click "Save new password".
2. On the login page, enter `tom.switch@example.com` and the previous password `Old-Passw0rd1`, then click the login button.

**Expected result**
- After step 1, the login page shows "Your password has been changed".
- After step 2, the login is rejected: the user stays on the login page and is not logged in.

### TC-FUN-035 - Show the expired-link page when a used link is opened again (BR-3)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-13 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists for Uwe Reuse with email `uwe.reuse@example.com`
- The password of this account was successfully reset 5 minutes ago through the latest reset link (link #1)

**Test data**
- Link #1: the reset link that was used for the successful reset

**Steps**
1. Open link #1 from the reset email again.

**Expected result**
- The page shows "This link has expired. Please request a new one." (business rule BR-3: a reset link is single-use).
- A "Request a new link" button is displayed.
- The "New password" and "Confirm password" fields are not displayed.

## Notes and assumptions
- The requirements do not name the submit button of the new password form; the cases use "Save new password". Replace it with the actual label if it differs.
- The requirements do not specify the application URL; the fictional URL `https://notely.example.com/login` is used for the login page.
- The requirements do not specify the reset email subject, sender, or body text; cases check only that a Notely email with a reset link arrives.
- The requirements do not specify the exact message for a rejected login with the previous password (TC-FUN-034) or the exact screen after a signed-out session action (TC-FUN-032); the cases check the observable outcome (not logged in, login page shown).
- Time-based cases (TC-FUN-008, TC-FUN-020, TC-FUN-021, TC-FUN-024) assume the tester can wait in real time or use a test environment with a controllable clock; the given clock times are relative examples.
- TC-FUN-021 relies on confirmed assumption A-6: only accepted requests count toward the rolling window, blocked requests do not extend it.
- Each rate-limit case uses its own fictional email address so that requests from one case do not affect another.
- Exact boundary values (password length 7/8/64/65, link age 59/60 minutes, email length 254/255, delivery at exactly 1 minute) and all rejection paths (invalid input, rejected passwords, over-long addresses, enumeration attacks) are left to the edge-case and negative planners. TC-FUN-013 and TC-FUN-031 cover the positive side of AC-29 and AC-30 only.
- All names, email addresses, and passwords are fictional.
