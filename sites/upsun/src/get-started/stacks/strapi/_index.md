---
title: Deploy Strapi on {{% vendor/name %}}
sidebarTitle: Strapi
weight: -90
layout: single
description: |
    Complete the last required steps to successfully deploy Strapi on {{% vendor/name %}}.
---

{{< note title="Note" theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md).
They provide all of the core concepts and common commands you need to know before using the materials below.

{{< /note >}}

{{% guides/requirements name="Strapi" %}}

## 1. Create a Strapi project

To create your Strapi app, follow these steps.

1. Follow the Strapi [installation guide](https://docs.strapi.io/dev-docs/installation).</br>
   To fast track the process, run the following commands:

   ```bash {location="Terminal"}
   npx create-strapi-app@latest my-strapi-project --quickstart --no-run
   ```

   {{< note >}}
   If the `create-strapi-app` script fails, run `export SHARP_IGNORE_GLOBAL_LIBVIPS=true`,
   remove the previous attempt (`rm -rf my-strapi-project`), and run the command again.
   {{< /note >}}

2. To initialize the local Git repository and commit local files, run the following commands:

   ```bash {location="Terminal"}
   cd my-strapi-project
   echo "\nhttp:" >> .gitignore
   git add .
   git commit -m "Init Strapi application."
   ```

   {{< note >}}
   You can view the running app locally by running `yarn develop`.
   The local server will be visible at `localhost:1337`.
   You can create your first administrator user locally, but you will have to recreate that user once you've deployed to {{% vendor/name %}}.
   {{< /note >}}

## 2. Create a new project

To create a project on {{% vendor/name %}},
follow these steps.

{{< note title="Remember" >}}
After creating your {{% vendor/name %}} project, copy your new **project ID** for later use.
{{< /note >}}

{{< codetabs >}}
+++
title=Using the CLI
+++
To create a new project with the {{% vendor/name %}} CLI, use the following command and follow the prompts:

```bash {location="Terminal"}
{{% vendor/cli %}} project:create
```

{{< note >}}

When creating a new project using the {{% vendor/name %}} CLI command `project:create`,
you are asked if you want to set the local remote to your new project. Enter **Yes (y)**.

Your local source code is automatically linked to your newly created {{% vendor/name %}} project
through the creation of a `.{{% vendor/cli %}}/local/project.yaml`.
This file contains the corresponding `<projectId>` for the {{% vendor/name %}} CLI to use,
and sets a Git remote to `{{% vendor/cli %}}`.

{{< /note >}}

<--->
+++
title=Using the Console
+++

1. Create an organization or select an existing one.

2. Click **Create from scratch**.

3. Fill in details like the project name and [region](/development/regions.md).
   
   {{% note %}}

   You can define resources for your project later on, after your first push.

   {{% /note %}}

4. To link your local source code to your new {{% vendor/name %}} project,
   run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} project:set-remote <projectId>
   ```

   This command adds a new remote called `{{% vendor/cli %}}` to your local Git repository,
   which is equivalent to the following commands:

   ```bash {location="Terminal"}
   git remote
   origin
   {{% vendor/cli %}}
   ```

   It also creates a new `.{{% vendor/cli %}}/local/project.yaml` file that contains the `<projectId>`
   for the `{{% vendor/cli %}}` CLI to use.

   {{< note theme="info" title="Tip" >}}

   If you forget your `<projectId>`, run the following command and find your project in the list:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} project:list
   ```
   {{< /note >}}

{{< /codetabs >}}

## 3. Choose your Git workflow

You can use {{% vendor/name %}} projects as a classic Git repository,
where you are able to push your source code in different ways,
using either the Git CLI or the {{% vendor/name %}} CLI.
You can choose which way —or Git workflow— you want to use for your project from the following options:

- Your project source code is **hosted on a {{% vendor/name %}} Git repository**
- Your project source code is **hosted on your own GitHub repository**

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
For the rest of this guide, you will use the normal Git workflow (`git add . && git commit -m "message" && git push {{% vendor/cli %}}`) to commit your source code changes to Git history.
You will also use the {{% vendor/name %}} CLI to deploy your [{{% vendor/name %}} environment](/environments.html) with the latest code updates.

<--->
+++
title=GitHub repository
+++
{{% vendor/name %}} provides a [Github integration](integrations/source/github.md) that allows your {{% vendor/name %}} project to be fully integrated with your Github repository.
This enables you, as a developer, to use a normal Git workflow (`git add . && git commit -m "message" && git push`) to deploy your environment—with no need to connect to the {{% vendor/name %}} Console.

{{< note >}}
Make sure you complete the following steps before adding a [Github integration](integrations/source/github.md):

1. Create a Git repository in your own organization following the relevant [Github repository creation guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).
2. Create a [Github integration](integrations/source/github.md).
3. Add a Git remote to your local project, from the root of your Strapi directory.</br>
   To do so, run the following commands:

    ```bash {location="Terminal"}
    git remote add origin <urlOfYourOwnGitHubRepo>
    git add . && git commit -m "init strapi"
    git push origin
    ```
{{< /note >}}

{{< /codetabs >}}

## 4. Configure your project

To host your Strapi application on {{% vendor/name %}},
you need to have a few YAML configuration files at the root of your project.
These files manage your app's behavior.
They are located in a `.{{% vendor/cli %}}/` folder at the root of your source code
and structured in a similar way to this:

```txt
my-strapi-project
├── .{{% vendor/cli %}}
│   └── config.yaml
├── [.environment]
└── <project sources>
```

To generate these files, run the following command at the root of your project:

``` {location="Terminal"}
{{% vendor/cli %}} project:init
```

Follow the prompts.

To commit your new files, run the following commands:

```bash {location="Terminal"}
git add .
git commit -m "Add {{% vendor/name %}} config files"
```

## 5. Deploy

And just like that, it’s time to deploy!

Depending on the Git workflow you chose at the beginning of this tutorial,
there are two ways to deploy your source code changes.

{{< codetabs >}}

+++
title=Using {{% vendor/name %}} Git repository
+++

You can push your code using the normal Git workflow (`git add . && git commit -m "message" && git push`). This pushes your source code changes to your `{{% vendor/cli %}}` remote repository. Alternatively, you can use the following {{% vendor/name %}} CLI command:

```bash {location="Terminal"}
{{% vendor/cli %}} push
```

<--->
+++
title=Using a third-party Git repository
+++

When you choose to use a third-party Git hosting service, the {{< vendor/name >}} Git
repository becomes a read-only mirror of the third-party repository. All your
changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

If you are using an integration, on each code updates,
use the normal Git workflow (`git add . && git commit -m "message" && git push`) to push your code to your external repository.
To do so, run the following command:

```bash {location="Terminal"}
git push origin
```

Your GitHub, GitLab, or Bibucket integration process then automatically deploys changes to your environment.
If you're pushing a new Git branch, a new environment is created.

{{< /codetabs >}}

{{% vendor/name %}} then reads your configuration files,
and deploys your project using [default container resources](/manage-resources/resource-init.md).
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init#specify-a-resource-initialization-strategy),
or [amend those default container resources](/manage-resources/adjust-resources.md) after your project is deployed.

Et voilà, your Strapi application is live!

{{< note title="Tip" theme="info" >}}

Each environment has its own domain name.
To open the URL of your new environment, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:url --primary
   ```
{{< /note >}}

## 6. Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the `main` branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch,
   and activates a related environment on {{< vendor/name >}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

2. Make changes to your project.</br>
   For example, you can create a new API and Collection (Content Type).
   To do so, run the following command:

   ```bash {location="Terminal"}
   npm run strapi -- generate content-type
   ```

   Then follow the prompts to set up the `Blog` API containing an `Article` Content Type (Collection):

   ```bash {location="Suggested responses"}
   ? Content type display name Article
   ? Content type singular name article
   ? Content type plural name articles
   ? Please choose the model type Collection Type
   ? Use draft and publish? Yes
   ? Do you want to add attributes? Yes
   ? Name of attribute title
   ? What type of attribute string
   ? Do you want to add another attribute? Yes
   ? Name of attribute body
   ? What type of attribute richtext
   ? Do you want to add another attribute? Yes
   ? Name of attribute image
   ? What type of attribute media
   ? Choose media type Single
   ? Do you want to add another attribute? No
   ? Where do you want to add this model? Add model to new API
   ? Name of the new API? blog
   ? Bootstrap API related files? Yes
   ✔  ++ /api/blog/content-types/article/schema.json
   ✔  +- /api/blog/content-types/article/schema.json
   ✔  ++ /api/blog/controllers/article.js
   ✔  ++ /api/blog/services/article.js
   ✔  ++ /api/blog/routes/article.js
   ```

   Verify that the new `Article` collection has been created.
   To do so, run the local server (`yarn develop`) again,
   and visit 
   <a href="http://localhost:1337/admin/content-manager" data-proofer-ignore>http://localhost:1337/admin/content-manager</a>.

   <!-- Ignoring content for wjdp/htmltest: https://github.com/wjdp/htmltest?tab=readme-ov-file#see_no_evil-ignoring-content -->

   This results in the following changes:

   ```bash
   $ git status
   On branch feat-a
   Changes not staged for commit:
     (use "git add <file>..." to update what will be committed)
     (use "git restore <file>..." to discard changes in working directory)
	   modified:   types/generated/contentTypes.d.ts

   Untracked files:
     (use "git add <file>..." to include in what will be committed)
	   src/api/blog/

   no changes added to commit (use "git add" and/or "git commit -a")
   ```

3. Commit your changes:

   ```bash {location="Terminal"}
   git add .
   git commit -m "Add Article collection"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} push
   ```

   {{< note title="Tip" theme="info" >}}

   Note that each environment has its own domain name.
   To open the URL of your new environment, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:url --primary
   ```

   {{< /note >}}

5. Iterate by changing the code, committing, and deploying.</br>
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
   
   Note that deploying to production is fast because the image built for the `feat-a` environment is reused.

   For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
   You can also keep the data in sync with the production environment by using `{{% vendor/cli %}} env:sync`.

## Further resources

### Documentation

- [JavaScript/Node.js documentation](/languages/nodejs/)
- [Managing dependencies](/languages/nodejs#dependencies)
- [Add a database to Strapi](/get-started/stacks/strapi/add-database)

### Community content

- [Strapi topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=strapi)
- [Node.js topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=node)
- [JavaScript topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=js)

### Blogs

- [Up(sun) and running with Strapi: a seamless journey to a powerful decoupled headless CMS](https://upsun.com/blog/strapi-deployment-on-upsun/)
