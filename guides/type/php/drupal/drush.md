# Install Drush

This is not a hard requirement.. but it will make your life working with 
Platform.sh and Drupal so much nicer.

Install drush with Composer:

```bash
composer global require drush/drush
```

This will add `drush` to `~/.composer/vendor/bin/` directory. So, add `~/.composer/vendor/bin/` to your path, if it's not already part of it.

At the end of the installation, you should be able to run:

```bash
drush
```
