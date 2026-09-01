import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildReadme } from './generate-readme.mjs';

// A minimal template: one flat section (Alpha, no subsections) and one
// section with subsections (Beta), mirroring README's real mix.
const TEMPLATE = {
  header: `# Title

![Resources](https://img.shields.io/badge/resources-{{RESOURCES}}-blue)
![Sections](https://img.shields.io/badge/sections-{{SECTIONS}}-purple)

## Table of Contents

| | Section | Resources |
| :-: | --- | :-: |
`,
  sections: [
    { heading: 'Alpha', emoji: '🍎', ariaLabel: 'Alpha icon', blurb: 'Alpha things.' },
    { heading: 'Beta', emoji: '🍌', ariaLabel: 'Beta icon', blurb: 'Beta things.' },
  ],
  footer: `## More from StudentSuite

- **[Sibling](https://sibling.example)** - A sibling project (free).

## License

MIT.
`,
};

const RECORDS = [
  { name: 'Zebra', url: 'https://zebra.example', description: 'z (free).', section: 'Alpha', subsection: null },
  { name: 'Apple', url: 'https://apple.example', description: 'a (free).', section: 'Alpha', subsection: null },
  { name: 'Beta One', url: 'https://b1.example', description: 'b1 (free).', section: 'Beta', subsection: 'Sub B' },
  { name: 'Alpha One', url: 'https://a1.example', description: 'a1 (free).', section: 'Beta', subsection: 'Sub A' },
  { name: 'Alpha Two', url: 'https://a2.example', description: 'a2 (free).', section: 'Beta', subsection: 'Sub A' },
];

test('entries are sorted alphabetically, case-insensitively, within a flat section', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  const appleIdx = out.indexOf('Apple');
  const zebraIdx = out.indexOf('Zebra');
  assert.ok(appleIdx < zebraIdx, 'Apple should come before Zebra');
});

test('subsections render with ### headings, in first-appearance (data) order', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  assert.ok(out.includes('### Sub B'));
  assert.ok(out.includes('### Sub A'));
  // Sub B appears before Sub A in RECORDS (Beta One is first Beta record), so
  // it should render first even though "Sub A" < "Sub B" alphabetically.
  assert.ok(out.indexOf('### Sub B') < out.indexOf('### Sub A'));
});

test('a flat section has no ### heading, just a details block', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  const alphaSection = out.slice(out.indexOf('## Alpha'), out.indexOf('## Beta'));
  assert.ok(!alphaSection.includes('###'));
  assert.ok(alphaSection.includes('<details open>'));
});

test('resources badge is the total record count', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  assert.ok(out.includes(`resources-${RECORDS.length}-blue`));
});

test('sections badge is the number of template sections, not subsections', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  assert.ok(out.includes('sections-2-purple'));
});

test('Table of Contents row count matches the section total, summed across subsections', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  assert.ok(out.includes('[Beta](#beta) | 3 |')); // Beta One + Alpha One + Alpha Two
  assert.ok(out.includes('[Alpha](#alpha) | 2 |'));
});

test('a section with zero records still renders (empty details block)', () => {
  const out = buildReadme([], TEMPLATE);
  assert.ok(out.includes('## Alpha'));
  assert.ok(out.includes('## Beta'));
  assert.ok(out.includes('resources-0-blue'));
  assert.ok(out.includes('sections-2-purple'));
});

test('static footer content is appended verbatim', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  assert.ok(out.includes('## More from StudentSuite'));
  assert.ok(out.includes('Sibling'));
  assert.ok(out.endsWith('MIT.\n'));
});

test('entry line format matches "- **[Name](url)** - Description."', () => {
  const out = buildReadme(RECORDS, TEMPLATE);
  assert.ok(out.includes('- **[Apple](https://apple.example)** - a (free).'));
});

test('output is deterministic: same input produces the same output', () => {
  const out1 = buildReadme(RECORDS, TEMPLATE);
  const out2 = buildReadme(RECORDS, TEMPLATE);
  assert.equal(out1, out2);
});

test('regenerating from parsed real README data round-trips (spot check via default template import)', () => {
  // Uses the real repo template with a tiny synthetic record set restricted to
  // sections that actually exist in scripts/readme-template.mjs, just to
  // confirm the default-template code path (no template arg) doesn't throw
  // and produces the expected header shape.
  const out = buildReadme([
    {
      name: 'Anki',
      url: 'https://apps.ankiweb.net',
      description: 'Free, open-source spaced-repetition flashcards (free).',
      section: 'Flashcards & Spaced Repetition',
      subsection: null,
    },
  ]);
  assert.ok(out.startsWith('<div align="center">'));
  assert.ok(out.includes('- **[Anki](https://apps.ankiweb.net)** - Free, open-source spaced-repetition flashcards (free).'));
  assert.ok(out.includes('## Great Textbooks')); // sections with 0 records still render
});
