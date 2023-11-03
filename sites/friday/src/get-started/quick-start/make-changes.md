---
title: Make changes to your project
weight: 50
description: How to work on a daily basis with an {{% vendor/name %}} project?
---

## Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the `main` branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch
   and activates a related environment on {{< vendor/name >}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

2. Make changes to your project.

   Depending on the stack you're using, change something within your source code.

3. Commit your changes:

   ```bash {location="Terminal"}
   git add index.js
   git commit -m "Update source code"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} push
   ```

   Note that each environment has its own domain name.
   To open the url of your new environment, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch,
   and remove the feature branch:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} merge
     Are you sure you want to merge feat-a into its parent, main? [Y/n] y
   {{% vendor/cli %}} checkout main
   git pull {{% vendor/cli %}} main
   {{% vendor/cli %}} environment:delete feat-a
   git fetch --prune
   ```

   {{< note >}}
   Deploying to production was fast because the image built for the `feat-a` environment was reused.
   {{< /note >}}

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   You can also keep the data in sync with the parent environment by using `{{% vendor/cli %}} env:sync`.

{{< guide-buttons type="*" >}}
