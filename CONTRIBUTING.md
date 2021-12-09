# Contributing to the Platform.sh user documentation

Thank you for helping make the Platform.sh documentation better!

These contribution guides should help you keep the docs clear and consistent.
They're intended for use by all contributors,
from Platform.sh engineers to people from the community.

For style and formatting guidance, see:

* [Content style guide](contributing/content-style.md)
* [Markup reference](contributing/markup-format.md)

For structure and layout, see:
* [Templates](/docs/templates)

## Table of contents

- [Adding pages](#adding-pages)
  - [Adding security reports](#adding-security-reports)
- [Commit messages](#commit-messages)
- [Review process](#review-process)

## Adding pages

To get a head start on your page, copy one of the [templates](/docs/templates).

All file names should end in `.md`.
They should be all lowercase
and match the page title or a short version of it.

To add a page to an existing section such as **Languages**, add the following file:

```text
src/
   ...
   languages/
      ...
      new_language.md
```

Make sure that you give it the required [front matter](contributing/markup-format.md#front-matter).

To add a new subsection that contains multiple pages under an existing section,
add a directory and an `_index.md` file:

```text
src/
   ...
   languages/
      ...
      new_language/
        _index.md
        specific_page.md
```

By default, the `_index.md` file has a `list` layout,
which means it contains buttons linking to all pages in its directory.
To override this and include content from the `_index.md` file itself,
set the `layout` to `single` in the [front matter](contributing/markup-format.md#front-matter).

### Adding security reports

To add a security transparency report for a new year (after receiving the data):

1. Copy the tables from the previous year:

   ```bash
   cp -R docs/layouts/shortcodes/tranparency-reports/tables/2020/ docs/layouts/shortcodes/tranparency-reports/tables/2021
   ```
1. Copy the template from the previous year:

   ```bash
   cp docs/src/security/transparency/2020_report.md docs/src/security/transparency/2021_report.md
   ```
1. Update instances of the year in the new `.md` file:

   * In the front matter (`title`, `sidebarTitle`, and `file`)
   * In all shortcodes
1. Run the docs locally and navigate to the new page _using Firefox_.
1. Print the page as a PDF and save in `docs/static/files/reports/transparency-abuse/`.

   Save the file as `<YEAR>_platformsh_transparency_report.pdf` (replacing `<YEAR>` with the current year).

The report text is in `docs/data/transparency-reports.yaml`.

## Commit messages

To help understand why changes happened and not repeat work already done,
we want to keep a meaningful history of changes to the project.
This means we ask you to use meaningful commit messages (not just `Updated file.md`).

The pattern we use is:

```txt
:GITMOJI: Verb + action

Optional extra context
```

Where `GITMOJI` is the [gitmoji](https://gitmoji.dev/) that corresponds to what the change is. For example:

```txt
:sparkles: Add documentation for organizations

Added new pages to describe how organizations at Platform.sh work.
```

To help with the process, you can install the [gitmoji CLI](https://github.com/carloscuesta/gitmoji-cli).

## Review process

<!-- vale Platform.first-person = NO -->
Our default branch is protected, so you can't push directly to it
and pull requests require approval from someone with write access.

We're happy to review your suggested changes.
We generally review for:

* Accuracy
* Clarity
* Consistency with our [style guide](contributing/content-style.md)

To speed the process along, we may merge small changes such as spelling and formatting
into your branch.
Otherwise, we make suggestions and work with you to finalize the changes.
