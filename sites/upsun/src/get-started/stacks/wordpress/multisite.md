---
title: Deploy WordPress Multisite on {{% vendor/name %}}
sidebarTitle: "WordPress Multisite"
weight: 1
description: |
    Complete the last required steps to successfully deploy a WordPress Multisite on Upsun.
---

{{< note theme="info" >}}

Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md).
These resources provide all the core concepts and common commands you need to know before using the following materials.

{{< /note >}}

For WordPress Multisite to successfully deploy and operate, **after completing the [Getting started guide](/get-started/here/_index.md)**,
you still need to add some required files and make a few changes to your {{% vendor/name %}} configuration.

{{% guides/requirements name="WordPress" %}}

{{< note theme="info" title="Assumptions" >}}

There are many ways you can set up a [WordPress Multisite](https://developer.wordpress.org/advanced-administration/multisite/) or {{% vendor/name %}} project.
The instructions on this page were designed based on the following assumptions:

- You selected **PHP** as your runtime, and **MariaDB** as a service during the Getting Started guide. It's also assumed that
while using the Getting Started guide you named the project `myapp`, which you will notice is the top-level key in all
configuration below.
- Your database relationship name is `mariadb` (the default)
- You have a working WordPress site based on either the [WordPress Composer](/get-started/stacks/wordpress/composer.html),
[Bedrock](https://docs.upsun.com/get-started/stacks/wordpress/bedrock.html), or
[WordPress Vanilla](/get-started/stacks/wordpress/vanilla.html) guides.
- WordPress is installed in the web/public root of the site and not in a subdirectory of its own (see notes at the end of this
guide for that scenario)
- You know if you are creating a
[subdirectory-based multisite or a sub/multi-domain based multisite](https://developer.wordpress.org/advanced-administration/multisite/prepare-network/#types-of-multisite-network).

map_values(select(.primary == true and .type == "upstream" and .upstream == "app" )) | keys | .[0] | if (.[-1:] == "/") then (.[0:-1]) else . end
to_entries[] | select(.value.primary == true and .value.type == "upstream" and .value.upstream == "app") | if (.key[-1:] == "/") then (.key[0:-1]) else .key end

{{< /note >}}

## 1. Add rewrite rules to your root location

If you are setting up a subdirectory-based multisite, the following rewrite rules are **required**. If you are unsure,
or if you think you might convert to a subdirectory-based multisite later, you can add these rules to a sub/multi-domain
multisite without any negative effects.

Locate the `web:locations` section in your `.upsun/config.yaml` file and update the rules section for your root (`/`)
location as follows:

```yaml {configFile="app"}
applications:
  myapp:
    <snip>
    web:
      locations:
        "/":
          <snip>
          rules:
            ^/license\.text$:
              allow: false
            ^/readme\.html$:
              allow: false
            '^/([_0-9a-zA-Z-]+/)?wp-(?<wproot>[a-z\-]+).php$':
              allow: true
              scripts: true
              passthru: '/wp-$wproot.php'
            # Allows directory-based multisites to still access the wp-admin and wp-include locations
            '^/([_0-9a-zA-Z-]+/)?(?<adminrewrite>wp-(admin|includes).*)':
              allow: true
              scripts: true
              passthru: '/$adminrewrite'
            '^/([_0-9a-zA-Z-]+)/wp-content/(?<content>.*)':
              allow: true
              scripts: false
              passthru: '/wp-content/$content'
              expires: 1w
```

## 2. Update the database during the deploy hook

The domain(s) of your multisite are stored in the database itself. This creates a challenge in a system like Upsun where
you often create [preview environments](/glossary.html#preview-environment) dynamically during development. To ensure
the database for your preview environments are updated with the correct domains, we have created a
[wp-cli package](https://github.com/upsun/wp-ms-dbu) to automate the process of updating the database with the preview
environment's unique domain name.

To install the wp-cli package, locate the `build:` section and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    <snip>
    hooks:
      build: |
        set -eux
        wp package install upsun/wp-ms-dbu
        wp package update upsun/wp-ms-dbu
```
To instruct the package to update your database with the relevant domains for the preview environment, locate the
`deploy` section and update it as follows:

```yaml {configFile="app"}
applications:
  myapp:
    <snip>
    hooks:
      deploy: |
        set -eux

        PRODURL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r '[.[] | select(.primary == true)] | first | .production_url')
        if [ 'production' != "${PLATFORM_ENVIRONMENT_TYPE}" ] &&  wp site list --format=count --url="${PRODURL}" >/dev/null 2>&1; then
          echo "Updating the database...";
          wp ms-dbu update --url="${PRODURL}"
        else
          echo "Database appears to already be updated. Skipping.";
        fi
        wp cache flush
        wp core update-db
```


## 3. Environment variables

In order to process the domains, we need to be able to determine the default production domain. Upsun provides information
about all routes

DOMAIN_CURRENT_SITE
MULTISITE_INSTALLED

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
