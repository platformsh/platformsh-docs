CLI (Command Line Interface)
============================

What is the CLI?
----------------

The CLI is the official tool to use and manage your Platform.sh projects
directly from your terminal. Anything you can do within the Web Interface can
be done with the CLI.

How do I get it?
----------------

You can install the CLI easily using Composer:

```bash
composer global require platformsh/cli:@stable
```

You can find the system requirements and more information in the
[installation instructions on
GitHub](https://github.com/platformsh/platformsh-cli/blob/master/README.md).

What can I do with the CLI?
---------------------------

The CLI uses the platform API to trigger commands (*Branch, Merge...*)
on your Platform.sh project.

![Platform Cli In Project](images/platform-cli-in-project.png)

It's also very useful when you work locally since it can simulate a
local build of your codebase as if you were pushing a change to
Platform.sh.

![Platform Cli Logged In](images/platform-cli-logged-in.png)

Once you have the CLI installed, run `platform list` to see all of the
available commands.

![Platform Cli List](images/platform-cli-list.png)

You can preface any command with `help` to see more information on how
to use that command.

```bash
$ platform help domain:add

Usage:
domain:add [--project[="..."]] [--cert="..."] [--key="..."] [--chain="..."] [name]

Arguments:
 name                  The name of the domain

Options:
 --project             The project ID
 --cert                The path to the certificate file for this domain.
 --key                 The path to the private key file for the provided certificate.
 --chain               The path to the certificate chain file or files for the provided certificate. (multiple values allowed)
 --help (-h)           Display this help message.
 --quiet (-q)          Do not output any message.
 --verbose (-v|vv|vvv) Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
 --version (-V)        Display this application version.
 --yes (-y)            Answer "yes" to all prompts.
 --no (-n)             Answer "no" to all prompts.
 --shell (-s)          Launch the shell.
```
