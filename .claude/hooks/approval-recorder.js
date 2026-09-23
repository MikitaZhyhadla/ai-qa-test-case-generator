#!/usr/bin/env node
'use strict';
// UserPromptSubmit hook: approval-recorder
//
// Deterministically records the human decision for a run. Recognized user messages (whole message):
//   APPROVE <run-id>
//   REJECT <run-id>: <feedback>
// The decision is recorded only when the run is waiting for approval and the draft
// (artifacts/08-test-suite.md) is exactly the version that was presented for approval.
// The result is written to runs/<run-id>/approval.json with the sha256 of the draft.
// The hook never blocks the prompt; it adds a short note to the context instead.

const fs = require('fs');
const lib = require('../lib/workflow-lib.js');

const APPROVE_RE = /^APPROVE\s+([A-Za-z0-9][A-Za-z0-9._-]*)\s*$/;
const REJECT_RE = /^REJECT\s+([A-Za-z0-9][A-Za-z0-9._-]*)\s*:\s*([\s\S]+)$/;

function addContext(text) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: `approval-recorder: ${text}`,
      },
    })
  );
}

function record(runId, decision, feedback) {
  if (!fs.existsSync(lib.statePath(runId))) {
    return `NOT recorded - run ${runId} does not exist.`;
  }
  const state = lib.readState(runId);
  if (state.awaiting !== 'approval') {
    return `NOT recorded - run ${runId} is not waiting for approval (awaiting = ${JSON.stringify(state.awaiting)}).`;
  }
  const suiteFile = lib.suitePath(runId);
  if (!fs.existsSync(suiteFile)) {
    return `NOT recorded - artifacts/08-test-suite.md of run ${runId} does not exist.`;
  }
  const sha = lib.sha256File(suiteFile);
  const presented = state.approval && state.approval.suite_sha256;
  if (presented && presented !== sha) {
    return `NOT recorded - 08-test-suite.md changed after it was presented for approval. Present the current draft again.`;
  }

  const approvalFile = lib.approvalPath(runId);
  let history = [];
  if (fs.existsSync(approvalFile)) {
    try {
      const previous = lib.readJson(approvalFile);
      history = Array.isArray(previous.history) ? previous.history : [];
      const { history: _ignored, ...last } = previous;
      history.push(last);
    } catch (_) {
      history = [];
    }
  }
  const entry = {
    run_id: runId,
    decision,
    feedback: feedback || null,
    decided_at: lib.isoNow(),
    decided_at_local: lib.nowLocal(),
    suite_revision: state.approval ? state.approval.suite_revision || null : null,
    suite_sha256: sha,
    recorded_by: 'approval-recorder hook (UserPromptSubmit)',
    history,
  };
  lib.withLock(runId, () => lib.writeJsonAtomic(approvalFile, entry));
  return `recorded decision "${decision}" for run ${runId} (suite revision ${entry.suite_revision}, sha256 ${sha.slice(0, 12)}...). Read runs/${runId}/approval.json and continue the approval step of /generate-test-cases.`;
}

function main() {
  let input;
  try {
    input = lib.readStdinJson();
  } catch (_) {
    return;
  }
  const prompt = String(input.prompt || '').trim();
  let m = APPROVE_RE.exec(prompt);
  if (m) {
    addContext(record(m[1], 'approved', null));
    return;
  }
  m = REJECT_RE.exec(prompt);
  if (m) {
    addContext(record(m[1], 'rejected', m[2].trim()));
  }
}

try {
  main();
} catch (err) {
  addContext(`NOT recorded - internal error: ${err.message}`);
}
process.exit(0);
