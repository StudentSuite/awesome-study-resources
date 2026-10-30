#!/usr/bin/env node
// Validates data/resources.json, the source of truth README.md is generated
// from (see scripts/generate-readme.mjs).
//
// --- Schema: one resource record ---
//
//   {
//     "name": string,          // required, non-empty. Rendered as the link text.
//     "url": string,           // required, non-empty. Must start with "https://"
//                               // HTTPS-only: every resource must use a secure URL.
//     "description": string,   // required, non-empty. The FULL description text
//                               // exactly as it should render, trailing period and
//                               // any pricing parenthetical included, e.g.:
//                               //   "Free graphing calculator for exploring functions (free)."
//                               // The generator does not re-append pricing tags, so
//                               // don't split them into a separate field: write the
//                               // whole sentence here.
//     "section": string,       // required, non-empty. The exact `## ` heading text
//                               // this entry belongs under, e.g. "By Subject".
//     "subsection": string|null // the exact `### ` heading text within `section`,
//                               // or null if that section has no subsections (e.g.
//                               // Notes & Knowledge Management, Flashcards & Spaced
//                               // Repetition, Task, Time & Planning, Writing,
//                               // Citations & Reference, AI & Academic Integrity,
//                               // Diagramming & STEM Tools, YouTube Channels We
//                               // Trust, Great Textbooks are flat; Exam & Curriculum
//                               // Prep, By Subject, and Building Software / Learn to
//                               // Code have subsections).
//   }
//
// data/resources.json is a JSON array of these records. Order in the file
// only matters in that the *first* time a (section, subsection) pair is seen
// establishes that subsection's position in the generated README (see
// generate-readme.mjs); entries themselves are sorted alphabetically by the
// generator regardless of file order.
//
// Usage:
//   node scripts/validate-resources.mjs
//
// Exits 1 with every problem listed on failure, 0 with a summary on success.
// `validateResources(records)` is pure (array in, array of error strings out)
// so it can be unit-tested against inline fixtures.

import { readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SECTIONS } from './readme-template.mjs';

const REQUIRED_STRING_FIELDS = ['name', 'url', 'description', 'section'];

export function validateResources(records, sections = SECTIONS) {
  const errors = [];

  if (!Array.isArray(records)) {
    return ['data/resources.json must be a JSON array of resource records.'];
  }

  const validSections = new Set(sections.map((s) => (typeof s === 'string' ? s : s.heading)));
  const seenCombos = new Map(); // "section/subsection/name" -> first index

  records.forEach((record, i) => {
    const where = `record ${i}${record && record.name ? ` (${JSON.stringify(record.name)})` : ''}`;

    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      errors.push(`${where}: expected an object, got ${JSON.stringify(record)}.`);
      return;
    }

    for (const field of REQUIRED_STRING_FIELDS) {
      const value = record[field];
      if (typeof value !== 'string' || value.trim() === '') {
        errors.push(`${where}: "${field}" must be a non-empty string.`);
      }
    }

    if ('subsection' in record && record.subsection !== null) {
      if (typeof record.subsection !== 'string' || record.subsection.trim() === '') {
        errors.push(`${where}: "subsection" must be a non-empty string or null.`);
      }
    }

    if (typeof record.url === 'string') {
      if (!/^https:\/\//.test(record.url)) {
        errors.push(`${where}: "url" must start with "https://": ${record.url}`);
      } else {
        try {
          const parsed = new URL(record.url);
          for (const key of parsed.searchParams.keys()) {
            if (key.startsWith('utm_') || ['fbclid', 'gclid', 'ref', 'si'].includes(key)) {
              errors.push(`${where}: "url" contains tracking query parameter "${key}": ${record.url}`);
            }
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    if (typeof record.section === 'string') {
      if (!validSections.has(record.section)) {
        errors.push(
          `${where}: unknown section "${record.section}". Valid sections are: ${Array.from(validSections).join(', ')}.`
        );
      } else {
        const key = JSON.stringify([record.section, record.subsection ?? null, record.name]);
        if (seenCombos.has(key)) {
          errors.push(
            `${where}: duplicate entry for section/subsection/name, already seen at record ${seenCombos.get(key)}.`
          );
        } else {
          seenCombos.set(key, i);
        }
      }
    }
  });

  return errors;
}

// --- CLI (runs only when this file is executed directly, not when imported) ---
function invokedDirectly() {
  return process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
}

if (invokedDirectly()) {
  const DATA_PATH = new URL('../data/resources.json', import.meta.url);

  let records;
  try {
    records = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  } catch (err) {
    console.error(`✖ Could not read/parse data/resources.json: ${err.message}`);
    process.exit(1);
  }

  const errors = validateResources(records);

  if (errors.length) {
    console.error(`✖ ${errors.length} issue(s) found in data/resources.json:\n`);
    for (const e of errors) console.error(`  ${e}`);
    process.exit(1);
  }

  console.log(`✔ data/resources.json is valid (${records.length} record(s)).`);
}
