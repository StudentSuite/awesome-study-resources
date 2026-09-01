#!/usr/bin/env node
// Generates README.md from data/resources.json plus the static template
// content in scripts/readme-template.mjs (header/badges, per-section blurbs
// and icons, and the static footer sections that aren't resource lists).
//
// Usage:
//   node scripts/generate-readme.mjs           regenerates README.md in place
//   node scripts/generate-readme.mjs --check   exits 1 if README.md is stale
//                                               (used in CI; nothing is written)
//
// Entries are sorted alphabetically (case-insensitive) within each
// section/subsection, regardless of their order in data/resources.json.
// Top-level section order comes from `template.sections` (curated, matches
// README's existing order). Subsection order (e.g. By Subject's curated
// "Mathematics, Statistics, Further Mathematics, ..." order, not alphabetical)
// comes from first-appearance order in data/resources.json, so the data file
// is the only place that ordering is maintained.
//
// `buildReadme(records, template)` is pure (string in, string out) so it can
// be unit-tested against small inline fixtures instead of the real ~350-entry
// data file.

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compareNames, slugify } from './check-list-format.mjs';
import { HEADER, SECTIONS, FOOTER } from './readme-template.mjs';

const NAV_LINKS =
  '[More from StudentSuite](#more-from-studentsuite) &middot; [A Note on Links](#a-note-on-links) &middot; ' +
  '[Quality Standards](#quality-standards) &middot; [Contributing](#contributing) &middot; ' +
  '[Contributors](#contributors) &middot; [License](#license)';

// Groups records by section, then by subsection within each section, keeping
// the first-appearance order of both. A section with no subsections has a
// single group keyed by `null`.
function groupRecords(records) {
  const bySection = new Map();

  for (const record of records) {
    if (!bySection.has(record.section)) {
      bySection.set(record.section, { subsectionOrder: [], bySubsection: new Map() });
    }
    const group = bySection.get(record.section);
    const key = record.subsection ?? null;
    if (!group.bySubsection.has(key)) {
      group.subsectionOrder.push(key);
      group.bySubsection.set(key, []);
    }
    group.bySubsection.get(key).push(record);
  }

  return bySection;
}

function renderDetails(records) {
  const sorted = [...records].sort((a, b) => compareNames(a.name, b.name));
  const lines = sorted.map((r) => `- **[${r.name}](${r.url})** - ${r.description}`);
  return `<details open>\n<summary>Show resources</summary>\n\n${lines.join('\n')}\n\n</details>`;
}

function renderSection(sectionMeta, group) {
  let out = `## ${sectionMeta.heading}\n\n${sectionMeta.blurb}\n\n`;

  if (group.subsectionOrder.length === 1 && group.subsectionOrder[0] === null) {
    out += renderDetails(group.bySubsection.get(null));
  } else {
    const parts = group.subsectionOrder.map(
      (sub) => `### ${sub}\n\n${renderDetails(group.bySubsection.get(sub))}`
    );
    out += parts.join('\n\n');
  }

  out += '\n\n---\n\n';
  return out;
}

// Pure: build the full README.md text from resource records plus the static
// template pieces. `template` is `{ header, sections, footer }` (defaults to
// the real repo template) so tests can substitute tiny fixtures.
export function buildReadme(records, template = { header: HEADER, sections: SECTIONS, footer: FOOTER }) {
  const { header, sections, footer } = template;
  const grouped = groupRecords(records);

  const total = records.length;
  const sectionCount = sections.length;

  const tocRows = sections.map((s) => {
    const group = grouped.get(s.heading);
    const count = group
      ? [...group.bySubsection.values()].reduce((sum, list) => sum + list.length, 0)
      : 0;
    return `| <span role="img" aria-label="${s.ariaLabel}">${s.emoji}</span> | [${s.heading}](#${slugify(
      s.heading
    )}) | ${count} |`;
  });

  const headerFilled = header
    .replace('{{RESOURCES}}', String(total))
    .replace('{{SECTIONS}}', String(sectionCount));

  const toc = `${tocRows.join('\n')}\n\n${NAV_LINKS}\n\n---\n\n`;

  const body = sections
    .map((s) => renderSection(s, grouped.get(s.heading) ?? { subsectionOrder: [null], bySubsection: new Map([[null, []]]) }))
    .join('');

  return headerFilled + toc + body + footer;
}

// --- CLI (runs only when this file is executed directly, not when imported) ---
function invokedDirectly() {
  return process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
}

if (invokedDirectly()) {
  const README_PATH = new URL('../README.md', import.meta.url);
  const DATA_PATH = new URL('../data/resources.json', import.meta.url);
  const check = process.argv.includes('--check');

  const records = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const generated = buildReadme(records);

  if (check) {
    const current = readFileSync(README_PATH, 'utf8');
    if (generated !== current) {
      console.error('✖ README.md is stale: it does not match what data/resources.json generates.');
      console.error('  Run: node scripts/generate-readme.mjs');

      const currentLines = current.split('\n');
      const generatedLines = generated.split('\n');
      const max = Math.max(currentLines.length, generatedLines.length);
      let shown = 0;
      for (let i = 0; i < max && shown < 20; i++) {
        if (currentLines[i] !== generatedLines[i]) {
          console.error(`\n  line ${i + 1}:`);
          console.error(`    README.md:  ${currentLines[i] ?? '<end of file>'}`);
          console.error(`    generated:  ${generatedLines[i] ?? '<end of file>'}`);
          shown++;
        }
      }
      process.exit(1);
    }
    console.log('✔ README.md matches the generated output.');
  } else {
    writeFileSync(README_PATH, generated);
    console.log(`Wrote README.md from ${records.length} record(s) in data/resources.json.`);
  }
}
