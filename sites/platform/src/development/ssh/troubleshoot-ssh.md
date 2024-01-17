---
title: "Troubleshoot SSH"
---

While trying to use SSH, you may get a response indicating permission is denied. Or if you get an error with a code of 255, it means there's a problem with your SSH connection.

```txt
The command failed with the exit code: 255
```

There are several places to check to try to solve such issues.

## Check your environment

If your environment is [inactive](/glossary.md#inactive-environment) or the deployment has failed,
you can't log in to it.
To make sure the environment is active and the deployment has succeeded,
check it using `{{% vendor/cli %}} environment:list` or in the [Console](https://console.platform.sh/) .

## Redeploy your environment

If you have just added your SSH key or made changes to [access rules](/administration/users.md), you need to redeploy your environment before you can access it using SSH keys. You can do this in the [Console](https://console.platform.sh/), by running `{{% vendor/cli %}} redeploy`, or by pushing an empty git commit:

```bash
git commit --allow-empty -m 'chore: force redeploy'
git push origin main
```

## Check your public key

Make sure your public key has been uploaded to your user account. Check it in the [{{% vendor/name %}} Console](https://console.platform.sh/).

## SSH key can not be duplicated

A given SSH key pair can only be linked to a single user account.
If you add an already used SSH key to another account, you see the error: `SSH key can not be duplicated`.
Generate a new pair of SSH keys for the second user account you want to add.

## Check your SSH agent

Check that your key is properly added to your SSH agent. This is an authentication agent that manages your private key.

1. Run `ssh-add -l` in your terminal:

   ```bash
   ssh-add -l
   ```
   You get output similar to the following:

   ```bash
   2048 12:b0:13:83:7f:56:18:9b:78:ca:54:90:a7:ff:12:69 /Users/your_username/.ssh/id_rsa (RSA)
   ```

1. Check that the file exists and that the file name or comment matches your private key file.
1. If you don't see your private key file, add your private key:

    ```bash
    ssh-add path-to-your-key
    ```

## Specify your identity file

If your identity (SSH key) associated with {{% vendor/name %}} isn't in a default file name
(as may be explained in your SSH software manual, for example),
you may have to append a specification like the one below so that the SSH software finds the correct key.

```bash
Host platform.sh
IdentityFile ~/.ssh/id_{{% vendor/alt-name %}}
```

Be aware that, above, `{{% vendor/alt-name %}}` stands for a hostname.
Each different hostname you connect to {{< vendor/name >}} at may have to be specified in the host line, separated by spaces.

## Check your git integrations

If your project is integrated with another git provider (such as GitHub), that provider controls git operations.
Make sure you have added your public SSH key to your provider and that your user there has access.

## Add a second authentication factor

If your organization has [multifactor authentication set up](./_index.md#multifactor-authentication-mfa-over-ssh),
you may get an error like the following when trying to log into your environment with SSH keys:

```bash
Hello {{< variable "NAME" >}} (UUID: {{< variable "USER_ID" >}}), you successfully authenticated, but could not connect to service {{< variable "USER_ID" >}} --app
(reason: access requires MFA)
{{< variable "ENVIRONMENT_ID" >}}@ssh.{{< variable "REGION" >}}.{{< vendor/urlraw "host" >}}: Permission denied (publickey)
```

If you are using just `ssh` and not `{{% vendor/cli %}} ssh`, you may see only the second half of the error:

```bash
{{< variable "ENVIRONMENT_ID" >}}@ssh.{{< variable "REGION" >}}.{{< vendor/urlraw "host" >}}: Permission denied (publickey)
```

To resolve this:

{{< codetabs >}}
+++
title=Using the CLI
+++

Log in using the browser by running `{{% vendor/cli %}} login`.

<--->

+++
title=In the Console
+++

1. Open the user menu (your name or profile picture).
2. Click **My profile**
3. Click **Security**.
4. Click **Set up application**.
5. Follow the instructions for the chosen authentication app.
6. Click **Verify & save**.
7. Refresh your SSH credentials by running `{{% vendor/cli %}} login -f` in the CLI.

{{< /codetabs >}}

## Generate SSH debug information

If your private key and public key both look OK but you don't have any luck logging in, print debugging information.
These lines often give clues about what's going wrong.

Run the SSH command with the `-v` option, like so:

```bash
ssh -v [SSH-URL]
```

You get output similar to the following:

```bash
OpenSSH_6.7.8, OpenSSL 1.2.3 1 Sep 2014
debug1: Connecting to ssh.eu.{{< vendor/urlraw "host" >}} [54.32.10.98] port 22.
debug1: Connection established.
debug1: identity file /Users/your_username/.ssh/id_rsa type 1
...(many more lines of this light reading)...
debug1: Offering RSA public key: /Users/your_username/.ssh/id_rsa
debug1: Authentications that can continue: publickey
debug1: No more authentication methods to try.
Permission denied (publickey).
```

Alternatively, you can run the following command:

```bash
GIT_SSH_COMMAND="ssh -v" git clone {{< variable "REPO_URL" >}}
```

You can use this information to make one last check of the private key file.

## Something still wrong?

{{% troubleshoot %}}

If you're still stuck, open a [support ticket](/learn/overview/get-support) and provide the full SSH debug information.
