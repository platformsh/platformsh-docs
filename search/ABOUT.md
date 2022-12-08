# Search and docs.platform.sh

The public docs have two apps:

- `docs`: the Hugo site and what you see at docs.platform.sh
- `search`: a Meilisearch app to run the search engine for docs.platform.sh

## High level goals

The hooks in each app have two collective goals:

1. The `search` app should be *protected* from users modifying the index, but `docs` should be *authorized* to communicate with the backend `search` app.
    - *Protect Meilisearch & creating a public key:* Meilisearch is protected with a *master key*, which is required to modify the documents that can be searched and configure how results are sorted. In this project, the `PLATFORM_PROJECT_ENTROPY` environment variable is used for this purpose. It saves us having to define one from scratch, and it's a value that both `docs` and `search` already know about.
    - *Getting the public key to the `docs` app:* Using this environment variable, `search` can update its index and generate a public key. This key allows users to perform search without modifying the search engine's settings. Since `docs` also can see this environment variable, it can retrieve the public key and use it in our search bar. Users using search on the site 1) are authorized to search the index, 2) are not authorized to update that index. Docs receives the public key from [`search.internal/keys`](https://docs.meilisearch.com/references/keys.html#keys) - an internal request made possible via a `search` relationship. 
2. Users should be able to search not just the content committed to the `docs` app, but we'd like our *other resources* to be included in those results (from community.platform.sh, api.platform.sh/docs, from the main marketing website, and from our templates organization on GitHub). If there are results from each of these sites for a given query, results from the public documentation (actually committed to `docs`) should have the *highest priority*. 
    - *Create compatible indexes for all 5 sites:* We want Meilisearch to serve an *index of documents* that include all content from our five main sites.
        1. *docs.platform.sh*: Hugo builds markdown files and provided templates and themes to generate static HTML output. It is also possible to define [custom output formats](https://gohugo.io/templates/output-formats/), which we use to create an index for the documentation during builds.
        2. *github.com/platformsh-templates*: We also include an index of templates within the docs, which was originally created to support the accordions on language pages. We can take that data and modify it slightly to be included in the final search index. 
        3. *api.platform.sh, community.platform.sh, platform.sh:* To collect documents from each of these sites, we can use the python web scraping tool [scrapy](https://scrapy.org/) to create them. 
    - *Getting docs & templates index to `search`:* docs & GitHub indexes are made within the `docs` container, and are accessible by the `search` app via an external request. All other sites are scraped during the post_deploy hook. 
    - *Prioritizing results:* Each site is given a `rank`. Pages from the public documentation are given a rank of `1`, and all other sites a greater number. We then modify Meilisearch's setting to list results according to `rank` first, so that docs results are prioritized during queries. 

## Data transfer

- `search` --> `docs`:
    - When: `deploy` hook for `docs`; internal request to `search.internal/keys`.
    - Where: `deploy.sh` in `createSearchConfig`
    - Why: Retrieve Meilisearch public API key to be used by search bar at runtime. 
- `docs` --> `search`:
    - When: `post_deploy` hook for `search`; external request to `https://{default}` (internal would cause circular relationships).
    - Where: `post_deploy.sh` in `getDocsData()`
    - Why: Retrieve indexes for public documentation and templates to be included in final search index. 

## Adding a new site to the final index

1. If you replicate some kind of self-indexing (as for the Hugo site), you only need to place that index into the `search` container's `/output` subdirectory before the `post_deploy` hook is run for it to be included. 
2. If you would like to have another site scraped before it is included, add the site's details to the `scrape.json` file. You will also need to write a matching `docs/spiders/<sitename>spider.py` file that configures how that site is scraped, and matches the final index made for that site to the Meilisearch index we're building. 

