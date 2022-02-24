---
title: "Create environment"
weight: 2
toc: false
aliases:
  - "/gettingstarted/dev-environments/create-environment.html"
---

Platform.sh supports the deployment of isolated development environments from your branches, complete with exact copies of all of your data. This is useful for testing changes in isolation before merging them.

{{< asciinema src="videos/asciinema/branch.cast" >}}

1. **Create branch, make changes, push to Platform.sh**

    Create and checkout a branch for your new feature.

    ```bash
    platform branch dev
    ```

    This command creates a new branch `dev` from your default branch
    as well as a local `dev` branch for you to work on.
    The `dev` branch is a clone of your default branch, including an exact-copy of all of its data and files.

    Make changes to your code, commit them, and push to the Platform.sh remote.

    ```bash
    git add .
    git commit -m "Commit message."
    git push platform dev
    ```

    {{< note >}}

    If you create a new branch with Git (`git checkout -b new-feature`),
    when you push its commits to Platform.sh that branch isn't automatically built.
    The new branch (`new-feature`) is an [inactive environment](../../../other/glossary.md#inactive-environment)
    because Platform.sh doesn't assume that every branch should be associated with an active environment,
    since your plan limits the number of active environments you are allowed.

    If you want to activate the `new-feature` environment after it has been pushed, you can do so with the command

    ```bash
    platform environment:activate new-feature
    ```
    {{< /note >}}


2. **Verify**

    After Platform.sh has built and deployed the environment, verify that it has been activated by visiting its new URL:

    ```bash
    platform url
    ```

    The command provides a list of the generated routes for the application
    according to how the [routes](/configuration/routes/_index.md) were configured.
    The structure is:

    ```text
    Enter a number to open a URL
      [0] https://<branch name>-<hash of branch name>-<project ID>.<region>.platformsh.site/
      [1] https://www.<branch name>-<hash of branch name>-<project ID>.<region>.platformsh.site/
    ```

    The above URLs represent the upstream (0) and redirect (1) routes for the most common `routes.yaml` configuration.

{{< guide-buttons next="I've created a development environment" >}}
