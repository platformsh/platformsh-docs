---
title: "Transfer files to and from your app"
weight: 7
sidebarTitle: File Transfer
---

After your app is built, its file system is read-only. 
This means that the only way you can edit your app's code is through Git.

However, you can transfer files to and from your app through mounts.
To do so, follow these steps.

## Before you begin

You need to [set up directories that remain writable after your app's build is complete](../create-apps/app-reference.md#mounts).
These are known as mounts.

To upload and download files directly to and from a mount inside your built app, 
you can then run a single command via the Platform.sh CLI 
or an SSH client. 

## Transfer files using the CLI

### 1. Optional: View the mounts inside your app

Before you start transferring files, 
you may want to view a list of all the mounts inside your app. 
To do so, in the Platform.sh CLI, run the following command:

```bash
$ platform mounts
```

After selecting a project and an environment, you get an output similar to the following:

```bash
Mounts in the app drupal (environment main):
+-------------------------+----------------------+
| Path                    | Definition           |
+-------------------------+----------------------+
| web/sites/default/files | shared:files/files   |
| private                 | shared:files/private |
| tmp                     | shared:files/tmp     |
+-------------------------+----------------------+
```

### 2. Transfer a file to a mount

To transfer files to a mount using the CLI, you can use the `mount:upload` and `mount:download` commands. 

For example, to download a file from the `private` mount to your local `private` directory, 
run the following command:

```bash
$ platform mount:download --mount private --target ./private
```

You get the following output:

```bash
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

Similarly, to upload the files contained in the local `private` directory to the `private` mount,
run the following command: 

```bash
$ platform mount:upload --mount private --source ./private
```

You get the following output:

```bash
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

## Transfer files using an SSH client

Another way to transfer files to and from a mount is to use an SSH client. 

To do so, you need to connect to your app with SSH.
Follow these steps:

1. Optional: If you've never done it before, [generate an SSH key and add it to your Platform account](../development/ssh/ssh-keys.md#add-ssh-keys).

2. In the CLI, enter the following command 
(replacing `<PROJECT_ID>`, `<ENVIRONMENT_NAME>` and `<APPLICATION_NAME>` with appropriate values):

```bash
platform ssh -p <PROJECT_ID> -e <ENVIRONMENT_NAME> -A <APPLICATION_NAME>
```

When the connection is complete, you get an output similar to the following:

```bash
 ___ _      _    __                    _    
| _ \ |__ _| |_ / _|___ _ _ _ __    __| |_  
|  _/ / _` |  _|  _/ _ \ '_| '  \ _(_-< ' \ 
|_| |_\__,_|\__|_| \___/_| |_|_|_(_)__/_||_|
                                            

 Welcome to Platform.sh.

 This is environment main-bvxea6i
 of project k7udf2g73jhbi.

web@app.0:~$ 

```

You can now open another terminal 
and start transferring files using an SSH client 
such as `scp` or `rsync`.

### scp

As a command-line utility, `scp` lets you copy files to and from a remote environment.

For example, to download a `diagram.png` file from the `web/uploads` directory 
(relative to the [app root](../create-apps/app-reference.md#root-directory)),
run the following command 
(replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with appropriate values):

```bash
scp "$(platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>)":web/uploads/diagram.png .
```

The `diagram.png` file is copied to the current local directory.

To copy files from your local directory to the Platform.sh environment, 
reverse the order of the parameters:

```bash
scp diagram.png "$(platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>)":web/uploads
```

See the [scp documentation](https://www.man7.org/linux/man-pages/man1/scp.1.html) for other options.

### rsync

`rync` is another tool you can use to copy files to and from a remote environment.

For example, to copy all the files in the `web/uploads` directory on the remote environment 
to the local `uploads` directory,
run the following command 
(replacing `<PROJECT_ID>` and `<ENVIRONMENT_NAME>` with appropriate values):

```bash
rsync -az "$(platform ssh --pipe -p <PROJECT_ID> -e <ENVIRONMENT_NAME>)":web/uploads/ ./uploads/
```

Note that rsync is very sensitive about trailing `/` characters.
Consult the [rsync documentation](https://man7.org/linux/man-pages/man1/rsync.1.html) for more details.

See the guides on [migrating](../tutorials/migrating.md) and [exporting](../tutorials/exporting.md) for more examples using `rsync`.


  