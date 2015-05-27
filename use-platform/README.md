Install the Platform.sh software bundle
=======================================

[Platform.sh](https://platform.sh) comes with a tool called the cli.

The cli is an open-source project hosted on
[GitHub](https://github.com/). You can find help or raise issues for the
CLI in the [GitHub issue
queue](https://github.com/platformsh/platformsh-cli/issues).

Install Composer, the PHP dependency manager
--------------------------------------------

[Composer](https://getcomposer.org/) is a dependency manager for
[PHP](http://php.net/). For more details, see Composer's own
installation instructions on their [getting
started](https://getcomposer.org/doc/00-intro.md) page.

### Install Composer on OS X using Homebrew

Open Terminal or a shell. Run these homebrew commands. :

    brew update
    brew tap homebrew/dupes
    brew tap homebrew/php
    brew install composer

### Install Composer on Linux

Download the Composer .phar (PHP Archive). :

    curl -sS https://getcomposer.org/installer | php

Check that the archive does something. :

    php composer.phar

Move the archive to a command folder. :

    sudo mkdir -p /usr/local/bin
    sudo mv composer.phar /usr/local/bin/composer

### Install Composer on Windows

Download and run
[Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe).

It will install the latest Composer version and set up your PATH so that
you can just call composer from any directory in your command line.

Open a terminal.

Run composer. :

    composer about

Install the Platform.sh CLI
---------------------------

This procedure installs the cli in the Composer's .composer folder. On
OS X and Linux, this will be *\~/.composer/vendor/bin/*.

Install the cli:

    composer global require platformsh/cli:@stable

Add a path to the `platform` command :

    echo 'export PATH="$PATH:~/.composer/vendor/bin"' >> ~/.bash_profile
    source ~/.bash_profile

Find your Platform.sh login details (the e-mail address and password you
use to authenticate to Marketplace).

Run the Platform.sh CLI for the first time. :

    platform

You are then prompted for your Marketplace e-mail address and password.

Enter your details. A list of your projects appears, along with some
tips for getting started.

Your command line tools are now ready to use with Platform.sh.

