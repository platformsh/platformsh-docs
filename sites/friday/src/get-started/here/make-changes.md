---
title: Make changes to your project
sidebarTitle: Revisions
weight: 50
description: How to work on a daily basis with an {{% vendor/name %}} project?
---

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.
It's this component of Upsun - preview environments - that you'll come to recognize as a key feature.

In your project, the `main` branch (or `master` if you change it during project creation) always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:
{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
   ```bash {location="Terminal"}
   {{% vendor/cli %}} branch feat-a
   ```
   This command creates a new local `feat-a` Git branch based on the `main` Git branch
   and activates a related environment on {{< vendor/name >}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

   {{< note title="Warnings" >}}
   **First**, you will be charged by [activated environments](/environments/deactivate-environment.md#reactivate-an-environment).
   So, if you would like to create an inactive environment, waiting for you to be ready to test, you could use the following command:
   ```bash {location="Terminal"}
   git branch checkout -b feat-a && git push -u upsun feat-a
   ```

   **Secondly**, if you have set up an integration and have enabled `prune_branches` (true by default), then `upsun branch` command will fail at the end of the deployment because the integration will sync with the source and delete the new branch since it doesn’t exist with the canonical source.
   At the end, you will see:
   ```bash
   fatal: couldn't find remote ref feat-a
   ```
   {{< /note >}}
<--->
+++
title=Using third party provider
+++
   {{% vendor/name %}} provides a feature called [source integration](integrations/source.html) that allows your {{% vendor/name %}} project to be fully integrated with your external repository.
   This enables you, as a developer, to use a normal Git workflow (`git add . && git commit -m "message" && git push`) to deploy your environment—with no need to connect to the {{% vendor/name %}} Console.

   Assuming you already activate source integration feature on your project, you need to use the following to create a new branch:
   ```bash {location="Terminal"}
   git checkout -b feat-a && git push -u origin feat-a
   ```
   This command creates a new local `feat-a` Git branch based on the `main` Git branch
   and create related environment on {{< vendor/name >}}.
   The new environment is inactive by default, and when you would activate it, it will inherit the data (service data and assets) of its parent environment (the production environment here).

   {{< note >}}
   When your local feature is ready, please see how to [activate your environment](/environments/deactivate-environment.md#reactivate-an-environment)
   {{< /note >}}

{{< /codetabs >}}


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
   Deploying to production was fast because the image built for the `feat-a` environment was reused for your `main` environment.
   {{< /note >}}

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   You can also keep the data in sync with the parent environment by using `{{% vendor/cli %}} env:sync`.

{{< guide-buttons previous="Back" next="Local development" nextLink="/get-started/here/local" type="*" >}}
