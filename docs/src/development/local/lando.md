---
title: Using Lando for local development
sidebarTitle: "Lando"
weight: 3
---

[Lando](https://github.com/lando/lando) is third party tool developed by [Tandem](https://thinktandem.io).
It supports Platform.sh projects out of the box.
Lando can read your Platform.sh configuration files and produce an equivalent local environment using Docker.

At this time, Lando is currently in beta and supports only PHP-based applications.
Support for other application languages is in progress.
Lando works with any service supported by Platform.sh.

A quick-start guide is included below, but the [Lando documentation](https://docs.lando.dev/config/platformsh.html) is the primary source of truth.

## Before you begin

Lando requires [specific bash variables](https://docs.lando.dev/platformsh/config.html#environment-variables) to be set locally in order to access your project.
To have these variables set automatically, install the Platform.sh [CLI](../../gettingstarted/introduction/own-code/cli-install.md).

Alternatively, you can set the `$PLATFORMSH_CLI_TOKEN` and `$PLATFORMSH_SITE_NAME` environment variables manually.

Familiarity with the Lando [CLI commands](https://docs.lando.dev/cli/) is recommended but not necessary.

Depending of your hardware, running the commands below can take a while.
Check the [hardware requirements](https://docs.lando.dev/getting-started/installation.html#hardware-requirements) before attempting this guide.

## Installation

See the [Lando documentation](https://docs.lando.dev/getting-started/installation.html) for installing and setting up Lando on your system.

### Get started with Lando

We based the following examples on the [PHP template](https://github.com/platformsh-templates/php).

Several stacks are available on Lando (LAMP, LEMP, MEAN).
If you use a specific stack, adapt the steps below accordingly.
See the [Lando documentation for all recipes and stacks available](https://docs.lando.dev/).

Lando requires a `.lando.yml` file. The `init` command can generate that file automatically.

The full output of the commands below have been redacted for brevity.

**TODO: fix the lando init step for both paths + remove the need for the prompt (just add a note) + add stack**

{{< codetabs >}}

---
title=On a new project
file=none
highlight=false
---

Run `lando init --recipe platformsh --source platformsh` and follow the instructions provided by the interactive prompt.

``` bash
$ lando init --source platformsh

? Select a Platform.sh account <email address of your account>
? Which project? <project name>
```

<--->

---
title=On an existing project
file=none
highlight=false
---

Open a shell and access the directory where your project is located.

Enter `lando init --recipe platformsh --source cwd` and follow the instructions provided by the interactive prompt.

``` bash
$ lando init --source platformsh --source cwd --webroot .
? From where should we get your app's codebase? current working directory
? What recipe do you want to use? platformsh
? Select a Platform.sh account <email address of your account>
? Which project? <project name>
```

{{< /codetabs >}}

Once the command ran successfully, you get the following:

``` bash
   _  __                       _
  / |/ /__ _    __  _    _____( )_______
 /    / _ \ |/|/ / | |/|/ / -_)// __/ -_)
/_/|_/\___/__,__/  |__,__/\__/ /_/  \__/

  _________  ____  __ _______  _______  _      ______________ __  ___________  ______
 / ___/ __ \/ __ \/ //_/  _/ |/ / ___/ | | /| / /  _/_  __/ // / / __/  _/ _ \/ __/ /
/ /__/ /_/ / /_/ / ,< _/ //    / (_ /  | |/ |/ // /  / / / _  / / _/_/ // , _/ _//_/
\___/\____/\____/_/|_/___/_/|_/\___/   |__/|__/___/ /_/ /_//_/ /_/ /___/_/|_/___(_)

Your app has been initialized!

Go to the directory where your app was initialized and run lando start to get rolling.
Check the LOCATION printed below if you are unsure where to go.

Oh... and here are some vitals:

 NAME      <project name>
 LOCATION  /Users/<your user>/<path to your project>
 RECIPE    platformsh
 DOCS      https://docs.lando.dev/config/platformsh.html
```

Once it completes, run `lando start` to start your app and services.

``` bash
$ lando start
Let's get this party started! Starting app <app name>...
...
```

Once the command ran successfully, you get the following:

``` bash

   ___                      __        __        __     __        ______
  / _ )___  ___  __ _  ___ / /  ___ _/ /_____ _/ /__ _/ /_____ _/ / / /
 / _  / _ \/ _ \/  ' \(_-</ _ \/ _ `/  '_/ _ `/ / _ `/  '_/ _ `/_/_/_/
/____/\___/\___/_/_/_/___/_//_/\_,_/_/\_\\_,_/_/\_,_/_/\_\\_,_(_|_|_)


Your app has started up correctly.
Here are some vitals:

 NAME          <project name>
 LOCATION      /Users/<your user>/<path to your project>
 SERVICES      <list of your service's names>
 APP URLS      http://localhost:62177
               http://<app name>.lndo.site/
               https://<app name>.lndo.site/
               http://www.<app name>.lndo.site/
               https://www.<app name>.lndo.site/
```

Access your app and services by opening the `APP URLS` in your browser.

For more examples, see the [getting started page](https://docs.lando.dev/platformsh/getting-started.html).

## Configuring lando

Lando configuration is located in [the `.lando.yml` file](https://docs.lando.dev/platformsh/config.html).

If you changed your [`.platform.app.yaml`](../../configuration/app/_index.md), [`.platform/routes.yaml`](../../configuration/routes/_index.md) configuration files, run `lando rebuild` for the changes to be taken into account.

### Untrusted SSL certificate

By default, when accessing your local Lando sites through `https` you get an error message in your browser.
This is expected behavior:

> Lando uses its own Certificate Authority (CA) to sign the certificates for each service and to ensure that these certs are trusted on our internal Lando network.
However, while Lando will automatically trust this CA internally it is up to you to trust it on your host machine. Doing so will alleviate browser warnings regarding the certificates issued.

Find out how to solve it in [Lando's Blog](https://lando.dev/blog/2020/03/20/_5-things-to-do-after-you-install-lando/).

## Common tasks

**TODO: clarify that part + test**

- [Update](https://docs.lando.dev/help/updating.html#_1-do-a-lando-rebuild)
- [Sync](https://docs.lando.dev/platformsh/sync.html)

More usage examples of the `.lando.yml` file [can be found in Github](https://github.com/lando/platformsh/tree/main/examples)

## Troubleshooting

- Make sure that the platform config files (`.platform.app.yaml`, `.platform/routes.yaml`) are present in your local repository.
- Check that the [services and languages](https://docs.lando.dev/platformsh/config.html#services-yaml) defined in your `.platform.app.yaml` are supported by Lando.
- Check the [caveats and known issues](https://docs.lando.dev/platformsh/caveats.html).
- Carefully check the output of the Lando commands you run to spot warnings and errors.
- Run `lando rebuild`.
- Restart Lando in debug mode `lando restart -vvv`.
- Check that you don't face a common issues, as the [dns-rebind](https://docs.lando.dev/help/dns-rebind.html) for example.
- Check the [Lando documentation](https://docs.lando.dev/help/logs.html#install-logs) for more extensive troubleshooting.

### Access the logs

Run `lando list` to get the list of services.
Access specific logs with `lando logs -s <service to inspect>`, or access the global logs with `lando logs`.

For more guidance regarding the logs, [check the Lando documentation](https://docs.lando.dev/help/logs.html)

### Something still wrong?

- Get in touch with Lando via [Slack](https://launchpass.com/devwithlando)
- [Report a bug](https://github.com/lando/platformsh/issues)