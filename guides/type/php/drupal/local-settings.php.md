# Database credentials

You need to add your local database credentials to a
`settings.local.php` file.

This will be stored in `sites/default/settings.local.php` in your local
Drupal site. However, if you have used the CLI to build your project,
then it's better to use `shared/settings.local.php` (inside the project
root). The CLI will have created this file for you, when you ran the
`platform get` or `platform build` command.

> **note**

> If you are using the CLI but there is no shared/settings.local.php
> file, re-run `platform build`.

```php
<?php
// Database configuration.
$databases['default']['default'] = array(
  'driver' => 'mysql',
  'host' => 'localhost',
  'username' => '',
  'password' => '',
  'database' => '',
  'prefix' => '',
);
```

> **note**

> You never have to add the server-side database credentials to
> `settings.local.php`. Platform.sh generates a `settings.php` for each
> environment, already containing the proper database credentials.
