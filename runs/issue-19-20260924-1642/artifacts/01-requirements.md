# Requirements

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | requirements-formalizer |
| Revision | 3 |
| Generated | 2026-09-24 16:42 |
| Source issue | [#19 PBI: Subscribe to the product newsletter](https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/19) |
| Status | Confirmed by user on 2026-09-24 16:48 |

## Summary

Notely, a fictional note-taking web app, gets a newsletter subscription form in the website footer. A visitor enters an email address and clicks "Subscribe". Valid addresses receive a confirmation email, and the subscription becomes active only after the visitor opens the link in that email (double opt-in). Invalid input is rejected with a message and nothing is saved, and repeated subscriptions with an already active or pending address do not create duplicates. Unsubscribing and newsletter content or schedule are out of scope.

## User story

As a visitor of the Notely website, I want to subscribe to the product newsletter with my email address, so that I receive product news.

## Acceptance criteria

| ID | Acceptance criterion | Negative testing |
|---|---|---|
| AC-1 | The website footer shows an "Email" field and a "Subscribe" button. | Not applicable - static presence of UI elements, no input or failure path |
| AC-2 | When a visitor submits a valid email address of at most 254 characters, the page shows "Thanks! Please check your inbox to confirm your subscription." | Applicable |
| AC-3 | When a visitor submits an empty email field (including a value that is empty after trimming spaces), the page shows "Enter a valid email address." and no subscription record is saved. | Applicable |
| AC-4 | When a visitor submits an email address that does not match the standard `local@domain.tld` format, the page shows "Enter a valid email address." and no subscription record is saved. | Applicable |
| AC-5 | After a valid email address is submitted, the system sends a confirmation email to that address containing a confirmation link. | Applicable |
| AC-6 | Until the confirmation link is opened, the subscription is not active. | Not applicable - it is itself the negative state check of AC-7, with no separate input |
| AC-7 | When the visitor opens the confirmation link from the email, the subscription becomes active. | Applicable |
| AC-8 | When a visitor submits an email address that already has an active subscription, the page shows "Thanks! Please check your inbox to confirm your subscription." (same message as AC-2), no confirmation email is sent, and no duplicate subscription is created. | Applicable |
| AC-9 | When a visitor submits an email address longer than 254 characters, the page shows "Enter a valid email address." and no subscription record is saved. | Applicable |
| AC-10 | When a visitor submits an email address whose subscription is pending (confirmation link not yet opened), the page shows "Thanks! Please check your inbox to confirm your subscription." (same message as AC-2), a new confirmation email is sent, and no duplicate subscription is created. | Applicable |
| AC-11 | Leading and trailing spaces in the submitted email address are trimmed before validation and saving; an otherwise valid address surrounded by spaces is accepted as in AC-2. | Applicable |
| AC-12 | Email addresses are compared case-insensitively: submitting an address that differs from an existing active or pending subscription only in letter case is handled as a repeated subscription (AC-8 or AC-10) and creates no duplicate. | Applicable |
| AC-13 | After the visitor opens a valid confirmation link, a confirmation page states that the subscription is active. | Not applicable - covered by the negative tests of AC-7 and AC-15 |
| AC-14 | When the visitor opens the same valid confirmation link again, the subscription stays active and the same confirmation page as in AC-13 is shown. | Not applicable - repeat-open behavior of AC-13 with no separate invalid input |
| AC-15 | When the visitor opens an invalid or tampered confirmation link, an error page is shown and no subscription is activated. | Applicable |

## Business rules

| ID | Rule |
|---|---|
| BR-1 | A valid email address may be at most 254 characters long; a longer address is invalid. |
| BR-2 | A subscription becomes active only after the confirmation link is opened (double opt-in). |
| BR-3 | An email address has at most one subscription; an address with an active or pending subscription is never duplicated. |
| BR-4 | An empty or invalid email address is never saved. |
| BR-5 | A valid email address matches the standard `local@domain.tld` format after leading and trailing spaces are trimmed. |
| BR-6 | Email addresses are compared case-insensitively. |
| BR-7 | Submitting an address with an active subscription sends no email; submitting an address with a pending subscription sends a new confirmation email. |
| BR-8 | Confirmation links do not expire. |

## Constraints and non-functional requirements

- Out of scope per the PBI: unsubscribing, newsletter content, and sending schedule.
- The email address is personal data and must be handled accordingly (no specific requirement stated in the PBI).

## Assumptions

| ID | Assumption |
|---|---|
| A-1 | The form is available to anonymous visitors, with no login required. |
| A-2 | The messages are shown in English exactly as quoted in the PBI. |

## Open questions

| ID | Question | Why it matters | Proposed default |
|---|---|---|---|
| - | - | - | - |

## Clarifications

| ID | Question | Answer | Date |
|---|---|---|---|
| Q-1 | What happens when the submitted email address is longer than 254 characters? | Treated as invalid: shows "Enter a valid email address." and nothing is saved (AC-9, BR-1) | 2026-09-24 |
| Q-2 | What counts as an invalid email address (format rules), and is the input trimmed and compared case-insensitively? | Standard `local@domain.tld` check; leading/trailing spaces trimmed; addresses compared case-insensitively (AC-4, AC-11, AC-12, BR-5, BR-6) | 2026-09-24 |
| Q-3 | What happens when a visitor subscribes with an address whose subscription is pending? | Same message as AC-2, a new confirmation email is sent, no duplicate is created (AC-10, BR-7) | 2026-09-24 |
| Q-4 | When the address already has an active subscription (AC-8), is a confirmation email sent? | No email is sent, the same message is shown (AC-8, BR-7) | 2026-09-24 |
| Q-5 | What does the visitor see after opening the confirmation link, and what happens if it is opened again, expired, or invalid? | Confirmation page says the subscription is active; reopening keeps it active; an invalid link shows an error and activates nothing; no expiry (AC-13, AC-14, AC-15, BR-8) | 2026-09-24 |

## Execution profile

| Key | Value | Rationale |
|---|---|---|
| change_type | new-feature | The PBI introduces a new newsletter subscription capability; no existing behavior is modified |
| has_boundaries | yes | The email address has a maximum length of 254 characters and a format rule |
| security_sensitive | yes | The feature collects and stores personal data (email address) and uses a tokenized confirmation link |
| output_formats | markdown+html | Chosen by the user on 2026-09-24 |
| post_issue_comment | yes | Chosen by the user on 2026-09-24 |

## Change log

| Revision | Date | Change |
|---|---|---|
| 1 | 2026-09-24 | Initial formalization from issue #19 |
| 2 | 2026-09-24 | Applied answers to Q-1..Q-5 (moved to Clarifications); amended AC-3, AC-4, AC-8; added AC-9..AC-15 and BR-5..BR-8; recorded output_formats and post_issue_comment choices |
| 3 | 2026-09-24 | Requirements confirmed by the user on 2026-09-24 16:48 |
