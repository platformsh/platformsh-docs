# SSH

One of the ways [Platform.sh](https://platform.sh/) keeps things secure is by using SSH behind the scenes. Users can interact with their environment through a command shell, or push changes to the environment's Git repository, and both of these features rely on SSH.

In order to interact with Platform.sh, your public key is uploaded to your Platform.sh user account. It then governs authentication for Git, SSH sessions (shell access), and other tools that connect to your Platform.sh project.

* [Setting up](ssh/setting-up.md)
* [Managing SSH keys on Platform.sh](ssh/managing-ssh-keys.md)
* [Working with SSH keys](ssh/local-ssh-keys.md)
* [Accessing your service](ssh/access.md)
* [Troubleshooting SSH](ssh/troubleshooting.md)

## What is SSH?

SSH is a method of secure remote login from one computer to another. The SSH protocol uses public key cryptography to authenticate users and hosts.

> More information about SSH is available at https://www.ssh.com/ssh/.
