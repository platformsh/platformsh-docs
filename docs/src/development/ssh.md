---
title: "Using SSH"
weight: 12
description: |
  Platform.sh uses Secure Shell (SSH) to help keep things secure. You can interact with your deployed environments or use the Platform.sh CLI, and both of these features rely on SSH.
sidebarTitle: "SSH"
---

{{< description >}}

This means you can do things like securely log in to your deployed server to troubleshoot and see what's different than your local environment or read logs. And push changes to your Git repository. All secured through SSH.

SSH supports authentication with certificates or key pairs. Certificates are faster to set up and generally easier to use, provided you have a web browser available. They are also required for the Platform.sh CLI (unless using an [API token](/development/cli/api-tokens.md)) and when your organization has multifactor authentication set up.

You can use key pairs to access deployed environments if you are setting up an automation tool or prefer that method.

Automation tools may also use [API tokens](/development/cli/api-tokens.md).

## Authenticate with certificates

To connect using certificates:

1. Install the [Platform.sh CLI](/development/cli/_index.md).
2. Run `platform login`.
4. In the open browser window, log in with your Platform.sh account credentials. (This webpage is encrypted with HTTPS [HTTP over TLS], making it secure.)
5. Authorize the CLI to use your account.

A certificate gets stored in your local SSH configuration. The certificate is automatically cycled every hour for a new certificate as long as your session is active.

If you are inactive for an extended period your certificate expires and you are asked to login again the next time you use a command that requires authentication.

## Authenticate with a key pair

This process requires two keys:

* A **private key** you must keep _secret_
* A **public key** stored in your Platform.sh account

