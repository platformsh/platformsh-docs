# Setting up SSH

When you create a new project, the wizard will propose that you add your ssh key.

![Setting Up Your Project Add SSH Key Done](/images/03-setting-up-your-project-add-ssh-key-done.png)

You can also manage SSH keys through the CLI or through the settings screen on your account page.

### How to add your SSH key

### 1) Using the CLI

The Platform.sh CLI has a command which will create and add an SSH key for you. This is the easiest method.

```bash
platform ssh-key:add
```

### 2) Using the website

You can add and manage your SSH key via the website, under User > Account settings > SSH keys.

You have your SSH keys, but you need to make sure Platform has a copy of your public key. It's pretty easy to add it to your account.

1.  First off, you'll need to copy your public key to the clipboard.
2.  Head over to your user account page on [the Platform.sh Accounts page](https://accounts.platform.sh/user) and navigate to the `SSH Keys` tab.
3.  Click on the `Add a public key` link.
4.  Paste your public key into the 'Key' text box. You can also add a title if you like, otherwise it will be auto-generated.
5.  Click 'Save'.

Now you'll be able to use Git and command shells with any Platform.sh environment that your user account is authorized to work with.

![Edit Account Ssh](/images/edit-account-ssh.png)

## Related

* [Managing SSH keys on Platform.sh](ssh/managing-ssh-keys.md)
* [Working with SSH keys](ssh/local-ssh-keys.md)
* [Accessing your service](ssh/access.md)
* [Troubleshooting SSH](ssh/troubleshooting.md)


