---
title: "WordPress without Composer on Platform.sh"
weight: 3
sidebarTitle: "Not using Composer"
description: |
    Everything you need to get started with WordPress on Platform.sh. 
---

Starting off:

Why best to put into a subdirectory. 
- will help you keep up to date
- will help keep your files separate from upstreams
- will be cleaner to look at
- makes it possible to load wordpress and all of your themes/plugins as submodules. 

Vanilla approaches:
1. Commit everything
2. Add WP, themes, plugins as submodules (http://ajk.fi/2013/wordpress-as-a-submodule/)

Doesn't matter what you name it, `wp`, `web`, `wordpress` -> we're going with Wordpress to start out with. 

## Deploying "Vanilla" WordPress to Platform.sh

### 1. Install WordPress core to a subdirectory

### 2. Create custom theme and plugin subdirectories

### 3. 

## Updating "Vanilla" WordPress on Platform.sh 

### Update WordPress core

Following [WordPress's update recommendations](https://wordpress.org/support/article/updating-wordpress/), you can add a script to the project root called `update-wpcore.sh` that will quickly update WordPress with your updated repository, either with the latest version or with a specific one you have specified (i.e. `./update-wpcore.sh 5.5.1)

```bash
#!/usr/bin/env bash

TMP='wpcore-update'
WP_INSTALL_DIR='wordpress'

update () {
    curl https://wordpress.org/$(get_version $1) -o $TMP.tar.gz
    rm -rf $WP_INSTALL_DIR/wp-includes && rm -rf $WP_INSTALL_DIR/wp-admin
    tar -xvf $TMP.tar.gz && rm $TMP.tar.gz
}

get_version () {
    if [ -z "$1" ]
    then
        echo "latest"
    else
        echo wordpress-$1.tar.gz
    fi
}

update $1
```

Whenever a new version of WordPress is released, create a new branch and run the script to get the latest version:

```bash
$ git checkout -b update-wp
$ ./update-wpcore.sh
...
$ git add . && git commit -m "Update WordPress."
$ git push platform update-wp
```

And then merge the changes when you're satisfied that your tests are passing as expected. 

### Update themes and plugins

1. Install WordPress core to a subdirectory

    This is introduced as a first step, because it's not uncommon that WordPress developers will try to keep their installations in the project root. This is undesirable on Platform.sh for a number of reasons, but most importantly for your workflow going forward, it's going to make keeping WordPress core up-to-date more of a chore than it needs to be. Once the WordPress core files have been segregated into their own subdirectory called `wordpress`, we can [remove and reinstall future updates](https://wordpress.org/support/article/updating-wordpress/) very easily. 

    ```bash

    ```

{{< note >}}
You can choose the name of the WordPress core subdirectory to be whatever you would like - the most common one's being `wp`, `web`, and `wordpress` as used here. `wordpress` has been chosen for Platform.sh templates and guides because it is often the default install location for [composer-flavored versions of WordPress](/guides/wordpress/deploy/_index.md). Naming it `wordpress` now in your project will make [migrating to use Composer](/guides/wordpress/composer/migrate.md) later on straightforward. Composer is the Platform.sh [recommended](/guides/wordpress/composer/_index.md) way to manage WordPress.
{{< /note >}}