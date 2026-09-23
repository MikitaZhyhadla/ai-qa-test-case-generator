# Test Suite Template

Layout of `artifacts/08-test-suite.md` and `output/test-suite.md`. Replace `<...>` placeholders. Keep every heading, its number, and its order.

```markdown
# Test Suite - <Feature name>

| Field | Value |
|---|---|
| Run ID | <run-id> |
| Source issue | [#<number> <issue title>](<issue URL>) |
| Revision | <n> |
| Status | <Draft - awaiting approval / Approved> |
| Approved at | <YYYY-MM-DD HH:MM, or "-" while in draft> |
| Generated | <YYYY-MM-DD HH:MM> |

## 1. Summary

<3-5 sentences describing the feature under test and the testing approach.>

| Type | Critical | High | Medium | Low | Total |
|---|---|---|---|---|---|
| Functional | <n> | <n> | <n> | <n> | <n> |
| Negative | <n> | <n> | <n> | <n> | <n> |
| Security | <n> | <n> | <n> | <n> | <n> |
| Boundary | <n> | <n> | <n> | <n> | <n> |
| Equivalence | <n> | <n> | <n> | <n> | <n> |
| Regression | <n> | <n> | <n> | <n> | <n> |
| **Total** | <n> | <n> | <n> | <n> | <n> |

## 2. Scope

**In scope**
- <item>

**Out of scope**
- <item>

## 3. Requirements under test

| ID | Acceptance criterion |
|---|---|
| AC-1 | <text> |

## 4. Coverage matrix

| Requirement | Positive | Negative / Security | Boundary / Equivalence | Regression |
|---|---|---|---|---|
| AC-1 | TC-FUN-001 | TC-NEG-001, TC-NEG-002 | TC-EDGE-001 | - |

## 5. Test cases

### 5.1 Functional

<Test case blocks with prefix FUN. Use heading level #### for each test case inside the suite.>

### 5.2 Negative and security

<Test case blocks with prefix NEG.>

### 5.3 Boundary and edge cases

<Test case blocks with prefix EDGE, or "Not applicable for this run - <reason>.">

### 5.4 Regression

<Test case blocks with prefix REG, or "Not applicable for this run - <reason>.">

## 6. Assumptions and risks

- <item>

## 7. References

- [<Page title>](<URL>) - <what it was used for>

## 8. Change log

| Revision | Date | Change |
|---|---|---|
| 1 | <YYYY-MM-DD> | Initial draft |
```

Inside the suite, test case headings use level `####` instead of `###`; everything else in the block stays identical to [test-case-template.md](test-case-template.md).
