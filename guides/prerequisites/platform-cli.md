# Install the Platform.sh CLI

Run:

    curl -sS https://platform.sh/cli/installer | php

This will install the CLI in your home directory and configure your shell. If you need further installation instructions, see the [CLI README](https://github.com/platformsh/platformsh-cli/tree/master#installation).

## Authenticate locally using the Platform.sh CLI

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
