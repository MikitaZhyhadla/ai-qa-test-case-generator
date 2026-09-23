#!/usr/bin/env node
'use strict';
// Deterministic CLI for runs/<run-id>/workflow-state.json.
// The /generate-test-cases coordinator changes the state only through this script.
// Every command prints JSON to stdout. Exit code 0 = success, 1 = error.

const fs = require('fs');
const path = require('path');
const lib = require('../lib/workflow-lib.js');

const SETTABLE_KEYS = ['status', 'awaiting', 'execution_profile', 'plan', 'approval', 'last_error'];
const RUN_STATUSES = ['in_progress', 'failed', 'completed'];

function print(value) {
  process.stdout.write(JSON.stringify(value, null, 2) + '\n');
}

function fail(message) {
  print({ ok: false, error: message });
  process.exit(1);
}

function need(args, count, usage) {
  if (args.length < count) fail(`Usage: ${usage}`);
}

function parseValue(raw) {
  try {
    return JSON.parse(raw);
  } catch (_) {
    return raw;
  }
}

function checkStep(stepId) {
  if (!lib.STEP_IDS.includes(stepId)) fail(`Unknown step "${stepId}". Allowed: ${lib.STEP_IDS.join(', ')}`);
}

function checkScope(scope) {
  if (!lib.GATE_SCOPES.includes(scope)) fail(`Unknown scope "${scope}". Allowed: ${lib.GATE_SCOPES.join(', ')}`);
}

