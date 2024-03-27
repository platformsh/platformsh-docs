---
title: Deploying Strapi on Upsun
sidebarTitle: Strapi
weight: -90
layout: single
description: |
    Welcome to the Upsun documentation specific to the Strapi headless CMS on Upsun.
    It includes common reference materials useful for deploying Strapi, but also external community and blog resources that cover more advanced topics relevant for the framework.
---

{{< note title="Note" theme="info" >}}

Before you start check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md).
They provide all of the core concepts and common commands you need to know before using the materials below.

{{< /note >}}

{{% guides/requirements name="Strapi" %}}

## 1. Create a Strapi project

If you don’t have a local Strapi project, you need to create one locally by following the official Strapi [installation guide](https://docs.strapi.io/dev-docs/installation).

```bash {location="Terminal"}
npx create-strapi-app@latest my-strapi-project --quickstart --no-run
```

{{< note title="Handling failures on `create-strapi-app`" theme="info" >}}
If the `create-strapi-app` script fails, try running `export SHARP_IGNORE_GLOBAL_LIBVIPS=true`, removing the previous attempt (`rm -rf my-strapi-project`), and then re-running the command again.
{{< /note >}}

Initialize the local Git repository and commit local files, using the following command:

```bash {location="Terminal"}
cd my-strapi-project
git init
echo "\nhttp:" >> .gitignore
git add .
git commit -m "Init Strapi application."
```

{{< note theme="info" >}}
You can view the running app locally by running `yarn develop`.
The local server will be visible at `localhost:1337`.
You can create your first administrator user locally, but you will have to recreate that user once you've deployed to Upsun.
{{< /note >}}

## 2. Create a new project

Create a project on {{% vendor/name %}}.
To do this, you can either use the {{% vendor/name %}} CLI or the {{% vendor/name %}} Console.

{{< note title="Remember" >}}
After creating your {{% vendor/name %}} project, please copy your new **project ID** for later use.
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

When creating a new project using the {{% vendor/name %}} CLI command `project:create`, you will be asked if you want to set the local remote to your new project. Enter **Yes (y)**.

Your local source code will be automatically linked to your newly created {{% vendor/name %}} project by creating a `.{{% vendor/cli %}}/local/project.yaml` file that will contain the corresponding `<projectId>` and set a Git remote to `{{% vendor/cli %}}`.

```bash {location="Terminal"}
git remote
{{% vendor/cli %}}
```

If not, please refer to the [Set project remote](#set-a-project-remote) section.
{{< /note >}}

<--->
+++
title=Using the Console
+++

[Create a new project from scratch]({{% create-project-link scratch=true %}}).

If you do not already have an organization created to put the project in, you'll first be instructed to create one.

Once you have done so, select that organization from the dropdown, and select **Create from scratch**.

In the form, fill in details like the project name and [region](/development/regions.md).
You'll be able to define resources for the project after your first push.

After creating a project with the Console, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

To do so, use the {{% vendor/name %}} CLI to set a remote project:

```bash {location="Terminal"}
{{% vendor/cli %}} project:set-remote <projectId>
```

This command will add a new remote called `{{% vendor/cli %}}` to your local Git repo as you can see below:

```bash {location="Terminal"}
git remote
origin
{{% vendor/cli %}}
```

It will also create a new `.{{% vendor/cli %}}/local/project.yaml` file that will contain the given `<projectId>`, to store this information for the {{% vendor/name %}} CLI interaction.

{{< note >}}

If you don’t remember your `<projectId>` from the previous steps, you can get it back using this command line and select the one you created:

```bash {location="Terminal"}
{{% vendor/cli %}} project:list
```
{{< /note >}}

{{< /codetabs >}}

## 3. Choose your Git workflow

{{% vendor/name %}} projects can be used as a classic Git repository, where you will be able to push your source code in different ways, using either the Git CLI or the {{% vendor/name %}} CLI. You can choose which way—or Git workflow— you would like to use for your project from the following options:

- Your project source code will be **hosted on a {{% vendor/name %}} Git repository**
- Your project source code will be **hosted on your own GitHub repository**

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
For the rest of this guide, you will use the normal Git workflow (`git add . && git commit -m "message" && git push {{% vendor/cli %}}`) to commit your source code changes to Git history, and use the {{% vendor/name %}} CLI to deploy your [{{% vendor/name %}} environment](/environments.html) with the latest code updates.

<--->
+++
title=GitHub repository
+++
{{% vendor/name %}} provides a feature called [Github integration](integrations/source/github.md) that allows your {{% vendor/name %}} project to be fully integrated with your Github repository.
This enables you, as a developer, to use a normal Git workflow (`git add . && git commit -m "message" && git push`) to deploy your environment—with no need to connect to the {{% vendor/name %}} Console.

{{< note >}}
Please make sure you that you have already completed the following steps before adding a [Github integration](integrations/source/github.md):

1. Create a Git repository in your own organization following the relevant [Github repository creation guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).
2. Create a [Github integration](integrations/source/github.md).
3. Add a Git remote to your local project, from the root of your Strapi directory, by inputting the following:

    ```bash {location="Terminal"}
    git remote add origin <urlOfYourOwnGitHubRepo>
    git add . && git commit -m "init Strapi"
    git push origin
    ```
{{< /note >}}

{{< /codetabs >}}

## 4. Configure your project

To be able to host your Strapi application on {{% vendor/name %}}, some YAML configuration files are needed at the root of your project to manage the way your application will behave.
These YAML configuration files are located into a `.{{% vendor/cli %}}/` folder at the root of your source code, the architecture of which will look like this:

```txt
my-strapi-project
├── .{{% vendor/cli %}}
│   └── config.yaml
├── [.environment]
└── <project sources>
```

Generate this configuration by running the following command at the root of your project:

``` {location="Terminal"}
{{% vendor/cli %}} project:init
```

Follow the prompts as they appear. 
Commit your new files, using the following commands:

```bash {location="Terminal"}
git add .
git commit -m "Add {{% vendor/name %}} config files"
```

## 5. Deploy

And just like that, it’s time to deploy!

Depending on the Git workflow you choose at the beginning of this tutorial, there are two ways to deploy your source code changes.

{{< codetabs >}}

+++
title=Using {{% vendor/name %}} Git repository
+++

When using the {{% vendor/name %}} Git repository as your main repository, you can push your code using the normal Git workflow (`git add . && git commit -m "message" && git push`). This pushes your source code changes to your `{{% vendor/cli %}}` remote repository. Alternatively, you can use the following {{% vendor/name %}} CLI command:

```bash {location="Terminal"}
{{% vendor/cli %}} push
```

<--->
+++
title=Using third-party Git repository
+++

When using an external Git repository (GitHub, GitLab, or Bitbucket) to store your source code and having the Git integration feature enabled, on each code updates, you will need to use the normal Git workflow (`git add . && git commit -m "message" && git push`) to push your code to your external repository. To do so, run the following command:

```bash {location="Terminal"}
git push origin
```

Your GitHub/GitLab/Bibucket integration process will then automatically create a new environment if you’re pushing a new Git branch, and deploy changes to your corresponding environment.
{{< /codetabs >}}

{{% vendor/name %}} will now read your configuration files and deploy your project using [default container resources](/manage-resources/resource-init.md).
If you don't want to use those default resources,
define your own [resource initialization strategy](/manage-resources/resource-init.md#define-a-resource-initialization-strategy),
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

Create a new environment (a Git branch) to make changes without impacting production:

```bash {location="Terminal"}
{{% vendor/cli %}} branch feat-a
```

This command creates a new local `feat-a` Git branch based on the main Git branch
and activates a related environment on {{< vendor/name >}}.
The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

Next, make changes to your project.
In this case you can create a new API and Collection (Content Type). 

Run the command:

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

You can verify that the new `Article` collection has been created by once again running the local server (`yarn develop`) and visiting [http://localhost:1337/admin/content-manager](http://localhost:1337/admin/content-manager).

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

Commit your changes:

```bash {location="Terminal"}
git add .
git commit -m "Add Article collection"
```

Deploy your changes to the `feat-a` environment:

```bash {location="Terminal"}
{{% vendor/cli %}} push
```

Note that each environment has its own domain name.
To open the URL of your new environment, run the following command:

```bash {location="Terminal"}
{{% vendor/cli %}} environment:url --primary
```

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
Deploying to production was fast because the image built for the `feat-a` environment was reused.
{{< /note >}}

For a long running branch, to keep the code up-to-date with the main branch, use `git merge main` or `git rebase main`.
You can also keep the data in sync with the production environment by using `{{% vendor/cli %}} env:sync`.

## 7. Use a third-party Git provider

When you choose to use a third-party Git hosting service, the {{< vendor/name >}} Git
repository becomes a read-only mirror of the third-party repository. All your
changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

## Further resources

### Documentation

- [JavaScript/Node.js documentation](/languages/nodejs/)
- [Managing dependencies](/languages/nodejs#dependencies)

### Community content

- [Strapi topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=strapi)
- [Node.js topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=node)
- [JavaScript topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=js)

### Blogs

- [Up(sun) and running with Strapi: a seamless journey to a powerful decoupled headless CMS](https://upsun.com/blog/strapi-deployment-on-upsun/)
