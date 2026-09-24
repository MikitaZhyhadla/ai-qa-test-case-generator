# Functional Test Cases

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | functional-test-planner |
| Revision | 2 |
| Generated | 2026-09-24 13:30 |

## Scope
Positive behavior of online appointment booking and cancellation in CareSlot: date calendar, slot list, slot availability, booking confirmation, the 3-appointment limit, concurrent booking of one slot, cancellation with 24 hours or more remaining, the blocked cancellation with less than 24 hours remaining, and both confirmation emails. It deliberately does not cover invalid input and security checks (negative-test-planner) or exact limits such as the first/last bookable date, the 08:00 and 16:00 slot edges, the 3rd/4th booking attempt and exactly 24 hours before the start (edge-case-planner). Payments and rescheduling are out of scope (BR-5).

## Research sources
- None - derived from requirements

## Test cases

### TC-FUN-001 - Show calendar of selectable dates from tomorrow through 30 days ahead (BR-1)

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

### TC-FUN-002 - Show free slots in 15-minute increments within doctor working hours (BR-2)

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

### TC-FUN-003 - Show slot times in clinic time zone when the patient device uses another time zone

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

### TC-FUN-004 - Hide slots that are already in the past

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

### TC-FUN-005 - Hide slots already booked by another patient

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

### TC-FUN-006 - Book a free slot and see the booking confirmation

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

### TC-FUN-007 - Send confirmation email after a successful booking

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

### TC-FUN-008 - Reject a fourth upcoming appointment counted across all doctors (BR-3)

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

### TC-FUN-009 - Book a new appointment after cancelling one at the 3-appointment limit (BR-3)

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

### TC-FUN-010 - Accept only the first of two simultaneous bookings of the same slot

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

### TC-FUN-011 - Cancel an upcoming appointment more than 24 hours before its start (BR-4)

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

### TC-FUN-012 - Send confirmation email after a successful cancellation

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

### TC-FUN-013 - Block cancellation when less than 24 hours remain before the start (BR-4)

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

### TC-FUN-014 - Change an appointment by cancelling it and booking a new one (BR-5)

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

## Notes and assumptions
- The requirements do not define the wording of the booking confirmation, the cancellation success message, or the booking number format; expected results describe the observable outcome (confirmation with doctor, date, time and booking number) without exact wording.
- The requirements do not name a specific UI path for cancelling (menu, button label); the cases refer to the patient's "upcoming appointments" list as a generic entry point.
- All dates assume "today" is 2026-10-05 as an example; the tester shifts them relative to the real current date so that all dates stay within the bookable window.
- AC-3 cannot be checked with the calendar alone because same-day booking is not offered (AC-1); TC-FUN-004 assumes a test environment with a settable clock and a slot list left open across the date change.
- Whether a slot at exactly 16:00 or 08:00 is offered is not tested here; the working-hours edges belong to edge-case-planner.
- TC-FUN-008 uses a patient who already has 3 upcoming appointments, which is inherent to AC-6; the limit-boundary variants (3rd accepted, 4th rejected) are left to edge-case-planner and negative-test-planner.
- BR-5 has no acceptance criterion of its own; it is exercised by TC-FUN-006 (no payment step) and TC-FUN-014 (no rescheduling), referencing AC-5 and AC-8.
- Email delivery is assumed to be visible in a test mailbox within a reasonable time; delivery failure paths are not defined in the PBI (AC-10, AC-11).
- Assumption A-4 (working hours apply on every bookable day, no days off) is used for the chosen dates.
- Revision 2: F-1 - priority of TC-FUN-010 (AC-7, double booking of the same slot) raised from High to Critical; ID, steps and expected result unchanged. No other case in this artifact checks double booking of the same slot (TC-FUN-005 only checks that an already booked slot is hidden, TC-FUN-006 and TC-FUN-014 book a free slot without a competing patient), so no further priority change was needed.
- Revision 2: F-2 - no new case added; TC-FUN-009 (AC-6, BR-3) already fully satisfies the requested positive case. It starts with a patient who has exactly 3 upcoming appointments (across two doctors), cancels one of them (more than 24 hours before the start, so the cancellation succeeds), then books a new slot with a third doctor; the expected result is that the booking is accepted with a confirmation, the "maximum of 3 upcoming appointments" message is not shown, and the patient again has 3 upcoming appointments. A further case such as "a fourth booking is rejected again after the new booking" would be a duplicate of TC-FUN-008 and tests the exact limit (Nth attempt), which belongs to edge-case-planner; a case "the freed slot is booked by another patient" would have a different intent and would exceed the 2-case budget for AC-8 and AC-5. Adding TC-FUN-015 would therefore only duplicate TC-FUN-009 (gate G4).
