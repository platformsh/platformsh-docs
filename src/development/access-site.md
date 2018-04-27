# Accessing your site

Once you have an environment running, there are many ways to access it to perform needed tasks. The most obvious of course is to view it in a web browser; the available URLs are shown in the Platform.sh UI and on the command line after every Git push.

By design, the only way to deploy new code is to push to the corresponding branch.  That ensures a consistent, repeatable, auditable application instance at all times.

## Visiting the site on the web

The web URL(s) for the site are listed in the [web UI](/administration/web.md) under "Access site".

They can also be found on the command line, using the [Platform.sh CLI](/gettingstarted/cli.md):

```bash
platform url
```

Generally there will be two URLs created per route in your `routes.yaml` file: One HTTPS and one HTTP route that just redirects to HTTPS.  If you are using the `{all}` placeholder in your `routes.yaml` file then there will be more, depending on how many domains you have configured in your project.

## Accessing the application with SSH

Most interactions with Platform.sh require SSH key authentication, and you will need to [set up your SSH keys](/development/ssh.md) before working on a site.

Once that's done, you can easily access the command line on your application over SSH. To log in to the environment that corresponds to your current branch, simply type:

```bash
platform ssh
```

To log in to some other environment, use the `-e` flag to specify the environment.  

The application container is a fully working Linux environment using the `bash` shell.  Most of the system consists of a read-only file system (either the underlying container image or your built application image), so you cannot edit code live, but otherwise the full system is available to read and peruse. Any file [mounts](/configuration/app/storage.md) you have declared in your `.platform.app.yaml` will be writable.

Additionally, you will be logged in as the same user that the web server runs as; that means you needn't worry about the common problem of editing a file from the command line and from your application resulting in inconsistent and broken file ownership and permissions.

## Uploading and downloading files

The writable static files in an application - including uploads, temporary and private files - are stored in [mounts](/configuration/app/storage.md).

The [CLI](/gettingstarted/cli.md) can list mounts inside an application:

```
$ platform mounts
Mounts in the app drupal (environment master):
+-------------------------+----------------------+
| Path                    | Definition           |
+-------------------------+----------------------+
| web/sites/default/files | shared:files/files   |
| private                 | shared:files/private |
| tmp                     | shared:files/tmp     |
+-------------------------+----------------------+
```

The CLI also helps transferring files to and from a mount, using the `mount:upload` and `mount:download` commands. These commands use the `rsync` utility, which in turn uses SSH.

For example, to download files from the 'private' mount:

```
$ platform mount:download --mount private --target ./private

This will add, replace, and delete files in the local directory 'private'.

Are you sure you want to continue? [Y/n]
Downloading files from the remote mount /app/private to /Users/alice/Projects/foo/private
  receiving file list ...   done

  sent 16 bytes  received 3.73K bytes  2.50K bytes/sec
  total size is 1.77M  speedup is 471.78
  time: 0.91s
The download completed successfully.
```

Uploading files to a mount is similar:

```
$ platform mount:upload --mount private --source ./private

This will add, replace, and delete files in the remote mount 'private'.

Are you sure you want to continue? [Y/n]
Uploading files from /Users/alice/Projects/foo/private to the remote mount /app/private
  building file list ...   done

  sent 2.35K bytes  received 20 bytes  1.58K bytes/sec
  total size is 1.77M  speedup is 745.09
  time: 0.72s
The upload completed successfully.
```

## Using SSH clients

Many applications and protocols run on top of SSH, including SFTP, scp, and rsync.

To obtain the SSH connection details for the environment either copy them out of the Platform.sh UI (under the "Access site" dropdown) or run:

```bash
platform ssh --pipe
```

That will output the connection string for SSH, including the username and host for the current project and environment.  It will look something like `<project ID>-<environment ID>--app@ssh.us.platform.sh`.  The part before the `@` is the username, the part after is the host.  Enter both of those into your SSH/SFTP client.  No password is necessary, but your client will need to have access to the SSH private key that corresponds to the public key on Platform.sh.

### SFTP

SFTP is another way to upload and download files to and from a remote environment. There are many SFTP clients available for every operating system; use whichever one works for you.

