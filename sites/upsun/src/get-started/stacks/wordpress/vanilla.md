---
title: Deploy Vanilla WordPress on {{% vendor/name %}}
sidebarTitle: Vanilla WordPress
weight: 3
description: |
    Complete the last required steps to successfully deploy Vanilla WordPress on Upsun.
---

{{< note theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md).
They provide all the core concepts and common commands you need to know before using the following materials.

{{< /note >}}

For WordPress to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to add some required files and make a few changes to your {{% vendor/name %}} configuration.

{{% guides/requirements name="WordPress" %}}

{{< note theme="info" title="Assumptions" >}}

There are many ways you can set up a WordPress site or {{% vendor/name %}} project.
The instructions on this page were designed based on the following assumptions:

- You selected PHP as your runtime, and MariaDB as a service during the Getting Started guide. It's also assumed that
while using the Getting Started guide you named the project `myapp`, which you will notice is the top-level key in all
configuration below.
- You are currently in the same directory where you created your project during the Getting Started guide.

{{< /note >}}

## 1. Add required files

To ensure you have all the required files and directories in your project, follow these steps:

1. If you haven't already, you will need to retrieve the [WordPress](https://wordpress.org/) core files. You can either
download a zip archive from WordPress.org, or use `curl` to download a tarball:

   ```shell
   curl https://wordpress.org/latest -o wordpress.tar.gz
   ```

2. Extract the contents of the archive. If you used curl in step 1. you can extract the contents using `tar`:

   ```shell
   tar -xvf wordpress.tar.gz
   ```

3. After extracting the files from the archive, delete the archive as it no longer needed (e.g. `rm wordpress.tar.gz`)

4. Whether you downloaded the zip, or the tarball, after extraction the extracted files should be contained in a
   directory named `wordpress`. This directory will become your public directory later. If you decide to rename this
   directory, make note of it for later steps.

5. Create a `wp-config.php` file inside the directory from step 4 and copy and paste the contents from
   [this example file](https://github.com/upsun/snippets/blob/main/examples/wordpress-vanilla/wordpress/wp-config.php).

6. Optional: if you plan on using [wp-cli](https://wp-cli.org/), add a `wp-cli.yml` file and add the following contents
   to it:

   ```yaml
    path: /app/wordpress/
    color: true
   ```

   **Note**: If you changed the name of the directory at step 4 you'll need to update the `path` property above to match.

7. Add all the files from the steps above to your repository
   1. `git add .`
   2. `git commit -m "adds wordpress core files"`

## 2. Update configuration files

1. Open the `.upsun/config.yaml` file created during the [Getting started guide](/get-started/here/_index.md)

2. Locate the `web:locations` section and update the root (`/`) location as follows:

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

    {{< note theme="info" >}}

If you changed the name of the directory at step 1.4 you'll need to update the `root` property to match for both locations.

    {{< /note >}}

3. Application containers are read-only by default; WordPress needs a writable location to store uploaded media.
   To make the location writable, set up [a mount](/create-apps/app-reference/single-runtime-image.md#mounts). To do so,
   locate the `mounts:` section that is commented out, and update it as follows:

   ```yaml {configFile="app"}
   applications:
    myapp:
      source:
        root: "/"
      type: 'php:8.3'
      <snip>
      mounts:
        "wordpress/wp-content/uploads":
          source: storage
          source_path: "uploads"
    ```

4. Once the images for our application have been built, there are a few key tasks that must be completed before our
   newly-built application can receive requests. These tasks include:

   - Flushing the object cache, which might have changed between current production and newly deployed changes
   - Running the WordPress database update procedure, in case core is being updated with the newly deployed changes
   - Running any due cron jobs

    To perform these tasks, we'll utilize  the [deploy hook](/learn/overview/build-deploy.md#deploy-steps). Locate the
    `deploy:` section (below the `build:` section). Update the `deploy:` section as follows:

    ```yaml {configFile="app"}
    applications:
      myapp:
        source:
          root: "/"
        type: 'php:8.3'
        <snip>
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

5. Locate the `routes:` section, and beneath it, the `"https://{default}/":` route. Update the route as follows:

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

6. Optional: Add the wp-cli tool to your application build. Locate the `dependencies:` section that is commented out,
   and update it as follows:

   ```yaml {configFile="app"}
   applications:
    myapp:
      source:
        root: "/"
      type: 'php:8.3'
      <snip>
      dependencies:
        php:
          wp-cli/wp-cli-bundle: "^2.4"
    ```

7. Add and commit your changes.

   ```bash {location="Terminal"}
   git add .upsun/config.yaml
   git commit -m "Updates configuration file"
   ```

## 3. Update `.environment`

The CLI generated a `.environment` file during the Getting started guide. Notice it has already created some environment
variables for you to connect to your database service.

```bash {location=".environment"}
# Set database environment variables
export DB_HOST="$MARIADB_HOST"
export DB_PORT="$MARIADB_PORT"
export DB_PATH="$MARIADB_PATH"
export DB_DATABASE="$DB_PATH"
export DB_USERNAME="$MARIADB_USERNAME"
export DB_PASSWORD="$MARIADB_PASSWORD"
export DB_SCHEME="$MARIADB_SCHEME"
export DATABASE_URL="${DB_SCHEME}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_PATH}"
```
To configure the remaining environment variables WordPress needs to run smoothly, follow these steps.
1. Open the `.environment` file for editing
2. Add the following at the end of the file:

   ```bash {location=".environment"}
    export WP_HOME=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary == true) | .key')
    export WP_SITEURL="${WP_HOME}wordpress"
    export WP_DEBUG_LOG=/var/log/app.log
    if [ "$PLATFORM_ENVIRONMENT_TYPE" != "production" ] ; then
      export WP_ENV='development'
    else
      export WP_ENV='production'
    fi
   ```
3. Add and commit your changes:
   1. `git add .environment`
   2. `git commit -m "adds remaining environment variables to .environment"`

## 4. Push and deploy
Now that we've added the required files, you're ready to push your changes and deploy your WordPress site:
```bash
upsun push -y
```
## Further resources
- [All files (Upsun configuration, `.environment`, `wp-cli.yml`, `wp-config.php`)](https://github.com/upsun/snippets/tree/main/examples/wordpress-vanilla)
### Documentation

- [PHP documentation](/languages/php/)

- [Extensions](/languages/php/extensions)

- [Performance tuning](/languages/php/tuning)

- [PHP-FPM sizing](/languages/php/fpm)

### Community content

- [PHP topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=php)
- [WordPress topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=wordpress)

### Blogs

- [To {{% vendor/name %}}, a WordPress migration story](https://upsun.com/blog/to-upsun-a-wordpress-migration-story/)

<!-- ## Video -->
