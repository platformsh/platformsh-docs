---
title: Deploy Composer-based WordPress on {{% vendor/name %}}
sidebarTitle: "Composer WordPress"
weight: 1
description: |
    Complete the last required steps to successfully deploy WordPress on Upsun.
---

{{< note theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md).
These resources provide all the core concepts and common commands you need to know before using the following materials.

{{< /note >}}

For WordPress to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to add some required files and make a few changes to your {{% vendor/name %}} configuration.

{{% guides/requirements name="WordPress" %}}

{{< note theme="info" title="Assumptions" >}}

There are many ways you can set up a WordPress site or {{% vendor/name %}} project.
The instructions on this page were designed based on the following assumptions:

- You are building a composer-based WordPress site using John P Bloch's [WordPress Composer Fork](https://github.com/johnpbloch/wordpress).
- You do not have a `composer.json` file, or are comfortable making changes to your existing version.
- You selected PHP as your runtime, and MariaDB as a service during the Getting Started guide. It's also assumed that while using the Getting Started guide you named the project `myapp`, which you will notice is the top-level key in all configuration below.

{{< /note >}}

## 1. Add required files

To ensure you have all the required files and directories in your project, follow these steps:

1. Copy the following files from the [WordPress Composer template](https://github.com/platformsh-templates/wordpress-composer/)
   and add them to the root of your project:

   - The [composer.json](https://raw.githubusercontent.com/platformsh-templates/wordpress-composer/61da65da21039b280b588642cd329a2eb253e472/composer.json) file declares project dependencies and specifies project settings and metadata for [Composer](https://getcomposer.org/) to use
   - The [wp-cli.yml](https://github.com/platformsh-templates/wordpress-composer/blob/61da65da21039b280b588642cd329a2eb253e472/wp-cli.yml) file contains the configuration values, related to your site, for the [WordPress CLI](https://wp-cli.org/) to use
   - The [wp-config.php](https://github.com/platformsh-templates/wordpress-composer/blob/61da65da21039b280b588642cd329a2eb253e472/wp-config.php) file contains your site's base configuration details, such as database connection information

2. Optional: To support non-public plugins, add a `plugins` directory to your project.
To ensure Git tracks empty folders, add a `plugins/.gitkeep` file as well.

3. Add and commit your changes.

   ```bash {location="Terminal"}
   git add .
   git commit -m "Add files and directory"
   git push
   ```

Now that you have pushed all the necessary files and directories to Upsun,
make the following changes to your `./.upsun/config.yaml` file.

## 2. Configure your root location

Locate the `web:locations` section and update the root (`/`) location as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    web:
      locations:
        "/":
          passthru: "/index.php"
          root: "wordpress"
          index:
            - "index.php"
          expires: 600
          scripts: true
          allow: true
          rules:
            ^/license\.text$:
              allow: false
            ^/readme\.html$:
              allow: false
```

{{< note theme="info" >}}
If you're migrating your site, you may already have a `composer.json` file.
You may even have generated your own instead of starting from the Platform.sh template version.</br>
If so, you may also have added a [`wordpress-install-dir` property](https://github.com/johnpbloch/wordpress-core-installer?tab=readme-ov-file#usage) for `extras` in your `composer.json` file.</br>
In this case, set `root:` to the name of the directory where you are installing WordPress.
{{< /note >}}

## 3. Set up a location for uploads

WordPress needs a writable location to store uploaded media.
To set one up, follow these steps:

1. Create the location.</br>
   To do so, add a `/wp-content/uploads` location as follows:

   ```yaml {configFile="app"}
   applications:
     myapp:
       source:
         root: "/"
       type: 'php:8.3'
       web:
         locations:
           "/":
             passthru: "/index.php"
             root: "wordpress"
             index:
               - "index.php"
             expires: 600
             scripts: true
             allow: true
             rules:
               ^/license\.text$:
                 allow: false
               ^/readme\.html$:
                 allow: false
           "/wp-content/uploads":
             root: "wordpress/wp-content/uploads"
             scripts: false
             allow: false
             rules:
               '(?<!\-lock)\.(?i:jpe?g|gif|png|svg|bmp|ico|css|js(?:on)?|eot|ttf|woff|woff2|pdf|docx?|xlsx?|pp[st]x?|psd|odt|key|mp[2-5g]|m4[av]|og[gv]|wav|mov|wm[av]|avi|3g[p2])$':
                 allow: true
                 expires: 1w
   ```
2. To make the location writable, set up [a mount](/create-apps/app-reference/single-runtime-image.md#mounts).</br>
   To do so, locate the `mounts:` section that is commented it out, and update it as follows:

   ```yaml {configFile="app"}
   applications:
     myapp:
       source:
         root: "/"
       type: 'php:8.3'
       ...
       mounts:
         "wordpress/wp-content/uploads":
           source: storage
           source_path: "uploads"
   ```

   {{< note theme="info" >}}
   If you have designated a different directory through the `wordpress-install-dir` property in your `composer.json` file, update the
   mount location accordingly.
   {{< /note >}}

## 4. Install dependencies during the build hook

To ensure your Composer dependencies are installed during the [build stage](/learn/overview/build-deploy.md#the-build),
locate the `build:` section (below the `hooks:` section).</br>
Update the `build:` section as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    ...
    hooks:
      build: |
        set -eux
        composer install --prefer-dist --optimize-autoloader --apcu-autoloader --no-progress --no-ansi --no-interaction
        rsync -a plugins/ wordpress/wp-content/plugins/
```

You can adjust the `composer install` command to meet your specific requirements.

If you aren't using the `plugins` directory to manage non-public plugins, remove the `rsync` command.

## 5. Launch tasks during the deploy hook

Some tasks need to be performed after the images for our application are built,
but before the newly built application can receive requests.
Therefore, the best time to launch them is during the [deploy hook](/learn/overview/build-deploy.md#deploy-steps).

Such tasks include:

- Flushing the object cache, which might have changed between current production and newly deployed changes
- Running the WordPress database update procedure, in case core is being updated with the newly deployed changes
- Running any due cron jobs

To launch these tasks during the deploy hook,
locate the `deploy:` section (below the `build:` section).</br>
Update the `deploy:` section as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    ...
    hooks:
      deploy: |
        set -eux
        # Flushes the object cache
        wp cache flush
        # Runs the WordPress database update procedure
        wp core update-db
        # Runs all due cron events
        wp cron event run --due-now
```

## 6. Configure your default route

Next, instruct the [router](learn/overview/structure.md#router) how to handle requests to your WordPress app.
To do so, locate the `routes:` section, and beneath it, the `"https://{default}/":` route.

Update the route as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    ...

routes:
  "https://{default}/":
    type: upstream
    upstream: "myapp:http"
    cache:
      enabled: true
      cookies:
        - '/^wordpress_*/'
        - '/^wp-*/'
```

Matching the application name `myapp` with the `upstream` definition `myapp:http` is the most important setting to ensure at this stage.
If these strings aren't the same, the WordPress deployment will not succeed.

## 7. Update your MariaDB service relationship

You need to update the name used to represent the [relationship](/create-apps/app-reference/single-runtime-image.md#relationships) between your app and your MariaDB service.
To do so, locate the `relationships:` top-level property.
Update the relationship for the database service as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    # ...
    relationships:
      database: "mariadb:mysql"
```

You can now commit all the changes made to `.upsun/config.yaml` and push to {{% vendor/name %}}.

   ```bash {location="Terminal"}
   git add .
   git commit -m "Add changes to complete my {{% vendor/name %}} configuration"
   git push
   ```


## Further resources

### Documentation

- [PHP documentation](/languages/php/)

- [Extensions](/languages/php/extensions)

- [Performance tuning](/languages/php/tuning)

- [PHP-FPM sizing](/languages/php/fpm)

- [Authenticated Composer](/languages/php/composer-auth)

### Community content

- [PHP topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=php)
- [WordPress topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=wordpress)

### Blogs

- [To {{% vendor/name %}}, a WordPress migration story](https://upsun.com/blog/to-upsun-a-wordpress-migration-story/)

<!-- ## Video -->
