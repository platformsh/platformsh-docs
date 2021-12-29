# Markup reference for Platform.sh docs

## Table of contents

- [Markdown](#markdown)
- [Front matter](#front-matter)
- [Headings](#headings)
- [Line wrapping](#line-wrapping)
- [Links](#links)
- [Notes](#notes)
- [Images](#images)
- [Videos & asciinema](#videos--asciinema)
- [Code](#code)
  - [Indentation](#indentation)
- [Code tabs](#code-tabs)
- [Reusing content](#reusing-content)

## Markdown

These docs are written in Markdown with [GitHub Flavored Markdown](https://github.github.com/gfm/) syntax supported.
It also supports [definition lists](https://michelf.ca/projects/php-markdown/extra/#def-list),
[footnotes](https://michelf.ca/projects/php-markdown/extra/#footnotes),
and [smart typography](https://daringfireball.net/projects/smartypants/).
Plus the modifications noted below.

It's rendered by the [Goldmark parser](https://github.com/yuin/goldmark/).

## Front matter

All pages should start with [*front matter*](https://gohugo.io/content-management/front-matter/).
The following table presents the available options:

| Item           | Type               | Description |
|----------------|--------------------|-------------|
| `title`        | string             | The title that appears as an `<h1>` element at the top of the page. |
| `sidebarTItle` | string             | An optional short version of the title to appear in the navigation sidebar. |
| `weight`       | integer            | Defines the order in which the page should appear in the sidebar. Higher numbers are lower. |
| `toc`          | Boolean            | Optionally allows you to hide the table of contents on a page (by setting to `false`). |
| `layout`       | `single` or `list` | Set to `single` on `_index.md` files to give them the same layout as other pages. |
| `aliases`      | list of strings    | Optionally creates redirects to the page from the given locations. Start with `/` for root-relative locations. Start with `../` for locations relative to the current page. |
| `description`  | string             | Appears on `list` pages as a description of the page's content. Also overrides generic content for the `<meta name="description">` tag for SEO. Can be used in the page with the `description` shortcode. |

## Headings

Because the title of a page should come from the [front matter](#front-matter),
top-level headings in the document should be H2 (`##`).
You can add sub-headings at the next lower level,
just be sure not to skip any levels.

Headings should be in sentence case (only the first word capitalized).

## Line wrapping

For the reasons outlined at the [Semantic Line Breaks website](https://sembr.org/),
you're encouraged to break Markdown lines at semantic breaks in paragraphs.
This means adding a line break at the ends of sentences and at other semantic boundaries.

So instead of writing this:

```markdown
Long paragraphs without breaks are hard to read. Breaking in semantic ways helps increase comprehension and also makes it easier to track changes in version control systems.
```

You can write this:

```markdown
Long paragraphs without breaks are hard to read.
Breaking in semantic ways helps increase comprehension
and also makes it easier to track changes in version control systems.
```

## Links

Always use inline links (in the format: `[link text](link-location)`).
Remember to [use meaningful link text](./content-style.md#use-meaningful-link-text).

Internal links (links to other docs pages) should be relative to the `src` directory and start with `/`.
Link to the specific `.md` file, for example: `[available services](/configuration/services/_index.md#type`).

This helps prevent broken links in the docs by putting them through a check to see if the page exists.
If the page doesn't exist, the build fails.

The check is done in a [template with a render hook](../docs/themes/avocadocs/layouts/_default/_markup/render-link.html).
See the [Hugo docs on render hooks](https://gohugo.io/getting-started/configuration-markup#markdown-render-hooks)
and the [`relref`](https://gohugo.io/functions/relref/) function that does the check.

## Notes

To add extra information or a warning that stands outside the normal text flow, add a note.
By default, a title of `Note:` is added.

```markdown
{{< note >}}

A short note.

{{< /note }}
```

This shortcode accepts two optional parameters:

- `theme`: Determines the color and the default title.
  The default `theme` is `primary` and may be set to `info`, or `warning`.
- `title`: Sets the title of the note.
  The default is the `theme` with the first letter capitalized and a colon (`Note:`).
  To have no title, set this to `none`.

```markdown
{{< note theme="warning" title="Danger, Will Robinson" >}}

Be careful!

{{< /note >}}
```

See the [content guidelines for notes](./content-style.md#use-notes-appropriately).

## Images

You can add images using the standard Markdown syntax,
except it is not possible to add titles.

Instead of titles, you can pass scaling values on a scale of 0 to 1 to set a maximum width on the image (every 0.1 = 10rem)
and make it displayed inline.

```markdown
<!-- Normal image syntax -->
![Description of image](/images/current_image.png)

<!-- Scaled image -->
![Description of image](/images/current_image.png "0.5")

<!-- Scaled image displayed inline, such as an icon in a sentence -->
![Description of image](/images/current_image.png "0.1-inline")
```

Remember to [use alternative text](./content-style.md#use-alt-text) when appropriate.

## Videos & asciinema

You can add videos and asciinema recordings with shortcodes:

```markdown
<!-- Video -->
{{< video src="videos/management-console/new-project-creation.mp4" >}}

<!-- Asciinema -->
{{< asciinema src="videos/asciinema/verify-cli-extended.cast" >}}
```

## Code

Inline code statements, file names, and YAML keys should use backticks ``like this``.

Longer code samples should be denoted with triple backticks before and after,
with no extra whitespace between the backticks and the code block.
Always specify the language of the code block.
See the [highlight.js docs](https://highlightjs.org/static/demo/) for available language options.

### Indentation

In YAML files, use 4 spaces to indent lines:

```yaml
web:
    locations:
        '/': !include
            type: yaml
            path: 'main.yaml'
```

Keep the top-level key visible so readers can understand the code in context.
(For example, don't leave out `web:` in the example above.)

### Code block location

If it's helpful to note where the code should be placed (such as in a `.platform.app.yaml` file),
note that as an attribute of that block and it will appear in a tab:

```markdown
```yaml {location=".platform.app.yaml"}
relationships:
    database: 'mysqldb:db
```

## Code tabs

Display code examples in multiple languages with code tabs.
Tabs are divided by `<--->` and can each have different properties.

```markdown
{{< codetabs >}}

---
title=Elasticsearch
file=static/files/fetch/examples/php/elasticsearch
highlight=php
---

<--->

---
title=Memcached
file=none
highlight=python
---

from jwcrypto import jws, jwk

{{< /codetabs >}}
```

Property    | Description
------------|-----------
`title`     | The title that appears on the tab.
`highlight` | The language to use for highlighting, as in [code blocks](#code). If set to `false`, content renders as Markdown.
`file`      | If not set to `none`, the displayed code comes from the specified local file.

## Reusing content

To reuse Markdown content in multiple places,
use [transclusion](https://en.wikipedia.org/wiki/Transclusion) to include it.

1. Create a new `.md` file in the `docs/layouts/shortcodes` directory.
   Make sure the context is clear from the name, for example `reuse_markdown.md`.
1. Fill it with the content you want to repeat.
1. Include the file in the other locations like so:

   ```markdown
   {{% reuse_markdown %}}
   ```

### Variables in the file

You can pass variables to the file:

```markdown
{{% reuse_markdown FileName="1" %}}
```

Use the variable in the file:

```markdown
The file's name is: {{ .Get "FileName" }}
```

### Inner content

For longer content specific to each file, you can put content inside the shortcode:

```markdown
{{% reuse_markdown %}}

This is longer content that only appears for the file it's in
and not all files that use the shortcode.

{{% /reuse_markdown %}}
```

Use the inner content in the file:

```markdown
Here is some content before the inner content.

{{ .Inner | .Page.RenderString }}

Here is some content after the inner content.
```

### Static files

For static files that have already been created, use the `readFile` shortcode:

```markdown
{{< readFile file="src/registry/images/tables/runtimes_supported.md" markdownify="true">}}
{{< readFile file="src/registry/images/examples/full/php.app.yaml" highlight="yaml" >}}
```

Property      | Description
--------------|-----------
`file`        | The location of the file to include relative to the `docs` root.
`markdownify` | Optional. For when you are using a `.md` file and want to include markdown.
`highlight`   | Optional. For when you're including code examples. The language to use for highlighting, as in [code blocks](#code).
