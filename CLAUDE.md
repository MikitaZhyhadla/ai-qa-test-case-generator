# AI QA Test Case Generator — Workflow Rules

This repository contains an agentic workflow built with Claude Code. It turns a fictional Product Backlog Item (PBI), stored as a GitHub Issue, into a validated and human-approved QA test suite in Markdown and/or HTML.

The workflow is started with the custom slash command `/generate-test-cases`, which acts as the **coordinator**. The coordinator orchestrates subagents, runs quality gates, enforces human approval, and persists state. It never writes test content itself.

## Language policy

All repository content is written in English: code, configs, documentation, prompts, workflow artifacts, file names, and commit messages.

## Components

| Type | Name | Location | Responsibility |
|---|---|---|---|
| Coordinator | `/generate-test-cases` | `.claude/commands/generate-test-cases.md` | Orchestration, planning, gates, retries, approval, state |
| Subagent | `requirements-formalizer` | `.claude/agents/` | Fetches the PBI via GitHub MCP; formalizes requirements, acceptance criteria, open questions, execution profile |
| Subagent | `functional-test-planner` | `.claude/agents/` | Positive functional test cases (`TC-FUN-NNN`) |
| Subagent | `negative-test-planner` | `.claude/agents/` | Negative, validation, and security-oriented test cases (`TC-NEG-NNN`), backed by web research |
| Subagent | `edge-case-planner` | `.claude/agents/` | Boundary value and equivalence partitioning test cases (`TC-EDGE-NNN`), backed by web research |
| Subagent | `regression-impact-analyzer` | `.claude/agents/` | Impacted existing areas and regression test cases (`TC-REG-NNN`) |
| Subagent | `coverage-aggregator` | `.claude/agents/` | Synthesis: requirement-to-test coverage matrix |
| Subagent | `validator` | `.claude/agents/` | Runs quality gates for a given scope; reports pass/fail with owners |
| Subagent | `test-suite-builder` | `.claude/agents/` | Synthesis: merges validated artifacts into one test suite draft; applies review feedback |
| Subagent | `markdown-builder` | `.claude/agents/` | Renders the approved suite as final Markdown |
| Subagent | `html-builder` | `.claude/agents/` | Renders the approved suite as a standalone HTML document |
| Skill | `test-case-template-formatter` | `.claude/skills/test-case-template-formatter/` | The single test case template, suite document structure, HTML template |
| Skill | `traceability-checker` | `.claude/skills/traceability-checker/` | Acceptance criteria ↔ test case traceability and coverage checks |
| Hook (PreToolUse) | `approval-gate-guard` | `.claude/hooks/approval-gate-guard.js` | Blocks final output writes without a valid approval; blocks direct writes to `approval.json` and `workflow-state.json`, including through shell commands |
| Hook (PostToolUse) | `post-write-state` | `.claude/hooks/post-write-state.js` | Records every written run artifact (path, time, sha256) in `workflow-state.json` |
| Hook (UserPromptSubmit) | `approval-recorder` | `.claude/hooks/approval-recorder.js` | Deterministically records the user's `APPROVE` / `REJECT` decision in `approval.json` |
| MCP server | GitHub | `.mcp.json` | Reads PBI issues and related issues; optionally posts a summary comment |
| Script | `workflow-state` | `.claude/scripts/workflow-state.js` | Deterministic CLI the coordinator uses to create and update `workflow-state.json` |
| Library | `workflow-lib` | `.claude/lib/workflow-lib.js` | Shared code of the state script and the hooks: step graph, sha256, file lock, atomic writes |
| Script | `selftest-hooks` | `.claude/scripts/selftest-hooks.js` | Self-test of the hooks and the state script |
| Script | `open-report` | `.claude/scripts/open-report.js` | Opens the final HTML report of a run (or of the latest completed run) in the default browser |

Subagents cannot ask the user questions, and none of them is given the `Agent` tool, so they cannot invoke other subagents. Only the coordinator talks to the user and invokes subagents.

## Run layout

Each run has its own folder. Run ID format: `issue-<issue-number>-<YYYYMMDD-HHMM>` (local time of the run start).

```text
runs/<run-id>/
├── input/pbi.md                                  # PBI text as fetched from the GitHub Issue
├── artifacts/
│   ├── 01-requirements.md                        # requirements-formalizer
│   ├── 02-functional-tests.md                    # functional-test-planner
│   ├── 03-negative-tests.md                      # negative-test-planner
│   ├── 04-edge-case-tests.md                     # edge-case-planner (only when selected)
│   ├── 05-regression-impact.md                   # regression-impact-analyzer (only when selected)
│   ├── 06-coverage-matrix.md                     # coverage-aggregator
│   ├── 07-validation-<scope>-attempt-<n>.md      # validator (one file per scope and attempt)
│   ├── 08-test-suite.md                          # test-suite-builder (draft submitted for approval)
│   └── 09-review-feedback-rev-<n>.md             # coordinator (one file per rejection)
├── approval.json                                 # written ONLY by the approval-recorder hook
├── workflow-state.json                           # persisted workflow state
└── output/
    ├── test-suite.md                             # markdown-builder
    └── test-suite.html                           # html-builder
```

