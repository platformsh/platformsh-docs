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

You will need to make a few changes to your {{% vendor/name %}} configuration for WordPress Multisite to successfully deploy and operate. 

Please note that these changes must only be made **after completing the [Getting started guide](/get-started/here/_index.md)**. Once the changes are made, you will have a working WordPress site (see **Assumptions** to read the WordPress guides and understand what your working WordPress site will be based on).
and have a working WordPress site based on one of the other WordPress guides see **Assumptions**, you still need to make

{{% guides/requirements name="WordPress" %}}

{{< note theme="info" title="Assumptions" >}}

There are many ways you can set up a [WordPress Multisite](https://developer.wordpress.org/advanced-administration/multisite/)
or {{% vendor/name %}} project. The instructions on this page are based on the following assumptions:

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
        composer install --prefer-dist --optimize-autoloader --apcu-autoloader --no-progress --no-ansi --no-interaction
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
        # we need the main production url
        PRODURL=$(echo $PLATFORM_ROUTES | base64 --decode | jq -r --arg app "${PLATFORM_APPLICATION_NAME}" '[.[] | select(.primary == true and .type == "upstream" and .upstream == $app )] | first | .production_url')
        if [ 'production' != "${PLATFORM_ENVIRONMENT_TYPE}" ] &&  wp site list --format=count --url="${PRODURL}" >/dev/null 2>&1; then
          echo "Updating the database...";
          wp ms-dbu update --url="${PRODURL}"
        else
          echo "Database appears to already be updated. Skipping.";
        fi
        wp cache flush
        wp core update-db
```


## 3. wp-config.php

Once our multisite has been set up, we need to expose additional pieces of information inside our `wp-config.php` file.
In your wp-config.php file, right above the section:

```php {location="wp-config.php"}
/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
  define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}
```

add the following:

```php {location="wp-config.php"}
/**
 * Multisite support
 */
define('WP_ALLOW_MULTISITE', true); //enables the Network setup panel in Tools
define('MULTISITE', false); //instructs WordPress to run in multisite mode

if( MULTISITE && WP_ALLOW_MULTISITE) {
	define('SUBDOMAIN_INSTALL', false); // does the instance contain subdirectory sites (false) or subdomain/multiple domain sites (true)
	define('DOMAIN_CURRENT_SITE', parse_url(filter_var(getenv('DOMAIN_CURRENT_SITE'),FILTER_VALIDATE_URL),PHP_URL_HOST));
	define('PATH_CURRENT_SITE', '/'); //path to the WordPress site if it isn't the root of the site (e.g. https://foo.com/blog/)
	define('SITE_ID_CURRENT_SITE', 1); //main/primary site ID
	define('BLOG_ID_CURRENT_SITE', 1); //main/primary/parent blog ID

	/**
	 * we have a sub/multidomain multisite, and the site currently being requested is not the default domain, so we'll
	 * need to set COOKIE_DOMAIN to the domain being requested
	 */
	if (SUBDOMAIN_INSTALL && $site_host !== DOMAIN_CURRENT_SITE) {
		define('COOKIE_DOMAIN',$site_host);
	}
}
```
where `SUBDOMAIN_INSTALL` is set to `true` if your multisite is a sub/multi-domain site, or `false` if you will be
setting up a subdirectory-based multisite. Note that `MULTISITE` is currently set to `false`; we will update his once
the database has finished being set up for the multisite.

## 4. Commit and push
You can now commit all the changes made above `.upsun/config.yaml` and push to {{% vendor/name %}}.

   ```bash {location="Terminal"}
   git add wp-config.php .environment .upsun/config.yaml
   git commit -m "Add changes to begin setup of my {{% vendor/name %}} WordPress multisite"
   {{% vendor/cli %}} push -y
   ```

<!--
map_values(select(.primary == true and .type == "upstream" and .upstream == "app" )) | keys | .[0] | if (.[-1:] == "/") then (.[0:-1]) else . end
to_entries[] | select(.value.primary == true and .value.type == "upstream" and .value.upstream == "app") | if (.key[-1:] == "/") then (.key[0:-1]) else .key end
-->

## 5. Network (Multisite) Setup
Adding `define('WP_ALLOW_MULTISITE', true);` will enable the **Network Setup** item in your **Tools menu**. Use that
menu item to go to the **Create a Network of WordPress Sites** screen. Follow the instructions on this screen and click
the **Install** button. You can ignore the instructions on the resulting screen.

{{< note >}}
Alternatively, you can access a terminal session in the app container (`{{% vendor/cli %}} ssh`), and use
`wp core multisite-convert` to install the multisite.
{{< /note >}}

## 6. Final change to wp-config.php
Return to your wp-config.php file and change

```php {location="wp-config.php"}
define('MULTISITE', false);
```
to
```php {location="wp-config.php"}
define('MULTISITE', true);
```

Add and commit the changes, and push to {{% vendor/name %}}:

```shell {location="Terminal"}
git add wp-config.php
git commit -m "set WordPress to run in multisite mode."
{{% vendor/cli %}} push -y
```

Once the site has finished deploying, you can return the Network Admin --> Sites area of wp-admin and begin adding your
sites.

<!--
## FOR Monday:

1. Show the wp-cli package updating the database for a preview environment?
2. Discuss multi domain mapping?
3. Update step #2 and change the deploy hook to use map_values()
3. Discuss changes needed if you install wordpress in its own directory? <-- do this in a blog post

@todo put this in a blog post as well
------
For the values `SUBDOMAIN_INSTALL`, `MULTISITE`, and `WP_ALLOW_MULTISITE`, including them in the wp-config.php file is
perfectly acceptable. However, if you will be creating multiple multisites, and starting from a canonical repository,
I would suggest defining these values as environment variables, and updating these sections in wp-config.php to
retrieve the information from these environment variables
(e.g. `define('SUBDOMAIN_INSTALL', filter_var(getenv('SUBDOMAIN_INSTALL'),FILTER_VALIDATE_BOOLEAN));`). This allows you
to change the behavior of a specific instance of the codebase by changing these variables instead of having to make
changes directly to wp-config.php.
-------
-->

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
