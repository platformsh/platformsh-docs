---
title: Deploying WordPress on Upsun
sidebarTitle: WordPress
weight: -75
description: |
    Welcome to the Upsun documentation specific to the WordPress CMS on Upsun.
    It includes common reference materials useful for deploying WordPress, but also external community and blog
  resources that cover more advanced topics relevant for the CMS.
---


{{< note theme="info" >}}

Before you proceed, be sure to checkout the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)
and the main [Getting started guide](/get-started/here/_index.md). These two resources provide all of the core concepts
and common commands you'll need to know before using the materials below.

{{< /note >}}

Now that you have completed the [Getting started guide](/get-started/here/_index.md), there are a few remaining changes
required in order to have a successful deployment of WordPress on Upsun. WordPress, like Upsun, is extremely flexible
meaning that there are dozens of ways to set up your WordPress site, and dozens of ways to configure your Upsun project.
To complete these getting started steps, the following assumptions are made:
* You are building a composer-based WordPress site using John P Bloch's [WordPress Composer Fork](https://github.com/johnpbloch/wordpress)
* You do not have a composer.json file, or are comfortable making changes to your existing version
* You selected PHP as your runtime, and Mariadb as your service in the Getting Started guide

## Additional Files Required
Copy the following files from the [Platform.sh WordPress Composer template](https://github.com/platformsh-templates/wordpress-composer/)
and add them to the root of your project
* [composer.json](https://raw.githubusercontent.com/platformsh-templates/wordpress-composer/61da65da21039b280b588642cd329a2eb253e472/composer.json)
* [wp-cli.yml](https://github.com/platformsh-templates/wordpress-composer/blob/61da65da21039b280b588642cd329a2eb253e472/wp-cli.yml)
* [wp-config.php](https://github.com/platformsh-templates/wordpress-composer/blob/61da65da21039b280b588642cd329a2eb253e472/wp-config.php)

Add a directory `plugins` and a file `.gitkeep` inside of it.

{{< note theme="info" >}}
If you do not anticipate the need to support non-public plugins, or already have an alternative method to support them
you can skip adding a `plugins` directory to your project.
{{< /note >}}

Add and commit the files and directories you added above.

## `./.upsun/config.yaml`
The Upsun configuration file will need several changes/additions in order for WordPress to successfully deploy and
operate. Open up the Upsun configuration file (`./.upsun/config.yaml`).

### `web:locations`
Inside the configuration file, locate the `web:locations` section for the root (`\`) location. Update this section to
match the following:
```yaml
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
If you are migrating your site and already have a composer.json file, or generated your own instead of starting from
the Platform.sh template version, and have added a `wordpress-install-dir` property for `extras` in your composer.json
file, make sure to update the above `root:` property to the name of the directory where you are installing WordPress.
{{< /note >}}

We now need to add a new location for our uploaded files. At the same level (indentation) as our root location, add
`/wp-content/uploads`:
```yaml
        "/wp-content/uploads":
          root: "wordpress/wp-content/uploads"
          scripts: false
          allow: false
          rules:
            '(?<!\-lock)\.(?i:jpe?g|gif|png|svg|bmp|ico|css|js(?:on)?|eot|ttf|woff|woff2|pdf|docx?|xlsx?|pp[st]x?|psd|odt|key|mp[2-5g]|m4[av]|og[gv]|wav|mov|wm[av]|avi|3g[p2])$':
              allow: true
              expires: 1w
```
### `mounts`
WordPress needs a writable location to store uploaded media. We referenced this location previously, when creating the
new location. Now we need to instruct Upsun to make this location writable. In the Upsun config file, locate the section
`mounts:` that is currently commented it out. Replace that section with the following:
```yaml
    mounts:
      "wordpress/wp-content/uploads":
        source: storage
        source_path: "uploads"
```
{{< note theme="info" >}}
If you have designated a different directory via `wordpress-install-dir` property in your composer.json, update the
mount location accordingly.
{{< /note >}}


