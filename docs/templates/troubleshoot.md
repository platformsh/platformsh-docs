---
title: Add a title (using Troubleshoot + a noun)
sidebarTitle: Optional short title if 'title' is long
description: A short description (up to ~160 characters) of the article that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  To present common reasons for and solutions to errors.
  To help users solve issues.
  The focus is on solving immediate problems.

How to use
  1. Copy this template into the right directory in /src/docs/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
-->

Individual troubleshooting articles should be on specific topics.
Include a link to the general troubleshoot article with the following shortcode:

{{% troubleshoot %}}

## Error message or description

The section heading should either have a partial error message or a description.
If the message isn't in the heading, include it in the text.
This helps users find answers when searching for the message.

Continue by describing the situations in which the message appears and how to deal with it:

If you have `<CIRCUMSTANCES>`,
you might get an error that states `<ERROR_MESSAGE>`.

This issue occurs when...

To resolve the issue, do this.

If readers only need a couple of actions to solve the issue, present them in a paragraph.
If it's more than a couple of actions, use an ordered list:

1. Do this action first.
2. Do this action next.
3. Do this action third.
4. Do this action fourth.

## Repeat for other errors

Treat each error separately as readers might end up in that section without seeing the others.
Link to other errors/solutions as needed.
