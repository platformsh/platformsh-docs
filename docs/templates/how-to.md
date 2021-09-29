---
title: Add a title (using an infinitive like this one)
sidebarTitle: Optional short title if 'title' is long
description: A short description (up to ~160 characters) of the article that should make sense out of context (like on a listing page).
---

<!-- 
When to use
  When there is a single outcome a user wants to archieve.
  When you want to explain how to get to the outcome in ordered steps.
  https://diataxis.fr/how-to-guides/ 

How to use
  1. Copy this template into the right directory in /src/docs/.
  2. Rename it to match the title.
  3. Replace the following content with your own.
-->

Introduce the topic in 1 or 2 sentences.
Include reasons why a person might want to do it
(the most common use cases).
Also include what the goal of the task is.

## Before you begin

Include here any terms the reader might need
(either defined here or linked to a definition).
Also any prerequisites they might need to install/know,
such as having the CLI installed or having created a project.
For tasks like installing the CLI,
link to instructions rather than including them here.

## 1. Do this first

This starts the list of steps readers must do in order.
Order them with numbers.
The titles should be bare infinitives: https://developers.google.com/style/headings?hl=en

Introduce the purpose of this step very briefly.

Then use an ordered list for the actions to take:

1. Do this first.
1. Do this next.
1. Do this third.
1. Do this fourth.

Include a short example of what the expected outcome of this step is,
such as a code example, a description of what the user can do now,
or (if absolutely necessary) a screenshot.

## 2. Do this second

Split into separate steps when there are more than 5--7 actions in a step.
Also when each separate step has an outcome that be described or shown.

Introduce the purpose of this step very briefly.

Use an ordered list for the actions to take.
If the intended audience might be likely to do things in multiple ways,
split the various ways into tabs so users only see what's relevant to them:

{{< codetabs >}}

---
title=Using the CLI
file=none
highlight=false
---

1. Do this first with the CLI.
1. Do this next with the CLI.
1. Do this third with the CLI.
1. Do this fourth with the CLI.

<--->

---
title=In the console
file=none
highlight=false
---

1. Do this first in the console.
1. Do this next in the console.
1. Do this third in the console.
1. Do this fourth in the console.

{{< /codetabs >}}

Include a short example of what the expected outcome of this step is.

## 3. Run these commands

The examples can include commands to run.
Start by introducing the purpose of this step very briefly.

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

## What's next

Include an example of the expected outcome for the task as a whole.
Link to any further information or other tasks they might want to do next.
