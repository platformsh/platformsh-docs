# Drupal 8

## Example

To get started quickly, see our example Drupal 8 application:
https://github.com/platformsh/platformsh-examples/tree/drupal/8.x

## Drush

You will need the latest version of Drush 8 (currently `dev-master`) to work with Drupal 8.

In your `.platform.app.yaml` file:

```yaml
dependencies:
    php:
        "drush/drush": "dev-master"
```

## Configuration management

* Create a `config/sync` directory in your local repository, and export your site configuration. Run these commands from your Platform.sh Drupal 8 project:

  ```bash
  mkdir -p `platform dir repo`/config/sync
  drush -r `platform dir web` config-export --destination=`platform dir repo`/config/sync
  ```

* Create a *build hook* to move this directory to a suitable location on Platform.sh, ideally outside the web root. In your `.platform.app.yaml` file:

  ```yaml
  hooks:
    build: |
      # Move the configuration directory to the Drupal root.
      mv sites/default/config public
  ```

* Configure your `settings.php` file to reference this directory.

  ```php
  $config_directories[CONFIG_SYNC_DIRECTORY] = 'config/sync';
  ```

* Commit all this to your repository, and push.
