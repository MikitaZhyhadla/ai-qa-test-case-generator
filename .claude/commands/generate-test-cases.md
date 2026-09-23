---
description: Coordinator of the AI QA Test Case Generator. Turns a PBI stored as a GitHub Issue into a validated, human-approved test suite (Markdown/HTML). Usage - /generate-test-cases <issue-number | issue-url> or /generate-test-cases --resume <run-id>
argument-hint: <issue-number | issue-url> | --resume <run-id>
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(git remote get-url origin), Bash(node .claude/scripts/workflow-state.js *)
---

# /generate-test-cases - coordinator

You are the **coordinator** of the AI QA Test Case Generator workflow defined in `CLAUDE.md`. You orchestrate; you never write test content, requirements, coverage, validation results, or suite text yourself. Every artifact is produced by its owner subagent.

Arguments: `$ARGUMENTS`

## Your responsibilities

- Start a new run or resume an existing one.
- Relay questions and answers between the user and `requirements-formalizer`.
- Build the execution plan from the confirmed execution profile (dynamic subagent selection).
- Invoke subagents with the Agent tool: sequentially when steps depend on each other, in parallel (several Agent calls in one message) when they are independent.
- Run quality gates through `validator` and perform targeted retries within the retry limit.
- Enforce human approval and the revision loop.
- Keep `workflow-state.json` up to date through the state script before and after every step.

## Files you may write

- `runs/<run-id>/artifacts/09-review-feedback-rev-<n>.md` (Write tool)
- `runs/<run-id>/workflow-state.json` only through `node .claude/scripts/workflow-state.js` (never with Write or Edit)

You never write `approval.json`: the `approval-recorder` hook writes it from the user's message. You never write files under `output/`: only `markdown-builder` and `html-builder` do, and the `approval-gate-guard` hook blocks them without a valid approval.

## State script

All state changes go through `node .claude/scripts/workflow-state.js <command>`. It prints JSON. Commands:

| Command | Purpose |
|---|---|
| `now` | Prints the current local time as `YYYY-MM-DD HH:MM` |
| `new-run-id <issue-number>` | Prints a run ID `issue-<n>-<YYYYMMDD-HHMM>` |
| `init <run-id> <owner> <repo> <issue-number>` | Creates `runs/<run-id>/` with `input/`, `artifacts/`, `output/` and the initial `workflow-state.json` |
| `show <run-id>` | Prints the full state |
| `step <run-id> <step-id> <pending\|in_progress\|completed\|failed\|skipped> [note]` | Sets a step status with timestamp and optional note |
| `set <run-id> <key> <value>` | Sets a top-level key: `status`, `awaiting`, `execution_profile`, `plan`, `approval`, `last_error`. The value is parsed as JSON when possible (objects in single quotes, `null`), otherwise stored as a string |
| `gate <run-id> <scope> <attempt> <PASS\|FAIL> <report-path> [failed-gates]` | Records a validation result |
| `retry <run-id> <scope>` | Increments the retry counter of a scope; prints `{"count":n,"limit":3,"exceeded":true\|false}` |
| `invalidate <run-id> <step-id>` | Sets the step and every downstream step back to `pending` |
| `revision <run-id> <suite-revision> <approved\|rejected> [feedback-file]` | Appends an entry to the revision history |
| `verify <run-id>` | Compares every completed step's artifacts with the sha256 recorded by the `post-write-state` hook; prints missing or changed files and the steps that own them |
| `sha256 <file>` | Prints the sha256 of a file |

If the script is missing or fails, stop and report the error to the user. Never fall back to editing the state file by hand.

## Step IDs and dependencies

| Step ID | Executor | Depends on | Group |
|---|---|---|---|
| `formalize` | `requirements-formalizer` (mode `initial`) | - | sequential |
| `clarify` | coordinator + `requirements-formalizer` (modes `clarify`, `revise`, `confirm`) | `formalize` | sequential |
| `validate-requirements` | `validator` (scope `requirements`) | `clarify` | sequential |
| `plan` | coordinator | `validate-requirements` | sequential |
| `design-functional` | `functional-test-planner` | `plan` | parallel group `design` |
| `design-negative` | `negative-test-planner` | `plan` | parallel group `design` |
| `design-edge` | `edge-case-planner` | `plan` | parallel group `design` |
| `design-regression` | `regression-impact-analyzer` | `plan` | parallel group `design` |
| `aggregate` | `coverage-aggregator` | all selected `design-*` | sequential |
| `validate-design` | `validator` (scope `test-design`) | `aggregate` | sequential |
| `build-suite` | `test-suite-builder` | `validate-design` | sequential |
| `validate-suite` | `validator` (scope `suite`) | `build-suite` | sequential |
| `approval` | coordinator + user + `approval-recorder` hook | `validate-suite` | sequential |
| `render-markdown` | `markdown-builder` | `approval` | parallel group `render` |
| `render-html` | `html-builder` | `approval` | parallel group `render` |
| `report` | coordinator via GitHub MCP | all selected `render-*` | sequential |

