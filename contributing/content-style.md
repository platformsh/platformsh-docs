# Platform.sh Docs content style guide

Thank you for your interest in contributing to the Platform.sh docs!
It's nice to share the goal of having clear and up-to-date documentation.

This content style guide should help make sure the Platform.sh docs are clear and consistent.
It's intended for use by all contributors,
from Platform.sh engineers to people from the community.

<!-- vale Platform.condescending = NO -->
## Table of contents

- [Platform.sh Docs content style guide](#platformsh-docs-content-style-guide)
  - [Table of contents](#table-of-contents)
  - [About the audience](#about-the-audience)
  - [Style defaults](#style-defaults)
  - [Address the reader directly](#address-the-reader-directly)
  - [Aim for neutral text](#aim-for-neutral-text)
  - [Use inclusive language](#use-inclusive-language)
    - [Resources for inclusive language](#resources-for-inclusive-language)
    - [Use meaningful link text](#use-meaningful-link-text)
    - [Link at the end of sentences in sentence case](#link-at-the-end-of-sentences-in-sentence-case)
    - [Minimize distractions](#minimize-distractions)
    - [Include alt text](#include-alt-text)
    - [Aim for simple sentences](#aim-for-simple-sentences)
    - [Use direct sentences](#use-direct-sentences)
  - [Use clear examples](#use-clear-examples)
  - [Format screenshots for sustainability](#format-screenshots-for-sustainability)
  - [Use the present tense](#use-the-present-tense)
  - [Use contractions](#use-contractions)
  - [Explain abbreviations](#explain-abbreviations)
  - [Use clear CLI commands](#use-clear-cli-commands)
    - [Use the long form of commands](#use-the-long-form-of-commands)
    - [Make commands work across shells](#make-commands-work-across-shells)
  - [Use notes appropriately](#use-notes-appropriately)
  - [Add short descriptions](#add-short-descriptions)
  - [Guidance enforcement](#guidance-enforcement)
<!-- vale Platform.condescending = YES -->

## About the audience

The goal of Platform.sh's documentation is to help tech-savvy users self-educate
on how to use and get the most out of Platform.sh.
Readers are generally familiar with common web development tools and practices
(such as Git, branching, web servers, and databases),
but not necessarily with server administration.
Make sure to provide enough context, potentially by linking to existing resources elsewhere.

## Style defaults

This style guide doesn't aim to cover every possible situation.
If you come across something not addressed here,
look for guidance in the [Google developer documentation style guide](https://developers.google.com/style).
For a quick summary of that guide, see the [Google style guide highlights](https://developers.google.com/style/highlights).

Platform.sh docs should be in standard U.S. spelling,
with reference to the [Merriam-Webster dictionary](https://www.merriam-webster.com/).

The name of the company is always written as "Platform.sh", not only "Platform".
It shouldn't be used as a link.

## Address the reader directly

In keeping with the Platform.sh value that to "tell it like it is",
focus texts on readers and talk to them directly.

This means using the second person ("you") and telling them what to do.
Unless you have a very good reason (such as an action that has to be done by Platform.sh manually),
avoid the first person ("we", "us", and "our").

Use                                              | Avoid 
-------------------------------------------------|-------
Next, download the template                      | Next, let's download the template
To get started quickly, use the default settings | We recommend that you use the default settings to get started quickly
Once you add the file to your repository         | Once we've added the file to our repository

Part of this directness is also avoiding using `please`.
Only use `please` if you're asking for something that benefits Platform.sh
or inconveniences the reader.

So it's OK in phrases like `If you get an error, please open a support ticket.`

## Aim for neutral text

In general, aim to present facts without inserting too much opinion.
Aim for an authoritative tone, but not one that condescends to readers.
Don't use phrases that exaggerate.

Use                                             | Avoid
------------------------------------------------|-------
Be careful not to break anything                | Of course, you naturally have to avoid breaking anything
Making this small change can have large effects | Surprisingly, making this tiny change can have huge effects

## Use inclusive language

In keeping with the Platform.sh value of being diverse,
use language that welcomes everyone and excludes no one.

Use                                                      | Avoid 
---------------------------------------------------------|-------
After you invite someone, they can access your project   | After you invite someone, he can access your project
If they have the `plans` permission, they can add a plan | If he/she has the `plans` permission, he/she can add a plan 
denylist                                                 | blacklist
allowlist                                                | whitelist

### Resources for inclusive language

Some guides to help you make sure your writing is inclusive and accessible to everyone.

* [Mailchimp guide to writing for accessibility](https://styleguide.mailchimp.com/writing-for-accessibility/)
* [Microsoft's ideas on writing for all abilities](https://docs.microsoft.com/en-us/style-guide/accessibility/writing-all-abilities)
* [Google suggestions for writing accessible documentation](https://developers.google.com/style/accessibility)
* [Microsoft accessibility guidelines](https://docs.microsoft.com/en-us/style-guide/accessibility/accessibility-guidelines-requirements)
* [The Conscious Style Guide](https://consciousstyleguide.com/)

### Use meaningful link text

To make your content as accessible as possible, the purpose of a link should be clear from its text alone.
Avoid links with text like `click here`
and instead try to include meaning inside the link itself.

Remember to use the [proper format for links](./markup-format.md#links)

The supporting documentation for the Web Content Accessibility Guidelines
explains [why link purpose in the text alone is good](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-link-only).

Use                                                        | Avoid 
-----------------------------------------------------------|-------
Read more information [about images](https://example.com)  | For more info on images, [click here](https://example.com)

### Link at the end of sentences in sentence case

Readers often scan through text looking for links and other important information.
Having links in the middle of sentences can make them harder to parse.

Put links at the end of sentences and keep them in sentence case.

Use                                                                     | Avoid 
----------------------------------------------------------------------- |-------
To learn how to set it up, read about [services](https://example.com).  | Reading about [Services](https://example.com) shows you how to set it up.
For more information, see how to [configure apps](https://example.com). | For more information, see [Configure apps](https://example.com).

### Minimize distractions

Adding links can often provide helpful context.
It's a great way to offer additional information for those who want it,
while letting those who know the concept skip past.
But having many links increases the chance that readers leave the page and don't return.

Especially when writing how-to guides and procedures, try to minimize the number of links in the middle.
Each link that's added gives another reason for the reader to not finish the article.

If additional context is desired, add it in prerequisites at the start or next steps at the end.
That way people can focus on completing the task.

### Include alt text

When adding images and other visual elements to the docs,
make sure the same content is available to those who can't see the content.
This includes people who don't see and people who have images off in their browser for whatever reason.

Use alternative text for images that add content to a page that isn't otherwise there.
Imagine what you would write if you couldn't include the image.

In situations where the image is for decoration or repeats text that's already present,
use blank alternative text to show that.

See the [proper format for images](./markup-format.md#images).

<!-- vale Platform.condescending = NO -->
### Aim for simple sentences

Complex sentences make it harder for people to understand.
Aim to keep sentences simple so people can comprehend them quickly.

Part of this is keeping sentences short.
Aim for an average length of 15 words per sentence, with 25 as the upper limit.
Individual sentences should have no more than 40 words.

It also means trying to use fewer clauses and not separating ideas by other ones.

Use                                           | Avoid
--------------------------------------------- |-------
Your Node.js app requires a caching strategy. | Your app, which you run with Node.js, a caching strategy requires.

It also means using simple words instead of more complex ones.
The following table shows some examples:

Use   | Avoid
----- | -------------
about | approximately
buy   | purchase
help  | assist
to    | in order to
use   | utilize

For more on the reasons behind this,
see Content Design London's [Readability Guidelines on clear language](https://readabilityguidelines.co.uk/clear-language/).

### Use direct sentences

You generally want to be as direct as possible to keep the ideas simple.
By avoiding overly wordy phrases, you help make it clearer what needs to be done.
<!-- vale Platform.condescending = YES -->

For example, try to avoid using sentences starting with `There is/are` or `It is` too often.
While there are times when this makes sense, often you can rephrase the sentence to be more direct.
Such phrases work well for rhythm and emphasis, but that is usually less important in technical writing.

Similar arguments apply to passive sentences.
Sometimes, they work well, such as when the subject would be `the system`
or something else that doesn't help clarify things.
But usually, making a verb active makes it clearer what it is about.

Use                          | Avoid
---------------------------- | ----------------------------------
You must find a solution     | It is necessary to find a solution
The app forwards requests    | It is the app that forwards requests
You should follow four rules | There are four rules that should be observed
Your requests are redirected | The system redirects your requests
This is caused by            | The cause of this issue has to do with

## Use clear examples

You use one of two basic types of examples:

- Code that can be copied and pasted with minimal modifications
- Code that shows what a command or response might look like in full

For the first type, keep the code basic without any flags users might not need.
For any text that should be replaced by users, use [variables in code](./markup-format.md#variables-in-code).
To make the code easier to copy and paste, don't include variables unless necessary.
For example, don't include the project ID for every CLI command.

For the second type, use example values based on the following table:

| Item               | What to use |
| ------------------ | ----------- |
| IP address         | An [IP address reserved for documentation](https://en.wikipedia.org/wiki/Reserved_IP_addresses#IPv4). |
| Domain             | A [domain reserved for documentation](https://en.wikipedia.org/wiki/Special-use_domain_name). |
| Email address      | A domain reserved for documentation. A local-part that is generic, not a name. Example: `someone@example.com` |
| Name               | Try to avoid using names. If you need to distinguish different users, try using job titles first. If you absolutely must use a name, [generate a random one](https://uxdummy.com/generator/fake-user-name). |
| Project ID         | `abcdefgh1234567` |
| Other IDs          | Half a string of letters starting from `a` and half numbers from `1`, similarly to the project ID. So for an ID with 8 characters, use `abcd1234`. |
| Region             | `eu`, unless there is a specific reason not to. |
| Branch/environment | On Grid: `main` for the default branch/environment and `feature` for a comparison branch/environment. On Dedicated Gen 2: `production` for the default and `dev` for a second. |
| Environment URL    | By combining the above standards, the default for Grid non-default environments is: `https://feature-abcd123-abcdefgh1234567.eu.platformsh.site`. |

## Format screenshots for sustainability

When taking screenshots of the console or other UI, focus only on the relevant part.
Crop the screenshot so it only shows what users need to get the context.
This helps keep the images fresh if other parts of the UI change.

Use your browser's developer tools to ensure your name
and any other project-specific data isn't included.

Name the file descriptively so that it relates to what's being shown.

## Use the present tense

Readers are often using the documentation they're reading at that moment.
Even if they might be using the code in the future,
writing about the present is clearer and more direct.

Use the present tense to describe actions unless the action will be at a specific time in the future
(_you will get an email on October 17_).

Use                                                                           | Avoid 
------------------------------------------------------------------------------|-------
After the site deploys, you see a welcome page.                               | After the site deploys, you will see a welcome page.
The details of the process vary from project to project.                      | The details of the process will vary from project to project.
Once you save your build environment variable, your environment is redeployed | Once you save your build environment variable, your environment will be redeployed.

## Use contractions

To keep this documentation welcoming and make it easier to scan,
feel free to use contractions that are common in speech.
Apply this even to negative contractions
as there is some evidence people are less likely to skip the negative in `don't` than in `do not`.

Avoid contractions that are uncommon or that might be confusing
(such as making readers think something is a possessive rather than a verb).
Use `it's` only for a contraction of `it is`, not as a possessive.

Use                                    | Avoid 
---------------------------------------|-------
Don't hesitate to use contractions.    | Do not hesitate to use contractions.
The environment is ready.              | The environment's ready.
This command returns what its name is. | This command returns what it's name is.

## Explain abbreviations

Too many abbreviations can be confusing to readers.
Make sure to explain any abbreviations that might be unfamiliar the first time they're used.

Avoid abbreviations for Latin terms, such as `i.e.`, `e.g.`, and `etc.`.
as these aren't always understood correctly.

Use                                                                         | Avoid 
----------------------------------------------------------------------------|-------
It's a new key management service (KMS). You should use this KMS carefully. | It's a new KMS. You should use this KMS carefully.
You have many service options, including Elasticsearch and Kafka.           | You have many service options, e.g. Elasticsearch, Kafka, etc.

## Use clear CLI commands

### Use the long form of commands

The Platform.sh CLI has aliases for certain commands to make typing shorter.
Some of these are semantically valid, but some might be confusing.

Always use the long form of the command to show the entire context, including the namespace.
Exception: `login` and `logout`.
Both of these are clear enough without additional context and the `auth` namespace doesn't add value.
So use the short form for them without `auth:`.

Use                                                           | Avoid
--------------------------------------------------------------|-------
To see all available variables, run `platform variable:list`. | To see all available variables, run `platform var`.
To get a list of users, run `platform user:list`.             | To get a list of users, run `platform users`.
To login, run `platform login`.                               | To login, run `platform auth:login`.

### Make commands work across shells

Not all shells handle special characters such as `*` the same.
To ensure commands work on various shells,
prefer CLI commands with quotes instead of double dashes.

Use                                                                     | Avoid
------------------------------------------------------------------------|-------
`platform ssh "grep -e '^pm.max_children' /etc/php/*/fpm/php-fpm.conf"` | `platform ssh -- grep -e '^pm.max_children' /etc/php/*/fpm/php-fpm.conf`

## Use notes appropriately

Notes are pieces of information that stand outside the normal text flow.
Use them for short ideas that aren't part of the main idea.
Don't use too many in one place or they lose their value.

There are three types of notes:

* Note: For neutral information that's worth taking into consideration.
* Info: For helpful information that might save the reader time
  or otherwise benefit them.
* Warning: For information that's serious and must be taken into account.
  Ignoring a warning could cause things to break or data to disappear.

Each type of note has its type as the default title.
You can override the title to anything, but keep it short.

See [how to format notes](./markup-format.md#notes).

## Add short descriptions

Each page should ideally have a description that can be reused in other places.

`description` is of the options in the [front matter](./markup-format.md#front-matter).
It allows you to set a meta tag for search optimization
and text to appear on listing pages.

Add a description of what the page contains,
something that makes sense out of the context of the rest of the page.

Remember to keep it short.
If possible, it should be no more than about 160 characters.

## Guidance enforcement

Some of the rules are enforced with [Vale](https://docs.errata.ai/vale/about), a linter for prose.

Because writing style is subjective and no checking tool is perfect,
the rules are mostly set to warnings rather than errors.
So automated checks show when something might be wrong,
but use your common sense and ignore them when appropriate.

One exception is spelling, which returns errors.
If there's a word that's been falsely flagged as a misspelling,
add it to the list in `styles/Vocab/Platform/accept.txt`.

<!-- vale Platform.condescending = NO-->
Another exception is words like `simply`, which can come off as condescending.
For more, see an [article on words to avoid](https://css-tricks.com/words-avoid-educational-writing/)
or a [video on not saying 'simply'](https://www.writethedocs.org/videos/prague/2018/don-t-say-simply-jim-fisher/).
<!-- vale Platform.condescending = YES-->

To get the most out of the rules, [install Vale](https://docs.errata.ai/vale/install)
and run it locally with the command `lint:prose` from the repository root.
Or use it in your IDE, such as with [Vale for VS Code](https://github.com/errata-ai/vale-vscode).

All pull requests against the default branch are also checked by Vale automatically.
