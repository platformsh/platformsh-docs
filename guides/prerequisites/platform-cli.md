# Install the Platform.sh CLI

This procedure installs the cli in the Composer's .composer folder. On
OS X and Linux, this will be *\~/.composer/vendor/bin/*.

Install the cli:

    composer global require platformsh/cli:@stable

Add a path to the `platform` command :

    echo 'export PATH="$PATH:~/.composer/vendor/bin"' >> ~/.bash_profile
    source ~/.bash_profile

Find your Platform.sh login details (the e-mail address and password you
use to authenticate to your [Platform.sh account](https://accounts.platform.sh/user)).

Run the Platform.sh CLI for the first time. :

    platform

You are then prompted for your Platform.sh e-mail address and password.
# Authenticate locally using the Platform.sh CLI

The [Platform.sh CLI](https://github.com/platformsh/platformsh-cli) will
authenticate you with Platform.sh and show your projects. Just type this
command to start:

```bash
platform
```

The credentials you enter are the same as your [Platform.sh account](https://accounts.platform.sh/user).

> **note**
> If you have created your account using the  oAuth Login (bitbucket, github or google) in order to use the Platform CLI you
> will need to setup a password which you can do by visiting this page [https://accounts.platform.sh/user/password](https://accounts.platform.sh/user/password)

Enter your details. A list of your projects appears, along with some
tips for getting started.

**Your command line tools are now ready to use with Platform.sh.**
