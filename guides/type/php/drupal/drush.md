# Install Drush

This is not a hard requirement.. but it will make your life working with 
Platform.sh and Drupal so much nicer.

Install drush with composer:

```bash
$ composer global require 'drush/drush:6.*'
```

At the end of the installation, you should be able to run:

```bash
$ drush
```

And it will also give you the `platform drush` magical command that will run 
drush on your remote Platform.sh projects.. but more on that later.

