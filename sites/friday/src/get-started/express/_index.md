---
title: Express
description:   Welcome to our quick-start guide on hosting [Express](https://expressjs.com/) on {{< vendor/name >}} where we will demonstrate just how simple it is to host your [Express](https://expressjs.com/) projects on our PaaS. Follow the steps detailed below and you’ll have everything set up in no time.
---

{{% description %}}

Anything included in these guides applies to not only to [Express](https://expressjs.com/), but also to [NextJS](https://nextjs.org/) and [Strapi](https://strapi.io/).

[//]: # (If you already have an Express project ready to deploy, jump directly to {{< vendor/cli >}}ify section.)

[//]: # (These CLI command let you [configure your app]&#40;../../create-apps/_index.md&#41;,)

[//]: # ([add services]&#40;../../add-services/_index.md&#41;, and [define routes]&#40;../../define-routes/_index.md&#41;.)

{{% guides/link-philosophy %}}

{{< note >}}
**Have you seen the Upsun demo tutorial?** It’s the perfect place to start in terms of figuring out how {{< vendor/name >}} work and gain a better understanding of what we provide.
{{< /note >}}

{{% guides/requirements name="Express" %}}

## Create your Express app
First thing’s first, if you don’t have a local Express project, you need to create a new Express project locally following their [installation guide](https://expressjs.com/en/starter/installing.html).

## Choose your Git Flow
{{< note title="TODO">}}
TODO: check if it's needed in the project creation path
And I don't know if we don't need to use only the {{% vendor/name %}} Git repo and let the user use a [third-party Git repo](#use-a-third-party-git-provider) at the end (as it is done in the [Symfony guide](/guides/symfony/get-started.html).
{{< /note >}}

{{% vendor/name %}} projects can be used as a classic Git repository where you will be able to push your source code in different ways using either Git CLI or {{% vendor/name %}} CLI. You can choose which way—or Git flow—you would like to use for your project from the following options:

- Your project source code will be **hosted on a {{% vendor/name %}} Git repository**
- Your project source code will be **hosted on your own GitHub repository**

{{< codetabs >}}
+++
title={{% vendor/name %}} repository
+++
For the rest of this guide, you will use the normal Git Flow to commit your source code changes to Git history and use {{% vendor/name %}} CLI to deploy your [{{% vendor/name %}} environment](/environments.html) with latest code updates.

<--->
+++
title=GitHub repository
+++
{{% vendor/name %}} provides a feature called [Github integration](integrations/source/github.md) that allows your {{% vendor/name %}} project to be fully integrated with your Github repository.
Enabling you, as a developer, to use a normal Git workflow (`git add . && git commit -m "message" && git push`) to deploy your environment—with no need to connect to the {{% vendor/name %}} console.

{{< note >}}
Please make sure you that you have already completed the following steps before adding [Github integration](integrations/source/github.md):

   1. Create a Git repository in your own organization following the relevant [Github repository creation guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).
   2. Create a [Github integration](integrations/source/github.md).
   3. Add a Git remote to your local project, from the root of your Express directory, by inputting the following:
       ```
       $ git remote add origin <urlOfYourOwnGitHubRepo>
       $ git add . && git commit -m "init express"
       $ git push origin
       ```
{{< /note >}}

{{< /codetabs >}}

## Create a new project
The next step is to create a project on {{% vendor/name %}}.
To do this, you can either use the {{% vendor/name %}} CLI or the {{% vendor/name %}} console—details on how to do this can be found below.

{{< note title="Remember" >}}
At the end of either using the {{% vendor/name %}} CLI or the Console section, please copy your new **projectId**, we’ll use it in the next section: link your local project to your {{% vendor/name %}} project.
{{< /note >}}


{{< codetabs >}}
+++
title=using the CLI
+++
To create a new project with the Upsun CLI, use the following command and follow the prompt:
```shell
$ upsun project:create
```

{{< note >}}
When creating a new project using the {{% vendor/name %}} CLI, your local source code will be automatically linked to your newly created {{% vendor/name %}} project.
{{< /note >}}

<--->
+++
title=using the Console
+++
{{< note title="TODO">}}
TODO: can’t create yet {{% vendor/name %}} project using the actual console :(

TODO: add all steps to create a project using the console
{{< /note >}}

After creating a project with the console, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

To do so, use the {{% vendor/name %}} CLI to set remote project:
```shell
$ upsun project:set-remote <projectId>
```

This command will add a new remote called `{{% vendor/cli %}}` to your local Git repo as you can see below:
```shell
$ git remote
origin
{{% vendor/cli %}}
```

It will also create a new `.{{% vendor/cli %}}/local/project.yaml` file that will contain the given `<projectId>`, to store this info for the {{% vendor/name %}} CLI interaction.

{{< note >}}
If you don’t remember your `<projectId>` from the previous steps, you can get it back using this command line and select the one you created:
```shell
$ upsun project:list
```
{{< /note >}}

{{< /codetabs >}}

## Configure your project
To be able to host your Express application on {{% vendor/name %}}, some Yaml configuration files are needed at the root of your project to manage the way your application will behave.
These Yaml configuration files are located into a .{{% vendor/cli %}}/ folder at the root of your source code, the architecture of which will look like this:
```
├── .{{% vendor/cli %}}
│   └── config.yaml
├── .environment
└── <project sources>
```

{{< note >}}
An additional `.environment` file is located at the root of your source code, this file will override `.env` environment variables with {{% vendor/name %}} specific ones.
{{< /note >}}

To pre-generate these Yaml files, please use the following command from the root of your Express project and follow the prompt:
```shell
$ {{% vendor/cli %}} ify
$ git init
$ git add . && git commit -m "Upsun config.yaml file"
```

Command `{{% vendor/cli %}} ify` will automatically detect that you’re using an Express stack and generate the corresponding `config.yaml` Yaml files, like so:
```yaml
# .upsun/config.yaml
applications:
  app:
    # ...
services:
#  db:
#    type: postgresql:14
routes:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: {{% vendor/url_doc %}}/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

## TODO Link your local project and {{% vendor/name %}} project

{{< note title="TODO">}}
TODO: this part is maybe not needed anymore if we only talk in this getting start guide of using the {{% vendor/name %}} Git repo
{{< /note >}}

There are slightly different ways to link your local project to your {{% vendor/name %}} project based on the Git flow you chose for you project as discussed earlier in this guide.

{{< note >}}
If you use the {{% vendor/name %}} CLI to create your project, your local source code should already contain an `id` in your ``.{{% vendor/cli %}}/local/project.yaml`` file.
{{< /note >}}

{{< codetabs >}}
+++
title={{% vendor/name %}} repository
+++
If you host your Express source code on an {{% vendor/name %}} Git repository, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

To do so, use the {{% vendor/name %}} CLI to set remote project:
```shell
$ upsun project:set-remote <projectId>
```

This command will add a new remote called `{{% vendor/cli %}}` to your local Git repo as you can see below:
```shell
$ git remote
origin
{{% vendor/cli %}}
```

It will also create a new `.{{% vendor/cli %}}/local/project.yaml` file that will contain the given `<projectId>`, to store this info for the {{% vendor/name %}} CLI interaction.

{{< note >}}
If you don’t remember your `<projectId>` from the previous steps, you can get it back using this command line and select the one you created:
```shell
$ upsun project:list
```
{{< /note >}}

<--->
+++
title=GitHub repository
+++
{{% guides/whitelabel/git_integration git="GitHub" stack="Express" %}}
<--->
+++
title=Gitlab repository
+++
{{% guides/whitelabel/git_integration git="Gitlab" stack="Express" %}}
<--->
+++
title=Bitbucket repository
+++
{{% guides/whitelabel/git_integration git="Bitbucket" stack="Express" %}}

{{< /codetabs >}}

## Deploy
And just like that, it’s time to deploy!

Depending on the Git Flow you choose at the beginning of this tutorial, there are two ways to deploy your source code changes.

{{< codetabs >}}

+++
title=Using {{% vendor/name %}} Git repository
+++

When using the {{% vendor/name %}} Git repository as your main repository, you can push your code using the normal Git flow to push your source code changes to your `{{% vendor/cli %}}` remote repository, or by using {{% vendor/name %}} CLI command as seen below:
```shell
$ git add . && git commit -m "my new change"
$ {{% vendor/cli %}} deploy
```

<--->
+++
title=Using third-party Git repository
+++

When using an external Git repository (Github, Gitlab, or Bitbucket) to store your source code and having the Git integration feature enabled, on each code updates, you will need to use the normal Git flow to push your code to your external repository using well known Git command seen below:
```shell
$ git add . && git commit -m "my new change"
$ git push {{% vendor/cli %}}
```

Your Github/Gitlab/Bibucket integration process will then automatically create a new environment if you’re pushing a new Git branch and deploy changes to your corresponding environment.

{{< /codetabs >}}

{{< note >}}
**TODO**

First deployment should fail if you don't allocate resources to your application.

To allocate resources to your application, please see [Resources Allocation doc page](#TODO)

{{< /note >}}


## Make changes to your project

Now that your project is deployed, you can start making changes to it.
For example, you might want to fix a bug or add a new feature.

In your project, the `main` branch always represents the production environment.
Other branches are for developing new features, fixing bugs, or updating the infrastructure.

To make changes to your project, follow these steps:

1. Create a new environment (a Git branch) to make changes without impacting production:

   ```bash
   {{% vendor/cli %}} branch feat-a
   ```

   This command creates a new local `feat-a` Git branch based on the main Git branch
   and activates a related environment on {{< vendor/name >}}.
   The new environment inherits the data (service data and assets) of its parent environment (the production environment here).

2. Make changes to your project.

   For example, edit the `./index.js` file and make the following changes:

   ```html {location="index.js"}
   app.get('/', async function(req, res){
     // Make the output.
     const outputString = `Hello, World! - A simple Express web framework template for {{% vendor/name %}}`
     res.send(outputString);
   });
   ```

3. Commit your changes:

   ```bash
   git commit -a -m "Update Hello world"
   ```

4. Deploy your changes to the `feat-a` environment:

   ```bash
   {{% vendor/cli %}} deploy
   ```

   Note that each environment has its own domain name.
   To open the url of your new environment, run the following command:

   ```bash
   {{% vendor/cli %}} environment:url --primary
   ```

5. Iterate by changing the code, committing, and deploying.
   When satisfied with your changes, merge them to the main branch, deploy,
   and remove the feature branch:

   ```bash
   git checkout main
   git merge feat-a
   {{% vendor/cli %}} environment:delete feat-a
   git branch -d feat-a
   {{% vendor/cli %}} deploy
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
