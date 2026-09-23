# Boundary and Edge Case Test Cases

| Field | Value |
|---|---|
| Run ID | issue-7-20260923-2249 |
| Owner | edge-case-planner |
| Revision | 2 |
| Generated | 2026-09-23 23:25 |

## Scope
This artifact covers boundary value analysis and equivalence partitioning for the Notely password reset flow: email address length, the 5-requests-per-rolling-60-minutes rate limit (rolling window timing and address partitions), the 60-minute reset link validity (including midnight, year-end, and daylight saving time transitions), and the new password rules (length 8-64, minimum letter and digit counts, non-Latin letters, spaces, and confirmation match). Boundaries and partitions that are already tested with the same intent by functional or negative cases (5th and 6th request, email normalization, 1-minute delivery, zero letters or digits, Cyrillic-only letters, uppercase and special-character passwords, difference from the current password, combined violations, spaces-only email) are kept as removed entries and are covered by the referenced cases. It deliberately does not cover the main happy path, UI navigation (AC-1, AC-2, AC-17, AC-18, AC-28), session sign-out (AC-19), link supersession and single use (AC-10, AC-13), or general negative and security scenarios, which belong to the functional and negative planners.

## Research sources
- [Boundary-value analysis - Wikipedia](https://en.wikipedia.org/wiki/Boundary-value_analysis) - two-value rule: test the boundary value and its closest neighbour in the adjacent partition, using the smallest increment of the data type
- [Equivalence partitioning - Wikipedia](https://en.wikipedia.org/wiki/Equivalence_partitioning) - one representative value per valid and invalid partition is sufficient
- [Erratum 1690 - RFC 3696](https://errata.rfc-editor.org/eid1690/) - the maximum usable email address length is 254 characters (forward-path limit minus the enclosing angle brackets)
- [RFC 5321 - Simple Mail Transfer Protocol](https://datatracker.ietf.org/doc/html/rfc5321) - local part at most 64 octets, domain at most 255 octets; used to build syntactically valid 254- and 255-character test addresses
- [NIST Special Publication 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) - memorized secrets at least 8 characters; verifiers should permit at least 64 characters
- [Europe Daylight Saving Time 2026 - Dates and Times | TimeChange.org](https://timechange.org/pages/time-change-europe-2026) - Central European DST ends on Sunday 2026-10-25 at 03:00 CEST (01:00 UTC), clocks return to 02:00 CET

## Test cases

### TC-EDGE-001 - Accept an email address of exactly 254 characters (maximum)

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

### TC-EDGE-002 - Stop typing at 254 characters when a 255th character is typed (maximum plus one)

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

### TC-EDGE-003 - Truncate a pasted 255-character email address to its first 254 characters

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

### TC-EDGE-004 - Reject a 255-character email address sent to the server with the UI limit bypassed

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

### TC-EDGE-005 - Reject an email address of only spaces (0 characters after trimming)

Removed: duplicate of TC-NEG-031 (same spaces-only email partition, same steps and expected result).

### TC-EDGE-006 - Count case and space variants of one email address toward the same rate limit

Removed: duplicate of TC-FUN-017 (same normalization partition for the rate limit: case and space variants of one address, 6th request blocked).

### TC-EDGE-007 - Accept the 5th reset request within 60 minutes (maximum)

Removed: duplicate of TC-FUN-014 (same boundary value: 5th request within 60 minutes is accepted).

### TC-EDGE-008 - Block the 6th reset request within 60 minutes (maximum plus one)

Removed: duplicate of TC-FUN-015 (same boundary value: 6th request after exactly 5 accepted requests is blocked).

### TC-EDGE-009 - Accept a request for a different email address after 5 requests for another address

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

### TC-EDGE-010 - Block the 6th reset request within 60 minutes for an unregistered email address

Removed: duplicate of TC-FUN-016 (same partition: rate limit on an unregistered address, requests 1-5 accepted, 6th blocked).

### TC-EDGE-011 - Block the 6th reset request within 60 minutes for a deactivated account

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

### TC-EDGE-012 - Block a request 59 min 59 s after the first of 5 accepted requests

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

### TC-EDGE-013 - Accept a request 60 min 01 s after the first of 5 accepted requests

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

### TC-EDGE-014 - Block the next request after one slot of the rolling window was freed and used

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

### TC-EDGE-015 - Do not extend the rolling window with blocked requests

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

### TC-EDGE-016 - Open a reset link 59 min 59 s after it was sent (last valid moment)

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

### TC-EDGE-017 - Show expired message for a reset link opened exactly 60 min 00 s after sending

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

### TC-EDGE-018 - Show expired message for a reset link opened 60 min 01 s after sending

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

### TC-EDGE-019 - Accept a reset link opened after midnight and year end at 59 min 59 s of age

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

### TC-EDGE-020 - Expire a reset link across the DST fall-back when the wall clock shows 1 minute elapsed

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

### TC-EDGE-021 - Deliver the reset email no later than 60 seconds after submission (maximum)

Removed: duplicate of TC-FUN-008 (same check: the reset email for an active account is sent within 1 minute of the submission).

### TC-EDGE-022 - Reject a new password of 7 characters (minimum minus one)

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

### TC-EDGE-023 - Accept a new password of exactly 8 characters (minimum)

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

### TC-EDGE-024 - Accept a new password of exactly 64 characters (maximum)

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

### TC-EDGE-025 - Reject a new password of 65 characters (maximum plus one)

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

### TC-EDGE-026 - Accept a new password with exactly one Latin letter (minimum letter count)

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

### TC-EDGE-027 - Reject a new password with zero Latin letters (minimum letter count minus one)

Removed: duplicate of TC-NEG-024 (same invalid partition: password with digits only and no Latin letter).

### TC-EDGE-028 - Accept a new password with exactly one digit (minimum digit count)

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

### TC-EDGE-029 - Reject a new password with zero digits (minimum digit count minus one)

Removed: duplicate of TC-NEG-023 (same invalid partition: password with Latin letters only and no digit).

### TC-EDGE-030 - Reject a new password whose only letters are non-Latin (Cyrillic)

Removed: duplicate of TC-NEG-025 (same invalid partition: letters are Cyrillic only, no Latin letter).

### TC-EDGE-031 - Accept a new password with non-Latin letters plus one Latin letter and digits

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

### TC-EDGE-032 - Accept a new password with only uppercase Latin letters and digits

Removed: duplicate of TC-FUN-028 (same valid partition: uppercase Latin letters plus digits are accepted).

### TC-EDGE-033 - Accept a new password containing special characters

Removed: duplicate of TC-FUN-029 (same valid partition: special characters without spaces are accepted).

### TC-EDGE-034 - Reject a new password with a single leading space

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

### TC-EDGE-035 - Reject a new password with a single trailing space

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

### TC-EDGE-036 - Reject a confirmation that differs from the new password only in letter case

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

### TC-EDGE-037 - Reject a 63-character confirmation of a 64-character new password

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

### TC-EDGE-038 - Accept a new password that differs from the current password by one character

Removed: duplicate of TC-FUN-030 (same valid partition: new password differs from the current password in the last character).

### TC-EDGE-039 - Show all four password rule messages when every rule is violated at once

Removed: duplicate of TC-NEG-048 (same partition: all four password rules violated at once, all messages shown).

## Notes and assumptions
- Boundary inventory: Email address length - maximum 254 characters in the UI field and on the server; empty (0 characters, also after trimming) is invalid; no non-empty minimum length is stated - AC-21, AC-23, AC-29, BR-10
- Boundary inventory: Email address normalization - leading and trailing spaces removed, letter case ignored for matching and rate limiting - AC-22, BR-7
- Boundary inventory: Reset request count per email address - 1 to 5 accepted requests per rolling 60 minutes; the 6th is blocked - AC-6, AC-7, BR-4
- Boundary inventory: Rate limit window - rolling 60 minutes counted from each accepted request; blocked requests do not extend it - AC-27, AC-7, A-6
- Boundary inventory: Address state for rate limiting - partitions active account, deactivated account, no account; limit is per email address - AC-6, BR-4
- Boundary inventory: Reset link age - valid from 0 to less than 60 minutes after sending; expired at 60 minutes or more - AC-11, AC-12, BR-3
- Boundary inventory: Reset email delivery time - at most 1 minute (60 seconds) after submission - AC-8
- Boundary inventory: New password length - 8 to 64 characters inclusive - AC-14, BR-5
- Boundary inventory: Latin letter count in the new password - at least 1 - AC-15, BR-5
- Boundary inventory: Digit count in the new password - at least 1 - AC-15, BR-5
- Boundary inventory: Letter character set - only Latin A-Z and a-z satisfy the letter rule; non-Latin letters are other allowed characters - AC-15, A-5
- Boundary inventory: Allowed password characters - any character except space; special characters allowed - AC-24, BR-5
- Boundary inventory: Confirmation match - "Confirm password" must equal "New password" exactly - AC-16, BR-5
- Boundary inventory: Difference from the current password - new password must not equal the current password - AC-25, BR-6
- Boundary inventory: Combined password rule violations - all violated rule messages shown at once - AC-30, BR-11
- The minimum non-empty length of an email address is not stated in the requirements, so no "minimum" and "minimum minus one" pair is designed for it; the empty partition (spaces only, 0 characters after trimming) is covered by TC-NEG-031.
- The 254- and 255-character test addresses keep the local part at 64 characters and every domain label at or below 63 characters (RFC 5321), so the only violated rule in TC-EDGE-002 to TC-EDGE-004 is the total length.
- Assumption: the behaviour of the rate-limit window at exactly 60 min 00 s after an accepted request is not stated in AC-27; TC-EDGE-012 and TC-EDGE-013 therefore use 59 min 59 s and 60 min 01 s. The exact moment 60 min 00 s is tested only for link expiry (TC-EDGE-017), where AC-12 defines "60 minutes or more" as expired.
- Assumption: time measurements use a granularity of 1 second; time-based cases require a controllable server clock or waiting in real time.
- Assumption: TC-EDGE-020 requires a test environment whose server time zone is Europe/Berlin; the requirements do not name the server or user time zone, so no separate user-versus-server time zone case is designed. The case checks that link age is measured in elapsed time and not in wall-clock time.
- 29 February is not relevant: no requirement uses a period longer than 60 minutes; date rollover is covered by the midnight and year-end case TC-EDGE-019.
- Assumption: expiry is checked when the link is opened (AC-11, AC-12); the behaviour when a link opened before the 60-minute mark is submitted after it is not stated, so it is not tested.
- Whether the password fields limit input to 64 characters is not stated; TC-EDGE-025 assumes a 65-character value can be entered and expects server-side rejection.
- Other whitespace characters such as tabs are not covered by AC-24 (which names spaces only) and are not tested; a space in the middle of the password is left to the negative planner.
- Whether passwords are compared case-sensitively for the AC-25 check is not stated, so no case-only difference from the current password is tested.
- The minimum-minus-one step for the request count (0 requests) and for the letter and digit counts below 0 is impossible and is skipped.
- Coverage of inventory parameters whose edge cases were removed as duplicates in revision 2: email normalization - TC-FUN-017, TC-NEG-031; request count 5th and 6th - TC-FUN-014, TC-FUN-015; no-account partition - TC-FUN-016; delivery time - TC-FUN-008; zero letters and zero digits (minimum minus one) - TC-NEG-024, TC-NEG-023; Cyrillic-only letters - TC-NEG-025; uppercase letters and special characters - TC-FUN-028, TC-FUN-029; difference from the current password - TC-FUN-030; combined violations - TC-NEG-048. The remaining edge cases TC-EDGE-026 and TC-EDGE-028 keep the minimum letter and digit count boundaries.
- A 61-second delivery (maximum plus one) is not designed for the delivery time, because the tester cannot force a late delivery through the product; the maximum is checked by TC-FUN-008.
- Revision 2: TC-EDGE-005 removed as duplicate of TC-NEG-031 (gate G4).
- Revision 2: TC-EDGE-006 removed as duplicate of TC-FUN-017 (gate G4).
- Revision 2: TC-EDGE-007 removed as duplicate of TC-FUN-014 (gate G4).
- Revision 2: TC-EDGE-008 removed as duplicate of TC-FUN-015 (gate G4).
- Revision 2: TC-EDGE-010 removed as duplicate of TC-FUN-016 (gate G4).
- Revision 2: TC-EDGE-021 removed as duplicate of TC-FUN-008 (gate G4).
- Revision 2: TC-EDGE-027 removed as duplicate of TC-NEG-024 (gate G4).
- Revision 2: TC-EDGE-029 removed as duplicate of TC-NEG-023 (gate G4).
- Revision 2: TC-EDGE-030 removed as duplicate of TC-NEG-025 (gate G4).
- Revision 2: TC-EDGE-032 removed as duplicate of TC-FUN-028 (gate G4).
- Revision 2: TC-EDGE-033 removed as duplicate of TC-FUN-029 (gate G4).
- Revision 2: TC-EDGE-038 removed as duplicate of TC-FUN-030 (gate G4).
- Revision 2: TC-EDGE-039 removed as duplicate of TC-NEG-048 (gate G4).
- Revision 2: Scope updated to list the removed boundaries and partitions; the empty-email note now points to TC-NEG-031; added the coverage note for removed inventory parameters.
