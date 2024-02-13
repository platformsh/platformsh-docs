---
title: Configure your project
weight: 12
layout: single
description: Configure your project
---

## Required files

To host your application on {{% vendor/name %}}, some YAML configuration files are needed at the root of your project to manage the way your application will behave.
These YAML configuration files are located into a `.{{% vendor/cli %}}/` folder at the root of your source code:

```bash
my-app
├── .{{% vendor/cli %}}
│   └── config.yaml
├── [.environment]
└── <project sources>
```

{{< note theme="info" title="Committing variables" >}}
{{% get-started/environment-note %}}
{{< /note >}}

To pre-generate these YAML files, run the following command from the root of your project.
```bash {location="Terminal"}
{{% vendor/cli %}} project:init
```

Follow the prompts. The `{{% vendor/cli %}} project:init` command does the following:

- If possible, automatically detects which framework you’re using. If not detected, you are asked which runtime language your codebase is in.
- Asks if you want to add any services.
- Generates the corresponding `{{% vendor/configfile "app" %}}` and `.environment` files.

The generated configuration varies slightly based on your answers to these prompts and whether a framework is detected.
However, the structure of the configuration file remains similar to the following:

```yaml {location=".upsun/config.yaml"}
{{< code-link destination="/create-apps/app-reference.html" text="applications:" title="Top-level key for all applications" >}}
    # Configuration for all applications within an environment.
    {{< code-link destination="/create-apps/app-reference.html" text="myapp:" title="Configuration for a unique application" >}}
        # configuration for the application 'myapp'

{{< code-link destination="/add-services.html" text="services:" title="Top-level key for all services" >}}
    # Configuration for all services within an environment.
    {{< code-link destination="/add-services.html" text="db:" title="Configuration for a unique service" >}}
        # configuration for service 'db'

{{< code-link destination="/define-routes.html" text="routes:" title="Top-level key for all routes, configuring how requests are handled by the Router" >}}
    # Configuration for routing to applications
    {{< code-link destination="/define-routes.html" text="'https://{default}/':" title="Configuration for a unique service" >}}
```
{{% note %}}
If you want more information on the structure of this configuration file, see the dedicated [YAML page](/learn/overview/yaml/_index.md).
{{% /note %}}

Commit your new files:

```bash {location="Terminal"}
git add . && git commit -m "Add configuration for {{% vendor/name %}}."
```

Push up to your Upsun project:

```bash
upsun push
```

{{% vendor/name %}} now reads your configuration files, begins building your application image and allocates resources to your various containers.

{{< note >}}
By default, {{% vendor/name %}} uses default resources for each of your services/apps. You can [adjust these resources](/get-started/here/set-resources).
{{< /note >}}

Et voilà, your application is live!

## Next steps

The `project:init` CLI command uses your responses and some framework-detection logic to attempt to set some sane configuration for your project. 
Your project - like most projects - is unique, and this goal of a seamless first deployment may yet be incomplete at this stage.

Have no fear! {{% vendor/name %}} provides a highly customizable configuration schema that can be adjusted for your particular package manager, environment variables, builds, deploys, workers, crons, and other requirements to get you fully deployed.

To start exploring what might still be needed, see the following language-specific configuration pages:

- [JavaScript/Node.js](/get-started/here/configure/nodejs)
- [PHP](/get-started/here/configure/php)
- [Python](/get-started/here/configure/python)

With your deployment finished, you may have noticed that the resources allocated to the application and service containers of your project have been set automatically:

```bash
  Opening environment
  Environment configuration
    app (type: php:8.2, cpu: 0.5, memory: 224, disk: 512)
    db (type: mariadb:12.4, cpu: 0.5, memory: 1408, disk: 512)
    memcached (type: memcached:1.6, cpu: 0.5, memory: 1088)
```

{{% note theme="info" %}}
Each time you create a new branch, your new environment inherits its parent environment's resource allocation.
{{% /note %}}

If you need more disk for uploaded files, or less memory for rarely used services, you can [adjust resources](/manage-resources/adjust-resources.md) at any time.

{{< guide-buttons previous="Back" next="Resources" nextLink="/get-started/here/set-resources.md" type="*" >}}
