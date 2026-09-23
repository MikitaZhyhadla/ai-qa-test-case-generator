# Test Suite - Reset a forgotten password via an email link

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Source issue | [#7 PBI: Reset a forgotten password via an email link](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/7) |
| Revision | 1 |
| Status | Approved |
| Approved at | 2026-09-24 00:43 |
| Generated | 2026-09-23 23:55 |

## 1. Summary

Notely, a fictional note-taking web app, gets a self-service password reset flow: a user who forgot the password requests a single-use reset link by email from the login page, sets a new password that satisfies the password policy, and all existing sessions are signed out afterwards. The flow must not reveal whether an account exists, limits reset requests to 5 per rolling 60 minutes per email address, and enforces a 254-character email limit in the UI and on the server. Positive functional cases cover every acceptance criterion. Negative and security cases were selected because the feature is an authentication flow; they cover account enumeration, rate limit bypass, token misuse, and session invalidation, based on OWASP guidance. Boundary and equivalence cases were selected because the requirements contain numeric limits (password length 8-64, 254-character email, 5 requests per 60 minutes, 60-minute link validity); regression analysis was not selected because the feature is new.

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 10 | 16 | 9 | 0 | 35 |
| Negative | 0 | 3 | 19 | 0 | 22 |
| Security | 9 | 11 | 0 | 0 | 20 |
| Boundary | 0 | 10 | 6 | 2 | 18 |
| Equivalence | 0 | 0 | 8 | 0 | 8 |
| Regression | 0 | 0 | 0 | 0 | 0 |
| **Total** | 19 | 40 | 42 | 2 | 103 |

## 2. Scope

**In scope**
- Entry to the flow: the "Forgot password?" link on the login page and the "Reset password" page (AC-1, AC-2, AC-3)
- Uniform confirmation message and account enumeration protection, including response timing and email service failure (AC-4, AC-5)
- Reset email delivery to active accounts and no email for deactivated or unregistered addresses (AC-8, AC-9)
- Rate limit of 5 requests per rolling 60 minutes per email address, blocked requests, and recovery of the limit (AC-6, AC-7, AC-26, AC-27)
- Email address validation, normalization (trimming and case), and the 254-character limit in the UI and on the server (AC-21, AC-22, AC-23, AC-29)
- Reset link states: valid, superseded, expired, used, tampered, and cross-account misuse (AC-10, AC-11, AC-12, AC-13, AC-28)
- New password policy: length, Latin letter and digit, no spaces, confirmation match, difference from the current password, and combined violations (AC-14, AC-15, AC-16, AC-24, AC-25, AC-30)
- Post-reset outcomes: redirect, confirmation message, sign-out of existing sessions, login with the new password (AC-17, AC-18, AC-19, AC-20)

**Out of scope**
- Password reset via SMS (excluded by the requirements)
- Changing the account email address (excluded by the requirements)
- Regression testing of existing features - not selected for this run, because the change type is a new feature (self-service password reset does not exist today)
- Whitespace characters other than spaces (for example tabs) in the new password, because the requirements name spaces only
- Late email delivery (more than 1 minute), because it cannot be forced through the product

## 3. Requirements under test

| ID | Acceptance criterion |
|---|---|
| AC-1 | The login page displays a link with the text "Forgot password?". |
| AC-2 | Clicking the "Forgot password?" link opens the "Reset password" page. |
| AC-3 | The "Reset password" page contains an email address input field and a "Send reset link" button; entering an email address and clicking the button submits the reset request. |
| AC-4 | After submitting a syntactically valid email address, the page shows the message "If an account exists for this email, we sent a reset link." regardless of whether the address belongs to an active account, a deactivated account, or no account. |
| AC-5 | The page shown after submitting a syntactically valid email address is identical (message, fields, buttons) for an active account, a deactivated account, and an unregistered address, so it does not reveal whether an account exists. |
| AC-6 | Up to 5 reset requests for the same syntactically valid email address within a rolling 60-minute window are accepted and each shows the message from AC-4; the limit applies whether the address belongs to an active account, a deactivated account, or no account. |
| AC-7 | A 6th reset request for the same email address within a rolling 60-minute window shows the message "Too many requests. Try again later." |
| AC-8 | When a submitted email address belongs to an active account, the system sends an email containing a reset link to that address within 1 minute of the submission. |
| AC-9 | When a submitted email address belongs to a deactivated account or to no account, no reset email is sent. |
| AC-10 | Requesting a new reset link for an account invalidates all previously sent reset links for that account; opening an older link shows "This link has expired. Please request a new one." and a "Request a new link" button. |
| AC-11 | Opening a valid reset link (not used, not superseded, less than 60 minutes after it was sent) opens a page with "New password" and "Confirm password" fields. |
| AC-12 | Opening a reset link 60 minutes or more after it was sent shows "This link has expired. Please request a new one." and a "Request a new link" button. |
| AC-13 | Opening a reset link that was already used for a successful password reset shows "This link has expired. Please request a new one." and a "Request a new link" button. |
| AC-14 | A new password of 8 to 64 characters (inclusive) is accepted; a new password shorter than 8 or longer than 64 characters is rejected with the message "Password must be 8-64 characters long." and the password is not changed. |
| AC-15 | A new password that contains at least one Latin letter (A-Z or a-z) and at least one digit is accepted; a new password without a Latin letter or without a digit is rejected with the message "Password must contain at least one letter and one digit." and the password is not changed. |
| AC-16 | The password is changed only when the "New password" and "Confirm password" values match; if they differ, the reset is rejected with the message "Passwords do not match." and the password is not changed. |
| AC-17 | After a successful reset, the message "Your password has been changed" is shown on the login page. |
| AC-18 | After a successful reset, the user is automatically redirected to the login page. |
| AC-19 | After a successful reset, all sessions of the user that existed before the reset are signed out; any further action in such a session requires a new login. |
| AC-20 | After a successful reset, the user can log in with the new password, and a login attempt with the previous password is rejected. |
| AC-21 | Submitting an empty or syntactically invalid email address shows the inline error "Enter a valid email address."; no reset request is sent, no email is sent, and the submission does not count toward the rate limit of AC-6 and AC-7. |
| AC-22 | Leading and trailing spaces of the submitted email address are removed and letter case is ignored, so `  Anna.Test@Example.com ` is treated as the same address as `anna.test@example.com` for account matching and for the rate limit. |
| AC-23 | The email address field accepts at most 254 characters: an address of up to 254 characters can be entered and submitted, typing stops at 254 characters, and pasted text is truncated to the first 254 characters. |
| AC-24 | A new password that contains a space is rejected with the message "Password must not contain spaces." and the password is not changed; other special characters are allowed. |
| AC-25 | A new password that satisfies all other password rules (AC-14, AC-15, AC-16, AC-24) but is the same as the current password is rejected with the message "New password must be different from your current password." and the password is not changed; this check is not performed while any other password rule is violated. |
| AC-26 | A rate-limited (blocked) reset request sends no email and does not invalidate previously sent reset links; those links remain valid. |
| AC-27 | Once fewer than 5 accepted requests for an email address fall within the last 60 minutes, a new reset request for that address is accepted again and shows the message from AC-4. |
| AC-28 | Clicking the "Request a new link" button on the expired-link page opens the "Reset password" page. |
| AC-29 | When the UI limit is bypassed and a reset request with an email address longer than 254 characters reaches the server, the server rejects it and the message "Enter a valid email address." is shown; no email is sent. |
| AC-30 | When a new password violates several of the rules in AC-14, AC-15, AC-16, and AC-24 at once, all matching error messages are shown at the same time and the password is not changed. |

## 4. Coverage matrix

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |
|---|---|---|---|---|
| AC-1 | TC-FUN-001 | - | - | - |
| AC-2 | TC-FUN-002 | - | - | - |
| AC-3 | TC-FUN-003 | TC-NEG-001 | - | - |
| AC-4 | TC-FUN-004, TC-FUN-005, TC-FUN-006 | TC-NEG-002, TC-NEG-003 | TC-EDGE-001 | - |
| AC-5 | TC-FUN-007 | TC-NEG-002, TC-NEG-003, TC-NEG-004, TC-NEG-005 | - | - |
| AC-6 | TC-FUN-014, TC-FUN-016, TC-FUN-021 | TC-NEG-006, TC-NEG-008 | TC-EDGE-009, TC-EDGE-011 | - |
| AC-7 | TC-FUN-015, TC-FUN-016, TC-FUN-021 | TC-NEG-006, TC-NEG-007, TC-NEG-008, TC-NEG-037, TC-NEG-046 | TC-EDGE-011, TC-EDGE-012, TC-EDGE-014, TC-EDGE-015 | - |
| AC-8 | TC-FUN-008 | TC-NEG-005, TC-NEG-009, TC-NEG-010, TC-NEG-011 | - | - |
| AC-9 | TC-FUN-009, TC-FUN-010 | TC-NEG-003, TC-NEG-039 | - | - |
| AC-10 | TC-FUN-023 | TC-NEG-014, TC-NEG-045 | - | - |
| AC-11 | TC-FUN-022 | TC-NEG-010, TC-NEG-015, TC-NEG-016 | TC-EDGE-016, TC-EDGE-019 | - |
| AC-12 | TC-FUN-024 | TC-NEG-018 | TC-EDGE-017, TC-EDGE-018, TC-EDGE-020 | - |
| AC-13 | TC-FUN-035 | TC-NEG-020 | - | - |
| AC-14 | TC-FUN-027 | TC-NEG-021, TC-NEG-022, TC-NEG-030, TC-NEG-049 | TC-EDGE-022, TC-EDGE-023, TC-EDGE-024, TC-EDGE-025 | - |
| AC-15 | TC-FUN-028 | TC-NEG-023, TC-NEG-024, TC-NEG-025, TC-NEG-049 | TC-EDGE-026, TC-EDGE-028, TC-EDGE-031 | - |
| AC-16 | TC-FUN-026 | TC-NEG-026, TC-NEG-044 | TC-EDGE-036, TC-EDGE-037 | - |
| AC-17 | TC-FUN-026 | - | - | - |
| AC-18 | TC-FUN-026 | - | - | - |
| AC-19 | TC-FUN-032 | TC-NEG-028 | - | - |
| AC-20 | TC-FUN-033, TC-FUN-034 | TC-NEG-030 | - | - |
| AC-21 | TC-FUN-018 | TC-NEG-001, TC-NEG-011, TC-NEG-031, TC-NEG-032, TC-NEG-033, TC-NEG-035, TC-NEG-036, TC-NEG-038 | - | - |
| AC-22 | TC-FUN-011, TC-FUN-017 | TC-NEG-031, TC-NEG-037, TC-NEG-038, TC-NEG-039 | - | - |
| AC-23 | TC-FUN-012 | TC-NEG-040 | TC-EDGE-001, TC-EDGE-002, TC-EDGE-003 | - |
| AC-24 | TC-FUN-029 | TC-NEG-041, TC-NEG-042 | TC-EDGE-034, TC-EDGE-035 | - |
| AC-25 | TC-FUN-030 | TC-NEG-043, TC-NEG-044 | - | - |
| AC-26 | TC-FUN-019 | TC-NEG-007, TC-NEG-045 | - | - |
| AC-27 | TC-FUN-020, TC-FUN-021 | TC-NEG-046 | TC-EDGE-012, TC-EDGE-013, TC-EDGE-014, TC-EDGE-015 | - |
| AC-28 | TC-FUN-025 | - | - | - |
| AC-29 | TC-FUN-013 | TC-NEG-047 | TC-EDGE-004 | - |
| AC-30 | TC-FUN-031 | TC-NEG-048, TC-NEG-049 | - | - |

## 5. Test cases

### 5.1 Functional

#### TC-FUN-001 - Display the "Forgot password?" link on the login page

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

#### TC-FUN-002 - Open the "Reset password" page from the "Forgot password?" link

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

#### TC-FUN-003 - Submit a reset request from the "Reset password" page

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

#### TC-FUN-004 - Show the confirmation message for an active account

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

#### TC-FUN-005 - Show the same confirmation message for a deactivated account (BR-2)

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

#### TC-FUN-006 - Show the same confirmation message for an unregistered address

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

#### TC-FUN-007 - Show an identical result page for active, deactivated, and unregistered addresses

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

#### TC-FUN-008 - Send the reset email to an active account within 1 minute

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

#### TC-FUN-009 - Send no reset email to a deactivated account (BR-2)

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

#### TC-FUN-010 - Send no reset email to an unregistered address

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

#### TC-FUN-011 - Match an address with surrounding spaces and mixed case to the account (BR-7)

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

#### TC-FUN-012 - Enter and submit a long email address within the 254-character limit (BR-10)

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

#### TC-FUN-013 - Accept a valid-length address on the server when the UI limit is bypassed (BR-10)

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

#### TC-FUN-014 - Accept 5 reset requests for the same address within 60 minutes (BR-4)

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

#### TC-FUN-015 - Show the rate-limit message on the 6th request within 60 minutes (BR-4)

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

#### TC-FUN-016 - Apply the rate limit to an unregistered address (BR-4)

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

#### TC-FUN-017 - Count case and space variants of one address toward the same rate limit (BR-7)

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

#### TC-FUN-018 - Do not count empty and invalid submissions toward the rate limit (BR-8)

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

#### TC-FUN-019 - Keep the latest link valid and send no email after a blocked request (BR-9)

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

#### TC-FUN-020 - Accept a new request after earlier requests leave the 60-minute window

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

#### TC-FUN-021 - Move the rate limit through accepted, blocked, and accepted states in a rolling window

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

#### TC-FUN-022 - Open a valid reset link and see the new password form

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

#### TC-FUN-023 - Invalidate an older reset link when a new link is requested (BR-1)

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

#### TC-FUN-024 - Show the expired-link page for a link opened 75 minutes after sending (BR-3)

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

#### TC-FUN-025 - Open the "Reset password" page from the "Request a new link" button

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

#### TC-FUN-026 - Reset the password with a valid matching new password

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

#### TC-FUN-027 - Accept a new password with a length inside the 8-64 character range (BR-5)

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

#### TC-FUN-028 - Accept a new password with uppercase Latin letters and digits only (BR-5)

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

#### TC-FUN-029 - Accept a new password with special characters and no spaces (BR-5)

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

#### TC-FUN-030 - Accept a new password that differs from the current password (BR-6)

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

#### TC-FUN-031 - Complete the reset after correcting a password with several rule violations (BR-11)

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

#### TC-FUN-032 - Sign out sessions that existed before the reset

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

#### TC-FUN-033 - Log in with the new password after a successful reset

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

#### TC-FUN-034 - Reject the previous password after the password changes to the new one

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

#### TC-FUN-035 - Show the expired-link page when a used link is opened again (BR-3)

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

### 5.2 Negative and security

#### TC-NEG-001 - Reject reset request with an empty email field

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

#### TC-NEG-002 - Show identical response for an unregistered email address

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

#### TC-NEG-003 - Show identical response and send no email for a deactivated account

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

#### TC-NEG-004 - Keep response time independent of account existence

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

#### TC-NEG-005 - Keep response neutral when the email service is unavailable

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

#### TC-NEG-006 - Apply the rate limit to an unregistered address

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

#### TC-NEG-007 - Block excess requests in a burst of 10 requests

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

#### TC-NEG-008 - Enforce the rate limit for concurrent parallel requests

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

#### TC-NEG-009 - Build the reset link from the trusted domain despite a forged Host header

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

#### TC-NEG-010 - Generate unpredictable HTTPS reset links

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

#### TC-NEG-011 - Reject a reset request that carries two email addresses

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

#### TC-NEG-014 - Reject a password submitted from a form opened by a superseded link

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

#### TC-NEG-015 - Deny the password form for a tampered or missing reset token

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

#### TC-NEG-016 - Prevent resetting another user's password with a valid token

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

#### TC-NEG-018 - Reject a password submission after the link expired while the form was open

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

#### TC-NEG-020 - Reject a replayed password submission with a used token

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

#### TC-NEG-021 - Reject a clearly too short new password

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

#### TC-NEG-022 - Reject a clearly too long new password

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

#### TC-NEG-023 - Reject a new password without a digit

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

#### TC-NEG-024 - Reject a new password without a Latin letter

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

#### TC-NEG-025 - Reject a new password whose only letters are non-Latin

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

#### TC-NEG-026 - Reject mismatching new and confirmation passwords

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

#### TC-NEG-028 - Reject a replayed pre-reset session cookie

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

#### TC-NEG-030 - Keep the current password after a failed reset attempt

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

#### TC-NEG-031 - Reject an email address consisting only of spaces

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

#### TC-NEG-032 - Reject an email address without the @ sign

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

#### TC-NEG-033 - Reject email addresses with a missing domain or two @ signs

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

#### TC-NEG-035 - Handle SQL-injection-like text in the email field safely

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

#### TC-NEG-036 - Do not execute script input in the email field

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

#### TC-NEG-037 - Prevent rate limit bypass with case and space variants

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

#### TC-NEG-038 - Reject an email address with a space inside it

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

#### TC-NEG-039 - Send no email for a case variant of a deactivated account address

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

#### TC-NEG-040 - Truncate pasted text far longer than 254 characters

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

#### TC-NEG-041 - Reject a new password with a space in the middle

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

#### TC-NEG-042 - Reject a new password with leading and trailing spaces

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

#### TC-NEG-043 - Reject a new password equal to the current password

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

#### TC-NEG-044 - Skip the current-password check while the confirmation does not match

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

#### TC-NEG-045 - Keep an earlier reset link valid after a blocked request

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

#### TC-NEG-046 - Keep blocking requests while 5 accepted requests remain in the window

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

#### TC-NEG-047 - Reject an overlong email address that bypasses the UI limit

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

#### TC-NEG-048 - Show all violated password rule messages at the same time

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

#### TC-NEG-049 - Show length and composition messages when both password fields are empty

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

### 5.3 Boundary and edge cases

#### TC-EDGE-001 - Accept an email address of exactly 254 characters (maximum)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-23, AC-4 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690/ |

**Preconditions**
- The user is not logged in
- The "Reset password" page is open

**Test data**
- Email (254 characters): `a` repeated 64 times + `@` + `b` repeated 58 times + `.` + `c` repeated 58 times + `.` + `d` repeated 59 times + `.example.com` (local part 64 characters, domain 189 characters, total 254 characters)

**Steps**
1. Type the 254-character email address into the email address field.
2. Check the number of characters held by the field.
3. Click "Send reset link".

**Expected result**
- The field holds all 254 characters; no character is cut off.
- No inline error "Enter a valid email address." is shown.
- The page shows the message "If an account exists for this email, we sent a reset link."

#### TC-EDGE-002 - Stop typing at 254 characters when a 255th character is typed (maximum plus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-23 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690/ |

**Preconditions**
- The user is not logged in
- The "Reset password" page is open

**Test data**
- Typed input (255 characters): `a` repeated 64 times + `@` + `b` repeated 58 times + `.` + `c` repeated 58 times + `.` + `d` repeated 60 times + `.example.com`

**Steps**
1. Type the 255-character input into the email address field character by character.
2. Check the number of characters held by the field.

**Expected result**
- The field holds exactly 254 characters.
- The 255th typed character (the final `m` of `.example.com`) does not appear in the field.

#### TC-EDGE-003 - Truncate a pasted 255-character email address to its first 254 characters

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-23 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690/ |

**Preconditions**
- The user is not logged in
- The "Reset password" page is open

**Test data**
- Clipboard text (255 characters): `a` repeated 64 times + `@` + `b` repeated 58 times + `.` + `c` repeated 58 times + `.` + `d` repeated 60 times + `.example.com`

**Steps**
1. Copy the 255-character text to the clipboard.
2. Paste it into the empty email address field.
3. Check the content and the number of characters held by the field.

**Expected result**
- The field holds exactly 254 characters.
- The field content equals the first 254 characters of the pasted text, ending with `.example.co`.

#### TC-EDGE-004 - Reject a 255-character email address sent to the server with the UI limit bypassed

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-29 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690/ |

**Preconditions**
- The user is not logged in
- The "Reset password" page is open
- The tester can remove the 254-character input limit of the email address field with the browser developer tools
- The test mail server captures all outgoing emails

**Test data**
- Email (255 characters): `a` repeated 64 times + `@` + `b` repeated 58 times + `.` + `c` repeated 58 times + `.` + `d` repeated 60 times + `.example.com` (local part 64 characters, domain 190 characters)

**Steps**
1. Remove the input length limit of the email address field with the browser developer tools.
2. Enter the 255-character email address into the field.
3. Click "Send reset link".
4. Check the test mail server for emails sent to the address.

**Expected result**
- The message "Enter a valid email address." is shown.
- The message "If an account exists for this email, we sent a reset link." is not shown.
- No email is captured by the test mail server.

#### TC-EDGE-009 - Accept a request for a different email address after 5 requests for another address

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-6 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Active accounts exist with emails `anna.test@example.com` and `ben.test@example.com`
- 5 reset requests for `anna.test@example.com` were accepted within the last 10 minutes
- No reset request was made for `ben.test@example.com` in the last 60 minutes
- The user is not logged in

**Test data**
- Email: `ben.test@example.com`

**Steps**
1. Open the "Reset password" page.
2. Submit a reset request for `ben.test@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- The message "Too many requests. Try again later." is not shown.

#### TC-EDGE-011 - Block the 6th reset request within 60 minutes for a deactivated account

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-6, AC-7 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- A deactivated account exists with email `inactive.test@example.com`
- No reset request was made for this address in the last 60 minutes
- The user is not logged in

**Test data**
- Email: `inactive.test@example.com`
- Number of requests: 6 within 10 minutes

**Steps**
1. Submit 5 reset requests for `inactive.test@example.com` on the "Reset password" page.
2. Submit a 6th reset request for the same address.

**Expected result**
- Requests 1 to 5 each show "If an account exists for this email, we sent a reset link."
- The 6th request shows "Too many requests. Try again later."

#### TC-EDGE-012 - Block a request 59 min 59 s after the first of 5 accepted requests

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-7, AC-27 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- 5 reset requests for this address were accepted at T0, T0+1 min, T0+2 min, T0+3 min, and T0+4 min
- The user is not logged in

**Test data**
- Email: `anna.test@example.com`
- Time of the new request: T0 + 59 min 59 s

**Steps**
1. At T0 + 59 min 59 s, open the "Reset password" page.
2. Submit a reset request for `anna.test@example.com`.

**Expected result**
- The page shows "Too many requests. Try again later."

#### TC-EDGE-013 - Accept a request 60 min 01 s after the first of 5 accepted requests

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-27 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- 5 reset requests for this address were accepted at T0, T0+1 min, T0+2 min, T0+3 min, and T0+4 min
- The user is not logged in

**Test data**
- Email: `anna.test@example.com`
- Time of the new request: T0 + 60 min 01 s

**Steps**
1. At T0 + 60 min 01 s, open the "Reset password" page.
2. Submit a reset request for `anna.test@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- The message "Too many requests. Try again later." is not shown.

#### TC-EDGE-014 - Block the next request after one slot of the rolling window was freed and used

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-7, AC-27 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- Reset requests for this address were accepted at T0, T0+1 min, T0+2 min, T0+3 min, T0+4 min, and T0+60 min 01 s

**Test data**
- Email: `anna.test@example.com`
- Time of the new request: T0 + 60 min 30 s (5 accepted requests remain in the last 60 minutes: T0+1 min to T0+4 min and T0+60 min 01 s)

**Steps**
1. At T0 + 60 min 30 s, open the "Reset password" page.
2. Submit a reset request for `anna.test@example.com`.

**Expected result**
- The page shows "Too many requests. Try again later."

#### TC-EDGE-015 - Do not extend the rolling window with blocked requests

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-27, AC-7 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- 5 reset requests for this address were accepted at T0, T0+1 min, T0+2 min, T0+3 min, and T0+4 min
- Blocked requests ("Too many requests. Try again later.") for this address were made at T0+30 min and T0+59 min

**Test data**
- Email: `anna.test@example.com`
- Time of the new request: T0 + 60 min 01 s

**Steps**
1. At T0 + 60 min 01 s, open the "Reset password" page.
2. Submit a reset request for `anna.test@example.com`.

**Expected result**
- The page shows "If an account exists for this email, we sent a reset link."
- The message "Too many requests. Try again later." is not shown.

#### TC-EDGE-016 - Open a reset link 59 min 59 s after it was sent (last valid moment)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-11 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- A reset link was sent to this address at T0; it is the latest link and has not been used

**Test data**
- Link age when opened: 59 min 59 s

**Steps**
1. At T0 + 59 min 59 s, open the reset link from the email.

**Expected result**
- A page with the fields "New password" and "Confirm password" is shown.
- The message "This link has expired. Please request a new one." is not shown.

#### TC-EDGE-017 - Show expired message for a reset link opened exactly 60 min 00 s after sending

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-12 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- A reset link was sent to this address at T0; it is the latest link and has not been used

**Test data**
- Link age when opened: 60 min 00 s

**Steps**
1. At exactly T0 + 60 min 00 s, open the reset link from the email.

**Expected result**
- The page shows "This link has expired. Please request a new one."
- A "Request a new link" button is shown.
- The fields "New password" and "Confirm password" are not shown.

#### TC-EDGE-018 - Show expired message for a reset link opened 60 min 01 s after sending

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-12 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock, or the tester waits for the stated time
- A reset link was sent to this address at T0; it is the latest link and has not been used

**Test data**
- Link age when opened: 60 min 01 s

**Steps**
1. At T0 + 60 min 01 s, open the reset link from the email.

**Expected result**
- The page shows "This link has expired. Please request a new one."
- A "Request a new link" button is shown.
- The fields "New password" and "Confirm password" are not shown.

#### TC-EDGE-019 - Accept a reset link opened after midnight and year end at 59 min 59 s of age

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Low |
| Requirement refs | AC-11 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The test environment allows setting the server clock
- A reset link was sent to this address on 2026-12-31 at 23:30:00 server time; it is the latest link and has not been used

**Test data**
- Link sent: 2026-12-31 23:30:00
- Link opened: 2027-01-01 00:29:59 (link age 59 min 59 s)

**Steps**
1. Set the server clock to 2027-01-01 00:29:59.
2. Open the reset link from the email.

**Expected result**
- A page with the fields "New password" and "Confirm password" is shown.
- The message "This link has expired. Please request a new one." is not shown.

#### TC-EDGE-020 - Expire a reset link across the DST fall-back when the wall clock shows 1 minute elapsed

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Low |
| Requirement refs | AC-12 |
| Technique | Boundary value analysis |
| Source | https://timechange.org/pages/time-change-europe-2026 |

**Preconditions**
- An active account exists with email `anna.test@example.com`
- The server and the test client use the time zone Europe/Berlin
- The test environment allows setting the server clock
- A reset link was sent to this address on 2026-10-25 at 02:30:00 CEST (00:30:00 UTC); it is the latest link and has not been used

**Test data**
- Link sent: 2026-10-25 02:30:00 CEST (00:30:00 UTC)
- Link opened: 2026-10-25 02:31:00 CET (01:31:00 UTC), after clocks returned from 03:00 CEST to 02:00 CET
- Real elapsed time: 61 minutes; wall-clock difference: 1 minute

**Steps**
1. Set the server clock to 2026-10-25 01:31:00 UTC (02:31:00 CET).
2. Open the reset link from the email.

**Expected result**
- The page shows "This link has expired. Please request a new one."
- A "Request a new link" button is shown.
- The fields "New password" and "Confirm password" are not shown.

#### TC-EDGE-022 - Reject a new password of 7 characters (minimum minus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-14 |
| Technique | Boundary value analysis |
| Source | https://pages.nist.gov/800-63-3/sp800-63b.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `Zq7kkkk` (7 characters)
- Confirm password: `Zq7kkkk` (7 characters)

**Steps**
1. Enter `Zq7kkkk` in "New password".
2. Enter `Zq7kkkk` in "Confirm password".
3. Submit the new password form.
4. Log in as `anna.test@example.com` with `OldPassw0rd!`.

**Expected result**
- The message "Password must be 8-64 characters long." is shown.
- No other password error message is shown.
- The login with `OldPassw0rd!` succeeds, so the password was not changed.

#### TC-EDGE-023 - Accept a new password of exactly 8 characters (minimum)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-14 |
| Technique | Boundary value analysis |
| Source | https://pages.nist.gov/800-63-3/sp800-63b.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `Zq7kkkkk` (8 characters)
- Confirm password: `Zq7kkkkk` (8 characters)

**Steps**
1. Enter `Zq7kkkkk` in "New password".
2. Enter `Zq7kkkkk` in "Confirm password".
3. Submit the new password form.
4. Log in as `anna.test@example.com` with `Zq7kkkkk`.

**Expected result**
- The login page shows "Your password has been changed".
- No password error message is shown.
- The login with `Zq7kkkkk` succeeds.

#### TC-EDGE-024 - Accept a new password of exactly 64 characters (maximum)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-14 |
| Technique | Boundary value analysis |
| Source | https://pages.nist.gov/800-63-3/sp800-63b.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password (64 characters): `Zq7` followed by 61 lowercase `k` characters
- Confirm password: the same 64-character value

**Steps**
1. Enter the 64-character password in "New password".
2. Enter the same 64-character password in "Confirm password".
3. Submit the new password form.
4. Log in as `anna.test@example.com` with the 64-character password.

**Expected result**
- Both password fields hold all 64 characters before submission.
- The login page shows "Your password has been changed".
- The login with the full 64-character password succeeds.

#### TC-EDGE-025 - Reject a new password of 65 characters (maximum plus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-14 |
| Technique | Boundary value analysis |
| Source | https://pages.nist.gov/800-63-3/sp800-63b.html |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password (65 characters): `Zq7` followed by 62 lowercase `k` characters
- Confirm password: the same 65-character value

**Steps**
1. Enter the 65-character password in "New password".
2. Enter the same 65-character password in "Confirm password".
3. Submit the new password form.
4. Log in as `anna.test@example.com` with `OldPassw0rd!`.

**Expected result**
- The message "Password must be 8-64 characters long." is shown.
- No other password error message is shown.
- The login with `OldPassw0rd!` succeeds, so the password was not changed.

#### TC-EDGE-026 - Accept a new password with exactly one Latin letter (minimum letter count)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-15 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `q1234567` (8 characters: 1 Latin letter, 7 digits)
- Confirm password: `q1234567`

**Steps**
1. Enter `q1234567` in "New password" and in "Confirm password".
2. Submit the new password form.
3. Log in as `anna.test@example.com` with `q1234567`.

**Expected result**
- The login page shows "Your password has been changed".
- The message "Password must contain at least one letter and one digit." is not shown.
- The login with `q1234567` succeeds.

#### TC-EDGE-028 - Accept a new password with exactly one digit (minimum digit count)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-15 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `qwertyu7` (8 characters: 7 Latin letters, 1 digit)
- Confirm password: `qwertyu7`

**Steps**
1. Enter `qwertyu7` in "New password" and in "Confirm password".
2. Submit the new password form.
3. Log in as `anna.test@example.com` with `qwertyu7`.

**Expected result**
- The login page shows "Your password has been changed".
- The message "Password must contain at least one letter and one digit." is not shown.
- The login with `qwertyu7` succeeds.

#### TC-EDGE-031 - Accept a new password with non-Latin letters plus one Latin letter and digits

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-15 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `Пароль2026z` (11 characters: 6 Cyrillic letters, 4 digits, 1 Latin letter)
- Confirm password: `Пароль2026z`

**Steps**
1. Enter `Пароль2026z` in "New password" and in "Confirm password".
2. Submit the new password form.
3. Log in as `anna.test@example.com` with `Пароль2026z`.

**Expected result**
- The login page shows "Your password has been changed".
- No password error message is shown.
- The login with `Пароль2026z` succeeds.

#### TC-EDGE-034 - Reject a new password with a single leading space

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-24 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: ` Qwerty12` (9 characters: 1 leading space followed by `Qwerty12`)
- Confirm password: ` Qwerty12`

**Steps**
1. Enter ` Qwerty12` in "New password" and in "Confirm password".
2. Submit the new password form.
3. Log in as `anna.test@example.com` with `OldPassw0rd!`.

**Expected result**
- The message "Password must not contain spaces." is shown.
- The leading space is not silently removed and the password `Qwerty12` is not set.
- The login with `OldPassw0rd!` succeeds, so the password was not changed.

#### TC-EDGE-035 - Reject a new password with a single trailing space

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-24 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `Qwerty12 ` (9 characters: `Qwerty12` followed by 1 trailing space)
- Confirm password: `Qwerty12 `

**Steps**
1. Enter `Qwerty12 ` in "New password" and in "Confirm password".
2. Submit the new password form.
3. Log in as `anna.test@example.com` with `OldPassw0rd!`.

**Expected result**
- The message "Password must not contain spaces." is shown.
- The trailing space is not silently removed and the password `Qwerty12` is not set.
- The login with `OldPassw0rd!` succeeds, so the password was not changed.

#### TC-EDGE-036 - Reject a confirmation that differs from the new password only in letter case

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-16 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password: `Qwerty12` (8 characters)
- Confirm password: `qwerty12` (8 characters; differs only in the case of the first letter)

**Steps**
1. Enter `Qwerty12` in "New password".
2. Enter `qwerty12` in "Confirm password".
3. Submit the new password form.
4. Log in as `anna.test@example.com` with `OldPassw0rd!`.

**Expected result**
- The message "Passwords do not match." is shown.
- No other password error message is shown.
- The login with `OldPassw0rd!` succeeds, so the password was not changed.

#### TC-EDGE-037 - Reject a 63-character confirmation of a 64-character new password

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-16 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- An active account exists with email `anna.test@example.com` and current password `OldPassw0rd!`
- A valid reset link (latest, not used, sent less than 60 minutes ago) was opened for this account

**Test data**
- New password (64 characters): `Zq7` followed by 61 lowercase `k` characters
- Confirm password (63 characters): `Zq7` followed by 60 lowercase `k` characters

**Steps**
1. Enter the 64-character password in "New password".
2. Enter the 63-character password in "Confirm password".
3. Submit the new password form.
4. Log in as `anna.test@example.com` with `OldPassw0rd!`.

**Expected result**
- The message "Passwords do not match." is shown.
- The message "Password must be 8-64 characters long." is not shown.
- The login with `OldPassw0rd!` succeeds, so the password was not changed.

### 5.4 Regression

Not applicable for this run - regression analysis was not selected because the change type is new-feature (self-service password reset does not exist today, so no existing feature is changed).

## 6. Assumptions and risks

- The reset flow is available only to users who are not logged in; they start from the login page (A-1).
- The 60-minute validity of a reset link is measured from the moment the reset email was sent (A-2).
- AC-20 (the new password works and the previous password is rejected) is derived from the user story "set a new password" (A-3).
- All test data (names, email addresses, passwords, domains) is fictional; `example.com`, `example.org`, and `example.net` are reserved example domains (A-4).
- Non-Latin letters (for example Cyrillic or accented letters) do not satisfy the letter rule of AC-15 and are treated as other allowed characters; accepted by the user on 2026-09-23 (A-5).
- Only accepted requests count toward the rolling 60-minute limit; blocked requests do not extend the window; accepted by the user on 2026-09-23 (A-6). TC-FUN-021 and TC-EDGE-015 rely on this assumption.
- An email address longer than 254 characters that the server rejects (AC-29) does not count toward the rate limit, like any other invalid address (A-7). TC-NEG-047 relies on this assumption.
- The requirements do not name the submit button of the new password form; the cases use "Save new password". Replace it with the actual label if it differs.
- The requirements do not specify the application URL; the fictional URL `https://notely.example.com/login` is used for the login page.
- The requirements do not specify the reset email subject, sender, or body text; the cases check only that a Notely email with a reset link arrives.
- The requirements do not specify the exact message for a rejected login with the previous password (TC-FUN-034) or the exact screen after a signed-out session action (TC-FUN-032); the cases check the observable outcome (not logged in, login page shown).
- Time-based cases require a test environment with a controllable server clock or waiting in real time; time measurements use a granularity of 1 second, and the given clock times are relative examples.
- Each rate-limit case uses its own fictional email address, or needs a clean 60-minute history for the address, so that requests from one case do not affect another.
- TC-NEG-004 checks timing-based account enumeration as part of AC-5; the requirements define no numeric timing threshold, so the expected result is a qualitative comparison of overlapping response times.
- TC-NEG-005 assumes that AC-5 (identical page for all syntactically valid addresses) also applies when the email service fails; the requirements define no specific error behavior for an email outage.
- TC-NEG-009, TC-NEG-011, TC-NEG-015, and TC-NEG-016 accept either a rejected request or a safe outcome, because the requirements define no specific error message for forged headers, tampered parameters, or invalid tokens; the mandatory outcome is that no account is compromised and no data is disclosed.
- TC-NEG-043 assumes that a rejected submission does not consume the reset link, because AC-13 marks a link as used only after a successful password reset.
- Risk: the requirements check link expiry when the link is opened (AC-11, AC-12); they do not state explicitly what happens when a form opened before the 60-minute mark is submitted after it. TC-NEG-018 expects the submission to be rejected; confirm this behavior with the product owner.
- The behavior of the rate-limit window at exactly 60 min 00 s after an accepted request is not stated in AC-27; TC-EDGE-012 and TC-EDGE-013 therefore use 59 min 59 s and 60 min 01 s. The exact 60 min 00 s moment is tested only for link expiry (TC-EDGE-017), where AC-12 defines "60 minutes or more" as expired.
- TC-EDGE-020 requires a test environment whose server time zone is Europe/Berlin; the requirements do not name the server or user time zone. The case checks that link age is measured in elapsed time, not wall-clock time.
- Whether the password fields limit input to 64 characters is not stated; TC-EDGE-025 assumes a 65-character value can be entered and expects server-side rejection.
- Whether passwords are compared case-sensitively for the AC-25 check is not stated, so no case-only difference from the current password is tested.
- The minimum non-empty length of an email address is not stated, so no minimum boundary pair is designed for it; the empty partition is covered by TC-NEG-001 and TC-NEG-031.
- The 254- and 255-character test addresses keep the local part at 64 characters and every domain label at or below 63 characters (RFC 5321), so the only violated rule in TC-EDGE-002 to TC-EDGE-004 is the total length.
- Some exact boundaries are covered by functional cases instead of separate edge cases: the 5th and 6th request (TC-FUN-014, TC-FUN-015) and the 1-minute delivery time (TC-FUN-008).
- Test case numbering has gaps (for example TC-NEG-012 or TC-EDGE-005) because 20 duplicate cases were removed during test design validation; IDs are never reused or renumbered.

## 7. References

- [Forgot Password - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html) - consistent message and uniform response time for existent and non-existent accounts; rate limiting per account; random, single-use, expiring tokens; no reset URLs built from the Host header; HTTPS reset URLs; invalidation of existing sessions after reset
- [Session Management - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) - server-side invalidation of previous sessions after a password change and re-authentication
- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - email syntax rules, total length limit, dangerous characters, and mandatory server-side checks because client-side validation can be bypassed
- [WSTG v4.2 - Testing for Weak Password Change or Reset Functionalities](https://owasp.github.io/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/04-Authentication_Testing/09-Testing_for_Weak_Password_Change_or_Reset_Functionalities) - reset tokens generated randomly with a secure algorithm that cannot be derived
- [Boundary-value analysis - Wikipedia](https://en.wikipedia.org/wiki/Boundary-value_analysis) - two-value rule: test the boundary value and its closest neighbour in the adjacent partition
- [Equivalence partitioning - Wikipedia](https://en.wikipedia.org/wiki/Equivalence_partitioning) - one representative value per valid and invalid partition
- [Erratum 1690 - RFC 3696](https://errata.rfc-editor.org/eid1690/) - maximum usable email address length of 254 characters
- [RFC 5321 - Simple Mail Transfer Protocol](https://datatracker.ietf.org/doc/html/rfc5321) - local part at most 64 octets, domain at most 255 octets; used to build valid 254- and 255-character test addresses
- [NIST Special Publication 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) - memorized secrets of at least 8 characters; verifiers should permit at least 64 characters
- [Europe Daylight Saving Time 2026 - Dates and Times | TimeChange.org](https://timechange.org/pages/time-change-europe-2026) - Central European DST ends on 2026-10-25 at 03:00 CEST (01:00 UTC), clocks return to 02:00 CET

## 8. Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-23 | Initial draft |