const commands = {
  now() {
    print({ ok: true, now: lib.nowLocal() });
  },

  'new-run-id'(args) {
    need(args, 1, 'new-run-id <issue-number>');
    const n = args[0];
    if (!/^\d+$/.test(n)) fail(`Issue number must be numeric, got "${n}"`);
    const base = `issue-${n}-${lib.compactLocal()}`;
    let runId = base;
    for (let i = 2; fs.existsSync(path.join(lib.RUNS_DIR, runId)); i++) runId = `${base}-${i}`;
    print({ ok: true, run_id: runId });
  },

  init(args) {
    need(args, 4, 'init <run-id> <owner> <repo> <issue-number>');
    const [runId, owner, repo, n] = args;
    if (!lib.isValidRunId(runId)) fail(`Invalid run ID "${runId}"`);
    if (!/^\d+$/.test(n)) fail(`Issue number must be numeric, got "${n}"`);
    const dir = lib.runDir(runId);
    if (fs.existsSync(lib.statePath(runId))) fail(`Run ${runId} already exists`);
    for (const sub of ['input', 'artifacts', 'output']) fs.mkdirSync(path.join(dir, sub), { recursive: true });
    const state = lib.createInitialState(runId, owner, repo, n);
    lib.writeJsonAtomic(lib.statePath(runId), state);
    print({ ok: true, run_id: runId, run_dir: `runs/${runId}`, state_file: `runs/${runId}/workflow-state.json` });
  },

  show(args) {
    need(args, 1, 'show <run-id>');
    try {
      print({ ok: true, state: lib.readState(args[0]) });
    } catch (err) {
      fail(err.message);
    }
  },

  step(args) {
    need(args, 3, 'step <run-id> <step-id> <status> [note]');
    const [runId, stepId, status] = args;
    const note = args.slice(3).join(' ') || null;
    checkStep(stepId);
    if (!lib.STEP_STATUSES.includes(status)) fail(`Unknown status "${status}". Allowed: ${lib.STEP_STATUSES.join(', ')}`);
    const at = lib.isoNow();
    const step = lib.updateState(runId, (state) => {
      const s = state.steps[stepId];
      s.status = status;
      s.updated_at = at;
      s.note = note;
      s.history.push({ status, at, note });
      state.current_step = status === 'in_progress' ? stepId : state.current_step || null;
      return s;
    });
    print({ ok: true, step: stepId, status: step.status, note: step.note });
  },

  set(args) {
    need(args, 3, 'set <run-id> <key> <value>');
    const [runId, key] = args;
    if (!SETTABLE_KEYS.includes(key)) fail(`Key "${key}" cannot be set. Allowed: ${SETTABLE_KEYS.join(', ')}`);
    const value = parseValue(args.slice(2).join(' '));
    if (key === 'status' && !RUN_STATUSES.includes(value)) fail(`Run status must be one of: ${RUN_STATUSES.join(', ')}`);
    if (key === 'awaiting' && ![null, 'clarification', 'confirmation', 'approval'].includes(value)) {
      fail('awaiting must be null, clarification, confirmation, or approval');
    }
    lib.updateState(runId, (state) => {
      state[key] = value;
    });
    print({ ok: true, key, value });
  },

  gate(args) {
    need(args, 5, 'gate <run-id> <scope> <attempt> <PASS|FAIL> <report-path> [failed-gates]');
    const [runId, scope, attempt, result, report] = args;
    checkScope(scope);
    if (!['PASS', 'FAIL'].includes(result)) fail('Result must be PASS or FAIL');
    const failed = (args[5] || '')
      .split(',')
      .map((g) => g.trim())
      .filter((g) => g && g.toLowerCase() !== 'none');
    const entry = { attempt: Number(attempt), result, report, failed_gates: failed, at: lib.isoNow() };
    lib.updateState(runId, (state) => {
      state.gates[scope].push(entry);
    });
    print({ ok: true, scope, ...entry });
  },

  retry(args) {
    need(args, 2, 'retry <run-id> <scope>');
    const [runId, scope] = args;
    checkScope(scope);
    const out = lib.updateState(runId, (state) => {
      state.retries[scope] += 1;
      const count = state.retries[scope];
      return { count, limit: state.retry_limit, exceeded: count > state.retry_limit };
    });
    print({ ok: true, scope, ...out });
  },

  invalidate(args) {
    need(args, 2, 'invalidate <run-id> <step-id>');
    const [runId, stepId] = args;
    checkStep(stepId);
    const planIndex = lib.STEP_IDS.indexOf('plan');
    const resetSkipped = lib.STEP_IDS.indexOf(stepId) <= planIndex;
    const targets = [stepId, ...lib.downstreamSteps(stepId)];
    const at = lib.isoNow();
    const changed = lib.updateState(runId, (state) => {
      const list = [];
      for (const id of targets) {
        const s = state.steps[id];
        if (s.status === 'skipped' && !resetSkipped) continue;
        if (s.status === 'pending') continue;
        s.status = 'pending';
        s.updated_at = at;
        s.note = `invalidated by ${stepId}`;
        s.history.push({ status: 'pending', at, note: s.note });
        list.push(id);
      }
      return list;
    });
    print({ ok: true, invalidated_from: stepId, reset_to_pending: changed });
  },

  revision(args) {
    need(args, 3, 'revision <run-id> <suite-revision> <approved|rejected> [feedback-file]');
    const [runId, rev, decision, feedbackFile] = args;
    if (!['approved', 'rejected'].includes(decision)) fail('Decision must be approved or rejected');
    const entry = { suite_revision: Number(rev), decision, feedback_file: feedbackFile || null, at: lib.isoNow() };
    lib.updateState(runId, (state) => {
      state.revisions.push(entry);
    });
    print({ ok: true, ...entry });
  },

  verify(args) {
    need(args, 1, 'verify <run-id>');
    const runId = args[0];
    let state;
    try {
      state = lib.readState(runId);
    } catch (err) {
      fail(err.message);
    }
    const problems = [];
    for (const [file, record] of Object.entries(state.artifacts || {})) {
      const step = record.step || lib.stepForArtifact(file);
      if (!step || state.steps[step].status !== 'completed') continue;
      const abs = path.join(lib.runDir(runId), file);
      if (!fs.existsSync(abs)) {
        problems.push({ file, step, problem: 'missing' });
      } else if (lib.sha256File(abs) !== record.sha256) {
        problems.push({ file, step, problem: 'changed since it was written by the workflow' });
      }
    }
    const steps = [...new Set(problems.map((p) => p.step))].sort(
      (a, b) => lib.STEP_IDS.indexOf(a) - lib.STEP_IDS.indexOf(b)
    );
    print({ ok: true, consistent: problems.length === 0, problems, steps_to_invalidate: steps });
  },

  sha256(args) {
    need(args, 1, 'sha256 <file>');
    const file = path.resolve(process.cwd(), args[0]);
    if (!fs.existsSync(file)) fail(`File not found: ${args[0]}`);
    print({ ok: true, file: args[0], sha256: lib.sha256File(file) });
  },
};

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || !commands[command]) {
    fail(`Unknown command "${command || ''}". Commands: ${Object.keys(commands).join(', ')}`);
  }
  try {
    commands[command](args);
  } catch (err) {
    fail(err.message);
  }
}

main();
