# Commit and push
Now we can commit our changes ..
```
$ git commit -am "add bootstrap theme"
[add-theme c1b8067] add bootstrap theme
 1 file changed, 1 insertion(+)
```
and push them..
```
$ git push
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 299 bytes | 0 bytes/s, done.
Total 3 (delta 2), reused 0 (delta 0)

Validating submodules.
Validating configuration files.
Processing activity: **Ori Pekelman** pushed to **add-theme**
    Found 1 new commit.

    Building application 'php' with toolstack 'php:drupal' (tree: 95c3a69)
      Generating runtime configuration.
      Installing build dependencies...
        Installing php build dependencies: drush/drush

      Making project using Drush make...
        Executing `drush -y make --cache-duration-releasexml=300 --concurrency=8 project.make /app/out/public`...
          Beginning to build project.make.                                            [ok]
          drupal-7.38 downloaded.                                                     [ok]
          drupal patched with                                                         [ok]
          install-redirect-on-empty-database-728702-36.patch.
          Generated PATCHES.txt file for drupal                                       [ok]
           >> platform-7.x-1.3 downloaded.                                            [ok]
           >> bootstrap-7.x-3.0 downloaded.                                           [ok]

      Moving checkout directory to `/sites/default`.
      Detected a `/sites/default` directory, initializing Drupal-specific files.
      Creating a default `/sites/default/settings.php` file.
      Creating the environment-specific `/sites/default/settings.local.php` file.
      Executing pre-flight checks...

      Compressing application.
      Beaming package to its final destination.

    Re-deploying environment vmwklzcpbi6zq-add-theme.
      Environment configuration:
        php (type: php, size: S, disk: 2048)
        mysql (type: mysql, size: S, disk: 2048)
        redis (type: redis, size: S)
        solr (type: solr, size: S, disk: 1024)

      Environment routes:
        http://add-theme-vmwklzcpbi6zq.eu.platform.sh/ is served by application `php`
        http://www---add-theme-vmwklzcpbi6zq.eu.platform.sh/ redirects to http://add-theme-vmwklzcpbi6zq.eu.platform.sh/
        https://add-theme-vmwklzcpbi6zq.eu.platform.sh/ is served by application `php`
        https://www---add-theme-vmwklzcpbi6zq.eu.platform.sh/ redirects to http://add-theme-vmwklzcpbi6zq.eu.platform.sh/


To vmwklzcpbi6zq@git.eu.platform.sh:vmwklzcpbi6zq.git
   c1b8067..2548c67  add-theme -> add-theme
```
You can see Platform.sh is not your normal git server.. it is going to give you
a lot of information about what it just did. If you quickly visit your Web
Interface you will see it is going to show you what is happening in real-time.
