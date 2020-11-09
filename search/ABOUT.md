# About the `search` application

The public docs project contains two applications: one for the Hugo documentation itself (`docs`), and another for the Meilisearch search engine (`search`). There are a number of moving parts in play to get search working (updating its index and connecting it to Hugo) that are worth going over in an overview. This is not an overview of the full build-deploy process for each of the apps, only the steps relevant to functional search.

## Build

### `docs`

1. Building autocomplete

    Within Hugo there is a React autocomplete app at `doc/static/scripts/xss`. The relevant files here are:

    - `.../xss/src/components/[Suggestions|SuggestionsPrimary].js`: This defines the template for search results appearing in the dropdown. They differ between Primary results (results from the documentation), and other results (from the API Docs, marketing site, templates, etc.).
    - `.../xss/src/containers/Search.js`: Where most of the configuration for the search app happens. All configuration needed to query Meilisearch is done here. 
        ```js
        let config = {}
        const request = async () => {
            const response = await fetch("/scripts/xss/dist/config/config.json");
            config = await response.json();
        }
        request();
        ```
        The `config.json` file does not yet exist and is only later built during the deploy hook when the `search` container becomes available. Webpack isn't a fan of reading from `config-reader-nodejs` or environment variables here if they are not yet set, but a file works just fine. We also have defined a mount in the *built* Hugo site at `public/scripts/xss/dist/config/` to allow writing this file in the deploy hook. 

2. Copy the templates index

    We want to include the templates index (`docs/data/templates.yaml`) in the search results, but Hugo doesn't include `data` in its final build. This moves a copy of the template index file into `static` so that it can be requested post-build. 

3. Build the Hugo site

    Hugo allows you to define custom output formats besides HTML. We've defined a `json` output format as well for the root `_index.md` location, which uses the files below to index the documentation itself and serve that index at `docs.platform.sh/index.json` (`public/index.json` when built).

    - `config/_default/config.yaml`: The `json` output format is defined, but only for `home` (`_index.md`).
    - `layouts/partials/meilindex/fields/section.html`: Subsections need special handling to show their subsection header in search results rather than the top-level section. 
    - `layouts/partials/meilindex/fields/text.html`: Escape characters when handling body text.
    - `layouts/partials/meilindex/fields/url.html`: Defines links for all results, where the homepage is a special exception based on the content directory's structure. 
    - `layouts/partials/meilindex/page.html`: Combines the partials above to build an index for a single page in the documentation, splitting into multiple documents when necessary so that Meilisearch's 1,000 word/document limit is not exceeded (which would result in un-indexed/un-searchable body text and sections).
    - `layouts/_default/index.json.json`: The main `json` output format template, which uses all of the above to construct the final index for docs.


In Hugo's build hook the autocomplete Search app has been built and included in Hugo's final build. Indexes for the documentation and our templates are accessible to our `search` app post-build.

### `search`

1. Install Meilisearch

    The version downloaded is locked by the `MEILISEARCH_VERSION` environment variable in `.platform.app.yaml`.

2. Setup the Poetry virtual environment

    We're using Poetry for package management for our Python app. It too needs the environment variables `POETRY_VIRTUALENVS_IN_PROJECT` and `POETRY_VIRTUALENVS_CREATE` along with `POETRY_VERSION` to get a working version of Poetry in the container. In Poetry we'll use the `meilisearch-python` package to reset and post the final index to Meilisearch. 

## Deploy (`docs`)

We create the Meilisearch configuration file `public/scripts/xss/dist/config/config.json` for the autocomplete app now that Meilisearch has been started. 

```sh
createSearchConfig() {
    # Get the data
    MEILI_CONFIG_DEST=public/scripts/xss/dist/config/config.json
    MEILI_INDEX="docs"
    MEILI_TOKEN=$(curl -s -H "X-Meili-API-Key: $PLATFORM_PROJECT_ENTROPY" -X GET "search.internal/keys" | jq -r ".public")
    MEILI_URL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.id == "search") | .key')
    # Delete config file in the mount if it exists
    rm -f $MEILI_CONFIG_DEST
    # Make the config file
    echo $( jq -n --arg ix $MEILI_INDEX --arg key $MEILI_TOKEN --arg url $MEILI_URL '{index: $ix, public_api_key: $key, url: $url}' ) >> $MEILI_CONFIG_DEST
}
```

Both here and in the `search` app's start command, `PLATFORM_PROJECT_ENTROPY` is assumed to be the master key. Using that key, we can retrieve the Public API Key the autocomplete app needs to complete queries. We also grab the backend url for Meilisearch, and together with the name of the index (which, due to this order events, has to be hardcoded as far as I can see) we can complete search through the autocomplete app (see `docs/static/scripts/xss/src/containers/Search.js` at the `getInfo` function).

## Post-Deploy (`search`)

The last steps get all of our data sources together, and then reset and post the final index to the Meilisearch server. 

1. Clear the mounts: The previous deploy's data and individual index sources are in mounts, so we clear them out so we start with fresh data on each deploy.
2. Get index data from `docs`: In the build hook for `docs` we made the main docs index (`index.json`) and the templates index (`templates.yaml`) available. Here we grab them.
3. Scrape: For the other sites we want to include in the final index we are scraping their content using the Python library `scrapy`. Definitions for each of those sources is found in `scrape.json`. Resulting indexes are placed in the mount `output` (i.e. `output/apidocs.json`) for each source.
4. `createPrimaryIndex.py`: Makes `index.json` available in the `output` directory for the final steps. The templates index is at this point incomplete (it was generated originally only for our template showcase accordians in the docs), and here we add information Meilisearch needs for each template (for example, each entry needs a unique `documentId`).
5. `main.py`: Last steps. Here our index is defined and updated. There is some initial logic setting up the host so that everything runs locally and on Platform.sh. We override Meilisearch's default attributes: we included some synonyms and updated ranking rules that include `asc(rank)` as our highest level ranking rule. `rank` is a key on every document from every content source included in the index. Since this search is embedded in the public docs site, documents from the documentation have a `rank` of 1, and all other sources some number greater than that. This assures that results from the documentation have a higher rank and therefore preferred to appear first over other results. 

    This file likewise assumes that `PLATFORM_PROJECT_ENTROPY` is the master key for the Meilisearch server. 
    We finally connect to the Meilisearch server, delete existing indices should they exist, update our custom ranking rules and attributes, and then finally add each of the content sources' indices to the search server. 