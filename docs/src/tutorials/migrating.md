---
title: "Migrating to Platform.sh"
description: |
  Moving an already-built site to Platform.sh is generally straightforward. For the most part, the only part that will vary from one framework to another is the details of the Platform.sh configuration files.
---

{{< description >}}

For more project-specific documentation,
see the [featured frameworks](/frameworks/_index.md) or [project templates](/development/templates.md).

## Preparation

First, assemble your Git repository as appropriate on your default branch.
Be sure to include the Platform.sh configuration files
as you can't push the repository to Platform.sh otherwise!

For some applications, such as Drupal,
you need to dump configuration to files before proceeding.
You also need to provide appropriate configuration
to read the credentials for your services at runtime
and integrate them into your application's configuration.
The details of that integration vary between systems.
Be sure to see the appropriate project templates for recommended configurations.

* [Go templates](/languages/go#project-templates)
* [Java templates](/languages/java/_index.md#project-templates)
* [Node.js templates](/languages/nodejs/_index.md#project-templates)
* [PHP templates](/languages/php/_index.md#project-templates)
* [Python templates](/languages/python#project-templates)


In the management console, click **+ Create project** to create a new Platform.sh project.
When asked to select a template, pick **Create from scratch**.

## Push your code

When you create a new project,
you get a checklist of tasks to complete the project.
(If you closed it, click **Finish setup** to bring it back.)

Two of the steps are important to .pushing any code you have ready.

First is **Set Platform.sh remote** and includes a command similar to this:

```bash
platform project:set-remote uwjs5ezkzjpzw
```

This adds a Git remote for the Platform.sh repository named `platform`.
The name is significant as the Platform.sh CLI looks for either `platform` or `origin` to be the Platform.sh repository
and some commands may not function correctly otherwise.

The second is **Commit & push**, which includes a command to push code:

```bash
git push -u platform main
```

This pushes your repository's `main` branch to the Platform.sh `main` branch.

{{< note >}}

Projects are currently always automatically set up with the `main` branch as the default.
Until this changes, see how to [rename your default branch](/guides/general/default-branch.md).

{{< /note >}}

When you push, a new environment is created using your code and the provided configuration files.
The system flags any errors with the configuration it can find.
If any are flagged, correct the error and try again.

## Import your database

You need to have a dump or backup of the database you wish to start from.
The process is essentially the same for each type of persistent data service.
See the [MySQL](/configuration/services/mysql/_index.md), [PostgreSQL](/configuration/services/postgresql.md),
and [MongoDB](/configuration/services/mongodb.md) documentation as appropriate.

## Import your files

Content files (files that aren't intended as part of your code base so aren't in Git)
can be uploaded to your mounts using the Platform.sh CLI or by using `rsync`.
You need to upload each directory's files separately.
Suppose for instance you have the following file mounts defined:

```yaml
mounts:
    'web/uploads':
        source: local
        source_path: uploads
    'private':
        source: local
        source_path: private
```

While using the CLI and rsync are the most common solutions for uploading files to mounts,
you can also use [SCP](/development/access-site.md#scp).

### Platform.sh CLI

The easiest way to import files to your project mounts is to use the Platform.sh CLI `mount:upload` command.
To upload to each of directories above, use the following commands.

```bash
platform mount:upload --mount web/uploads --source ./uploads
platform mount:upload --mount private --source ./private
```

### rsync

You can also use `rsync` to upload each directory.
The `platform ssh --pipe` command returns the SSH URL for the current environment
as an inline string that `rsync` can recognize.
To use a non-default environment, use the `-e` switch after `--pipe`.
Note that the trailing slash on the remote path means `rsync` copies just the files inside the specified directory,
not the directory itself.

```bash
rsync -az ./private `platform ssh --pipe`:/app/private/
rsync -az ./web/uploads `platform ssh --pipe`:/app/web/uploads
```

{{< note >}}

If you're running `rsync` on MacOS,
you should add `--iconv=utf-8-mac,utf-8` to your `rsync` call.

{{< /note >}}

For more details on how to adjust the upload process,
see the [`rsync` documentation](https://download.samba.org/pub/rsync/rsync.html).
