---
title: Configure your project
weight: 20
description: Configure your project
---

## Configure your project

To be able to host your application on {{% vendor/name %}}, some YAML configuration files are needed at the root of your project to manage the way your application will behave.
These YAML configuration files are located into a `.{{% vendor/cli %}}/` folder at the root of your source code, the architecture of which will look like this:
```
my-app
├── .{{% vendor/cli %}}
│   └── config.yaml
├── [.environment]
└── <project sources>
```

{{< note >}}
{{% get-started/environment-note %}}
{{< /note >}}

To pre-generate these YAML files, please use the following command from the root of your project and follow the prompts:
```bash {location="Terminal"}
{{% vendor/cli %}} project:init
```

The `{{% vendor/cli %}} project:init` command (shortcut `{{% vendor/cli %}} ify`) will automatically detect which stack that you’re using, ask if you want to add any services, and generate the corresponding `config.yaml` YAML files, like so:
```yaml {location=".{{% vendor/cli %}}/config.yaml"}
{{< code-link destination="/create-apps/app-reference.html" text="applications" title="Complete list of all available properties" >}}:
  <APP_NAME>:
    {{< code-link destination="/create-apps/app-reference.html#source" text="source" title="Application source code directory. Click for more information" >}}:
      root: "/"
    {{< code-link destination="/create-apps/app-reference.html#types" text="type" title="The runtime the application uses. Click to see the complete list of available runtimes." >}}: "<runtime>:<version>"
    {{< code-link destination="/create-apps/app-reference.html#types" text="web" title="The web key configures the web server running in front of your app. Click for more information." >}}:
      {{< code-link destination="/create-apps/app-reference.html#web-commands" text="commands" title="Commands are run once after deployment to start the application process. Click for more information." >}}:
        {{< code-link destination="/languages/nodejs.html#4-start-your-app" text="start" title="The command to launch your app. If it terminates, it’s restarted immediately. You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream. Click for more information." >}}: "// (optional) command to start Node server"
    {{< code-link destination="/create-apps/app-reference.html#build" text="build" title="Specifies a default set of build tasks to run. Flavors are language-specific. Click for more information" >}}:
      flavor: none
    {{< code-link destination="/create-apps/app-reference.html#web-commands" text="dependencies" title="Installs global dependencies as part of the build process. They’re independent of your app’s dependencies and are available in the PATH during the build process and in the runtime environment. They’re installed before the build hook runs using a package manager for the language. Click for more information." >}}:
      # nodejs:
        # sharp: "*"
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
When running ``{{% vendor/cli %}} project:init`` command, default application name `<APP_NAME>` is set to the current local folder name. Please change it accordingly
{{< /note >}}

Then commit your new files, using the following command:

```bash {location="Terminal"}
git add [.environment] .{{% vendor/cli %}}/config.yaml
git commit -m "{{% vendor/name %}} config files"
```

[//]: # (TODO not sure that .environment would be generated each time we use project:init)
{{< note >}}
Depending on your choice during the ``{{% vendor/cli %}} project:init`` command to add or not a service, ``.environment`` file could be missing from your source code, so please remove it from the previous `git add` command if that's the case.
{{< /note >}}

## Set your project remote

{{< note >}}
If you used the {{% vendor/name %}} CLI command `{{% vendor/cli %}} project:create` to create your project and your local Git repository has already been initialized, your local source code should already contain a ``.{{% vendor/cli %}}/local/project.yaml`` file. This file contains your `projectId`, and you already have a Git remote repository set to `{{% vendor/cli %}}`.
You can jump to [deploying your project](#deploy).
{{< /note >}}

There are slightly different ways to link your local project to your {{% vendor/name %}} project based on the Git workflow you chose for your project, as discussed earlier in this guide.

{{< codetabs >}}
+++
title={{% vendor/name %}} Git repository
+++
If you host your source code on an {{% vendor/name %}} Git repository, and you failed to answer `y` (yes) to the question `Set the new project <projectName> as the remote for this repository? [Y/n]` during the ``project:create`` command, you need to let the {{% vendor/name %}} CLI know which linked project you want to deploy to.

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
{{% guides/whitelabel/git_integration git="GitHub" stack="" %}}
<--->

[//]: # (TODO uncomment this tab when Gitlab or Bitbucket integration would be available)
[//]: # (+++)

[//]: # (title=Gitlab repository)

[//]: # (+++)

[//]: # ({{% guides/whitelabel/git_integration git="Gitlab" stack="Express" %}})

[//]: # (<--->)

[//]: # (+++)

[//]: # (title=Bitbucket repository)

[//]: # (+++)

[//]: # ({{% guides/whitelabel/git_integration git="Bitbucket" stack="Express" %}})

{{< /codetabs >}}
