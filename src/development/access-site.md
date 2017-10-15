# Accessing your site

Once you have an environment running, there are many ways to access it to perform needed tasks. The most obvious of course is to view it in a web browser; the available URLs are shown in the Platform.sh UI and on the command line after every Git push.

By design, the only way to deploy new code is to push to the corresponding branch.  That ensures a consistent, repeatable, auditable application instance at all times.

## SSH

Most interactions with Platform.sh require SSH key authentication, and you will need to [setup your SSH keys](/development/ssh.md) before working on a site.

Once that's done, you can easily access the command line on your application container over SSH. To login to the environment that corresponds to your current branch, simply type:

```bash
platform ssh
```

To login to some other environment, use the `-e` flag to specify the environment.  

The application container is a fully working Linux environment using the `bash` shell.  Most of the system consists of a read-only file system (either the underlying container image or your built application image), so you cannot edit code live, but otherwise the full system is available to read and peruse.  Any file mounts you have declared in your `.platform.app.yaml` will be writeable.

Additionally, you will be logged in as the same user that the web server runs as; that means you needn't worry about the common problem of editing a file from the command line and from your application resulting in inconsistent and broken file ownership and permissions.

### SFTP / SCP

To selectively upload or download files from an environment (other than code), SFTP is the preferred solution.  There are many SFTP clients available for every possible operating system; use whichever one works for you.  

To obtain the login credentials for the environment either copy them out of the Platform.sh UI (under the "Access site" dropdown) or run 

```bash
platform ssh --pipe
```

That will output the connection string for SSH, including the username and host for the current project and environment.  It will look something like `<project ID>-<environment ID>--app@ssh.us.platform.sh`.  The part before the `@` is the username, the part after is the host.  Enter both of those into your SFTP client.  No password is necessary, but your SFTP client will need to have access to the SSH private key that corresponds to the public key on Platform.sh.

From the command line, you can also use the `scp` command in combination with the `--pipe` switch.  For example:

```bash
scp `platform ssh --pipe`:web/uploads/diagram.png .
```

will copy the file named `diagram.png` in the `web/uploads` directory (relative to the application root) to the current local directory.  Reversing the order of the parameters will copy files up to the Platform.sh environment.  Consult the SCP documentation for other possible options.

### Rsync

For copying a whole directory tree's worth of files at once `rsync` is the best tool available.  `rsync` works over SSH so the command is very similar to `scp` and uses the inlined `platform ssh` command as well.

```bash
rsync -az `platform ssh --pipe`:web/uploads/ ./uploads/
```

This command will copy all files in the `web/uploads` directory on the current environment to the `uploads` directory locally.  Note that `rsync` is very sensitive about trailing `/` characters, so that may change the meaning of a command.  Consult the `rsync` documentation for more details.  Also see our [migrating](/tutorials/migrating.md) and [exporting](/tutorials/exporting.md) guides for more examples using `rsync`.
