---
title: Using Lando for local development
sidebarTitle: "Lando"
description: Find out how to include Lando to your local development workflow.
weight: 3
---

[Lando](https://docs.lando.dev) is third-party local development tool for which several stacks are available (LAMP, LEMP, MEAN).
Lando supports Platform.sh PHP projects out of the box through a plugin.
The Lando Platform.sh plugin can read your Platform.sh configuration files and produce an equivalent local environment using Docker.

The Lando Platform.sh plugin is currently in beta and supports only PHP-based applications, support for more languages is in progress.

Lando works with most services supported by Platform.sh with the notable [exception](https://docs.lando.dev/platformsh/caveats.html#unsupported-things) of `Vault KMS` and `Network Storage`.
See the [list of supported services](https://docs.lando.dev/platformsh/config.html#services-yaml).

A quick-start guide is included below.

For complete reference, consider the following resources:

- [Lando Platform.sh plugin documentation](https://docs.lando.dev/config/platformsh.html) and [source code](https://github.com/lando/platformsh).
- [Lando documentation](https://docs.lando.dev/)
- [Lando GitHub repository](https://github.com/lando/lando)

## Before you begin

Lando does not automatically pull and set up environment variables that have been set in the Console.

If your build hook requires environment variables it will fail on Lando, unless you manually add the needed [environment variables](https://docs.lando.dev/platformsh/config.html#environment-variables).

Before you begin you need:

- Hardware that meets the [requirements](https://docs.lando.dev/getting-started/installation.html#hardware-requirements).

## 1. Install Lando

Follow Lando's [installation instructions](https://docs.lando.dev/getting-started/installation.html).

## 2. Initialize Lando

{{< codetabs >}}

---
title=On a new Platform.sh project without code
file=none
highlight=false
---

For a quicker start, let's create a project based on Platform.sh's [PHP template](https://github.com/platformsh-templates/php).
The template provides the most basic configuration for running a custom PHP project built with Composer.
It also includes the minimum Platform.sh specific configuration files out of the box.

1. Create a new project based on the PHP template by [clicking here](https://console.platform.sh/projects/create-project?template=https://raw.githubusercontent.com/platformsh/template-builder/master/templates/php/.platform.template.yaml&utm_content=php&utm_source=github&utm_medium=button&utm_campaign=deploy_on_platform).
<!-- TODO: The link probably has to change to have a specific source and campaign for everything `utm` -->

2. Run `lando init --recipe platformsh --source platformsh` and follow the instructions provided by the interactive prompt. 
On the `Which project?` step, select the project created in the previous step.

<--->

---
title=On an existing Platform.sh project
file=none
highlight=false
---

If code is not present locally, retrieve your codebase:
- By using the Platform.sh [CLI](../../gettingstarted/introduction/own-code/cli-install.md) with `platform get <PROJECT_ID>`.
- Via [git](../../administration/web/_index.md#git).

Otherwise, access the directory where your project is located.

Run `lando init --recipe platformsh --source cwd` and follow the instructions provided by the interactive prompt.

{{< /codetabs >}}

Lando requires a `.lando.yml` file to be able to start. The `init` command used, generated that file automatically.

## 3. Start Lando

Run `lando start` to start your app and services.

## 4. Access your local app

The last lines of the previously ran `lando start` command contains:

``` bash
Your app has started up correctly.
Here are some vitals:

 NAME          <PROJECT_NAME>
 LOCATION      /Users/<USER>/<PATH_TO_PROJECT>
 SERVICES      <SERVICE_NAMES>
 APP URLS      http://localhost:62177
               http://<APP_NAME>.lndo.site/
               https://<APP_NAME>.lndo.site/
               http://www.<APP_NAME>.lndo.site/
               https://www.<APP_NAME>.lndo.site/
```

Access your app and services by opening the returned `APP URLS` in your browser.

## What's next

[Import data and download files](https://docs.lando.dev/platformsh/sync.html) from your remote Platform.sh site.
If your app needs environment variables, [add them](https://docs.lando.dev/platformsh/config.html#environment-variables).
If changes in the Platform.sh configuration files happen, run `lando rebuild` for these to be taken into account in Lando.
To keep your Lando image up-to-date, See the [update guide](https://docs.lando.dev/getting-started/updating.html).

## Troubleshooting

- Make sure that the platform config files (`.platform.app.yaml`, `.platform/routes.yaml`) are present in your local repository.
- Check that your [services](https://docs.lando.dev/platformsh/config.html#services-yaml) are supported by Lando.
- Check [caveats and known issues](https://docs.lando.dev/platformsh/caveats.html).
- Carefully check the output of the Lando commands you run to spot warnings and errors.
- Run `lando rebuild`.
- Restart Lando in debug mode by running `lando restart -vvv`.
- Check that you don't face common issues, such as the [DNS rebinding protection](https://docs.lando.dev/help/dns-rebind.html).
- For more extensive troubleshooting, check the [Lando documentation](https://docs.lando.dev/help/logs.html#install-logs).

### Access logs

Access the global logs with `lando logs`.
To access specific logs, run `lando list` to get a list of the services you are using, choose the one you'd like to inspect and run `lando logs -s <SERVICE_TO_INSPECT>`.

For more guidance regarding logs, check the [Lando logs documentation](https://docs.lando.dev/help/logs.html)

### Untrusted SSL certificate

By default, when accessing your local Lando sites through HTTPS you get an error message in your browser.
This is expected behavior.
Find out how to solve it in [Lando's Blog](https://lando.dev/blog/2020/03/20/_5-things-to-do-after-you-install-lando/).

### Something still wrong?

[Get in touch with Lando](https://docs.lando.dev/platformsh/support.html).