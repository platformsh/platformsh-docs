---
title: Git init
weight: -10
description: Initialize your project
---

The basic unit for organizing work within Platform.sh is a project.
Each project represents one Git repository, a centralized place to store code and work history.
For now, Platform.sh represents the source of truth for your repository.
You can later set up an integration with GitHub, Bitbucket, or GitLab.

To deploy your app, you need to connect its repository to a project in Platform.sh.

First, create a Platform.sh project by running the following command:

```bash
platform project:create
```

Then go through each of the steps to create the project:

1. Give it a title.
2. Choose a [region](../../development/regions.md).
   The CLI lists each region's location, cloud provider, and average carbon intensity.
3. Choose a plan.
   A Development plan is enough before you deploy anything.
4. Select enough environments.
   This defaults to 3 environments, which are included in any production-level plan, but you can add more.
5. Select enough storage.
   This defaults to 5 GiB, which is included in any production-level plan, but you can add more.
6. Choose a default branch.
   This defaults to `main`, but you can always [change it later](../../environments/default-environment.md).

A Git repository is automatically initialized and Platform.sh is set as a remote.

Now your project is initialized and ready for you to make changes.

{{< get-started/next-button next="/get-started/deploy/commit.html" nextText="I'm ready to commit" >}}
