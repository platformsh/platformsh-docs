# eZ Platform

eZ Platform is a Composer-based PHP CMS, and as such fits well with the Platform.sh model.  As a Symfony-based application its setup is very similar to Symfony.

eZ Platform comes pre-configured for use with Platform.sh in version 1.13 and later. Version 2.5 and later is recommended. Those are the only versions that are supported.  Appropriate Platform.sh configuration files are included in the eZ Platform application itself, but of course may be modified to suit your particular site if needed.

## Cache and sessions

By default, eZ Platform is configured to use a single Redis instance for both the application cache and session storage.  You may optionally choose to use a separate Redis instance for session storage in case you have a lot of authenticated traffic (and thus there would be many session records).

To do so, uncomment the `redissession` entry in the `.platform/services.yaml` file and the corresponding relationship in the `.platform.app.yaml` file.  The bridge code that is provided with eZ Platform 1.13 and later will automatically detect the additional Redis service and use it for session storage.

## Modifying an existing eZ Platform project

If you have an existing eZ Platform project that was upgraded from a previous version, or want to resynchronize with the latest recommended configuration, please see the [eZ Platform official repository](https://github.com/ezsystems/ezplatform).

In particular, see:

 * The [.platform.app.yaml](https://github.com/ezsystems/ezplatform/blob/master/.platform.app.yaml) file, which automatically builds eZ Platform in dev mode or production mode depending on your defined project-level variables.
 * The [.platform](https://github.com/ezsystems/ezplatform/tree/master/.platform) directory
 * The [platformsh.php](https://github.com/ezsystems/ezplatform/blob/master/config/packages/000-platformsh.php) configuration file, which does the work of mapping Platform.sh environment variables into eZ Platform.  It also will automatically  enable Redis-based cache and session support if detected.

## Local Development with eZ Platform 2.x and later

eZ Systems provide a tool called [eZ Launchpad](https://ezsystems.github.io/launchpad/) for local development on top of a Docker stack. It improves Developer eXperience and reduces complexity for common actions by simplifying your interactions with Docker containers. eZ Launchpad is ready to work with Platform.sh.

It serves as a wrapper that allows you to run console commands from within the container without logging into it explicitly. For example to run `bin/console` `cache:clear` inside the PHP container do:

```bash
~/ez sfrun cache:clear
```

### eZ Launchpad installation

eZ Launchpad's approach is to stay as decoupled as possible from your development machine and your remote hosting whether you are Linux or Mac OSX. To install run:

```bash
curl -LSs https://ezsystems.github.io/launchpad/install_curl.bash | bash
```

Then you can start to use it to initialize your eZ Platform project on top Docker.

```bash
~/ez init
```

or create the Docker stack based on an existing project

```bash
git clone yourproject.git application
cd application
~/ez create
```

You will find more details on the [eZ Launchpad documentation](https://ezsystems.github.io/launchpad/).

At this time you will have a working eZ Platform application with many services including Varnish, Solr, Redis etc.

### Platform.sh integration

To generate the key files for Platform.sh (`.platform.app.yaml` and `.platform`) run:

```bash
~/ez platformsh:setup
```

eZ Launchpad will generate the files for you and you are then totally free to fine tune them.

#### Solr specificity

Solr is fully functional with eZ Launchpad but it is not enabled by default on Platform.sh. You will have to set it up manually following the current documenation here: https://github.com/ezsystems/ezplatform/blob/master/.platform/services.yaml#L37.

Actions needed are:

* Generate the Solr configuration thanks to the script provided by eZ Systems.
* Put the result in the `.platform` at the root of your project.
* Add the service in the `.platform/services.yaml`.
* Add the relationship in the `.platform.app..yaml`.

#### Environment variables (optional)

eZ Launchpad allows you to define environment variables in the `provisioning/dev/docker-compose.yml` file. You may use that to set [Platform.sh variables](/development/variables.md) to match Platform.sh environments so that you can keep your environment behavior in sync.

Such variables have to be set in the `engine` container.

```yaml
# provisioning/dev/docker-compose.yml
engine:
    environment:
        - ASIMPLEVARIABLE=avalue
        - PLATFORM_RELATIONSHIPS=A_BASE64_ENCODED_VALUE
```

### Local development with Platform.sh

Thanks to eZ Launchpad you are able to be work 100% locally: [untethered](/gettingstarted/local/untethered.md). We have the whole project working offline on our local machine.

> Platform.sh also provides a smooth SSH tunnels integration described in the [tethered](/gettingstarted/local/tethered.md) page.

Local services are provided by the Docker stack but there are minimum day-to-day tasks that you might need with Platform.sh.

The main ones are:

* **Downstream database synchronization**: Getting it from the remote to the local.
* **Downstream file storage synchronization**: Getting it from the remote to the local.

To help you with that, Platform.sh provides a CLI that you probably already have. If you don't, see the [install guide](/gettingstarted/cli.md).

Combined together, eZ Launcphad and Platform.sh CLI make those actions straight forward and simple.

#### Database and storage synchronization

```bash
platform db:dump --gzip -f ezplatform.sql.gz -d data/ -y
platform mount:download -m ezplatform/web/var --target=ezplatform/web/var/ -y
~/ez/importdata
```

The two first lines get the remote database and storage from the remote environment and stores it locally in `data/`. The third tells to eZ Launchpad to import those data in the Docker stack.

> The storage (images and files) synchronization is optional. eZ Platform provides a [placeholder generator mechanism](https://doc.ezplatform.com/en/latest/guide/images/#setting-placeholder-generator) which allows you to forget about the real images for your local.
