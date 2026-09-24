# PBI Source

| Field | Value |
|---|---|
| Issue | #9 |
| URL | https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/9 |
| Title | PBI: Book an appointment time slot online |
| Labels | enhancement |
| State | open |
| Fetched at | 2026-09-24 12:47 |

## Body

## Context

Product: CareSlot, a fictional clinic booking app available on the web and on mobile. Patients currently book appointments by phone during office hours.

## User story

As a registered patient, I want to choose a doctor, a date, and a free time slot and book it online, so that I do not have to call the clinic.

## Acceptance criteria

1. The patient selects a doctor and sees a calendar with dates from tomorrow up to 30 days ahead.
2. For the selected date, the app shows free 15-minute slots within the doctor's working hours, 08:00-16:00 in the clinic time zone (Europe/Warsaw).
3. Slots in the past and slots that are already booked are not shown as available.
4. The patient selects one slot and confirms it. The app shows a confirmation with the doctor, date, time, and a booking number.
5. A patient can have at most 3 upcoming appointments at the same time.
6. If two patients try to book the same slot at the same moment, only the first confirmation succeeds. The second patient sees "This slot was just booked. Please choose another one."
7. The patient can cancel an appointment up to 24 hours before its start. Later cancellations are not possible in the app.
8. After booking or cancelling, the patient receives a confirmation email.

## Out of scope

- Payments
- Rescheduling (the patient cancels and books again)

## Comments

- None
