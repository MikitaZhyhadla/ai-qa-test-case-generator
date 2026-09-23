#!/usr/bin/env node
'use strict';
// PostToolUse hook: post-write-state
//
// After every successful Write/Edit/MultiEdit of a file inside runs/<run-id>/, records the file in
// the "artifacts" section of runs/<run-id>/workflow-state.json: sha256, time, tool, the owning step,
// and the subagent that wrote it. The coordinator's resume logic ("verify") relies on these records.
// The hook never blocks and never fails the tool call.

const fs = require('fs');
const path = require('path');
const lib = require('../lib/workflow-lib.js');

function main() {
  let input;
  try {
    input = lib.readStdinJson();
  } catch (_) {
    return;
  }
  const toolInput = input.tool_input || {};
  const rel = lib.toProjectRelative(toolInput.file_path, input.cwd);
  const parsed = lib.parseRunPath(rel);
  if (!parsed) return;

  const { runId, relativeToRun } = parsed;
  if (['workflow-state.json', 'approval.json'].includes(relativeToRun)) return;
  if (relativeToRun.startsWith('.state.lock')) return;
  if (!fs.existsSync(lib.statePath(runId))) return;

  const abs = path.join(lib.runDir(runId), relativeToRun);
  if (!fs.existsSync(abs)) return;

  const record = {
    sha256: lib.sha256File(abs),
    written_at: lib.isoNow(),
    tool: input.tool_name || null,
    step: lib.stepForArtifact(relativeToRun),
    agent: input.agent_type || 'coordinator',
  };
  lib.updateState(runId, (state) => {
    state.artifacts = state.artifacts || {};
    const previous = state.artifacts[relativeToRun];
    record.writes = previous && previous.writes ? previous.writes + 1 : 1;
    state.artifacts[relativeToRun] = record;
  });
}

try {
  main();
} catch (err) {
  // Never break the workflow because of bookkeeping; report to the transcript instead.
  process.stderr.write(`post-write-state: ${err.message}\n`);
}
process.exit(0);
