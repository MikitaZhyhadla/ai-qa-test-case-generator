# Negative and Security Test Cases

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | negative-test-planner |
| Revision | 2 |
| Generated | 2026-09-24 13:31 |

## Scope
This artifact covers invalid input, forbidden states, failure paths, and security behavior of the CareSlot online booking and cancellation flow (AC-1 to AC-9). Cases focus on requests that bypass the UI, tampered parameters, stale data, repeated or concurrent submissions, expired sessions, and access to another patient's data. It deliberately does not cover exact boundary values (owned by `edge-case-planner`), the normal messages defined by the acceptance criteria (owned by `functional-test-planner`), or email delivery (AC-10 and AC-11 have no negative testing).

## Research sources
- [Insecure Direct Object Reference Prevention - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) - verify permission on every access, test with two accounts that user A cannot read or change user B's objects by changing identifiers
- [Business Logic Security - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html) - server-side enforcement of business rules, identity taken from the session only, atomic operations and concurrent-request tests, rejecting invalid state transitions
- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - server-side syntactic and range validation of dates and structured fields, rejection of tampered values and injection strings

## Test cases

### TC-NEG-001 - Reject booking request with a date far outside the bookable window

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- Patient has 0 upcoming appointments
- An API client or browser developer tools can send the booking request directly

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 90 days
- Time: `10:00`

**Steps**
1. Select `Dr. Test Nowak` in the app and capture the booking request.
2. Replay the booking request with the date changed to today + 90 days, bypassing the calendar.

**Expected result**
- The server rejects the request with a validation error; no appointment is created.
- The patient's list of upcoming appointments is unchanged.
- The response does not contain a stack trace or internal error details.

### TC-NEG-002 - Reject booking request with a malformed date value

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-1 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- An API client or browser developer tools can send the booking request directly

**Test data**
- Doctor: `Dr. Test Nowak`
- Date values tried one by one: empty string, `abc`, `2026-13-45`, `31/12/2026`

**Steps**
1. Capture a valid slot-list request for `Dr. Test Nowak`.
2. Replay the request with the date set to the first invalid value from the test data.
3. Repeat step 2 for each remaining invalid value.

**Expected result**
- Each request is rejected with a validation error; no slots are returned and no appointment is created.
- The response does not contain a stack trace or internal error details.

### TC-NEG-003 - Reject injection strings in doctor and date parameters

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-1, AC-2 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- An API client or browser developer tools can send the slot-list request directly

**Test data**
- Doctor parameter: `' OR '1'='1`
- Date parameter: `<script>alert(1)</script>`

**Steps**
1. Capture a valid slot-list request for a doctor and a bookable date.
2. Replay the request with the doctor parameter set to `' OR '1'='1`.
3. Replay the request with the date parameter set to `<script>alert(1)</script>`.

**Expected result**
- Both requests are rejected with a generic validation error; no slots and no other doctors' data are returned.
- No script is executed and the submitted value is not rendered unescaped in the page.
- The response does not contain a database error, stack trace, or internal path.

### TC-NEG-004 - Reject booking request for a time outside working hours

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- Patient has 0 upcoming appointments
- An API client or browser developer tools can send the booking request directly

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 5 days
- Time: `03:00` (Europe/Warsaw), clearly outside 08:00-16:00

**Steps**
1. Capture a valid booking request for `Dr. Test Nowak`.
2. Replay the request with the time changed to `03:00`.

**Expected result**
- The server rejects the request with a validation error; no appointment is created.
- The patient's list of upcoming appointments is unchanged.
- The slot list for that date still shows no slot at `03:00`.

### TC-NEG-005 - Reject booking request for a time that is not a 15-minute increment

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- Patient has 0 upcoming appointments
- An API client or browser developer tools can send the booking request directly

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 5 days
- Time: `09:07` (Europe/Warsaw), not on the 15-minute grid

**Steps**
1. Capture a valid booking request for `Dr. Test Nowak`.
2. Replay the request with the time changed to `09:07`.

**Expected result**
- The server rejects the request with a validation error; no appointment is created.
- The patient's list of upcoming appointments is unchanged.

