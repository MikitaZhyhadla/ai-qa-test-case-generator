# Boundary and Edge Case Test Cases

| Field | Value |
|---|---|
| Run ID | issue-8-20260924-0138 |
| Owner | edge-case-planner |
| Revision | 3 |
| Generated | 2026-09-24 03:45 |

## Scope

This artifact covers boundary value analysis and equivalence partitioning for the numeric limits and format partitions introduced by the promo-code feature: campaign minimum order value thresholds, the pre-discount free-delivery threshold, discount capping and order-total flooring rules, percentage-discount extremes, currency rounding to 2 decimal places, promo-code casing/whitespace normalization, and the single-applied-code cap. It does not cover invalid/unrecognized/expired codes as a category (negative-test-planner), the full happy-path apply/remove/checkout flows (functional-test-planner), or regression risk on the pre-existing order-total calculation (regression-impact-analyzer).

## Research sources

- [Boundary-value analysis](https://en.wikipedia.org/wiki/Boundary-value_analysis) - confirms the two-value BVA technique (test the boundary and its nearest neighbor in the adjacent partition) and that the increment used should be the smallest possible for the field, i.e. 0.01 for two-decimal currency fields; applied to all `TC-EDGE-0xx` boundary cases in this run
- [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) - confirms EUR has a minor unit of 2 (two decimal places); used as the `Source` for the currency-rounding cases TC-EDGE-015 and TC-EDGE-016

## Test cases

### TC-EDGE-001 - Reject apply when subtotal is 0.01 EUR below the campaign minimum order value

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-8 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 29.99 EUR
- Delivery fee is 4.99 EUR (subtotal below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `SAVE10` (10% off) requires a minimum order value of 30.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 29.99 EUR (minimum minus 0.01 EUR)
- Campaign minimum order value: 30.00 EUR

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- An error message is displayed stating the required minimum order value of 30.00 EUR
- No code or discount is shown in the order summary
- The order total remains 34.98 EUR (29.99 + 4.99), unchanged

### TC-EDGE-002 - Accept apply when subtotal equals the campaign minimum order value exactly

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 30.00 EUR
- Delivery fee is 4.99 EUR (subtotal below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `SAVE10` (10% off) requires a minimum order value of 30.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 30.00 EUR (exact minimum)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is calculated as 3.00 EUR (10% of 30.00 EUR)
- The order summary shows the applied code `SAVE10` and a discount of 3.00 EUR
- The order total is displayed as 31.99 EUR (30.00 - 3.00 + 4.99)

### TC-EDGE-003 - Accept apply when subtotal is 0.01 EUR above the campaign minimum order value

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 20.01 EUR
- Delivery fee is 4.99 EUR (subtotal below the 50.00 EUR free-delivery threshold)
- Active fixed-amount-discount campaign code `FLAT5` (5.00 EUR off) requires a minimum order value of 20.00 EUR
- No promo code is currently applied

**Test data**
- Promo code: `FLAT5`
- Subtotal: 20.01 EUR (minimum plus 0.01 EUR)

**Steps**
1. Enter `FLAT5` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 5.00 EUR
- The order summary shows the applied code `FLAT5` and a discount of 5.00 EUR
- The order total is displayed as 20.00 EUR (20.01 - 5.00 + 4.99)

### TC-EDGE-004 - Auto-remove code when a cart quantity change drops the subtotal 0.01 EUR below the campaign minimum

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-9 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 35.00 EUR with code `SAVE10` (10% off, minimum order value 30.00 EUR) already applied
- Applied discount is 3.50 EUR; order total is displayed as 36.49 EUR (35.00 - 3.50 + 4.99)

**Test data**
- Promo code: `SAVE10`
- Subtotal before change: 35.00 EUR
- Subtotal after change: 29.99 EUR (0.01 EUR below the 30.00 EUR minimum)

**Steps**
1. Decrease the quantity of a cart item so the subtotal becomes 29.99 EUR.
2. Observe the order summary.

**Expected result**
- The code `SAVE10` is automatically removed from the order summary
- An explanatory message is displayed stating the code was removed because the order no longer meets the campaign's minimum order value
- The order total returns to 34.98 EUR (29.99 + 4.99), the value without the discount

### TC-EDGE-005 - Charge delivery fee when pre-discount subtotal is 0.10 EUR below the free-delivery threshold

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal (pre-discount) is 49.90 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Pre-discount subtotal: 49.90 EUR (0.10 EUR below the 50.00 EUR free-delivery threshold)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 4.99 EUR (10% of 49.90 EUR)
- The delivery fee of 4.99 EUR is still charged, because the pre-discount subtotal is below 50.00 EUR
- The order total is displayed as 49.90 EUR (49.90 - 4.99 + 4.99)

### TC-EDGE-006 - Waive delivery fee when pre-discount subtotal equals the free-delivery threshold exactly

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal (pre-discount) is 50.00 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Pre-discount subtotal: 50.00 EUR (exact free-delivery threshold)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 5.00 EUR (10% of 50.00 EUR)
- The delivery fee is waived (0.00 EUR), because the free-delivery threshold is evaluated against the original 50.00 EUR subtotal, not the discounted 45.00 EUR subtotal
- The order total is displayed as 45.00 EUR (50.00 - 5.00 + 0.00)

### TC-EDGE-007 - Waive delivery fee when pre-discount subtotal is 0.01 EUR above the free-delivery threshold

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal (pre-discount) is 50.01 EUR
- Active fixed-amount-discount campaign code `FLAT5` (5.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `FLAT5`
- Pre-discount subtotal: 50.01 EUR (0.01 EUR above the free-delivery threshold)

**Steps**
1. Enter `FLAT5` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 5.00 EUR
- The delivery fee is waived (0.00 EUR)
- The order total is displayed as 45.01 EUR (50.01 - 5.00 + 0.00)

### TC-EDGE-008 - Floor order total at the delivery fee when the fixed discount equals the subtotal exactly

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 20.00 EUR
- Active fixed-amount-discount campaign code `MEGA20` (20.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA20`
- Subtotal: 20.00 EUR (equal to the fixed discount amount)

**Steps**
1. Enter `MEGA20` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount applied is 20.00 EUR, exactly consuming the subtotal
- The order total is floored at the delivery fee amount and displayed as 4.99 EUR (20.00 - 20.00 + 4.99)

### TC-EDGE-009 - Apply full fixed discount when it is 0.01 EUR less than the subtotal

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 20.01 EUR
- Active fixed-amount-discount campaign code `MEGA20` (20.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA20`
- Subtotal: 20.01 EUR (0.01 EUR above the fixed discount amount)

**Steps**
1. Enter `MEGA20` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The full discount of 20.00 EUR is applied, uncapped
- The order total is displayed as 5.00 EUR (20.01 - 20.00 + 4.99)

### TC-EDGE-010 - Cap fixed discount at the subtotal when the discount amount exceeds it, delivery fee still charged

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 15.00 EUR
- Active fixed-amount-discount campaign code `MEGA20` (20.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA20`
- Subtotal: 15.00 EUR (5.00 EUR less than the fixed discount amount)

**Steps**
1. Enter `MEGA20` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is capped at 15.00 EUR so the discounted subtotal does not go below 0.00 EUR
- The order total is floored at the delivery fee amount and displayed as 4.99 EUR (15.00 - 15.00 + 4.99)

### TC-EDGE-011 - Cap fixed discount at the subtotal and floor order total at 0.00 EUR when delivery is also waived

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-3 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 55.00 EUR (at or above the 50.00 EUR free-delivery threshold)
- Active fixed-amount-discount campaign code `MEGA60` (60.00 EUR off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `MEGA60`
- Subtotal: 55.00 EUR (5.00 EUR less than the fixed discount amount)

**Steps**
1. Enter `MEGA60` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is capped at 55.00 EUR so the discounted subtotal does not go below 0.00 EUR
- Delivery is waived because the original subtotal (55.00 EUR) meets the free-delivery threshold
- The order total is floored at 0.00 EUR (55.00 - 55.00 + 0.00)

### TC-EDGE-012 - Floor order total at the delivery fee with a 100% percentage discount, delivery fee still charged

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 25.00 EUR (below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `FULL100` (100% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `FULL100`
- Subtotal: 25.00 EUR
- Discount rate: 100% (maximum of the valid 0-100% percentage range)

**Steps**
1. Enter `FULL100` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount equals the full subtotal, 25.00 EUR
- The order total is floored at the delivery fee amount and displayed as 4.99 EUR (25.00 - 25.00 + 4.99)

### TC-EDGE-013 - Floor order total at 0.00 EUR with a 100% percentage discount and delivery also waived

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | High |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 60.00 EUR (at or above the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `FULL100` (100% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `FULL100`
- Subtotal: 60.00 EUR
- Discount rate: 100%

**Steps**
1. Enter `FULL100` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount equals the full subtotal, 60.00 EUR
- Delivery is waived because the original subtotal meets the free-delivery threshold
- The order total is displayed as 0.00 EUR (60.00 - 60.00 + 0.00)

### TC-EDGE-014 - Apply a 99% percentage discount, one step below the maximum

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR (below the 50.00 EUR free-delivery threshold)
- Active percentage-discount campaign code `NEARFULL99` (99% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `NEARFULL99`
- Subtotal: 40.00 EUR
- Discount rate: 99% (maximum minus one step)

**Steps**
1. Enter `NEARFULL99` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The discount is 39.60 EUR (99% of 40.00 EUR)
- The order total is displayed as 5.39 EUR (40.00 - 39.60 + 4.99)

### TC-EDGE-015 - Round a percentage discount down to 2 decimal places when the third decimal digit is below 5

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | https://en.wikipedia.org/wiki/ISO_4217 |

**Preconditions**
- Cart subtotal is 33.33 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 33.33 EUR
- Raw discount before rounding: 3.333 EUR (rounds down, third decimal digit is 3)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The displayed discount is rounded down to exactly 2 decimal places: 3.33 EUR
- The order total is displayed with exactly 2 decimal places: 34.99 EUR (33.33 - 3.33 + 4.99)

### TC-EDGE-016 - Round a percentage discount up to 2 decimal places when the third decimal digit is 5 or above

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | https://en.wikipedia.org/wiki/ISO_4217 |

**Preconditions**
- Cart subtotal is 33.35 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Promo code: `SAVE10`
- Subtotal: 33.35 EUR
- Raw discount before rounding: 3.335 EUR (rounds up, third decimal digit is 5)

**Steps**
1. Enter `SAVE10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The displayed discount is rounded to exactly 2 decimal places: 3.34 EUR
- The order total is displayed with exactly 2 decimal places: 35.00 EUR (33.35 - 3.34 + 4.99)

### TC-EDGE-017 - Accept a promo code entered in lowercase that matches a stored uppercase code

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Active percentage-discount campaign code is stored as `SAVE10` (10% off), no minimum order value
- No promo code is currently applied

**Test data**
- Entered code: `save10` (all lowercase)
- Subtotal: 40.00 EUR

**Steps**
1. Enter `save10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The code is matched case-insensitively and applied
- The order summary shows the applied code and a discount of 4.00 EUR
- The order total is displayed as 40.99 EUR (40.00 - 4.00 + 4.99)

### TC-EDGE-018 - Accept a promo code entered with leading and trailing whitespace

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Entered code: `"  SAVE10  "` (two leading and two trailing spaces)
- Subtotal: 40.00 EUR

**Steps**
1. Enter `  SAVE10  ` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The whitespace is trimmed before validation and the code is applied
- The order summary shows the applied code `SAVE10` and a discount of 4.00 EUR
- The order total is displayed as 40.99 EUR (40.00 - 4.00 + 4.99)

### TC-EDGE-019 - Accept a promo code entered with mixed case combined with leading whitespace

| Field | Value |
|---|---|
| Type | Equivalence |
| Priority | Low |
| Requirement refs | AC-2 |
| Technique | Equivalence partitioning |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Active percentage-discount campaign code `SAVE10` (10% off) has no minimum order value
- No promo code is currently applied

**Test data**
- Entered code: `" SaVe10"` (one leading space, mixed case)
- Subtotal: 40.00 EUR

**Steps**
1. Enter ` SaVe10` in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The whitespace is trimmed and the case-insensitive match succeeds; the code is applied
- The order summary shows the applied code `SAVE10` and a discount of 4.00 EUR
- The order total is displayed as 40.99 EUR (40.00 - 4.00 + 4.99)

### TC-EDGE-020 - Re-apply the same already-applied code without exceeding the single-code limit of 1

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium |
| Requirement refs | AC-2 |
| Technique | Boundary value analysis |
| Source | N/A - derived from requirements |

**Preconditions**
- Cart subtotal is 40.00 EUR
- Percentage-discount code `SAVE10` (10% off, no minimum order value) is already applied, showing a 4.00 EUR discount and an order total of 40.99 EUR

**Test data**
- Already-applied code: `SAVE10`
- Re-entered code: `SAVE10` (same code, entered again)
- Subtotal: 40.00 EUR

**Steps**
1. With `SAVE10` already applied, enter `SAVE10` again in the "Promo code" field.
2. Click "Apply".

**Expected result**
- The applied-code count stays at exactly 1: the order summary shows a single instance of `SAVE10`, not two
- The discount is not doubled or duplicated by the re-apply; it remains 4.00 EUR
- The order total remains 40.99 EUR (40.00 - 4.00 + 4.99), unchanged from before the re-apply action

## Notes and assumptions

- Boundary inventory: Campaign minimum order value threshold - subtotal must be >= the campaign's configured minimum order value (EUR, exact value set per campaign, not stated in the PBI) - AC-8, BR-2
- Boundary inventory: Free-delivery threshold - delivery fee (4.99 EUR) is waived when the original, pre-discount subtotal is >= 50.00 EUR - BR-3, BR-4
- Boundary inventory: Fixed discount amount vs. subtotal - a fixed discount is capped so the discounted subtotal never goes below 0.00 EUR - AC-3, BR-5
- Boundary inventory: Percentage discount rate - valid range 0% to 100% of the subtotal; a 100% discount fully consumes the subtotal - AC-2, BR-5
- Boundary inventory: Order/discount amount rounding - all EUR amounts are rounded to 2 decimal places - BR-3, Constraints
- Boundary inventory: Promo code text format - matching is case-insensitive and leading/trailing whitespace is trimmed before validation - BR-7
- Boundary inventory: Number of simultaneously applied promo codes - maximum of 1; applying a second code replaces the first - BR-6
- The PBI does not state exact campaign minimum-order-value amounts, discount rates, or code strings; this artifact uses fictional, internally consistent values (e.g. minimums of 20.00/30.00 EUR, rates of 10%/50%/99%/100%, fixed amounts of 5.00/20.00/60.00 EUR, codes `SAVE10`/`FLAT5`/`MEGA20`/`MEGA60`/`FULL100`/`NEARFULL99`) to exercise the boundaries; actual QA execution must substitute real campaign data from the admin panel.
- The rounding direction (round-half-up) used in TC-EDGE-015 and TC-EDGE-016 is an assumption, since the PBI states amounts are "rounded to 2 decimal places" (BR-3, Constraints) but does not specify the rounding method; these cases confirm the result has exactly 2 decimal places and the value at that precision, per the common round-half-up convention.
- BR-6 (single-code limit) has no acceptance criterion of its own; TC-EDGE-020 references AC-2 because it exercises the "apply" action defined by that criterion while the same code is already applied.
- Revision 2: per validation gate G4 (07-validation-test-design-attempt-1.md), TC-EDGE-020 was rewritten because it duplicated TC-FUN-004's intent, steps, and expected result (applying a different code replaces the first, per BR-6). It now exercises a distinct boundary aspect of the single-applied-code limit: re-applying the same already-applied code, verifying the applied-code count stays at exactly 1 and the discount is not doubled, rather than testing replacement by a different code.
- Revision 3: per validation gate G3 (07-validation-test-design-attempt-2.md), TC-EDGE-006's title was shortened from 137 characters to under the 100-character maximum, removing the trailing "even though the discounted subtotal is below it" clause from the title; the tested behavior (pre-discount subtotal equals the free-delivery threshold exactly, discount still evaluated against the original 50.00 EUR subtotal) is unchanged and remains fully described in the case's Preconditions, Test data, and Expected result.
