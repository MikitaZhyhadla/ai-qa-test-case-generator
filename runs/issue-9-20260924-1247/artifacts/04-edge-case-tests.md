# Boundary and Edge Case Test Cases

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | edge-case-planner |
| Revision | 2 |
| Generated | 2026-09-24 13:25 |

## Scope
This artifact covers boundary value analysis and equivalence partitioning for the CareSlot booking feature: the bookable date window, working-hours and slot-granularity limits, the 3-appointment limit, the 24-hour cancellation cutoff, and clinic time zone evaluation including the daylight saving time change. It does not cover happy-path flows, general invalid input, or security checks, which belong to the functional and negative planners. Email content (AC-10, AC-11) and slot availability by other patients (AC-4, AC-7) have no numeric limits and are not covered here.

## Research sources
- [ISTQB guide: Decision Tables, Equivalence Partitioning, Boundary Value Analysis](https://www.istqb.guru/decision-tables-equivalence-partitioning-boundary-value-analysis/) - two-value BVA rule (the boundary value and the value immediately outside it) and one representative per partition
- [Equivalence Partitioning Method - GeeksforGeeks](https://www.geeksforgeeks.org/software-engineering/equivalence-partitioning-method/) - valid and invalid partitions, one representative per partition (search result summary only)
- [Time change in Poland: last Sunday in March and October](https://kidsinthecity.pl/time-change-in-poland/) - DST ends in Poland on Sunday 25 October 2026: at 03:00 the clocks are turned back 1 hour to 02:00 (opened with WebFetch)

## Test cases

### TC-EDGE-001 - Offer today+1 as the first bookable date (minimum date)

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

### TC-EDGE-002 - Do not offer today as a bookable date (minimum minus one day)

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

### TC-EDGE-003 - Offer today+30 as the last bookable date (maximum date)

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

### TC-EDGE-004 - Do not offer today+31 as a bookable date (maximum plus one day)

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

### TC-EDGE-005 - Offer the 08:00 slot as the first slot of the day (minimum start time)

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

### TC-EDGE-006 - Do not offer a 07:45 slot before working hours (minimum minus one step)

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

### TC-EDGE-007 - Offer the 15:45 slot as the last slot of the day (maximum start time)

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

### TC-EDGE-008 - Do not offer a 16:00 slot after working hours (maximum plus one step)

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

### TC-EDGE-009 - Show slots only on 15-minute steps (partition: off-grid time 08:10)

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

### TC-EDGE-010 - Accept the first booking when the patient has 0 upcoming appointments (minimum count)

Removed: duplicate of TC-FUN-006 (a patient with 0 upcoming appointments books one free slot and sees the confirmation); the minimum-count boundary stays covered by TC-FUN-006 (validation gate G4, attempt 1).

### TC-EDGE-011 - Accept the 3rd upcoming appointment when the patient has 2 (at the limit)

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

### TC-EDGE-012 - Reject the 4th upcoming appointment when the patient has 3 (limit plus one)

Removed: duplicate of TC-FUN-008 (a patient with 3 upcoming appointments books a 4th and is rejected with the limit message); the limit-plus-one boundary stays covered by TC-FUN-008 and TC-NEG-012 (validation gate G4, attempt 1).

### TC-EDGE-013 - Count upcoming appointments across doctors (partition: 3 appointments with 3 doctors)

Removed: duplicate of TC-FUN-008 (3 upcoming appointments spread across several doctors, a 4th booking with another doctor is rejected with the same message) and it overlapped the removed TC-EDGE-012; the across-all-doctors partition stays covered by TC-FUN-008 (validation gate G4, attempt 1).

### TC-EDGE-014 - Allow cancellation with 24 hours 1 minute remaining (limit plus one step)

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

### TC-EDGE-015 - Allow cancellation with exactly 24 hours remaining (limit)

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

### TC-EDGE-016 - Reject cancellation with 23 hours 59 minutes remaining (limit minus one step)

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

### TC-EDGE-017 - Start the calendar at the clinic's today+1 when the device date is already ahead

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

### TC-EDGE-018 - Evaluate the 24-hour cancellation limit in clinic time when the device time zone differs

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

### TC-EDGE-019 - Allow cancellation at exactly 24 real hours across the October 2026 clock change

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

### TC-EDGE-020 - Reject cancellation 1 minute after the 24-hour limit across the October 2026 clock change

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

## Notes and assumptions
- Boundary inventory: Bookable date window - today+1 to today+30 days inclusive, unit calendar days in Europe/Warsaw - AC-1, BR-1
- Boundary inventory: Slot start time - 08:00 to 15:45 on the doctor's working day, unit clock time in Europe/Warsaw (working hours 08:00-16:00) - AC-2, BR-2
- Boundary inventory: Slot length and grid - 15-minute increments, start minutes 00, 15, 30, 45 - AC-2, BR-2
- Boundary inventory: Upcoming appointments per patient - 0 to 3 across all doctors combined, unit appointments - AC-6, BR-3
- Boundary inventory: Cancellation cutoff - cancel allowed at 24 hours or more before start, rejected below 24 hours, unit hours/minutes - AC-8, AC-9, BR-4
- Boundary inventory: Clinic time zone evaluation - all dates and times evaluated in Europe/Warsaw regardless of device time zone, including the CEST to CET change on 2026-10-25 - AC-1, AC-8, AC-9, constraints section
- Assumption: A 15-minute slot must end within working hours, so the last slot starts at 15:45 and ends at 16:00; a 16:00 slot is out of range. The requirements do not state this explicitly.
- Assumption: "Today" and the 24-hour limit are evaluated in the clinic time zone (Europe/Warsaw), as stated in the constraints. The 24 hours are measured as elapsed real time between the cancellation moment and the appointment start, including across a daylight saving time change.
- Assumption: The test environment allows setting the system clock, and the cancellation limit is measured to the minute or finer; the smallest step used is 1 minute (1 day for dates, 15 minutes for slots).
- Assumption: TC-EDGE-019 and TC-EDGE-020 use a booking made before the requirements' 30-day window rule was relevant to the test (data seeded directly), because 2026-10-25 is 31 days after the run date.
- No cases were designed for AC-3 (past slots): today is not bookable (BR-1), so a past slot cannot appear on any selectable date and there is no boundary to test.
- The 29 February and end-of-month conditions were not added: the requirements mention time zones but no calendar-specific rules, and the case budget of 4 per parameter was applied.
- Cases TC-EDGE-005 to TC-EDGE-008 skip no values; for the appointment count, minimum minus one is impossible (a count below 0).
- Revision 2: TC-EDGE-010 marked Removed (duplicate of TC-FUN-006); the minimum count (0 upcoming appointments) is covered by TC-FUN-006.
- Revision 2: TC-EDGE-012 marked Removed (duplicate of TC-FUN-008); the limit-plus-one value (3 upcoming appointments, 4th rejected) is covered by TC-FUN-008 and TC-NEG-012.
- Revision 2: TC-EDGE-013 marked Removed (duplicate of TC-FUN-008 and overlap with TC-EDGE-012); the across-all-doctors rule is covered by TC-FUN-008. In this artifact the appointment-count parameter keeps TC-EDGE-011 (the limit, 3rd appointment accepted with 2 existing).
- Revision 2: replaced the Source of TC-EDGE-019 and TC-EDGE-020 and the matching Research sources entry: the timeanddate.com page returned HTTP 403; now https://kidsinthecity.pl/time-change-in-poland/, which opened with WebFetch and states that clocks go back from 03:00 to 02:00 on Sunday 25 October 2026.
