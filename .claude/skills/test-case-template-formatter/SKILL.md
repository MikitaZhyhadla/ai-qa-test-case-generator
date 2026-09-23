---
name: test-case-template-formatter
description: Single source of truth for the structure of every test design artifact in this repository - the test case template, allowed field values, ID rules, planner artifact layout, test suite document layout, and HTML rendering template. Use it whenever you write, validate, merge, or render test cases (02-05 planner artifacts, 08-test-suite.md, output/test-suite.md, output/test-suite.html).
user-invocable: false
---

# Test Case Template Formatter

This skill defines how test design artifacts look, so that every run produces the same predictable structure for the same input.

Files in this skill:
- [test-case-template.md](test-case-template.md) - the exact Markdown block for one test case, with a filled example
- [suite-template.md](suite-template.md) - the exact layout of `08-test-suite.md` and `output/test-suite.md`
- [html-template.html](html-template.html) - the standalone HTML template for `output/test-suite.html`

Read the file you need before writing. Copy structures exactly; do not add, remove, rename, or reorder sections or fields.

## Test case fields

Every test case uses the block from [test-case-template.md](test-case-template.md). All fields are mandatory and must be non-empty.

| Field | Rule |
|---|---|
| ID | `TC-<PREFIX>-NNN`, see "ID rules" |
| Title | Starts with a verb or describes the checked behavior; max 100 characters; unique within the run |
| Type | One of: `Functional`, `Negative`, `Security`, `Boundary`, `Equivalence`, `Regression` |
| Priority | One of: `Critical`, `High`, `Medium`, `Low` (see "Priority definitions") |
| Requirement refs | Comma-separated `AC-<n>` and/or `IA-<n>` IDs that exist in `01-requirements.md` or `05-regression-impact.md` |
| Technique | One of: `Happy path`, `Alternative flow`, `Error guessing`, `Input validation`, `Boundary value analysis`, `Equivalence partitioning`, `State transition`, `Security check`, `Regression check` |
| Source | A real URL found through web search in this run, or exactly `N/A - derived from requirements` |
| Preconditions | Bullet list; write `- None` if there are none |
| Test data | Bullet list of fictional values; write `- None` if no data is needed |
| Steps | Numbered list; one user or system action per step; imperative mood |
| Expected result | Bullet list of observable, verifiable outcomes; no vague words such as "works correctly" or "properly" |

## ID rules

| Prefix | Owner agent | Allowed types |
|---|---|---|
| `FUN` | `functional-test-planner` | Functional |
| `NEG` | `negative-test-planner` | Negative, Security |
| `EDGE` | `edge-case-planner` | Boundary, Equivalence |
| `REG` | `regression-impact-analyzer` | Regression |

- Numbers have three digits and start at `001` for each prefix: `TC-FUN-001`, `TC-FUN-002`, ...
- IDs are never reused or renumbered after the artifact is first validated. On a retry, fix cases in place and append new cases with the next free number. If a case must be removed, keep its heading and replace the block body with `Removed: <reason>`.

## Priority definitions

| Priority | Meaning |
|---|---|
| Critical | Failure blocks the main user goal, causes data loss, or creates a security risk |
| High | Failure breaks an acceptance criterion with no reasonable workaround |
| Medium | Failure breaks an acceptance criterion but a workaround exists, or affects a secondary flow |
| Low | Cosmetic issue or rare edge condition with minor impact |

## Planner artifact layout (02-05)

Every planner artifact uses exactly this layout:

```markdown
# <Artifact title>

| Field | Value |
|---|---|
| Run ID | <run-id> |
| Owner | <agent-name> |
| Revision | <n> |
| Generated | <YYYY-MM-DD HH:MM> |

## Scope
<2-5 sentences: what this artifact covers and what it deliberately does not cover>

## Research sources
<Bullet list of "[Page title](URL) - what was used from it". Write "- None - derived from requirements" if no research was needed.>

## Test cases
<Test case blocks in ascending ID order>

## Notes and assumptions
<Bullet list, or "- None">
```

Artifact titles:
- `02-functional-tests.md` -> `# Functional Test Cases`
- `03-negative-tests.md` -> `# Negative and Security Test Cases`
- `04-edge-case-tests.md` -> `# Boundary and Edge Case Test Cases`
- `05-regression-impact.md` -> `# Regression Impact Analysis`

`05-regression-impact.md` has one extra section between `## Research sources` and `## Test cases`:

```markdown
## Impacted areas

| ID | Area | Why it is impacted | Risk |
|---|---|---|---|
| IA-1 | <existing feature or component> | <link to the change> | High / Medium / Low |
```

## Test suite layout (08 and final Markdown)

Use [suite-template.md](suite-template.md) exactly:
- Sections appear in the fixed order and with the fixed numbering from the template, even when empty.
- An empty test case subsection contains exactly one line: `Not applicable for this run - <reason>.`
- Test cases are copied from the validated planner artifacts without changing IDs, fields, or wording, except for changes requested in review feedback. Every change is recorded in the change log.
- Inside each subsection, test cases are ordered by ID ascending.

## HTML rendering rules

Use [html-template.html](html-template.html) for `output/test-suite.html`:
- Replace every `{{PLACEHOLDER}}` and repeat the marked blocks; keep all CSS and element classes unchanged.
- The page is fully standalone: no external scripts, stylesheets, fonts, or images.
- Escape `&`, `<`, `>` and `"` in all inserted text.
- Links from `Source` fields and the references section become clickable `<a>` elements.
- The HTML contains exactly the same sections, test cases, and values as the approved Markdown suite.

## Self-check before writing

- [ ] Every test case block has all 11 fields, in template order
- [ ] Every field value uses only allowed values
- [ ] Every ID matches the owner prefix and is unique
- [ ] Every `Requirement refs` ID exists
- [ ] Every `Source` is a real URL from this run or exactly `N/A - derived from requirements`
- [ ] Artifact layout and section order match this skill exactly
- [ ] All data is fictional
