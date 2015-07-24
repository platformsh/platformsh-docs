
Gitbook JSON Plugin
===================

Gitbook plugin to generate ebook in JSON format.

Usage
-----

Add the following entry in `book.json`:

```
{
  "plugins": [
    "json"
  ]
}
```

Then install it with: ```$ gitbook install .```.

From now on `gitbook build` will also generate a file `output.json` in your project directory in a format similar to the following:

```
[
  {
    "title": "Introduction",
    "heading": "h1",
    "content": "\n<p>lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam</p> ...",
    "path": "README.md"
  },
  {
    "title": "Chapter 1",
    "heading": "h1",
    "content": "\n<p>lorem ipsum dolor sit amet consetetur sadipscing elitr sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam</p>\n",
    "children": [
      {
        "title": "Section 1",
        "heading": "h2",
        "content": "..."
      },
      {
        "title": "Section 2",
        "heading": "h2",
        "content": "...",
        "children": [
          /* subsections */
        ]
      }
    ],
    "path": "1.md"
  }
  // ...
]
```

Configuration
-------------

You can set JSON output filename in `book.json`:

```
{
  "plugins": [
    "json"
  ],
  "pluginsConfig": {
    "json": {
      "output": "_book/book.json"
    }
  }
}
```
