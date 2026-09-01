// Static (non-data-driven) template content for scripts/generate-readme.mjs.
//
// Everything here is content the generator does not compute: the header
// (with {{RESOURCES}} / {{SECTIONS}} placeholders for the badge counts), the
// per-section metadata needed to render the Table of Contents and section
// headings (emoji, aria-label, one-line blurb), and the footer, which is
// static prose/links rather than a list of resource entries (see README.md's
// "More from StudentSuite" through "License" sections).
//
// Section *order* and which sections have subsections (and the order of
// those subsections, e.g. By Subject's curated "Mathematics, Statistics,
// Further Mathematics, ..." order rather than alphabetical) both come from
// data/resources.json itself: the generator walks records in file order and
// takes the first-seen order of each section/subsection. SECTIONS below only
// needs to supply what isn't in the data: the heading's icon and blurb.
// Keep SECTIONS in the same order as the sections appear in
// data/resources.json (checked by generate-readme.test.mjs / --check).

export const HEADER = `<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logo-lockup-dark.svg">
  <img src="./logo-lockup.svg" alt="Awesome Study Resources" width="460">
</picture>

# Awesome Study Resources

**A curated list of the best exam prep, subject-study, and learning-tool resources for students.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Resources](https://img.shields.io/badge/resources-{{RESOURCES}}-blue)
![Sections](https://img.shields.io/badge/sections-{{SECTIONS}}-purple)
[![Changelog](https://img.shields.io/badge/changelog-v1.0.0-blue.svg)](CHANGELOG.md)

</div>

---

This is a curation list, not a code library. Every entry links out to a tool, channel, or book maintained by someone else, not to something hosted here. IB, IGCSE, SAT, and any student anywhere: add yours by opening a PR, see [CONTRIBUTING.md](CONTRIBUTING.md).

> Entries note when something is free, freemium, paid, or open source (FOSS), so you know before you click. Resources within each list are ordered alphabetically. See the [Quality Standards](#quality-standards) for what earns a spot.
>
> Maintained by [StudentSuite](https://github.com/StudentSuite) &middot; [Report a broken link](https://github.com/StudentSuite/awesome-study-resources/issues/new/choose) &middot; [Ask a question](https://github.com/StudentSuite/awesome-study-resources/discussions) &middot; [Changelog](CHANGELOG.md)

---

## Table of Contents

| | Section | Resources |
| :-: | --- | :-: |
`;

// One row per content section, in README order. `emoji` and `ariaLabel` feed
// the Table of Contents icon column; `blurb` is the one-line, italic-free
// description printed under the `##` heading.
export const SECTIONS = [
  {
    heading: 'Exam & Curriculum Prep',
    emoji: '📝',
    ariaLabel: 'Exam and Curriculum Prep icon',
    blurb: 'Official and community prep for the big exams and curricula.',
  },
  {
    heading: 'By Subject',
    emoji: '📚',
    ariaLabel: 'By Subject icon',
    blurb: 'Flagship picks per subject: mix a strong site, a channel, and a practice tool.',
  },
  {
    heading: 'Notes & Knowledge Management',
    emoji: '🗒️',
    ariaLabel: 'Notes and Knowledge Management icon',
    blurb: 'Capture, link, and organize what you learn.',
  },
  {
    heading: 'Flashcards & Spaced Repetition',
    emoji: '🧠',
    ariaLabel: 'Flashcards and Spaced Repetition icon',
    blurb: 'Remember more with less rereading.',
  },
  {
    heading: 'Task, Time & Planning',
    emoji: '⏰',
    ariaLabel: 'Task, Time and Planning icon',
    blurb: 'Plan the week, protect the deadlines.',
  },
  {
    heading: 'Writing, Citations & Reference',
    emoji: '✍️',
    ariaLabel: 'Writing, Citations and Reference icon',
    blurb: 'Draft, cite, and polish papers.',
  },
  {
    heading: 'AI & Academic Integrity',
    emoji: '⚖️',
    ariaLabel: 'AI and Academic Integrity icon',
    blurb: "Know what's allowed, and how to cite AI-assisted work, before you submit.",
  },
  {
    heading: 'Diagramming & STEM Tools',
    emoji: '📐',
    ariaLabel: 'Diagramming and STEM Tools icon',
    blurb: 'Graph, compute, and sketch ideas.',
  },
  {
    heading: 'Building Software / Learn to Code',
    emoji: '💻',
    ariaLabel: 'Building Software / Learn to Code icon',
    blurb: 'Go from first line to shipped project.',
  },
  {
    heading: 'YouTube Channels We Trust',
    emoji: '▶️',
    ariaLabel: 'YouTube Channels We Trust icon',
    blurb: 'Channels that teach, not just entertain.',
  },
  {
    heading: 'Great Textbooks',
    emoji: '📕',
    ariaLabel: 'Great Textbooks icon',
    blurb: 'Subject textbooks students and teachers keep coming back to.',
  },
];

// Everything after the last content section's closing "---" separator: static
// prose and links, not resource entries, so it isn't derived from
// data/resources.json. Kept verbatim from README.md.
export const FOOTER = `## More from StudentSuite

- **[Awesome Skills & Plugins for Students](https://github.com/StudentSuite/awesome-skills-plugins-for-students)** - Curated AI coding-agent skills and plugins built for students (free).
- **[Awesome Student Resources](https://github.com/StudentSuite/awesome-student-resources)** - Curated discounts, scholarships, career prep, and wellbeing resources for students (free).
- **[StudyMap](https://github.com/StudentSuite/StudyMap)** - A crowdsourced map of student-important places: exam centres, libraries, and more (free).

---

## A Note on Links

> [!NOTE]
> This list points to third-party tools, channels, and books. StudentSuite does not own, host, or endorse them, and it earns nothing from these links. Pricing and free tiers change, so check the current terms before you commit. If a listed entry is dead, misleading, or no longer free where we said so, open an issue or PR to fix it.

---

## Quality Standards

An entry should meet all of the following before being added:

- [ ] **Genuinely useful to students.** It helps you study, build, or organize, not just browse.
- [ ] **Real and maintained.** Actively available, not abandoned or a dead link.
- [ ] **Accessible.** Free, freemium, or clearly worth the price; note the pricing in the entry.
- [ ] **Reputable.** A known tool, channel, or book, not spam or an affiliate funnel.
- [ ] **Short description.** One line, plain language, no marketing copy.

---

## Contributing

PRs adding a resource are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the entry format and PR checklist, and the [Code of Conduct](CODE_OF_CONDUCT.md) for how we expect people to treat each other here. See [CHANGELOG.md](CHANGELOG.md) for release history.

---

## Contributors

Thanks to everyone who has added a resource, fixed a link, or improved the format.

[![Contributors](https://contrib.rocks/image?repo=StudentSuite/awesome-study-resources)](https://github.com/StudentSuite/awesome-study-resources/graphs/contributors)

---

## License

This repository is released under the [MIT License](LICENSE). The license covers this list itself: the README, CONTRIBUTING.md, and curation structure. It does not cover the tools, channels, or books linked from it, each of those is owned and licensed by its own author.
`;
