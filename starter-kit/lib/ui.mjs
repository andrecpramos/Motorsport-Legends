/**
 * Terminal prompting, with no dependencies.
 *
 * Every question carries a default, and every default is the answer a sensible team would give.
 * That is not a convenience feature — it is what makes `--yes` produce a foundation worth having
 * rather than a directory full of unfilled placeholders. If a question cannot be given a defensible
 * default, it probably should not be a question.
 */

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  under: (s) => `\x1b[4m${s}\x1b[0m`,
};

const WIDTH = Math.min((stdout.columns || 80) - 4, 92);

/** Wrap prose to the terminal width. The phase explanations are meant to be read, not skimmed. */
function wrap(text, indent = '  ') {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && (line + ' ' + word).length > WIDTH - indent.length) {
      lines.push(indent + line);
      line = word;
    } else {
      line = line ? line + ' ' + word : word;
    }
  }
  if (line) lines.push(indent + line);
  return lines.join('\n');
}

export class UI {
  // Private, so it cannot collide with the public prompt methods below. It did, once: an instance
  // field named `lines` shadowed the `lines()` prompt and turned it into null at the first call.
  #lineIterator = null;

  /**
   * @param {{ interactive: boolean }} options
   *   When `interactive` is false — `--yes`, or a pipe rather than a terminal — every prompt
   *   resolves to its default immediately and nothing is read from stdin.
   */
  constructor({ interactive }) {
    this.interactive = interactive;
    this.rl = null;
    this.#lineIterator = null;
  }

