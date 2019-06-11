# Contributing to the Platform.sh User Documentation

Thank you for helping make our documentation better!

In order to maintain a consistent style and voice throughout our documentation please try to follow these standards and conventions when filing Pull Requests against our documentation.

## Markdown

GitBook (which we use for documentation) uses Markdown as its file format.  

* All files should end in `.md`. They should be all-lower-case and match the title of the page, or in some cases an abbridged version of it.
* All pages should start with a title, denoted with # (first level header).
* Subsections within a page are encouraged, and should use ## for a 2nd level and ### for a 3rd level. Do not have more than 3 levels of header.
* Inline code statements, file names, and keys that would appear in a file should use backticks ``like this``.
* Longer code samples should be denoted with triple backticks before and after, with no extra whitespace between the backticks and the code block. Always specify the language of the code block.  See the [highlight.js docs](https://highlightjs.org/static/demo/) for available language options.  (`yaml`, `bash`, and `php` are the most common we're likely to see).
* Always use inline links.
* Do not hard-wrap prose text.  Set your text editor to soft wrapping.
* Internal links should be absolute (starting with `/`) and link to a file ending in `.md`, not `.html`. That makes them easier to find when needed to update.

## Content

The goal of Platform.sh's documentation is to help tech-savvy users self-educate on how to use and get the most out of Platform.sh.  Therefore, the reader should be assumed to be familiar with common web development tools and practices (version control, Git, branching, web servers, databases, etc.), but not necessarily with server administration.  When in doubt, favor providing more background information rather than less, and/or link out to existing resources for background.
 
 The aim of the documentation is less to provide context-less "how" information but to emphasize the underlying "why" behind what needs to be done.  All documentation should strive to help improve the user's mental model of how the system works so that they can self-educate more effectively. That also means that not every tip or trick needs to be included if they're not especially common cases.
 
 That said, undocumented options should be treated as a bug, unconditionally.
 
## Structure

* Favor short titles for pages and sections.
* Titles of pages and sections should use Sentence case.  That is, capitalize the first word and proper nouns only.
* Never have a page in the outline that is more than 2 levels deep. That is, never have a sub-sub item.  That ensures all pages are at most 2 clicks away from any other page.
* Each page should cover one topic, but should completely cover that topic. Do not break topics across multiple pages needlessly.
* The use of asides should be sparing.  If used, they must begin with a `**bolded**` header of "note" or "warning", as appropriate. Most text simply belongs as part of the prose, however.

## Language usage

* All documentation should be written in American English, using American English spelling.
* Always use the [Oxford Comma](https://en.wikipedia.org/wiki/Serial_comma).
* The name of the company is always written as "Platform.sh", not simply "Platform". It should not be linked anywhere. 
* "We" should, if used, always refer to Platform.sh the company.  However, avoid its use where feasible.
* The reader is assumed to be a developer, and should be addressed as "you".  E.g., "Once you add this file to your repository...".
* Avoid the use of gender-specific pronouns (he/she, his/her).  The "singular they" (they/their) should be used when it is necessary to refer to a person in the 3rd person.
* When referring to a file path in a YAML code example, do not include a leading `/` prefix unless it truly is based on the absolute root of the file tree.  In most cases it is relative to some other location so the `/` should not be used.
* When referring to a URL path in a YAML code example, assume it is relative to the domain root and therefore should include a leading `/`.

## Process

* Favor many small PRs over larger ones.
* Never push directly to the master branch.
* Never merge your own PR, unless not doing so would result in customer data loss.
* If your PR relates to new support for runtime or service images, include a complementary line addressing that upgrade in the [Changelog](/changelog.md).
