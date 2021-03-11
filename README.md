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
* [Poetry](https://python-poetry.org/docs/)

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

If you would like to test the search server, you can run it by exporting the `MEILI_MASTER_KEY` environment variable and installing Meilisearch locally:

```bash
cd search
# Install dependencies for communicating with Meilisearch.
poetry install
# Download Meilisearch.
curl -L https://install.meilisearch.com | sh
# Set a master key.
export MEILI_MASTER_KEY=test
# Run it.
./meilisearch
```

In another terminal window, build the React app interface so that search can be pulled into the Hugo site:

```bash
cd ../docs
npm install
npm run dev
npm run build-searchapp
hugo
```

> **Note:**
>
> If you receive an error about the Webpack CLI missing, you will need to install it on your local machine:
>
> ```bash
> npm install webpack-cli -g
> ```

Then update the Meilisearch server:

```bash
cd ../search
# Export again in this terminal window.
export MEILI_MASTER_KEY=test
# Update the index
./post_deploy.sh
```

Then finally, build the site:

```bash
cd ../docs
hugo serve
```

### GTAM

By default, Google Tag Manager has been disabled. If you would like to edit or test the "Accept cookies" dialog that appears on the deployed site, you will need to mock the `PLATFORM_PROJECT` environment variable present on Platform.sh environments. It doesn't matter what you set it to, so long as it is some string with a length greater than 0.

```bash
$ export PLATFORM_PROJECT=anything
```