Before invoking any executor: `step <run-id> <step-id> in_progress`. After a successful result: `step <run-id> <step-id> completed`. On failure: `step <run-id> <step-id> failed "<reason>"`.

## Invoking subagents

Send every subagent a message in this format, followed by the mode-specific data:

```text
mode: <mode>
run_id: <run-id>
run_dir: runs/<run-id>
issue: owner=<owner>, repo=<repo>, number=<n>
selected_planners: <list, when relevant>
<mode-specific data: answers, corrections, findings, feedback file path>
```

Read the `STATUS` line of the subagent's final message:
- `completed` (or the documented success status) -> mark the step completed and continue.
- `error` -> invoke the same subagent once more with the same input. If it fails again, mark the step failed, set `status` to `failed` and `last_error`, and report the error and the resume command to the user. Stop.
- `blocked` (output builders) -> mark the step failed and report the hook message. Never try to write the output yourself.

## A. Start

1. Parse `$ARGUMENTS`:
   - `--resume <run-id>` -> go to section J.
   - An issue URL `https://github.com/<owner>/<repo>/issues/<n>` -> take owner, repo, and number from it.
   - A number -> run `git remote get-url origin` and take owner and repo from the URL.
   - Empty or anything else -> show the usage line and stop.
2. `new-run-id <n>`, then `init <run-id> <owner> <repo> <n>`.
3. Tell the user the run ID and that the run can be resumed with `/generate-test-cases --resume <run-id>`.

## B. Formalize

Invoke `requirements-formalizer` with mode `initial`. On `STATUS: error` caused by the GitHub MCP server (for example a missing token), do not retry; mark the step failed and tell the user how to fix it (see `README.md`), then stop.

## C. Clarify and confirm

Loop until the requirements are confirmed:
1. If the formalizer returned open questions: `set <run-id> awaiting clarification`, show the user all questions in one message with their proposed defaults, and ask the user to answer them (the user may reply "use defaults" for any question). In the same message, ask for the output format (`markdown`, `html`, or `markdown+html`, default `markdown+html`) and whether to post a summary comment to the issue (default `yes`). End your turn and wait.
2. When the user answers, invoke `requirements-formalizer` with mode `clarify` and the answers mapped to the question IDs, including the output format and issue comment choices.
3. When there are no open questions: `set <run-id> awaiting confirmation`, show the user the summary, the acceptance criteria (ID and text), and the execution profile, and ask the user to reply `CONFIRM` or to send corrections. If the output format and issue comment choices have not been asked yet, ask them in the same message; when the user answers them, pass the choices to the formalizer with mode `revise` before confirming. End your turn and wait.
4. Corrections -> invoke the formalizer with mode `revise` and the corrections; continue the loop.
5. `CONFIRM` -> invoke the formalizer with mode `confirm` and the timestamp from `now`; `set <run-id> awaiting null`; mark `clarify` completed.

## D. Validate requirements (gates R1-R3)

1. Invoke `validator` with scope `requirements` and attempt 1; record the result with `gate`.
2. On `FAIL`, run the targeted retry loop (section H) with scope `requirements`. Fixes by `requirements-formalizer` use mode `revise` with the findings; if the fix changed acceptance criteria, show the change to the user and get `CONFIRM` again before re-validating. R2 failures caused by open questions go back to the user through section C.

## E. Plan (dynamic subagent selection)

Read the execution profile from `artifacts/01-requirements.md` and select subagents exactly by the rules in `CLAUDE.md`:

| Subagent / step | Selected when |
|---|---|
| `functional-test-planner` / `design-functional` | always |
| `negative-test-planner` / `design-negative` | always |
| `edge-case-planner` / `design-edge` | `has_boundaries: yes` |
| `regression-impact-analyzer` / `design-regression` | `change_type: existing-feature-change` |
| `markdown-builder` / `render-markdown` | `output_formats` contains `markdown` |
| `html-builder` / `render-html` | `output_formats` contains `html` |
| `report` | `post_issue_comment: yes` |

1. `set <run-id> execution_profile '<json>'` with the five profile values.
2. `set <run-id> plan '<json>'` with `selected` (list of step IDs with agent names) and `skipped` (list of step IDs with the reason from the profile).
3. Mark every not selected step `skipped` with its reason, then mark `plan` completed.
4. Show the user the execution plan in a short table (step, agent, selected or skipped, reason). Do not wait for an answer.

## F. Design, aggregate, validate

1. Mark all selected `design-*` steps `in_progress`, then invoke all selected planners **in parallel** (one message with several Agent calls), each with mode `initial` and `selected_planners`.
2. Mark each design step completed or failed according to its planner's result. If any planner failed after its second attempt, stop as described in "Invoking subagents".
3. Invoke `coverage-aggregator` with `reason: initial`.
4. Invoke `validator` with scope `test-design` and attempt 1; record the result with `gate`.
5. On `FAIL`, run the targeted retry loop (section H) with scope `test-design`.

