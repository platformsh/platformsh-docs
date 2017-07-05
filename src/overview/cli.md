# CLI (Command Line Interface)

## What is the CLI?

The CLI is the official tool to use and manage your Platform.sh projects directly from your terminal. Anything you can do within the Web Interface can be done with the CLI.

The source code of the CLI is hosted on [GitHub](https://github.com/platformsh/platformsh-cli).

Find detailed information on [setting up a local development environment](/development/local.md).

## How do I get it?

You can install the CLI easily using this command:

```bash
curl -sS https://platform.sh/cli/installer | php
```

You can find the system requirements and more information in the [installation instructions on GitHub](https://github.com/platformsh/platformsh-cli/blob/master/README.md#installation).

## Authenticate the CLI locally

The [Platform.sh CLI](https://github.com/platformsh/platformsh-cli) will
authenticate you with Platform.sh and show your projects. Just type this
command to start:

```bash
platform
```

The credentials you enter are the same as your [Platform.sh account](https://accounts.platform.sh/user).

> **note**
> If you have created your account using the OAuth Login (via Bitbucket, GitHub or Google) then in order to use the Platform CLI you
> will need to create a password, which you can do using the ['Request new password' tool](https://accounts.platform.sh/user/password)

Enter your details. A list of your projects appears, along with some
tips for getting started.

**Your command-line tools are now ready to use with Platform.sh.**

## Updating the CLI

To update the CLI at any time, run:

```bash
platform self-update
```

## What can I do with the CLI?

The CLI uses the platform API to trigger commands (*Branch, Merge...*) on your Platform.sh project.

![Platform.sh CLI In Project](/images/platform-cli-in-project.png)

It's also very useful when you work locally since it can simulate a local build of your codebase as if you were pushing a change to Platform.sh.

![Platform.sh CLI Logged In](/images/platform-cli-logged-in.png)

Once you have the CLI installed, run `platform list` to see all of the available commands.

![Platform.sh CLI List](/images/platform-cli-list.png)

You can preface any command with `help` to see more information on how to use that command.

```bash
$ platform help domain:add
Command: domain:add
Description: Add a new domain to the project

Usage:
 domain:add [--project[="..."]] [--cert="..."] [--key="..."] [--chain="..."] [name]

Arguments:
 name                  The name of the domain

Options:
 --project             The project ID
 --cert                The path to the certificate file for this domain.
 --key                 The path to the private key file for the provided certificate.
 --chain               The path to the certificate chain file or files for the provided certificate. (multiple values allowed)
 --help (-h)           Display this help message
 --quiet (-q)          Do not output any message
 --verbose (-v|vv|vvv) Increase the verbosity of messages
 --version (-V)        Display this application version
 --yes (-y)            Answer "yes" to all prompts
 --no (-n)             Answer "no" to all prompts
 --shell (-s)          Launch the shell
```

## Installing the CLI on Windows 10

To install the CLI on a Windows 10, 64-bit machine, BASH needs to be installed. Otherwise, you will need to install a Virtual Machine running Linux. The Windows 10 Anniversary Update is needed for support for git and apt/apt-get.

To install Bash you need to:

1. Activate the Developer Mode in "Update & Security" in the Windows Settings. This will prompt you to restart your computer.
2. Activate the Windows Subsystem for Linux (Beta) in "Turn Windows features on or off" in the Programs and Features section of the Windows Control Panel. Once again, you will need to restart your computer.
3. In the start menu, search for the program "bash.exe", which will prompt you to install it from thw Windows Store.

Bash is now installed. 

You can read more here: https://www.windowscentral.com/how-install-bash-shell-command-line-windows-10

Upon starting it, you will be asked to choose a user name. According to the article, it doesn't have to be the same username as your current username, but if the username don't exist, the Linux system might not be able to create the Linux directory (depending on your protection scheme on your Windows 10 machine). It is therefore recommended you use the same username for Linux as your Windows machine, provided your Windows user name isn't "Admin".
