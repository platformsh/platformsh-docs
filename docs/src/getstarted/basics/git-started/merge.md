---
title: "Your first merge"
weight: 4
description: |
  Merge your changes into production.
---

## Merge

In your terminal, run the command:

```bash
platform environment:merge -y
```

After running the command (and in the activity seen on both the **Main** and **updates** environments), you'll see the following:

```bash
$ platform environment:merge -y
Are you sure you want to merge updates into its parent, main? [Y/n] y
Merging updates into main
Waiting for the activity tgadhzqnzsr5u (Chad Carlson merged updates into Main):

Preparing to merge environment 'updates' into main
Merge successful
Found X new commits

Building application 'app' (runtime type: LANGUAGE:VERSION, tree: 43ad5c8)
  Reusing existing build for this tree ID

...

```

The **updates** environment is merged in to **Main** - the production environment now contains the new file you committed.
Same as before, just in the opposite direction, it is not necessary to rebuild the application again on the production environment. 
No code has changed during the merge event, the default branch now is just at the state (tree) previously associated only with the `updates` branch.

Because of this, the build can be reused and the build phase skipped. 

## What's next

This wraps up the second part of what makes Platform.sh so useful. 
When developing a production application, you're inevitably going to have to make changes to it on a day-to-day basis. 
Experimenting with those changes requires developing on an environment that as closely matches production as possible - often called a "staging" environment. 
The _reason_ you want "staging" environments to so closely match production is so that you can be assured that 

1. Things that work in staging will continue to work in production.
1. Nothing unexpected happens in the act of merging into production. 

On Platform.sh, merging into production simply means reusing a pre-existing build image from a development environment on the production environment. 
This build image is immutable by design, and will not undergo new steps that will break during the act of merging. 

There is, of course, an important component missing here to convince you of this process: **data**.
Development environments so far on Platform.sh match production as far as infrastructure is concerned, but without production data many of your tests will be unable to adequately sign-off that a new feature will work as expected when your users start interacting with it in production. 

In the next guide, you will see how Platform.sh provides a number of **managed services** - quickly configurable common service containers (i.e. databases) - that are committed and inherited into development environments just like application containers. 
You'll add data to the environment and see how Platform.sh uses Git to provide production data to every development environment automatically. 

With these features, `git branch` becomes a command that generates exact copies of production - true staging environments - for you to work on. 

Let's check it out.

{{< guide-buttons next="How does data work?" link="/getstarted/basics/data-services/_index.md" >}}
