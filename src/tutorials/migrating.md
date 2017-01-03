---
search:
    keywords: ['migrating', 'upload']
---

# Migrating to Platform.sh

Moving an already-built site to Platform.sh is generally straightforward.  For the most part, the only part that will vary from one framework to another is the details of the Platform.sh configuration files.  See the **Featured Frameworks** section or our [project templates](https://github.com/platformsh/) for more project-specific documentation.

## Preparation

First, assemble your Git repository as appropriate, on your master branch.  Be sure to include the Platform.sh configuration files, as you will not be able to push the repository to Platform.sh otherwise!

For some applications, such as Drupal you will need to dump configuration to files before proceeding.  You will also need to provide appropriate configuration to read the credentials for your services at runtime and integrate them into your application's configuration.  The details of that integration will vary between systems.  Be sure to see the appropriate [project templates](https://github.com/platformsh/) for our recommended configuration.

Now create a new Platform.sh project and when asked if you want to create a blank site from a template or import your existing code.  Select "Import your existing code".


## Push your code

When creating a new project, the UI will provide two commands to copy and paste similar to the following:

```bash
git remote add platform nodzrdripcyh6@git.us.platform.sh:nodzrdripcyh6.git
git push -u platform master
```

The first will add a Git remote for the Platform.sh repository named `platform`.  The name is significant as the Platform.sh CLI will look for either `platform` or `origin` to be the Platform.sh repository, and some commands may not function correctly otherwise.  The second will push your repository's master branch to the Platform.sh master branch.  Note that a project must always start with a master branch, or deploys to any other environment will fail.

When you push, a new environment will be created using your code and the provided configuration files.  The system will flag any errors with the configuration if it can.  If so, correct the error and try again.

## Import your database

You will need to have a dump or snapshot of the database you wish to start from.  The process is essentially the same for each type of persistent data service.  See the [MySQL](/services/mysql.md#importing-data), [PostgreSQL](/services/postgresql.md#importing-data), or [MongoDB](/services/mongodb.md#) documentation as appropriate.


## Import your files

The best way to load content files (that is, files that are not intended as part of your code base so are not in Git) into your site is via `rsync`.  You will need to upload each directory's worth of files separately.  Suppose for instance you have the following file mounts defined:

```yaml
mounts:
    '/web/uploads': 'shared:files/uploads'
    '/private': 'shared:files/private'
```

To use `rsync` to upload each directory, we can use the following commands.  The `platform ssh --pipe` command will return the SSH URL for the current environment as an inline string that `rsync` can recognize. To use a non-default environment, use the `-e` switch after `--pipe`.  Note that the trailing slash on the remote path means `rsync` will copy just the files inside the specified directory, not the directory itself.

```bash
rsync -az ./private `platform ssh --pipe`:/app/private/
rsync -az ./web/uploads `platform ssh --pipe`:/app/web/uploads 
```

See the [`rsync` documentation](http://linuxcommand.org/man_pages/rsync1.html) for more details on how to adjust the upload process.