  /**
   * One line of input.
   *
   * Deliberately an async iterator over the readline interface rather than `rl.question()`. When
   * stdin is a pipe rather than a terminal, every line arrives at once; `question()` only captures
   * whatever line happens to arrive while it is awaiting, so the rest are emitted to nobody and
   * dropped, and the wizard then hangs on a promise that will never settle. The iterator buffers,
   * so scripted input works exactly like typed input.
   *
   * @param {string} prompt written to stdout ourselves, since the interface has no `output`
   */
  async #readLine(prompt) {
    if (!this.rl) {
      this.rl = createInterface({ input: stdin, crlfDelay: Infinity });
      this.#lineIterator = this.rl[Symbol.asyncIterator]();
    }
    stdout.write(prompt);
    const { value, done } = await this.#lineIterator.next();
    // End of input mid-run: take the default for this and every later question rather than
    // hanging. Someone piping a short script gets a complete foundation, not a stall.
    if (done) {
      this.interactive = false;
      stdout.write('\n');
      return '';
    }
    return value;
  }

  close() {
    if (this.rl) this.rl.close();
    this.rl = null;
    this.#lineIterator = null;
  }

  // --- output ---------------------------------------------------------------------------------

  blank() { stdout.write('\n'); }

  /** The banner at the top of each phase. */
  phase(number, title) {
    const label = `PHASE ${number}`;
    stdout.write('\n' + c.dim('  ' + '─'.repeat(WIDTH)) + '\n');
    stdout.write('  ' + c.cyan(c.bold(label)) + '  ' + c.bold(title) + '\n');
    stdout.write(c.dim('  ' + '─'.repeat(WIDTH)) + '\n\n');
  }

  /** A paragraph of explanation. Phases are taught, not just configured. */
  say(text) {
    stdout.write(wrap(text) + '\n\n');
  }

  note(text) {
    stdout.write(c.dim(wrap(text)) + '\n\n');
  }

  /** Hanging indent, so a wrapped bullet stays visually attached to its marker. */
  bullet(text) {
    stdout.write(wrap(text, '    ').replace(/^ {4}/, '  ' + c.dim('·') + ' ') + '\n');
  }

  /** A line written exactly as given — for tabular output that must not be re-wrapped. */
  plain(text) { stdout.write(text + '\n'); }

  ok(text) { stdout.write('  ' + c.green('✓') + ' ' + text + '\n'); }
  warn(text) { stdout.write('  ' + c.yellow('!') + ' ' + text + '\n'); }
  fail(text) { stdout.write('  ' + c.red('✗') + ' ' + text + '\n'); }

  heading(text) {
    stdout.write('\n  ' + c.bold(c.under(text)) + '\n\n');
  }

  // --- input ----------------------------------------------------------------------------------

  /**
   * Free text with a default.
   * @param {string} question
   * @param {string} fallback
   */
  async ask(question, fallback = '') {
    if (!this.interactive) return fallback;
    const suffix = fallback ? c.dim(` (${fallback})`) : '';
    const answer = (await this.#readLine(`  ${c.bold(question)}${suffix}\n  ${c.cyan('>')} `)).trim();
    stdout.write('\n');
    return answer || fallback;
  }

  /**
   * Yes/no.
   * @param {string} question
   * @param {boolean} fallback
   */
  async confirm(question, fallback = true) {
    if (!this.interactive) return fallback;
    const hint = fallback ? 'Y/n' : 'y/N';
    const answer = (await this.#readLine(`  ${c.bold(question)} ${c.dim(`(${hint})`)} `)).trim().toLowerCase();
    stdout.write('\n');
    if (!answer) return fallback;
    return answer.startsWith('y');
  }

  /**
   * Pick one from a list.
   * @param {string} question
   * @param {Array<{ value: string, label: string, hint?: string }>} options
   * @param {string} fallback  the `value` chosen when the user just presses enter
   */
  async select(question, options, fallback) {
    if (!this.interactive) return fallback;
    stdout.write(`  ${c.bold(question)}\n\n`);
    options.forEach((option, index) => {
      const mark = option.value === fallback ? c.green('●') : c.dim('○');
      const hint = option.hint ? c.dim(` — ${option.hint}`) : '';
      stdout.write(`    ${mark} ${c.bold(String(index + 1))}. ${option.label}${hint}\n`);
    });
    stdout.write('\n');

    const answer = (await this.#readLine(`  ${c.cyan('>')} `)).trim();
    stdout.write('\n');
    if (!answer) return fallback;

    const byNumber = options[Number(answer) - 1];
    if (byNumber) return byNumber.value;

    const byValue = options.find((o) => o.value.toLowerCase() === answer.toLowerCase());
    return byValue ? byValue.value : fallback;
  }

  /**
   * Pick any number from a list. Answered as comma-separated numbers.
   * @param {string} question
   * @param {Array<{ value: string, label: string, hint?: string }>} options
   * @param {string[]} fallback
   */
  async multiSelect(question, options, fallback) {
    if (!this.interactive) return fallback;
    stdout.write(`  ${c.bold(question)} ${c.dim('(comma-separated numbers)')}\n\n`);
    options.forEach((option, index) => {
      const mark = fallback.includes(option.value) ? c.green('◉') : c.dim('○');
      const hint = option.hint ? c.dim(` — ${option.hint}`) : '';
      stdout.write(`    ${mark} ${c.bold(String(index + 1))}. ${option.label}${hint}\n`);
    });
    stdout.write('\n');

    const answer = (await this.#readLine(`  ${c.cyan('>')} `)).trim();
    stdout.write('\n');
    if (!answer) return fallback;

    const picked = answer
      .split(',')
      .map((part) => options[Number(part.trim()) - 1])
      .filter(Boolean)
      .map((option) => option.value);

    return picked.length ? picked : fallback;
  }

  /**
   * Collect a short list of free-text lines, one at a time, until the user enters a blank.
   * Used for the things no template can guess: your invariants, your hot paths.
   *
   * @param {string} question
   * @param {string[]} fallback
   * @param {number} max
   */
  async lines(question, fallback = [], max = 5) {
    if (!this.interactive) return fallback;
    stdout.write(`  ${c.bold(question)}\n`);
    stdout.write(c.dim(`  One per line. Blank line when done, or press enter immediately to use the suggested defaults.\n\n`));

    const collected = [];
    while (collected.length < max) {
      const answer = (await this.#readLine(`  ${c.cyan('>')} `)).trim();
      if (!answer) break;
      collected.push(answer);
    }
    stdout.write('\n');
    return collected.length ? collected : fallback;
  }
}

export { c as colour };
