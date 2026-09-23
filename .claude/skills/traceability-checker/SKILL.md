---
name: traceability-checker
description: Reusable procedure for requirement-to-test traceability - extracts acceptance criteria (AC-n), impacted areas (IA-n), and test cases (TC-*) from run artifacts, builds the coverage matrix (06-coverage-matrix.md), and runs the traceability checks behind quality gates G1, G2, G5, G8, G9, and S1. Use it when building or validating coverage, or when checking that a test suite contains every validated test case.
user-invocable: false
---

# Traceability Checker

This skill defines one repeatable way to link requirements and test cases, so coverage is built and checked the same way by every agent that needs it:
- `coverage-aggregator` uses it to build `06-coverage-matrix.md`
- `validator` uses it to evaluate gates G1, G2, G5, G8, G9 (scope `test-design`) and S1 (scope `suite`)
- `test-suite-builder` uses it to fill section `4. Coverage matrix` of the suite

Test case structure and allowed values are defined in the `test-case-template-formatter` skill. This skill only covers links between IDs.

## Step 1 - Extract the inventory

Read the artifacts of the run from `runs/<run-id>/artifacts/` and collect three lists.

**Acceptance criteria** - from the `## Acceptance criteria` table in `01-requirements.md`:

| ID | Acceptance criterion | Negative testing |
|---|---|---|
| AC-1 | <text> | Applicable / Not applicable - <reason> |

**Impacted areas** - from the `## Impacted areas` table in `05-regression-impact.md` (only if that artifact exists): `IA-<n>` IDs.

**Test cases** - from every test case heading `### TC-<PREFIX>-NNN - <Title>` in `02`-`05` (or `#### ...` inside `08-test-suite.md`):
- record ID, Type, Priority, Requirement refs, and the artifact file it came from
- skip cases whose body is `Removed: <reason>`, but list them in the matrix notes

## Step 2 - Classify test cases by coverage column

| ID prefix | Coverage column |
|---|---|
| `TC-FUN` | Positive |
| `TC-NEG` | Negative / Security |
| `TC-EDGE` | Boundary / Equivalence |
| `TC-REG` | Regression |

A test case appears in the row of every AC or IA it references.

## Step 3 - Run the checks

| Check | Gate | Rule | Owner on failure |
|---|---|---|---|
| T1 | G1 | Every `AC-<n>` is referenced by at least one test case | `functional-test-planner` |
| T2 | G2 | Every reference in `Requirement refs` points to an existing `AC-<n>` or `IA-<n>` | owner by ID prefix |
| T3 | G5 | Every AC has at least one Positive case and at least one Negative / Security case, unless its `Negative testing` value is `Not applicable - <reason>` | `negative-test-planner` (missing negative), `functional-test-planner` (missing positive) |
| T4 | G8 | When `05-regression-impact.md` exists, every `IA-<n>` has at least one `TC-REG` case | `regression-impact-analyzer` |
| T5 | G9 | `06-coverage-matrix.md` lists exactly the same test case IDs and totals as the planner artifacts | `coverage-aggregator` |
| T6 | S1 | `08-test-suite.md` contains every active test case from the planner artifacts exactly once, with the same ID, and no other test cases | `test-suite-builder` |

Owner by ID prefix: `FUN` -> `functional-test-planner`, `NEG` -> `negative-test-planner`, `EDGE` -> `edge-case-planner`, `REG` -> `regression-impact-analyzer`.

Report every failure with the exact IDs involved. Never fix artifacts while checking.

## Step 4 - Report findings

Use this table wherever traceability results are reported (the coverage matrix and validation reports):

```markdown
| Check | Gate | Status | Findings | Owner |
|---|---|---|---|---|
| T1 | G1 | Pass | - | - |
| T3 | G5 | Fail | AC-3 has no Negative / Security case | negative-test-planner |
```

`Status` is `Pass`, `Fail`, or `Not applicable` (for example T4 when regression analysis was not selected). `Findings` lists the concrete IDs; `-` when passed.

## Coverage matrix layout (06-coverage-matrix.md)

`coverage-aggregator` writes exactly this layout:

```markdown
# Coverage Matrix

| Field | Value |
|---|---|
| Run ID | <run-id> |
| Owner | coverage-aggregator |
| Revision | <n> |
| Generated | <YYYY-MM-DD HH:MM> |
| Inputs | <list of planner artifact files used> |

## Requirement coverage

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression | Status |
|---|---|---|---|---|---|
| AC-1 | TC-FUN-001 | TC-NEG-001, TC-NEG-002 | TC-EDGE-001 | - | Covered |

## Impacted area coverage

| Impacted area | Regression cases | Status |
|---|---|---|
| IA-1 | TC-REG-001 | Covered |

## Test case inventory

| Test case | Type | Priority | Requirement refs | Artifact |
|---|---|---|---|---|
| TC-FUN-001 | Functional | High | AC-1 | 02-functional-tests.md |

## Totals

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | <n> | <n> | <n> | <n> | <n> |
| Negative | <n> | <n> | <n> | <n> | <n> |
| Security | <n> | <n> | <n> | <n> | <n> |
| Boundary | <n> | <n> | <n> | <n> | <n> |
| Equivalence | <n> | <n> | <n> | <n> | <n> |
| Regression | <n> | <n> | <n> | <n> | <n> |
| **Total** | <n> | <n> | <n> | <n> | <n> |

## Traceability findings

<Findings table from Step 4 for checks T1-T4>

## Notes

<Removed test cases and any other remarks as a bullet list, or "- None">
```

Rules for the layout:
- Rows are ordered by ID ascending (`AC-1`, `AC-2`, ... `AC-10`; numeric, not alphabetical).
- Cells without test cases contain `-`.
- Row `Status` is `Covered` (T1 and T3 pass for the row), `Partially covered - <what is missing>`, or `Not covered`.
- When regression analysis was not selected, the `Impacted area coverage` section contains exactly one line: `Not applicable for this run - regression analysis was not selected.`
- T5 and T6 are not evaluated by the aggregator; the validator runs them.
