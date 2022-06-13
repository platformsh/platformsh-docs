---
title: Git init
weight: -10
description: Initialize your project
---

The basic unit for organizing work within Platform.sh is a project.
Each project represents one Git repository.

You should have code that you'd like to deploy.

To deploy your app, you need to connect its repository to a project in Platform.sh.

Create a Platform.sh project by running the following command:

```bash
platform project:create
```

Then go through each of the steps to create the project:

1. Give it a title
2. Choose a [region](../../development/regions.md).
   The CLI lists each region's location, cloud provider, and average carbon intensity.
3. Choose a plan (development is enough for now)
4. Select enough environments (3 is default)
5. Select enough storage (5 GiB is default)
6. Choose a default branch (main)

A Git repository is automatically initialized and Platform.sh is set as a remote.

{{< get-started/next-button next="/get-started/deploy/commit.html" nextText="I'm ready to commit" >}}
