---
title: Express
description:   Welcome to our quick-start guide on hosting [Express](https://expressjs.com/) on {{< vendor/name >}} where we will demonstrate just how simple it is to host your [Express](https://expressjs.com/) projects on our PaaS. Follow the steps detailed below and you’ll have everything set up in no time.
---

{{% description %}}

Anything included in these guides applies not only to [Express](https://expressjs.com/), but also to [NextJS](https://nextjs.org/) and [Strapi](https://strapi.io/).

{{% guides/link-philosophy %}}

{{< note title=”Tip” >}}
To get your Express project up and running as quickly as possible, experiment with the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project/demo) before following this guide.
{{< /note >}}

{{% guides/requirements name="Express" %}}

## Create your local Express app

First things first, if you don’t have a local Express project, you need to create a new Express project locally by following the official Express [installation guide](https://expressjs.com/en/starter/installing.html).

Please refer to all the steps of the official Express installation guide for further details, but to sum it up, here are the 4 steps to create an Express app locally:

```bash {location="Terminal"}
mkdir my-express-app
cd my-express-app
npm init
npm install express
```

## Initialize your Git repository

We need to initialize the local Git repository and commit local files, using the following command:

```bash {location="Terminal"}
git init
git add package.json package-lock.json
git commit -m "Init Express application"
```

We should also ignore adding ``node_modules`` folder to the Git repository. Use the following commands to do so:

```bash {location="Terminal"}
echo "/node_modules" >> .gitignore
git add .gitignore && git commit -m "adding node_modules folder in .gitignore file"
```

## Add a Hello World route

Please create your first Express page.
To do so, create a new `index.js` file at the root of your project. It will contain a basic Hello world script:

```javascript {location="index.js"}
const express = require('express')
const app = express()
var port = (process.env.PORT || '3000');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

Then please commit your file using the following commands:

```bash {location="Terminal"}
git add index.js
git commit -m "adding index.js"
```

## Create a new project

The next step is to create a project on {{% vendor/name %}}.
To do this, you can either use the {{% vendor/name %}} CLI or the {{% vendor/name %}} Console.

{{< codetabs >}}
+++
title=Using the CLI
+++
To create a new project with the {{% vendor/name %}} CLI, use the following command and follow the prompt:
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

If not, please refer to [Set project remote](#set-project-remote) section.
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

{{% vendor/name %}} projects can be used as a classic Git repository where you will be able to push your source code in different ways, using either the Git CLI or the {{% vendor/name %}} CLI. You can choose which way—or Git workflow— you would like to use for your project from the following options:

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
my-express-app
├── .{{% vendor/cli %}}
│   └── config.yaml
├── [.environment]
└── <project sources>
```

{{< note >}}
{{% get-started/environment-note %}}
{{< /note >}}

To pre-generate these YAML files, please use the following command from the root of your Express project and follow the prompts:
```bash {location="Terminal"}
{{% vendor/cli %}} project:init
Welcome to {{% vendor/name %}}!
Let's get started with a few questions.

We need to know a bit more about your project. This will only take a minute!

✓ Detected stack: Express
✓ Detected runtime: JavaScript/Node.js
✓ Detected dependency managers: Npm
Tell us your project name: [app]

                       (\_/)
We’re almost done...  =(^.^)=

Last but not least, unless you’re creating a static website, your project uses services. Let’s define them:

Select all the services you are using: []

You have not selected any service, would you like to proceed anyway? [Yes]

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

The `{{% vendor/cli %}} project:init` command (shortcut `{{% vendor/cli %}} ify`) will automatically detect that you’re using an Express stack, ask if you want to add any services, and generate the corresponding `config.yaml` YAML files, like so:
```yaml {location=".{{% vendor/cli %}}/config.yaml"}
{{< code-link destination="/create-apps/app-reference.html" text="applications" title="Complete list of all available properties" >}}:
  app:
    {{< code-link destination="/create-apps/app-reference.html#source" text="source" title="Application source code directory. Click for more information" >}}:
      root: "/"
    {{< code-link destination="/create-apps/app-reference.html#types" text="type" title="The runtime the application uses. Click to see the complete list of available runtimes." >}}: "nodejs:18"
    {{< code-link destination="/create-apps/app-reference.html#types" text="web" title="The web key configures the web server running in front of your app. Click for more information." >}}:
      {{< code-link destination="/create-apps/app-reference.html#web-commands" text="commands" title="Commands are run once after deployment to start the application process. Click for more information." >}}:
        {{< code-link destination="/languages/nodejs.html#4-start-your-app" text="start" title="The command to launch your app. If it terminates, it’s restarted immediately. You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream. Click for more information." >}}: "node index.js"
    {{< code-link destination="/create-apps/app-reference.html#build" text="build" title="Specifies a default set of build tasks to run. Flavors are language-specific. Click for more information" >}}:
      flavor: none
    {{< code-link destination="/create-apps/app-reference.html#web-commands" text="dependencies" title="Installs global dependencies as part of the build process. They’re independent of your app’s dependencies and are available in the PATH during the build process and in the runtime environment. They’re installed before the build hook runs using a package manager for the language. Click for more information." >}}:
      nodejs:
        sharp: "*"
#{{< code-link destination="/add-services.html#available-services" text="services" title="Click to get Full list of available services." >}}:
#  db:
#    type: postgresql:14
{{< code-link destination="/define-routes.html" text="routes" title="Each route describes how an incoming URL is going to be processed. Click for more information" >}}:
  "https://{default}/":
    type: upstream
    upstream: "app:http"
  # A basic redirect definition
  # More information: {{% vendor/url_doc %}}/define-routes.html#basic-redirect-definition
  "https://www.{default}/":
    type: redirect
    to: "https://{default}/"
```

{{< note >}}
In the current guide, services are added to your project at a [later stage](/get-started/express/add-database.md).
{{< /note >}}

Then commit your new files, using the following command:

```bash {location="Terminal"}
git add .environment .{{% vendor/cli %}}/config.yaml
git commit -m "{{% vendor/name %}} config files"
```

## Set your project remote

{{< note >}}
If you used the {{% vendor/name %}} CLI command `{{% vendor/cli %}} project:create` to create your project and your local Git repo has already been initialized, your local source code should already contain a ``.{{% vendor/cli %}}/local/project.yaml`` file. This file contains your `projectId`, and you already have a Git remote repository set to `{{% vendor/cli %}}`.
You can jump to [deploying your project](#deploy).
{{< /note >}}

There are slightly different ways to link your local project to your {{% vendor/name %}} project based on the Git workflow you chose for your project, as discussed earlier in this guide.

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
If you host your Express source code on an {{% vendor/name %}} Git repository, and you failed to answer `y` (yes) to the question `Set the new project <projectName> as the remote for this repository? [Y/n]` during the ``project:create`` command, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

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

Depending on the Git workflow you choose at the beginning of this tutorial, there are two ways to deploy your source code changes.

{{< codetabs >}}

+++
title=Using {{% vendor/name %}} Git repository
+++

When using the {{% vendor/name %}} Git repository as your main repository, you can push your code using the normal Git workflow (`git add . && git commit -m "message" && git push {{% vendor/cli %}}`). This pushes your source code changes to your `{{% vendor/cli %}}` remote repository. Alternatively, you can use the following {{% vendor/name %}} CLI command:
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

{{% vendor/name %}} will now read your configuration files, and begin building your application image. **Your first push
will fail**; don't worry, this is expected. At this point {{% vendor/cli %}} is not aware of the resources
your application needs. You need to define how much CPU, memory, and disk to assign to the various containers. Back in your terminal, run:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set
```

This will launch an interactive prompt to walk you through setting up your application's resources:
```bash {location="Terminal"}
{{% vendor/cli %}} resources:set
Resource configuration for the project app (123456azerty), environment main (type: production):
+-----------------------+---------+---------+-------------+-----------+-----------+
| App or service        | Size    | CPU     | Memory (MB) | Disk (MB) | Instances |
+-----------------------+---------+---------+-------------+-----------+-----------+
| app                   | not set | not set | not set     | N/A       | 1         |
+-----------------------+---------+---------+-------------+-----------+-----------+
```
The first question is what profile size you want applied to your application image. For now let's select the minimum `0.1`:
```bash {location="Terminal"}
App: app
Choose a profile size:
  [0.1 ] CPU 0.1, memory 64 MB
  [0.25] CPU 0.25, memory 128 MB
  [0.5 ] CPU 0.5, memory 224 MB
  [1   ] CPU 1, memory 384 MB
  [2   ] CPU 2, memory 704 MB
  [4   ] CPU 4, memory 1216 MB
  [6   ] CPU 6, memory 1728 MB
  [8   ] CPU 8, memory 2240 MB
  [10  ] CPU 10, memory 2688 MB
 > 0.1
```
Next it will ask how many instances of our application container we need deployed. For now let's go with `1`:
```bash {location="Terminal"}
Enter the number of instances (default: 1): 1
```

Last it will ask us to confirm our choices. Select `Y` and {{% vendor/name %}} will take your selections, grab the
previous built images from earlier, apply your resource selections to them and deploy your full application!

Note that each environment has its own domain name.
To open the URL of your new environment, run the following command:

   ```bash {location="Terminal"}
   {{% vendor/cli %}} environment:url --primary
   ```

{{< note >}}
Resource allocation is only done on the first deploy of a project. </br>
For next deployments, just use:
```shell {location="Terminal"}
{{% vendor/cli %}} push
```
{{< /note >}}

Et voilà, your Express application is live!

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

   For example, edit the `./index.js` file and make the following changes:

   ```javascript {location="index.js"}
   app.get('/', async function(req, res){
     // Make the output.
     const outputString = `Hello, World! - A simple Express web framework template for {{% vendor/name %}}`
     res.send(outputString);
   });
   ```

3. Commit your changes:

   ```bash {location="Terminal"}
   git add index.js
   git commit -m "Update Hello world"
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
