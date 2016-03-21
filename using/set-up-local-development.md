# Set up your local development environment

## Use the CLI

Use the CLI to get a copy of your project, so that you can start working
locally.

In order to copy your project locally, you'll need to know its project
ID. The command `platform projects` will list all of the projects in
your account.

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

## Download a project

Once you know the project ID you need to use, copying the project to
your local system is simple. Navigate to the folder you want to copy the
project to and then run `platform get [project-id] [folder-name]`. You
can then choose which branch you want to clone first.

```bash
~/htdocs $ platform get [project-id] my-project
  Enter a number to choose which environment to checkout:
  [0] : Master
  [1] : Sprint1
  [2] : test
  1
  Cloning into 'my-project/repository'...
  remote: counting objects: 11, done.
  Receiving objects: 100% (11/11), 1.36 KiB | 0 bytes/s, done.
  Checking connectivity... done.
```

You should now have a repository folder, based on what you used for
*[folder-name]* in the `platform get` command above.

### Local site structure

Inside the new folder, you will see your repository contents, along with one or
two new hidden files. They are:

* **.platform/local** - This directory contains builds and any local metadata about your project needed by the CLI.
* **.www** This is a symlink to the currently active build in the `.platform/local/builds` folder. It should be used as the document root for your local web server.

## Build the local site

Now that you have a copy of your project locally, you can run
`platform build` to pull it all together.

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
Web root: ~/htdocs/my-project/.www
~/htdocs/my-project $ 
```

## Other commands

Run `platform list` to see the other commands provided by the CLI.

> **seealso**
>
> * [CLI](../overview/cli)
> * [Installation instructions on GitHub](https://github.com/platformsh/platformsh-cli/blob/master/README.md).

## SSH tunneling

Use SSH tunneling to connect your local development site to Platform.sh
services.

```bash
$ platform tunnel:open
SSH tunnel opened on port 30000 to relationship: redis
SSH tunnel opened on port 30001 to relationship: database
Logs are written to: ~/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close
```

Now you can connect to the remote database normally, as if it were
local.

```
$ mysql --host=127.0.0.1 --port=30001 --user='user' --pass='' --database='main'
```

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
