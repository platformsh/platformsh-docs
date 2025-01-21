---
title: Deploy Bedrock-based WordPress on {{% vendor/name %}}
sidebarTitle: "Bedrock WordPress"
weight: 2
description: |
    Complete the last required steps to successfully deploy Bedrock-based WordPress on Upsun using Bedrock.
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
- You are building a Bedrock-based WordPress site using Roots.io [Bedrock boilerplate](https://roots.io/bedrock/).
- You have an existing Bedrock-based codebase or created a new Composer project using `roots/bedrock` during the Getting
  started guide.
- You selected PHP as your runtime, and MariaDB as a service during the Getting Started guide. It's also assumed that
  while using the Getting Started guide you named the project `myapp`, which you will notice is the top-level key in all configuration below.

{{< /note >}}

## 1. Configure your root location

Locate the `web:locations` section and update the root (`/`) location as follows:

```yaml {configFile="app"}
applications:
  myapp:
    source:
      root: "/"
    type: 'php:8.3'
    <snip>
    web:
      locations:
        "/":
          root: "web"
          # The front-controller script to send non-static requests to.
          passthru: "/index.php"
          # Wordpress has multiple roots (wp-admin) so the following is required
          index:
            - "index.php"
          # The number of seconds whitelisted (static) content should be cached.
          expires: 600
          scripts: true
          allow: true
          rules:
            ^/composer\.json:
              allow: false
            ^/license\.txt$:
              allow: false
            ^/readme\.html$:
              allow: false
        "/wp/wp-content/cache":
          root: "web/wp/wp-content/cache"
          scripts: false
          allow: false
        "/wp/wp-content/uploads":
          root: "web/app/uploads"
          scripts: false
          allow: false
          rules:
            # Allow access to common static files.
            '(?<!\-lock)\.(?i:jpe?g|gif|png|svg|bmp|ico|css|js(?:on)?|eot|ttf|woff|woff2|pdf|docx?|xlsx?|pp[st]x?|psd|odt|key|mp[2-5g]|m4[av]|og[gv]|wav|mov|wm[av]|avi|3g[p2])$':
              allow: true
              expires: 1w
```

## 2. Set up a location for uploads

Application containers are read-only by default; WordPress needs a writable location to store uploaded media.
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
      "web/app/wp-content/cache":
        source: storage
        source_path: "cache"
      "web/app/uploads":
        source: storage
        source_path: "uploads"
```


## 3. Install dependencies during the build hook

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
```

You can adjust the `composer install` command to meet your specific requirements.

## 4. Launch tasks during the deploy hook

Once the images for our application have been built, there are a few key tasks that must be completed before our newly-built application can receive requests. These tasks include:
application can receive requests. Such tasks include:

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

## 5. Update App container depdencies

Add the wp-cli tool and composer to your application build. Locate the `dependencies:` section that is commented out,
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
       composer/composer: '^2'
       wp-cli/wp-cli-bundle: "^2.4"
 ```

## 6. Configure your default route

Locate the `routes:` section, and beneath it, the `"https://{default}/":` route. Update the route as follows:

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

## 7. Update `.environment`

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
To configure the remaining environment variables that WordPress needs to run smoothly, follow these steps.
1. Open the `.environment` file for editing
2. Add the following at the end of the file:

   ```bash {location=".environment"}
    export WP_HOME=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r 'to_entries[] | select(.value.primary == true) | .key')
    export WP_SITEURL="${WP_HOME}/wp"
    export WP_DEBUG_LOG=/var/log/app.log
    # Uncomment this line if you would like development versions of WordPress on non-production environments.
    # export WP_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
    export AUTH_KEY="${PLATFORM_PROJECT_ENTROPY}AUTH_KEY"
    export SECURE_AUTH_KEY="${PLATFORM_PROJECT_ENTROPY}SECURE_AUTH_KEY"
    export LOGGED_IN_KEY="${PLATFORM_PROJECT_ENTROPY}LOGGED_IN_KEY"
    export NONCE_KEY="${PLATFORM_PROJECT_ENTROPY}NONCE_KEY"
    export AUTH_SALT="${PLATFORM_PROJECT_ENTROPY}AUTH_SALT"
    export SECURE_AUTH_SALT="${PLATFORM_PROJECT_ENTROPY}SECURE_AUTH_SALT"
    export LOGGED_IN_SALT="${PLATFORM_PROJECT_ENTROPY}LOGGED_IN_SALT"
    export NONCE_SALT="${PLATFORM_PROJECT_ENTROPY}NONCE_SALT"
   ```

## 8. Commit, Push, and Deploy!
You can now commit all the changes made to `.upsun/config.yaml` and `.environment` and push to {{% vendor/name %}}.

   ```bash {location="Terminal"}
   git add .
   git commit -m "Add changes to complete my {{% vendor/name %}} configuration"
   upsun push -y
   ```


## Further resources
- [All example files (`.environment`, `.upsun/config.yaml`)](https://github.com/upsun/snippets/tree/main/examples/wordpress-bedrock)
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
