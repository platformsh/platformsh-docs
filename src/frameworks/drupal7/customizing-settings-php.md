# Customizing settings.php

For applications using the `drupal` build flavor (those based on our [Drupal 7
example](https://github.com/platformsh/platformsh-example-drupal7)), Platform.sh automatically generates a `settings.php` file and `settings.local.php` file if neither are present. This allows the Drupal site to be connected to MySQL without any additional configuration.

If you wish to customize either file, we recommend instead using the example files provided in our Drupal 7 project template.  There are two: [settings.php](https://github.com/platformsh/platformsh-example-drupal7/blob/master/settings.php) and [settings.platformsh.php](https://github.com/platformsh/platformsh-example-drupal7/blob/master/settings.platformsh.php).  The former will automatically include the latter, and all Platform.sh-specific configuration is found in the `settings.platformsh.php` file.  It will also automatically include a `settings.local.php` file if found so it will not conflict with your local development workflow.

> **note**
> You should never commit a `settings.local.php` file to your repository.


If you need to add additional configuration that is specific to Platform.sh, such as connecting to additional services like [Redis](/frameworks/drupal7/redis.md) or [Solr](/frameworks/drupal7/solr.md), those changes should go in the `settings.platformsh.php` file.
