GitBook Lexicon Plugin
======================

This plugin add tooltips to lexicon definitions for GitBook.

Usage
-----

Add the following entry in `book.json`:

```
{
  "plugins":[
    "lexicon"
  ]
}
```

Then install it with: ```$ gitbook install .```.

Put your lexicon definitions in `lexicon.json` in the following format:

```
[
  {
    "title": "群眾募資",
    "definition": "透過網路平台向社會大眾發佈資金需求並說明資金用途，並藉此向社會大眾募集資金。",
    "url1": "",
    "url2": "",
    "url3": ""
  }
  // more terms
]
```

Work with `gitbook-plugin-json`:

```
{
  "plugins":[
    "lexicon",
    "json"
  ],
  "pluginsConfig": {
    "json": {
      "output": "_book/content.json"
    }
  }
}
```

it will generate lexicon in `_book/content.json`.  Note that in the `plugins` array, `json` plugin must come *after* `lexicon` plugin.

Then build gitbook with ```$ gitbook build```.
