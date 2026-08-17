/**
 * The answers file: `.sdlc-kit.json` in the project root.
 *
 * Two jobs, and the second is the one that matters.
 *
 * 1. It makes the wizard resumable. Ten phases is more than one sitting for most people, and a
 *    setup tool that loses your answers when you close the terminal gets run once and abandoned.
 *
 * 2. It is read at runtime by the checks this kit installs. `release-risk.mjs` gets its hot-path
 *    table from here, `doc-drift.mjs` gets its source directories. That means answering "which
 *    files in this project have a blast radius bigger than their line count?" during setup
 *    configures a CI gate, rather than producing a paragraph of prose nobody revisits.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const STATE_FILE = '.sdlc-kit.json';

const EMPTY = {
  kitVersion: 1,
  completedPhases: [],
  project: {},
  answers: {},
};

/** @param {string} target */
export function loadState(target) {
  const path = join(target, STATE_FILE);
  if (!existsSync(path)) return structuredClone(EMPTY);

  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    return { ...structuredClone(EMPTY), ...parsed };
  } catch {
    // A corrupt state file should not block setup, but silently discarding someone's answers is
    // worse than starting over knowingly.
    return { ...structuredClone(EMPTY), corrupt: true };
  }
}

/**
 * @param {string} target
 * @param {object} state
 */
export function saveState(target, state) {
  const path = join(target, STATE_FILE);
  const { corrupt, ...clean } = state;
  writeFileSync(path, JSON.stringify(clean, null, 2) + '\n', 'utf8');
  return path;
}
