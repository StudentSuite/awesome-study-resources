import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateResources } from './validate-resources.mjs';

const VALID_RECORD = {
  name: 'Apple',
  url: 'https://apple.example',
  description: 'A fruit tool (free).',
  section: 'Exam & Curriculum Prep',
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

test('url must start with https://', () => {
  const errors = validateResources([{ ...VALID_RECORD, url: 'ftp://apple.example' }]);
  assert.ok(errors.some((e) => /must start with "https:\/\/"/.test(e)));
});

test('http:// urls are rejected', () => {
  const errors = validateResources([{ ...VALID_RECORD, url: 'http://apple.example' }]);
  assert.ok(errors.some((e) => e.includes('must start with "https://"')));
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
  const errors = validateResources([VALID_RECORD, { ...VALID_RECORD, section: 'By Subject' }]);
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

test('unknown section is rejected and valid headings are listed', () => {
  const errors = validateResources([{ ...VALID_RECORD, section: 'By Subjects' }]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /unknown section "By Subjects"/);
  assert.match(errors[0], /Valid sections are:/);
  assert.match(errors[0], /Exam & Curriculum Prep/);
});

test('known section is accepted', () => {
  const errors = validateResources([{ ...VALID_RECORD, section: 'By Subject' }]);
  assert.deepEqual(errors, []);
});

test('urls with tracking parameters (utm_, fbclid, gclid, ref, si) are flagged', () => {
  for (const [key, param] of [
    ['utm_source', '?utm_source=x'],
    ['fbclid', '?fbclid=123'],
    ['gclid', '?gclid=123'],
    ['ref', '?ref=affiliate'],
    ['si', '?si=share123'],
  ]) {
    const errors = validateResources([{ ...VALID_RECORD, url: `https://apple.example/${param}` }]);
    assert.equal(errors.length, 1);
    assert.match(errors[0], new RegExp(`contains tracking query parameter "${key}"`));
  }
});

test('urls with legitimate query parameters are allowed', () => {
  const errors = validateResources([{ ...VALID_RECORD, url: 'https://apple.example/?id=3&page=2' }]);
  assert.deepEqual(errors, []);
});

