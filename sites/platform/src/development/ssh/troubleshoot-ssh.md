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
[Generate a new pair of SSH keys](/development/ssh/ssh-keys#add-ssh-keys) for the second user account you want to add.

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

## Check your Git integrations

If your project is integrated with another Git provider (such as GitHub), that provider controls Git operations.
Make sure you have added your public SSH key to your provider and that your user there has access.

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

## MFA-related error message

If you haven't enabled MFA on your user account and try to SSH into an environment that is protected by MFA,
you get the following error message:

```bash
Error: Access denied
Service: abcdefg123456-main-bvxea6i--app
User: {{< variable "USER NAME" >}} ({{< variable "USER ID" >}})
Parameters: {"amr":["mfa","sso:acme"]}
Detail: Additional authentication is required:
	 - Multi-factor authentication (MFA)
	 - Single sign-on (SSO), provider: "acme"
```

To solve this, [enable MFA on your user account](/administration/security/mfa.md#enable-mfa-on-your-user-account).

Alternatively, open the Console and select the desired organization.
Follow the instructions so you can effectively access its contents.

Similarly for bot users and CLI tokens, you may see the message:

```bash
  [RequestException]                                           
  Multi-factor authentication (MFA) is required.               
  The API token may need to be re-created after enabling MFA.  
```

In this case, as described, it will be necessary to:

1. Enable MFA on the (bot) user account associated with the token.
2. Generate a new access token, and then replace its value in your workflow that requires the token (such as updating a GitHub workflow secret variable).

## Something still wrong?

For more general information, see how to [troubleshoot development](/development/troubleshoot).

If you're still stuck, open a [support ticket](/learn/overview/get-support) and provide the full SSH debug information.