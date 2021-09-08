---
title: "Troubleshoot SSH"
---

While trying to use SSH, you may get a response indicating permission is denied. Or if you get an error with a code of 255, it means there's a problem with your SSH connection.

```txt
The command failed with the exit code: 255
```

There are several places to check to try to solve such issues.

## Check your environment

If your environment is inactive or the deployment has failed, you can't log in to it. To make sure the environment is active and the deployment has succeeded, check it using `platform environment:list` or in the [management console](https://console.platform.sh/) .

## Redeploy your environment

If you have just added your SSH key or made changes to [access rules](/administration/users.md), you need to redeploy your environment before you can access it using SSH keys. You can do this in the [management console](https://console.platform.sh/), by running `platform repdeploy`, or by pushing an empty git commit:

```bash
$ git commit --allow-empty -m 'chore: force redeploy'
$ git push origin master
```

## Check your public key

Make sure your public key has been uploaded to your user account. Check it in the [Platform.sh console](https://console.platform.sh/).

## Check your SSH agent

Check that your key is properly added to your SSH agent. This is an authentication agent that manages your private key.

1. Run `ssh-add -l` in your terminal:

    ```bash
    $ ssh-add -l
    2048 12:b0:13:83:7f:56:18:9b:78:ca:54:90:a7:ff:12:69 /Users/your_username/.ssh/id_rsa (RSA)
    ```

2. Check that the file exists and that the file name or comment matches your private key file.
3. If you don't see your private key file, add your private key:

    ```bash
    $ ssh-add path-to-your-key
    ```

## Specify your identity file

If your identity (SSH key) associated with Platform.sh is not in a default file name (as may be explained in your SSH software manual, for example) you may have to append a specification like the one below so that the SSH software finds the correct key.

```bash
Host platform.sh
IdentityFile ~/.ssh/id_platformsh
```

Be aware that, above, `platform.sh` stands for a hostname. Each different hostname you connect to Platform.sh at may have to be specified in the host line, separated by spaces.

## Check your git integrations

If your project is integrated with another git provider (such as GitHub), that provider controls git operations. Make sure you have added your public SSH key to your provider and that your user there has access.

## Add a second authentication factor

If your organization has multifactor authentication set up, you may get an error like the following when trying to log into your environment with SSH keys:

```bash
Hello YourName (UUID: your-user-id), you successfully authenticated, but could not connect to service id-of-environment--app (reason: access requires MFA)
id-of-environment@ssh.eu-3.platform.sh: Permission denied (publickey).
```

To resolve this, log in using the CLI, such as by running `platform login`.

## Generate SSH debug information

If your private key and public key both look OK but you don't have any luck logging in, print debugging information. These lines often give clues about what is going wrong.

Run the SSH command with the `-v` option, like this:

```bash
$ ssh -v [SSH-URL]
OpenSSH_6.7.8, OpenSSL 1.2.3 1 Sep 2014
debug1: Connecting to ssh.eu.platform.sh [54.32.10.98] port 22.
debug1: Connection established.
debug1: identity file /Users/your_username/.ssh/id_rsa type 1
...(many more lines of this light reading)...
debug1: Offering RSA public key: /Users/your_username/.ssh/id_rsa
debug1: Authentications that can continue: publickey
debug1: No more authentication methods to try.
Permission denied (publickey).
```

or

```bash
$ GIT_SSH_COMMAND="ssh -v" git clone [REPO-URL]
```

You can use this information to make one last check of the private key file.

If you're still stuck, don't hesitate to [submit a support ticket](https://console.platform.sh/-/users/:user/tickets). We'll help you solve your problem.
