#!/usr/bin/env node
'use strict';
// PreToolUse hook: approval-gate-guard
//
// 1. Blocks every write to runs/<run-id>/output/ unless approval.json records the decision
//    "approved" for that run AND its suite_sha256 equals the sha256 of the current
//    artifacts/08-test-suite.md (any change after approval invalidates it).
// 2. Blocks direct writes to runs/<run-id>/approval.json (only the approval-recorder hook writes it).
// 3. Blocks direct writes to runs/<run-id>/workflow-state.json (only the state script and the
//    post-write-state hook change it).
// 4. Blocks shell commands that touch these files, so the rules cannot be bypassed through Bash.

const fs = require('fs');
const lib = require('../lib/workflow-lib.js');

const FILE_TOOLS = ['Write', 'Edit', 'MultiEdit', 'NotebookEdit'];
const SHELL_TOOLS = ['Bash', 'PowerShell'];
const STATE_SCRIPT = /^\s*node\s+["']?(\.\/)?\.claude[\\/]scripts[\\/]workflow-state\.js["']?(\s|$)/;

function deny(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `approval-gate-guard: ${reason}`,
      },
    })
  );
  process.exit(0);
}

function allowByDefault() {
  // No decision: the normal permission flow continues.
  process.exit(0);
}

function checkApproval(runId) {
  const approvalFile = lib.approvalPath(runId);
  const suiteFile = lib.suitePath(runId);
  if (!fs.existsSync(approvalFile)) {
    return `final output for run ${runId} requires human approval, but approval.json does not exist. Ask the user to reply "APPROVE ${runId}".`;
  }
  let approval;
  try {
    approval = lib.readJson(approvalFile);
  } catch (err) {
    return `approval.json of run ${runId} is not valid JSON (${err.message}).`;
  }
  if (approval.run_id !== runId) {
    return `approval.json belongs to run "${approval.run_id}", not to run ${runId}.`;
  }
  if (approval.decision !== 'approved') {
    return `the latest decision for run ${runId} is "${approval.decision}", not "approved".`;
  }
  if (!fs.existsSync(suiteFile)) {
    return `artifacts/08-test-suite.md of run ${runId} does not exist.`;
  }
  const current = lib.sha256File(suiteFile);
  if (current !== approval.suite_sha256) {
    return `08-test-suite.md of run ${runId} changed after it was approved (approved sha256 ${String(approval.suite_sha256).slice(0, 12)}..., current ${current.slice(0, 12)}...). A new approval is required.`;
  }
  return null;
}

function checkFileTool(input) {
  const toolInput = input.tool_input || {};
  const filePath = toolInput.file_path || toolInput.notebook_path;
  const rel = lib.toProjectRelative(filePath, input.cwd);
  const parsed = lib.parseRunPath(rel);
  if (!parsed) allowByDefault();

  const { runId, relativeToRun } = parsed;
  if (relativeToRun === 'approval.json') {
    deny('approval.json is written only by the approval-recorder hook from the user\'s "APPROVE <run-id>" or "REJECT <run-id>: <feedback>" message. The model must never write it.');
  }
  if (relativeToRun === 'workflow-state.json') {
    deny('workflow-state.json is changed only through "node .claude/scripts/workflow-state.js <command>" and the post-write-state hook.');
  }
  if (relativeToRun.startsWith('output/')) {
    const problem = checkApproval(runId);
    if (problem) deny(problem);
    allowByDefault();
  }
  allowByDefault();
}

function checkShellTool(input) {
  const command = String((input.tool_input || {}).command || '');
  if (STATE_SCRIPT.test(command) && !/[;&|>`]/.test(command.replace(STATE_SCRIPT, ''))) {
    allowByDefault();
  }
  if (/approval\.json/i.test(command)) {
    deny('shell commands must not read or write approval.json. Use the Read tool to read it; only the approval-recorder hook writes it.');
  }
  if (/workflow-state\.json/i.test(command)) {
    deny('shell commands must not touch workflow-state.json. Use "node .claude/scripts/workflow-state.js <command>".');
  }
  if (/runs[\\/][^\s"']*[\\/]output([\\/]|\b)/i.test(command)) {
    deny('final output files must be written only with the Write tool by markdown-builder or html-builder after approval.');
  }
  allowByDefault();
}

function main() {
  let input;
  try {
    input = lib.readStdinJson();
  } catch (err) {
    // Unreadable input: fail closed.
    deny(`could not parse hook input (${err.message}).`);
  }
  const tool = input.tool_name;
  try {
    if (FILE_TOOLS.includes(tool)) checkFileTool(input);
    if (SHELL_TOOLS.includes(tool)) checkShellTool(input);
  } catch (err) {
    deny(`internal error while checking the approval gate (${err.message}).`);
  }
  allowByDefault();
}

main();
