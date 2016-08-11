# Upgrading

## Changes in version 2016.4

As of July 2016, we no longer create default configuration files if one is not provided.  The defaults we used to provide were tailored specifically for Drupal 7, which is now a legacy-support version with the release of Drupal 8 and not especially useful for non-Drupal or non-PHP sites.  They also defaulted to software versions that are no longer current and recommended.  Instead, you must provide your own `.platform.app.yaml`, `.platform/routes.yaml`, and `.platform/services.yaml` files.

Additionally, a version for a language or service should always be specified as well. That allows you to control when you upgrade from one version to another without relying on a network default.

The previous default files, for reference, are:

### .platform.app.yaml

```yaml
name: php
type: "php:5.4"
build:
    flavor: "drupal"
access:
    ssh: contributor
relationships:
    database: "mysql:mysql"
    solr: "solr:solr"
    redis: "redis:redis"
web:
    document_root: "/"
    passthru: "/index.php"
disk: 2048
mounts:
    "/public/sites/default/files": "shared:files/files"
    "/tmp": "shared:files/tmp"
    "/private": "shared:files/private"
crons:
    drupal:
        spec: "*/20 * * * *"
        cmd: "cd public ; drush core-cron"
```

### .platform/routes.yaml

```yaml
 "http://{default}/":
     type: upstream
     upstream: "php:http"
     cache:
         enabled: true
     ssi:
         enabled: false

 "http://www.{default}/":
     type: redirect
     to: "http://{default}/"
```

### .platform/services.yaml

```yaml
 mysql:
     type: mysql:5.5
     disk: 2048

 redis:
     type: redis:2.8

 solr:
     type: solr:3.6
     disk: 1024
 ```

## Changes in version 2016.3

As we are aiming to always provide you more control and flexibility on how to deploy your applications, the `.platform.app.yaml` format has been greatly improved. It is now way more flexible, and also much more explicit to describe what you want to do.

The `web` key is now a set of `locations` where you can define very precisely the behavior of each URL prefix.

Old format:

    web:
        document_root: "/"
        passthru: "/index.php"
        index_files:
            - "index.php"
        expires: 300
        whitelist:
            - \.html$

New format:

    web:
        locations:
            "/":
                root: "public"
                passthru: "/index.php"
                index:
                    - index.php
                expires: 300
                scripts: true
                allow: true
                rules:
                    \.mp4$:
                        allow: false
                        expires: -1
            "/sites/default/files":
                expires: 300
                passthru: true
                allow: true

### Backward compatibility

Of course, we alway keep backward compatibility with the previous configuration format. Here is what happens if you don't upgrade your configuration:

    # The following parameters are automatically moved as a "/" block in the
    # "locations" object, and are invalid if there is a valid "locations" block.
    document_root: "/public"      # Converted to [locations][/][root]
    passthru: "/index.php"        # Converted to [locations][/][passthru]
    index_files:
        - index.php               # Converted to [locations][/][index]
    whitelist: [ ]                # Converted to [locations][/][rules]
    blacklist: [ ]                # Converted to [locations][/][rules]
    expires: 3d                   # Converted to [locations][/][expires]

## Changes in version 2015.7

The `.platform.app.yaml` configuration file now allows for a much clearer syntax, which you can (and should) start using now.

The old format had a single string to identify the 'toolstack' you use:
```yaml
toolstack: "php:drupal"
```

The new syntax allows to separate the concerns of what language you are running
and the build process that is going to happen on deployment:
```yaml
type: php
build:
    flavor: drupal
```
Currently we only support `php` in the 'type' key. Current supported build
flavors are `drupal`, `composer` and `symfony`.

## Changes in version 2014.9

This version introduces changes in
the configuration files format. Most of the old configuration format is
still supported, but customers are invited to move to the new format.

For an example upgrade path, see the [Drupal 7.x branch of the
Platformsh-examples
repository](https://github.com/platformsh/platformsh-example-drupal/blob/7.x/.platform.app.yaml)
on GitHub.

Configuration items for PHP that previously was part of
`.platform/services.yaml` are now moved into `.platform.app.yaml`, which
gains the following top-level items:

-   `name`: should be `"php"`
-   `relationships`, `access` and `disk`: should be the same as the
    `relationships` key of PHP in `.platform/services.yaml`

Note that there is now a sane default for `access` (SSH access to PHP is
granted to all users that have role "collaborator" and above on the
environment) so most customers can now just omit this key in
`.platform.app.yaml`.

In addition, version 1.7.0 now has consistency checks for configuration
files and will reject `git push` operations that contain configuration
files that are invalid. In this case, just fix the issues as they are
reported, commit and push again.

