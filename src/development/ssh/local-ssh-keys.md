# Working with local SSH keys

* [Finding your SSH key](#find-your-ssh-key)
* [Creating a new SSH key](#create-a-ssh-key)

GitHub has a good [walk-through of creating an SSH key pair](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/) on various operating systems.

## Find your local SSH key

If you use Linux, you may already have keys. The private key is usually in a file named `~/.ssh/id_rsa` and the public key in `~/.ssh/id_rsa.pub`,

Searching for a public key file:
1. Open up a command prompt.
2. run the following commands:

```bash
$ cd ~/.ssh
$ ls -a
```

If you find a file named either `id_rsa.pub` or `id_dsa.pub`, you can use it with Platform.sh. If you don't find an existing key, see the steps to create a new one in the next section.

## Create a local SSH key

### 1) Using the Platform.sh CLI

The Platform.sh CLI has a command which will create and add an SSH key for you. This is the easiest method.

```bash
platform ssh-key:add
```

### 2) Using ssh-keygen

Ssh-keygen is a tool for creating new authentication key pairs for SSH. 

```bash
$ ssh-keygen -t rsa -C "your_email_address@example.com"
```

`ssh-keygen` generates the key pair and will ask you where you want to save the file:

``bash
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/your_username/.ssh/id_rsa):

``

The default location is fine in most cases. Now it's time to create a passphrase. A good, strong passphrase is highly recommended, to make your key less useful if it falls into the wrong hands.

```bash
Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]
```

That's it. Keys generated! Here are the results:

```bash
Your identification has been saved in /Users/your_username/.ssh/id_rsa.
Your public key has been saved in /Users/your_username/.ssh/id_rsa.pub.
The key fingerprint is:
55:c5:d7:a9:1f:dc:7a:67:31:70:fd:87:5a:a6:d0:69 your_email_address@example.com
```

> **note**
> Make note of the location of your public key, you're going to need that in the next section.

## Related

* [Setting up](ssh/setting-up.md)
* [Managing SSH keys on Platform.sh](ssh/managing-ssh-keys.md)
* [Accessing your service](ssh/access.md)
* [Troubleshooting SSH](ssh/troubleshooting.md)
