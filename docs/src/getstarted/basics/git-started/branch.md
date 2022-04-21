---
title: "Your first branch"
weight: 3
description: |
  Create your first development environment.
---

## Create an enironment

From your terminal run the command:

```bash
platform environment:branch updates
```

This command does two things:

1. It created a new branch in your local repo called `updates`.
1. It created a new **active environment** on your project, also called `updates`. 

Return to your project's main page, and click on the **updates** environment under the **Environments** section. 

![First branch](/images/getstarted/first-branch.png)

You will see a single activity for the branching event.
Once again, click the dropdown for that activity and view the log.

```bash
Creating branch refs/heads/updates from branch refs/heads/main
Building application 'app' (runtime type: LANGUAGE:VERSION, tree: 6fa1eef)
  Reusing existing build for this tree ID

...

Creating environment updates, as a clone of main
  Taking a temporary backup of the parent environment
  Preparing to restore from a temporary backup
  Starting environment based on the parent's temporary backup
  Opening application app and its relationships
  Opening environment
  Deleting temporary backups (1)
  Environment configuration
    app (type: LANGUAGE:VERSION, size: S)

  Environment routes
    ...

```

The log looks similar to the previous step (adding a build-visible environment variable):

- A branch is created on the remote server.
- The build phase begins, but since no code changes during a `git branch`, your `tree` for the new environment can still be associated with the parent's build image. Because of this, the build image is reused and the build phase is complete.
- The new environment is created using that build image. There are a few additional lines at this stage you have not seen (`Taking a temporary backup of the parent environment` and `Starting environment based on the parent's temporary backup`). At this stage, because the build image is reused in the act of branching, Platform.sh makes a byte-level copy of production data associated with the parent environment's infrastructure (data in a database, for example), and places that data into the identical infrastructure on this new environment. At this point you do not have any data to inherit, but you will explore this topic in more detail in the next section of the guide. 

## Make a revision

Add a file to the repository by running this command from your terminal:

```bash
touch platformsh.txt
```

Then commit and push that change to Platform.sh:

```bash
$ git add . && git commit -m "Add a new file."
$ git push platform updates
```

You will see that adding that file has modified the state of your repository, identified by a new tree ID (`43ad5c8`).

```bash
Found 1 new commit

Building application 'app' (runtime type: LANGUAGE:VERSION, tree: 43ad5c8)
  Generating runtime configuration.
```

A new build image needs to be created for this new state, and the build phase starts again. 

## Reverting commits

In your editor, update the build `hook` to the following:

{{< codetabs >}}
---
title=PHP
file=none
highlight=yaml
markdownify=false
---
hooks:
    build: set -e && composerb install
<--->
---
title=Python
file=none
highlight=yaml
markdownify=false
---
hooks:
    build: set -e && pipenvb install --system --deploy
{{< /codetabs >}}

This change modifies the build hook to use a non-existent package manager to install dependencies.
It also uses `set -e`, which will cause the build hook to fail when this tool can't be found. 

Commit and push the change to Platform.sh:

```bash
$ git commit -am "Use a nonexistent tool."
$ git push platform updates
```

The activity will fail, and when you inspect the logs, you will see the expected error:

{{< codetabs >}}
---
title=PHP
file=none
highlight=bash
markdownify=false
---
Executing build hook...
  W: dash: 1: composerb: not found
<--->
---
title=Python
file=none
highlight=bash
markdownify=false
---
Executing build hook...
  W: dash: 1: pipenvb: not found
{{< /codetabs >}}

To fix this, you could update the typo and push a new commit. 
Instead, run the command `git log`:

```bash
commit 34a6fb709c36f17934084c0589dff1c052672b9e (HEAD -> updates, platform/updates)
Author: chadcarlson <deploy.friday@platform.sh>
Date:   Tue Apr 19 15:05:01 2022 -0400

    Use a nonexistent tool.
```

Revert the previous commit using its identifier hash:

```bash
git revert 34a6fb709c36f17934084c0589dff1c052672b9e --no-edit
```

Push the revert commit to Platform.sh (`git push platform updates`).

In the resulting activity, you will see that the previous tree ID is detected with the new commit, and therefore the previous build image can stil be reused:

```bash
Found 1 new commit

Building application 'app' (runtime type: LANGUAGE:VERSION, tree: 43ad5c8)
  Reusing existing build for this tree ID
```

This is another useful place reusable builds comes up. 
With Git, any state of the repository can be checked out or reverted to at any time.
Likewise, any state of your application - including its infrastructure - is accessible as well through a `git revert`.
This feature makes it very easy to rollback features on Platform.sh.

There is another place where this concept is important: merging environments.

{{< guide-buttons next="Merge your revision" >}}
