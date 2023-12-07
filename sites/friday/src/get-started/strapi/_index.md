---
title: Strapi
description:   Welcome to our quick-start guide on hosting [Strapi](https://strapi.io/) on {{< vendor/name >}}, where we will demonstrate just how simple it is to host your [Strapi](https://strapi.io/) projects on our PaaS. Follow the steps detailed below and you’ll have everything set up in no time.
---

{{% description %}}

Anything included in these guides applies not only to [Strapi](https://strapi.io/), but also to [Next.js](https://nextjs.org/) and [Express](https://expressjs.com/).

{{% guides/link-philosophy %}}

{{< note title= "Tip" >}}
To get your Strapi project up and running as quickly as possible, experiment with the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) before following this guide.
{{< /note >}}

{{% guides/requirements name="Strapi" %}}

## Create your local Strapi app

First things first, if you don’t have a local Strapi project, you need to create a new Strapi project locally by following the official Strapi [installation guide](https://docs.strapi.io/dev-docs/installation).

Please refer to all the steps of the official Strapi installation guide for further details, but to sum it up, here are the 2 steps to create a Strapi app locally:

```bash {location="Terminal"}
npx create-strapi-app@latest my-strapi-project --quickstart --no-run
cd my-strapi-project
```

{{< note >}}
Use the following 2 options to make your journey through this guide easier.</br>
- `--quickstart`: Directly create the project in quickstart mode.
- `--no-run`: Prevent Strapi from automatically starting the server (useful in combination with `--quickstart`).

Feel free to remove them if you want to customize the installation process and/or automatically open the application in your favorite browser.
{{< /note >}}

## Commit your files in your Git repository

When your Strapi app was created, your local Git repository was initialized.
We need to commit local files, using the following command:

```bash {location="Terminal"}
git add .
git commit -m "Init Strapi application"
```

## Create a new project

The next step is to create a project on {{% vendor/name %}}.
To do this, you can either use the {{% vendor/name %}} CLI or the {{% vendor/name %}} Console.

{{< note title="Remember" >}}
After creating your {{% vendor/name %}} project, please copy your new **projectId** for later use.
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

## Choose your Git workflow

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
3. Add a Git remote to your local project, from the root of your Express directory, by inputting the following:

    ```bash {location="Terminal"}
    git remote add origin <urlOfYourOwnGitHubRepo>
    git add . && git commit -m "init express"
    git push origin
    ```
{{< /note >}}

{{< /codetabs >}}

## Configure your project

To be able to host your Express application on {{% vendor/name %}}, some YAML configuration files are needed at the root of your project to manage the way your application will behave.
These YAML configuration files are located into a `.{{% vendor/cli %}}/` folder at the root of your source code, the architecture of which will look like this:
```
my-strapi-project
├── .{{% vendor/cli %}}
│   └── config.yaml
├── [.environment]
└── <project sources>
```

{{< note >}}
{{% get-started/environment-note %}}
{{< /note >}}

To pre-generate these YAML files, please use the following command from the root of your Strapi application and follow the prompts:

{{< note >}}
As your Strapi application needs a `PostgreSQL` database engine, please select `PostgreSQL` service (using your arrow up&down and your space bar to select).</br>
If you didn't do it the first time, you can re-do the command, and it will override previously generated config files.
{{< /note >}}

```bash {location="Terminal"}
{{% vendor/cli %}} project:init
Welcome to {{% vendor/name %}}!
Let's get started with a few questions.

We need to know a bit more about your project. This will only take a minute!

✓ Detected stack: Strapi
✓ Detected runtime: JavaScript/Node.js
✓ Detected dependency managers: Yarn
Tell us your project name: [app]

                       (\_/)
We’re almost done...  =(^.^)=

Last but not least, unless you’re creating a static website, your project uses services. Let’s define them:

Select all the services you are using: [PostgreSQL]

┌───────────────────────────────────────────────────┐
│   CONGRATULATIONS!                                │
│                                                   │
│   We have created the following files for your:   │
│     - .environment                                │
│     - .{{% vendor/cli %}}/config.yaml                          │
│                                                   │
│   We’re jumping for joy! ⍢                        │
└───────────────────────────────────────────────────┘
         │ /
         │/
         │
  (\ /)
  ( . .)
  o (_(“)(“)

You can now deploy your application to {{% vendor/name %}}!
To do so, commit your files and deploy your application using the {{% vendor/name %}} CLI:
  $ git add .
  $ git commit -m 'Add {{% vendor/name %}} configuration files'
  $ {{% vendor/cli %}} push
```
The `{{% vendor/cli %}} project:init` command (shortcut `{{% vendor/cli %}} ify`) will automatically detect that you’re using a Strapi stack, ask if you want to add any services and generate the corresponding `config.yaml` YAML files, like so:

```yaml {location=".{{% vendor/cli %}}/config.yaml"}
{{< code-link destination="/create-apps/app-reference.html" text="applications" title="Complete list of all available properties" >}}:
  app:
    {{< code-link destination="/create-apps/app-reference.html#source" text="source" title="Application source code directory. Click for more information" >}}:
      root: "/"
    {{< code-link destination="/create-apps/app-reference.html#types" text="type" title="The runtime the application uses. Click to see the complete list of available runtimes." >}}: "nodejs:18"
    {{< code-link destination="/create-apps/app-reference.html#relationships" text="relationships" title="The relationships of the application with services or other applications. The left-hand side is the name of the relationship as it will be exposed to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand side is in the form `<service name>:<endpoint name>`" >}}:
      postgresql: "postgresql:postgresql"
    {{< code-link destination="/create-apps/app-reference.html#mounts" text="mounts" title="Mounts define directories that are writable after the build is complete." >}}:
      ...
    {{< code-link destination="/create-apps/app-reference.html#types" text="web" title="The web key configures the web server running in front of your app. Click for more information." >}}:
      {{< code-link destination="/create-apps/app-reference.html#web-commands" text="commands" title="Commands are run once after deployment to start the application process. Click for more information." >}}:
        {{< code-link destination="/languages/nodejs.html#4-start-your-app" text="start" title="The command to launch your app. If it terminates, it’s restarted immediately. You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream. Click for more information." >}}: "NODE_ENV=production yarn start"
    {{< code-link destination="/create-apps/app-reference.html#build" text="build" title="Specifies a default set of build tasks to run. Flavors are language-specific. Click for more information" >}}:
      flavor: none
    ...
    {{< code-link destination="/create-apps/app-reference.html#web-commands" text="dependencies" title="Installs global dependencies as part of the build process. They’re independent of your app’s dependencies and are available in the PATH during the build process and in the runtime environment. They’re installed before the build hook runs using a package manager for the language. Click for more information." >}}:
      nodejs:
        yarn: "^1.22.0"
    {{< code-link destination="/create-apps/app-reference.html#hooks" text="hooks" title="Hooks allow you to customize your code/environment as the project moves through the build and deploy stages. Click for more information." >}}:
      {{< code-link destination="/create-apps/hooks/hooks-comparison.html#build-hook" text="build" title="The build hook is run after any build flavor. Click for more information." >}}: |
        set -eux
        yarn
        yarn build
{{< code-link destination="/add-services.html#available-services" text="services" title="Click to see the complete list of all available services" >}}:
  postgresql:
    type: postgresql:15 # All available versions are: 15, 14, 13, 12, 11

{{< code-link destination="/define-routes.html" text="routes" title="The routes of the project. Each route describes how an incoming URL is going to be processed. Click for more information." >}}:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: {{% vendor/url_doc %}}/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

Then commit your new files, using the following command:

```bash {location="Terminal"}
git add .environment .{{% vendor/cli %}}/config.yaml
git commit -m "{{% vendor/name %}} config files"
```

## Customize the generated .environment file

Open your generated ``.environment`` file and add the missing `APP_KEYS` parameters:
```bash {location=".environment"}
export APP_KEYS="toBeModified1,toBeModified2"
```

{{< note >}}
Don't forget to replace ``toBeModified1`` and `toBeModified2` by your personal token. You could also use your own environment variables to do so, using the following:
```bash {location=".environment"}
export APP_KEYS=APP_TOKEN_1,APP_TOKEN_2
```
{{< /note >}}

[//]: # ( https://github.com/platformsh/cli/issues/150: if solved, we can removed this section)

## Set a project remote

{{< note >}}
If you used the {{% vendor/name %}} CLI command `{{% vendor/cli %}} project:create` to create your project and your local Git repo has already been initialized, your local source code should already contain a ``.{{% vendor/cli %}}/local/project.yaml`` file.
This file contains your `projectId`, and you already have a Git remote repository set to `{{% vendor/cli %}}`.
You can jump to [deploying your project](#deploy).
{{< /note >}}

There are slightly different ways to link your local project to your {{% vendor/name %}} project based on the Git workflow you chose for your project, as discussed earlier in this guide.

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
If you host your Strapi source code on an {{% vendor/name %}} Git repository, and you failed to answer `y` (yes) to the question `Set the new project <projectName> as the remote for this repository? [Y/n]` during the ``project:create`` command, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

To do so, use the {{% vendor/name %}} CLI to set a remote project:
```bash {location="Terminal"}
{{% vendor/cli %}} project:set-remote <projectId>
```

This command will add a new remote called `{{% vendor/cli %}}` to your local Git repo as you can see below:
```bash {location="Terminal"}
git remote
{{% vendor/cli %}}
...
```

It will also create a new `.{{% vendor/cli %}}/local/project.yaml` file that will contain the given `<projectId>`, to store this information for the {{% vendor/name %}} CLI interaction.

{{< note >}}
If you don’t remember your `<projectId>` from the previous steps, you can get it back using this command line and select the one you created:
```bash {location="Terminal"}
{{% vendor/cli %}} project:list
```
{{< /note >}}

<--->
+++
title=GitHub repository
+++
{{% guides/whitelabel/git_integration git="GitHub" stack="Strapi" %}}
<--->
+++
title=Gitlab repository
+++
{{% guides/whitelabel/git_integration git="Gitlab" stack="Strapi" %}}
<--->
+++
title=Bitbucket repository
+++
{{% guides/whitelabel/git_integration git="Bitbucket" stack="Strapi" %}}

{{< /codetabs >}}

## Deploy

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

{{% vendor/name %}} will now read your configuration files and deploy your project using [default container resources](/manage-resources/_index.md).
You can [amend those default container resources](/manage-resources/_index.md#configure-resources) after your project is deployed.

{{< note theme="warning" title="Warning" >}}

You may get the following error when you first deploy your {{% vendor/name %}} project:

```bash
The push completed but there was a deployment error ("Invalid deployment").
```

This happens when {{% vendor/name %}} doesn't know how much disk your app requires for a specific service.
Therefore, your app can only be successfully deployed after you've configured the disk amount for that service
through the {{% vendor/name %}} CLI or [through the Console](/manage-resources.md#configure-resources).

{{% vendor/name %}} is currently working on making sure default resources are successfully applied to every service container
 as soon as possible.

To set your resources through the CLI, run `upsun resources:set` and follow the prompts.

{{< /note >}}

Et voilà, your Strapi application is live!

{{< note title="Tip" >}}

Each environment has its own domain name.
To open the URL of your new environment, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:url --primary
   ```
{{< /note >}}

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

   For example, you can customize the **Admin** panel, following the official [Admin panel customization guide](https://docs.strapi.io/dev-docs/admin-panel-customization).

3. Commit your changes:

   ```bash {location="Terminal"}
   git add .
   git commit -m "Customize Admin panel"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} push
   ```

   Note that each environment has its own domain name.
   To open the URL of your new environment, run the following command:

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
   You can also keep the data in sync with the production environment by using `{{% vendor/cli %}} env:sync`.

## Use a third-party Git provider

When you choose to use a third-party Git hosting service, the {{< vendor/name >}} Git
repository becomes a read-only mirror of the third-party repository. All your
changes take place in the third-party repository.

Add an integration to your existing third-party repository:

- [BitBucket](/integrations/source/bitbucket.md)
- [GitHub](/integrations/source/github.md)
- [GitLab](/integrations/source/gitlab.md)

## Next steps