### TC-NEG-006 - Reject booking request for a slot in the past

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- Patient has 0 upcoming appointments
- An API client or browser developer tools can send the booking request directly

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: yesterday
- Time: `10:00` (Europe/Warsaw)

**Steps**
1. Capture a valid booking request for `Dr. Test Nowak`.
2. Replay the request with the date changed to yesterday and the time set to `10:00`.

**Expected result**
- The server rejects the request with a validation error; no appointment is created.
- The patient's list of upcoming appointments is unchanged.
- The past slot is not shown as available in the slot list.

### TC-NEG-007 - Reject booking of a slot that was booked after the slot list was loaded

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- Patients `anna.test@example.com` and `jan.test@example.com` are registered, each with 0 upcoming appointments
- Anna has the slot list of `Dr. Test Nowak` for today + 5 days open, showing slot `10:00` as available
- Jan then books slot `10:00` for the same doctor and date, and his booking is confirmed

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 5 days
- Slot: `10:00`

**Steps**
1. As Anna, without refreshing the slot list, select slot `10:00`.
2. Confirm the booking.

**Expected result**
- The booking is rejected and Anna sees a message that the slot cannot be booked and that she should choose another one (the exact text is not defined for this case).
- No appointment is created for Anna; slot `10:00` remains booked by Jan only.
- After the slot list is refreshed, slot `10:00` is not shown as available.

### TC-NEG-008 - Do not disclose who booked an unavailable slot

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html |

**Preconditions**
- Patients `anna.test@example.com` and `jan.test@example.com` are registered
- Jan has a booked appointment with `Dr. Test Nowak` on today + 5 days at `10:00`
- Anna is logged in

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 5 days
- Slot: `10:00` (booked by Jan)

**Steps**
1. As Anna, open the slot list of `Dr. Test Nowak` for today + 5 days.
2. Inspect the slot list response in the browser developer tools or API client.

**Expected result**
- Slot `10:00` is not shown as available.
- The response contains no name, email, patient ID, or booking number of Jan or of any other patient.

