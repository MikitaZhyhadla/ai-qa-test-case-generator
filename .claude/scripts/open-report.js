#!/usr/bin/env node
'use strict';
// Opens the final HTML test suite of a run in the default browser.
// Usage:
//   node .claude/scripts/open-report.js <run-id>     open the report of this run
//   node .claude/scripts/open-report.js              open the report of the most recently completed run
//   add --print to only print the path without opening it

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const lib = require('../lib/workflow-lib.js');

function fail(message) {
  console.log(JSON.stringify({ ok: false, error: message }, null, 2));
  process.exit(1);
}

function latestCompletedRun() {
  if (!fs.existsSync(lib.RUNS_DIR)) return null;
  const runs = fs
    .readdirSync(lib.RUNS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && lib.isValidRunId(d.name) && fs.existsSync(lib.statePath(d.name)))
    .map((d) => {
      try {
        return { id: d.name, state: lib.readState(d.name) };
      } catch (_) {
        return null;
      }
    })
    .filter((r) => r && r.state.status === 'completed')
    .sort((a, b) => String(a.state.updated_at).localeCompare(String(b.state.updated_at)));
  return runs.length ? runs[runs.length - 1].id : null;
}

function openInBrowser(file) {
  let child;
  if (process.platform === 'win32') {
    child = spawn('cmd', ['/c', 'start', '""', `"${file}"`], { detached: true, stdio: 'ignore', windowsVerbatimArguments: true });
  } else if (process.platform === 'darwin') {
    child = spawn('open', [file], { detached: true, stdio: 'ignore' });
  } else {
    child = spawn('xdg-open', [file], { detached: true, stdio: 'ignore' });
  }
  child.on('error', (err) => fail(`Could not open the browser: ${err.message}. Open the file manually: ${file}`));
  child.unref();
}

function main() {
  const args = process.argv.slice(2);
  const printOnly = args.includes('--print');
  const runId = args.find((a) => !a.startsWith('--')) || latestCompletedRun();
  if (!runId) fail('No run ID given and no completed run found in runs/.');
  if (!lib.isValidRunId(runId)) fail(`Invalid run ID "${runId}".`);

  const html = path.join(lib.runDir(runId), 'output', 'test-suite.html');
  const md = path.join(lib.runDir(runId), 'output', 'test-suite.md');
  const file = fs.existsSync(html) ? html : fs.existsSync(md) ? md : null;
  if (!file) fail(`Run ${runId} has no output/test-suite.html or output/test-suite.md yet.`);

  if (!printOnly) openInBrowser(file);
  console.log(JSON.stringify({ ok: true, run_id: runId, file, opened: !printOnly }, null, 2));
}

main();
