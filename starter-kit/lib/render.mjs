/**
 * A very small template renderer.
 *
 * Deliberately small. Templates in this kit are meant to be opened, read and edited by a human
 * before they are ever rendered — they are the deliverable, not an implementation detail — so the
 * syntax has to stay legible in a plain markdown preview. Three constructs, no expressions, no
 * helpers:
 *
 *   {{a.b.c}}                    substitute a value
 *   {{#if key}}…{{/if}}          include when truthy (a non-empty array counts as truthy)
 *   {{#unless key}}…{{/unless}}  the inverse
 *   {{#each key}}…{{.}}…{{/each}} repeat; `{{.}}` is the item, object keys are in scope
 */

/** Resolve a dotted path against the context. */
function get(context, path) {
  if (path === '.') return context['.'];
  return path.split('.').reduce((value, key) => (value == null ? undefined : value[key]), context);
}

/**
 * Find the next block tag and the position of its matching close, honouring nesting of the
 * same tag. Returns null when there are no blocks left.
 */
function findBlock(source, from) {
  const opener = /\{\{#(if|unless|each) ([\w.]+)\}\}/g;
  opener.lastIndex = from;
  const open = opener.exec(source);
  if (!open) return null;

  const [tag, key] = [open[1], open[2]];
  const scanner = new RegExp(`\\{\\{#${tag} [\\w.]+\\}\\}|\\{\\{\\/${tag}\\}\\}`, 'g');
  scanner.lastIndex = open.index + open[0].length;

  let depth = 1;
  let match;
  while ((match = scanner.exec(source))) {
    if (match[0].startsWith('{{/')) {
      depth -= 1;
      if (depth === 0) {
        return {
          tag,
          key,
          start: open.index,
          bodyStart: open.index + open[0].length,
          bodyEnd: match.index,
          end: match.index + match[0].length,
        };
      }
    } else {
      depth += 1;
    }
  }

  throw new Error(`Unclosed {{#${tag} ${key}}} in template`);
}

/**
 * A block tag alone on its own line should not leave a blank line behind when it renders. This
 * is the difference between generated markdown a human will read and generated markdown they
 * will reformat by hand, which is the same as not generating it.
 */
function tightenStandaloneTags(template) {
  return template.replace(/^[ \t]*(\{\{[#/][^}]*\}\})[ \t]*\r?\n/gm, '$1');
}

/**
 * @param {string} template
 * @param {Record<string, unknown>} context
 * @returns {string}
 */
export function render(template, context) {
  // Tighten once, here, and never again inside the recursion below. Re-tightening a block's body
  // strips the newline after any closing tag it contains, which silently deletes the blank line
  // between iterations of an outer loop — the kind of bug you only find by reading the output.
  return renderBody(tightenStandaloneTags(template), context);
}

function renderBody(source, context) {
  let output = '';
  let cursor = 0;

  for (;;) {
    const block = findBlock(source, cursor);
    if (!block) {
      output += source.slice(cursor);
      break;
    }

    output += source.slice(cursor, block.start);
    const body = source.slice(block.bodyStart, block.bodyEnd);
    const value = get(context, block.key);

    if (block.tag === 'each') {
      const items = Array.isArray(value) ? value : [];
      for (const item of items) {
        const scope =
          item !== null && typeof item === 'object'
            ? { ...context, ...item, '.': item }
            : { ...context, '.': item };
        output += renderBody(body, scope);
      }
    } else {
      const truthy = Array.isArray(value) ? value.length > 0 : Boolean(value);
      if ((block.tag === 'if') === truthy) output += renderBody(body, context);
    }

    cursor = block.end;
  }

  return output.replace(/\{\{([\w.]+|\.)\}\}/g, (whole, path) => {
    const value = get(context, path);
    // A *missing* key leaves its placeholder visible on purpose. The doc-drift check that ships
    // with this kit looks for exactly this pattern, so a template the wizard could not fill turns
    // into a CI finding rather than a silently wrong document.
    //
    // An empty string is not missing — it is a value that renders to nothing, which is how an
    // optional fragment (a severity note, an absent lint command) is expressed. Conflating the two
    // printed `{{severityNote}}` into finished documents.
    if (value === undefined || value === null) return whole;
    return String(value);
  });
}
