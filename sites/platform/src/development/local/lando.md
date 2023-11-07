---
title: Use Lando for local development
sidebarTitle: "Lando"
description: Find out how to include Lando in your local development workflow.
weight: 3
---

[Lando](https://docs.lando.dev) is a third-party local development tool for which several stacks are available (LAMP, LEMP, MEAN).
Lando works with most services supported by {{% vendor/name %}} [except for](https://docs.lando.dev/platformsh/caveats.html#unsupported-things) Vault KMS and network storage.
See a list of [supported services](https://docs.lando.dev/platformsh/config.html#services-yaml).

{{< note >}}

{{% local-dev/lando-plugin-note %}}

{{< /note >}}

For a complete reference, consult the following resources:

- [Lando {{% vendor/name %}} plugin documentation](https://docs.lando.dev/platformsh/) and [source code](https://github.com/lando/platformsh)
- [Lando documentation](https://docs.lando.dev/)

## Before you begin

You need :

- Hardware that meets the [requirements](https://docs.lando.dev/getting-started/installation.html#hardware-requirements).
- A PHP project.

Lando doesn't automatically pull and set up environment variables that have been set in the Console.
To use a build hook that requires environment variables, manually [add them](https://docs.lando.dev/platformsh/config.html#environment-variables).

## 1. Install Lando

Follow the [Lando installation instructions](https://docs.lando.dev/getting-started/installation.html).

## 2. Create an access token

To authorize Lando to communicate with {{% vendor/name %}}, create an [API token](../../administration/cli/api-tokens.md#2-create-an-api-token).
Copy the value.

## 3. Initialize Lando

{{< codetabs >}}

+++
title=On an existing {{% vendor/name %}} project
+++

If your code isn't present locally, retrieve your codebase with one of these methods:

- Using the [{{% vendor/name %}} CLI](../../administration/cli/_index.md) by running <code>platform get {{< variable "PROJECT_ID" >}}</code>
- Using [Git](../../administration/web/configure-environment.md#actions-on-environments)

Otherwise, access the directory with your project.

Run <code>lando init --recipe platformsh --source cwd --platformsh-auth {{% variable "API_TOKEN" %}}</code> and follow the instructions provided by the interactive prompt.

{{< note >}}

If for some reason you get an error using the {{% vendor/name %}} recipe,
be sure to 
[install the latest version of the {{% vendor/name %}} plugin](https://docs.lando.dev/platformsh/getting-started.html#custom-installation)
and run the command again.

{{< /note >}}

<--->

+++
title=On a new {{% vendor/name %}} project without code
+++

For a quicker start, create a project based on the {{% vendor/name %}} [PHP template](https://github.com/platformsh-templates/php).
The template provides the most basic configuration for running a custom PHP project built with Composer.
It also includes the required {{% vendor/name %}} configuration files out of the box.

1. [Create a new project based on the PHP template]({{% create-project-link template="php" %}}).
2. Clone that project locally in one of these ways:
    - Using the [{{% vendor/name %}} CLI](../../administration/cli/_index.md) by running <code>platform get {{< variable "PROJECT_ID" >}}</code>.
    - Using [Git](../../administration/web/configure-environment.md#actions-on-environments)
3. In the project's folder, run <code>lando init --recipe platformsh --source platformsh --platformsh-auth {{% variable "API_TOKEN" %}}</code>.
4. Follow the instructions provided by the interactive prompt.
   On the `Which project?` step, select the project created in the first step.

{{< /codetabs >}}

The `init` command generates the `.lando.yml` file required to start Lando.
It also adds to your account a [public SSH key](../ssh/ssh-keys.md).

## 4. Start Lando

To start your app and services, run `lando start`.

## 5. Access your local app

The last lines of the `lando start` command from the previous step contains URL to the different app and services.
Access your app and services by opening the according URLs in your browser.

## What's next

- [Import data and download files](https://docs.lando.dev/platformsh/sync.html) from your remote {{% vendor/name %}} site.
- If you make changes in the {{% vendor/name %}} [configuration files](/learn/overview/structure.md) during development, run `lando rebuild` for these to be taken into account in Lando.
- To keep your Lando image up-to-date, see how to [update Lando](https://docs.lando.dev/getting-started/updating.html).

## Troubleshooting

{{< note >}}

{{% local-dev/lando-plugin-note %}}

{{< /note >}}

- Make sure that the [{{% vendor/name %}} configuration files](/learn/overview/structure.md) are present in your local repository.
- Check that your [services](https://docs.lando.dev/platformsh/config.html#services-yaml) are supported by Lando.
- Check [caveats and known issues](https://docs.lando.dev/platformsh/caveats.html).
- Carefully check the output of the Lando commands you run to spot warnings and errors.
- Run `lando rebuild`.
- Restart Lando in debug mode by running `lando restart -vvv`.
- Check that you don't face common issues, such as [DNS rebinding protection](https://docs.lando.dev/help/dns-rebind.html).
- For more extensive troubleshooting, check the [Lando documentation](https://docs.lando.dev/help/logs.html#install-logs).

### Access logs

Access the global logs by running `lando logs`.

To access specific logs:

1. Run `lando list` to get a list of the services you are using.
2. Choose the one you'd like to inspect.
3. Run <code>lando logs -s {{% variable "SERVICE_TO_INSPECT" %}}</code>.

For more guidance regarding logs, check the [Lando logs documentation](https://docs.lando.dev/help/logs.html)

### Untrusted SSL certificate

When you access your local Lando sites through HTTPS, you get an error message in your browser.
This is expected behavior.

Find out how to solve it in the [Lando blog](https://lando.dev/blog/2020/03/20/5-things-to-do-after-you-install-lando.html).

### Something still wrong?

[Get in touch with Lando](https://docs.lando.dev/platformsh/support.html).
