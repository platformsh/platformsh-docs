---
title: "Transfer files to and from your app"
weight: 7
sidebarTitle: Transfer files
---

After your app is built, its file system is read-only.

The only way you can transfer files to your built app without using Git is through [mounts](../create-apps/app-reference.md#mounts).
Mounts let you set up directories that remain writable after the build is complete.
You can then upload files directly to mounts inside your app.

To download files from your built app, 
you can also use mounts or [an alternative data export method](../tutorials/exporting.md).

## Before you begin

Make sure you [set up mounts](../create-apps/app-reference.md#mounts).

To upload and download files directly to and from a mount inside your built app, 
you can then run a single command via the [Platform.sh CLI](../administration/cli/_index.md) 
or an SSH client. 

## Transfer files using the CLI

### View the mounts inside your app

Before you start transferring files, 
you may want to view a list of all the mounts inside your app. 
To do so, run the following command:

```bash
$ platform mounts --project {{< variable "PROJECT_ID" >}} --environment {{< variable "ENVIRONMENT_NAME" >}}
```

The output is similar to the following:

```bash
Mounts on abcdefgh1234567-main-abcd123--app@ssh.eu.platform.sh:
+-------------------------+----------------------+
| Mount path              | Definition           |
+-------------------------+----------------------+
| web/sites/default/files | source: local        |
|                         | source_path: files   |
| private                 | source: local        |
|                         | source_path: private |
| tmp                     | source: local        |
|                         | source_path: temp    |
+-------------------------+----------------------+
```

### Transfer a file to a mount

To transfer a file to a mount using the CLI, you can use the `mount:upload` command. 

For example, to upload the files contained in the local `private` directory to the `private` mount,
run the following command: 

```bash
$ platform mount:upload --mount private --source ./private
```

You get the following output:

```bash
Uploading files from ./private to the remote mount private

Are you sure you want to continue? [Y/n]

  sending incremental file list
  example.sh

  sent 2.35K bytes  received 20 bytes  1.58K bytes/sec
  total size is 1.77M  speedup is 745.09
```

### Transfer a file from a mount

To transfer a file from a mount using the CLI, you can use the `mount:download` command. 

For example, to download a file from the `private` mount to your local `private` directory, 
run the following command:

```bash
$ platform mount:download --mount private --target ./private
```

You get the following output:

```bash
Downloading files from the remote mount private to ./private

Are you sure you want to continue? [Y/n]

  receiving incremental file list
  example.sh

  sent 2.35K bytes  received 20 bytes  1.58K bytes/sec
  total size is 1.77M  speedup is 745.09
```

## Transfer files using an SSH client

Another way to transfer files to and from a mount is to use an SSH client such as [`scp`](file-transfer.md#scp) or [`rsync`](file-transfer.md#rsync).

### scp

As a command-line utility, `scp` lets you copy files to and from a remote environment.

For example, to download a `diagram.png` file from the `web/uploads` directory 
(relative to the [app root](../create-apps/app-reference.md#root-directory)),
run the following command 
(replacing {{< variable "PROJECT_ID" >}} and {{< variable "ENVIRONMENT_NAME" >}} with appropriate values):

```bash
scp "$(platform ssh --pipe -p {{< variable "PROJECT_ID" >}} -e {{< variable "ENVIRONMENT_NAME" >}}":web/uploads/diagram.png .
```

The `diagram.png` file is copied to the current local directory.

To copy files from your local directory to the Platform.sh environment, 
reverse the order of the parameters:

```bash
scp diagram.png "$(platform ssh --pipe -p {{< variable "PROJECT_ID" >}} -e {{< variable "ENVIRONMENT_NAME" >}})":web/uploads
```

For other options, see the [`scp` documentation](https://www.man7.org/linux/man-pages/man1/scp.1.html).

### rsync

You can use `rync` to copy files to and from a remote environment.

For example, to copy all the files in the `web/uploads` directory on the remote environment 
to the local `uploads` directory,
run the following command 
(replacing {{< variable "PROJECT_ID" >}} and {{< variable "ENVIRONMENT_NAME" >}} with appropriate values):

```bash
rsync -az "$(platform ssh --pipe -p {{< variable "PROJECT_ID" >}} -e {{< variable "ENVIRONMENT_NAME" >}})":web/uploads/ ./uploads/
```

Note that `rsync` is very sensitive about trailing `/` characters.

If you're using UTF-8 encoded files on macOS, 
add the `--iconv=utf-8-mac,utf-8` flag to your `rsync`call.

For more options, consult the [rsync documentation](https://man7.org/linux/man-pages/man1/rsync.1.html).