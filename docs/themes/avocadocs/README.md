<p align="center">
  <br><br>
  <a href="https://platform.sh/" rel="noopener">
 <img width=500px src="static/images/avocadocs/avocadocs-dark.svg" alt="avocadocs" /></a>
 <br><br>
</p>

<p align="center">
    a documentation theme for Hugo
</p>

---

Running locally

```
hugo serve --themesDir ../.. -s exampleSite/
```

- looks like, at least in Slack, page descriptions can be unfurled and show for markdown format, but not for html format. In that case, should markdownify everywhere page descriptions are used.

## Table of Contents
- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## About <a name = "about"></a>

Write about 1-2 paragraphs describing the purpose of your project.

- Everything that is PSH-specific should exist outside of the theme itself.
  - My plan here is to include some PSH-styling in the Personalize section, that way that can act as a testbed for our use case
- Add instructions for deploying on Platform.sh to the Hugo Docs:
  - [Contributing](https://gohugo.io/contribute/documentation/)
  - [Host on Netlify](https://gohugo.io/hosting-and-deployment/hosting-on-netlify/)
- Add this documentation theme to the showcase
  - [Add Your Hugo Theme to the Showcase](https://gohugo.io/contribute/themes/)
  - [Submission guidelines](https://github.com/gohugoio/hugoThemes/blob/master/README.md#adding-a-theme-to-the-list)
- Properly and extensively document what sources are used for what in the README
- The theme acts as the primary documentation for using the theme, so spend time taking notes on it all.
- Documentation should be clean, and a direct resource with as little frills as possible
  - The front page is your `content/` root `_index.md` file. There is no `index.html` template for a front page.
  - The sidebar is limited to three levels of content, and by default only the first level of content is shown. Opening a second or third level section exposes its pages, but otherwise they are collapsed. If your needs require more than three levels of content within the sidebar, either create a new "book" for that section (recommended, since that section will then receive its own three level depth), or override the template files to fit that need.
- Anywhere that a parameter is referenced, it must be able to
  - check if it is set
  - check if a value has been defined
  - fall back to a default value if neither of the above are met

### Books

Here, the only thing that designates a section to become its own "book" is its inclusion in an array in `config.toml`:

```
[params.books]
  [params.books.help]
    title = "Help"
    section = "help"
    docstyle = "docs3"
    weight = -110
  [params.books.basic]
    title = "Hugo"
    section = "basic"
    docstyle = "docs1"
    weight = -100
  [params.books.personalize]
    title = "Personalize"
    section = "personalize"
    docstyle = "platformsh"
    weight = -90
  [params.books.articles]
    title = "Articles"
    section = "articles"
    docstyle = "article"
    weight = -80
  [params.books.faq]
    title = "FAQ"
    section = "faq"
    docstyle = "faq"
    weight = -70
  [params.books.platformsh]
    title = "Deploy"
    section = "platformsh"
    docstyle = "platformsh"
    weight = -60
```

This is a current solution, but perhaps if there is a stronger way of converting **permalinks** for sections labelled `book-faq` for example, that's the way to go in the long run. In the following array, each entry becomes it's own separate "book". Its sections are hidden from the main sidebar, and visiting the page associated with that book will present its own sidebar specific for its content. By default, everything in the root content directory that has not been specified in the `book` array parameter is included in the "main" book at `/`.

Part of the goal here is to have each book use individual variants of the theme (which will come with its own challenges). This includes 3/4 DocsUIKit docs themes, FAQ, Articles, and our Platformsh theme.

- User Documentation (`*`): Main/default theme, which in this case is `docs2` (priority 1a)
- Shortcodes/Help (`/help`): `docs1`
- Personalize (`/personalize`): `platformsh` (priority 1b)
- Articles (`/articles`): `article`
- FAQ (`/faq`): `faq`
- Hugo Basic Example (`/basic`): `docs3`
- Deploy on Platform.sh (`/deploy-platformsh`): `platformsh` (priority 1b)


### Purpose

Lorem ipsum

### What's with the name?

The reference to avocados in comes first from a talk given by [Mary Thengvall](https://www.marythengvall.com) called [*DevRel: Advocates, Evangelists, and Avocados*](https://www.youtube.com/watch?v=mrEhwqshxiM) and her  book [*The Business Value of Developer Relations: How and Why Technical Communities Are Key To Your Success*](https://www.amazon.com/Business-Value-Developer-Relations-Communities/dp/1484237471).

**avocadocs** was created and is maintained by the Developer Relations team at [Platform.sh](https://platform.sh/), and we have made this theme public for other documentation teams to use because documentation efforts matter so much to software projects. We use this theme for our own [documentation](https://github.com/platformsh/platformsh-docs), so we will always prioritize making this tool as helpful and easy as possible

as a way to give back to all of the other teams out there that, like us, take documentation seriously.

Avocados are

* "Good fat"
* Take on the flavor of what's around them
* Long time to ripen

Developer relations

* DevRel is good for you
* Inter-disciplinary, eclectic skillset, fluid and changing
* DevRel is the long game

## Getting Started <a name = "getting_started"></a>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Running locally

```
npm install
npm run dev
```

### Running on Platform.sh

```
npm run prod
```


### Prerequisites
What things you need to install the software and how to install them.

```
Give examples
```

### Installing
A step by step series of examples that tell you how to get a development env running.

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo.

## Running the tests <a name = "tests"></a>
Explain how to run the automated tests for this system.

### Break down into end to end tests
Explain what these tests test and why

```
Give an example
```

### And coding style tests
Explain what these tests test and why

```
Give an example
```

## Using this theme <a name="usage"></a>
Add notes about how to use the system.

## Deployment <a name = "deployment"></a>
Add additional notes about how to deploy this on a live system.

## Built Using <a name = "built_using"></a>
- [Hugo v0.61](https://gohugo.io/) - Framework
- [DocsUIKit](https://github.com/htmlstreamofficial/docs-ui-kit) - Theming

## TODO <a name=""></a>

---
- search bar spacing (above, on mobile)
- shortcodes placed within a highlight block get rendered, making it tough to document the theme
---

- [ ] Heading anchors (see https://discourse.gohugo.io/t/adding-anchor-next-to-headers/1726/7)
  - [ ] They work, and are build automatically, but the link `#` character does not appear to let others link without guessing the anchor
  - [ ] Actually, using the link above _does_ generate these anchors for _list_ pages, but NOT for _singles_
  - [ ] could use feather icons for anchors, but its currently processing  as safeHTML, so that will take  some finagling.
- [ ] Buttons: first and last buttons get smooshed smaller in mobile rather than filling block
- [ ] Books: Need to add book links to the top of the TOC in mobile.
- [ ] Add additional shortcodes
  - [ ] Hugo-book/hugoBasicExample: KaTeX math formatting
  - [ ] Hugo-book: columns
    - [ ] Note: on mobile (everything but the iPad Pro), this becomes just a single column in the end
    - [x] Columns of text
    - [x] code, using backtick formatting
    - [ ] code, using highlight shortcode: he current `syntaxtest`/`fetch`/read file shortcodes do not work here, and using highlight creates empty lines before and after
    - [ ] columns of code: the current `syntaxtest`/`fetch`/read file shortcodes do not work here
    - [ ] columns with images: images do not work either, the true size of thee image is used and it is not scaled to fit column.
    - [ ] columns with asciinema
    - [ ] columns with video: don't work at all. Starting to think that having a shortcode as .Inner is problematic
    - [ ] math formatting
    - [ ] figures
    - [ ] tables
    - [ ] buttons
    - [ ] revealjs
  - [ ] Hugo-book: expand
  - [ ] Hugo-book: mermaid
  - [ ] Hugo-book: tab/tabs -> use as a reference to clean up tabs. Also, take a look at the `columns.html` for an idea for how `{{ range split .Inner "<--->" }}` could be used.
  - [ ] DocsUIKit
    - [ ] buttons
    - [ ] breadcrumb navigation
    - [ ] carousel
    - [ ] forms
    - [ ] list group (FAQs)
    - [ ] pagination (getting started/tutorials)
    - [ ] tables
    - [ ] [grid layouts](https://htmlstream.com/preview/docs-ui-kit/documentation/base/colors.html)
  - [ ] APP: contributors (don't remember the original source)
  - [ ] APP: github organization repositories
- [ ] Add `markdownify` to existing shortcode templates that need them
  - [ ] alerts
  - [ ] callouts
- [ ] Currently, images require placing an `{{< image >}}` shortcode in order to set the styling to make images appear correctly on mobile. There must be a way to update the `img` styles so that is unneccessary, and so that the regular markdown `![alt title](images/source.png)` styling can be used. THIS IS IMPORTANT.
- [ ] create a "repo" data attribute or param attribute
  - [ ] update download button and all links
  - [ ] update social links to Platform.sh
  - [ ] this theme is built and maintained by the Platform.sh DevRel team
- [ ] clean up syntax-highighting work (still under shortcode name `syntax-test`)
- [ ] CSS to SCSS usage within theme?
- [ ] TOC in top RHC disappeared?
- [x] "front page" section (Introduction): Opinionated. Your docroot `_index.md` file is the front page, that exists in a section called "Introduction" (default, param could adjust), along with all other files not within their own separate section.
    - [x] A "home" section is defined in `config.toml`: `homeSection = "introduction"` which will
    - [x] Create a first section in the sidebar with a heading that matches that sections title
    - [x] Include all of its sub-sections and pages
    - [x] Will place the home page (`/content/<lang>/_index.md`) as the first entry in that section
    - [x] The name of the homepage defaults to introduction
    - [x] Same logic needs to be applied above to individual sub-books
      - [x] Fix current page logic for this "Introduction menu item"
    - [ ] Visiting the homepage automatically "sticky-scrolls" past the introductory header to the first entry. Should adjust this to still show the header.
- [ ] refactor sidebar `main` and `book` partials into "templates" or additional partials to clean up.
- [x] Be able to personalize favicon
  - [x] Define favicon in data file. (done for `docs2` doc style) *works only for PNG images*
- [ ] General cleanup.
- [ ] RevealJS shortcode.
- [x] Separate `config.toml` into `config/config.yaml` and `config/param.yaml` files.
- [x] Book links are currently only defined in the `/header/links.html` partial in raw html. Generate the books (and links) from the `books` struct in `config.toml`, or revert to menus.
    - [x] Need now to order these by `weight` [Possible solution](https://discourse.gohugo.io/t/ordering-data-by-custom-weight-parameter/7190/3)
    - [x] Fix sidebar logic for new data format
    - [ ] Pull book paths from variable name: `params.books.help` -> `/help`, which is complicated after weight sorting, within `partials/header/links.html`. Currently requires a separate `path` parameter be set for each book.
- [ ] Highlight: the "Copy" button disappeared for some reason. Bring it back!
- [x] third hidden level sections (within each book) - Works mostly, except in the case when a level three page is selected, in which case the sidebar reverts to the level one state.
    - [x] Partially fixed, except now the second level siblings to not appear when a third level page is selected
    - [x] Also, if a section contains a section with a third level, even if a page is selected that does NOT contain a third level, third level children are shown.
    - [x] Move third-level logic to sub-books
- [x] `levelTwoIndent` and  `levelThreeIndent` should be moved out of the templates to a central source. Data? Styles?
- [ ] SUPPORTED/DEPRECATED - generalize shortcodes to take an image as input, check if supported/deprecated exists, then create an `ul` for its data.
    - [ ] These should be moved to `exampleSite`, as they are not relevant to the theme itself.
- [ ] Apply Platform.sh styles - general, codetabs, user-widget
- [ ] Registry (outputs?)
- [ ] Search outputs to replace autocomplete
- [ ] Tagging/Taxonomies
- [ ] Multiple language configurations
- [ ] GLOSSARY! (Which looks like its a hidden page not in the sidebar)
  - [ ] enable hidden pages: relevant for Glossary and for potential hidden pages relevant to sales/alliances; should be build but not visible from sidebar
- [ ] Changelog (In the docs)
  - [ ] An `_index.md` section `titleHiddenFromSidebar` Parameter?
  - [ ] A Changelog for this theme itself
- [ ] Edit page links on each page
- [ ] Next and Previous arrows on the left and right side of the body
- [ ] Should the .Title/.description template stay for single page templates?
    - [ ] Create toggles for single pages
    - [ ] Create toggles project wide
    - [ ] Create toggles book-specific
- [ ] Remove all unnecessary scripts and packages that exit in DocsUIKit proper that are not needed
- [ ] Set up `platformsh/docsuikit` fork that is versioned, and can be used as a submodule upstream. Using the prior goal (removing unnecessary packages) for that upstream so it is bare bones.
- [ ] Make this theme capable of being used as a hugo module.
- [ ] The theme README should contain a deploy on platform button (perhaps that deploys our hugo template, which uses this theme)
- [ ] Figure out where this error is coming from (something is still not > 0.60 compatible ) `WARN 2019/12/10 18:08:35 Markup type mmark is deprecated and will be removed in a future release. See https://gohugo.io//content-management/formats/#list-of-content-formats`
- [ ] We will need to host the theme on PSH, perhaps we need a domain and stuff for that. (`theme.docs.platform.sh` or `hugodocskit.platform.sh`)
- [ ] Deploy on Platform.sh button shortcode contains a hard-coded width. Provide a `scale=` parameter that multiplies against the default `width`. (for visibility)
- [ ] Convert markdown relative links to Hugo-style

### Future

- [ ] Pulling in image supported/deprecated versions (requires markdownify readFile/rawHTML)
- [ ] Generate Full template page using Github api (how to handle templates like Hugo that don't have a language defined?)

## Authors <a name = "authors"></a>

**avocadocs** is written and maintained by the Developer Relations team at [Platform.sh](https://platform.sh/).

- [@robertDouglass](https://github.com/robertDouglass)
- [@Crell](https://github.com/Crell)
- [@NickAnderegg](https://github.com/NickAnderegg)
- [@chadwcarlson](https://github.com/chadwcarlson)
- [@otaviojava](https://github.com/otaviojava)

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## Acknowledgements <a name = "acknowledgement"></a>

- [Docs UI Kit](https://github.com/htmlstreamofficial/docs-ui-kit)
- Hugo Logo by [Steve Francia, Vectorization: Bud Parr, Apache License 2.0](https://commons.wikimedia.org/w/index.php?curid=77552265)
- [Freepik](https://www.flaticon.com/authors/freepik) team and [Flaticon](https://www.flaticon.com/) for the avocado icons
- [Hugo-book theme](https://github.com/alex-shpak/hugo-book) by [@alex-shpak](https://github.com/alex-shpak)
- [Docdock theme](https://github.com/vjeantet/hugo-theme-docdock) by [@vjeantet](https://github.com/vjeantet)
- [README template](https://github.com/kylelobo/The-Documentation-Compendium/blob/master/en/README_TEMPLATES/Standard.md) by [@kylelobo](https://github.com/kylelobo)

View the [Changelog]().