## Artifact rules

- Artifacts are human-readable Markdown and follow the structures defined in the `test-case-template-formatter` skill.
- Each artifact has exactly one owner. Only the owner writes it. The coordinator writes only `workflow-state.json` and `09-review-feedback-rev-<n>.md`.
- Test case IDs use the owner prefix: `TC-FUN-NNN`, `TC-NEG-NNN`, `TC-EDGE-NNN`, `TC-REG-NNN` (three digits, unique within a run). The prefix identifies the owning agent.
- Acceptance criteria IDs: `AC-<n>`. Every test case references at least one `AC-<n>` or, for regression cases, an impacted area ID `IA-<n>`.
- Test cases derived from an external standard or guideline must include a `Source` link to a real page found through web search during the run. Never invent URLs.
- Input data is always fictional. Never use real company, customer, or personal data.

## Execution flow

| Step ID | Step | Executor | Runs after | Mode |
|---|---|---|---|---|
| `formalize` | Fetch PBI, formalize requirements, list open questions | `requirements-formalizer` | start | sequential |
| `clarify` | Ask the user the open questions; re-run formalizer with answers; get explicit confirmation | coordinator + `requirements-formalizer` | `formalize` | sequential, loops until confirmed |
| `validate-requirements` | Gates R1–R3 | `validator` (scope `requirements`) | `clarify` | sequential |
| `plan` | Select subagents from the execution profile; record the plan in state | coordinator | `validate-requirements` | sequential |
| `design-functional`, `design-negative`, `design-edge`, `design-regression` | Functional, negative, edge-case, regression planning (one step per selected planner) | selected planners | `plan` | **parallel** |
| `aggregate` | Build coverage matrix | `coverage-aggregator` | all selected `design-*` steps | sequential |
| `validate-design` | Gates G1–G9 | `validator` (scope `test-design`) | `aggregate` | sequential |
| `build-suite` | Merge into the test suite draft | `test-suite-builder` | `validate-design` | sequential |
| `validate-suite` | Gates S1–S3 | `validator` (scope `suite`) | `build-suite` | sequential |
| `approval` | Human approval; revision loop on reject | coordinator + `approval-recorder` hook | `validate-suite` | sequential, loops until approved |
| `render-markdown`, `render-html` | Final outputs in the confirmed formats | `markdown-builder`, `html-builder` | `approval` | **parallel** |
| `report` | Post a short summary comment to the GitHub Issue | coordinator via GitHub MCP | all selected `render-*` steps | optional |

## Requirements gathering and confirmation

1. `requirements-formalizer` fetches the Issue through the GitHub MCP server, saves the raw text to `input/pbi.md`, and writes `01-requirements.md` with: summary, numbered acceptance criteria, business rules, constraints, assumptions, open questions, and the execution profile.
2. If there are open questions, the coordinator asks the user all of them in one message, then re-invokes the formalizer with the answers. Answers are recorded in the `Clarifications` section.
3. The coordinator shows the user a short summary of the formalized requirements and the execution profile and asks for explicit confirmation: the user replies `CONFIRM` or sends corrections. Corrections trigger another formalizer pass.
4. After the user confirms, the formalizer sets `Status: Confirmed by user` with the date. Dependent work never starts on unconfirmed requirements.

The execution profile in `01-requirements.md` contains:
- `change_type`: `new-feature` or `existing-feature-change`
- `has_boundaries`: `yes` or `no` (numeric limits, lengths, dates/times, quantities, formats)
- `security_sensitive`: `yes` or `no` (authentication, personal data, payments, permissions)
- `output_formats`: `markdown`, `html`, or `markdown+html` (default `markdown+html`)
- `post_issue_comment`: `yes` or `no` (default `yes`)

## Dynamic subagent selection

The coordinator builds the plan from the confirmed execution profile and records it in `workflow-state.json` with a reason for each decision:

| Subagent | Selected when |
|---|---|
| `functional-test-planner` | always |
| `negative-test-planner` | always (security-focused research is required when `security_sensitive: yes`) |
| `edge-case-planner` | `has_boundaries: yes` |
| `regression-impact-analyzer` | `change_type: existing-feature-change` |
| `markdown-builder` | `output_formats` contains `markdown` |
| `html-builder` | `output_formats` contains `html` |

Steps that are not selected get status `skipped` with the reason.

## Quality gates

The `validator` never edits artifacts. For every failed gate, it reports the gate ID, the findings (affected test case or AC IDs), and the owner agent to re-run.

