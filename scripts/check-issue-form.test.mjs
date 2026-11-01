import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkIssueForm, extractSectionOptions } from './check-issue-form.mjs';

const SECTIONS = ['Alpha', 'Beta & Gamma', 'Delta'];

function form(options) {
  return `name: Suggest
body:
  - type: input
    id: name
    attributes:
      label: Name
  - type: dropdown
    id: section
    attributes:
      label: Where?
      options:
${options.map((o) => `        - ${o}`).join('\n')}
    validations:
      required: true
  - type: textarea
    id: why
    attributes:
      label: Why
`;
}

const FALLBACK = 'Not sure / none of these fit';

test('a matching list passes', () => {
  assert.deepEqual(checkIssueForm(form([...SECTIONS, FALLBACK]), SECTIONS), []);
});

test('the fallback option is optional', () => {
  assert.deepEqual(checkIssueForm(form(SECTIONS), SECTIONS), []);
});

test('a missing section is reported', () => {
  const errors = checkIssueForm(form(['Alpha', 'Delta', FALLBACK]), SECTIONS);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /"Beta & Gamma".*missing from the form/);
});

test('an extra or renamed option is reported', () => {
  const errors = checkIssueForm(form([...SECTIONS, 'Epsilon', FALLBACK]), SECTIONS);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /"Epsilon".*not a README section/);
});

test('a reordered list is reported', () => {
  const errors = checkIssueForm(form(['Beta & Gamma', 'Alpha', 'Delta', FALLBACK]), SECTIONS);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /different order/);
});

test('a form without the dropdown is reported', () => {
  assert.equal(extractSectionOptions('name: x\nbody: []\n'), null);
  assert.match(checkIssueForm('name: x\n', SECTIONS)[0], /could not find/);
});

test('the real form matches the README sections', () => {
  const text = readFileSync(
    new URL('../.github/ISSUE_TEMPLATE/resource_suggestion.yml', import.meta.url),
    'utf8'
  );
  assert.deepEqual(checkIssueForm(text), []);
});
