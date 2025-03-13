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

1. Copy the following files from the [WordPress Composer Example Snippets](https://github.com/upsun/snippets/tree/main/examples/wordpress-composer)
   and add them to the root of your project:

   - The [composer.json](https://raw.githubusercontent.com/upsun/snippets/refs/heads/main/examples/wordpress-composer/composer.json) file declares project dependencies and specifies project settings and metadata for [Composer](https://getcomposer.org/) to use
   - The [wp-cli.yml](https://raw.githubusercontent.com/upsun/snippets/refs/heads/main/examples/wordpress-composer/wp-cli.yml) file contains the configuration values, related to your site, for the [WordPress CLI](https://wp-cli.org/) to use
   - The [.environment](https://raw.githubusercontent.com/upsun/snippets/refs/heads/main/examples/wordpress-composer/.environment) file maps and creates environment variables to be used in `wp-config.php`
   - The [wp-config.php](https://raw.githubusercontent.com/upsun/snippets/refs/heads/main/examples/wordpress-composer/wp-config.php) file contains your site's base configuration details, such as database connection information


2. Optional: To support non-public plugins, add a `plugins` directory to your project.
To ensure Git tracks empty folders, add a `plugins/.gitkeep` file as well.

3. Add and commit your changes.

   ```bash {location="Terminal"}
   git add .
   git commit -m "Adds initial WordPress and Upsun configuration files"
   ```

## 2. Configure your root location
Now that we have added the initial set of files to our repository, we need to make some additional modifications to the
Upsun configuration, so Upsun knows how to handle certain requests. Locate the `web:locations` section in the
`.upsun/config.yaml` file and update the root (`/`) location as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: '{{% latest "php" %}}'
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
       type: '{{% latest "php" %}}'
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
       type: '{{% latest "php" %}}'
       <snip>
       mounts:
         "wordpress/wp-content/uploads":
           source: storage
           source_path: "uploads"
   ```

   {{< note theme="info" >}}
   If you have designated a different directory through the `wordpress-install-dir` property in your `composer.json` file, update the
   mount location accordingly.
   {{< /note >}}

## 4. Install the WP-CLI
To ensure we are able to perform tasks later in the deployment stage (e.g. updating the database, flushing cache, etc.)
we need to make sure the [wp-cli](https://wp-cli.org/) utility is a dependency of the application container. While still
in the `.upsun/config.yaml` file, locate the `dependencies.php` section, and add the following:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    <snip>
    dependencies:
      php:
        composer/composer: "^2"
        wp-cli/wp-cli-bundle: "^2.4"
```

{{< note >}}
It is possible the `dependencies` section is commented out. When uncommenting, pay attention to the indentation and that
the `dependencies` key aligns with other sibling keys (e.g. `build`, `hooks`, etc.)
{{< /note >}}

## 5. Install dependencies during the build hook

To ensure your Composer dependencies are installed during the [build stage](/learn/overview/build-deploy.md#the-build),
locate the `build:` section (below the `hooks:` section).</br>
Update the `build:` section as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: '{{% latest "php" %}}'
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
Update the `deploy:` and `post_deploy:` sections as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: '{{% latest "php" %}}'
    ...
    hooks:
      deploy: |
        set -eux
        # Flushes the object cache
        wp cache flush
        # Runs the WordPress database update procedure
        wp core update-db
      post_deploy: |
        set -eu

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
    type: '{{% latest "php" %}}'
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

## 7. Add your crons

Under your application configuration you can now add a cron.

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: '{{% latest "php" %}}'
    ...
    crons:
      wp-cron:
        spec: '*/10 * * * *'
        commands:
          start: wp cron event run --due-now
        shutdown_timeout: 600
```

## 8. Update the `.environment` file

We need to add a few environment variables that will be used inside the `wp-config.php` file we added previously.
Open the `.environment` file. Just after the other database-related variables, add a blank line or two and add the
following:

```bash {location=".environment"}
# Routes, URLS, and primary domain
export SITE_ROUTES=$(echo $PLATFORM_ROUTES | base64 --decode)
export UPSTREAM_URLS=$(echo $SITE_ROUTES | jq -r --arg app "${PLATFORM_APPLICATION_NAME}" 'map_values(select(.type == "upstream" and .upstream == $app )) | keys')
export DOMAIN_CURRENT_SITE=$(echo $SITE_ROUTES | jq -r --arg app "${PLATFORM_APPLICATION_NAME}" 'map_values(select(.primary == true and .type == "upstream" and .upstream == $app )) | keys | .[0] | if (.[-1:] == "/") then (.[0:-1]) else . end')
```
<!-- @todo figure out the full expression for 1.5
{{< note >}}
If you decide to change the version of PHP to 8.1, the PHP 8.1 image ships with `jq` version 1.5. The jq function
`map_values()` was not added until version 1.6. For version 1.5, you can simulate the function by using the [array
unpack operator](https://jqlang.org/manual/v1.5/#.[]), feeding the results to your select function, and wrapping all of
it as an array. For example, the `jq` expression for `UPSTREAM_URLS` for v1.5 of `jq` can be written as

```bash {location=".environment"}
export UPSTREAM_URLS=$(echo $SITE_ROUTES | jq -r --arg app "${PLATFORM_APPLICATION_NAME}" '[.[] | select(.type == "upstream" and .upstream == $app )] | keys')
```
{{< /note >}}

-->

## 9. Commit and push

You can now commit all the changes made to `.upsun/config.yaml` and `.environment` and push to {{% vendor/name %}}.

 ```bash {location="Terminal"}
 git add .
 git commit -m "Add changes to complete my upsun configuration"
 {{% vendor/cli %}} push
 ```
## 10. Install WordPress

Once {{% vendor/name %}} has completed building and deploying your project, it will provide the list of routes assigned
to your project. You can now visit your site and complete the WordPress installation as you normally would.

## 11. Routinely run WP Cron (optional)
If your site does not receive enough traffic to ensure [WP Cron jobs](https://developer.wordpress.org/plugins/cron/) run
in a timely manner, or your site uses caching heavily such that WP Cron isn't being triggered, you might consider adding
a [cron job](/create-apps/app-reference/single-runtime-image.html#crons) to your project's configuration to have WP CLI
run those scheduled tasks on a routine basis. To do so, locate the `crons:` section that is commented out, and update it
as follows:

```yaml {configFile="app"}
 applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    <snip>
    crons:
      wp-cron:
        spec: '*/15 * * * *'
        commands:
          start: wp cron event run --due-now
        shutdown_timeout: 600
```
The above example will trigger the wp-cli every 15th minute to run WP Cron tasks that are due. Feel free to adjust based
on your individual requirements.

{{< note theme="info">}}
When uncommenting, pay attention to the indentation and that the `crons` key aligns with other sibling keys (e.g. `hooks`, `dependencies`, etc.)
{{< /note >}}

## Further resources

### Documentation

- [PHP documentation](/languages/php/_index.md)

- [Extensions](/languages/php/extensions.md)

- [Performance tuning](/languages/php/tuning.md)

- [PHP-FPM sizing](/languages/php/fpm.md)

- [Authenticated Composer](/languages/php/composer-auth.md)

### Community content

- [PHP topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=php)
- [WordPress topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=wordpress)

### Blogs

- [To {{% vendor/name %}}, a WordPress migration story](https://upsun.com/blog/to-upsun-a-wordpress-migration-story/)

<!-- ## Video -->
