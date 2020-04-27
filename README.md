# Platform.sh User Documentation

This repository holds the public user documentation for Platform.sh.

Our documentation site ([docs.platform.sh](https://docs.platform.sh/)) is itself hosted on Platform.sh, and built using our powerful build-and-deploy system.

Every pull request is automatically built on Platform.sh, and a link provided to a fully built environment just for that PR.  Have a look in any open pull request at the Checks section, on the Platform.sh row, then click on the "Details" link on the right side of the row.  That will take you to a fully functional site based on the changes in the PR.  We offer the same functionality to all of our customers!

## Tools

Our documentation site is build using [Hugo](https://gohugo.io), a Go static site generator. We rerun the build script on every deploy to produce a fresh static site instance. As we transition to Hugo from Gitbook, currently the site's layouts are built on top of [DocsUIKit](https://github.com/htmlstreamofficial/docs-ui-kit).

Our cross-site search in the documentation is built in a separate application on Platform.sh in `search` using [Meilisearch](https://www.meilisearch.com/).


## Contributing

Our documentation is public because we want your help in improving and maintaining it.  See our [Contributing guidelines](CONTRIBUTING.md) for guidelines on filing pull requests.  All documentation is released under the [Creative Commons Attribution](LICENSE.md) license.

If you spot a problem, send us a pull request to fix it!  If you're not sure how, you can also file an issue and we'll try to get to it ourselves.

## Running locally

Requires:

* Hugo >= 0.68.3
* Node.js 12

### Running locally without search

The documentation and the Meilisearch search service are separate applications. It is not necessary to run the Meilisearch app to build the docs locally, but the field will not appear in the sidebar either.

Clone this repo, then install its dependencies and download its example files:

```bash
cd docs
npm install
npm run dev
```

Then build the site,

```bash
hugo serve
```

### Running locally with search

1. Download and start the Meilisearch server:

    ```bash
    cd search
    # Install dependencies for communicating with Meilisearch.
    pipenv --three install
    # Download Meilisearch.
    curl -L https://install.meilisearch.com | sh
    # Set a master key.
    export MEILI_MASTER_KEY=test
    # Run it.
    ./meilisearch
    ```

2. **(Optional)** Generate template data for Meilisearch

  The Hugo build process places requests against `github.com/platformsh/template-builder` to retrieve all of the current templates. It uses this data to generate the template accordians in the documentation. Since this data is already available, this project uses Network Storage on Platform.sh and parse that data into an index format that can be used by the Meilisearch server, so that templates are also searchable from the search bar.

  If you would like to view this locally (which is optional), you will need to follow the steps above to download dependencies and run the development scripts to request that data before adding documents to Meilisearch.

  ```bash
  cd docs
  npm install
  npm run dev
  ```

3. Scrape site data and post to Meilisearch

  In another terminal window, scrape all sites outlined in `scrape.json`:

  ```bash
  cd search
  # Scrapes sites in `scrape.json`.
  ./scrape.sh
  # Export again in this terminal window.
  export MEILI_MASTER_KEY=test
  ```

4. **(Optional)** Create the template index

  If you followed **Step 2** to retrieve template data before setting up Meilisearch, post that data to the search server:

  ```bash
  pipenv run python createtemplateindex.py
  ```

5. Update `config/config.json` to include the search only public key and the url of the Meilisearch server:

  ```bash
  # Modifies `config/config.json` to include the public api key.
  pipenv run python update_url.py
  ```

  > **Note:**
  >
  > `update_url.py` behaves differently locally and on Platform.sh:
  >
  > * **Platform.sh:** In order to pass the public api url to the `docs` application, this project uses [Network Storage](https://docs.platform.sh/configuration/services/network-storage.html) to define a mount accessible from both the `search` and `docs` applications, defined by the `files` service in `.platform/services.yaml`. The script modifies `config/config.json` (which initially was written to include the public api key from `main.py`) to add the `search` apps upstream route during the deploy hook. Because the `files` directory is also visible in `docs`, the documentation can use those credentials.
  > * **Locally:** Obviously, this shared access needed to be replicated locally. If `update_url.py` does not detect that the project is running on Platform.sh, the `config.json` file updates are written instead to the expected location in `docs` (`docs/static/scripts/xss/dist/config/config.json`).

6. Update the Meilisearch index

  ```bash
  # Refreshes the Meilisearch index, adds scraped documents to it, and retrieves
  #   the search only public api key.
  pipenv run python main.py
  ```

7. Build the autocomplete React app that will be used by Hugo to communicate with Meilisearch

  When Scrapy has finished scraping the sites to be included in the index, and the index has been updated, build the React app interface so that search can be pulled into the Hugo site:

  ```bash
  cd ../docs/static/scripts/xss
  npm install
  npm run-script build
  ```

  > **Note:**
  >
  > If you receive an error about the Webpack CLI missing, you will need to install it on your local machine:
  >
  > ```bash
  > npm install webpack-cli -g
  > ```
  > Even this will occaisionally catch, but I find that deleting `node_modules` and trying again fixes it.

8. Build the Hugo site

  If you did not already install the sites dependencies to create template data, do so now:

  ```bash
  cd ../../.. # (docs)
  npm install
  npm run dev
  ```

  Then serve the site:

  ```bash
  hugo serve
  ```
