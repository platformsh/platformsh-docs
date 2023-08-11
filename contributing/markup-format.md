# Markup reference for Platform.sh docs

## Table of contents

- [Markup reference for Platform.sh docs](#markup-reference-for-platformsh-docs)
  - [Table of contents](#table-of-contents)
  - [Markdown](#markdown)
  - [Front matter](#front-matter)
  - [Headings](#headings)
  - [Line wrapping](#line-wrapping)
  - [Links](#links)
    - [Links to headers](#links-to-headers)
  - [Notes](#notes)
    - [Notes inside shortcodes](#notes-inside-shortcodes)
    - [Footnotes](#footnotes)
  - [Images](#images)
  - [Videos \& asciinema](#videos--asciinema)
  - [Code](#code)
    - [Indentation](#indentation)
    - [Multiline strings](#multiline-strings)
    - [Note when low-level items are missing](#note-when-low-level-items-are-missing)
    - [Code block location](#code-block-location)
    - [Variables in code](#variables-in-code)
  - [Refer to the UI and keys](#refer-to-the-ui-and-keys)
  - [Code tabs](#code-tabs)
  - [Reuse content](#reuse-content)
    - [Variables in the file](#variables-in-the-file)
    - [Inner content](#inner-content)
    - [Static files](#static-files)
  - [Guidance enforcement](#guidance-enforcement)

## Markdown

These docs are written in Markdown with [GitHub Flavored Markdown](https://github.github.com/gfm/) syntax supported.
It also supports [definition lists](https://michelf.ca/projects/php-markdown/extra/#def-list),
[footnotes](#footnotes),
and [smart typography](https://daringfireball.net/projects/smartypants/).
Plus the modifications noted below.

It's rendered by the [Goldmark parser](https://github.com/yuin/goldmark/).

## Front matter

All pages should start with [*front matter*](https://gohugo.io/content-management/front-matter/).
The following table presents the available options:

| Item                 | Type               | Description |
| -------------------- |--------------------|-------------|
| `title`              | string             | The title that appears as an `<h1>` element at the top of the page. |
| `sidebarTitle`       | string             | An optional short version of the title to appear in the navigation sidebar. |
| `weight`             | integer            | Defines the order in which the page should appear in the sidebar. Higher numbers are lower. |
| `toc`                | Boolean            | Optionally allows you to hide the table of contents on a page (by setting to `false`). |
| `layout`             | `single` or `list` | Set to `single` on `_index.md` files to give them the same layout as other pages. |
| `description`        | string             | Appears on `list` pages as a description of the page's content. Also overrides generic content for the `<meta name="description">` tag for SEO. Can be used in the page with the `description` shortcode. |
| `multipleTabs`       | Boolean            | If set to true, code tabs are changed across the page. So changing the tabs in one place changes them for the entire page. Useful when code tabs are repeated often with the same title (such as comparing actions in the CLI and Console). |
| `banner`             | list of strings    | Include to put a banner at the top. Under `banner`, add `type: tiered-feature` to indicate that the feature is only available to Enterprise and Elite customers. Add `type: observability-suite` to indicate that the feature is only available as part of the Observability Suite. Add your own `title` and `body` to generate a custom banner. |
| `sectionBefore`      | string             | Title of a header to add before the given page in the main navigation. |
| `keywords`           | `single` or `list` | Improve search by providing additional, related terms. |

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

Internal links (links to other docs pages) should be relative to the file they're in.
That way, they work in the docs and on GitHub and locally in a cloned repository.
Link to the specific `.md` file, for example: `[available services](../docs/src/add-services/_index.md`).

If you are linking from a [file for reuse](#reuse-content), link relative to the `src` directory and start with `/`.
For example: `[available services](/add-services/_index.md`).

Both of these ways help prevent broken links in the docs by putting them through a check to see if the page exists.
If the page doesn't exist, the build fails.

The check is done in a [template with a render hook](../docs/themes/avocadocs/layouts/_default/_markup/render-link.html).
See the [Hugo docs on render hooks](https://gohugo.io/getting-started/configuration-markup#markdown-render-hooks)
and the [`relref`](https://gohugo.io/functions/relref/) function that does the check.

### Links to headers

To link to a header, use `#` plus the lowercase heading name.
Special characters are removed and spaces replaced by hyphens.
So to link to a heading with the text `Code & Style` on the same page, use `[link-text](#code--style)`.

## Notes

To add extra information or a warning that stands outside the normal text flow, add a note.
By default, a title of `Note:` is added.

```markdown
{{< note >}}

A short note.

{{< /note >}}
```

This shortcode accepts two optional parameters:

- `theme`: Determines the color and the default title.
  The default `theme` is `primary` and may be set to `info` or `warning`.
- `title`: Sets the title of the note.
  The default is the `theme` with the first letter capitalized and a colon (`Note:`).
  To have no title, set this to `none`.

```markdown
{{< note theme="warning" title="Danger, Will Robinson" >}}

Be careful!

{{< /note >}}
```

See the [content guidelines for notes](./content-style.md#use-notes-appropriately).

### Notes inside shortcodes

It's possible to use notes inside other shortcodes.
To do so, use the following syntax:

```markdown
{{ $inner := `
<MARKDOWN_TEXT>
` }}
{{ partial "note" (dict "Inner" $inner "context" .) }}
```

You can also add a title and theme.

```markdown
{{ $inner := `
<MARKDOWN_TEXT>
` }}
{{ partial "note" (dict "Inner" $inner "context" . "title" "<TTILE>" "theme" "<THEME>") }}
```

Note that backticks to denote code aren't possible.
You can use HTML tags instead.

```markdown
{{ $inner := `
This is text with inline <code>code</code>.

<div class="highlight"><pre class="chroma"><code class="language-bash" data-lang="bash">This is a code block</code></pre></div>
` }}
{{ partial "note" (dict "Inner" $inner "context" .) }}
```

To include variables from a shortcode, use `print` as in the following example:

```markdown
{{ $inner := print `This is text in the ` ( .Get "name" ) ` shortcode.`}}
{{ partial "note" (dict "Inner" $inner "context" .) }}
```

### Footnotes

To add a footnote, add two parts:

1. Mark the spot in the text where you want to add a note:

   ```markdown
   This text will have a note.[^<FOOTNOTE_NAME>]
   ```

   The name can be anything as long as it's unique within the document.
   Don't use numbers as the notes are numbered automatically.
1. Add the note at the end of the document:

   ```markdown
   [^<FOOTNOTE_NAME>]: Here is the note about the text above.
   ```

   To have multiple paragraphs in the note, align them with four spaces at the start:

   ```markdown
   [^<FOOTNOTE_NAME>]:
       This is the first paragraph.

       This is the second paragraph.
   ```

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

### Multiline strings

When writing multiline strings in YAML, known as scalar content,
examples often use a literal style as shown with a `|`.
In such cases, the string that comes needs to span multiple lines.
Otherwise, the parser doesn't accept it as a scalar and the spacing and highlighting is wrong.

To resolve this, either put the comment on a single line without the `|`
or add an ellipsis to indicate content is missing, as in the following example:

```yaml
hooks:
    build: |
        ...
        git pull
```

The highlighter also adds extra whitespace at the end of multiline strings.
These are [known issues](https://github.com/alecthomas/chroma/issues/475).

### Note when low-level items are missing

If there's a complicated block (such as `web.locations`) with many settings not relevant to the current idea,
show that they're missing with ellipses.

For example, to focus only on caching and not the rules for the location:

```yaml
web:
    locations:
        '/':
            ...
            expires: -1
```

This is only necessary for items that aren't top-level.
In longer files (such as `.platform.app.yaml`), it's fine to leave out other top-level items.
For example, only a `web` block is shown above, even though it's not valid on its own.
It should still be enough to copy and paste into a larger file.

### Code block location

If it's helpful to note where the code should be placed (such as in a `.platform.app.yaml` file),
note that as an attribute of that block and it appears in a tab:

```markdown
```yaml {location=".platform.app.yaml"}
relationships:
    database: 'mysqldb:db
```

### Variables in code

To mark where users should replace text with their own data, use the `variable` shortcode.
Add the variable name in all capital letters and underscores in quotes:

````markdown
Run the following command:

```bash
platform project:set-remote --project {{< variable "PROJECT_ID" >}}
```
````

If this block is inside a shortcode, render the variable as in the following example:

````markdown
Run the following command:

```bash
platform project:set-remote --project {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}
```
````

## Refer to the UI and keys

When referring to text in the UI, use bold:

```markdown
Click **Redeploy**.
```

To refer to buttons in the UI that use icons, use the `icon` shortcode with the alternative text for the button:

```markdown
To share a log, open the log and click {{< icon share >}} **Copy URL**.
```

To refer to keys users should use on their keyboards, use `<kbd>` tags:

```markdown
To select multiple lines, hold <kbd>Shift</kbd>.
```

## Code tabs

Display code examples in multiple languages with code tabs.
Tabs are divided by `<--->` and can each have different properties.

````markdown
{{< codetabs >}}

+++
title=Elasticsearch
file=static/files/fetch/examples/php/elasticsearch
highlight=php
+++

<--->

+++
title=Memcached
highlight=python
+++

from jwcrypto import jws, jwk

+++
title=MySQL
+++

First, do this:

```bash
awesome_command
```

{{< /codetabs >}}
````

Property      | Description
------------- | ----------
`title`       | The title that appears on the tab.
`highlight`   | The language to use for highlighting, as in [code blocks](#code). If not set, content renders as Markdown.
`file`        | If set, the displayed code comes from the specified local file.
`markdownify` | Whether to transform the block to Markdown. Defaults to `true`. Set to `false` when the file/block is code.

Note that if you're using code inside the given tab,
leave two empty lines after `{{ /codetabs }}` to turn off spell checking inside the block.

## Reuse content

To reuse Markdown content in multiple places,
use [transclusion](https://en.wikipedia.org/wiki/Transclusion) to include it.

1. Create a new `.md` file in the `docs/layouts/shortcodes` directory.
   Make sure the context is clear from the name, for example `reuse_markdown.md`.
1. Fill it with the content you want to repeat.
1. Include the file in the other locations like so:

   ```markdown
   {{% reuse_markdown %}}
   ```

Note that if your files have HTML characters (`<`, `>`, `&`, `'`, and `"`) inside a code block,
the characters are escaped (appear as `&lt;` and so on).

To avoid this problem, add the code block as a file to the `snippets` directory.
Then include the block with the `readFile` function as in the following example:

````markdown
```<LANGUAGE> {location="><LOCATION_TO_DISPLAY>"}
{{ readFile "<FILE_LOCATION>" | safeHTML }}
```
````

- `<LANGUAGE>` is the language for syntax highlighting
- `<LOCATION_TO_DISPLAY>` is the location to show above the code block in the docs
- `<FILE_LOCATION>` is where the snippet is

A complete example:

````markdown
```yaml {location=".platform.app.yaml"}
{{ readFile "snippets/example.yaml" | safeHTML }}
```
````

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
{{< readFile file="registry/images/tables/runtimes_supported.md" markdownify="true" >}}
{{< readFile file="registry/images/examples/full/php.app.yaml" highlight="yaml" >}}
{{< readFile file="registry/images/examples/full/elasticsearch.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}
```

Property      | Description
--------------|-----------
`file`        | The location of the file to include relative to the `docs` root.
`markdownify` | Optional. For when you are using a `.md` file and want to include markdown.
`highlight`   | Optional. For when you're including code examples. The language to use for highlighting, as in [code blocks](#code).
`location`    | Optional. To mark where the included code should be placed, for example `.platform.app.yaml`.


## Guidance enforcement

We check for consistency in Markdown using [remark-lint](https://github.com/remarkjs/remark-lint)
via ESLint, specifically the [ESLint MDX plugin](https://github.com/mdx-js/eslint-mdx).

Because no checking tool is perfect,
the rules are set to warnings rather than errors.
So automated checks show when something might be wrong,
but use your common sense and ignore them when appropriate.

To see all feedback, [install all dependencies](../README.md#running-locally)
and run `lint:markdown` from the `docs` directory.
Or use it in your IDE, such as with the [VS Code ESLint extension](https://open-vsx.org/extension/dbaeumer/vscode-eslint).
If the extension in VS Code doesn't immediately start working,
you may need to add the following to your settings:

```json
"settings": {
		"eslint.validate": [
			{  
        "language":"markdown",
        "autoFix":false
    	},
		]
	}
```

The feedback for ordered lists may be a little confusion at first.
If you have a loose list (a list with paragraphs or code blocks in it),
the start of list item should be at 4 spaces.

If you have all list items aligned at 3 spaces, the first warning is to `add 1 space`.
Then if you add 1 space, the second warning is to `remove 1 space`.
Fix this by adding 1 space to the paragraphs or code blocks so they all align at 4 spaces.

All pull requests against the default branch are linted automatically.
