# Drupal 8

## Example

To get started quickly, see our example Drupal 8 application:
https://github.com/platformsh/platformsh-examples/tree/drupal/8.x

## Configuration management

* Create a `config/sync` directory in your local repository, and export your site configuration.

  ```bash
  mkdir -p `platform dir repo`/config/sync
  drush -r `platform dir web` config-export --destination=`platform dir repo`/config/sync
  ```

* Create a *build hook* to move this directory to a suitable location on Platform.sh, ideally outside the web root:

  ```yaml
  hooks:
    build: |
      # Move the configuration directory to the Drupal root.
      mv sites/default/config public
  ```

* Configure your `settings.php` file to reference this directory.

  ```yaml
  $config_directories[CONFIG_SYNC_DIRECTORY] = 'config/sync';
  
  ```

* Commit all this to your repository, and push.
