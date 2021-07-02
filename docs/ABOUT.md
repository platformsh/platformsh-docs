# Self-indexing `docs` for `search`

Hugo allows you to define custom output formats besides HTML. We've defined a `json` output format as well for the root `_index.md` location, which uses the files below to index the documentation itself and serve that index at `docs.platform.sh/index.json` (`public/index.json` when built). Comments are placed here rather than inline so they do not affect the template formatting in these individual partials during builds.

- `config/_default/config.yaml`: The `json` output format is defined, but only for `home` (`_index.md`).
- `layouts/partials/meilindex/fields/section.html`: Subsections need special handling to show their subsection header in search results rather than the top-level section. 
- `layouts/partials/meilindex/fields/text.html`: Escape characters when handling body text.
- `layouts/partials/meilindex/fields/url.html`: Defines links for all results, where the homepage is a special exception based on the content directory's structure. 
- `layouts/partials/meilindex/page.html`: Combines the partials above to build an index for a single page in the documentation, splitting into multiple documents when necessary so that Meilisearch's 1,000 word/document limit is not exceeded (which would result in un-indexed/un-searchable body text and sections).
- `layouts/_default/index.json.json`: The main `json` output format template, which uses all of the above to construct the final index for docs.