#!/usr/bin/env node
'use strict';
// Self-test for the workflow hooks and the state script.
// Creates a temporary run "selftest-hooks", feeds simulated hook inputs to every hook,
// checks the decisions, and deletes the temporary run. Usage: node .claude/scripts/selftest-hooks.js

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const lib = require('../lib/workflow-lib.js');

const RUN = 'selftest-hooks';
const ROOT = lib.PROJECT_ROOT;
const HOOKS = path.join(ROOT, '.claude', 'hooks');
const STATE_CLI = path.join(ROOT, '.claude', 'scripts', 'workflow-state.js');
const runRel = (p) => `runs/${RUN}/${p}`;
const runAbs = (p) => path.join(lib.runDir(RUN), p);

let passed = 0;
let failed = 0;

function hook(name, input) {
  const res = spawnSync(process.execPath, [path.join(HOOKS, name)], {
    input: JSON.stringify({ cwd: ROOT, ...input }),
    encoding: 'utf8',
  });
  const out = res.stdout.trim();
  return { code: res.status, json: out ? JSON.parse(out) : null };
}

function cli(...args) {
  const res = spawnSync(process.execPath, [STATE_CLI, ...args], { cwd: ROOT, encoding: 'utf8' });
  return JSON.parse(res.stdout);
}

function denied(result) {
  return Boolean(result.json && result.json.hookSpecificOutput && result.json.hookSpecificOutput.permissionDecision === 'deny');
}

function check(name, condition) {
  if (condition) {
    passed++;
    console.log(`PASS  ${name}`);
  } else {
    failed++;
    console.log(`FAIL  ${name}`);
  }
}

function writeTool(file) {
  return { tool_name: 'Write', tool_input: { file_path: path.join(ROOT, file), content: 'x' } };
}

function main() {
  fs.rmSync(lib.runDir(RUN), { recursive: true, force: true });
  cli('init', RUN, 'demo-owner', 'demo-repo', '1');

  // approval-gate-guard
  check('guard allows a normal artifact write', !denied(hook('approval-gate-guard.js', writeTool(runRel('artifacts/02-functional-tests.md')))));
  check('guard allows files outside runs/', !denied(hook('approval-gate-guard.js', writeTool('README.md'))));
  check('guard blocks output without approval', denied(hook('approval-gate-guard.js', writeTool(runRel('output/test-suite.md')))));
  check('guard blocks direct write of approval.json', denied(hook('approval-gate-guard.js', writeTool(runRel('approval.json')))));
  check('guard blocks direct write of workflow-state.json', denied(hook('approval-gate-guard.js', writeTool(runRel('workflow-state.json')))));
  check('guard allows the state script in Bash', !denied(hook('approval-gate-guard.js', { tool_name: 'Bash', tool_input: { command: `node .claude/scripts/workflow-state.js show ${RUN}` } })));
  check('guard blocks shell writes to output', denied(hook('approval-gate-guard.js', { tool_name: 'Bash', tool_input: { command: `echo x > ${runRel('output/test-suite.md')}` } })));
  check('guard blocks shell access to approval.json', denied(hook('approval-gate-guard.js', { tool_name: 'Bash', tool_input: { command: `cp a.json ${runRel('approval.json')}` } })));

  // post-write-state
  fs.writeFileSync(runAbs('artifacts/02-functional-tests.md'), '# Functional Test Cases\n');
  hook('post-write-state.js', { ...writeTool(runRel('artifacts/02-functional-tests.md')), agent_type: 'functional-test-planner' });
  const registry = lib.readState(RUN).artifacts['artifacts/02-functional-tests.md'];
  check('post-write-state records sha256, step and agent', Boolean(registry && registry.sha256 && registry.step === 'design-functional' && registry.agent === 'functional-test-planner'));

  // approval-recorder
  fs.writeFileSync(runAbs('artifacts/08-test-suite.md'), '# Test Suite - Demo\n');
  let r = hook('approval-recorder.js', { prompt: `APPROVE ${RUN}` });
  check('recorder ignores APPROVE when the run is not awaiting approval', !fs.existsSync(runAbs('approval.json')) && /NOT recorded/.test(r.json.hookSpecificOutput.additionalContext));
  const sha = cli('sha256', runRel('artifacts/08-test-suite.md')).sha256;
  cli('set', RUN, 'approval', JSON.stringify({ status: 'pending', suite_revision: 1, suite_sha256: sha }));
  cli('set', RUN, 'awaiting', 'approval');
  check('recorder ignores ordinary messages', hook('approval-recorder.js', { prompt: 'looks good' }).json === null);
  r = hook('approval-recorder.js', { prompt: `APPROVE ${RUN}\n\nselected editor text` });
  check('recorder explains a decision that is not exactly formatted', !fs.existsSync(runAbs('approval.json')) && /NOT recorded/.test(r.json.hookSpecificOutput.additionalContext));
  hook('approval-recorder.js', { prompt: `REJECT ${RUN}: Add a locked account case.` });
  check('recorder records REJECT with feedback', lib.readJson(runAbs('approval.json')).decision === 'rejected');
  check('guard blocks output after REJECT', denied(hook('approval-gate-guard.js', writeTool(runRel('output/test-suite.md')))));
  hook('approval-recorder.js', { prompt: `APPROVE ${RUN}` });
  const approval = lib.readJson(runAbs('approval.json'));
  check('recorder records APPROVE with the draft sha256', approval.decision === 'approved' && approval.suite_sha256 === sha && approval.history.length === 1);
  check('guard allows output after APPROVE', !denied(hook('approval-gate-guard.js', writeTool(runRel('output/test-suite.html')))));
  fs.appendFileSync(runAbs('artifacts/08-test-suite.md'), 'changed after approval\n');
  check('guard blocks output when the draft changed after APPROVE', denied(hook('approval-gate-guard.js', writeTool(runRel('output/test-suite.md')))));

  // state script
  const retries = [1, 2, 3, 4].map(() => cli('retry', RUN, 'test-design'));
  check('retry limit is exceeded on the 4th retry', retries[2].exceeded === false && retries[3].exceeded === true);
  cli('step', RUN, 'design-functional', 'completed');
  fs.appendFileSync(runAbs('artifacts/02-functional-tests.md'), 'manual change\n');
  const verify = cli('verify', RUN);
  check('verify detects a changed artifact of a completed step', verify.consistent === false && verify.steps_to_invalidate[0] === 'design-functional');

  fs.rmSync(lib.runDir(RUN), { recursive: true, force: true });
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

try {
  main();
} catch (err) {
  fs.rmSync(lib.runDir(RUN), { recursive: true, force: true });
  console.error(`Self-test crashed: ${err.stack}`);
  process.exit(1);
}
