# Accessing your service via SSH

The application container is a fully working Linux environment using the `bash` shell.  Most of the system consists of a read-only file system (either the underlying container image or your built application image), so you cannot edit code live, but otherwise the full system is available to read and peruse. Any file [mounts](/configuration/app/storage.md) you have declared in your `.platform.app.yaml` will be writable.

Additionally, you will be logged in as the same user that the web server runs as; that means you needn't worry about the common problem of editing a file from the command line and from your application resulting in inconsistent and broken file ownership and permissions.

## Using the CLI

Most interactions with Platform.sh require SSH key authentication, and you will need to [set up your SSH keys](/development/ssh.md) before working on a site.

Once that's done, you can easily access the command line on your application over SSH. To log in to the environment that corresponds to your current branch, simply type:

```bash
platform ssh
```

To log in to some other environment, use the `-e` flag to specify the environment.  

## Using SSH directly

To obtain the SSH connection details for the environment either copy them out of the Platform.sh UI or run:

```bash
platform ssh --pipe
```

In the Web Interface, just under the environment name, there is a link you can hover over to copy the SSH URL of that environment:

![Image of an environment's access information in the web interface](/images/ssh-access-information.png "The SSH URL is formatted as follows: `<project-id>-<environment-id>@ssh.<region>.platform.sh`")

1.  Open your Platform.sh Web Interface
2.  Hover over the `Access info` link
3.  Click to copy the SSH URL
4.  Open a terminal
5.  Paste the link into your terminal

You should see something like this:

```bash
$ ssh wk5fqz6qoo123-master@ssh.eu.platform.sh

   ___ _      _    __
  | _ \ |__ _| |_ / _|___ _ _ _ __
  |  _/ / _` |  _|  _/ _ \ '_| '  \
  |_| |_\__,_|\__|_| \___/_| |_|_|_|

 Welcome to Platform.

 This is environment master
 of project wk5fqz6qoo123.

web@wk5fqz6qoo123-master--php:~$
```
