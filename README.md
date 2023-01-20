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

* Hugo >= 0.100.2
* Node.js >= 16

### Running locally without search

The documentation and the Meilisearch search service are separate applications.
It isn't necessary to run the Meilisearch app to build the docs locally,
but if you don't, the search field doesn't appear in the sidebar.

To run the docs alone, clone this repository and install dependencies:

```bash
cd docs
npm install
```

Then download the necessary example files:

```bash
npm run dev
```

Then build the site:

```bash
hugo serve
```

### Running locally with search

In addition to the above requirements, search also requires:

* [Poetry](https://python-poetry.org/docs/)
* [`jq`](https://stedolan.github.io/jq/)
* [Meilisearch](https://www.meilisearch.com/) (see below for installation)

If you would like to test the search server, follow these steps:

1. Install dependencies and Meilisearch:

   ```bash
   cd search
   # Install dependencies for communicating with Meilisearch.
   poetry install
   # Set the same version as used for the docs
   export MEILISEARCH_VERSION=0.27.1
   # Set the right version for your operating system
   # Replace the part after `meilisearch-`
   # For macOS, use `macos-amd64`
   # For Windows, use `windows-amd64.exe`
   # For Linux, `linux-aarch64` is also available
   export RELEASE_FILE=meilisearch-linux-amd64
   # Download Meilisearch.
   curl -OL "https://github.com/meilisearch/MeiliSearch/releases/download/v$MEILISEARCH_VERSION/$RELEASE_FILE"
   # Make Meilisearch executable – skip for Windows, probably
   mv "$RELEASE_FILE" "meilisearch"
   chmod 744 "meilisearch"
   ```

2. Run Meilisearch with a master key:

   ```bash
   # Set a master key.
   export MEILI_MASTER_KEY=test
   # Run it.
   ./meilisearch
   ```

3. In another terminal window, build the search interface:

   ```bash
   cd ../docs
   npm install
   npm run dev
   npm run build:search
   hugo
   # Export master key again in this terminal.
   export MEILI_MASTER_KEY=test
   ./deploy.sh
   ```

4. Update the Meilisearch server:

   ```bash
   cd ../search
   # Update the index
   ./post_deploy.sh
   ```

5. Run the site:

   ```bash
   cd ../docs
   hugo serve
   ```

## Cache of static assets

Given that the website itself isn't updated so often,
static assets on the site such as CSS and JavaScript files have a long cache period set.
If you are making a change to such files, bust the cache so users aren't served out-of-date files.

To clear the cache, update the `version` in [`docs/config/_default/params.yaml`](./docs/config/_default/params.yaml).
