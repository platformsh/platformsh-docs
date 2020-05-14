# Contributing to the Platform.sh User Documentation

Thank you for helping make our documentation better!

In order to maintain a consistent style and voice throughout our documentation please try to follow these standards and conventions when filing Pull Requests against our documentation.

## Markdown

Hugo (which we use for documentation) uses Markdown as its file format.  

* All files should end in `.md`. They should be all-lower-case and match the title of the page, or in some cases an abbridged version of it.
* All pages should start with a title, denoted with # (first level header).
* All pages should start with a [*front matter*](https://gohugo.io/content-management/front-matter/) that describes its title and the order in which it should appear in the sidebar. This requirement applies both to single and list (`_index.md`) pages. See the **Hugo: Front matter** section below for more details. Defining the `title` attribute will automatically place the `<h1>` header for that title, so begin writing your sections with ##.
* Subsections within a page are encouraged, and should use ## for a 2nd level and ### for a 3rd level. Do not have more than 3 levels of header.
* Inline code statements, file names, and keys that would appear in a file should use backticks ``like this``.
* Longer code samples should be denoted with triple backticks before and after, with no extra whitespace between the backticks and the code block. Always specify the language of the code block.  See the [highlight.js docs](https://highlightjs.org/static/demo/) for available language options.  (`yaml`, `bash`, and `php` are the most common we're likely to see).
* Always use inline links.
* Do not hard-wrap prose text. Set your text editor to soft wrapping.
* Internal links should be absolute (starting with `/`). Single pages (i.e. `/configuration/services/elasticsearch.md` should be linked using the `.md` suffix. List pages `/configuration/services/_index.md`, which will be served from `/configuration/services.html` should use the explicit `.html` suffix.

## Hugo: Front matter

In general, this project uses two types of files: "single" and "list". List pages are made using `_index.md` files in every subdirectory, whereas single pages are generated from every other page without that name.

Additionally, single and list pages are built differently depending on their `layout`, which is defined in `layouts/_default/(single|list).html`. For our documentation, list pages by default generate buttons for each page in that subdirectory, whereas single pages are built from the contents of that file and include a table of contents.


### Adding pages

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

## Hugo: Shortcodes

There are a few shortcodes written for the documentation that keep styling consistent and insert specific HTML into pages where they are referenced.

### Notes

For the moment, Hugo does not provide a way to pass values to Markdown's blockquote syntax, but in this documentation there are a few variations on the blockquote that are used for different purposes. So, when leaving a "Note" or blockquote on your pages, use the `note` shortcode instead

```
{{< note >}}
Lorem ipsum
{{< /note }}
```

This shortcode will automatically create the **Note:** first line for you.

`note` accepts two optional parameters:

- `theme`: May be one of `primary`, `info`, or `warning`.  Default is `note`.  This will change the color and the default first line.
- `title`: default dependent on theme.  The default is "Note", "Info", or "Warning" depending on the `theme`.

```
{{< note theme="warning" title="Danger, Will Robinson" >}}
Lorem ipsum!
{{< /note >}}
```

### Images

The standard Markdown syntax for images remains the same, but it is possible to pass values to it that modify the appearance of the image

```
<!-- Normal image syntax -->
![alt-title](/images/current_image.png)

<!-- Scaled image -->
![alt-title](/images/current_image.png "0.5")

<!-- Scaled image displayed inline, such as an icon in a sentence -->
![alt-title](/images/current_image.png "0.1-inline")
```

### Videos & asciinema

Displaying videos and asciinema recordings requires their own shortcodes, but they have identical parameters:

```
<!-- Video -->
{{< video src="videos/management-console/new-project-creation.mp4" >}}

<!-- Asciinema -->
{{< asciinema src="videos/asciinema/verify-cli-extended.cast" >}}
```

### Codetabs

You can display tabbed content that will apply syntax highlighting to it where defined.

```
{{< codetabs >}}

---
title=Elasticsearch
file=static/files/fetch/examples/php/elasticsearch
highlight=php
---

<--->

---
title=Memcached
highlight=python
---

from jwcrypto import jws, jwk

{{< /codetabs >}}
```

The first tab *Elasticsearch* will read from a local file and highlight it for PHP, whereas the second tab will apply Python highlighting to the content below `---`. Individual tabs are separated with the `<--->` line.

`markdownify` is `false` by default, although everything placed below `---` will be Markdown-rendered properly. This attribute really only needs to be `true` in cases where the `file` you are using for the tab's content is itself a `.md` file.

Not all of these parameters need to be present for `codetabs` to function properly.  The only required properties are `title` and `highlight`.

## Content

The goal of Platform.sh's documentation is to help tech-savvy users self-educate on how to use and get the most out of Platform.sh.  Therefore, the reader should be assumed to be familiar with common web development tools and practices (version control, Git, branching, web servers, databases, etc.), but not necessarily with server administration.  When in doubt, favor providing more background information rather than less, and/or link out to existing resources for background.

 The aim of the documentation is less to provide context-less "how" information but to emphasize the underlying "why" behind what needs to be done.  All documentation should strive to help improve the user's mental model of how the system works so that they can self-educate more effectively. That also means that not every tip or trick needs to be included if they're not especially common cases.

 That said, undocumented options should be treated as a bug, unconditionally.

## Structure

* Favor short titles for pages and sections.
* Titles of pages and sections should use Sentence case.  That is, capitalize the first word and proper nouns only.
* Never have a page in the outline that is more than 2 levels deep. That is, never have a sub-sub item.  That ensures all pages are at most 2 clicks away from any other page.
* Each page should cover one topic, but should completely cover that topic. Do not break topics across multiple pages needlessly.
* The use of asides should be sparing.  If used, they must begin with a `**bolded**` header of "note" or "warning", as appropriate. Most text simply belongs as part of the prose, however.

## Language usage

* All documentation should be written in American English, using American English spelling.
* Always use the [Oxford Comma](https://en.wikipedia.org/wiki/Serial_comma).
* The name of the company is always written as "Platform.sh", not simply "Platform". It should not be linked anywhere.
* "We" should, if used, always refer to Platform.sh the company.  However, avoid its use where feasible.
* The reader is assumed to be a developer, and should be addressed as "you".  E.g., "Once you add this file to your repository...".
* Avoid the use of gender-specific pronouns (he/she, his/her).  The "singular they" (they/their) should be used when it is necessary to refer to a person in the 3rd person.
* When referring to a file path in a YAML code example, do not include a leading `/` prefix unless it truly is based on the absolute root of the file tree.  In most cases it is relative to some other location so the `/` should not be used.
* When referring to a URL path in a YAML code example, assume it is relative to the domain root and therefore should include a leading `/`.

## Process

* Favor many small PRs over larger ones.
* Never push directly to the master branch.
* Never merge your own PR, unless not doing so would result in customer data loss.
* Any member of the Developer Relations team may merge a PR they didn't write, although consulting with other members of the team on larger or more consequential PRs is encouraged.
* Typographic, formatting, and spelling fixes made through GitHub's "suggestion" feature do not count as "writing the PR", and may be merged by the reviewer if the PR author is someone outside the DevRel team.
* If your PR relates to new support for runtime or service images, include a complementary line addressing that upgrade in the [Changelog](/src/changelog.md).
