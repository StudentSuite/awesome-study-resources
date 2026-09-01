# Contributing

This repository curates links only. The tool, channel, or book you add lives wherever it already lives, we just point to it.

By participating, you're expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

Have an open-ended question rather than a resource to add, a broken link, or a new-section proposal? Ask it in [Discussions](https://github.com/StudentSuite/awesome-study-resources/discussions) instead of opening an issue.

---

## Finding an issue

If you want to contribute but aren't sure where to start, check out our open issues:

- If you're new to the project or open source, we recommend starting with issues labeled **good first issue**.
- If you have more experience, you can also look for **help wanted** issues.

---

## Before you open a PR

Check the entry meets the [Quality Standards](README.md#quality-standards):

- [ ] Genuinely useful to students for studying, building, or organizing.
- [ ] Real and maintained, not abandoned or a dead link.
- [ ] Free, freemium, or clearly worth the price, with the pricing noted.
- [ ] A reputable tool, channel, or book, not spam or an affiliate funnel.
- [ ] Short, plain-language description.

---

## Entry format

README.md is generated, not hand-edited: it's built from `data/resources.json` by `scripts/generate-readme.mjs`. Add your resource as one record in that JSON array instead of editing README.md's markdown directly:

```json
{
  "name": "Deep Work",
  "url": "https://calnewport.com/books/deep-work/",
  "description": "Build the ability to focus without distraction (free).",
  "section": "Great Textbooks",
  "subsection": null
}
```

Field reference:

- `name` - the link text.
- `url` - the homepage, starting with `https://` (or `http://` for the rare site with no https variant).
- `description` - the full description text exactly as it should render, trailing period and any pricing parenthetical included. This is the whole sentence, not just the prose part: don't split pricing into a separate field, it won't be re-appended.
- `section` - the exact `##` heading text this entry belongs under (see "Where it goes" below), e.g. `"By Subject"`.
- `subsection` - the exact `###` heading text within that section, e.g. `"Mathematics"`, or `null` if the section has no subsections (see "Where it goes" below for which sections do).

Keep the description to one line, roughly 10 words or fewer. Lead with a verb where it reads naturally, skip adjectives like "amazing" or "powerful," and note the pricing when it matters: `(free)`, `(freemium)`, `(paid)`, or "free, open source" for FOSS. No em dashes.

"When it matters" means: tag it if a student could reasonably be surprised (a freemium tool that reads as free, a paid service, a free tier with real limits). You don't need to tag something whose free-ness is already obvious from the description itself (an official government site, an open-source project, a nonprofit's own guide).

After editing `data/resources.json`, run `node scripts/generate-readme.mjs` to regenerate README.md (see [CI checks](#ci-checks) below) and commit both files.

---

## Where it goes

Set your record's `section` (and `subsection`, where listed) to the closest match:

- Exam & Curriculum Prep (A-Level, ACT, AP, AP Computer Science, CAS, Extended Essay, GCSE, IB Diploma, IGCSE, PSAT, SAT, Theory of Knowledge)
- By Subject (Mathematics, Statistics, Further Mathematics, Physics, Chemistry, Biology, Computer Science, Design Technology, ITGS, Economics, Accounting, Business Studies, English Language and Literature, Foreign Languages, Latin, Philosophy, World Religions, History, Global Perspectives, Global Politics, Classical Civilisation, Geography, Law, Environmental Systems & Societies, Sports, Exercise & Health Science, Food & Nutrition, Health and Social Care, Social and Cultural Anthropology, Psychology, Sociology, Physical Education, Art, Film, Photography, Media Studies, Music, Theatre, Dance)
- Notes & Knowledge Management
- Flashcards & Spaced Repetition
- Task, Time & Planning
- Writing, Citations & Reference
- AI & Academic Integrity
- Diagramming & STEM Tools
- Building Software / Learn to Code (Learn to Code, Coding Practice)
- YouTube Channels We Trust
- Great Textbooks

If nothing fits, open an issue first to discuss a new section before adding one. Discounts, scholarships, career prep, debate, homeschooling, FOSS picks, blogs/podcasts, books, guides, mental health, and community resources live in [Awesome Student Resources](https://github.com/StudentSuite/awesome-student-resources) instead.

---

## Submitting

1. Fork the repo, add your record(s) to `data/resources.json` (see [Entry format](#entry-format) above), anywhere in the array; you don't need to place it alphabetically yourself.
2. Run `node scripts/generate-readme.mjs` to regenerate README.md, and commit both files.
3. Open a PR titled `Add resource: Name`.
4. In the PR description, link the resource and say in one sentence why it helps students.

The generator sorts every list alphabetically (case-insensitive) by entry name, so you don't need to find the right alphabetical position by hand, just run it after editing the data file.

If your PR removes an entry (dead link, discontinued service, no longer meets the Quality Standards), delete its record from `data/resources.json`, regenerate README.md, and add a one-line note under CHANGELOG.md's `Unreleased > Removed` section saying what was removed and why.

---

## Versioning

Tagged releases follow this convention:

- **Minor** (`1.x.0`): a new top-level or subsection is added.
- **Patch** (`1.0.x`): entry additions, fixes, or removals within existing sections.

CHANGELOG entries go under `Unreleased` as you make them; a maintainer moves
that section under a new version heading when tagging a release.

---

## CI checks

These scripts use Node's built-in test runner and need Node 18+; an `.nvmrc` pins the same version CI uses (`nvm use`, or match it manually).

README.md is generated from `data/resources.json`; there's nothing there to hand-maintain, but a few checks keep the two in sync. Run all of these yourself before opening a PR:

```sh
node scripts/validate-resources.mjs
node scripts/generate-readme.mjs --check
node scripts/check-list-format.mjs
node scripts/update-counts.mjs --check
```

- `scripts/validate-resources.mjs` checks `data/resources.json` itself: every record has a non-empty `name`, `url`, `description`, and `section`; `url` starts with `https://` (or `http://`); `subsection` is a non-empty string or `null`; and no two records share the same `section` + `subsection` + `name`.
- `scripts/generate-readme.mjs --check` fails if README.md doesn't match what `data/resources.json` currently generates, i.e. you edited README.md by hand instead of the data file, or forgot to regenerate after editing the data file. Fix it with `node scripts/generate-readme.mjs` (no `--check`), which rewrites README.md in place.
- `scripts/check-list-format.mjs` runs on the generated README.md as a safety net: it verifies the entry format, alphabetical order, that the Table of Contents matches the section headings, that descriptions don't use marketing adjectives ("amazing," "powerful," and similar; see the `BANNED_ADJECTIVES` list in the script), and that the "Where it goes" list above stays in sync with README's section headings (same names, same order). The generator should always produce output that passes this, so a failure here on a generated README usually means a bug in the generator or the template, worth flagging.
- `scripts/update-counts.mjs --check` fails if the header badges (`resources-N`, `sections-N`) or the per-section Table of Contents counts are out of date. These are also computed by the generator, so this is a second safety net rather than something you need to run separately in normal use.

All four run in CI on every PR that touches `data/resources.json`, README.md, or this file.

A separate scheduled workflow (`.github/workflows/dead-link-check.yml`) checks every link in every file listed in its `args` (currently README.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md, CONTRIBUTORS.md, SECURITY.md, and the PR template) weekly using [lychee](https://github.com/lycheeverse/lychee), configured via `lychee.toml`. Some legitimate sites reject automated requests with a 403, so that status is accepted rather than treated as broken; see the comments in `lychee.toml` for the current exceptions.

A third workflow (`.github/workflows/markdownlint.yml`) runs `markdownlint-cli2` on every Markdown file. Its config, `.markdownlint.jsonc`, turns off the rules that conflict with this repo's intentional style: long single-line entries (MD013) and the `<details>`/`<picture>` inline HTML used for collapsible sections and the logo (MD033, scoped to just those elements).

The lint workflow also runs `scripts/audit-duplicate-urls.mjs`, which reports every URL used more than once anywhere in README.md. This is informational only and never fails the build: the same resource legitimately appears in more than one section (e.g. Physics & Maths Tutor under both A-Level and IGCSE), so a duplicate URL isn't a bug on its own, just something worth a glance during review.

The lint scripts have their own unit tests (`scripts/*.test.mjs`, using Node's built-in `node:test`), run by `.github/workflows/test.yml` whenever anything under `scripts/` changes. Run them locally with:

```sh
node --test scripts/*.test.mjs
```

A `.github/workflows/welcome.yml` workflow (via `actions/first-interaction`) leaves a short comment on a contributor's first issue and first PR, pointing them to this file and the Quality Standards. It's a one-time greeting, not a gate; it never blocks anything.

A monthly workflow (`.github/workflows/pricing-review.yml`) opens an issue with a rotating sample of entries (built by `scripts/pricing-review.mjs`) for a maintainer to spot-check that pricing tags are still accurate. A tool that quietly starts charging still returns HTTP 200, so the dead-link check won't catch it; this is the manual backstop. Preview the current sample locally with `node scripts/pricing-review.mjs`.
