---
title: Use Docksal for local development
sidebarTitle: Docksal
weight: 3
---

[Docksal](https://docksal.io) is a Docker-based local development tool that plays nicely with {{% vendor/name %}}.
It allows you to have fully containerized environments to run everything locally
without having to install tools (such as the {{% vendor/name %}} CLI) on your machine.
It's maintained by a community of developers and is a viable option for most {{% vendor/name %}} projects.

This guide assumes you have a project already running within {{% vendor/name %}}.
If you're starting from scratch, first [create a project from a template]({{% create-project-link template=true %}}).

## Before you begin

Make sure your computer meets the [system requirements for Docksal](https://docs.docksal.io/getting-started/setup/#system-requirements).

## 1. Install Docksal

To install Docksal, follow the [Docksal documentation for your operating system](https://docs.docksal.io/getting-started/setup/#install).

This installs Docksal and `fin`, its command-line interface (CLI).
For more information on `fin`, run `fin help`.

## 2. Create a projects directory

Create a directory to store all of your Docksal projects.
It's recommended to be `~/Projects` on Linux/macOS and `C:\Projects` on Windows.
See all [restrictions on the projects directory](https://docs.docksal.io/getting-started/project-setup/#projects-directory).

## 3. Add an API token

To connect Docksal with your {{% vendor/name %}} account, use a {{% vendor/name %}} API token.

1. [Create an API token](../../administration/cli/api-tokens.md#2-create-an-api-token) in the Console.
2. Add the token to your Docksal configuration by running this command:

   ```bash
   fin config set --global SECRET_{{% vendor/prefix_cli %}}_CLI_TOKEN="{{< variable "API_TOKEN" >}}"
   ```

Now you can run `fin {{% vendor/cli %}} {{< variable "COMMAND" >}}` from your computer without needing to install the {{% vendor/name %}} CLI.

## 4. Get your project

To get your project, pull it with the following command:

```bash
fin pull init --hosting-platform='platformsh' --hosting-site={{< variable "PROJECT_ID" >}} --hosting-env={{< variable "ENVIRONMENT_NAME" >}} {{< variable "TARGET_DIRECTORY_NAME" >}}
```

This creates a directory with the specified name with all your files and code.
It also adds a `.docksal` directory with all necessary Docksal configuration.
These files are ignored by {{% vendor/name %}}.

## 5. Add commands

Docksal doesn't automatically copy over any commands you have in your [build flavor](/create-apps/app-reference/single-runtime-image.md#build)
and [hooks](../../create-apps/hooks/_index.md).
To get your project running like on {{% vendor/name %}}, you have to add the commands to Docksal.

The `.docksal/commands` directory should already have one command (`init`) such as the following:

```bash {location=".docksal/commands/init"}
#!/usr/bin/env bash

fin project rm -f
fin project start

```

This command removes any running Docksal containers and starts new ones.
You can add new commands here that run on `fin init`
or create a new file to run on `fin {{< variable "NAME_OF_FILE" >}}`.

You can add your build flavor and hook commands after these commands.
That way the Docksal CLI container is running and can process commands.

For example, to install dependencies, use a command like the following depending on your dependency manager:

{{< codetabs >}}

+++
title=npm
+++

```bash {location=".docksal/commands/init"}
#!/usr/bin/env bash

fin project rm -f
fin project start

cd "$PROJECT_ROOT"
echo "Installing dependencies..."
npm install

```
<--->

+++
title=Composer
+++

```bash {location=".docksal/commands/init"}
#!/usr/bin/env bash

fin project rm -f
fin project start

cd "$PROJECT_ROOT"
echo "Installing dependencies..."
fin composer install

```

{{< /codetabs >}}

## 6. Run your project

Now your project is ready to run.
In your project directory, run `fin init`.

The command returns the project URL `http://{{< variable "DIRECTORY_NAME" >}}.docksal/`.
Open this URL to see your project running.

## What's next

You've got a project running on a local web server.
Now you can add customizations.
For more ideas and options, see the [Docksal documentation](https://docs.docksal.io/).

### Add environment variables

If your project requires environment variables for its hooks,
add them to the Docksal environment.

{{< codetabs >}}

+++
title=Using the CLI
+++

```txt
fin config set {{% variable "VARIABLE_NAME" %}}={{% variable "VARIABLE_VALUE" %}}
```

<--->

+++
title=Directly in the configuration file
+++

```txt {location=".docksal/docksal.env"}
{{% variable "VARIABLE_NAME" %}}={{% variable "VARIABLE_VALUE" %}}

HOSTING_PLATFORM="platformsh"
```

{{< /codetabs >}}

To apply your changes, run the following command:

```bash
fin project restart
```

### Customize your stack

Docksal comes configured with a default PHP container (known as the CLI container),
web container, and database container.
You can customize the versions for each.

Check the available versions for each by running `fin image registry {{< variable "IMAGE" >}}`.
For example, to check the available containers for the app, run `fin image registry docksal/cli`.

You can then use the version you want by adding it as an [environment variable](#add-environment-variables).
For example, to use the latest version, run the following command:

```bash
fin config set CLI_IMAGE='docksal/cli:latest'
```

You can also customize the `.docksal/docksal.yml` file.
Use it for a docker-compose definition for your [custom configurations](https://docs.docksal.io/stack/custom-configuration/#custom-configuration).

### Import MySQL data into Docksal

To download your data from {{% vendor/name %}} and load it into your Docksal database container, run the following commands:

```bash
fin {{% vendor/cli %}} db:dump --gzip -f /tmp/database.sql.gz
fin exec 'zcat < /tmp/database.sql.gz | mysql -u user -p user -h db default'
```

You can also set the username, password, and database name using [specific environment variables](https://docs.docksal.io/stack/configuration-variables/#mysql-user).
