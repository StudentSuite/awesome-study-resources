import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateResources } from './validate-resources.mjs';

const VALID_RECORD = {
  name: 'Apple',
  url: 'https://apple.example',
  description: 'A fruit tool (free).',
  section: 'Alpha',
  subsection: null,
};

test('a valid record list produces no errors', () => {
  assert.deepEqual(validateResources([VALID_RECORD]), []);
});

test('non-array input is rejected', () => {
  const errors = validateResources({ not: 'an array' });
  assert.equal(errors.length, 1);
  assert.match(errors[0], /must be a JSON array/);
});

test('missing/empty required string fields are flagged', () => {
  for (const field of ['name', 'url', 'description', 'section']) {
    const record = { ...VALID_RECORD, [field]: '' };
    const errors = validateResources([record]);
    assert.ok(
      errors.some((e) => e.includes(`"${field}" must be a non-empty string`)),
      `expected an error for empty "${field}", got: ${JSON.stringify(errors)}`
    );
  }
});

test('missing field (not just empty) is flagged', () => {
  const record = { ...VALID_RECORD };
  delete record.url;
  const errors = validateResources([record]);
  assert.ok(errors.some((e) => e.includes('"url" must be a non-empty string')));
});

test('subsection may be null', () => {
  assert.deepEqual(validateResources([{ ...VALID_RECORD, subsection: null }]), []);
});

test('subsection may be a non-empty string', () => {
  assert.deepEqual(validateResources([{ ...VALID_RECORD, subsection: 'Sub' }]), []);
});

test('empty-string subsection is flagged (should be null, not "")', () => {
  const errors = validateResources([{ ...VALID_RECORD, subsection: '' }]);
  assert.ok(errors.some((e) => /"subsection" must be a non-empty string or null/.test(e)));
});

test('non-string, non-null subsection is flagged', () => {
  const errors = validateResources([{ ...VALID_RECORD, subsection: 42 }]);
  assert.ok(errors.some((e) => /"subsection" must be a non-empty string or null/.test(e)));
});

test('url must start with https:// or http://', () => {
  const errors = validateResources([{ ...VALID_RECORD, url: 'ftp://apple.example' }]);
  assert.ok(errors.some((e) => /must start with "https:\/\/"/.test(e)));
});

test('http:// urls are accepted', () => {
  assert.deepEqual(validateResources([{ ...VALID_RECORD, url: 'http://apple.example' }]), []);
});

test('duplicate section/subsection/name combo is flagged', () => {
  const errors = validateResources([VALID_RECORD, { ...VALID_RECORD, url: 'https://apple2.example' }]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /duplicate entry for section\/subsection\/name/);
});

test('same name in a different subsection is allowed', () => {
  const errors = validateResources([VALID_RECORD, { ...VALID_RECORD, subsection: 'Other' }]);
  assert.deepEqual(errors, []);
});

test('same name in a different section is allowed', () => {
  const errors = validateResources([VALID_RECORD, { ...VALID_RECORD, section: 'Beta' }]);
  assert.deepEqual(errors, []);
});

test('a non-object entry in the array is flagged', () => {
  const errors = validateResources(['not an object']);
  assert.ok(errors.some((e) => /expected an object/.test(e)));
});

test('multiple problems on one record are all reported', () => {
  const errors = validateResources([{ ...VALID_RECORD, name: '', url: 'notaurl' }]);
  assert.equal(errors.length, 2);
});
