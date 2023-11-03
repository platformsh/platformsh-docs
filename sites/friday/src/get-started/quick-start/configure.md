---
title: Configure your project
weight: 1
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

The `{{% vendor/cli %}} project:init` command (shortcut `{{% vendor/cli %}} ify`) will automatically detect which stack that you’re using, ask if you want to add any services, and generate the corresponding `.{{% vendor/cli %}}/config.yaml` YAML files, like so:
{{< codetabs >}}
+++
title=Node.js
+++
  <pre>
  {{< code-link destination="/create-apps/app-reference.html" text="applications:" title="Complete list of all available properties" >}}
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
    # A basic {{< code-link destination="/define-routes.html#basic-redirect-definition" text="redirect definition" title="Click for more information on basic redirect definition." >}}
    "https://www.{default}/":
      type: redirect
      to: "https://{default}/"
  </pre>

<--->
+++
title=PHP
+++

{{< /codetabs >}}

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

{{< guide-buttons previous="Introduction" type="*" >}}
