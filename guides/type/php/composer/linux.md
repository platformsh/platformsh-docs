# Install Composer on Linux

Download the Composer .phar (PHP Archive). :

    curl -sS https://getcomposer.org/installer | php

Check that the archive does something. :

    php composer.phar

Move the archive to a command folder. :

    sudo mkdir -p /usr/local/bin
    sudo mv composer.phar /usr/local/bin/composer
