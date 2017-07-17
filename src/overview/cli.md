# CLI (Command Line Interface)

## What is the CLI?

The CLI is the official tool to use and manage your Platform.sh projects directly from your terminal. Anything you can do within the Web Interface can be done with the CLI. Behinds the scenes it uses both the Git interface and our REST API.

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
