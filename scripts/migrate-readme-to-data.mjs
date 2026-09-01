#!/usr/bin/env node
// ONE-OFF migration: parses the resource entries out of the hand-maintained
// README.md and writes them into data/resources.json, the new source of truth
// for the generator (scripts/generate-readme.mjs).
//
// This script is kept in the repo for reference/re-runs (e.g. if the data file
// is ever lost), but it isn't part of the normal contributor workflow: once
// data/resources.json exists, contributors edit it directly instead.
//
// Usage:
//   node scripts/migrate-readme-to-data.mjs
//
// Parsing mirrors scripts/check-list-format.mjs's block walk: track the
// current ## / ### heading, only look inside <details>...</details>, and
// skip NON_CONTENT_SECTIONS (front-matter/footer headings like "More from
// StudentSuite" are static template content, not data-driven entries).

import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { NON_CONTENT_SECTIONS } from './check-list-format.mjs';

// Pure: parse README text into an array of resource records:
//   { name, url, description, section, subsection }
// `subsection` is null when the section has no ### subheadings.
export function parseReadmeToRecords(readmeText) {
  const lines = readmeText.split('\n');
  const records = [];

  let section = null;
  let subsection = null;
  let inContentSection = false;
  let inDetails = false;

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);

    if (h2) {
      section = h2[1].trim();
      subsection = null;
      inContentSection = !NON_CONTENT_SECTIONS.has(section);
      continue;
    }
    if (h3) {
      subsection = h3[1].trim();
      continue;
    }
    if (line.startsWith('<details')) {
      inDetails = true;
      continue;
    }
    if (line.startsWith('</details>')) {
      inDetails = false;
      continue;
    }
    if (!inDetails || !inContentSection) continue;

    const item = line.match(/^- \*\*\[(.+?)\]\((.+?)\)\*\*\s*-\s*(.+)$/);
    if (!item) continue;

    records.push({
      name: item[1],
      url: item[2],
      description: item[3],
      section,
      subsection,
    });
  }

  return records;
}

// --- CLI (runs only when this file is executed directly, not when imported) ---
function invokedDirectly() {
  return process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
}

if (invokedDirectly()) {
  const README_PATH = new URL('../README.md', import.meta.url);
  const DATA_PATH = new URL('../data/resources.json', import.meta.url);

  const records = parseReadmeToRecords(readFileSync(README_PATH, 'utf8'));
  writeFileSync(DATA_PATH, JSON.stringify(records, null, 2) + '\n');

  console.log(`Wrote ${records.length} record(s) to data/resources.json.`);
}
