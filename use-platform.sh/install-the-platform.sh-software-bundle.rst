

Install the Platform.sh software bundle
=======================================

`Platform.sh <https://platform.sh>`_  comes with a CLI tool called 
`platform <https://github.com/platformsh/platformsh-cli>`_.  
Use the *platform* tool to manage your Platform projects from a terminal on your workstation. Anything you can do in the Platform UI, you can do in your terminal with Platform CLI.

The `Platform.sh CLI <https://github.com/platformsh/platformsh-cli>`_ is an open source project hosted on `Github <https://github.com/>`_. You can find help for *platform* problems in the `issue queue <https://github.com/platformsh/platformsh-cli/issues>`_.


Install composer, the PHP dependency manager
--------------------------------------------

`Composer <https://getcomposer.org/>`_ is a dependency manager for `PHP <http://php.net/>`_. 
For more details, see Composer's own installation instructions on their 
`getting started <https://getcomposer.org/doc/00-intro.md>`_ page.  


Install composer on OS X 
^^^^^^^^^^^^^^^^^^^^^^^^

Open a CLI. 
Run these homebrew commands. ::

 brew update
 brew tap homebrew/dupes
 brew tap homebrew/php
 brew install composer


Install composer on Linux 
^^^^^^^^^^^^^^^^^^^^^^^^^

Download the composer PHAR (PHP Archive). ::

 curl -sS https://getcomposer.org/installer | php

Check the archive does something. ::

 php composer.phar

Move the archive to my command folder. ::

 sudo mkdir -p /usr/local/bin
 sudo mv composer.phar /usr/local/bin/composer


Install composer on Windows 
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Download and run `Composer-Setup.exe <Composer-Setup.exe>`_.

It will install the latest Composer version and set up your PATH so that you can just call composer from any directory in your command line.


Check the system can find it. 

Open a terminal. 

Run composer. ::

 composer about


Install platform, the Platform.sh CLI tool
------------------------------------------

This procedure installs the `platform <https://github.com/platformsh/platformsh-cli>`_ in the 
`composer <https://getcomposer.org/>`_  folder.
The location for OS X and Linux users is *~/.composer/vendor/bin/*.  

Install the Platform.sh CLI tool. ::

 composer global require "commerceguys/platform-cli=1.*"

Help the system find *platform*. ::

 echo 'export PATH=$PATH:$HOME/.composer/vendor/bin' >> ~/.bash_profile
 source ~/.bash_profile 

Find your Platform.sh login details (the e-mail address and password you use to authenticate to Marketplace).

Run the Platform.sh CLI tool for the first time. ::

 platform

You are prompted for your Marketplace e-mail address and password.

Enter your details. A list of your projects appears, along with some tips for getting started. 

Your command line tools are now ready to use with Platform.sh. 




