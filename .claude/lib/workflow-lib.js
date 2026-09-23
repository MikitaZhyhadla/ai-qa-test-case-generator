'use strict';
// Shared helpers for the workflow state script and the hooks.
// Uses only Node.js built-in modules, so no `npm install` is needed.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// This file lives in <project>/.claude/lib, so the project root is two levels up.
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const RUNS_DIR = path.join(PROJECT_ROOT, 'runs');

const STEP_IDS = [
  'formalize',
  'clarify',
  'validate-requirements',
  'plan',
  'design-functional',
  'design-negative',
  'design-edge',
  'design-regression',
  'aggregate',
  'validate-design',
  'build-suite',
  'validate-suite',
  'approval',
  'render-markdown',
  'render-html',
  'report',
];

// Direct dependencies of every step (see CLAUDE.md and the coordinator command).
const STEP_DEPENDENCIES = {
  formalize: [],
  clarify: ['formalize'],
  'validate-requirements': ['clarify'],
  plan: ['validate-requirements'],
  'design-functional': ['plan'],
  'design-negative': ['plan'],
  'design-edge': ['plan'],
  'design-regression': ['plan'],
  aggregate: ['design-functional', 'design-negative', 'design-edge', 'design-regression'],
  'validate-design': ['aggregate'],
  'build-suite': ['validate-design'],
  'validate-suite': ['build-suite'],
  approval: ['validate-suite'],
  'render-markdown': ['approval'],
  'render-html': ['approval'],
  report: ['render-markdown', 'render-html'],
};

const STEP_STATUSES = ['pending', 'in_progress', 'completed', 'failed', 'skipped'];
const GATE_SCOPES = ['requirements', 'test-design', 'suite'];
const RETRY_LIMIT = 3;