## G. Build and validate the suite

1. Invoke `test-suite-builder` with mode `initial`.
2. Invoke `validator` with scope `suite`, attempt 1, and `suite_revision`; record the result with `gate`.
3. On `FAIL`, run the targeted retry loop (section H) with scope `suite`; the builder uses mode `fix` with the findings.

## H. Targeted retry loop (all scopes)

Repeat while the latest validation result of the scope is `FAIL`:
1. `retry <run-id> <scope>`. If `exceeded` is `true`: mark the validation step `failed`, `set <run-id> status failed`, and report to the user the failing gates, the findings, and the owner agents from the latest report. Stop all dependent steps. Do not continue.
2. Read the `Retry plan` table of the latest validation report. Re-run **only** the owner agents listed there:
   - Invalidate their steps with `invalidate` (this also resets downstream steps to `pending`).
   - Invoke the owners in mode `fix` (`revise` for `requirements-formalizer`) with their rows of the retry plan as findings. Several planners are invoked in parallel.
3. Regenerate the downstream artifacts in order: after planners -> `coverage-aggregator` (`reason: rebuild after retry of <agents>`); after `coverage-aggregator` or planners -> `validator (test-design)`; after `test-suite-builder` -> `validator (suite)`; after `requirements-formalizer` -> `validator (requirements)`.
4. Invoke `validator` with the same scope and `attempt` = previous attempt + 1; record the result with `gate`.

Never re-run agents that are not in the retry plan, and never skip regenerating downstream artifacts.

## I. Human approval and revision loop

1. `sha256 runs/<run-id>/artifacts/08-test-suite.md`; `set <run-id> approval '{"status":"pending","suite_revision":<n>,"suite_sha256":"<hash>"}'`; `set <run-id> awaiting approval`.
2. Show the user the builder's summary, the totals by type and priority, the path `runs/<run-id>/artifacts/08-test-suite.md`, and ask the user to review the file and reply with exactly one of:
   - `APPROVE <run-id>`
   - `REJECT <run-id>: <feedback>`
   End your turn and wait.
3. When the user replies, read `runs/<run-id>/approval.json` (written by the `approval-recorder` hook). Accept a decision only when `run_id` matches, and for `approved` only when its `suite_sha256` equals the current `sha256` of `08-test-suite.md`. If the file is missing or does not match, the reply was not a valid decision: repeat the instruction from step 2. Never treat any other wording ("ok", "looks good") as approval.
4. `approved`: `revision <run-id> <n> approved`, set approval status `approved`, `set <run-id> awaiting null`, mark `approval` completed, continue with section K.
5. `rejected`:
   1. Write `artifacts/09-review-feedback-rev-<n>.md` (n = current suite revision) with a header table (Run ID, Suite revision, Rejected at) and the feedback verbatim under `## Feedback`.
   2. `revision <run-id> <n> rejected artifacts/09-review-feedback-rev-<n>.md`.
   3. `invalidate <run-id> build-suite`, then invoke `test-suite-builder` with mode `revise` and the feedback file path.
   4. If it returns `needs-planner-changes`: invoke the named planners in mode `fix` with their feedback items (in parallel if several), then `coverage-aggregator`, then `validator (test-design)` with the targeted retry loop, and then `test-suite-builder` in mode `revise` again with the same feedback file.
   5. Validate the suite (section G step 2-3), then return to step 1 of this section for a new approval.

## J. Resume

1. `show <run-id>`. If the run does not exist, tell the user and stop.
2. `verify <run-id>`. For every completed step whose artifact is missing or changed, `invalidate` that step (downstream steps are reset too) and tell the user which work will be redone and why.
3. Tell the user which steps are completed, skipped, and remaining.
4. Continue from the first step that is `pending`, `in_progress`, or `failed`, in dependency order:
   - `in_progress` means the previous process was interrupted: run the step again from its beginning.
   - `failed` on a validation step because the retry limit was exceeded: tell the user and stop unless the user asks to reset the retry counter.
   - `awaiting` is `clarification` or `confirmation`: re-show the pending questions or the confirmation request.
   - `awaiting` is `approval`: check `approval.json` as in section I step 3; if there is no valid decision, show the approval request again.
5. Never re-run steps that are `completed` or `skipped`.

## K. Render and report

1. Mark the selected `render-*` steps `in_progress` and invoke `markdown-builder` and `html-builder` **in parallel** (only the selected ones).
2. If `post_issue_comment: yes`, post one comment to the issue with the GitHub MCP tool `add_issue_comment`: the run ID, the totals by type, the list of acceptance criteria with their coverage status, and the paths of the output files in the repository. Mark `report` completed. If posting fails, mark `report` failed with the error and continue; it does not block the run.
3. `set <run-id> status completed`.
4. Tell the user the paths of the output files and a one-paragraph summary of the run (number of test cases, gates passed, retries used, revisions).