These keys usually look like random lines of characters, like this example of [RSA keys](https://en.wikipedia.org/wiki/RSA_%28cryptosystem%29):

A private key:

```text
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAtpw0S4DwDVj2q04mhiIMkhvrYU7Z6hRiNbTFsqg3X7x/uYS/
dcNrSvT82j/jSeYQP3Dsod9GERW+dmOuLaFNeiqOStZi6jRSWo41hCOWOFbpBum3
...(many more lines like this)...
QGerp3VKaGe0St3ot57GlwCAQUJAf1mit8qDTi0I8MhBe7q2lstXkBvde7GY1gKx
Kng4ohG6xHZ/OvC9tq7/THwAvleaxgLZN5GyXfAqNylDdZ0LtSjl
-----END RSA PRIVATE KEY-----
```

A public key (one very long line):

```text
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2nDRLgPANWParTiaGIgySG+thTtnqFGI1tMWyqDdfvH+5hL91w2tK9PzaP+NJ5hA/cOyh30YRFb52Y64toU16Ko5K1mLqNFJajjWEI5Y4VukG6betrWfqdQ7XBr/s7nBuDOFQ5+eKbvug4rRSCSo8CsEI1eI0VNQkC9HJWYK28k7KurMdTN7X/Z/4vknM4/Rm2bnMk2idoORQgomeZS1p3GkG8dQs/c0j/b4H7azxnqdcCaR4ahbytX3d49BN0WwE84C+ItsnkCt1g5tVADPrab+Ywsm/FTnGY3cJKKdOAHt7Ls5lfpyyug2hNAFeiZF0MoCekjDZ2GH2xdFc7AX/ your_email_address@example.com
```

A key pair is valid for as long as you have access to the private key on the system from which you are connecting. If you have a key pair available, you are not prompted to login.

If you used GitHub to sign up for your Platform.sh account, your public keys from GitHub are automatically synced to your Platform.sh account. So you can use them already with the CLI or to [connect to a server](#connect-to-your-server-with-SSH).

Otherwise, you might be able to [find existing keys](#find-your-keys) or else you need to [generate new keys](#generate-new-keys).

### Find your keys

If you use Linux, you probably already have keys. The private key is usually in a file named `~/.ssh/id_rsa` and the public key in `~/.ssh/id_rsa.pub`. Tech Republic has a guide to [finding keys on different systems](https://www.techrepublic.com/article/how-to-view-your-ssh-keys-in-linux-macos-and-windows/).

To find your public key file:

1. Open a terminal.
2. Run the following commands:

   ```bash
   $ cd ~/.ssh
   $ ls -a
   ```

If you find a file ending in `.pub`, copy the location and [add it to your Platform.sh account](#add-an-ssh-key-to-your-platform-account).

If you don't find an existing key, [generate new keys](#generate-new-keys).

### Add an SSH key to your Platform account

Once you have the location of your public key, add it to your Platform.sh account. This method uses the Platform.sh CLI similar to [authenticating with certificates](#authenticate-with-certificates). You can also add it in the management console, similar to this [video](https://docs.platform.sh/videos/management-console/add-ssh-mc.mp4).

In a terminal, run the following command (replacing `PATH_TO_YOUR_KEY` with the location of your public key):

```bash
platform ssh-key:add 'PATH_TO_YOUR_KEY`
```

Now you are ready to use the key to [connect to an environment](#connect-to-your-server-with-ssh).

### Generate new keys

This method uses the Platform.sh CLI, similar to [authenticating with certificates](#authenticate-with-certificates). This way the key is added to your Platform.sh account automatically.

To generate a key otherwise, GitHub has a good [walk-through for creating SSH key pairs](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) on various operating systems. Then you need to [add it to your Platform.sh account](#add-an-ssh-key-to-your-platform-account).

1. In a terminal, run `platform ssh-key:add`.
1. If necessary, log in to a browser.
1. Press `Y` and `enter` to create a new SSH key.
1. Copy the location of the generated key.
1. Run the following commands (replacing `PATH_TO_YOUR_KEY` with the location you copied):

   ```bash
   $ eval $(ssh-agent)
   $ ssh-add 'PATH_TO_YOUR_KEY`
   ```

Now you have a public and a private key and the public key is added to your account. You are ready to use the keys to [connect to an environment](#connect-to-your-server-with-ssh).

### Forwarding keys by default

It may be helpful to set your SSH client to always forward keys to Platform.sh servers, which can simplify other SSH or rsync commands. To do so, include a block in your local `~/.ssh/config` file like so:

```text
Host *.us.platform.sh
       ForwardAgent yes
Host *.eu.platform.sh
       ForwardAgent yes
```

Include one `Host` entry for each Platform.sh region you want to connect to, such as `us-2` or `eu-4`. (You can include other configuration as desired.)

## Connect to your server with SSH

If you have just added your SSH key, you need to redeploy your environment before you can access it using SSH. You can do this in the [Platform.sh console](https://console.platform.sh/) or by pushing an empty git commit.

To access an environment via the CLI:

1. In a terminal, run `platform ssh`.
1. (If not currently in a project directory) enter the number of the project you want to access.
1. (If there are multiple apps) enter the number of the app you want to access.

You can also find the details in the management console:

1. Open the [Platform.sh console](https://console.platform.sh/).
1. Select a project.
1. In the **Environment** dropdown, select the environment you want to access.
1. Click the **SSH** dropdown.
1. Copy the ssh command for the app you want.
1. Enter the command into a terminal.

Either way, you get a response like this:

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

Now you can interact with the environment as you want.

## Troubleshoot SSH

While trying use SSH, you may get a response indicating permission is denied. There are several places to check to try to solve this issue.

### Check your environment

If your environment is inactive or the deployment has failed, you can't log in to it. Check the environment in the [Platform.sh console](https://console.platform.sh/) to make sure it is active and the deployment has succeeded.

If you have just added your SSH key, you need to redeploy your environment before you can access it using SSH. You can do this in the [Platform.sh console](https://console.platform.sh/) or by pushing an empty git commit:

```bash
$ git commit --allow-empty -m 'chore: force redeploy'
$ git push origin master
```

### Check your public key

Make sure your public key has been uploaded to your user account. Check it in the [Platform.sh console](https://console.platform.sh/).

### Check your SSH agent

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

### Specify your identity file

If your identity (SSH key) associated with Platform.sh is not in a default file name (as may be explained in your SSH software manual, for example) you may have to append a specification like the one below so that the SSH software finds the correct key.

```bash
Host platform.sh
IdentityFile ~/.ssh/id_platformsh
```

Be aware that, above, `platform.sh` stands for a hostname. Each different hostname you connect to Platform.sh at may have to be specified in the host line, separated by spaces.

### Check your git integrations

If your project is integrated with another git provider (such as GitHub), that provider controls git operations. Make sure you have added your public SSH key to your provider and that your user there has access.

### Add a second authentication factor

If your organization has multifactor authentication set up, you may get an error like the following when trying to log into your environment with SSH keys:

```bash
Hello YourName (UUID: your-user-id), you successfully authenticated, but could not connect to service id-of-environment--app (reason: access requires MFA)
id-of-environment@ssh.eu-3.platform.sh: Permission denied (publickey).
```

To resolve this, log in using the CLI, such as by running `platform login`.

### Generate SSH debug information

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

If you're still stuck, don't hesitate to submit a support ticket. We'll help you solve your problem.