### Scope `requirements`
| Gate | Rule | Owner on failure |
|---|---|---|
| R1 | Every acceptance criterion has a unique `AC-<n>` ID and an observable, testable expected outcome | `requirements-formalizer` |
| R2 | No unresolved open questions; `Status: Confirmed by user` is present | `requirements-formalizer` (coordinator asks the user first) |
| R3 | Execution profile is complete and uses only allowed values | `requirements-formalizer` |

### Scope `test-design`
| Gate | Rule | Owner on failure |
|---|---|---|
| G1 | Every `AC-<n>` is covered by at least one test case | `functional-test-planner` |
| G2 | No orphan test cases: every case references an existing `AC-<n>` or `IA-<n>` | owner by ID prefix |
| G3 | Every test case has all mandatory template fields filled | owner by ID prefix |
| G4 | No duplicate test cases (same intent, steps, and expected result) | owner by ID prefix of the duplicate reported by the validator |
| G5 | Every `AC-<n>` has at least one positive and one negative case, unless the AC is marked `Negative testing: not applicable` with a reason | `negative-test-planner` |
| G6 | All IDs are unique and match `TC-(FUN\|NEG\|EDGE\|REG)-NNN` | owner by ID prefix |
| G7 | Every standards-based test case has a real `Source` link | owner by ID prefix |
| G8 | When the regression analyzer is selected, every impacted area `IA-<n>` has at least one `TC-REG` case | `regression-impact-analyzer` |
| G9 | The coverage matrix matches the planner artifacts (same IDs and counts) | `coverage-aggregator` |

### Scope `suite`
| Gate | Rule | Owner on failure |
|---|---|---|
| S1 | The suite contains every validated test case exactly once, with unchanged IDs | `test-suite-builder` |
| S2 | The suite follows the document structure from `test-case-template-formatter`, with sections in the fixed order | `test-suite-builder` |
| S3 | On a revision: every item of the latest review feedback is addressed and listed in the change log | `test-suite-builder` |

## Targeted retry

- On a gate failure, the coordinator re-runs **only** the owner agents named in the validation report, passing them the relevant findings.
- Downstream artifacts of re-run agents are then regenerated in order: planner → `coverage-aggregator` → `validator`; `test-suite-builder` → `validator` (scope `suite`).
- Each scope allows at most **3 retries** after the initial validation. Attempts are counted in `workflow-state.json` and each attempt produces its own `07-validation-<scope>-attempt-<n>.md`.
- If a scope still fails after the 3rd retry, the coordinator stops all dependent steps, sets the run status to `failed`, and reports the failing gates, findings, and owners to the user.

## Human approval

- After `validate-suite` passes, the coordinator presents a summary of `08-test-suite.md` and asks the user to reply with exactly one of:
  - `APPROVE <run-id>`
  - `REJECT <run-id>: <feedback>`
- The `approval-recorder` hook (UserPromptSubmit) writes `approval.json` deterministically: decision, timestamp, feedback, and the sha256 of the current `08-test-suite.md`. The model never writes `approval.json`.
- On `REJECT`, the coordinator saves the feedback to `09-review-feedback-rev-<n>.md` and re-runs `test-suite-builder` (and, if the feedback requires new or changed test cases, the owning planners and their downstream steps), then re-validates and asks for approval again.
- The `approval-gate-guard` hook (PreToolUse) blocks any write to `runs/<run-id>/output/` unless `approval.json` has decision `approved` and its sha256 matches the current `08-test-suite.md`. Any change to the draft after approval invalidates the approval.
- Output builders write files only with the Write tool, never through shell commands.

## State and resume

- `workflow-state.json` holds: run ID, issue reference, run status, execution profile, execution plan with selection reasons, per-step status (`pending`, `in_progress`, `completed`, `failed`, `skipped`), retry counters per gate scope, gate results, approval status, revision history, and the artifact registry.
- The coordinator creates and changes the file only through `node .claude/scripts/workflow-state.js <command>` (`init`, `step`, `set`, `gate`, `retry`, `invalidate`, `revision`, `verify`), before and after every step. The script and the `post-write-state` hook share a file lock and write atomically, so parallel subagents never lose updates. Direct writes to the file are blocked by `approval-gate-guard`.
- `node .claude/scripts/selftest-hooks.js` runs a self-test of the hooks and the state script on a temporary run and removes it afterwards.
- Resume with `/generate-test-cases --resume <run-id>`. The coordinator reads the state, verifies the recorded sha256 of completed artifacts, skips `completed` and `skipped` steps, and continues from the first `pending`, `in_progress`, or `failed` step. A completed step whose artifact is missing or changed is re-run together with its downstream steps.

## Secrets

- The GitHub token is read from the `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable. It is never written to any file in this repository.
- `.env` files and `.claude/settings.local.json` are git-ignored. `.env.example` documents the required variables.

## Development conventions

- One development phase per feature branch (`feature/<name>`, `docs/<name>`, `test/<name>`) merged into `main` through a pull request.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`.
