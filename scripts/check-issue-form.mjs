#!/usr/bin/env node
// Checks that the "Where should it go?" dropdown in
// .github/ISSUE_TEMPLATE/resource_suggestion.yml lists the same sections as
// scripts/readme-template.mjs (SECTIONS), in the same order. The only extra
// option allowed is "Not sure / none of these fit".
//
// `checkIssueForm(formText, sections)` is pure (returns an array of error
// strings) so it can be unit-tested; the CLI wrapper reads the real files.
// No YAML dependency: the `options:` block of the `section` dropdown is read
// with a line scan.

import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SECTIONS } from './readme-template.mjs';

export const FALLBACK_OPTION = 'Not sure / none of these fit';

// Returns the option labels of the dropdown whose `id:` is `section`, or null
// if the dropdown or its options block can't be found.
export function extractSectionOptions(formText) {
  const lines = formText.split('\n');
  const idIndex = lines.findIndex((l) => /^\s*id:\s*section\s*$/.test(l));
  if (idIndex === -1) return null;
  const optionsIndex = lines.findIndex((l, i) => i > idIndex && /^\s*options:\s*$/.test(l));
  if (optionsIndex === -1) return null;
  const options = [];
  for (let i = optionsIndex + 1; i < lines.length; i++) {
    const m = lines[i].match(/^\s*-\s+(.+?)\s*$/);
    if (!m) break;
    options.push(m[1].replace(/^(["'])(.*)\1$/, '$2'));
  }
  return options;
}

export function checkIssueForm(formText, sections = SECTIONS) {
  const expected = sections.map((s) => (typeof s === 'string' ? s : s.heading));
  const found = extractSectionOptions(formText);
  if (found === null) {
    return ['resource_suggestion.yml: could not find the `section` dropdown options.'];
  }
  const actual = found.filter((o) => o !== FALLBACK_OPTION);
  const errors = [];
  for (const s of expected) {
    if (!actual.includes(s)) {
      errors.push(`resource_suggestion.yml: section "${s}" is in the README but missing from the form dropdown.`);
    }
  }
  for (const o of actual) {
    if (!expected.includes(o)) {
      errors.push(`resource_suggestion.yml: dropdown option "${o}" is not a README section (renamed or removed?).`);
    }
  }
  if (
    !errors.length &&
    JSON.stringify(actual) !== JSON.stringify(expected)
  ) {
    errors.push(
      `resource_suggestion.yml: dropdown is in a different order than the README sections.\n` +
        `    README: ${expected.join(', ')}\n` +
        `    Form:   ${actual.join(', ')}`
    );
  }
  return errors;
}

function invokedDirectly() {
  return process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
}

if (invokedDirectly()) {
  const FORM_PATH = new URL('../.github/ISSUE_TEMPLATE/resource_suggestion.yml', import.meta.url);
  const errors = checkIssueForm(readFileSync(FORM_PATH, 'utf8'));
  if (errors.length) {
    console.error(`✖ ${errors.length} issue(s) found in the suggest-a-resource form:\n`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }
  console.log('✔ The suggest-a-resource form lists the same sections as the README.');
}
