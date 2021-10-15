---
title: Add a title (using an infinitive like this one)
sidebarTitle: Optional short title if 'title' is long
description: A short description (up to ~160 characters) of the article that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  When you want to outline a real use case or need.
  When you want to increase readers' understanding of something while doing it,
  to help them learn by doing.
  The focus is on building long-term understanding
  through a practical example.
  https://diataxis.fr/tutorials/

How to use
  1. Copy this template into the right directory in /src/docs/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
-->

The overall tone of a tutorial should be conversational,
so readers feel guided by a helpful teacher.

Start by introducing the topic in 1 or 2 sentences.
Set the appropriate expectations for the tutorial:
make it clear what they learn to do
and how much they should already know.

Make sure the expected outcome of the tutorial is clear.

## Before you begin

Include here any prerequisites readers might need to install,
such as having the CLI installed or having created a project.

For tasks like installing the CLI,
link to instructions rather than including them here.

## Do this step first

This starts the list of steps readers must do in order
(each step is a separate section in the document).
The titles should be bare infinitives: https://developers.google.com/style/headings?hl=en

Introduce the purpose of this step very briefly.
Explain what's necessary in 1--2 sentences.
Any new terminology should be linked to an explanation elsewhere.

If readers only need to do a couple of actions, just present them as conversational prose.
If it's more than a couple of actions,
use an ordered list for the actions to take to complete the step:

1. Do this action first.
1. Do this action next.
1. Do this action third.
1. Do this action fourth.

If there are multiple ways to do the actions (such as in the console and using the CLI),
only present one way (the way that makes the most sense for the expected audience).

Include a short example of what the expected outcome of this step is,
such as a code example, a description of what the user can do now,
or (if absolutely necessary) a screenshot.
It should be clear from the outcome how far along in the overall process they are.

## Run these commands

Split into separate steps when there are more than 5--7 actions in a step.
Also when each separate step has an outcome that be described or shown.

The examples can include commands to run.
Start by introducing the purpose of this step very briefly (as above).

Use an ordered list for the actions to take:

1. Run `command --options`.
1. Run `other_command --options`.
1. Run `third_command --options`.

Include a short example of what the expected outcome of this step is.

```yaml
outcome:
    yaml:
      - beautiful
      - clean
      - optimized
```

It should be clear from the outcome how far along in the overall process they are.

## What you've accomplished

Celebrate what the reader has learned.
Include an example of the expected outcome for the task as a whole.
Link to any further information or other tasks they might want to do next.
