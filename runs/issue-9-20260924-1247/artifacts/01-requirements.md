# Requirements

| Field | Value |
|---|---|
| Run ID | issue-9-20260924-1247 |
| Owner | requirements-formalizer |
| Revision | 3 |
| Generated | 2026-09-24 12:47 |
| Source issue | [#9 PBI: Book an appointment time slot online](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/9) |
| Status | Confirmed by user on 2026-09-24 12:52 |

## Summary

CareSlot is a fictional clinic booking app (web and mobile) that lets registered patients book appointments online instead of calling the clinic during office hours. A patient picks a doctor, a date within the next 30 days, and a free 15-minute slot within the doctor's working hours, then confirms the booking and receives a confirmation number and email. The feature also covers a per-patient limit on upcoming appointments, protection against double-booking the same slot, and cancellation up to 24 hours before the appointment start. Payments and rescheduling are explicitly out of scope.

## User story

As a registered patient, I want to choose a doctor, a date, and a free time slot and book it online, so that I do not have to call the clinic.

## Acceptance criteria

| ID | Acceptance criterion | Negative testing |
|---|---|---|
| AC-1 | When a registered patient selects a doctor, the app displays a calendar of selectable dates from tomorrow (today+1) through 30 days ahead (today+30), inclusive on both ends; same-day (today) booking is not offered. | Applicable |
| AC-2 | For the date the patient selects, the app shows the doctor's free slots as 15-minute increments within the doctor's working hours, 08:00-16:00 in the clinic time zone (Europe/Warsaw). | Applicable |
| AC-3 | Slots that are in the past relative to the current date and time are not shown as available. | Applicable |
| AC-4 | Slots that are already booked (by any patient) are not shown as available. | Applicable |
| AC-5 | When the patient selects one available slot and confirms it, the app shows a booking confirmation containing the doctor, date, time, and a booking number. | Applicable |
| AC-6 | The app prevents a patient from having more than 3 upcoming appointments in total across all doctors combined; an attempt to book beyond the limit is rejected and the app shows the message "You already have the maximum of 3 upcoming appointments. Cancel one to book a new appointment." | Applicable |
| AC-7 | When two patients try to book the same slot at the same moment, only the first confirmation succeeds; the second patient sees the message "This slot was just booked. Please choose another one." | Applicable |
| AC-8 | The patient can cancel an upcoming appointment when 24 hours or more remain before the appointment start; exactly 24 hours remaining is still allowed to cancel. | Applicable |
| AC-9 | The app prevents cancellation when less than 24 hours remain before the appointment start; the appointment is not cancelled and the app shows the message "This appointment can no longer be cancelled online because it starts in less than 24 hours." | Applicable |
| AC-10 | After a successful booking, the patient receives a confirmation email. | Not applicable - no invalid input or failure path for email delivery is defined in the PBI |
| AC-11 | After a successful cancellation, the patient receives a confirmation email. | Not applicable - no invalid input or failure path for email delivery is defined in the PBI |

## Business rules

| ID | Rule |
|---|---|
| BR-1 | Bookable dates range from today+1 through today+30, inclusive on both ends; same-day (today) booking is excluded. |
| BR-2 | Available slots are 15-minute increments within the doctor's working hours, 08:00-16:00, Europe/Warsaw time. |
| BR-3 | A patient may have at most 3 upcoming appointments at the same time, counted across all doctors combined (not per doctor). |
| BR-4 | An appointment can be cancelled only while 24 hours or more remain before its start; cancellation is not possible once less than 24 hours remain (exactly 24 hours remaining is still cancellable). |
| BR-5 | Payments and rescheduling are out of scope; a patient who wants to change an appointment must cancel it and book a new one. |

## Constraints and non-functional requirements

- All appointment times are displayed and evaluated in the clinic time zone (Europe/Warsaw), regardless of the patient's own location or device time zone.
- None stated beyond time zone handling.

## Assumptions

| ID | Assumption |
|---|---|
| A-1 | The patient is already registered and authenticated before starting the booking flow; registration and login are out of scope for this feature. |
| A-2 | The booking and cancellation confirmation emails contain the same appointment details shown on screen (doctor, date, time, booking number). |
| A-3 | Cancelling an appointment immediately releases the slot so it becomes bookable by other patients. |
| A-4 | The doctor's working hours (08:00-16:00) apply on every bookable day; the PBI does not describe doctor days off or holidays. |

## Open questions

| ID | Question | Why it matters | Proposed default |
|---|---|---|---|

## Clarifications

| ID | Question | Answer | Date |
|---|---|---|---|
| Q-1 | Does the "at most 3 upcoming appointments" limit count appointments with any doctor combined, or per doctor separately? | Use the default: the limit counts across all doctors combined (not per doctor). | 2026-09-24 |
| Q-2 | What exact message does the patient see when attempting to book beyond the 3-appointment limit? | Use the default message: "You already have the maximum of 3 upcoming appointments. Cancel one to book a new appointment." | 2026-09-24 |
| Q-3 | Is cancellation still allowed when exactly 24 hours remain before the appointment start (boundary inclusive), or only when strictly more than 24 hours remain? | Do NOT use the proposed default. Cancellation is allowed when 24 hours or MORE remain before the appointment start (exactly 24 hours remaining is still allowed to cancel). Cancellation is NOT allowed when less than 24 hours remain. | 2026-09-24 |
| Q-4 | What exact message does the patient see when attempting to cancel after the 24-hour cutoff has passed? | Use the default message: "This appointment can no longer be cancelled online because it starts in less than 24 hours." | 2026-09-24 |
| Q-5 | Is today + 30 days included as a bookable date, and is same-day (today) booking excluded, confirming "tomorrow" means today + 1 with no same-day slots offered? | Use the default. Bookable date range is from today+1 through today+30 inclusive; same-day (today) booking is excluded. | 2026-09-24 |

## Execution profile

| Key | Value | Rationale |
|---|---|---|
| change_type | new-feature | Online self-service booking is a new capability; patients currently book only by phone |
| has_boundaries | yes | 30-day booking window, 08:00-16:00 working hours, 15-minute slot granularity, 3-appointment limit, and 24-hour cancellation cutoff are all numeric/time boundaries |
| security_sensitive | yes | Feature is limited to registered/authenticated patients, handles personal appointment data, and enforces per-patient ownership rules (a patient can only see/cancel their own appointments) |
| output_formats | markdown+html | Confirmed by user during clarification |
| post_issue_comment | yes | Confirmed by user during clarification |

## Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-24 | Initial formalization from issue #9 |
| 2 | 2026-09-24 | Resolved Q-1 through Q-5 with user answers; updated AC-1, AC-6, AC-8, AC-9, BR-1, BR-3, BR-4 accordingly; moved all questions to Clarifications; confirmed output_formats and post_issue_comment; status set to awaiting confirmation |
| 3 | 2026-09-24 | Confirmed by user on 2026-09-24 12:52 |
