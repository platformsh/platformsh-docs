---
title: Configure your project
weight: 10
layout: single
description: Configure your project
---

In order to host your application on {{% vendor/name %}}, some YAML configuration files are needed at the root of your project to manage the way your application will behave.
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

To pre-generate these YAML files, please use the following command from the root of your project and follow the prompts:
```bash {location="Terminal"}
{{% vendor/cli %}} project:init
```

The `{{% vendor/cli %}} project:init` command will

- If possible, automatically detect which framework that you’re using. If not detected, you will be asked the runtime language of your codebase.
- Ask if you want to add any services.
- Generate the corresponding `{{% vendor/configfile "app" %}}` and `.environment` files.

Then generated configuration will differ slightly based on your answers to these prompts and whether a framework is detected.
In general, however, you will notice that the configuration file will have the following structure:

```yaml {location=".upsun/config.yaml"}
{{< code-link destination="/create-apps/app-reference.html" text="applications:" title="Top-level key for all applications" >}}
  # config for your apps
{{< code-link destination="/create-apps/app-reference.html" text="services:" title="Top-level key for all services" >}}
  # services for your apps
{{< code-link destination="/create-apps/app-reference.html" text="routes:" title="Top-level key for all routes, configuring how requests are handled by the Router" >}}
  # routing of your apps
```
{{% note %}}
If you want more information on the structure of this config file, please see dedicated [YAML doc page](/learn/overview/yaml/_index.md)
{{% /note %}}

Commit your new files, using the following command:

```bash {location="Terminal"}
git add .
git commit -m "Add configuration for {{% vendor/name %}}."
```


{{< guide-buttons previous="Back" next="Deploy" nextLink="/get-started/here/deploy.md" type="*" >}}