// Which step owns which run file (path relative to the run folder).
function stepForArtifact(relativeToRun) {
  const p = relativeToRun.replace(/\\/g, '/');
  if (p === 'input/pbi.md') return 'formalize';
  if (p === 'artifacts/01-requirements.md') return 'clarify';
  if (p === 'artifacts/02-functional-tests.md') return 'design-functional';
  if (p === 'artifacts/03-negative-tests.md') return 'design-negative';
  if (p === 'artifacts/04-edge-case-tests.md') return 'design-edge';
  if (p === 'artifacts/05-regression-impact.md') return 'design-regression';
  if (p === 'artifacts/06-coverage-matrix.md') return 'aggregate';
  if (/^artifacts\/07-validation-requirements-attempt-\d+\.md$/.test(p)) return 'validate-requirements';
  if (/^artifacts\/07-validation-test-design-attempt-\d+\.md$/.test(p)) return 'validate-design';
  if (/^artifacts\/07-validation-suite-attempt-\d+\.md$/.test(p)) return 'validate-suite';
  if (p === 'artifacts/08-test-suite.md') return 'build-suite';
  if (/^artifacts\/09-review-feedback-rev-\d+\.md$/.test(p)) return 'approval';
  if (p === 'output/test-suite.md') return 'render-markdown';
  if (p === 'output/test-suite.html') return 'render-html';
  return null;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

// Local time as "YYYY-MM-DD HH:MM".
function nowLocal(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Local time as "YYYYMMDD-HHMM" for run IDs.
function compactLocal(date = new Date()) {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

function isoNow() {
  return new Date().toISOString();
}

function sha256File(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function isValidRunId(runId) {
  return typeof runId === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(runId);
}

function runDir(runId) {
  if (!isValidRunId(runId)) throw new Error(`Invalid run ID: ${runId}`);
  return path.join(RUNS_DIR, runId);
}

function statePath(runId) {
  return path.join(runDir(runId), 'workflow-state.json');
}

function approvalPath(runId) {
  return path.join(runDir(runId), 'approval.json');
}

function suitePath(runId) {
  return path.join(runDir(runId), 'artifacts', '08-test-suite.md');
}

// Synchronous sleep without busy looping.
function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

// Directory-based lock: mkdir is atomic on every platform.
function withLock(runId, fn) {
  const lockDir = path.join(runDir(runId), '.state.lock');
  const deadline = Date.now() + 10000;
  for (;;) {
    try {
      fs.mkdirSync(lockDir);
      break;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      try {
        const age = Date.now() - fs.statSync(lockDir).mtimeMs;
        if (age > 15000) {
          fs.rmSync(lockDir, { recursive: true, force: true });
          continue;
        }
      } catch (_) {
        continue;
      }
      if (Date.now() > deadline) throw new Error(`Timed out waiting for lock ${lockDir}`);
      sleep(50);
    }
  }
  try {
    return fn();
  } finally {
    fs.rmSync(lockDir, { recursive: true, force: true });
  }
}

// Write to a temporary file and rename it, so readers never see a half-written file.
function writeJsonAtomic(filePath, value) {
  const tmp = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n', 'utf8');
  for (let attempt = 0; ; attempt++) {
    try {
      fs.renameSync(tmp, filePath);
      return;
    } catch (err) {
      if (attempt >= 20 || !['EPERM', 'EBUSY', 'EACCES'].includes(err.code)) {
        fs.rmSync(tmp, { force: true });
        throw err;
      }
      sleep(50);
    }
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readState(runId) {
  const p = statePath(runId);
  if (!fs.existsSync(p)) throw new Error(`Run not found: ${runId} (missing ${path.relative(PROJECT_ROOT, p)})`);
  return readJson(p);
}

// Read-modify-write of the state under the lock. `mutate` changes the object in place.
function updateState(runId, mutate) {
  return withLock(runId, () => {
    const state = readState(runId);
    const result = mutate(state);
    state.updated_at = isoNow();
    writeJsonAtomic(statePath(runId), state);
    return result === undefined ? state : result;
  });
}

function createInitialState(runId, owner, repo, issueNumber) {
  const steps = {};
  for (const id of STEP_IDS) {
    steps[id] = { status: 'pending', updated_at: null, note: null, history: [] };
  }
  const created = isoNow();
  return {
    schema_version: 1,
    run_id: runId,
    issue: {
      owner,
      repo,
      number: Number(issueNumber),
      url: `https://github.com/${owner}/${repo}/issues/${issueNumber}`,
    },
    status: 'in_progress',
    awaiting: null,
    created_at: created,
    updated_at: created,
    execution_profile: null,
    plan: null,
    steps,
    retry_limit: RETRY_LIMIT,
    retries: { requirements: 0, 'test-design': 0, suite: 0 },
    gates: { requirements: [], 'test-design': [], suite: [] },
    approval: { status: 'not_requested' },
    revisions: [],
    last_error: null,
    artifacts: {},
  };
}

// All steps that depend on `stepId`, directly or indirectly (not including `stepId`).
function downstreamSteps(stepId) {
  const result = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const id of STEP_IDS) {
      if (result.has(id)) continue;
      const deps = STEP_DEPENDENCIES[id];
      if (deps.includes(stepId) || deps.some((d) => result.has(d))) {
        result.add(id);
        changed = true;
      }
    }
  }
  return STEP_IDS.filter((id) => result.has(id));
}

// Convert any path (absolute or relative to `baseDir`) to a POSIX path relative to the project root.
// Returns null when the path is outside the project.
function toProjectRelative(filePath, baseDir) {
  if (!filePath || typeof filePath !== 'string') return null;
  const absolute = path.resolve(baseDir || PROJECT_ROOT, filePath);
  const rel = path.relative(PROJECT_ROOT, absolute);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return rel.split(path.sep).join('/');
}

// Split "runs/<run-id>/<rest>" into its parts. Returns null for other paths.
function parseRunPath(projectRelative) {
  if (!projectRelative) return null;
  const m = /^runs\/([^/]+)\/(.+)$/.exec(projectRelative);
  if (!m) return null;
  return { runId: m[1], relativeToRun: m[2] };
}

// Read all of stdin (hook input). Returns the parsed JSON object, or {} when empty.
function readStdinJson() {
  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (_) {
    return {};
  }
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

module.exports = {
  PROJECT_ROOT,
  RUNS_DIR,
  STEP_IDS,
  STEP_DEPENDENCIES,
  STEP_STATUSES,
  GATE_SCOPES,
  RETRY_LIMIT,
  stepForArtifact,
  nowLocal,
  compactLocal,
  isoNow,
  sha256File,
  isValidRunId,
  runDir,
  statePath,
  approvalPath,
  suitePath,
  withLock,
  writeJsonAtomic,
  readJson,
  readState,
  updateState,
  createInitialState,
  downstreamSteps,
  toProjectRelative,
  parseRunPath,
  readStdinJson,
};
