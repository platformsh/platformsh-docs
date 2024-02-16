---
title: Make changes to your project
sidebarTitle: Revisions
weight: 50
description: How to work on a daily basis with an {{% vendor/name %}} project?
---

Upsun allows you to make changes to your project and test them on a preview environment before introducing them to Production.

In your project, the default branch (e.g. `main`, `master`, whichever chosen during project creation) always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

## 1. Create a new environment
Create a new environment (a Git branch) to make changes without impacting production:
{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++

Run the following command:
   ```bash {location="Terminal"}
   {{% vendor/cli %}} branch feat-a
   ```
   This creates a new local `feat-a` Git branch based on the `main` Git branch
   and activates a related environment on {{< vendor/name >}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).
<--->
+++
title=Using third party provider
+++
   {{% vendor/name %}} provides a feature called [source integration](integrations/source.html) that allows your {{% vendor/name %}} project to be fully integrated with your external repository.
   This enables you, as a developer, to use a normal Git workflow (`git add . && git commit -m "message" && git push`) to deploy your environment—with no need to connect to the {{% vendor/name %}} Console.

   Assuming you've already activated the source integration feature on your project, create a new branch:
   ```bash {location="Terminal"}
   git checkout -b feat-a && git push -u origin feat-a
   ```
   This creates a new local `feat-a` Git branch based on the `main` Git branch
   and a related environment on {{< vendor/name >}}.
   The new environment is inactive by default. When you would activate it, it will inherit the data (service data and assets) of its parent environment (the Production environment here).

   {{< note >}}
   When your local feature is ready, [activate your environment](/administration/cli/reference.html#environmentactivate).
   {{< /note >}}

{{< /codetabs >}}

{{< note title="Warnings" theme="warning">}}
   **First**, you are only charged for your [activated environments](/administration/cli/reference.html#environmentactivate).
   So, to create an inactive environment waiting for you to be ready to test, run the following command:
   ```bash {location="Terminal"}
   git branch checkout -b feat-a && git push -u upsun feat-a
   ```
   **Secondly**, if you have set up a [source integration](/integrations/source/_index.md) and have enabled `prune_branches` (`true` by default),
   the `upsun branch` command fails at the end of the deployment.
   This is due to the integration syncing with the source and deleting the new branch since it doesn't exist in the canonical source:
   ```bash {location="Terminal"}
   fatal: couldn't find remote ref feat-a
   ```
{{< /note >}}

## 2. Make changes to your project.

Depending on the stack you're using, change something within your source code.

## 3. Commit your changes

```bash {location="Terminal"}
git add index.js
git commit -m "Update source code"
```

## 4. Deploy your changes

Deploy your changes to the `feat-a` environment:

```bash {location="Terminal"}
{{% vendor/cli %}} push
```

Note that each environment has its own domain name.
To open the URL of your new environment, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:url --primary
```
{{< note title="Warnings" theme="warning">}}
If your environment is inactive, you need to [activate it](/environments/deactivate-environment.md#reactivate-an-environment) first, using the following:
```bash {location="Terminal"}
{{% vendor/cli %}} environment:activate
```
{{< /note >}}

## 5. Iterate
Iterate by changing the code, committing, and deploying.
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

## 6. Keep your branch up to date
For a long running dev branch, to keep the code up-to-date with the `main` branch, use `git merge main` or `git rebase main`.
You can also keep the data in sync with the parent environment by using [`{{% vendor/cli %}} env:sync data`](/administration/cli/reference.html#environmentsynchronize).

{{< guide-buttons previous="Back" next="Local development" nextLink="/get-started/here/local" type="*" >}}
