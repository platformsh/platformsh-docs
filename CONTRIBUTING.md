# Contributing to the Platform.sh user documentation

Thank you for helping make the Platform.sh documentation better!

These contribution guides should help you keep the docs clear and consistent.
They're intended for use by all contributors,
from Platform.sh engineers to people from the community.

## Adding pages

List pages are made using `_index.md` files in every subdirectory, whereas single pages are generated from every other page without that name.

Additionally, single and list pages are built differently depending on their `layout`, which is defined in `layouts/_default/(single|list).html`. For our documentation, list pages by default generate buttons for each page in that subdirectory, whereas single pages are built from the contents of that file and include a table of contents.


* All files should end in `.md`. They should be all-lower-case and match the title of the page, or in some cases an abbridged version of it.

If you wanted to add a new page for a runtime to the **Languages** section, you would add the following file:

```text
src/
   ...
   languages/
      ...
      new_language.md
```

`new_language.md` should contain at least the following in its front matter at the top of the page.

```
---
title: "New language"
weight: 4
---
```

`title` sets the `<h1>` header for the page title, and weight defines in what order items in this subsection should be listed in the sidebar. Lower weights appear higher up in the sidebar. Here the new page will appear fourth under the **Languages** section.

The new page will have the link `/languages/new_language.html`

### Adding subsections with pages

If you are adding a new *subsection* to **Languages** section, you would instead need to add:

```text
src/
   ...
   languages/
      ...
      new_language/
        _index.md
        specific_page.md
```

`_index.md` is a list page for the `new_language` subsection, and it will still be found at `/languages/new_language.html` like above. If you would like a new subsection's list page to be build to the list default, you can define the front matter the same as listed above for the single page.

Chances are, however, you don't want `_index.md` to be a list of that subdirectory's pages (especially if it's a new language), but rather that it's treated as a single page would: display content and contain a table of contents. You can tell Hugo to do this by including the `layout` attribute in its front matter.

```
---
title: "New language"
weight: 6
layout: single
---
```

`_index.md` will now use the layout for single pages (`layouts/_default/single.html`).

### Sidebar and pages

If you would like the title of a given page to appear differently in the sidebar &mdash; say, a shorter title there, but a more descriptive title on the page &mdash; you can use the `sidebarTitle` attribute in the front matter to define it, while the regular `title` attribute will only be used on the page itself.

```
---
title: "New language support details"    # Title on page
sidebarTitle: "New language"             # How title appears in sidebar
weight: 6
layout: single
---
```

### Disabling table of contents

By default, all pages that use the `single` layout will generate a table of contents beneath their title. If you would like to disable it, add `toc` attribute to your front matter:

```
---
title: "New language"
weight: 4
toc: false
---
```

## Adding security reports

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

## Structure

* Favor short titles for pages and sections.
* Titles of pages and sections should use Sentence case. That is, capitalize the first word and proper nouns only.
* Never have a page in the outline that is more than 2 levels deep. That is, never have a sub-sub item. That ensures all pages are at most 2 clicks away from any other page.
* Each page should cover one topic, but should completely cover that topic. Do not break topics across multiple pages needlessly.
* The use of asides should be sparing. If used, they must begin with a `**bolded**` header of "note" or "warning", as appropriate. Most text simply belongs as part of the prose, however.

## Process

* Favor many small PRs over larger ones.
* Never push directly to the master branch.
* Never merge your own PR, unless not doing so would result in customer data loss.
* Any member of the Developer Relations team may merge a PR they didn't write, although consulting with other members of the team on larger or more consequential PRs is encouraged.
* Typographic, formatting, and spelling fixes made through GitHub's "suggestion" feature do not count as "writing the PR", and may be merged by the reviewer if the PR author is someone outside the DevRel team.
* If your PR relates to new support for runtime or service images, include a complementary line addressing that upgrade in the [Changelog](/src/changelog.md).

conventional commits?
semantic versioning?
