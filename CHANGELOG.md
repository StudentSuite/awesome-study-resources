# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project doesn't follow strict semantic versioning (it's a curated list, not
software), but releases are still tagged so changes are easy to point to.

## [Unreleased]

### Added

- Subject coverage audit for `By Subject` (see #12): every existing subsection
  has 3+ entries, but Design Technology, Sports Exercise & Health Science,
  Global Politics, Philosophy, Social and Cultural Anthropology, World
  Religions, ITGS, Dance, Film, Theatre, Accounting, Sociology, Global
  Perspectives, and Physical Education have no subsection at all. These are
  the highest-value contribution targets.
- Monthly pricing re-review for 2026-08 (see #36): all 15 sampled entries'
  pricing tags confirmed accurate, no corrections needed.

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
