---
title: "Reading local files"
weight: 9
description: If you have some text repeated across your documentation, you can save it to a separate file and pull it into multiple locations using the <code>readFile</code> shortcode.
 
---

## Basics

Use the `readfile` shortcode to pull in the contents of a local file, along with the name of the file passed in quotes to the named `file` parameter. Files should be relative to the project root. For example, the text file `basic.txt` that reads `Hello avocadocs!` can be called by placing

```html
readFile file="static/files/misc/basic.txt"
```

within shortcode brackets, which generates the below text:

{{< readFile file="static/files/misc/basic.txt" >}}


## Reading local files that need formatting once rendered

### Markdown

You can pass an additional `markdownify="true"` parameter to the shortcode to render Markdown in the file you're using.

#### Source

```html
readFile file="static/files/misc/lorem.md" markdownify="true"
```

#### Result

{{< readFile file="static/files/misc/lorem.md" markdownify="true">}}

### Syntax highlighting

You can also pass a `highlight` parameter set to Hugo's supported languages for syntax highighting.

#### Example: YAML

##### Source

```html
readFile file="static/files/misc/mysql.yaml" highlight="yaml"
```

##### Result

{{< readFile file="static/files/misc/mysql.yaml" highlight="yaml" >}}

#### Example: HTML

##### Source

```html
readFile file="static/files/misc/basic.html" highlight="html"
```

##### Result

{{< readFile file="static/files/misc/basic.html" highlight="html" >}}

#### Example: JSON

##### Source

```bash
readFile file="static/files/misc/basic.json" highlight="json"
```

##### Result

{{< readFile file="static/files/misc/basic.json" highlight="json" >}}