### TC-NEG-009 - Reject confirmation when no slot is selected

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-5 |
| Technique | Input validation |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.test@example.com` is registered and logged in
- Patient has 0 upcoming appointments
- `Dr. Test Nowak` and a bookable date are selected, but no slot is selected

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 5 days
- Slot: none (empty value in the API request)

**Steps**
1. Try to confirm the booking in the UI without selecting a slot.
2. Send the booking request directly with an empty slot value.

**Expected result**
- The confirm action is unavailable or shows a validation message asking the patient to select a slot; the direct request is rejected with a validation error.
- No appointment is created and no booking number is issued.

### TC-NEG-010 - Reject booking confirmation after the session has expired

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-5 |
| Technique | State transition |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in and has selected doctor `Dr. Test Nowak`, date today + 5 days, and slot `10:00`
- The session is then invalidated (logged out in another tab or expired by the server)
- Patient has 0 upcoming appointments

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 5 days
- Slot: `10:00`

**Steps**
1. Invalidate the patient's session in a second browser tab.
2. In the first tab, click the confirm button for slot `10:00`.

**Expected result**
- The booking is rejected and the patient is asked to log in again.
- No appointment is created and slot `10:00` remains available to other patients.
- No confirmation is shown and no booking number is issued.

### TC-NEG-011 - Deny access to another patient's booking confirmation

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-5 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html |

**Preconditions**
- Patients `anna.test@example.com` and `jan.test@example.com` are registered
- Jan has a confirmed booking with a known booking number
- Anna is logged in

**Test data**
- Jan's booking number: the number shown on Jan's confirmation
- A non-existent booking number: `CS-0000000`

**Steps**
1. As Anna, request the booking details page or API endpoint using Jan's booking number.
2. As Anna, request the same endpoint using the non-existent booking number `CS-0000000`.

**Expected result**
- Both requests are denied with the same response (for example "not found"); no doctor, date, time, or patient data of Jan is returned.
- The response for Jan's booking number cannot be distinguished from the response for a non-existent number.

### TC-NEG-012 - Reject fourth booking sent directly to the server for a different doctor

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in and has 3 upcoming appointments: 2 with `Dr. Test Nowak` and 1 with `Dr. Test Kowalska`
- A slot with a third doctor `Dr. Test Wisniewski` is free
- An API client can send the booking request directly

**Test data**
- Doctor: `Dr. Test Wisniewski`
- Date: today + 10 days
- Slot: `11:15`

**Steps**
1. Capture a booking request, or build one manually, for `Dr. Test Wisniewski` on today + 10 days at `11:15`.
2. Send the request directly to the server, bypassing the UI check.

**Expected result**
- The server rejects the request and no appointment is created.
- Anna still has exactly 3 upcoming appointments.
- Slot `11:15` with `Dr. Test Wisniewski` remains available to other patients.

### TC-NEG-013 - Enforce the 3-appointment limit under concurrent booking requests

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in and has exactly 2 upcoming appointments
- Two different free slots exist (`Dr. Test Nowak` at `09:00` and `Dr. Test Kowalska` at `09:30`, both on today + 12 days)
- A tool that can send two requests in parallel is available

**Test data**
- Request A: `Dr. Test Nowak`, today + 12 days, `09:00`
- Request B: `Dr. Test Kowalska`, today + 12 days, `09:30`

**Steps**
1. Prepare both booking requests with Anna's valid session.
2. Send request A and request B at the same moment.
3. Open Anna's list of upcoming appointments.

**Expected result**
- Exactly one of the two requests succeeds; the other is rejected with the message "You already have the maximum of 3 upcoming appointments. Cancel one to book a new appointment."
- Anna has exactly 3 upcoming appointments, never 4.
- The slot of the rejected request remains available to other patients.

### TC-NEG-014 - Ignore a patient identifier tampered in the booking request

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-5, AC-6 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patients `anna.test@example.com` (0 upcoming appointments) and `jan.test@example.com` (3 upcoming appointments) are registered
- Anna is logged in
- An API client or browser developer tools can send the booking request directly

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 6 days
- Slot: `12:00`
- Tampered field: patient ID or email in the request body set to Jan's identifier

**Steps**
1. As Anna, capture a valid booking request for slot `12:00`.
2. Replay the request with the patient identifier in the body changed to Jan's identifier.
3. Open the upcoming appointments of Anna and of Jan.

**Expected result**
- The server takes the identity from Anna's session only: either the request is rejected, or the appointment is created for Anna, never for Jan.
- Jan's list of upcoming appointments is unchanged and Jan does not receive a confirmation.
- No data of Jan is disclosed in the response.

### TC-NEG-015 - Create only one appointment when the confirm request is submitted twice

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Critical |
| Requirement refs | AC-7 |
| Technique | Error guessing |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in and has 0 upcoming appointments
- Slot `10:30` with `Dr. Test Nowak` on today + 7 days is selected and ready to confirm

**Test data**
- Doctor: `Dr. Test Nowak`
- Date: today + 7 days
- Slot: `10:30`

**Steps**
1. Double-click the confirm button quickly, or send the same confirm request twice in parallel.
2. Open Anna's list of upcoming appointments.

**Expected result**
- Exactly one appointment and one booking number exist for slot `10:30`.
- The duplicate request is rejected or ignored and does not create a second appointment or consume the patient's appointment limit twice.
- Anna has exactly 1 upcoming appointment.

### TC-NEG-016 - Reject cancellation of an appointment that is already cancelled

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium |
| Requirement refs | AC-8 |
| Technique | State transition |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in
- Anna cancelled her appointment on today + 8 days more than 24 hours before its start; the appointment is in the state cancelled
- Another patient `jan.test@example.com` has since booked the released slot

**Test data**
- Booking number: the number of Anna's cancelled appointment

**Steps**
1. Send the cancel request for the cancelled booking number again (replay the earlier request).
2. Open the list of upcoming appointments of Anna and of Jan.

**Expected result**
- The repeated request is rejected; no state changes.
- Jan's new appointment for the same slot is not cancelled or changed.
- Anna's list of upcoming appointments does not contain the cancelled appointment.

### TC-NEG-017 - Deny cancellation of another patient's appointment

| Field | Value |
|---|---|
| Type | Security |
| Priority | Critical |
| Requirement refs | AC-8 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html |

**Preconditions**
- Patients `anna.test@example.com` and `jan.test@example.com` are registered
- Jan has an upcoming appointment more than 48 hours in the future, with a known booking number
- Anna is logged in

**Test data**
- Jan's booking number: the number shown on Jan's confirmation

**Steps**
1. As Anna, send the cancel request using Jan's booking number.
2. Log in as Jan and open the list of upcoming appointments.

**Expected result**
- The request is denied (for example "not found" or "forbidden"); Jan's appointment is not cancelled.
- The response contains no details of Jan's appointment.
- Jan's slot stays booked and Jan receives no cancellation email.

### TC-NEG-018 - Deny cancellation request without a valid session

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-8, AC-9 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` has an upcoming appointment more than 48 hours in the future
- No user is logged in (no session cookie or token is sent)

