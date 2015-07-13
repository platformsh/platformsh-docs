# Install the Platform.sh CLI

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

##Your command line tools are now ready to use with Platform.sh.