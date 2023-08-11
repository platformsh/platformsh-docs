# Platform.sh User Documentation

This repository holds the public user documentation for Platform.sh.

The documentation site ([docs.platform.sh](https://docs.platform.sh/)) is itself hosted on Platform.sh
and built using the powerful Platform.sh build-and-deploy system.

Every pull request (PR) is automatically built on Platform.sh
and provided with a link to a fully built environment just for that request.
Each PR against the default branch of this repository has a Platform.sh check.
Click **Details** on an open PR to see a fully functional site based on the changes in the PR.
(You can have the same functionality for your repository.)

## Tools

The documentation site is build using [Hugo](https://gohugo.io), a Go static site generator.
The build script is rerun on every deploy to produce a fresh static site instance.

The cross-site search in the documentation is built as a separate Platform.sh app
from the files in the `search` directory using [Meilisearch](https://www.meilisearch.com/).

## Contributing

Our documentation is public because we want your help in improving and maintaining it.
See our [contribution guidelines](CONTRIBUTING.md) for how to make changes.
All documentation is released under a [Creative Commons Attribution](LICENSE.md) license.

If you spot a problem, open a pull request to fix it!
If you're not sure how, you can also open an issue and we can look into it.

## Running locally

Requires:

* Hugo >= 0.116.0
* Node.js >= 16
* Poetry

### Steps

### Running locally without search

The documentation and the Meilisearch search service are separate applications.
It isn't necessary to run the Meilisearch app to build the docs locally,
but if you don't, the search field doesn't appear in the sidebar.

1. To run the docs alone, clone this repository and install dependencies:

    ```bash
    cd docs
    npm install
    ```

2. (Optional) The documentation website dynamically fetches example files from various locations.

You can run the site locally without retrieving those example files, keeping in mind that affected sections will display a `**Heads up!** The file was not found` message. To do so, jump to step 3.

To run the site with all example files retrieved, set a [GitHub token](https://github.com/settings/tokens) as `GITHUB_API_TOKEN` in your shell.
If you’re using the GitHub CLI tool, to avoid including your token’s value in your shell’s history, run the following command:

    ```bash
    export GITHUB_API_TOKEN=$(gh auth token)
    ```
3. To have Node update the registry and retrieve all the necessary example files (if applicable), run the following command:

    ```bash
    npm run dev
    ```

4. Then build the site:

    ```bash
    hugo serve
    ```

### Running locally with search

In addition to the above requirements, search also requires:

* [Poetry](https://python-poetry.org/docs/)
* [`jq`](https://stedolan.github.io/jq/)
* [Meilisearch](https://www.meilisearch.com/) (see below for installation)

A development script using `npm-run-all` has been defined to run both applications simultaneously.

After cloning the repository, run the following command in your terminal:

```bash
npm run develop
```

## Cache of static assets

Given that the website itself isn't updated so often,
static assets on the site such as CSS and JavaScript files have a long cache period set.
If you are making a change to such files, bust the cache so users aren't served out-of-date files.

To clear the cache, update the `version` in [`docs/config/_default/params.yaml`](./docs/config/_default/params.yaml).
