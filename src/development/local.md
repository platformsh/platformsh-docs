# Set up your local development environment

While Platform.sh is great as a tool for hosting an application during both development and production, it's naturally not the ideal place to edit code.  You can't, in fact, as the file system is read-only (as it should be).  The proper place to edit your code is on your computer.

You must have an [SSH key](/overview/tools.md#ssh) already configured on your account, and have both [Git](/overview/tools.md#git) and the [Platform.sh CLI](/overview/cli.md) installed before continuing.

## Download the code

If you don't already have a local Git clone of your code, you can easily download it.  From the Platform.sh UI copy the `platform get` command listed just under the action buttons on the right and run it locally on your system.

Alternatively, you can use the CLI to get a copy of the code directly.  Run `platform projects` to list all of the projects in your account.

```bash
~/htdocs $ platform projects
  Your projects are:
  +---------------+----------------------------+------------------------------------------------+
  | ID            | Name                       | URL                                            |
  +---------------+----------------------------+------------------------------------------------+
  | [project-id]  | New Platform Project       | https://eu.platform.sh/#/projects/[project-id] |
  +---------------+----------------------------+------------------------------------------------+

  Get a project by running platform get [id].
  List a project's environments by running platform environments.
```

Now you can download the code using `platform get [project-id] [folder-name]`:

```bash
~/htdocs $ platform get [project-id] my-project
  Cloning into 'my-project/repository'...
  remote: counting objects: 11, done.
  Receiving objects: 100% (11/11), 1.36 KiB | 0 bytes/s, done.
  Checking connectivity... done.
```

You should now have a repository folder, based on what you used for *[folder-name]* in the `platform get` command above.

You will also notice a new directory in your project, `.platform/local`, which is excluded from Git.  This directory contains builds and any local metadata about your project needed by the CLI.

### Building the site locally

Run the `platform build` command to run through the same build process as would be run on Platform.sh.  That will produce a `_www` directory in your project root that is a symlink to the currently active build in the `.platform/local/builds` folder. It should be used as the document root for your local web server.

```bash
~/htdocs/my-project $ platform build
Building application myapp (runtime type: php)
  Beginning to build ~/htdocs/my-project/project.make.
  drupal-7.38 downloaded.
  drupal patched with install-redirect-on-empty-database-728702-36.patch.
  Generated PATCHES.txt file for drupal
  platform-7.x-1.3 downloaded.
Running post-build hooks
Symlinking files from the 'shared' directory to sites/default

Build complete for application myapp
Web root: ~/htdocs/my-project/_www
~/htdocs/my-project $
```

Be aware, of course, that the `platform build` command will run locally, and so require whatever appropriate runtime or other tools you specify.  It may also result in packages referenced in your `dependendencies` block being installed on your local computer.

If that is undesireable, a local virtual machine will let you create an enclosed local development environment that won't affect your main system.

## Tethered Local

The simplest way to run a project locally is to use a local web server, but keep all other services on Platform.sh and connect to them over an SSH tunnel.  This approach requires very little setup, but depending on the speed of your connection and how I/O intensive your application is may not be performant enough to use regularly.  It will also require an active Internet connection, of course.

### Local web server

For the local web server the approach will vary depending on your language.

* For a self-serving language (Go or Node.js), simply run the program locally.
* For PHP, you may install your own copy of Apache and Nginx/PHP-FPM or simply use the built-in PHP web server: `php -S localhost:8001` will start a basic web server capable of running PHP, serving the current directory, on port 8001.  See the [PHP manual](https://www.php.net/manual/en/features.commandline.webserver.php) for more information.
* For other languages it is recommended that you install your own copy of Apache or Nginx.  A virtual machine or Docker image is also a viable option.

### SSH tunneling

Now that we have the code running, we need to connect it to our services.  To do so, open an SSH tunnel to the current project.

```bash
$ platform tunnel:open
SSH tunnel opened on port 30000 to relationship: redis
SSH tunnel opened on port 30001 to relationship: database
Logs are written to: ~/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close
```

> **note**
> platform tunnel: requires the pcntl and posix PHP extensions. Run `php -m | grep -E 'posix|pcntl'` to check if they're there.

Now you can connect to the remote database normally, as if it were local.

```
$ mysql --host=127.0.0.1 --port=30001 --user='user' --password='' --database='main'
```

The specific port that each service uses may vary project to project, but it will not change within a single project unless you change your services or relationship definition.  That makes it safe to add a local-configuration file for your application that connects to, in this case, `localhost:30001` for the SQL database and `localhost:30000` for Redis.

After the tunnel(s) are opened, you can confirm their presence:

```bash
platform tunnel:list
```

You can show more information about the open tunnel(s) with:

```bash
platform tunnel:info
```

and you can close tunnels with:

```bash
platform tunnel:close
```

## Untethered Local

Alternatively, you can also run the entire site locally on your computer.  That is more performant as there's no lag time to connect to a remote database and doesn't require an active Internet connection to work.  However, it does require running all necessary services (databases, search servers, etc.) locally.  These can be setup however you prefer, although Platform.sh recommends using a virtual machine to make it easier to share configuration between developers.

To synchronize data from an environment on Platform.sh, consult the documentation for each [service](/configuration/services.md).  Each service type has its own native data import/export process and Platform.sh does not get in the way of that.  It's also straightforward to [download user files](/tutorials/exporting.md#downloading-files) from your application using rsync.
