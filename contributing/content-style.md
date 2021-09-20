# Platform.sh Docs Content Style Guide

## Introduction

Thank you for your interest in contributing to the Platform.sh docs!
It's nice to share the goal of having clear and up-to-date documentation.

This content style guide should help make sure the Platform.sh docs are clear and consistent.
It's intended for use by all contributors,
from Platform.sh engineers to people from the community.

## About the audience

The goal of Platform.sh's documentation is to help tech-savvy users self-educate
on how to use and get the most out of Platform.sh.
Readers are generally familiar with common web development tools and practices
(such as Git, branching, web servers, and databases),
but not necessarily with server administration.
Make sure to provide enough context, potentially by linking to existing resources elsewhere.

## Style defaults

This style guide does not aim to cover every possible situation.
If you come across something not addressed here,
look for guidance in the [Google developer documentation style guide](https://developers.google.com/style).
For a quick summary of that guide, see the [Google style guide highlights](https://developers.google.com/style/highlights).

Platform.sh docs should be in standard U.S. spelling,
with reference to the [Merriam-Webster dictionary](https://www.merriam-webster.com/).

The name of the company is always written as "Platform.sh", not only "Platform".
It should not be used as a link.

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

## Use inclusive language

In keeping with the Platform.sh value of being diverse,
use language that welcomes everyone and excludes no one.

Use                                                      | Avoid 
---------------------------------------------------------|-------
After you invite someone, they can access your project   | After you invite someone, he can access your project
If they have the `plans` permission, they can add a plan | If he/she has the `plans` permission, he/she can add a plan 
blacklist                                                | denylist
whitelist                                                | allowlist

### Resources for inclusive language

Some guides to helping you make sure your writing is inclusive and accessible to everyone.

- [Mailchimp guide to writing for accessibility](https://styleguide.mailchimp.com/writing-for-accessibility/)
- [Microsoft's ideas on writing for all abilities](https://docs.microsoft.com/en-us/style-guide/accessibility/writing-all-abilities)
- [Google suggestions for writing accessible documentation](https://developers.google.com/style/accessibility)
- [Microsoft accessibility guidelines](https://docs.microsoft.com/en-us/style-guide/accessibility/accessibility-guidelines-requirements)
- [The Conscious Style Guide](https://consciousstyleguide.com/)

### Use meaningful link text

To make your content as accessible as possible, the purpose of a link should be clear from its text alone.
Avoid links with text like `click here`
and instead try to include meaning inside the link itself.

Remember to use the [proper format for links](./markup-format.md#links)

The supporting documentation for the Web Content Accessibility Guidelines
offers an explanation of [why link purpose in the text alone is good](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-link-only).

Use                                                        | Avoid 
-----------------------------------------------------------|-------
Read more information [about images](https://example.com)  | For more info on images, [click here](https://example.com)

### Include alt text

When adding images and other visual elements to the docs,
make sure the same content is available to those who can't see the content.
This includes people who don't see and people who have images off in their browser for whatever reason.

Use alternative text for images that add content to a page that isn't otherwise there.
Imagine what you would write if you couldn't include the image.

In situations where the image is for decoration or repeats text that is already present,
use blank alternative text to show that.

See the [proper format for images](./markup-format.md#images).

## Format screenshots for sustainability

When taking screenshots of the console or other UI, focus only on the relevant part.
Crop the screenshot so it only shows what users need to get the context.
This helps keep the images fresh if other parts of the UI change.

Use your browser's developer tools to ensure your name
and any other project-specific data is not included.

Name the file descriptively so that it relates to what is being shown.

## Use the present tense

Readers are often using the documentation they are reading at that moment.
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
(such as making readings think something is a possessive rather than a verb).
Make use to use `it's` only for a contraction of `it is`, not as a possessive.

Use                                    | Avoid 
---------------------------------------|-------
Don't hesitate to use contractions.    | Do not hesitate to use contractions.
The environment is ready.              | The environment's ready.
This command returns what its name is. | This command returns what it's name is.

## Explain abbreviations

Too many abbreviations can be confusing to readers.
Make sure to explain any abbreviations that might be unfamiliar the first time they are used.

Avoid abbreviations for Latin terms, such as `i.e.`, `e.g.`, and `etc.`.
as these are not always understood correctly.

Use                                                                         | Avoid 
----------------------------------------------------------------------------|-------
It's a new key management service (KMS). You should use this KMS carefully. | It's a new KMS. You should use this KMS carefully.
You have many service options, including Elasticsearch and Kafka.           | You have many service options, e.g. Elasticsearch, Kafka, etc.

## Use notes appropriately

Notes are pieces of information that stand outside the normal text flow.
Use them for short ideas that aren't.
Don't use too many in one place or they lose their value.

There are three types of notes:

* Note: For neutral information that is worth taking into consideration.
* Info: For helpful information that might save the reader time
  or otherwise benefit them.
* Warning: For information that is serious and must be taken into account.
  Ignoring a warning could cause things to break or data to disappear.

Each type of note has its type as the default title.
You can override the title to anything, but keep it short.

See [how to format notes](./markup-format.md#notes).
