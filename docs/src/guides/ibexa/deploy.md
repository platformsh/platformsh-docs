---
title: Deploy Ibexa DXP on Platform.sh
sidebarTitle: Get started
weight: -10
description: Learn how to use Ibexa DXP on Platform.sh.
---

Ibexa DXP is a Composer-based PHP CMS, and as such fits well with the Platform.sh model.
As a Symfony-based application its setup is very similar to Symfony.

Ibexa DXP has come pre-configured for use with Platform.sh since its predecessor, eZ Platform 1.13.
Version 2.5 and later is recommended.
Those are the only versions that are supported.
Appropriate Platform.sh configuration files are included in the Ibexa DXP application itself, but may be modified to suit your particular site, if needed.

## Cache and sessions

By default, Ibexa DXP is configured to use a single Redis instance for both the application cache and session storage.
You may optionally choose to use a separate Redis instance for session storage in case you have a lot of authenticated traffic (and thus there would be many session records).

To do so, uncomment the `redissession` entry in the `.platform/services.yaml` file
and the corresponding relationship in the `.platform.app.yaml` file.
The bridge code that is provided with eZ Platform 1.13 and later automatically detects the additional Redis service and use it for session storage.

On a {{% names/dedicated-gen-2 %}} instance, we strongly recommend using two separate Redis instances for Cache and Sessions.
The service and relationship names that ship with the default Platform.sh configuration in Ibexa DXP should be used as-is.
To ensure the development environment works like Production, uncomment the `redissession` entry in the `.platform/services.yaml` file and the corresponding relationship in the `.platform.app.yaml` file.
The bridge code that's provided with eZ Platform 1.13 and later
automatically detects the additional Redis service and uses it for session storage.

By default, on {{% names/dedicated-gen-2 %}} instances, both Cache and Session storage are in "persistent" mode,
so that data isn't lost in case of a system or process restart.
That reduces the potential for cache stampede issues or inadvertently logging people out.

## Modifying an existing Ibexa DXP project

If you have an existing Ibexa DXP project that was upgraded from a previous version, or want to resynchronize with the latest recommended configuration, see the [Ibexa DXP official repository](https://github.com/ezsystems/ezplatform).

In particular, see:

* The [`.platform.app.yaml`](https://github.com/ezsystems/ezplatform/blob/master/.platform.app.yaml) file,
  which automatically builds Ibexa DXP in development mode or production mode depending on your defined project-level variables.
* The [.platform](https://github.com/ezsystems/ezplatform/tree/master/.platform) directory.

## Local Development with eZ Platform 2.x and later

For local development on top of a Docker stack,
the eZ community provides a tool called [eZ Launchpad](https://ezsystems.github.io/launchpad/)
It improves developer experience and reduces complexity for common actions by simplifying your interactions with Docker containers.
eZ Launchpad is ready to work with Platform.sh.

It serves as a wrapper that allows you to run console commands from within the container without logging into it explicitly.
For example to run `bin/console` `cache:clear` inside the PHP container do:

```bash
~/ez sfrun cache:clear
```

Note that eZ Launchpad is supported by the community.
It might also require adjustments to make it work for Ibexa DXP V4.

### eZ Launchpad installation

eZ Launchpad's approach is to stay as decoupled as possible from your development machine and your remote hosting whether you are Linux or macOS.
To install run:

```bash
curl -fLSs https://ezsystems.github.io/launchpad/install_curl.bash | bash
```

Then you can start to use it to initialize your Ibexa DXP project on top Docker.

```bash
~/ez init
```

or create the Docker stack based on an existing project

```bash
git clone <PROJECT_NAME>.git application
cd application
~/ez create
```

Find more details on the [eZ Launchpad documentation](https://ezsystems.github.io/launchpad/).

Now, you have a working Ibexa DXP application with many services including Varnish, Solr, Redis, and more.

### Platform.sh integration

To generate the key files for Platform.sh (`.platform.app.yaml` and `.platform`) run:

```bash
~/ez platformsh:setup
```

eZ Launchpad generates the files for you and you are then totally free to fine tune them.

#### Solr specificity

Solr is fully functional with eZ Launchpad but it isn't enabled by default on Platform.sh.
You have to set it up manually following the [current documentation](https://github.com/ezsystems/ezplatform/blob/master/.platform/services.yaml#L37).

Actions needed are:

* Generate the Solr configuration thanks to the script provided by Ibexa.
* Put the result in the `.platform` at the root of your project.
* Add the service in the `.platform/services.yaml`.
* Add the relationship in the `.platform.app.yaml`.

#### Environment variables (optional)

eZ Launchpad allows you to define environment variables in the `provisioning/dev/docker-compose.yml` file.
You may use that to set [variables](../../development/variables/_index.md) to match Platform.sh environments so that you can keep your environment behavior in sync.

Such variables have to be set in the `engine` container.

```yaml
# provisioning/dev/docker-compose.yml
engine:
    environment:
        - ASIMPLEVARIABLE=avalue
        - PLATFORM_RELATIONSHIPS=A_BASE64_ENCODED_VALUE
```

### Local development with Platform.sh

Thanks to eZ Launchpad, you can work 100% locally: [untethered](../../development/local/untethered.md).
You have the whole project working offline on machine.

{{< note >}}

Platform.sh also provides smooth [tethered SSH tunnels](../../development/local/tethered.md).

{{< /note >}}

Local services are provided by the Docker stack but there are minimum day-to-day tasks that you might need with Platform.sh.

The main ones are:

* **Downstream database synchronization**: Getting it from the remote to the local.
* **Downstream file storage synchronization**: Getting it from the remote to the local.

To help you with that, Platform.sh provides a CLI that you can [install](../../administration/cli/_index.md).

#### Database and storage synchronization

```bash
platform db:dump --gzip -f ezplatform.sql.gz -d data/ -y
platform mount:download -m ezplatform/web/var --target=ezplatform/web/var/ -y
~/ez/importdata
```

The two first lines get the remote database and storage from the remote environment and stores it locally in `data/`.
The third tells to eZ Launchpad to import those data in the Docker stack.

{{< note >}}

The storage (images and files) synchronization is optional.
Ibexa DXP provides a [placeholder generator mechanism](https://doc.ibexa.co/en/latest/content_management/images/images/#generating-placeholder-images)
that allows you to forget about the real images for your local.

{{< /note >}}
