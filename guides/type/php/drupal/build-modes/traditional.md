# Traditional Drupal build mode

Platform.sh supports this mode as easily as it does the build oriented one...
its less fun for you.. as you have to handle updating stuff yourself, and your
repository is bigger... and you might be tempted to hack core without doing a 
clean patch... but that's your issue. Platform.sh will handle your site 
gracefully.

In the traditional or *Vanilla mode* you simply commit all of Drupal's files directly into
the Git repository instead of using Drush Make. We strongly encourage you to use the Drush
make build mode.

In this mode, take care not to commit any database credentials to your
repository. The following lines should be present in your repository's
`.gitignore` file, which will guarantee that a settings.local.php file
won't get committed to Git:

```bash
    # Ignore configuration files that may contain sensitive information.
    sites/*/settings*.php
```

> **note**

> It is a mistake to mix Vanilla mode with other modes. If you've copied
> all of the Drupal core files into your repository then you need to
> make sure you don't have any `` *.make` or ``\*.profile\`\` files.