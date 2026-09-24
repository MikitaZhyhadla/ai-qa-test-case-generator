# Boundary and Edge Case Test Cases

| Field | Value |
|---|---|
| Run ID | issue-19-20260924-1642 |
| Owner | edge-case-planner |
| Revision | 2 |
| Generated | 2026-09-24 17:20 |

## Scope
This artifact covers boundary values and equivalence partitions for the newsletter subscription form: the 254-character email length limit (253, 254, 255 characters, and 254 characters after trimming), the shortest non-empty input, and the missing-domain format partition. Empty input, whitespace-only input, trimming of an ordinary address, the plain valid address, other format partitions, case-insensitive repeated subscriptions, and confirmation link age are checked by the functional and negative artifacts and are not repeated here. It does not cover unsubscribing or newsletter content. No calendar, date, or time zone cases are included because the requirements do not mention calendars or time zones.

## Research sources
- [3-value Boundary Value Analysis: Misconception and Reality (Medium)](https://medium.com/@giorgos.valamats/3-value-boundary-value-analysis-misconception-and-reality-25a008739660) - definition of two-value boundary value analysis (boundary value plus the nearest value on the other side), used to choose the maximum and maximum plus one step values.
- [Boundary Value Analysis & Equivalence Partitioning Examples (Software Testing Help)](https://www.softwaretestinghelp.com/what-is-boundary-value-analysis-and-equivalence-partitioning/) - opened in this run; one representative value per valid and invalid partition, and boundary values at the edges of a range.
- [Erratum 1690 - RFC 3696](https://errata.rfc-editor.org/eid1690) - the upper limit for the length of an email address is 254 characters (RFC 5321 forward-path limit of 256 octets including the angle brackets); this URL was returned by web search and its page was not opened by this planner, so only the search summary was used (the validator later confirmed that the page opens).

## Test cases

### TC-EDGE-001 - Accept an email address of exactly 254 characters (maximum)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2, AC-5 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690 |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address
- A mailbox that can receive mail for the test address is available

**Test data**
- Email of exactly 254 characters: `a` x 64 + `@` + `b` x 63 + `.` + `c` x 63 + `.` + `d` x 57 + `.com` (64 + 1 + 63 + 1 + 63 + 1 + 57 + 4 = 254 characters)

**Steps**
1. Enter the 254-character test email in the "Email" field.
2. Click "Subscribe".
3. Check the mailbox of the test address.

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- One subscription record exists for the address, with status pending.
- One confirmation email containing a confirmation link is received.

### TC-EDGE-002 - Reject an email address of 255 characters (maximum plus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690 |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address

**Test data**
- Email of exactly 255 characters: `a` x 64 + `@` + `b` x 63 + `.` + `c` x 63 + `.` + `d` x 58 + `.com` (64 + 1 + 63 + 1 + 63 + 1 + 58 + 4 = 255 characters)

**Steps**
1. Enter the 255-character test email in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved for the address.
- No confirmation email is sent.

### TC-EDGE-003 - Accept a 254-character email address surrounded by spaces (trimmed length 254)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2, AC-11 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address

**Test data**
- Email of 254 characters after trimming: `e` x 64 + `@` + `f` x 63 + `.` + `g` x 63 + `.` + `h` x 57 + `.com`
- Submitted value: 2 leading spaces + the email + 2 trailing spaces (258 characters before trimming)

**Steps**
1. Enter the submitted value with the surrounding spaces in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- One subscription record exists, and its saved address is the 254-character email without spaces.

### TC-EDGE-004 - Accept an email address of exactly 253 characters (maximum minus one)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | https://errata.rfc-editor.org/eid1690 |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- No subscription exists for the test address

**Test data**
- Email of exactly 253 characters: `k` x 64 + `@` + `l` x 63 + `.` + `m` x 63 + `.` + `n` x 56 + `.com` (64 + 1 + 63 + 1 + 63 + 1 + 56 + 4 = 253 characters)

**Steps**
1. Enter the 253-character test email in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Thanks! Please check your inbox to confirm your subscription."
- One subscription record exists for the address, with status pending.

### TC-EDGE-005 - Reject an email field that contains only 3 spaces (empty after trimming)

Removed: duplicate of TC-NEG-004 (same whitespace-only input, steps, and expected result). AC-3 and AC-11 remain covered by TC-NEG-004 and TC-FUN-003.

### TC-EDGE-006 - Reject a single-character email value `a` (shortest non-empty input)

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-4 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- The subscription store contains no records

**Test data**
- Email: `a` (1 character)

**Steps**
1. Enter `a` in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved.
- No confirmation email is sent.

### TC-EDGE-007 - Accept a valid email address surrounded by 2 leading and 2 trailing spaces

Removed: duplicate of TC-FUN-003 (valid address with surrounding spaces is accepted and trimmed). The boundary variant with a 254-character trimmed address stays in TC-EDGE-003.

### TC-EDGE-008 - Accept a well-formed email address `mia.test@example.com` (valid format partition)

Removed: duplicate of TC-FUN-002 (plain valid address is accepted with the pending state). The valid partition is also exercised by TC-EDGE-001 and TC-EDGE-004.

### TC-EDGE-009 - Reject an email value without the "@" character

Removed: duplicate of TC-FUN-005 and TC-NEG-005 (address without "@" is rejected). TC-EDGE-006 still checks the shortest non-empty input.

### TC-EDGE-010 - Reject an email value with an empty domain part (`mia.test@`)

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-4 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- The Notely website footer with the "Email" field and the "Subscribe" button is displayed
- The subscription store contains no records

**Test data**
- Email: `mia.test@` (9 characters, "@" is the last character and the domain part is empty)

**Steps**
1. Enter `mia.test@` in the "Email" field.
2. Click "Subscribe".

**Expected result**
- The page shows "Enter a valid email address."
- No subscription record is saved.
- No confirmation email is sent.

### TC-EDGE-011 - Reject an email value whose domain has no dot and top-level part (`mia.test@example`)

Removed: covered by TC-NEG-006 (Email 2 `anna.test@example` checks the same missing top-level domain partition).

### TC-EDGE-012 - Treat an upper-case variant of a pending address as a repeated subscription

Removed: duplicate of TC-FUN-017 (upper-case repeat of a pending address).

### TC-EDGE-013 - Treat a mixed-case variant of an active address as a repeated subscription

Removed: duplicate of TC-FUN-016 (mixed-case repeat of an active address).

### TC-EDGE-014 - Activate a subscription with a confirmation link that is 400 days old (no expiry)

Removed: duplicate of TC-FUN-012 (an old confirmation link still activates the subscription).

## Notes and assumptions
- Boundary inventory: Email address length - 1 to 254 characters after trimming, unit characters (longer is invalid) - AC-2, AC-9, BR-1
- Boundary inventory: Empty and whitespace-only input - 0 characters after trimming is invalid, unit characters - AC-3, AC-11, BR-4
- Boundary inventory: Email format - `local@domain.tld` after trimming; valid and invalid partitions - AC-4, BR-5
- Boundary inventory: Letter case of a repeated address - compared case-insensitively against active or pending subscriptions - AC-8, AC-10, AC-12, BR-6
- Boundary inventory: Confirmation link age - no expiry, any age is valid - AC-7, AC-13, BR-8
- The requirements state no minimum length for an email address. The shortest-valid-address boundary is therefore not tested with a specific number; only the single character `a` is checked (TC-EDGE-006). The empty value (0 characters) is checked by TC-FUN-004, and the minus-one-character value of an empty field is impossible.
- The requirements state no limits for the local part or for domain labels. The 253, 254, and 255-character test values use a 64-character local part and domain labels of at most 63 characters so that the total length is the only rule under test. Local part, label, and domain limits are not tested because they are not defined in the requirements.
- Format partitions with multiple "@" characters (TC-NEG-006), a missing local part (TC-NEG-006), a missing top-level domain (TC-NEG-006), and no "@" (TC-FUN-005, TC-NEG-005) are covered by other artifacts. Internal spaces are covered by TC-NEG-017.
- Case-insensitivity (AC-12) is covered by TC-FUN-016, TC-FUN-017, TC-NEG-019, and TC-NEG-020. The confirmation link age (BR-8) is covered by TC-FUN-012. Whitespace-only input is covered by TC-NEG-004. These parameters have no active EDGE case because a distinct boundary value or partition is not defined in the requirements.
- The technique guidance sources support the choice of two-value boundary value analysis and equivalence partitioning; only the 254-character limit is attributed to an external standard.
- Revision 2: gate G4 finding - TC-EDGE-004 changed from a duplicate of TC-FUN-004 (empty field) to a distinct boundary case for 253 characters (maximum minus one), AC-2.
- Revision 2: gate G4 finding - TC-EDGE-005 marked Removed (duplicate of TC-NEG-004).
- Revision 2: gate G4 finding - TC-EDGE-007 marked Removed (duplicate of TC-FUN-003).
- Revision 2: gate G4 finding - TC-EDGE-008 marked Removed (duplicate of TC-FUN-002).
- Revision 2: gate G4 finding - TC-EDGE-009 marked Removed (duplicate of TC-FUN-005 and TC-NEG-005).
- Revision 2: gate G4 finding - TC-EDGE-010 changed from a sub-step of TC-NEG-006 (`@example.com`) to a distinct partition, an empty domain part (`mia.test@`).
- Revision 2: gate G4 finding - TC-EDGE-011 marked Removed (covered by TC-NEG-006).
- Revision 2: gate G4 finding - TC-EDGE-012 marked Removed (duplicate of TC-FUN-017).
- Revision 2: gate G4 finding - TC-EDGE-013 marked Removed (duplicate of TC-FUN-016).
- Revision 2: gate G4 finding - TC-EDGE-014 marked Removed (duplicate of TC-FUN-012).
- Revision 2: Scope and boundary-related notes updated to match the remaining active cases (TC-EDGE-001, 002, 003, 004, 006, 010).
