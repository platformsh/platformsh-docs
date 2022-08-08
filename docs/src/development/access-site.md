---
title: "Accessing your site"
weight: 6
description: |
  Once you have an environment running, there are many ways to access it to perform needed tasks. The most straightforward way is to view it in a web browser; the available URLs are shown in the Platform.sh Console and on the command line after every Git push.
---

{{% description %}}

By design, the only way to deploy new code is to push to the corresponding branch.
That ensures a consistent, repeatable, auditable application instance at all times.

## Visiting the site on the web

To find the URLs to access your site, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project where you want to find the URLs.</li>
  <li>From the <strong>Environment</strong> menu, select an environment.</li>
  <li>Click <strong>URLs</strong>.</li>
</ol>

<--->

---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform url --project <PROJECT_ID>
```

{{< /codetabs >}}

Generally there are two URLs created per route in your `routes.yaml` file:
One HTTPS and one HTTP route that just redirects to HTTPS.
If you're using the `{all}` placeholder in your `routes.yaml` file,
then there are more, depending on how many domains you have configured in your project.

## Access your app with SSH

See how to [access apps with SSH](./ssh/_index.md#connect-to-apps)

The application container is a fully working Linux environment using the `bash` shell.
Most of the system consists of a read-only file system so you can't edit code, but the full system is available to read.
Any file [mounts](../create-apps/app-reference.md#mounts)
you have declared in your [app configuration](../create-apps/_index.md) are writable.

Additionally, you are logged in as the same user that the web server runs as.
So you don't have to worry about editing a file from the command line and from your application
resulting in inconsistent and broken file ownership and permissions.

## Uploading and downloading files

The writable static files in an application (including uploads and temporary and private files)
are stored in [mounts](../create-apps/app-reference.md#mounts).

The Platform.sh CLI can list mounts inside an application:

```bash
$ platform mounts
Mounts in the app drupal (environment main):
+-------------------------+----------------------+
| Path                    | Definition           |
+-------------------------+----------------------+
| web/sites/default/files | shared:files/files   |
| private                 | shared:files/private |
| tmp                     | shared:files/tmp     |
+-------------------------+----------------------+
```

The CLI also helps in transferring files to and from a mount using the `mount:upload` and `mount:download` commands.
These commands use the rsync utility, which in turn uses SSH.

For example, to download files from the 'private' mount:

```bash
$ platform mount:download --mount private --target ./private

This will add, replace, and delete files in the local directory 'private'.

Are you sure you want to continue? [Y/n]
Downloading files from the remote mount /app/private to /Users/alice/Projects/foo/private
  receiving file list ...
 done

  sent 16 bytes  received 3.73K bytes  2.50K bytes/sec
  total size is 1.77M  speedup is 471.78
  time: 0.91s
The download completed successfully.
```

Uploading files to a mount is similar:

```bash
$ platform mount:upload --mount private --source ./private

This will add, replace, and delete files in the remote mount 'private'.

Are you sure you want to continue? [Y/n]
Uploading files from /Users/alice/Projects/foo/private to the remote mount /app/private
  building file list ...
 done

  sent 2.35K bytes  received 20 bytes  1.58K bytes/sec
  total size is 1.77M  speedup is 745.09
  time: 0.72s
The upload completed successfully.
```

## Using SSH clients

Many applications and protocols run on top of SSH,
including the SSH File Transfer Protocol (SFTP), secure copy (scp), and rsync.
You need to set up [SSH keys](./ssh/ssh-keys.md) and let your client access the private key.

Then [get the SSH connection details](./ssh/_index.md#get-ssh-connection-details) for the environment.
Enter the host and username into your client.

### SFTP

SFTP is another way to upload and download files to and from a remote environment.
There are many SFTP clients available for every operating system.

### scp

scp is a basic command-line utility to copy files to and from a remote environment.

For example, to download a `diagram.png` file from the `web/uploads` directory (relative to the [app root](../create-apps/app-reference.md#root-directory)),
run the following command (replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with appropriate values):

```bash
scp "$(platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>)":web/uploads/diagram.png .
```

The file is copied to the current local directory.

To copy files from your local directory to the Platform.sh environment, reverse the order of the parameters:

```bash
scp diagram.png "$(platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>)":web/uploads
```

Consult the [scp documentation](https://www.man7.org/linux/man-pages/man1/scp.1.html) for other options.

### rsync

For copying files to and from a remote environment, rsync is the best tool available.
It's a little more complicated to use than scp, but it can also be a lot more efficient,
especially if you are only updating files that are already partially copied.

The CLI [`mount:upload` and `mount:download` commands](#uploading-and-downloading-files)
are helpful wrappers around rsync that make it a little easier to use.

You can also use rsync on its own.
For example, to copy all files in the `web/uploads` directory on the remote environment to the local `uploads` directory,
run the following command (replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with appropriate values):

```bash
rsync -az "$(platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>)":web/uploads/ ./uploads/
```

Note that rsync is very sensitive about trailing `/` characters.
Consult the [rsync documentation](https://man7.org/linux/man-pages/man1/rsync.1.html) for more details.

See the guides on [migrating](../tutorials/migrating.md) and [exporting](../tutorials/exporting.md) for more examples using rsync.
