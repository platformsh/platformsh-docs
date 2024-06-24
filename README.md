# Platform.sh User Documentation

This repository holds the public user documentation for Platform.sh and Upsun.

The documentation sites ([docs.platform.sh](https://docs.platform.sh/) and [docs.upsun.com](https://docs.upsun.com/) are themselves hosted on Platform.sh
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
    cd sites/platform # or cd sites/upsun
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

### Running tests locally

Before pushing, please duplicate the test suite locally by running:

```bash
npm run test -- platform
# OR
npm run test -- upsun
```

depending on which set of docs you've contributed to.

### Visual regression testing

See [`vrt-docs-migration`](https://github.com/gilzow/vrt-docs-migration) for more details.

## Cache of static assets

Given that the website itself isn't updated so often,
static assets on the site such as CSS and JavaScript files have a long cache period set.
If you are making a change to such files, bust the cache so users aren't served out-of-date files.

To clear the cache, update the `version` in [`docs/config/_default/params.yaml`](./docs/config/_default/params.yaml).

## Managing white label documentation

### Adding a white label documentation

To add a white label documentation using its own logo, styles, and wording,
add a new white label folder in the `sites/` directory.

Add all the files that differ from the main documentation site (`sites/platform/src/` directory) to that white label folder.
Make sure you keep the same file structure as in the existing `sites/platform/src/` directory.

```bash
sites
├── whitelabel_name
│   ├── config
│   │   └── _defaults
│   │       ├── config.yaml <- white label configuration
│   │       └── params.yaml <- settings for vendorization and other features
│   ├── layouts     <- Layout of the white label website
│   ├── src         <- pages
│   ├── static      <- static files
│   ├── utils       <- Hugo scripts
│   └── ...         <- index.js and other Hugo files
└── platform <- main doc pages
```

`sites/platform/src/` is the main documentation site and, by default, each white label site inherits data from it.
To ensure that the changes you make to files in your white label folder are taken into account,
you need to exclude the original page(s) or section located in `sites/platform/src/` from the build.

For example, if you make changes to the `sites/whitelabeldoc/src/overview.md` file,
add the following configuration in your `sites/whitelabel_name/config/_default/config.yaml` file:

```yaml
module:
    _merge: deep
    mounts:
        - source: "../platform/src"
          target: "content"
          excludeFiles:
              - "overview.md"
```

Similarly, if you makes changes to all the pages in the `create-apps` section,
add the following configuration in your `sites/whitelabel_name/config/_default/config.yaml` file:

```yaml
module:
    _merge: deep
    mounts:
        - source: "../platform/src"
          target: "content"
          excludeFiles:
              - "create-apps/*"
```

You can exclude as many files as you want.

### Configuring settings placeholders

When you add a white label documentation, you want vendor-specific values, such as the vendor and CLI names, to be easily substituted.

For example, if you add a white label documentation for a product called MyGreatProduct,
you want every instance of `Platform.sh` and `Platform.sh CLI` to be automatically substituted by `MyGreatProduct` and `MyGreatProduct CLI` respectively.
To achieve that result, use the settings placeholders defined in the `sites/upsun/config/_default/params.yaml` file:

```yaml
# Vendorization
vendor:
    name: Upsun
    cli: upsun
    env_prefix: PLATFORM
    config_dir: .upsun
```

Each of them can be used in any templates (HTML or MarkDown) using shortcodes:

```bash
{{% vendor/name %}}
{{% vendor/cli %}}
...
```

### Using a settings placeholder in a heading

If you need to use a [settings placeholder](#settings-placeholders) in a heading, use the `{{% my.settings %}}` syntax.

If you use the `{{< my.settings >}}` syntax, the desired value isn't displayed in the on-page navigation menu.
Instead, the placeholder is replaced by an unwanted reference to the shortcode, similar to `HAHAHUGOSHORTCODEs3HBHB`.

#### Changing the structure of the navigation sidebar

You might need to change the structure of the main navigation sidebar in your white label documentation.

For example, instead of having one migration tutorial (single `migrating.md` file) under the **Tutorials** section,
you might want to create a nested migration section containing a few sub-pages,
one for each hosting source users could migrate from.

In this case, you need to follow these steps:

1. Exclude the migration tutorial (`migrating.md` file) from the content definition
   in your `sites/whitelabel_name/config/_default/config.yaml` file.
2. Create the nested section in your `sites/whitelabel/src` directory.

Note: `excludeFiles` paths are defined from the `src` white label root directory.

To do so, you could implement the following file structure:

```bash
sites
├── upsun
│   └── src
│       └── tutorials
│           └── migrating
│               ├── _index.md
│               └── from_platformsh.md
└── platform
    └── src
        └── tutorials
            └── migrating.md
```

And the corresponding settings in the `sites/whitelabel_name/config/_default/config.yaml` file:

```yaml
module:
    _merge: deep
    mounts:
        - source: "../platform/src"
          target: "content"
          excludeFiles:
              - "tutorials/migrating.md"
              - ...
```