**Test data**
- Booking number: the number of Anna's appointment

**Steps**
1. Send the cancel request with Anna's booking number and no session cookie or token.
2. Log in as Anna and open the list of upcoming appointments.

**Expected result**
- The request is rejected as unauthenticated (login required); no state changes.
- Anna's appointment is still listed as upcoming and the slot stays booked.
- The response contains no appointment details.

### TC-NEG-019 - Reject a direct cancel request when less than 24 hours remain

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Input validation |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in
- Anna has an appointment that starts in about 10 hours (Europe/Warsaw)
- An API client can send the cancel request directly, bypassing the hidden or disabled cancel button

**Test data**
- Booking number: the number of Anna's appointment starting in about 10 hours

**Steps**
1. Send the cancel request for the booking number directly to the server.
2. Open Anna's list of upcoming appointments.

**Expected result**
- The server rejects the request with the message "This appointment can no longer be cancelled online because it starts in less than 24 hours."
- The appointment is not cancelled and stays in the upcoming list.
- The slot is not released and no cancellation email is sent.

### TC-NEG-020 - Evaluate the 24-hour cancellation rule in clinic time zone regardless of device time zone

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Error guessing |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html |

**Preconditions**
- Patient `anna.test@example.com` is logged in
- Anna has an appointment that starts in about 20 hours (Europe/Warsaw)
- Anna's device time zone is set to `Pacific/Kiritimati` (UTC+14) or the device clock is moved forward or back so that the local time suggests more than 24 hours remain

**Test data**
- Device time zone: `Pacific/Kiritimati`
- Booking number: the number of the appointment starting in about 20 hours

**Steps**
1. Change the device time zone to `Pacific/Kiritimati`.
2. Open the upcoming appointments and try to cancel the appointment.
3. Send the cancel request directly with a client-supplied timestamp that is 30 hours before the appointment start, if the API accepts one.

**Expected result**
- The cancellation is rejected with the message "This appointment can no longer be cancelled online because it starts in less than 24 hours."
- The appointment start is shown in Europe/Warsaw time and is not shifted by the device time zone.
- Client-supplied time values are ignored; the appointment is not cancelled.

## Notes and assumptions
- The exact error text for stale-slot booking (TC-NEG-007) and for validation errors on tampered requests is not defined in the requirements; expected results describe the observable behavior (rejection, no state change, no internal details) instead of exact wording.
- For TC-NEG-011, TC-NEG-014, and TC-NEG-017, both a "not found" and a "forbidden" response are treated as safe, provided no data of another patient is disclosed.
- Rate limiting and brute-force cases are not included because the requirements define no limits for the booking and cancellation endpoints; they should be raised as a clarification if needed.
- Doctor days off and holidays are not defined (A-4), so no negative case is designed for them.
- Test appointments in the Test data use dates relative to the day of execution.
- Revision 2: TC-NEG-015 (duplicate confirm request for the same slot, AC-7) priority raised from High to Critical per review feedback F-1; ID, steps, and expected result unchanged.
- Revision 2: TC-NEG-007 (stale slot list, AC-4) kept at High: it is a sequential check of the AC-4 rule that a booked slot is not offered or bookable, not the simultaneous-booking behavior of AC-7. TC-NEG-013 (concurrent requests for the appointment limit, AC-6) kept at High: the two requests target two different slots, so it does not check double booking of the same slot.