### SCP

SCP is a simple command-line utility to copy files to and from a remote environment.

For example, this command:

```bash
scp "$(platform ssh --pipe)":web/uploads/diagram.png .
```

will copy the file named `diagram.png` in the `web/uploads` directory (relative to the application root) to the current local directory.  Reversing the order of the parameters will copy files up to the Platform.sh environment.  Consult the SCP documentation for other possible options.

### Rsync

For copying files to and from a remote environment, `rsync` is the best tool available. It is a little more complicated to use than `scp`, but it can also be a lot more efficient, especially if you are simply updating files that are already partially copied.

The Platform.sh CLI `mount:upload` and `mount:download` commands (described above) are helpful wrappers around `rsync` that make it a little easier to use.

However, it is also possible to use `rsync` on its own, for example:

```bash
rsync -az "$(platform ssh --pipe)":web/uploads/ ./uploads/
```

This command will copy all files in the `web/uploads` directory on the remote environment to the `uploads` directory locally.  Note that `rsync` is very sensitive about trailing `/` characters, so that may change the meaning of a command.  Consult the `rsync` documentation for more details.  Also see our [migrating](/tutorials/migrating.md) and [exporting](/tutorials/exporting.md) guides for more examples using `rsync`.

## Accessing the database

Access to the database or other services is only available from within the cluster.  For security reasons they cannot be accessed directly.  However, they can be accessed over an SSH tunnel.  There are two ways to do so.  (The example here uses MariaDB but the process is largely identical for any service.)

### Obtaining service credentials

In either case, you will also need the service credentials.  For that, run `platform relationships`.  That will give output similar to the following:

```yaml
redis:
    -
        service: rediscache
        ip: 246.0.82.19
        cluster: jyu7waly36ncj-master-7rqtwti
        host: redis.internal
        rel: redis
        scheme: redis
        port: 6379
database:
    -
        username: user
        scheme: mysql
        service: mysqldb
        ip: 246.0.80.37
        cluster: jyu7waly36ncj-master-7rqtwti
        host: database.internal
        rel: mysql
        path: main
        query:
            is_master: true
        password: ''
        port: 3306
```

That indicates that the `database` relationship can be accessed at host `database.internal`, user `user`, and an empty password.  The `path` key contains the database name, `main`.  THe other values can be ignored.

> **note**
> When using the default endpoint on MySQL/MariaDB, the password is usually empty. It will be filled in if you define any custom endpoings. As there is only the one user and port access is tightly restricted anyway the lack of a password does not create a security risk.

### Open an SSH tunnel directly

The first option is to open an SSH tunnel for all of your services.  You can do so with the Platform.sh CLI, like so:

```bash
$ platform tunnel:open
SSH tunnel opened on port 30000 to relationship: redis
SSH tunnel opened on port 30001 to relationship: database
Logs are written to: ~/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close
```

The `tunnel:open` command will connect all relationships defined in the `.platform.app.yaml` file to local ports, starting at 30000.  You can then connect to those ports on `localhost` using the program of your choice.

In this example, we would connect to `localhost:30001`, database name `main`, with username `user` and an empty password.

### Using an application tunnel

Alternatively, many database applications (such as MySQL Workbench and similar tools) support establishing their own SSH tunnel.  Consult the documentation for your application for how to enter SSH credentials, including telling it where your SSH private key is.  (Platform.sh does not support password-based SSH authentication.)

To get the values to use, the easiest way is to run `platform ssh --pipe`.  That will return a command line that can be used to connect over SSH, from which you can pull the appropriate information.  For example:

`jyu7waly36ncj-master-7rqtwti--app@ssh.us.platform.sh`

In this case, the username is `jyu7waly36ncj-master-7rqtwti--app` and the host is `ssh.us.platform.sh`.  Note that the host will vary per region, and the username will vary per-*environment*.

In this example, we would configure our database application to setup a tunnel to `ssh.us.platform.sh` as user `jyu7waly36ncj-master-7rqtwti--app`, and then connect to the database on host `database.internal`, username `user`, empty password, and database name `main`.
