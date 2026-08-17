/**
 * Rendering templates onto a real project directory.
 *
 * The rule this module exists to enforce: **never destroy work the user already did.** This kit is
 * designed to be re-run — after a postmortem, after a new hire, after the architecture changes —
 * and a scaffolder that clobbers an edited AGENTS.md on its second run will only ever be run once.
 *
 * So a file that already exists and differs from what we would write is never overwritten silently.
 * It is either skipped, or written alongside as `<name>.new` for the user to diff. Overwriting is
 * possible, but only when someone asks for it.
 */

import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { render } from './render.mjs';
import { colour as c } from './ui.mjs';

export class Writer {
  /**
   * @param {{ target: string, templateRoot: string, ui: import('./ui.mjs').UI,
   *           dryRun: boolean, force: boolean }} options
   */
  constructor({ target, templateRoot, ui, dryRun, force }) {
    this.target = target;
    this.templateRoot = templateRoot;
    this.ui = ui;
    this.dryRun = dryRun;
    this.force = force;
    /** @type {Array<{ path: string, status: string }>} */
    this.written = [];
  }

  #rel(path) {
    return relative(this.target, path).split(sep).join('/');
  }

  /**
   * Render one template to one destination.
   *
   * @param {string} templatePath  path relative to `starter-kit/templates`
   * @param {string} destination   path relative to the project root
   * @param {object} context
   */
  async file(templatePath, destination, context, { executable = false } = {}) {
    const source = join(this.templateRoot, templatePath);
    const dest = join(this.target, destination);
    const body = render(readFileSync(source, 'utf8'), context);
    await this.raw(body, destination, dest);
    if (executable) this.#makeExecutable(dest);
  }

  /**
   * A shell script written without the execute bit is a script people run with `sh dev.sh` while
   * wondering why the documented `./dev.sh` does not work. No-op on Windows, where the concept
   * does not apply.
   */
  #makeExecutable(dest) {
    if (this.dryRun || process.platform === 'win32' || !existsSync(dest)) return;
    try {
      chmodSync(dest, 0o755);
    } catch { /* filesystem does not support it — not worth failing setup over */ }
  }

  /**
   * Write already-rendered content. Used for the files the kit composes rather than templates —
   * the state file, the foundation index.
   */
  async content(body, destination) {
    await this.raw(body, destination, join(this.target, destination));
  }

  /** Copy a file verbatim, no rendering. Used for the executable checks in `tools/`. */
  async copy(templatePath, destination) {
    const body = readFileSync(join(this.templateRoot, templatePath), 'utf8');
    await this.raw(body, destination, join(this.target, destination));
  }

  /**
   * Windows batch files must have CRLF line endings. `cmd.exe` parses an LF-only `.bat` by eating
   * the first character of every line, which produces a cascade of "'ho' is not recognized as an
   * internal or external command" and no clue as to why. Everything else stays LF.
   */
  static #normaliseEndings(body, destination) {
    if (!/\.(bat|cmd)$/i.test(destination)) return body;
    return body.replace(/\r?\n/g, '\r\n');
  }

  async raw(body, destination, dest) {
    body = Writer.#normaliseEndings(body, destination);

    if (existsSync(dest)) {
      const existing = readFileSync(dest, 'utf8');

      if (existing === body) {
        this.#record(destination, 'unchanged');
        this.ui.ok(c.dim(`${destination} — already up to date`));
        return;
      }

      if (!this.force) {
        const choice = this.ui.interactive
          ? await this.ui.select(
              `${destination} already exists and differs. What should happen to it?`,
              [
                { value: 'keep', label: 'Keep mine', hint: 'write the generated version as .new so you can diff' },
                { value: 'overwrite', label: 'Overwrite', hint: 'replace the existing file' },
                { value: 'skip', label: 'Skip entirely', hint: 'write nothing' },
              ],
              'keep',
            )
          : 'keep';

        if (choice === 'skip') {
          this.#record(destination, 'skipped');
          this.ui.warn(`${destination} — skipped, left as it was`);
          return;
        }

        if (choice === 'keep') {
          const sidecar = `${destination}.new`;
          if (!this.dryRun) {
            mkdirSync(dirname(dest), { recursive: true });
            writeFileSync(`${dest}.new`, body, 'utf8');
          }
          this.#record(sidecar, 'sidecar');
          this.ui.warn(`${destination} — kept; generated version written to ${sidecar}`);
          return;
        }
      }
    }

    if (!this.dryRun) {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, body, 'utf8');
    }

    const status = this.dryRun ? 'would create' : 'created';
    this.#record(destination, status);
    this.ui.ok(`${destination}${this.dryRun ? c.dim(' (dry run)') : ''}`);
  }

  #record(path, status) {
    this.written.push({ path, status });
  }

  /** Everything that was actually put on disk, for the closing summary and the index file. */
  summary() {
    return this.written;
  }
}
