# Test Suite - Online appointment booking (CareSlot)

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Source issue | [#9 PBI: Book an appointment time slot online](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/9) |
| Revision | 4 |
| Status | Approved |
| Approved at | 2026-09-24 13:55 |
| Generated | 2026-09-24 13:45 |

## 1. Summary

CareSlot is a fictional clinic booking app (web and mobile) that lets registered patients book appointments online: they pick a doctor, a date from tomorrow through 30 days ahead, and a free 15-minute slot within 08:00-16:00 (Europe/Warsaw), then receive a confirmation number and email. The feature also enforces a limit of 3 upcoming appointments per patient, protects against double-booking, and allows cancellation up to 24 hours before the start. The suite combines functional cases for every acceptance criterion, negative and security cases (the feature is security sensitive: authenticated patients, personal data, per-patient ownership), and boundary and equivalence cases (the feature has many numeric and time limits). Regression analysis was not run because the feature is new and no existing area is changed.

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | 2 | 7 | 5 | 0 | 14 |
| Negative | 1 | 8 | 4 | 0 | 13 |
| Security | 3 | 4 | 0 | 0 | 7 |
| Boundary | 0 | 12 | 4 | 0 | 16 |
| Equivalence | 0 | 0 | 1 | 0 | 1 |
| Regression | 0 | 0 | 0 | 0 | 0 |
| **Total** | 6 | 31 | 14 | 0 | 51 |

## 2. Scope

**In scope**
- Date calendar for booking (today+1 through today+30) and slot list in 15-minute increments within 08:00-16:00 Europe/Warsaw (AC-1, AC-2)
- Slot availability: past slots and already booked slots are not offered (AC-3, AC-4)
- Booking confirmation with doctor, date, time and booking number (AC-5)
- Limit of 3 upcoming appointments across all doctors (AC-6)
- Concurrent booking of the same slot (AC-7)
- Cancellation with 24 hours or more remaining and blocked cancellation with less than 24 hours remaining (AC-8, AC-9)
- Confirmation emails after booking and after cancellation (AC-10, AC-11)
- Clinic time zone handling regardless of the patient's device time zone
- Access control and input validation for booking and cancellation requests

**Out of scope**
- Payments and rescheduling (BR-5); a patient changes an appointment by cancelling it and booking a new one
- Patient registration and login (assumption A-1)
- Doctor days off and holidays (not described in the requirements)
- Regression testing of existing features - regression analysis was not selected because the feature is a new capability and no existing area is described as changed
- Negative testing of email delivery (AC-10, AC-11) - no invalid input or failure path is defined
- Rate limiting and brute-force testing - no limits are defined for the booking and cancellation endpoints

## 3. Requirements under test

| ID | Acceptance criterion |
|---|---|
| AC-1 | When a registered patient selects a doctor, the app displays a calendar of selectable dates from tomorrow (today+1) through 30 days ahead (today+30), inclusive on both ends; same-day (today) booking is not offered. |
| AC-2 | For the date the patient selects, the app shows the doctor's free slots as 15-minute increments within the doctor's working hours, 08:00-16:00 in the clinic time zone (Europe/Warsaw). |
| AC-3 | Slots that are in the past relative to the current date and time are not shown as available. |
| AC-4 | Slots that are already booked (by any patient) are not shown as available. |
| AC-5 | When the patient selects one available slot and confirms it, the app shows a booking confirmation containing the doctor, date, time, and a booking number. |
| AC-6 | The app prevents a patient from having more than 3 upcoming appointments in total across all doctors combined; an attempt to book beyond the limit is rejected and the app shows the message "You already have the maximum of 3 upcoming appointments. Cancel one to book a new appointment." |
| AC-7 | When two patients try to book the same slot at the same moment, only the first confirmation succeeds; the second patient sees the message "This slot was just booked. Please choose another one." |
| AC-8 | The patient can cancel an upcoming appointment when 24 hours or more remain before the appointment start; exactly 24 hours remaining is still allowed to cancel. |
| AC-9 | The app prevents cancellation when less than 24 hours remain before the appointment start; the appointment is not cancelled and the app shows the message "This appointment can no longer be cancelled online because it starts in less than 24 hours." |
| AC-10 | After a successful booking, the patient receives a confirmation email. |
| AC-11 | After a successful cancellation, the patient receives a confirmation email. |

## 4. Coverage matrix

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |
|---|---|---|---|---|
| AC-1 | TC-FUN-001 | TC-NEG-001, TC-NEG-002, TC-NEG-003 | TC-EDGE-001, TC-EDGE-002, TC-EDGE-003, TC-EDGE-004, TC-EDGE-017 | - |
| AC-2 | TC-FUN-002, TC-FUN-003 | TC-NEG-003, TC-NEG-004, TC-NEG-005 | TC-EDGE-005, TC-EDGE-006, TC-EDGE-007, TC-EDGE-008, TC-EDGE-009 | - |
| AC-3 | TC-FUN-004 | TC-NEG-006 | - | - |
| AC-4 | TC-FUN-005 | TC-NEG-007, TC-NEG-008 | - | - |
| AC-5 | TC-FUN-006, TC-FUN-014 | TC-NEG-009, TC-NEG-010, TC-NEG-011, TC-NEG-014 | - | - |
| AC-6 | TC-FUN-008, TC-FUN-009 | TC-NEG-012, TC-NEG-013, TC-NEG-014 | TC-EDGE-011 | - |
| AC-7 | TC-FUN-010 | TC-NEG-015 | - | - |
| AC-8 | TC-FUN-011, TC-FUN-014 | TC-NEG-016, TC-NEG-017, TC-NEG-018 | TC-EDGE-014, TC-EDGE-015, TC-EDGE-018, TC-EDGE-019 | - |
| AC-9 | TC-FUN-013 | TC-NEG-018, TC-NEG-019, TC-NEG-020 | TC-EDGE-016, TC-EDGE-020 | - |
| AC-10 | TC-FUN-007 | - | - | - |
| AC-11 | TC-FUN-012 | - | - | - |

## 5. Test cases

### 5.1 Functional

#### TC-FUN-001 - Show calendar of selectable dates from tomorrow through 30 days ahead (BR-1)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` (piotr.nowak@example.com) is registered and logged in to CareSlot
- Today is 2026-10-05 (example; use the real current date and shift all dates accordingly)
- Doctor `Dr. Anna Kowalska` exists and has working hours 08:00-16:00 (Europe/Warsaw)

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Today: 2026-10-05
- Example in-window dates: 2026-10-06, 2026-10-12, 2026-11-04

**Steps**
1. Open the "Book an appointment" page.
2. Select the doctor `Dr. Anna Kowalska`.
3. Look at the displayed date calendar.
4. Try to select today (2026-10-05).
5. Select the in-window date 2026-10-12.

**Expected result**
- The calendar shows selectable dates starting from tomorrow (2026-10-06) through 30 days ahead (2026-11-04), including 2026-10-12.
- Today (2026-10-05) is not offered as a selectable date.
- Selecting 2026-10-12 opens the slot list for that date.

#### TC-FUN-002 - Show free slots in 15-minute increments within doctor working hours (BR-2)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- `Dr. Anna Kowalska` has no booked appointments on 2026-10-12
- Today is 2026-10-05

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-12

**Steps**
1. Open the "Book an appointment" page and select `Dr. Anna Kowalska`.
2. Select the date 2026-10-12.
3. Review the list of slots shown.

**Expected result**
- The slots are listed as 15-minute increments (for example 08:15, 08:30, 08:45, ... 15:30, 15:45).
- Every displayed slot lies within the doctor's working hours 08:00-16:00.
- No slot appears at an interval other than 15 minutes (for example 09:10 is not offered).

#### TC-FUN-003 - Show slot times in clinic time zone when the patient device uses another time zone

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- The patient's device time zone is set to America/New_York (not Europe/Warsaw)
- `Dr. Anna Kowalska` has no booked appointments on 2026-10-12

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-12
- Device time zone: America/New_York

**Steps**
1. Open the "Book an appointment" page and select `Dr. Anna Kowalska`.
2. Select the date 2026-10-12.
3. Review the slot times shown.

**Expected result**
- The slot times are displayed in the clinic time zone Europe/Warsaw and fall within 08:00-16:00.
- No slot is shifted by the device's time zone offset (for example no slots in the range 02:00-10:00 are shown).

#### TC-FUN-004 - Hide slots that are already in the past

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- Test environment allows setting the system clock
- Clock is set to 2026-10-05 22:00 Europe/Warsaw, and the slot list for 2026-10-06 with `Dr. Anna Kowalska` is already open (same-day dates are not selectable in the calendar, so the date becomes "today" while the page is open)
- `Dr. Anna Kowalska` has no booked appointments on 2026-10-06

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-06
- New clock value: 2026-10-06 10:07 Europe/Warsaw

**Steps**
1. Advance the system clock to 2026-10-06 10:07 Europe/Warsaw.
2. Refresh the slot list for `Dr. Anna Kowalska` on 2026-10-06.
3. Review the list of slots shown.

**Expected result**
- Slots earlier than 10:07 (for example 08:15, 09:00, 10:00) are not shown as available.
- Slots later than 10:07 (for example 10:30, 11:00) are shown as available.

#### TC-FUN-005 - Hide slots already booked by another patient

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- Another patient, `Marta Zielinska` (marta.zielinska@example.com), has a booked appointment with `Dr. Anna Kowalska` on 2026-10-12 at 09:30
- Today is 2026-10-05

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-12
- Booked slot: 09:30
- Neighbouring free slots: 09:15 and 09:45

**Steps**
1. Open the "Book an appointment" page and select `Dr. Anna Kowalska`.
2. Select the date 2026-10-12.
3. Look for the 09:30 slot in the list.

**Expected result**
- The 09:30 slot is not shown as available.
- The neighbouring slots 09:15 and 09:45 are shown as available.

#### TC-FUN-006 - Book a free slot and see the booking confirmation

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-5 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` (piotr.nowak@example.com) is logged in and has no upcoming appointments
- `Dr. Anna Kowalska` has slot 10:00 free on 2026-10-12
- Today is 2026-10-05

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-12
- Slot: 10:00

**Steps**
1. Open the "Book an appointment" page and select `Dr. Anna Kowalska`.
2. Select the date 2026-10-12.
3. Select the slot 10:00.
4. Confirm the booking.

**Expected result**
- A booking confirmation is shown containing the doctor `Dr. Anna Kowalska`, the date 2026-10-12, the time 10:00 and a booking number.
- The appointment appears among the patient's upcoming appointments.
- No payment step is requested (BR-5).
- The 10:00 slot is no longer shown as available for `Dr. Anna Kowalska` on 2026-10-12.

#### TC-FUN-007 - Send confirmation email after a successful booking

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-10 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in with email `piotr.nowak@example.com` and can read that mailbox
- `Dr. Anna Kowalska` has slot 10:00 free on 2026-10-12

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-12
- Slot: 10:00
- Email: `piotr.nowak@example.com`

**Steps**
1. Book the 10:00 slot with `Dr. Anna Kowalska` on 2026-10-12 and confirm the booking.
2. Note the booking number shown on screen.
3. Open the mailbox `piotr.nowak@example.com`.

**Expected result**
- A booking confirmation email is received in the mailbox.
- The email contains the same doctor, date, time and booking number as shown on screen (A-2).

#### TC-FUN-008 - Reject a fourth upcoming appointment counted across all doctors (BR-3)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- The patient has 3 upcoming appointments: `Dr. Anna Kowalska` on 2026-10-12 at 10:00, `Dr. Anna Kowalska` on 2026-10-13 at 11:00, and `Dr. Jan Lewandowski` on 2026-10-14 at 09:00
- `Dr. Tomasz Wisniewski` has slot 13:00 free on 2026-10-15

**Test data**
- New booking attempt: `Dr. Tomasz Wisniewski`, 2026-10-15, 13:00

**Steps**
1. Open the "Book an appointment" page and select `Dr. Tomasz Wisniewski`.
2. Select the date 2026-10-15 and the slot 13:00.
3. Confirm the booking.

**Expected result**
- The booking is rejected.
- The app shows the message "You already have the maximum of 3 upcoming appointments. Cancel one to book a new appointment."
- No new appointment is added; the patient still has exactly 3 upcoming appointments.
- The 13:00 slot with `Dr. Tomasz Wisniewski` remains available for other patients.

#### TC-FUN-009 - Book a new appointment after cancelling one at the 3-appointment limit (BR-3)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-6 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- The patient has 3 upcoming appointments starting well more than 24 hours from now: `Dr. Anna Kowalska` on 2026-10-12 at 10:00, `Dr. Anna Kowalska` on 2026-10-13 at 11:00, and `Dr. Jan Lewandowski` on 2026-10-14 at 09:00
- `Dr. Tomasz Wisniewski` has slot 13:00 free on 2026-10-15
- Today is 2026-10-05

**Test data**
- Appointment to cancel: `Dr. Jan Lewandowski`, 2026-10-14, 09:00
- New booking: `Dr. Tomasz Wisniewski`, 2026-10-15, 13:00

**Steps**
1. Open the patient's upcoming appointments and cancel the appointment with `Dr. Jan Lewandowski` on 2026-10-14 at 09:00.
2. Open the "Book an appointment" page and select `Dr. Tomasz Wisniewski`.
3. Select the date 2026-10-15 and the slot 13:00.
4. Confirm the booking.

**Expected result**
- The cancellation succeeds and the patient has 2 upcoming appointments.
- The new booking is accepted and a booking confirmation with `Dr. Tomasz Wisniewski`, 2026-10-15, 13:00 and a booking number is shown.
- The message about the maximum of 3 upcoming appointments is not shown.
- The patient has 3 upcoming appointments again.

#### TC-FUN-010 - Accept only the first of two simultaneous bookings of the same slot

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Critical |
| Requirement refs | AC-7 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patients `Piotr Nowak` and `Marta Zielinska` are logged in on two separate devices, each with fewer than 3 upcoming appointments
- `Dr. Anna Kowalska` has slot 11:15 free on 2026-10-12
- Both patients have selected the 11:15 slot on 2026-10-12 and are on the confirmation step

**Test data**
- Doctor: `Dr. Anna Kowalska`
- Date: 2026-10-12
- Slot: 11:15

**Steps**
1. On the first device, confirm the booking as `Piotr Nowak`.
2. On the second device, confirm the booking as `Marta Zielinska` immediately afterwards.

**Expected result**
- `Piotr Nowak` sees the booking confirmation with `Dr. Anna Kowalska`, 2026-10-12, 11:15 and a booking number.
- `Marta Zielinska` sees the message "This slot was just booked. Please choose another one."
- The 11:15 slot is booked only for `Piotr Nowak`; `Marta Zielinska` has no appointment for that slot.

#### TC-FUN-011 - Cancel an upcoming appointment more than 24 hours before its start (BR-4)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | State transition |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- The patient has an upcoming appointment with `Dr. Anna Kowalska` on 2026-10-12 at 10:00
- Current date and time is 2026-10-05 12:00 Europe/Warsaw (about 7 days before the start)

**Test data**
- Appointment: `Dr. Anna Kowalska`, 2026-10-12, 10:00
- Appointment state before: upcoming (booked)

**Steps**
1. Open the patient's upcoming appointments.
2. Select the appointment with `Dr. Anna Kowalska` on 2026-10-12 at 10:00.
3. Choose to cancel the appointment and confirm the cancellation.

**Expected result**
- The cancellation succeeds and the app shows that the appointment is cancelled.
- The appointment is no longer listed among the patient's upcoming appointments.
- The 10:00 slot with `Dr. Anna Kowalska` on 2026-10-12 is shown as available again for other patients (A-3).

#### TC-FUN-012 - Send confirmation email after a successful cancellation

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-11 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in with email `piotr.nowak@example.com` and can read that mailbox
- The patient has an upcoming appointment with `Dr. Anna Kowalska` on 2026-10-12 at 10:00 and booking number known
- Current date and time is 2026-10-05 12:00 Europe/Warsaw

**Test data**
- Appointment: `Dr. Anna Kowalska`, 2026-10-12, 10:00
- Email: `piotr.nowak@example.com`

**Steps**
1. Cancel the appointment with `Dr. Anna Kowalska` on 2026-10-12 at 10:00 and confirm the cancellation.
2. Open the mailbox `piotr.nowak@example.com`.

**Expected result**
- A cancellation confirmation email is received in the mailbox.
- The email contains the same doctor, date, time and booking number as the cancelled appointment (A-2).

#### TC-FUN-013 - Block cancellation when less than 24 hours remain before the start (BR-4)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Happy path |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- The patient has an upcoming appointment with `Dr. Anna Kowalska` on 2026-10-06 at 09:00, booked on 2026-10-05
- Current date and time is 2026-10-05 12:00 Europe/Warsaw (21 hours before the start)

**Test data**
- Appointment: `Dr. Anna Kowalska`, 2026-10-06, 09:00
- Time remaining: 21 hours

**Steps**
1. Open the patient's upcoming appointments.
2. Select the appointment with `Dr. Anna Kowalska` on 2026-10-06 at 09:00.
3. Try to cancel the appointment.

**Expected result**
- The appointment is not cancelled.
- The app shows the message "This appointment can no longer be cancelled online because it starts in less than 24 hours."
- The appointment remains in the patient's upcoming appointments and the 09:00 slot stays unavailable to other patients.
- No cancellation confirmation email is sent.

#### TC-FUN-014 - Change an appointment by cancelling it and booking a new one (BR-5)

| Field | Value |
|---|---|
| Type | Functional |
| Priority | Medium |
| Requirement refs | AC-5, AC-8 |
| Technique | Alternative flow |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `Piotr Nowak` is logged in
- The patient has one upcoming appointment with `Dr. Anna Kowalska` on 2026-10-12 at 10:00
- `Dr. Anna Kowalska` has slot 14:00 free on 2026-10-13
- Current date and time is 2026-10-05 12:00 Europe/Warsaw

**Test data**
- Old appointment: `Dr. Anna Kowalska`, 2026-10-12, 10:00
- New appointment: `Dr. Anna Kowalska`, 2026-10-13, 14:00

**Steps**
1. Open the patient's upcoming appointments and look at the options for the appointment on 2026-10-12 at 10:00.
2. Cancel that appointment and confirm the cancellation.
3. Open the "Book an appointment" page, select `Dr. Anna Kowalska`, the date 2026-10-13 and the slot 14:00.
4. Confirm the booking.

**Expected result**
- The appointment offers no "Reschedule" option; changing it is done only by cancelling (BR-5).
- The old appointment is cancelled and the slot 10:00 on 2026-10-12 is available again.
- The new booking is confirmed with `Dr. Anna Kowalska`, 2026-10-13, 14:00 and a new booking number.
- The patient has exactly 1 upcoming appointment (the new one).

### 5.2 Negative and security

#### TC-NEG-001 - Reject booking request with a date far outside the bookable window

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

#### TC-NEG-002 - Reject booking request with a malformed date value

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

#### TC-NEG-003 - Reject injection strings in doctor and date parameters

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

#### TC-NEG-004 - Reject booking request for a time outside working hours

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

#### TC-NEG-005 - Reject booking request for a time that is not a 15-minute increment

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

#### TC-NEG-006 - Reject booking request for a slot in the past

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

#### TC-NEG-007 - Reject booking of a slot that was booked after the slot list was loaded

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

#### TC-NEG-008 - Do not disclose who booked an unavailable slot

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

#### TC-NEG-009 - Reject confirmation when no slot is selected

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

#### TC-NEG-010 - Reject booking confirmation after the session has expired

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

#### TC-NEG-011 - Deny access to another patient's booking confirmation

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

#### TC-NEG-012 - Reject fourth booking sent directly to the server for a different doctor

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

#### TC-NEG-013 - Enforce the 3-appointment limit under concurrent booking requests

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

#### TC-NEG-014 - Ignore a patient identifier tampered in the booking request

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

#### TC-NEG-015 - Create only one appointment when the confirm request is submitted twice

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

#### TC-NEG-016 - Reject cancellation of an appointment that is already cancelled

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

#### TC-NEG-017 - Deny cancellation of another patient's appointment

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

#### TC-NEG-018 - Deny cancellation request without a valid session

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

#### TC-NEG-019 - Reject a direct cancel request when less than 24 hours remain

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

#### TC-NEG-020 - Evaluate the 24-hour cancellation rule in clinic time zone regardless of device time zone

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

### 5.3 Boundary and edge cases

#### TC-EDGE-001 - Offer today+1 as the first bookable date (minimum date)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Doctor "Dr. Jan Nowak" has working hours on every day
- Current clinic date (Europe/Warsaw) is 2026-09-24

**Test data**
- Doctor: Dr. Jan Nowak
- Expected first selectable date: 2026-09-25 (today+1)

**Steps**
1. Open the booking flow.
2. Select doctor "Dr. Jan Nowak".
3. Look at the calendar of selectable dates.

**Expected result**
- The date 2026-09-25 is selectable.
- 2026-09-25 is the earliest selectable date in the calendar.

#### TC-EDGE-002 - Do not offer today as a bookable date (minimum minus one day)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Current clinic date (Europe/Warsaw) is 2026-09-24 and the current time is 07:00

**Test data**
- Doctor: Dr. Jan Nowak
- Tested date: 2026-09-24 (today, today+0)

**Steps**
1. Open the booking flow.
2. Select doctor "Dr. Jan Nowak".
3. Try to select the date 2026-09-24 in the calendar.

**Expected result**
- The date 2026-09-24 is not selectable.
- No same-day slots are shown for any date selection.

#### TC-EDGE-003 - Offer today+30 as the last bookable date (maximum date)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Current clinic date (Europe/Warsaw) is 2026-09-24

**Test data**
- Doctor: Dr. Jan Nowak
- Tested date: 2026-10-24 (today+30)

**Steps**
1. Open the booking flow.
2. Select doctor "Dr. Jan Nowak".
3. Select the date 2026-10-24 in the calendar.

**Expected result**
- The date 2026-10-24 is selectable.
- 2026-10-24 is the latest selectable date in the calendar.
- The doctor's free slots for 2026-10-24 are displayed.

#### TC-EDGE-004 - Do not offer today+31 as a bookable date (maximum plus one day)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-1 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Current clinic date (Europe/Warsaw) is 2026-09-24

**Test data**
- Doctor: Dr. Jan Nowak
- Tested date: 2026-10-25 (today+31)

**Steps**
1. Open the booking flow.
2. Select doctor "Dr. Jan Nowak".
3. Try to select the date 2026-10-25 in the calendar.

**Expected result**
- The date 2026-10-25 is not selectable.
- No slots are shown for 2026-10-25.

#### TC-EDGE-005 - Offer the 08:00 slot as the first slot of the day (minimum start time)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Doctor "Dr. Jan Nowak" has no booked slots on 2026-09-30

**Test data**
- Doctor: Dr. Jan Nowak
- Date: 2026-09-30
- Tested slot start time: 08:00 (Europe/Warsaw)

**Steps**
1. Open the booking flow and select doctor "Dr. Jan Nowak".
2. Select the date 2026-09-30.
3. Look at the first entry in the list of free slots.

**Expected result**
- The 08:00 slot is displayed as available.
- 08:00 is the earliest slot in the list.

#### TC-EDGE-006 - Do not offer a 07:45 slot before working hours (minimum minus one step)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Doctor "Dr. Jan Nowak" has no booked slots on 2026-09-30

**Test data**
- Doctor: Dr. Jan Nowak
- Date: 2026-09-30
- Tested slot start time: 07:45 (15 minutes before 08:00)

**Steps**
1. Open the booking flow and select doctor "Dr. Jan Nowak".
2. Select the date 2026-09-30.
3. Search the list of free slots for a 07:45 entry.

**Expected result**
- No 07:45 slot is displayed.
- No slot earlier than 08:00 is displayed.

#### TC-EDGE-007 - Offer the 15:45 slot as the last slot of the day (maximum start time)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Doctor "Dr. Jan Nowak" has no booked slots on 2026-09-30

**Test data**
- Doctor: Dr. Jan Nowak
- Date: 2026-09-30
- Tested slot: 15:45-16:00 (15 minutes, ends exactly at the end of working hours)

**Steps**
1. Open the booking flow and select doctor "Dr. Jan Nowak".
2. Select the date 2026-09-30.
3. Look at the last entry in the list of free slots.

**Expected result**
- The 15:45 slot is displayed as available.
- 15:45 is the latest slot in the list.

#### TC-EDGE-008 - Do not offer a 16:00 slot after working hours (maximum plus one step)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Doctor "Dr. Jan Nowak" has no booked slots on 2026-09-30

**Test data**
- Doctor: Dr. Jan Nowak
- Date: 2026-09-30
- Tested slot start time: 16:00 (would end at 16:15, outside working hours)

**Steps**
1. Open the booking flow and select doctor "Dr. Jan Nowak".
2. Select the date 2026-09-30.
3. Search the list of free slots for a 16:00 entry.

**Expected result**
- No 16:00 slot is displayed.
- No slot starting at or after 16:00 is displayed.

#### TC-EDGE-009 - Show slots only on 15-minute steps (partition: off-grid time 08:10)

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | https://www.geeksforgeeks.org/software-engineering/equivalence-partitioning-method/ |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- Doctor "Dr. Jan Nowak" has no booked slots on 2026-09-30

**Test data**
- Doctor: Dr. Jan Nowak
- Date: 2026-09-30
- Valid partition representative: 08:15 (minute value 15)
- Invalid partition representative: 08:10 (minute value not in 00, 15, 30, 45)

**Steps**
1. Open the booking flow and select doctor "Dr. Jan Nowak".
2. Select the date 2026-09-30.
3. Check the list of free slots for the 08:15 entry.
4. Check the list of free slots for an 08:10 entry.

**Expected result**
- The 08:15 slot is displayed as available.
- No 08:10 slot is displayed.
- Consecutive slots in the list start exactly 15 minutes apart.

#### TC-EDGE-011 - Accept the 3rd upcoming appointment when the patient has 2 (at the limit)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-6 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has exactly 2 upcoming appointments
- Doctor "Dr. Jan Nowak" has the slot 2026-10-02 10:00 free

**Test data**
- Upcoming appointments before booking: 2
- Slot: 2026-10-02 10:00 with Dr. Jan Nowak

**Steps**
1. Open the booking flow and select doctor "Dr. Jan Nowak".
2. Select the date 2026-10-02 and the 10:00 slot.
3. Confirm the booking.

**Expected result**
- A booking confirmation with doctor, date, time, and a booking number is displayed.
- The patient has 3 upcoming appointments.
- No limit message is displayed.

#### TC-EDGE-014 - Allow cancellation with 24 hours 1 minute remaining (limit plus one step)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has an upcoming appointment on 2026-10-07 at 10:00 (Europe/Warsaw)
- The system clock is set to 2026-10-06 09:59 (Europe/Warsaw)

**Test data**
- Appointment start: 2026-10-07 10:00
- Time remaining: 24 hours 1 minute

**Steps**
1. Open the list of upcoming appointments.
2. Select the appointment of 2026-10-07 10:00.
3. Click "Cancel appointment" and confirm.

**Expected result**
- The appointment is cancelled and no longer appears in the list of upcoming appointments.
- No cancellation restriction message is displayed.

#### TC-EDGE-015 - Allow cancellation with exactly 24 hours remaining (limit)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has an upcoming appointment on 2026-10-07 at 10:00 (Europe/Warsaw)
- The system clock is set to 2026-10-06 10:00:00 (Europe/Warsaw)

**Test data**
- Appointment start: 2026-10-07 10:00
- Time remaining: exactly 24 hours 0 minutes 0 seconds

**Steps**
1. Open the list of upcoming appointments.
2. Select the appointment of 2026-10-07 10:00.
3. Click "Cancel appointment" and confirm.

**Expected result**
- The appointment is cancelled and no longer appears in the list of upcoming appointments.
- No cancellation restriction message is displayed.

#### TC-EDGE-016 - Reject cancellation with 23 hours 59 minutes remaining (limit minus one step)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has an upcoming appointment on 2026-10-07 at 10:00 (Europe/Warsaw)
- The system clock is set to 2026-10-06 10:01 (Europe/Warsaw)

**Test data**
- Appointment start: 2026-10-07 10:00
- Time remaining: 23 hours 59 minutes

**Steps**
1. Open the list of upcoming appointments.
2. Select the appointment of 2026-10-07 10:00.
3. Click "Cancel appointment" and confirm.

**Expected result**
- The appointment is not cancelled and still appears in the list of upcoming appointments.
- The message "This appointment can no longer be cancelled online because it starts in less than 24 hours." is displayed.

#### TC-EDGE-017 - Start the calendar at the clinic's today+1 when the device date is already ahead

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-1 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The system clock is 2026-09-24 23:30 in Europe/Warsaw (just before midnight)
- The patient's device time zone is Pacific/Auckland, where the local date is already 2026-09-25

**Test data**
- Clinic date: 2026-09-24 (Europe/Warsaw)
- Device date: 2026-09-25 (Pacific/Auckland)
- Doctor: Dr. Jan Nowak

**Steps**
1. Open the booking flow on the device.
2. Select doctor "Dr. Jan Nowak".
3. Look at the earliest selectable date in the calendar.

**Expected result**
- The earliest selectable date is 2026-09-25 (clinic today+1), not 2026-09-26.
- The date 2026-09-24 is not selectable.

#### TC-EDGE-018 - Evaluate the 24-hour cancellation limit in clinic time when the device time zone differs

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-8 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has an upcoming appointment on 2026-10-10 at 10:00 (Europe/Warsaw)
- The system clock is 2026-10-09 10:00:00 Europe/Warsaw, which is 01:00:00 on the device in America/Los_Angeles
- The patient's device time zone is America/Los_Angeles

**Test data**
- Appointment start: 2026-10-10 10:00 Europe/Warsaw (2026-10-10 01:00 on the device)
- Time remaining: exactly 24 hours

**Steps**
1. Open the list of upcoming appointments on the device.
2. Select the appointment of 2026-10-10.
3. Click "Cancel appointment" and confirm.

**Expected result**
- The appointment time is displayed as 10:00 (Europe/Warsaw).
- The appointment is cancelled and no longer appears in the list of upcoming appointments.

#### TC-EDGE-019 - Allow cancellation at exactly 24 real hours across the October 2026 clock change

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-8 |
| Technique | Boundary value analysis |
| Source | https://kidsinthecity.pl/time-change-in-poland/ |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has an upcoming appointment on Sunday 2026-10-25 at 09:00 CET (UTC+1), after the clock change at 03:00 CEST
- The system clock is set to 2026-10-24 10:00:00 CEST (UTC+2), which is exactly 24 hours of elapsed time before the start (23 wall-clock hours on the clinic clock)

**Test data**
- Appointment start: 2026-10-25 09:00 CET (2026-10-25 08:00 UTC)
- Cancellation moment: 2026-10-24 10:00:00 CEST (2026-10-24 08:00 UTC)
- Elapsed time remaining: exactly 24 hours

**Steps**
1. Open the list of upcoming appointments.
2. Select the appointment of 2026-10-25 09:00.
3. Click "Cancel appointment" and confirm.

**Expected result**
- The appointment is cancelled and no longer appears in the list of upcoming appointments.
- No cancellation restriction message is displayed.

#### TC-EDGE-020 - Reject cancellation 1 minute after the 24-hour limit across the October 2026 clock change

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-9 |
| Technique | Boundary value analysis |
| Source | https://kidsinthecity.pl/time-change-in-poland/ |

**Preconditions**
- Patient `anna.kowalska.test@example.com` is registered and logged in
- The patient has an upcoming appointment on Sunday 2026-10-25 at 09:00 CET (UTC+1), after the clock change at 03:00 CEST
- The system clock is set to 2026-10-24 10:01 CEST (UTC+2), which is 23 hours 59 minutes of elapsed time before the start

**Test data**
- Appointment start: 2026-10-25 09:00 CET (2026-10-25 08:00 UTC)
- Cancellation moment: 2026-10-24 10:01 CEST (2026-10-24 08:01 UTC)
- Elapsed time remaining: 23 hours 59 minutes

**Steps**
1. Open the list of upcoming appointments.
2. Select the appointment of 2026-10-25 09:00.
3. Click "Cancel appointment" and confirm.

**Expected result**
- The appointment is not cancelled and still appears in the list of upcoming appointments.
- The message "This appointment can no longer be cancelled online because it starts in less than 24 hours." is displayed.

### 5.4 Regression

Not applicable for this run - regression analysis was not selected because the feature is a new capability and no existing area is described as changed.

## 6. Assumptions and risks

- The patient is already registered and authenticated before starting the booking flow; registration and login are out of scope.
- The booking and cancellation confirmation emails contain the same appointment details shown on screen (doctor, date, time, booking number).
- Cancelling an appointment immediately releases the slot so it becomes bookable by other patients.
- The doctor's working hours (08:00-16:00) apply on every bookable day; doctor days off and holidays are not described, so no cases cover them.
- All dates in the cases use 2026-10-05 or 2026-09-24 as an example "today"; the tester shifts them relative to the real current date so that dates stay within the bookable window.
- The requirements do not define the wording of the booking confirmation, the cancellation success message, or the booking number format; expected results describe the observable outcome without exact wording. The same applies to the stale-slot booking message and validation errors on tampered requests.
- The requirements do not name a specific UI path for cancelling; the cases use the patient's "upcoming appointments" list as a generic entry point.
- Several cases (TC-FUN-004, TC-EDGE-014 to TC-EDGE-020) need a test environment where the system clock can be set. TC-FUN-004 also needs a slot list left open across the date change, because same-day dates are not selectable.
- A 15-minute slot must end within working hours, so the last slot starts at 15:45 and a 16:00 slot is out of range; the requirements do not state this explicitly.
- The 24-hour limit is measured as elapsed real time between the cancellation moment and the appointment start, including across a daylight saving time change, and to the minute or finer.
- TC-EDGE-019 and TC-EDGE-020 rely on data seeded directly (an appointment 31 days ahead), because 2026-10-25 is outside the 30-day booking window on the run date.
- Both a "not found" and a "forbidden" response are treated as safe for access-control cases (TC-NEG-011, TC-NEG-014, TC-NEG-017), provided no data of another patient is disclosed.
- Rate limiting and brute-force cases are not included because no limits are defined for the booking and cancellation endpoints; this can be raised as a clarification.
- Email delivery is assumed to be visible in a test mailbox within a reasonable time; delivery failure paths are not defined.
- No boundary case exists for AC-3 (past slots): today is not bookable, so a past slot cannot appear on a selectable date; AC-3 is covered by TC-FUN-004 and TC-NEG-006.
- Test case numbers TC-EDGE-010, TC-EDGE-012 and TC-EDGE-013 are intentionally absent; they were removed as duplicates of TC-FUN-006 and TC-FUN-008.
- BR-5 has no acceptance criterion of its own; it is exercised by TC-FUN-006 (no payment step) and TC-FUN-014 (no rescheduling).

## 7. References

- [Insecure Direct Object Reference Prevention - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) - verify permission on every access; test with two accounts that one user cannot read or change another user's objects
- [Business Logic Security - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html) - server-side enforcement of business rules, identity taken from the session, atomic operations, concurrent-request tests, invalid state transitions
- [Input Validation - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) - server-side validation of dates and structured fields, rejection of tampered values and injection strings
- [ISTQB guide: Decision Tables, Equivalence Partitioning, Boundary Value Analysis](https://www.istqb.guru/decision-tables-equivalence-partitioning-boundary-value-analysis/) - two-value boundary value rule and one representative per partition
- [Equivalence Partitioning Method - GeeksforGeeks](https://www.geeksforgeeks.org/software-engineering/equivalence-partitioning-method/) - valid and invalid partitions, one representative per partition
- [Time change in Poland: last Sunday in March and October](https://kidsinthecity.pl/time-change-in-poland/) - daylight saving time ends in Poland on Sunday 25 October 2026 (clocks go back from 03:00 to 02:00)

## 8. Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-24 | Initial draft |
| 2 | 2026-09-24 | Fixed suite gate findings: S2 |
| 3 | 2026-09-24 | Addressed F-1: priority of TC-FUN-010 and TC-NEG-015 (double booking of the same slot, AC-7) raised to Critical; summary totals recomputed |
| 4 | 2026-09-24 | Addressed F-1: TC-FUN-010 and TC-NEG-015 are Critical; TC-NEG-007 (AC-4, stale slot list) and TC-NEG-013 (AC-6, two different slots) stay High because they do not check double booking of the same slot under AC-7; totals confirmed (51 cases) |
| 4 | 2026-09-24 | Addressed F-2: no new test case added; the requested positive scenario (patient with 3 upcoming appointments cancels one, then books a new slot successfully) is already covered by the existing TC-FUN-009 (AC-6) |
