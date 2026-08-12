# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project doesn't follow strict semantic versioning (it's a curated list, not
software), but releases are still tagged so changes are easy to point to.

## [Unreleased]

A round of infra, accessibility, and content fixes closing 22 open issues
(#10, #12, #13, #29, #31, #33, #34, #35, #36, #40-46, #48-52, #67), plus the
v1.0.0 tag itself.

### Added

- A `### Philosophy` subsection under By Subject, with 3 vetted entries
  (#44).
- Screen-reader labels (`role="img"` + `aria-label`) on every Table of
  Contents emoji, so they announce the section name instead of a raw emoji
  Unicode name (#35).
- A 1280x640 social preview image, source and export, matching the existing
  brand lockups (#10).
- A "Versioning" section in CONTRIBUTING.md documenting the minor/patch
  convention behind tagged releases (#13).
- Subject coverage audit for `By Subject` (see #12): every existing subsection
  has 3+ entries, but Design Technology, Sports Exercise & Health Science,
  Global Politics, Social and Cultural Anthropology, World Religions, ITGS,
  Dance, Film, Theatre, Accounting, Sociology, Global Perspectives, and
  Physical Education have no subsection at all. These are the highest-value
  contribution targets. (Philosophy was also on this list; it got its own
  subsection closing #44, so it's since been dropped from it.)
- Monthly pricing re-review for 2026-08 (see #36): all 15 sampled entries'
  pricing tags confirmed accurate, no corrections needed.

### Fixed

- `check-list-format.mjs` now enforces CONTRIBUTING.md's "no em dashes" rule
  (#40) and `pricing-review.mjs` now recognizes the documented "free, open
  source" FOSS tagging convention (#49), two documented rules the tooling
  had never actually checked.
- `update-counts.mjs`'s resources badge no longer counts entries under
  non-content sections like "More from StudentSuite" (#48).
- `audit-duplicate-urls.mjs` now normalizes scheme/host case and a `www.`
  prefix, so it stops under-reporting real duplicate URLs (#43).
- `dead-link-check.yml` no longer opens a fresh duplicate issue on every
  failing scheduled run; it updates/closes a single existing one (#34), and
  now scans the PR template too, alongside `markdownlint.yml` (#41, #42).
- `lint.yml`, `markdownlint.yml`, and `validate-yaml.yml` now retrigger on
  edits to themselves, matching `test.yml` (#46).
- `stale.yml` now exempts this repo's actual roadmap labels
  (`good first issue`, `help wanted`, `maintainer`) from auto-closing (#29).
- `validate-yaml.yml` pins `js-yaml` to an exact version instead of floating
  on `@4` (#31).
- Issue templates, bot-created issues, and Dependabot PRs now carry this
  repo's own custom labels (`quality`, `content`, `infra`) alongside the
  generic ones (#33, #52).
- CODE_OF_CONDUCT.md no longer suggests reporting abuse via a public issue,
  which contradicted its own privacy promise two sentences later (#51).
- Two stale doc references to the dead-link-check workflow's file list
  corrected to match what it actually scans (#45), and a CODEOWNERS comment
  corrected to match its actual (single-rule) content (#50).

## [1.0.0] - 2026-08-11

### Added

- Split out of [awesome-student-resources](https://github.com/StudentSuite/awesome-student-resources)
  on 2026-07-23, carrying over the exam, curriculum, and subject-study content:
  Exam & Curriculum Prep (SAT, ACT, AP, A-Level, GCSE, IGCSE, IB), By Subject
  (Mathematics, Statistics, Further Mathematics, Physics, Chemistry, Biology,
  Computer Science, Economics, Business Studies, English Language and
  Literature, Foreign Languages, History, Geography, Environmental Systems &
  Societies, Psychology, Art, Music), Notes & Knowledge Management, Flashcards
  & Spaced Repetition, Task, Time & Planning, Writing, Citations & Reference,
  AI & Academic Integrity, Diagramming & STEM Tools, Building Software / Learn
  to Code (with a Coding Practice subsection), YouTube Channels We Trust, and
  Great Textbooks. The sibling repo keeps the sections about life around
  school (discounts, scholarships, career prep, debate, homeschooling, FOSS
  picks, blogs/podcasts, books, guides, mental health, communities) instead.
- `CONTRIBUTING.md` describing the entry format, quality standards, and where
  new resources go, `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1),
  `SECURITY.md`, and an `.editorconfig`, matching the sibling repo's file set.
- GitHub issue templates for resource suggestions, broken links, and new
  section proposals, plus a pull request template.
- CI: `scripts/check-list-format.mjs` validates entry format, alphabetical
  order, and Table of Contents consistency on every PR.
- CI: a scheduled dead-link checker (`lychee`, weekly) that opens an issue
  when a link breaks in any of the files it scans (README.md, CONTRIBUTING.md,
  CODE_OF_CONDUCT.md, CHANGELOG.md, CONTRIBUTORS.md, SECURITY.md, or the PR
  template).
- CI: `markdownlint-cli2` with a repo-specific config that respects this
  list's intentional style (long single-line entries, collapsible sections).
- CI: a non-blocking `scripts/audit-duplicate-urls.mjs` report that surfaces
  every URL reused across sections, for reviewers to glance at.
- CI: a monthly `scripts/pricing-review.mjs` sample for spot-checking that
  pricing tags are still accurate.
- Dependabot configuration to keep GitHub Actions versions current.

[Unreleased]: https://github.com/StudentSuite/awesome-study-resources/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/StudentSuite/awesome-study-resources/commits/v1.0.0
