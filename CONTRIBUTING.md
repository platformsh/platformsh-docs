# Contributing to the Platform.sh user documentation

Thank you for helping make the Platform.sh documentation better!

These contribution guides should help you keep the docs clear and consistent.
They're intended for use by all contributors,
from Platform.sh engineers to people from the community.

For style and formatting guidance, see:

* [Content style guide](contributing/content-style.md)
* [Markup reference](contributing/markup-format.md)

The docs are generally structured based on the [Diátaxis framework](https://diataxis.fr/).
For how that structure is applied to different types of docs in this project, see the [templates](docs/templates).

## Table of contents

- [Contributing to the Platform.sh user documentation](#contributing-to-the-platformsh-user-documentation)
  - [Table of contents](#table-of-contents)
  - [Adding new pages](#adding-new-pages)
    - [Adding security reports](#adding-security-reports)
  - [Commit messages](#commit-messages)
  - [Review process](#review-process)
    - [Review comment style](#review-comment-style)
    - [Checks](#checks)

## Adding new pages

To get a head start on your page, copy one of the [templates](docs/templates).

All file names should end in `.md`.
They should be all lowercase
and match the page title or a short version of it.

To add a page to an existing section such as **Languages**, add the following file:

```text
src/
   ...
   languages/
      ...
      new_language.md
```

Make sure that you give it the required [front matter](contributing/markup-format.md#front-matter).

To add a new subsection that contains multiple pages under an existing section,
add a directory and an `_index.md` file:

```text
src/
   ...
   languages/
      ...
      new_language/
        _index.md
        specific_page.md
```

By default, the `_index.md` file has a `list` layout,
which means it contains buttons linking to all pages in its directory.
To override this and include content from the `_index.md` file itself,
set the `layout` to `single` in the [front matter](contributing/markup-format.md#front-matter).

## Redirect pages

You sometimes need to move pages around to new locations.
To keep links from other sites working, set up redirects from the old URL to the new one.

Although Hugo has a built-in `aliases` property for this purpose,
it uses meta refresh tags and so you shouldn't use it.
Instead, prefer redirects that return 301 codes (Moved Permanently).

Set them up in the [Platform.sh routes configuration](./.platform/routes.yaml).
For more information, see how to [redirect routes](https://docs.platform.sh/define-routes/redirects.html).

## Commit messages

To help understand why changes happened and not repeat work already done,
the aim is to keep a meaningful history of changes to the project.
This means you should use meaningful commit messages (not just `Updated file.md`).

The pattern for the project is:

```txt
:GITMOJI: Verb + action

Optional extra context
```

Where `GITMOJI` is the [gitmoji](https://gitmoji.dev/) that corresponds to what the change is. For example:

```txt
:sparkles: Add documentation for organizations

Added new pages to describe how organizations at Platform.sh work.
```

To help with the process, you can install the [gitmoji CLI](https://github.com/carloscuesta/gitmoji-cli).

## Review process

<!-- vale Platform.first-person = NO -->
Our default branch is protected, so you can't push directly to it
and pull requests require approval from someone with write access.

We're happy to review your suggested changes.
We generally review for:

* Accuracy
* Clarity
* Consistency with our [style guide](contributing/content-style.md)

To speed the process along, we may merge small changes such as spelling and formatting
into your branch.
Otherwise, we make suggestions and work with you to finalize the changes.
<!-- vale Platform.first-person = YES -->

### Review comment style

To make comments clearer, each comment should have an emoji label describing its purpose.
The following labels are primarily used:

| Emoji | `:code:`              | Meaning      | Can merge  | Description |
| ----- | --------------------- | ------------ | ---------- | ----------- |
| 😍    | `:heart_eyes:`        | Praise       | ▶️          | Used when something is well done. No further action required. Should be at least one of these for each review. |
| ⛏️    | `:pick:`              | Nitpick      | ▶️          | For small details based on preferences. |
| 🛠️    | `:hammer_and_wrench:` | Suggestion   | 🚫         | To indicate a specific idea for improvement. By default, the suggestion needs to be accepted or otherwise addressed before merging. |
| 💅    | `:nail_care:`         | Polish       | ▶️          | To indicate a specific idea for improvement that isn't fixing something wrong, but just pointing out ways to improve quality. |
| 📋    | `:clipboard:`         | To-do        | 🚫         | For small, necessary changes, such as fixing typos. |
| 🐞    | `:lady_beetle:`       | Issue        | 🚫         | To highlight a specific issue that needs to be fixed. Can be paired with a suggestion if a solution is known. |
| ❓    | `:question:`          | Question     | 🚫         | For potential concerns that may not be relevant or for areas that aren't completely clear. By default, requires a response. |

The following labels are also possible:

| Emoji | `:code:`              | Meaning      | Can merge  | Description |
| ----- | --------------------- | ------------ | ---------- | ----------- |
| 💡    | `:bulb:`              | Thought      | ▶️          | To introduce an idea that came up from reviewing. More general than a suggestion and not focused on the details. Doesn't block merging by default, but can lead to more discussion. |
| 🧹    | `:broom:`             | Chore        | 🚫         | For small process tasks that need to be done before merging. |

The following decorations can be added for further clarification (to override default of blocking or not):

| Emoji | `:code:`          | Meaning      | Description |
| ----- | ----------------- | ------------ | ----------- |
| ⏸️    | `:pause_button:`  | Blocking     | Used to indicate that the comment blocks merging. |
| ▶️     | `:arrow_forward:` | Non-blocking | Used to indicate that the comment doesn't block merging. |

The pattern is based on [conventional comments](https://conventionalcomments.org/).
It uses emoji other than the ones for [commit messages](#commit-messages).

### Checks

To ensure the docs work smoothly, a few checks run on each pull request:

- Vale enforces the [style guidelines](./contributing/content-style.md).

- [`htmltest`](https://github.com/wjdp/htmltest) to check that all internal links in the built site are valid
  (including whether linked headers exist).
  Any errors in links to external sites are found in the regular check of all links.

  To run this check locally, run the following commands:

  ```bash
  # Download the htmltest tool
  curl https://htmltest.wjdp.uk | bash
  # If you haven't done so, install dependencies
  npm install
  # Generate necessary files
  npm run dev
  npm run build:search
  # Build HTML pages to check
  hugo
  # Run the check
  ./bin/htmltest
  ```

- Custom workflows [check all changed files](./.github/workflows/pr-url-and-dependent.yaml) within `docs/src`
  and [comment with links](./.github/workflows/comment-on-pr.yaml) to the deployed pages for review.

Outside of pull requests, twice a week [Muffet](https://github.com/raviqqe/muffet)
checks if all links on the site are valid.
