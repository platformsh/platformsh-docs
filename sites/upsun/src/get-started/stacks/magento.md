---
title: Deploy Magento on {{% vendor/name %}}
sidebarTitle: Magento
# sectionBefore: PHP
#layout: single
weight: -58 
description: |
    Complete these steps to successfully deploy Magento on {{% vendor/name %}}.
---

{{< note title="Note" theme="info" >}}
Before you start, check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project) and the main [Getting started guide](/get-started/here/_index.md). They provide all of the core concepts and common commands you need to know before using the materials below.

{{< /note >}}

Before attempting to deploy Magento on Upsun, you must **complete the [Getting started guide](/get-started/here)**. Once that is done, make the following changes to your {{% vendor/name %}} configuration so Magento can successfully deploy and operate. 

{{% guides/requirements name="Drupal" %}}

{{< note title="Authentication" theme="info" >}}
You will not need Adobe Commerce authentication keys for this process but if you would like to learn how to set them up if you want to adjust the composer repo to https://repo.magento.com/, visit [Adobe Commerce Authentication](https://experienceleague.adobe.com/en/docs/commerce-on-cloud/user-guide/develop/authentication-keys).

{{</ note >}}

We will be using the [Upsun Magento template](https://github.com/platformsh-templates/magentoCE24/blob/main/README.md) for this deployment process. The templates specifically features:

- PHP 8.3
- MariaDB 10.6
- Redis 7.2
- Opensearch 2
- RabbitMQ 3.13
- Automatic TLS certificates
- Composer-based build



<details open>

<summary> The template also features an <a href="https://github.com/platformsh-templates/magentoCE24/blob/main/.upsun/config.yaml">Upsun config.yaml</a> file. </summary><br></br>

```yaml {filename=".upsun/config.yaml"}
applications:
    app:
        # The runtime the application uses.
        type: php:8.3
        # Specify additional PHP extensions that should be loaded.
        runtime:
            extensions:
                - xsl
                - sodium
                - redis
                - blackfire
        variables:
            env:
                NVM_VERSION: master
                NODE_VERSION: 20
                MAGENTO_DC_INDEXER__USE_APPLICATION_LOCK: true
                MAGENTO_INDEXER_BATCH_SIZE__CATALOGINVENTORY_STOCK__SIMPLE: 200
                MAGENTO_INDEXER_BATCH_SIZE__CATALOG_CATEGORY_PRODUCT: 666
                MAGENTO_INDEXER_BATCH_SIZE__CATALOGSEARCH_FULLTEXT__PARTIAL_REINDEX: 100
                MAGENTO_INDEXER_BATCH_SIZE__CATALOGSEARCH_FULLTEXT__MYSQL_GET: 500
                MAGENTO_INDEXER_BATCH_SIZE__CATALOGSEARCH_FULLTEXT__ELASTIC_SAVE: 500
                MAGENTO_INDEXER_BATCH_SIZE__CATALOG_PRODUCT_PRICE__SIMPLE: 200
                MAGENTO_INDEXER_BATCH_SIZE__CATALOG_PRODUCT_PRICE__DEFAULT: 500
                MAGENTO_INDEXER_BATCH_SIZE__CATALOG_PRODUCT_PRICE__CONFIGURABLE: 666
                MAGENTO_INDEXER_BATCH_SIZE__CATALOGPERMISSIONS_CATEGORY: 999
                MAGENTO_INDEXER_BATCH_SIZE__INVENTORY__SIMPLE: 210
                MAGENTO_INDEXER_BATCH_SIZE__INVENTORY__DEFAULT: 510
                MAGENTO_INDEXER_BATCH_SIZE__INVENTORY__CONFIGURABLE: 616
            php:
                memory_limit: "512M"
        # Configuration of the build of this application.
        build:
            flavor: none
        dependencies:
            php:
                composer/composer: '^2'
        # The relationships of the application with services or other applications.
        #
        # The left-hand side is the name of the relationship as it will be exposed
        # to the application in the PLATFORM_RELATIONSHIPS variable. The right-hand
        # side is in the form `<service name>:<endpoint name>`.
        relationships:
            database: 
              service: db
              endpoint: write
            database-slave: 
              service: db
              endpoint: read
            redis:
                service: cache
                endpoint: redis
            redis-slave:
                service: cache
                endpoint: redis-replica
            redis-session: session:redis
            opensearch: indexer:opensearch
            rabbitmq: queue:rabbitmq
        # The 'mounts' describe writable, persistent filesystem mounts in the application.
        mounts:
            "/var":
                source: storage
                source_path: "var"
            "/var/log":
                source: instance
                source_path: "log"
            "/app/etc":
                source: storage
                source_path: "etc"
            "/pub/media":
                source: storage
                source_path: "media"
            "/pub/static":
                source: storage
                source_path: "static"
            "/var/report":
                source: tmp
                source_path: "report"
        # The hooks executed at various points in the lifecycle of the application.
        hooks:
            build: |
              set -e
              #prep node as per https://experienceleague.adobe.com/en/docs/commerce-knowledge-base/kb/how-to/configure-npm-to-be-able-to-use-pwa-studio
              unset NPM_CONFIG_PREFIX
              export NVM_DIR="$PLATFORM_APP_DIR/.nvm"
              # install.sh will automatically install NodeJS based on the presence of $NODE_VERSION
              curl -f -o- https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh | bash
              [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
              npm -v
              nvm install $NODE_VERSION
              echo 'unset NPM_CONFIG_PREFIX' >> .environment
              echo 'export NO_UPDATE_NOTIFIER=1' >> .environment
              echo 'export NVM_DIR="$PLATFORM_APP_DIR/.nvm"' >> .environment
              echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> .environment
              #install php application
              composer install --no-dev --no-interaction
              php ./vendor/bin/ece-tools run scenario/build/generate.xml
              php ./vendor/bin/ece-tools run scenario/build/transfer.xml
              sed -i 's/_process>1<\/use_/_process>0<\/use_/g' ${PLATFORM_APP_DIR}/vendor/magento/*/etc/cron_groups.xml
            deploy: |
              php ./vendor/bin/ece-tools run scenario/deploy.xml
            post_deploy: |
              php ./vendor/bin/ece-tools run scenario/post-deploy.xml
        # The configuration of scheduled execution.
        crons:
            magento:
                spec: "*/5 * * * *"
                cmd: bash -c 'for group in $(grep -shoP "(?<=<group id=\")(.+)(?=\">)" {app,vendor}/*/*/etc/cron_groups.xml); do echo -n Running cron group ${group} --- && php -d memory_limit=-1 bin/magento cron:run --group=${group}; done'
            logrotate:
                spec: "45 1 * * *"
                cmd: shtool rotate -n10 $PLATFORM_APP_DIR/var/log/*.log
            reportcleanup:
                spec: "0 2 * * *"
                cmd: find $PLATFORM_APP_DIR/var/report/* -mtime +10 -delete
        # The configuration of app when it is exposed to the web.
        web:
            locations:
                "/":
                    # The public directory of the app, relative to its root.
                    root: "pub"
                    # The front-controller script to send non-static requests to.
                    passthru: "/index.php"
                    index:
                        - index.php
                    expires: -1
                    scripts: true
                    allow: false
                    rules:
                        ? \.(css|js|map|hbs|gif|jpe?g|png|tiff|wbmp|ico|jng|bmp|svgz|midi?|mp?ga|mp2|mp3|m4a|ra|weba|3gpp?|mp4|mpe?g|mpe|ogv|mov|webm|flv|mng|asx|asf|wmv|avi|ogx|swf|jar|ttf|eot|woff|otf|html?)$
                        :   allow: true
                        ^/sitemap(.*)\.xml$:
                            passthru: "/media/sitemap$1.xml"
                        ^/.well-known/apple-developer-merchantid-domain-association.xml$:
                            passthru: "/media/apple-developer-merchantid-domain-association.xml"
                        ^/.well-known/apple-developer-merchantid-domain-association.txt$:
                            passthru: "/media/apple-developer-merchantid-domain-association.txt"
                "/media":
                    root: "pub/media"
                    allow: true
                    scripts: false
                    expires: 1y
                    passthru: "/get.php"
                "/static":
                    root: "pub/static"
                    allow: true
                    scripts: false
                    expires: 1y
                    passthru: "/front-static.php"
                    rules:
                        ^/static/version\d+/(?<resource>.*)$:
                            passthru: "/static/$resource"
        source:
            root: /
services:
    db:
        type: mariadb:10.6
        configuration:
          properties:
            optimizer_switch: "rowid_filter=off"
            optimizer_use_condition_selectivity: 1
          schemas:
            - main
          endpoints:
            write:
              default_schema: main
              privileges:
                main: admin
            read:
              default_schema: main
              privileges:
                main: ro
    
    cache:
        type: redis:7.2
        configuration:
            maxmemory_policy: allkeys-lru
    
    session:
        type: redis-persistent:7.2
        configuration:
            maxmemory_policy: allkeys-lru
    
    indexer:
        type: opensearch:2
        configuration:
            plugins:
                - analysis-phonetic
                - analysis-icu
    queue:
        type: rabbitmq:3.13
routes:
    https://{default}/:
        type: upstream
        upstream: app:http
    https://{default}/static/:
        type: upstream
        upstream: app:http
        cache:
            enabled: true
            cookies: []
    https://{all}/:
        type: upstream
        upstream: app:http
    https://{all}/static/:
        type: upstream
        upstream: app:http
        cache:
            enabled: true
            cookies: []

```

</details>


## Create project

Copy the following command into command line:

`upsun project:create --init-repo https://github.com/platformsh-templates/magentoCE24/`

In command line, you will be prompted to do the following:

- Select an organization to create the project under
- Select a title for your project 
- Select a [region to deploy from](https://docs.upsun.com/development/regions.html#regions)
- Select your default branch
- Select whether you would like to set your new project as the remote for any existing repositories that have been detected under your organization

Once you have made your selections, the Upsun bot will activate your project.

{{< note title="Note" theme="info" >}}
Note that this project will not have an estimated monthly cost.

{{< /note >}}

When your project is created, you will be provided with the following details to access it:

- Region
- Project ID
- Project title
- Project URL
- Git URL 

## Configure resources

Copy the Project URL into your browser. You should see your newly created project in the Upsun console. For example, if you had named your Magento project `Mage`, you would see something similar to the screenshot below:

![Your magento project in the Upsun console](/images/guides/magento/console-mage.png) 

You will be prompted to configure your resources. At this stage you can select the CPU, RAM, disk size and instances for your Magento project. 

![Configure the resources for your Magento project in the Upsun console](/images/guides/magento/resources-mage-1.png) 

## View your log 

Now that your resources have been configured, you can view a log of how Upsun creates your project. In the recents section, click the three dots to the right of the activity about your `updated resource allocation on Main`.

![Navigate to the log to see your Magento project being created](/images/guides/magento/log-console-1.png) 

<details>

<summary> <b>Expand to view a log example for a Magento project</b> </summary><br></br>

```
 Configuring resources
   Setting 'app' resources to 0.1 CPU, 64MB RAM.
   Setting 'app' disk to 1024MB.
   Setting 'db' resources to 0.1 CPU, 448MB RAM.
   Setting 'db' disk to 256MB.
   Setting 'cache' resources to 0.1 CPU, 352MB RAM.
   Setting 'session' resources to 0.1 CPU, 352MB RAM.
   Setting 'session' disk to 256MB.
   Setting 'indexer' resources to 0.1 CPU, 448MB RAM.
   Setting 'indexer' disk to 256MB.
   Setting 'queue' resources to 0.1 CPU, 448MB RAM.
   Setting 'queue' disk to 256MB.
 
 Building application 'app' (runtime type: php:8.3, tree: 392d8f3)
   Generating runtime configuration.
   
   Installing build dependencies...
     Installing php build dependencies: composer/composer
     W: Changed current directory to /app/.global/composer/composer
     W: No composer.lock file present. Updating dependencies to latest instead of installing from lock file. See https://getcomposer.org/install for more information.
     W: Loading composer repositories with package information
     W: Updating dependencies
     W: Lock file operations: 29 installs, 0 updates, 0 removals
     W:   - Locking composer/ca-bundle (1.5.5)
     W:   - Locking composer/class-map-generator (1.6.0)
     W:   - Locking composer/composer (2.8.5)
     W:   - Locking composer/metadata-minifier (1.0.0)
     W:   - Locking composer/pcre (3.3.2)
     W:   - Locking composer/semver (3.4.3)
     W:   - Locking composer/spdx-licenses (1.5.8)
     W:   - Locking composer/xdebug-handler (3.0.5)
     W:   - Locking justinrainbow/json-schema (5.3.0)
     W:   - Locking psr/container (2.0.2)
     W:   - Locking psr/log (3.0.2)
     W:   - Locking react/promise (v3.2.0)
     W:   - Locking seld/jsonlint (1.11.0)
     W:   - Locking seld/phar-utils (1.2.1)
     W:   - Locking seld/signal-handler (2.0.2)
     W:   - Locking symfony/console (v7.2.1)
     W:   - Locking symfony/deprecation-contracts (v3.5.1)
     W:   - Locking symfony/filesystem (v7.2.0)
     W:   - Locking symfony/finder (v7.2.2)
     W:   - Locking symfony/polyfill-ctype (v1.31.0)
     W:   - Locking symfony/polyfill-intl-grapheme (v1.31.0)
     W:   - Locking symfony/polyfill-intl-normalizer (v1.31.0)
     W:   - Locking symfony/polyfill-mbstring (v1.31.0)
     W:   - Locking symfony/polyfill-php73 (v1.31.0)
     W:   - Locking symfony/polyfill-php80 (v1.31.0)
     W:   - Locking symfony/polyfill-php81 (v1.31.0)
     W:   - Locking symfony/process (v7.2.0)
     W:   - Locking symfony/service-contracts (v3.5.1)
     W:   - Locking symfony/string (v7.2.0)
     W: Writing lock file
     W: Installing dependencies from lock file (including require-dev)
     W: Package operations: 29 installs, 0 updates, 0 removals
     W:   - Downloading symfony/process (v7.2.0)
     W:   - Downloading symfony/polyfill-php81 (v1.31.0)
     W:   - Downloading symfony/polyfill-php80 (v1.31.0)
     W:   - Downloading symfony/polyfill-php73 (v1.31.0)
     W:   - Downloading symfony/finder (v7.2.2)
     W:   - Downloading symfony/polyfill-mbstring (v1.31.0)
     W:   - Downloading symfony/polyfill-ctype (v1.31.0)
     W:   - Downloading symfony/filesystem (v7.2.0)
     W:   - Downloading symfony/polyfill-intl-normalizer (v1.31.0)
     W:   - Downloading symfony/polyfill-intl-grapheme (v1.31.0)
     W:   - Downloading symfony/string (v7.2.0)
     W:   - Downloading symfony/deprecation-contracts (v3.5.1)
     W:   - Downloading psr/container (2.0.2)
     W:   - Downloading symfony/service-contracts (v3.5.1)
     W:   - Downloading symfony/console (v7.2.1)
     W:   - Downloading seld/signal-handler (2.0.2)
     W:   - Downloading seld/phar-utils (1.2.1)
     W:   - Downloading seld/jsonlint (1.11.0)
     W:   - Downloading react/promise (v3.2.0)
     W:   - Downloading psr/log (3.0.2)
     W:   - Downloading justinrainbow/json-schema (5.3.0)
     W:   - Downloading composer/pcre (3.3.2)
     W:   - Downloading composer/xdebug-handler (3.0.5)
     W:   - Downloading composer/spdx-licenses (1.5.8)
     W:   - Downloading composer/semver (3.4.3)
     W:   - Downloading composer/metadata-minifier (1.0.0)
     W:   - Downloading composer/class-map-generator (1.6.0)
     W:   - Downloading composer/ca-bundle (1.5.5)
     W:   - Downloading composer/composer (2.8.5)
     W:   - Installing symfony/process (v7.2.0): Extracting archive
     W:   - Installing symfony/polyfill-php81 (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-php80 (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-php73 (v1.31.0): Extracting archive
     W:   - Installing symfony/finder (v7.2.2): Extracting archive
     W:   - Installing symfony/polyfill-mbstring (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-ctype (v1.31.0): Extracting archive
     W:   - Installing symfony/filesystem (v7.2.0): Extracting archive
     W:   - Installing symfony/polyfill-intl-normalizer (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-intl-grapheme (v1.31.0): Extracting archive
     W:   - Installing symfony/string (v7.2.0): Extracting archive
     W:   - Installing symfony/deprecation-contracts (v3.5.1): Extracting archive
     W:   - Installing psr/container (2.0.2): Extracting archive
     W:   - Installing symfony/service-contracts (v3.5.1): Extracting archive
     W:   - Installing symfony/console (v7.2.1): Extracting archive
     W:   - Installing seld/signal-handler (2.0.2): Extracting archive
     W:   - Installing seld/phar-utils (1.2.1): Extracting archive
     W:   - Installing seld/jsonlint (1.11.0): Extracting archive
     W:   - Installing react/promise (v3.2.0): Extracting archive
     W:   - Installing psr/log (3.0.2): Extracting archive
     W:   - Installing justinrainbow/json-schema (5.3.0): Extracting archive
     W:   - Installing composer/pcre (3.3.2): Extracting archive
     W:   - Installing composer/xdebug-handler (3.0.5): Extracting archive
     W:   - Installing composer/spdx-licenses (1.5.8): Extracting archive
     W:   - Installing composer/semver (3.4.3): Extracting archive
     W:   - Installing composer/metadata-minifier (1.0.0): Extracting archive
     W:   - Installing composer/class-map-generator (1.6.0): Extracting archive
     W:   - Installing composer/ca-bundle (1.5.5): Extracting archive
     W:   - Installing composer/composer (2.8.5): Extracting archive
     W: Generating optimized autoload files
     W: 24 packages you are using are looking for funding.
     W: Use the `composer fund` command to find out more!
   
   Executing build hook...
     W:   % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
     W:                                  Dload  Upload   Total   Spent    Left  Speed
     W: 
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 16631  100 16631    0     0  98356      0 --:--:-- --:--:-- --:--:--   97k
     => Downloading nvm from git to '/app/.nvm'
     W: Cloning into '/app/.nvm'...
     
=> * (HEAD detached at FETCH_HEAD)
       master
     => Compressing and cleaning up git repository
     
     => Profile not found. Tried ~/.bashrc, ~/.bash_profile, ~/.zprofile, ~/.zshrc, and ~/.profile.
     => Create one of them and run this script again
        OR
     => Append the following lines to the correct file yourself:
     
     export NVM_DIR="$HOME/.nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
     
     W: npm notice
     W: npm notice New major version of npm available! 10.8.2 -> 11.1.0
     W: npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.1.0
     W: npm notice To update run: npm install -g npm@11.1.0
     W: npm notice
     => You currently have modules installed globally with `npm`. These will no
     => longer be linked to the active version of Node when you install a new node
     => with `nvm`; and they may (depending on how you construct your `$PATH`)
     => override the binaries of modules installed with `nvm`:
     
     /usr/lib
     ├── corepack@0.30.0
     
     => If you wish to uninstall them at a later point (or re-install them under your
     => `nvm` node installs), you can remove them from the system Node as follows:
     
          $ nvm use system
          $ npm uninstall -g a_module
     
     => Installing Node.js version 20
     Downloading and installing node v20.18.3...
     W: Downloading https://nodejs.org/dist/v20.18.3/node-v20.18.3-linux-x64.tar.xz...
     W: 
                                                                           0.1%
##############                                                            20.6%
##########################                                                36.6%
############################################                              62.3%
##############################################################            87.0%
######################################################################## 100.0%
     W: Computing checksum with sha256sum
     W: Checksums matched!
     Now using node v20.18.3 (npm v10.8.2)
     Creating default alias: default -> 20 (-> v20.18.3 *)
     => Node.js version 20 has been successfully installed
     => Close and reopen your terminal to start using nvm or run the following to use it now:
     
     export NVM_DIR="$HOME/.nvm"
     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
     10.8.2
     W: v20.18.3 is already installed.
     Now using node v20.18.3 (npm v10.8.2)
     W: Installing dependencies from lock file
     W: Verifying lock file contents can be installed on current platform.
     W: Package operations: 561 installs, 0 updates, 0 removals
     W:   - Downloading php-http/discovery (1.20.0)
     W:   - Downloading wikimedia/less.php (v3.2.1)
     W:   - Downloading webonyx/graphql-php (v15.19.1)
     W:   - Downloading tedivm/jshrink (v1.7.0)
     W:   - Downloading symfony/process (v6.4.15)
     W:   - Downloading symfony/intl (v6.4.15)
     W:   - Downloading symfony/string (v6.4.15)
     W:   - Downloading psr/container (1.1.2)
     W:   - Downloading symfony/console (v6.4.17)
     W:   - Downloading ramsey/collection (2.0.0)
     W:   - Downloading brick/math (0.12.1)
     W:   - Downloading ramsey/uuid (4.7.6)
     W:   - Downloading monolog/monolog (2.10.0)
     W:   - Downloading magento/zend-exception (1.16.1)
     W:   - Downloading magento/zend-log (1.16.1)
     W:   - Downloading magento/zend-cache (1.16.1)
     W:   - Downloading magento/zend-memory (1.16.0)
     W:   - Downloading magento/zend-pdf (1.16.4)
     W:   - Downloading magento/zend-loader (1.16.1)
     W:   - Downloading magento/zend-db (1.16.2)
     W:   - Downloading react/promise (v2.11.0)
     W:   - Downloading magento/composer-dependency-version-audit-plugin (0.1.6)
     W:   - Downloading psr/http-message (2.0)
     W:   - Downloading laminas/laminas-stdlib (3.20.0)
     W:   - Downloading laminas/laminas-servicemanager (3.23.0)
     W:   - Downloading laminas/laminas-validator (2.64.2)
     W:   - Downloading laminas/laminas-escaper (2.15.0)
     W:   - Downloading laminas/laminas-uri (2.13.0)
     W:   - Downloading laminas/laminas-permissions-acl (2.17.0)
     W:   - Downloading laminas/laminas-math (3.8.1)
     W:   - Downloading laminas/laminas-loader (2.11.1)
     W:   - Downloading laminas/laminas-translator (1.1.0)
     W:   - Downloading laminas/laminas-i18n (2.29.0)
     W:   - Downloading laminas/laminas-http (2.21.0)
     W:   - Downloading laminas/laminas-crypt (3.12.0)
     W:   - Downloading laminas/laminas-config (3.10.1)
     W:   - Downloading laminas/laminas-oauth (2.7.0)
     W:   - Downloading laminas/laminas-mime (2.12.0)
     W:   - Downloading webmozart/assert (1.11.0)
     W:   - Downloading symfony/polyfill-intl-idn (v1.31.0)
     W:   - Downloading laminas/laminas-mail (2.25.1)
     W:   - Downloading laminas/laminas-filter (2.40.0)
     W:   - Downloading laminas/laminas-file (2.13.1)
     W:   - Downloading laminas/laminas-code (4.16.0)
     W:   - Downloading psr/http-client (1.0.3)
     W:   - Downloading ralouphie/getallheaders (3.0.3)
     W:   - Downloading psr/http-factory (1.1.0)
     W:   - Downloading guzzlehttp/psr7 (2.7.0)
     W:   - Downloading guzzlehttp/promises (2.0.4)
     W:   - Downloading guzzlehttp/guzzle (7.9.2)
     W:   - Downloading ezyang/htmlpurifier (v4.18.0)
     W:   - Downloading colinmollenhour/credis (v1.16.2)
     W:   - Downloading colinmollenhour/php-redis-session-abstract (v1.5.5)
     W:   - Downloading magento/framework (103.0.7-p4)
     W:   - Downloading magento/magento-composer-installer (0.4.0)
     W:   - Downloading magento/composer-root-update-plugin (2.0.4)
     W:   - Downloading magento/inventory-composer-installer (1.2.0)
     W:   - Downloading 2tvenom/cborencode (1.0.2)
     W:   - Downloading magento/module-adobe-ims-api (2.2.1)
     W:   - Downloading magento/module-user (101.2.7)
     W:   - Downloading magento/module-ui (101.2.7-p4)
     W:   - Downloading magento/module-store (101.1.7)
     W:   - Downloading magento/module-media-storage (100.4.6)
     W:   - Downloading magento/module-config (101.2.7-p4)
     W:   - Downloading magento/module-theme (101.1.7)
     W:   - Downloading magento/module-developer (100.4.7)
     W:   - Downloading magento/module-require-js (100.4.3)
     W:   - Downloading magento/module-deploy (100.4.7)
     W:   - Downloading magento/module-backend (102.0.7-p4)
     W:   - Downloading magento/module-translation (100.4.7)
     W:   - Downloading magento/module-security (100.4.7)
     W:   - Downloading magento/module-sales (103.0.7-p4)
     W:   - Downloading magento/module-wishlist (101.2.7-p3)
     W:   - Downloading magento/module-tax (100.4.7)
     W:   - Downloading magento/module-shipping (100.4.7-p2)
     W:   - Downloading magento/module-sales-sequence (100.4.4)
     W:   - Downloading magento/module-quote (101.2.7-p4)
     W:   - Downloading magento/module-directory (100.4.7-p4)
     W:   - Downloading magento/module-widget (101.2.7)
     W:   - Downloading magento/module-url-rewrite (102.0.6)
     W:   - Downloading magento/module-variable (100.4.5)
     W:   - Downloading magento/module-cms (104.0.7-p4)
     W:   - Downloading magento/module-email (101.1.7-p4)
     W:   - Downloading magento/module-catalog (104.0.7-p4)
     W:   - Downloading magento/module-cms-url-rewrite (100.4.6)
     W:   - Downloading magento/module-eav (102.1.7)
     W:   - Downloading magento/module-import-export (101.0.7-p4)
     W:   - Downloading magento/module-customer (103.0.7-p4)
     W:   - Downloading magento/module-catalog-url-rewrite (100.4.7)
     W:   - Downloading magento/module-catalog-inventory (100.4.7)
     W:   - Downloading league/mime-type-detection (1.16.0)
     W:   - Downloading league/flysystem (2.5.0)
     W:   - Downloading mtdowling/jmespath.php (2.8.0)
     W:   - Downloading aws/aws-crt-php (v1.2.7)
     W:   - Downloading aws/aws-sdk-php (3.339.12)
     W:   - Downloading league/flysystem-aws-s3-v3 (2.5.0)
     W:   - Downloading magento/module-remote-storage (100.4.5)
     W:   - Downloading magento/module-aws-s3 (100.4.5)
     W:   - Downloading magento/module-authorization (100.4.7)
     W:   - Downloading magento/module-catalog-import-export (101.1.7-p3)
     W:   - Downloading magento/framework-message-queue (100.4.7)
     W:   - Downloading magento/framework-bulk (101.0.3)
     W:   - Downloading magento/module-asynchronous-operations (100.4.7)
     W:   - Downloading magento/module-product-alert (100.4.6)
     W:   - Downloading magento/module-page-cache (100.4.7)
     W:   - Downloading magento/module-checkout (100.4.7)
     W:   - Downloading magento/module-gift-message (100.4.6)
     W:   - Downloading magento/module-downloadable (100.4.7-p4)
     W:   - Downloading magento/module-msrp (100.4.6)
     W:   - Downloading paragonie/random_compat (v9.99.100)
     W:   - Downloading paragonie/constant_time_encoding (v3.0.0)
     W:   - Downloading phpseclib/phpseclib (3.0.43)
     W:   - Downloading php-amqplib/php-amqplib (v3.2.0)
     W:   - Downloading magento/framework-amqp (100.4.5)
     W:   - Downloading magento/module-indexer (100.4.7)
     W:   - Downloading magento/module-rule (100.4.6)
     W:   - Downloading magento/module-catalog-rule (101.2.7)
     W:   - Downloading magento/module-sales-rule (101.2.7-p4)
     W:   - Downloading magento/module-newsletter (100.4.7-p2)
     W:   - Downloading magento/module-review (100.4.7)
     W:   - Downloading magento/module-reports (100.4.7-p4)
     W:   - Downloading magento/module-payment (100.4.7)
     W:   - Downloading laminas/laminas-db (2.20.0)
     W:   - Downloading laminas/laminas-text (2.12.1)
     W:   - Downloading laminas/laminas-eventmanager (3.14.0)
     W:   - Downloading laminas/laminas-session (2.24.0)
     W:   - Downloading laminas/laminas-recaptcha (3.8.0)
     W:   - Downloading laminas/laminas-captcha (2.18.0)
     W:   - Downloading magento/module-captcha (100.4.7)
     W:   - Downloading magento/module-csp (100.4.6)
     W:   - Downloading magento/module-contact (100.4.6)
     W:   - Downloading magento/module-integration (100.4.7-p2)
     W:   - Downloading magento/module-rss (100.4.5)
     W:   - Downloading magento/module-encryption-key (100.4.5-p4)
     W:   - Downloading magento/module-bundle (101.0.7-p4)
     W:   - Downloading magento/module-cron (100.4.7)
     W:   - Downloading magento/module-backup (100.4.7)
     W:   - Downloading magento/module-adobe-ims (2.2.1)
     W:   - Downloading psr/clock (1.0.0)
     W:   - Downloading spomky-labs/otphp (11.3.0)
     W:   - Downloading dasprid/enum (1.0.6)
     W:   - Downloading bacon/bacon-qr-code (2.0.8)
     W:   - Downloading endroid/qr-code (4.8.5)
     W:   - Downloading christian-riesen/base32 (1.6.0)
     W:   - Downloading magento/module-two-factor-auth (1.1.6-p3)
     W:   - Downloading magento/module-jwt-user-token (100.4.2-p2)
     W:   - Downloading magento/module-admin-adobe-ims (100.5.2)
     W:   - Downloading magento/module-admin-adobe-ims-two-factor-auth (1.0.1)
     W:   - Downloading nikic/php-parser (v5.4.0)
     W:   - Downloading brick/varexporter (0.5.0)
     W:   - Downloading ezimuel/guzzlestreams (3.1.0)
     W:   - Downloading zordius/lightncandy (v1.2.6)
     W:   - Downloading magento/module-cache-invalidate (100.4.5)
     W:   - Downloading fastly/magento2 (1.2.225)
     W:   - Downloading firebase/php-jwt (v6.11.0)
     W:   - Downloading illuminate/macroable (v11.42.0)
     W:   - Downloading psr/simple-cache (3.0.0)
     W:   - Downloading illuminate/contracts (v11.42.0)
     W:   - Downloading illuminate/conditionable (v11.42.0)
     W:   - Downloading illuminate/collections (v11.42.0)
     W:   - Downloading laminas/laminas-router (3.14.0)
     W:   - Downloading laminas/laminas-json (3.7.1)
     W:   - Downloading laminas/laminas-view (2.36.0)
     W:   - Downloading magento/module-adobe-stock-image-api (1.3.3)
     W:   - Downloading magento/module-media-gallery-ui-api (100.4.5)
     W:   - Downloading magento/module-media-gallery-api (101.0.6)
     W:   - Downloading magento/module-media-gallery-synchronization-api (100.4.5)
     W:   - Downloading magento/module-media-gallery-metadata-api (100.4.4)
     W:   - Downloading magento/module-media-content-api (100.4.6)
     W:   - Downloading magento/module-media-gallery-ui (100.4.6)
     W:   - Downloading magento/module-adobe-stock-client-api (2.1.4)
     W:   - Downloading magento/module-adobe-stock-asset-api (2.0.3)
     W:   - Downloading magento/module-adobe-stock-image-admin-ui (1.3.5-p1)
     W:   - Downloading magento/module-adobe-stock-image (1.3.5)
     W:   - Downloading astock/stock-api-libphp (1.1.6)
     W:   - Downloading magento/module-adobe-stock-client (1.3.4)
     W:   - Downloading magento/module-media-gallery (100.4.6)
     W:   - Downloading magento/module-adobe-stock-asset (1.3.3)
     W:   - Downloading magento/module-adobe-stock-admin-ui (1.3.4)
     W:   - Downloading symfony/yaml (v6.4.18)
     W:   - Downloading symfony/serializer (v6.4.18)
     W:   - Downloading symfony/var-exporter (v7.2.0)
     W:   - Downloading symfony/dependency-injection (v6.4.16)
     W:   - Downloading symfony/config (v6.4.14)
     W:   - Downloading symfony/translation-contracts (v3.5.1)
     W:   - Downloading symfony/translation (v7.2.2)
     W:   - Downloading symfony/polyfill-php83 (v1.31.0)
     W:   - Downloading symfony/clock (v7.2.0)
     W:   - Downloading carbonphp/carbon-doctrine-types (3.2.0)
     W:   - Downloading nesbot/carbon (3.8.5)
     W:   - Downloading friendsofphp/proxy-manager-lts (v1.0.18)
     W:   - Downloading symfony/proxy-manager-bridge (v6.4.13)
     W:   - Downloading magento/quality-patches (1.1.59)
     W:   - Downloading magento/magento-cloud-patches (1.1.3)
     W:   - Downloading illuminate/config (v11.42.0)
     W:   - Downloading magento/magento-cloud-docker (1.4.1)
     W:   - Downloading colinmollenhour/cache-backend-redis (1.17.1)
     W:   - Downloading magento/magento-cloud-components (1.1.1)
     W:   - Downloading graylog2/gelf-php (2.0.2)
     W:   - Downloading magento/ece-tools (2002.2.1)
     W:   - Downloading magento/module-aws-s3-page-builder (1.0.4)
     W:   - Downloading phpgt/propfunc (v1.0.1)
     W:   - Downloading phpgt/cssxpath (v1.3.0)
     W:   - Downloading phpgt/dom (v4.1.7)
     W:   - Downloading magento/module-catalog-widget (100.4.7)
     W:   - Downloading magento/module-page-builder (2.2.5-p4)
     W:   - Downloading magento/module-analytics (100.4.7)
     W:   - Downloading magento/module-page-builder-analytics (1.6.4)
     W:   - Downloading magento/module-catalog-page-builder-analytics (1.6.4)
     W:   - Downloading magento/module-cms-page-builder-analytics (1.6.4)
     W:   - Downloading magento/module-inventory-api (1.2.5)
     W:   - Downloading magento/module-inventory-sales-api (1.2.4)
     W:   - Downloading magento/module-inventory-catalog-api (1.3.5)
     W:   - Downloading magento/module-inventory-advanced-checkout (1.2.4)
     W:   - Downloading magento/module-bundle-import-export (100.4.6)
     W:   - Downloading magento/module-inventory-bundle-import-export (1.1.3)
     W:   - Downloading magento/module-inventory-configuration-api (1.2.3)
     W:   - Downloading magento/module-inventory-bundle-product (1.2.4)
     W:   - Downloading magento/module-sales-inventory (100.4.4)
     W:   - Downloading magento/module-inventory-source-selection-api (1.4.4)
     W:   - Downloading magento/module-inventory (1.2.5)
     W:   - Downloading magento/module-inventory-source-deduction-api (1.2.4)
     W:   - Downloading magento/module-inventory-reservations-api (1.2.3)
     W:   - Downloading magento/module-inventory-sales (1.3.2)
     W:   - Downloading magento/module-inventory-multi-dimensional-indexer-api (1.2.3)
     W:   - Downloading magento/module-inventory-indexer (2.2.2)
     W:   - Downloading magento/module-inventory-catalog-admin-ui (1.2.5)
     W:   - Downloading magento/module-inventory-bundle-product-admin-ui (1.2.4)
     W:   - Downloading magento/module-inventory-bundle-product-indexer (1.1.4)
     W:   - Downloading magento/module-inventory-cache (1.2.5)
     W:   - Downloading magento/module-catalog-search (102.0.7-p3)
     W:   - Downloading magento/module-search (101.1.7-p3)
     W:   - Downloading magento/module-inventory-catalog-search (1.2.5)
     W:   - Downloading magento/module-inventory-catalog-search-bundle-product (1.0.3)
     W:   - Downloading magento/module-configurable-product (100.4.7)
     W:   - Downloading magento/module-inventory-catalog-search-configurable-product (1.0.3)
     W:   - Downloading magento/module-inventory-configuration (1.2.4)
     W:   - Downloading magento/module-inventory-catalog (1.3.2)
     W:   - Downloading magento/module-inventory-configurable-product (1.2.5)
     W:   - Downloading magento/module-inventory-configurable-product-admin-ui (1.2.5)
     W:   - Downloading magento/module-inventory-configurable-product-frontend-ui (1.0.5)
     W:   - Downloading magento/module-inventory-configurable-product-indexer (1.2.5)
     W:   - Downloading magento/module-inventory-distance-based-source-selection-api (1.2.3)
     W:   - Downloading magento/module-inventory-distance-based-source-selection (1.2.4)
     W:   - Downloading magento/module-inventory-distance-based-source-selection-admin-ui (1.2.3)
     W:   - Downloading magento/module-inventory-elasticsearch (1.2.4)
     W:   - Downloading magento/module-inventory-export-stock-api (1.2.3)
     W:   - Downloading magento/module-grouped-product (100.4.7)
     W:   - Downloading magento/module-inventory-export-stock (1.2.4)
     W:   - Downloading magento/module-inventory-graph-ql (1.2.4)
     W:   - Downloading magento/module-inventory-grouped-product (1.3.2)
     W:   - Downloading magento/module-inventory-grouped-product-admin-ui (1.2.4)
     W:   - Downloading magento/module-inventory-grouped-product-indexer (1.2.5)
     W:   - Downloading magento/module-inventory-import-export (1.2.5)
     W:   - Downloading magento/module-inventory-in-store-pickup-api (1.1.3)
     W:   - Downloading magento/module-inventory-in-store-pickup (1.1.3)
     W:   - Downloading magento/module-inventory-admin-ui (1.2.5-p2)
     W:   - Downloading magento/module-inventory-in-store-pickup-admin-ui (1.1.4)
     W:   - Downloading magento/module-inventory-in-store-pickup-shipping-api (1.1.3)
     W:   - Downloading magento/module-inventory-in-store-pickup-sales-api (1.1.3-p1)
     W:   - Downloading magento/module-inventory-in-store-pickup-frontend (1.1.5)
     W:   - Downloading magento/module-inventory-in-store-pickup-graph-ql (1.1.4)
     W:   - Downloading magento/module-inventory-in-store-pickup-multishipping (1.1.3)
     W:   - Downloading magento/module-webapi (100.4.6-p1)
     W:   - Downloading magento/module-graph-ql (100.4.7)
     W:   - Downloading magento/module-graph-ql-resolver-cache (100.4.0)
     W:   - Downloading magento/module-eav-graph-ql (100.4.4)
     W:   - Downloading magento/module-advanced-search (100.4.5-p3)
     W:   - Downloading magento/module-catalog-graph-ql (100.4.7)
     W:   - Downloading magento/module-sales-graph-ql (100.4.7)
     W:   - Downloading magento/module-graph-ql-cache (100.4.4)
     W:   - Downloading magento/module-customer-graph-ql (100.4.7)
     W:   - Downloading magento/module-quote-graph-ql (100.4.7)
     W:   - Downloading magento/module-inventory-in-store-pickup-quote-graph-ql (1.1.3)
     W:   - Downloading magento/module-inventory-in-store-pickup-sales (1.1.3)
     W:   - Downloading magento/module-inventory-in-store-pickup-quote (1.1.3)
     W:   - Downloading magento/module-inventory-in-store-pickup-sales-admin-ui (1.1.5)
     W:   - Downloading magento/module-inventory-in-store-pickup-shipping (1.1.4)
     W:   - Downloading magento/module-inventory-in-store-pickup-shipping-admin-ui (1.1.3)
     W:   - Downloading magento/module-inventory-in-store-pickup-webapi-extension (1.1.3)
     W:   - Downloading magento/module-inventory-low-quantity-notification-api (1.2.4)
     W:   - Downloading magento/module-inventory-low-quantity-notification (1.2.4)
     W:   - Downloading magento/module-inventory-low-quantity-notification-admin-ui (1.2.4)
     W:   - Downloading magento/module-inventory-product-alert (1.2.4)
     W:   - Downloading magento/module-inventory-quote-graph-ql (1.0.4)
     W:   - Downloading magento/module-inventory-requisition-list (1.2.5)
     W:   - Downloading magento/module-inventory-reservation-cli (1.2.4)
     W:   - Downloading magento/module-inventory-reservations (1.2.3)
     W:   - Downloading magento/module-inventory-sales-admin-ui (1.2.5)
     W:   - Downloading magento/module-inventory-sales-async-order (100.2.1)
     W:   - Downloading magento/module-inventory-catalog-frontend-ui (1.0.4)
     W:   - Downloading magento/module-inventory-sales-frontend-ui (1.2.4)
     W:   - Downloading magento/module-inventory-setup-fixture-generator (1.2.3)
     W:   - Downloading magento/module-inventory-shipping (1.2.4)
     W:   - Downloading magento/module-inventory-shipping-admin-ui (1.2.5)
     W:   - Downloading magento/module-inventory-source-selection (1.2.3)
     W:   - Downloading magento/module-inventory-swatches-frontend-ui (1.0.3)
     W:   - Downloading magento/module-inventory-visual-merchandiser (1.1.5)
     W:   - Downloading magento/module-inventory-wishlist (1.0.4)
     W:   - Downloading magento/module-page-builder-admin-analytics (1.1.4)
     W:   - Downloading magento/module-query-xml (103.3.18)
     W:   - Downloading magento/services-connector (1.3.6)
     W:   - Downloading magento/module-services-id (3.2.7)
     W:   - Downloading magento/module-data-exporter (103.3.18)
     W:   - Downloading magento/module-saas-common (103.3.18)
     W:   - Downloading magento/module-graph-ql-server (1.0.3)
     W:   - Downloading magento/module-admin-graph-ql-server (1.0.4)
     W:   - Downloading magento/module-services-id-graph-ql-server (1.1.6)
     W:   - Downloading magento/module-services-id-layout (1.1.4)
     W:   - Downloading magento/module-store-data-exporter (2.10.1)
     W:   - Downloading magento/module-vault (101.2.7)
     W:   - Downloading magento/module-service-proxy (2.10.1)
     W:   - Downloading magento/module-payment-services-paypal (2.10.1)
     W:   - Downloading magento/module-payment-services-base (2.10.1)
     W:   - Downloading magento/module-payment-services-dashboard (2.10.1)
     W:   - Downloading magento/module-instant-purchase (100.4.6-p3)
     W:   - Downloading magento/module-checkout-agreements (100.4.6)
     W:   - Downloading magento/module-sales-data-exporter (2.10.1)
     W:   - Downloading magento/module-payment-services-saas-export (2.10.1)
     W:   - Downloading magento/module-payment-services-paypal-graph-ql (2.10.1)
     W:   - Downloading symfony/http-foundation (v7.2.3)
     W:   - Downloading psr/event-dispatcher (1.0.0)
     W:   - Downloading symfony/event-dispatcher-contracts (v3.5.1)
     W:   - Downloading symfony/event-dispatcher (v7.2.0)
     W:   - Downloading symfony/var-dumper (v7.2.3)
     W:   - Downloading symfony/error-handler (v7.2.3)
     W:   - Downloading symfony/http-kernel (v7.2.3)
     W:   - Downloading symfony/http-client-contracts (v3.5.2)
     W:   - Downloading symfony/http-client (v7.2.3)
     W:   - Downloading spomky-labs/pki-framework (1.2.2)
     W:   - Downloading spomky-labs/aes-key-wrap (v7.0.0)
     W:   - Downloading psr/cache (3.0.0)
     W:   - Downloading paragonie/sodium_compat (v2.1.0)
     W:   - Downloading web-token/jwt-framework (3.4.7)
     W:   - Downloading tubalmartin/cssmin (v4.1.1)
     W:   - Downloading symfony/css-selector (v7.2.0)
     W:   - Downloading sabberworm/php-css-parser (v8.7.0)
     W:   - Downloading pelago/emogrifier (v7.3.0)
     W:   - Downloading magento/composer (1.10.0)
     W:   - Downloading laminas/laminas-server (2.18.0)
     W:   - Downloading laminas/laminas-soap (2.14.0)
     W:   - Downloading webimpress/safe-writer (2.2.0)
     W:   - Downloading laminas/laminas-modulemanager (2.17.0)
     W:   - Downloading laminas/laminas-mvc (3.8.0)
     W:   - Downloading laminas/laminas-di (3.14.0)
     W:   - Downloading magento/magento2-base (2.4.7-p4)
     W:   - Downloading phpseclib/mcrypt_compat (2.0.6)
     W:   - Downloading ezimuel/ringphp (1.2.3)
     W:   - Downloading opensearch-project/opensearch-php (2.4.1)
     W:   - Downloading magento/theme-frontend-blank (100.4.7-p1)
     W:   - Downloading magento/theme-frontend-luma (100.4.7-p1)
     W:   - Downloading magento/theme-adminhtml-backend (100.4.7-p3)
     W:   - Downloading magento/module-securitytxt (1.1.3)
     W:   - Downloading magento/module-re-captcha-validation-api (1.1.3)
     W:   - Downloading magento/module-re-captcha-ui (1.1.4)
     W:   - Downloading magento/module-re-captcha-wishlist (1.1.0-p4)
     W:   - Downloading magento/module-re-captcha-frontend-ui (1.1.5)
     W:   - Downloading magento/module-re-captcha-webapi-ui (1.0.3)
     W:   - Downloading magento/module-re-captcha-webapi-api (1.0.3)
     W:   - Downloading magento/module-re-captcha-webapi-rest (1.0.3)
     W:   - Downloading magento/module-re-captcha-version-3-invisible (2.0.4)
     W:   - Downloading magento/module-re-captcha-webapi-graph-ql (1.0.3)
     W:   - Downloading magento/module-re-captcha-version-2-invisible (2.0.4)
     W:   - Downloading magento/module-re-captcha-version-2-checkbox (2.0.4)
     W:   - Downloading google/recaptcha (1.3.0)
     W:   - Downloading magento/module-re-captcha-validation (1.1.3)
     W:   - Downloading magento/module-re-captcha-user (1.1.4)
     W:   - Downloading magento/module-re-captcha-store-pickup (1.0.3)
     W:   - Downloading magento/module-re-captcha-send-friend (1.1.4)
     W:   - Downloading magento/module-re-captcha-review (1.1.4)
     W:   - Downloading magento/module-re-captcha-admin-ui (1.1.4)
     W:   - Downloading magento/module-re-captcha-checkout (1.1.4)
     W:   - Downloading magento/module-paypal (101.0.7-p3)
     W:   - Downloading magento/module-re-captcha-paypal (1.1.4)
     W:   - Downloading magento/module-re-captcha-newsletter (1.1.4)
     W:   - Downloading magento/module-re-captcha-migration (1.1.4)
     W:   - Downloading magento/module-re-captcha-customer (1.1.5)
     W:   - Downloading magento/module-re-captcha-contact (1.1.3)
     W:   - Downloading magento/module-re-captcha-checkout-sales-rule (1.1.3)
     W:   - Downloading magento/module-wishlist-graph-ql (100.4.7)
     W:   - Downloading magento/module-wishlist-analytics (100.4.5)
     W:   - Downloading magento/module-weee (100.4.7)
     W:   - Downloading magento/module-weee-graph-ql (100.4.4)
     W:   - Downloading magento/module-webapi-security (100.4.4)
     W:   - Downloading magento/module-webapi-async (100.4.5-p4)
     W:   - Downloading magento/module-version (100.4.4)
     W:   - Downloading magento/module-vault-graph-ql (100.4.3)
     W:   - Downloading magento/module-usps (100.4.6-p3)
     W:   - Downloading magento/module-url-rewrite-graph-ql (100.4.6)
     W:   - Downloading magento/module-ups (100.4.7-p1)
     W:   - Downloading magento/module-theme-graph-ql (100.4.4)
     W:   - Downloading magento/module-tax-import-export (100.4.6-p2)
     W:   - Downloading magento/module-tax-graph-ql (100.4.3)
     W:   - Downloading magento/module-swatches-layered-navigation (100.4.3)
     W:   - Downloading magento/module-swatches (100.4.7)
     W:   - Downloading magento/module-swatches-graph-ql (100.4.5)
     W:   - Downloading magento/module-swagger (100.4.6)
     W:   - Downloading magento/module-swagger-webapi-async (100.4.3)
     W:   - Downloading magento/module-swagger-webapi (100.4.3)
     W:   - Downloading magento/module-store-graph-ql (100.4.5)
     W:   - Downloading magento/module-robots (101.1.3)
     W:   - Downloading magento/module-sitemap (100.4.6)
     W:   - Downloading magento/module-send-friend (100.4.5)
     W:   - Downloading magento/module-send-friend-graph-ql (100.4.3)
     W:   - Downloading magento/module-sample-data (100.4.5)
     W:   - Downloading magento/module-sales-rule-graph-ql (100.4.0)
     W:   - Downloading magento/module-sales-analytics (100.4.4)
     W:   - Downloading magento/module-review-graph-ql (100.4.3)
     W:   - Downloading magento/module-review-analytics (100.4.4)
     W:   - Downloading magento/module-release-notification (100.4.5)
     W:   - Downloading magento/module-related-product-graph-ql (100.4.4)
     W:   - Downloading magento/module-quote-downloadable-links (100.4.3)
     W:   - Downloading magento/module-quote-configurable-options (100.4.3)
     W:   - Downloading magento/module-quote-bundle-options (100.4.3)
     W:   - Downloading magento/module-quote-analytics (100.4.6)
     W:   - Downloading magento/module-product-video (100.4.7)
     W:   - Downloading magento/module-persistent (100.4.7)
     W:   - Downloading magento/module-paypal-graph-ql (100.4.5)
     W:   - Downloading magento/module-paypal-captcha (100.4.4)
     W:   - Downloading magento/module-payment-graph-ql (100.4.2)
     W:   - Downloading magento/module-order-cancellation (100.4.0)
     W:   - Downloading magento/module-order-cancellation-ui (100.4.0-p4)
     W:   - Downloading magento/module-order-cancellation-graph-ql (100.4.0)
     W:   - Downloading elasticsearch/elasticsearch (v7.17.2)
     W:   - Downloading magento/module-elasticsearch (101.0.7)
     W:   - Downloading magento/module-open-search (100.4.1)
     W:   - Downloading magento/module-async-config (100.4.0)
     W:   - Downloading magento/module-offline-shipping (100.4.6)
     W:   - Downloading magento/module-offline-payments (100.4.5)
     W:   - Downloading magento/module-newsletter-graph-ql (100.4.4)
     W:   - Downloading magento/module-new-relic-reporting (100.4.5)
     W:   - Downloading magento/module-mysql-mq (100.4.5)
     W:   - Downloading magento/module-multishipping (100.4.7)
     W:   - Downloading magento/module-msrp-grouped-product (100.4.4)
     W:   - Downloading magento/module-msrp-configurable-product (100.4.4)
     W:   - Downloading magento/module-message-queue (100.4.7)
     W:   - Downloading magento/module-media-gallery-synchronization-metadata (100.4.3)
     W:   - Downloading magento/module-media-gallery-synchronization (100.4.6)
     W:   - Downloading magento/module-media-gallery-renditions-api (100.4.4)
     W:   - Downloading magento/module-media-gallery-renditions (100.4.5)
     W:   - Downloading magento/module-media-gallery-metadata (100.4.5)
     W:   - Downloading magento/module-media-gallery-integration (100.4.6)
     W:   - Downloading magento/module-media-gallery-cms-ui (100.4.4)
     W:   - Downloading magento/module-media-gallery-catalog-ui (100.4.4)
     W:   - Downloading magento/module-media-gallery-catalog-integration (100.4.4)
     W:   - Downloading magento/module-media-gallery-catalog (100.4.4)
     W:   - Downloading magento/module-media-content-synchronization-api (100.4.5)
     W:   - Downloading magento/module-media-content-synchronization-cms (100.4.4)
     W:   - Downloading magento/module-media-content-synchronization-catalog (100.4.4)
     W:   - Downloading magento/module-media-content-synchronization (100.4.6)
     W:   - Downloading magento/module-media-content-cms (100.4.5)
     W:   - Downloading magento/module-media-content-catalog (100.4.5)
     W:   - Downloading magento/module-media-content (100.4.5)
     W:   - Downloading magento/module-marketplace (100.4.5)
     W:   - Downloading magento/module-login-as-customer-api (100.4.6)
     W:   - Downloading magento/module-login-as-customer-sales (100.4.6)
     W:   - Downloading magento/module-login-as-customer-quote (100.4.5)
     W:   - Downloading magento/module-login-as-customer-page-cache (100.4.6)
     W:   - Downloading magento/module-login-as-customer-log (100.4.5)
     W:   - Downloading magento/module-login-as-customer (100.4.7)
     W:   - Downloading magento/module-login-as-customer-assistance (100.4.6)
     W:   - Downloading magento/module-login-as-customer-graph-ql (100.4.4)
     W:   - Downloading magento/module-login-as-customer-frontend-ui (100.4.6)
     W:   - Downloading magento/module-login-as-customer-admin-ui (100.4.7)
     W:   - Downloading magento/module-layered-navigation (100.4.7)
     W:   - Downloading magento/module-jwt-framework-adapter (100.4.3)
     W:   - Downloading magento/module-integration-graph-ql (100.4.0)
     W:   - Downloading magento/module-grouped-product-graph-ql (100.4.7)
     W:   - Downloading magento/module-grouped-import-export (100.4.5)
     W:   - Downloading magento/module-grouped-catalog-inventory (100.4.4)
     W:   - Downloading magento/module-graph-ql-new-relic (100.4.0)
     W:   - Downloading magento/module-cookie (100.4.7)
     W:   - Downloading magento/module-google-gtag (100.4.2)
     W:   - Downloading magento/module-google-analytics (100.4.3)
     W:   - Downloading magento/module-google-optimizer (100.4.6)
     W:   - Downloading magento/module-google-adwords (100.4.4)
     W:   - Downloading magento/module-gift-message-graph-ql (100.4.5)
     W:   - Downloading magento/module-fedex (100.4.5-p2)
     W:   - Downloading magento/module-elasticsearch-7 (100.4.7)
     W:   - Downloading magento/module-downloadable-import-export (100.4.6)
     W:   - Downloading magento/module-downloadable-graph-ql (100.4.7)
     W:   - Downloading magento/module-directory-graph-ql (100.4.5)
     W:   - Downloading magento/module-dhl (100.4.6)
     W:   - Downloading magento/module-customer-import-export (100.4.7)
     W:   - Downloading magento/module-customer-downloadable-graph-ql (100.4.3)
     W:   - Downloading magento/module-customer-analytics (100.4.4)
     W:   - Downloading magento/module-currency-symbol (100.4.5)
     W:   - Downloading magento/module-contact-graph-ql (100.4.0)
     W:   - Downloading magento/module-configurable-product-sales (100.4.4)
     W:   - Downloading magento/module-configurable-product-graph-ql (100.4.7)
     W:   - Downloading magento/module-configurable-import-export (100.4.5)
     W:   - Downloading magento/module-compare-list-graph-ql (100.4.3)
     W:   - Downloading magento/module-cms-graph-ql (100.4.4)
     W:   - Downloading magento/module-cms-url-rewrite-graph-ql (100.4.5)
     W:   - Downloading magento/module-checkout-agreements-graph-ql (100.4.3)
     W:   - Downloading magento/module-catalog-url-rewrite-graph-ql (100.4.5)
     W:   - Downloading magento/module-catalog-rule-graph-ql (100.4.4)
     W:   - Downloading magento/module-catalog-rule-configurable (100.4.6)
     W:   - Downloading magento/module-catalog-inventory-graph-ql (100.4.4)
     W:   - Downloading magento/module-catalog-customer-graph-ql (100.4.6)
     W:   - Downloading magento/module-catalog-cms-graph-ql (100.4.3)
     W:   - Downloading magento/module-catalog-analytics (100.4.4)
     W:   - Downloading magento/module-cardinal-commerce (100.4.5)
     W:   - Downloading magento/module-bundle-graph-ql (100.4.7)
     W:   - Downloading magento/module-application-performance-monitor (100.4.0)
     W:   - Downloading magento/module-application-performance-monitor-new-relic (100.4.0)
     W:   - Downloading magento/module-amqp (100.4.4)
     W:   - Downloading magento/module-advanced-pricing-import-export (100.4.7)
     W:   - Downloading magento/module-admin-notification (100.4.6-p3)
     W:   - Downloading magento/module-admin-analytics (100.4.6)
     W:   - Downloading magento/language-zh_hans_cn (100.4.0)
     W:   - Downloading magento/language-pt_br (100.4.0)
     W:   - Downloading magento/language-nl_nl (100.4.0)
     W:   - Downloading magento/language-fr_fr (100.4.0)
     W:   - Downloading magento/language-es_es (100.4.0)
     W:   - Downloading magento/language-en_us (100.4.0)
     W:   - Downloading magento/language-de_de (100.4.0)
     W:   - Downloading laminas/laminas-feed (2.23.0)
     W:   - Downloading colinmollenhour/cache-backend-file (v1.4.8)
     W:   - Downloading braintree/braintree_php (6.13.0)
     W:   - Downloading paypal/module-braintree-core (4.6.1-p3)
     W:   - Downloading paypal/module-braintree-graph-ql (4.6.1-p3)
     W:   - Downloading paypal/module-braintree-gift-wrapping (4.6.1-p3)
     W:   - Downloading paypal/module-braintree-gift-card-account (4.6.1-p3)
     W:   - Downloading paypal/module-braintree-customer-balance (4.6.1-p3)
     W:   - Downloading markshust/magento2-module-disabletwofactorauth (2.0.2)
     W:   - Downloading n98/magerun2-dist (7.5.0)
     W:    0/527 [>---------------------------]   0%
     W:   13/527 [>---------------------------]   2%
     W:   53/527 [==>-------------------------]  10%
     W:   98/527 [=====>----------------------]  18%
     W:  108/527 [=====>----------------------]  20%
     W:  159/527 [========>-------------------]  30%
     W:  209/527 [===========>----------------]  39%
     W:  218/527 [===========>----------------]  41%
     W:  269/527 [==============>-------------]  51%
     W:  319/527 [================>-----------]  60%
     W:  374/527 [===================>--------]  70%
     W:  435/527 [=======================>----]  82%
     W:  480/527 [=========================>--]  91%
     W:  526/527 [===========================>]  99%
     W:  527/527 [============================] 100%
     W:   - Installing php-http/discovery (1.20.0): Extracting archive
     W:   - Installing wikimedia/less.php (v3.2.1): Extracting archive
     W:   - Installing symfony/polyfill-mbstring (v1.31.0): Extracting archive
     W:   - Installing webonyx/graphql-php (v15.19.1): Extracting archive
     W:   - Installing tedivm/jshrink (v1.7.0): Extracting archive
     W:   - Installing symfony/process (v6.4.15): Extracting archive
     W:   - Installing symfony/intl (v6.4.15): Extracting archive
     W:   - Installing symfony/polyfill-intl-normalizer (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-intl-grapheme (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-ctype (v1.31.0): Extracting archive
     W:   - Installing symfony/string (v6.4.15): Extracting archive
     W:   - Installing symfony/deprecation-contracts (v3.5.1): Extracting archive
     W:   - Installing psr/container (1.1.2): Extracting archive
     W:   - Installing symfony/service-contracts (v3.5.1): Extracting archive
     W:   - Installing symfony/console (v6.4.17): Extracting archive
     W:   - Installing ramsey/collection (2.0.0): Extracting archive
     W:   - Installing brick/math (0.12.1): Extracting archive
     W:   - Installing ramsey/uuid (4.7.6): Extracting archive
     W:   - Installing psr/log (3.0.2): Extracting archive
     W:   - Installing monolog/monolog (2.10.0): Extracting archive
     W:   - Installing magento/zend-exception (1.16.1): Extracting archive
     W:   - Installing magento/zend-log (1.16.1): Extracting archive
     W:   - Installing magento/zend-cache (1.16.1): Extracting archive
     W:   - Installing magento/zend-memory (1.16.0): Extracting archive
     W:   - Installing magento/zend-pdf (1.16.4): Extracting archive
     W:   - Installing magento/zend-loader (1.16.1): Extracting archive
     W:   - Installing magento/zend-db (1.16.2): Extracting archive
     W:   - Installing symfony/polyfill-php81 (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-php80 (v1.31.0): Extracting archive
     W:   - Installing symfony/polyfill-php73 (v1.31.0): Extracting archive
     W:   - Installing symfony/finder (v7.2.2): Extracting archive
     W:   - Installing symfony/filesystem (v7.2.0): Extracting archive
     W:   - Installing seld/signal-handler (2.0.2): Extracting archive
     W:   - Installing seld/phar-utils (1.2.1): Extracting archive
     W:   - Installing seld/jsonlint (1.11.0): Extracting archive
     W:   - Installing react/promise (v2.11.0): Extracting archive
     W:   - Installing justinrainbow/json-schema (5.3.0): Extracting archive
     W:   - Installing composer/pcre (3.3.2): Extracting archive
     W:   - Installing composer/xdebug-handler (3.0.5): Extracting archive
     W:   - Installing composer/spdx-licenses (1.5.8): Extracting archive
     W:   - Installing composer/semver (3.4.3): Extracting archive
     W:   - Installing composer/metadata-minifier (1.0.0): Extracting archive
     W:   - Installing composer/class-map-generator (1.6.0): Extracting archive
     W:   - Installing composer/ca-bundle (1.5.5): Extracting archive
     W:   - Installing composer/composer (2.8.5): Extracting archive
     W:   0/44 [>---------------------------]   0%
     W:   8/44 [=====>----------------------]  18%
     W:   9/44 [=====>----------------------]  20%
     W:  17/44 [==========>-----------------]  38%
     W:  21/44 [=============>--------------]  47%
     W:  27/44 [=================>----------]  61%
     W:  36/44 [======================>-----]  81%
     W:  43/44 [===========================>]  97%
     W:  44/44 [============================] 100%
     W:   - Installing magento/composer-dependency-version-audit-plugin (0.1.6): Extracting archive
     W:                                                                                              - Installing psr/http-message (2.0): Extracting archive
     W:   - Installing laminas/laminas-stdlib (3.20.0): Extracting archive
     W:   - Installing laminas/laminas-servicemanager (3.23.0): Extracting archive
     W:   - Installing laminas/laminas-validator (2.64.2): Extracting archive
     W:   - Installing laminas/laminas-escaper (2.15.0): Extracting archive
     W:   - Installing laminas/laminas-uri (2.13.0): Extracting archive
     W:   - Installing laminas/laminas-permissions-acl (2.17.0): Extracting archive
     W:   - Installing laminas/laminas-math (3.8.1): Extracting archive
     W:   - Installing laminas/laminas-loader (2.11.1): Extracting archive
     W:   - Installing laminas/laminas-translator (1.1.0): Extracting archive
     W:   - Installing laminas/laminas-i18n (2.29.0): Extracting archive
     W:   - Installing laminas/laminas-http (2.21.0): Extracting archive
     W:   - Installing laminas/laminas-crypt (3.12.0): Extracting archive
     W:   - Installing laminas/laminas-config (3.10.1): Extracting archive
     W:   - Installing laminas/laminas-oauth (2.7.0): Extracting archive
     W:   - Installing laminas/laminas-mime (2.12.0): Extracting archive
     W:   - Installing webmozart/assert (1.11.0): Extracting archive
     W:   - Installing symfony/polyfill-intl-idn (v1.31.0): Extracting archive
     W:   - Installing laminas/laminas-mail (2.25.1): Extracting archive
     W:   - Installing laminas/laminas-filter (2.40.0): Extracting archive
     W:   - Installing laminas/laminas-file (2.13.1): Extracting archive
     W:   - Installing laminas/laminas-code (4.16.0): Extracting archive
     W:   - Installing psr/http-client (1.0.3): Extracting archive
     W:   - Installing ralouphie/getallheaders (3.0.3): Extracting archive
     W:   - Installing psr/http-factory (1.1.0): Extracting archive
     W:   - Installing guzzlehttp/psr7 (2.7.0): Extracting archive
     W:   - Installing guzzlehttp/promises (2.0.4): Extracting archive
     W:   - Installing guzzlehttp/guzzle (7.9.2): Extracting archive
     W:   - Installing ezyang/htmlpurifier (v4.18.0): Extracting archive
     W:   - Installing colinmollenhour/credis (v1.16.2): Extracting archive
     W:   - Installing colinmollenhour/php-redis-session-abstract (v1.5.5): Extracting archive
     W:   - Installing magento/framework (103.0.7-p4): Extracting archive
     W:   0/32 [>---------------------------]   0%
     W:  10/32 [========>-------------------]  31%
     W:  19/32 [================>-----------]  59%
     W:  22/32 [===================>--------]  68%
     W:  31/32 [===========================>]  96%
     W:  32/32 [============================] 100%
     W:   - Installing magento/magento-composer-installer (0.4.0): Extracting archive
     W:   - Installing magento/composer-root-update-plugin (2.0.4): Extracting archive
     W:   - Installing magento/inventory-composer-installer (1.2.0): Extracting archive
     W:   - Installing 2tvenom/cborencode (1.0.2): Extracting archive
     W:   - Installing magento/module-adobe-ims-api (2.2.1): Extracting archive
     W:   - Installing magento/module-user (101.2.7): Extracting archive
     W:   - Installing magento/module-ui (101.2.7-p4): Extracting archive
     W:   - Installing magento/module-store (101.1.7): Extracting archive
     W:   - Installing magento/module-media-storage (100.4.6): Extracting archive
     W:   - Installing magento/module-config (101.2.7-p4): Extracting archive
     W:   - Installing magento/module-theme (101.1.7): Extracting archive
     W:   - Installing magento/module-developer (100.4.7): Extracting archive
     W:   - Installing magento/module-require-js (100.4.3): Extracting archive
     W:   - Installing magento/module-deploy (100.4.7): Extracting archive
     W:   - Installing magento/module-backend (102.0.7-p4): Extracting archive
     W:   - Installing magento/module-translation (100.4.7): Extracting archive
     W:   - Installing magento/module-security (100.4.7): Extracting archive
     W:   - Installing magento/module-sales (103.0.7-p4): Extracting archive
     W:   - Installing magento/module-wishlist (101.2.7-p3): Extracting archive
     W:   - Installing magento/module-tax (100.4.7): Extracting archive
     W:   - Installing magento/module-shipping (100.4.7-p2): Extracting archive
     W:   - Installing magento/module-sales-sequence (100.4.4): Extracting archive
     W:   - Installing magento/module-quote (101.2.7-p4): Extracting archive
     W:   - Installing magento/module-directory (100.4.7-p4): Extracting archive
     W:   - Installing magento/module-widget (101.2.7): Extracting archive
     W:   - Installing magento/module-url-rewrite (102.0.6): Extracting archive
     W:   - Installing magento/module-variable (100.4.5): Extracting archive
     W:   - Installing magento/module-cms (104.0.7-p4): Extracting archive
     W:   - Installing magento/module-email (101.1.7-p4): Extracting archive
     W:   - Installing magento/module-catalog (104.0.7-p4): Extracting archive
     W:   - Installing magento/module-cms-url-rewrite (100.4.6): Extracting archive
     W:   - Installing magento/module-eav (102.1.7): Extracting archive
     W:   - Installing magento/module-import-export (101.0.7-p4): Extracting archive
     W:   - Installing magento/module-customer (103.0.7-p4): Extracting archive
     W:   - Installing magento/module-catalog-url-rewrite (100.4.7): Extracting archive
     W:   - Installing magento/module-catalog-inventory (100.4.7): Extracting archive
     W:   - Installing league/mime-type-detection (1.16.0): Extracting archive
     W:   - Installing league/flysystem (2.5.0): Extracting archive
     W:   - Installing mtdowling/jmespath.php (2.8.0): Extracting archive
     W:   - Installing aws/aws-crt-php (v1.2.7): Extracting archive
     W:   - Installing aws/aws-sdk-php (3.339.12): Extracting archive
     W:   - Installing league/flysystem-aws-s3-v3 (2.5.0): Extracting archive
     W:   - Installing magento/module-remote-storage (100.4.5): Extracting archive
     W:   - Installing magento/module-aws-s3 (100.4.5): Extracting archive
     W:   - Installing magento/module-authorization (100.4.7): Extracting archive
     W:   - Installing magento/module-catalog-import-export (101.1.7-p3): Extracting archive
     W:   - Installing magento/framework-message-queue (100.4.7): Extracting archive
     W:   - Installing magento/framework-bulk (101.0.3): Extracting archive
     W:   - Installing magento/module-asynchronous-operations (100.4.7): Extracting archive
     W:   - Installing magento/module-product-alert (100.4.6): Extracting archive
     W:   - Installing magento/module-page-cache (100.4.7): Extracting archive
     W:   - Installing magento/module-checkout (100.4.7): Extracting archive
     W:   - Installing magento/module-gift-message (100.4.6): Extracting archive
     W:   - Installing magento/module-downloadable (100.4.7-p4): Extracting archive
     W:   - Installing magento/module-msrp (100.4.6): Extracting archive
     W:   - Installing paragonie/random_compat (v9.99.100): Extracting archive
     W:   - Installing paragonie/constant_time_encoding (v3.0.0): Extracting archive
     W:   - Installing phpseclib/phpseclib (3.0.43): Extracting archive
     W:   - Installing php-amqplib/php-amqplib (v3.2.0): Extracting archive
     W:   - Installing magento/framework-amqp (100.4.5): Extracting archive
     W:   - Installing magento/module-indexer (100.4.7): Extracting archive
     W:   - Installing magento/module-rule (100.4.6): Extracting archive
     W:   - Installing magento/module-catalog-rule (101.2.7): Extracting archive
     W:   - Installing magento/module-sales-rule (101.2.7-p4): Extracting archive
     W:   - Installing magento/module-newsletter (100.4.7-p2): Extracting archive
     W:   - Installing magento/module-review (100.4.7): Extracting archive
     W:   - Installing magento/module-reports (100.4.7-p4): Extracting archive
     W:   - Installing magento/module-payment (100.4.7): Extracting archive
     W:   - Installing laminas/laminas-db (2.20.0): Extracting archive
     W:   - Installing laminas/laminas-text (2.12.1): Extracting archive
     W:   - Installing laminas/laminas-eventmanager (3.14.0): Extracting archive
     W:   - Installing laminas/laminas-session (2.24.0): Extracting archive
     W:   - Installing laminas/laminas-recaptcha (3.8.0): Extracting archive
     W:   - Installing laminas/laminas-captcha (2.18.0): Extracting archive
     W:   - Installing magento/module-captcha (100.4.7): Extracting archive
     W:   - Installing magento/module-csp (100.4.6): Extracting archive
     W:   - Installing magento/module-contact (100.4.6): Extracting archive
     W:   - Installing magento/module-integration (100.4.7-p2): Extracting archive
     W:   - Installing magento/module-rss (100.4.5): Extracting archive
     W:   - Installing magento/module-encryption-key (100.4.5-p4): Extracting archive
     W:   - Installing magento/module-bundle (101.0.7-p4): Extracting archive
     W:   - Installing magento/module-cron (100.4.7): Extracting archive
     W:   - Installing magento/module-backup (100.4.7): Extracting archive
     W:   - Installing magento/module-adobe-ims (2.2.1): Extracting archive
     W:   - Installing psr/clock (1.0.0): Extracting archive
     W:   - Installing spomky-labs/otphp (11.3.0): Extracting archive
     W:   - Installing dasprid/enum (1.0.6): Extracting archive
     W:   - Installing bacon/bacon-qr-code (2.0.8): Extracting archive
     W:   - Installing endroid/qr-code (4.8.5): Extracting archive
     W:   - Installing christian-riesen/base32 (1.6.0): Extracting archive
     W:   - Installing magento/module-two-factor-auth (1.1.6-p3): Extracting archive
     W:   - Installing magento/module-jwt-user-token (100.4.2-p2): Extracting archive
     W:   - Installing magento/module-admin-adobe-ims (100.5.2): Extracting archive
     W:   - Installing magento/module-admin-adobe-ims-two-factor-auth (1.0.1): Extracting archive
     W:   - Installing adobe-commerce/adobe-ims-metapackage (2.2.2)
     W:   - Installing nikic/php-parser (v5.4.0): Extracting archive
     W:   - Installing brick/varexporter (0.5.0): Extracting archive
     W:   - Installing ezimuel/guzzlestreams (3.1.0): Extracting archive
     W:   - Installing zordius/lightncandy (v1.2.6): Extracting archive
     W:   - Installing magento/module-cache-invalidate (100.4.5): Extracting archive
     W:   - Installing fastly/magento2 (1.2.225): Extracting archive
     W:   - Installing firebase/php-jwt (v6.11.0): Extracting archive
     W:   - Installing illuminate/macroable (v11.42.0): Extracting archive
     W:   - Installing psr/simple-cache (3.0.0): Extracting archive
     W:   - Installing illuminate/contracts (v11.42.0): Extracting archive
     W:   - Installing illuminate/conditionable (v11.42.0): Extracting archive
     W:   - Installing illuminate/collections (v11.42.0): Extracting archive
     W:   - Installing laminas/laminas-router (3.14.0): Extracting archive
     W:   - Installing laminas/laminas-json (3.7.1): Extracting archive
     W:   - Installing laminas/laminas-view (2.36.0): Extracting archive
     W:   - Installing magento/module-adobe-stock-image-api (1.3.3): Extracting archive
     W:   - Installing magento/module-media-gallery-ui-api (100.4.5): Extracting archive
     W:   - Installing magento/module-media-gallery-api (101.0.6): Extracting archive
     W:   - Installing magento/module-media-gallery-synchronization-api (100.4.5): Extracting archive
     W:   - Installing magento/module-media-gallery-metadata-api (100.4.4): Extracting archive
     W:   - Installing magento/module-media-content-api (100.4.6): Extracting archive
     W:   - Installing magento/module-media-gallery-ui (100.4.6): Extracting archive
     W:   - Installing magento/module-adobe-stock-client-api (2.1.4): Extracting archive
     W:   - Installing magento/module-adobe-stock-asset-api (2.0.3): Extracting archive
     W:   - Installing magento/module-adobe-stock-image-admin-ui (1.3.5-p1): Extracting archive
     W:   - Installing magento/module-adobe-stock-image (1.3.5): Extracting archive
     W:   - Installing astock/stock-api-libphp (1.1.6): Extracting archive
     W:   - Installing magento/module-adobe-stock-client (1.3.4): Extracting archive
     W:   - Installing magento/module-media-gallery (100.4.6): Extracting archive
     W:   - Installing magento/module-adobe-stock-asset (1.3.3): Extracting archive
     W:   - Installing magento/module-adobe-stock-admin-ui (1.3.4): Extracting archive
     W:   - Installing magento/adobe-stock-integration (2.1.6-p4)
     W:   - Installing symfony/yaml (v6.4.18): Extracting archive
     W:   - Installing symfony/serializer (v6.4.18): Extracting archive
     W:   - Installing symfony/var-exporter (v7.2.0): Extracting archive
     W:   - Installing symfony/dependency-injection (v6.4.16): Extracting archive
     W:   - Installing symfony/config (v6.4.14): Extracting archive
     W:   - Installing symfony/translation-contracts (v3.5.1): Extracting archive
     W:   - Installing symfony/translation (v7.2.2): Extracting archive
     W:   - Installing symfony/polyfill-php83 (v1.31.0): Extracting archive
     W:   - Installing symfony/clock (v7.2.0): Extracting archive
     W:   - Installing carbonphp/carbon-doctrine-types (3.2.0): Extracting archive
     W:   - Installing nesbot/carbon (3.8.5): Extracting archive
     W:   - Installing friendsofphp/proxy-manager-lts (v1.0.18): Extracting archive
     W:   - Installing symfony/proxy-manager-bridge (v6.4.13): Extracting archive
     W:   - Installing magento/quality-patches (1.1.59): Extracting archive
     W:   - Installing magento/magento-cloud-patches (1.1.3): Extracting archive
     W:   - Installing illuminate/config (v11.42.0): Extracting archive
     W:   - Installing magento/magento-cloud-docker (1.4.1): Extracting archive
     W:   - Installing colinmollenhour/cache-backend-redis (1.17.1): Extracting archive
     W:   - Installing magento/magento-cloud-components (1.1.1): Extracting archive
     W:   - Installing graylog2/gelf-php (2.0.2): Extracting archive
     W:   - Installing magento/ece-tools (2002.2.1): Extracting archive
     W:   - Installing magento/module-aws-s3-page-builder (1.0.4): Extracting archive
     W:   - Installing phpgt/propfunc (v1.0.1): Extracting archive
     W:   - Installing phpgt/cssxpath (v1.3.0): Extracting archive
     W:   - Installing phpgt/dom (v4.1.7): Extracting archive
     W:   - Installing magento/module-catalog-widget (100.4.7): Extracting archive
     W:   - Installing magento/module-page-builder (2.2.5-p4): Extracting archive
     W:   - Installing magento/module-analytics (100.4.7): Extracting archive
     W:   - Installing magento/module-page-builder-analytics (1.6.4): Extracting archive
     W:   - Installing magento/module-catalog-page-builder-analytics (1.6.4): Extracting archive
     W:   - Installing magento/module-cms-page-builder-analytics (1.6.4): Extracting archive
     W:   - Installing magento/module-inventory-api (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-sales-api (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-catalog-api (1.3.5): Extracting archive
     W:   - Installing magento/module-inventory-advanced-checkout (1.2.4): Extracting archive
     W:   - Installing magento/module-bundle-import-export (100.4.6): Extracting archive
     W:   - Installing magento/module-inventory-bundle-import-export (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-configuration-api (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-bundle-product (1.2.4): Extracting archive
     W:   - Installing magento/module-sales-inventory (100.4.4): Extracting archive
     W:   - Installing magento/module-inventory-source-selection-api (1.4.4): Extracting archive
     W:   - Installing magento/module-inventory (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-source-deduction-api (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-reservations-api (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-sales (1.3.2): Extracting archive
     W:   - Installing magento/module-inventory-multi-dimensional-indexer-api (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-indexer (2.2.2): Extracting archive
     W:   - Installing magento/module-inventory-catalog-admin-ui (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-bundle-product-admin-ui (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-bundle-product-indexer (1.1.4): Extracting archive
     W:   - Installing magento/module-inventory-cache (1.2.5): Extracting archive
     W:   - Installing magento/module-catalog-search (102.0.7-p3): Extracting archive
     W:   - Installing magento/module-search (101.1.7-p3): Extracting archive
     W:   - Installing magento/module-inventory-catalog-search (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-catalog-search-bundle-product (1.0.3): Extracting archive
     W:   - Installing magento/module-configurable-product (100.4.7): Extracting archive
     W:   - Installing magento/module-inventory-catalog-search-configurable-product (1.0.3): Extracting archive
     W:   - Installing magento/module-inventory-configuration (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-catalog (1.3.2): Extracting archive
     W:   - Installing magento/module-inventory-configurable-product (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-configurable-product-admin-ui (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-configurable-product-frontend-ui (1.0.5): Extracting archive
     W:   - Installing magento/module-inventory-configurable-product-indexer (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-distance-based-source-selection-api (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-distance-based-source-selection (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-distance-based-source-selection-admin-ui (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-elasticsearch (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-export-stock-api (1.2.3): Extracting archive
     W:   - Installing magento/module-grouped-product (100.4.7): Extracting archive
     W:   - Installing magento/module-inventory-export-stock (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-graph-ql (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-grouped-product (1.3.2): Extracting archive
     W:   - Installing magento/module-inventory-grouped-product-admin-ui (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-grouped-product-indexer (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-import-export (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-api (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-admin-ui (1.2.5-p2): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-admin-ui (1.1.4): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-shipping-api (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-sales-api (1.1.3-p1): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-frontend (1.1.5): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-graph-ql (1.1.4): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-multishipping (1.1.3): Extracting archive
     W:   - Installing magento/module-webapi (100.4.6-p1): Extracting archive
     W:   - Installing magento/module-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-graph-ql-resolver-cache (100.4.0): Extracting archive
     W:   - Installing magento/module-eav-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-advanced-search (100.4.5-p3): Extracting archive
     W:   - Installing magento/module-catalog-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-sales-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-graph-ql-cache (100.4.4): Extracting archive
     W:   - Installing magento/module-customer-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-quote-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-quote-graph-ql (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-sales (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-quote (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-sales-admin-ui (1.1.5): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-shipping (1.1.4): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-shipping-admin-ui (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-in-store-pickup-webapi-extension (1.1.3): Extracting archive
     W:   - Installing magento/module-inventory-low-quantity-notification-api (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-low-quantity-notification (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-low-quantity-notification-admin-ui (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-product-alert (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-quote-graph-ql (1.0.4): Extracting archive
     W:   - Installing magento/module-inventory-requisition-list (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-reservation-cli (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-reservations (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-sales-admin-ui (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-sales-async-order (100.2.1): Extracting archive
     W:   - Installing magento/module-inventory-catalog-frontend-ui (1.0.4): Extracting archive
     W:   - Installing magento/module-inventory-sales-frontend-ui (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-setup-fixture-generator (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-shipping (1.2.4): Extracting archive
     W:   - Installing magento/module-inventory-shipping-admin-ui (1.2.5): Extracting archive
     W:   - Installing magento/module-inventory-source-selection (1.2.3): Extracting archive
     W:   - Installing magento/module-inventory-swatches-frontend-ui (1.0.3): Extracting archive
     W:   - Installing magento/module-inventory-visual-merchandiser (1.1.5): Extracting archive
     W:   - Installing magento/module-inventory-wishlist (1.0.4): Extracting archive
     W:   - Installing magento/module-page-builder-admin-analytics (1.1.4): Extracting archive
     W:   - Installing magento/module-query-xml (103.3.18): Extracting archive
     W:   - Installing magento/services-connector (1.3.6): Extracting archive
     W:   - Installing magento/module-services-id (3.2.7): Extracting archive
     W:   - Installing magento/module-data-exporter (103.3.18): Extracting archive
     W:   - Installing magento/module-saas-common (103.3.18): Extracting archive
     W:   - Installing magento/module-graph-ql-server (1.0.3): Extracting archive
     W:   - Installing magento/module-admin-graph-ql-server (1.0.4): Extracting archive
     W:   - Installing magento/module-services-id-graph-ql-server (1.1.6): Extracting archive
     W:   - Installing magento/module-services-id-layout (1.1.4): Extracting archive
     W:   - Installing magento/services-id (3.2.7)
     W:   - Installing magento/module-store-data-exporter (2.10.1): Extracting archive
     W:   - Installing magento/module-vault (101.2.7): Extracting archive
     W:   - Installing magento/module-service-proxy (2.10.1): Extracting archive
     W:   - Installing magento/module-payment-services-paypal (2.10.1): Extracting archive
     W:   - Installing magento/module-payment-services-base (2.10.1): Extracting archive
     W:   - Installing magento/module-payment-services-dashboard (2.10.1): Extracting archive
     W:   - Installing magento/module-instant-purchase (100.4.6-p3): Extracting archive
     W:   - Installing magento/module-checkout-agreements (100.4.6): Extracting archive
     W:   - Installing magento/module-sales-data-exporter (2.10.1): Extracting archive
     W:   - Installing magento/module-payment-services-saas-export (2.10.1): Extracting archive
     W:   - Installing magento/module-payment-services-paypal-graph-ql (2.10.1): Extracting archive
     W:   - Installing magento/payment-services (2.10.1)
     W:   - Installing symfony/http-foundation (v7.2.3): Extracting archive
     W:   - Installing psr/event-dispatcher (1.0.0): Extracting archive
     W:   - Installing symfony/event-dispatcher-contracts (v3.5.1): Extracting archive
     W:   - Installing symfony/event-dispatcher (v7.2.0): Extracting archive
     W:   - Installing symfony/var-dumper (v7.2.3): Extracting archive
     W:   - Installing symfony/error-handler (v7.2.3): Extracting archive
     W:   - Installing symfony/http-kernel (v7.2.3): Extracting archive
     W:   - Installing symfony/http-client-contracts (v3.5.2): Extracting archive
     W:   - Installing symfony/http-client (v7.2.3): Extracting archive
     W:   - Installing spomky-labs/pki-framework (1.2.2): Extracting archive
     W:   - Installing spomky-labs/aes-key-wrap (v7.0.0): Extracting archive
     W:   - Installing psr/cache (3.0.0): Extracting archive
     W:   - Installing paragonie/sodium_compat (v2.1.0): Extracting archive
     W:   - Installing web-token/jwt-framework (3.4.7): Extracting archive
     W:   - Installing tubalmartin/cssmin (v4.1.1): Extracting archive
     W:   - Installing symfony/css-selector (v7.2.0): Extracting archive
     W:   - Installing sabberworm/php-css-parser (v8.7.0): Extracting archive
     W:   - Installing pelago/emogrifier (v7.3.0): Extracting archive
     W:   - Installing magento/composer (1.10.0): Extracting archive
     W:   - Installing laminas/laminas-server (2.18.0): Extracting archive
     W:   - Installing laminas/laminas-soap (2.14.0): Extracting archive
     W:   - Installing webimpress/safe-writer (2.2.0): Extracting archive
     W:   - Installing laminas/laminas-modulemanager (2.17.0): Extracting archive
     W:   - Installing laminas/laminas-mvc (3.8.0): Extracting archive
     W:   - Installing laminas/laminas-di (3.14.0): Extracting archive
     W:   - Installing magento/magento2-base (2.4.7-p4): Extracting archive
     W:   - Installing phpseclib/mcrypt_compat (2.0.6): Extracting archive
     W:   - Installing ezimuel/ringphp (1.2.3): Extracting archive
     W:   - Installing opensearch-project/opensearch-php (2.4.1): Extracting archive
     W:   - Installing magento/theme-frontend-blank (100.4.7-p1): Extracting archive
     W:   - Installing magento/theme-frontend-luma (100.4.7-p1): Extracting archive
     W:   - Installing magento/theme-adminhtml-backend (100.4.7-p3): Extracting archive
     W:   - Installing magento/module-securitytxt (1.1.3): Extracting archive
     W:   - Installing magento/module-re-captcha-validation-api (1.1.3): Extracting archive
     W:   - Installing magento/module-re-captcha-ui (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-wishlist (1.1.0-p4): Extracting archive
     W:   - Installing magento/module-re-captcha-frontend-ui (1.1.5): Extracting archive
     W:   - Installing magento/module-re-captcha-webapi-ui (1.0.3): Extracting archive
     W:   - Installing magento/module-re-captcha-webapi-api (1.0.3): Extracting archive
     W:   - Installing magento/module-re-captcha-webapi-rest (1.0.3): Extracting archive
     W:   - Installing magento/module-re-captcha-version-3-invisible (2.0.4): Extracting archive
     W:   - Installing magento/module-re-captcha-webapi-graph-ql (1.0.3): Extracting archive
     W:   - Installing magento/module-re-captcha-version-2-invisible (2.0.4): Extracting archive
     W:   - Installing magento/module-re-captcha-version-2-checkbox (2.0.4): Extracting archive
     W:   - Installing google/recaptcha (1.3.0): Extracting archive
     W:   - Installing magento/module-re-captcha-validation (1.1.3): Extracting archive
     W:   - Installing magento/module-re-captcha-user (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-store-pickup (1.0.3): Extracting archive
     W:   - Installing magento/module-re-captcha-send-friend (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-review (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-admin-ui (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-checkout (1.1.4): Extracting archive
     W:   - Installing magento/module-paypal (101.0.7-p3): Extracting archive
     W:   - Installing magento/module-re-captcha-paypal (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-newsletter (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-migration (1.1.4): Extracting archive
     W:   - Installing magento/module-re-captcha-customer (1.1.5): Extracting archive
     W:   - Installing magento/module-re-captcha-contact (1.1.3): Extracting archive
     W:   - Installing magento/module-re-captcha-checkout-sales-rule (1.1.3): Extracting archive
     W:   - Installing magento/security-package (1.1.6-p4)
     W:   - Installing magento/page-builder (1.7.4-p4)
     W:   - Installing magento/module-wishlist-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-wishlist-analytics (100.4.5): Extracting archive
     W:   - Installing magento/module-weee (100.4.7): Extracting archive
     W:   - Installing magento/module-weee-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-webapi-security (100.4.4): Extracting archive
     W:   - Installing magento/module-webapi-async (100.4.5-p4): Extracting archive
     W:   - Installing magento/module-version (100.4.4): Extracting archive
     W:   - Installing magento/module-vault-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-usps (100.4.6-p3): Extracting archive
     W:   - Installing magento/module-url-rewrite-graph-ql (100.4.6): Extracting archive
     W:   - Installing magento/module-ups (100.4.7-p1): Extracting archive
     W:   - Installing magento/module-theme-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-tax-import-export (100.4.6-p2): Extracting archive
     W:   - Installing magento/module-tax-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-swatches-layered-navigation (100.4.3): Extracting archive
     W:   - Installing magento/module-swatches (100.4.7): Extracting archive
     W:   - Installing magento/module-swatches-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-swagger (100.4.6): Extracting archive
     W:   - Installing magento/module-swagger-webapi-async (100.4.3): Extracting archive
     W:   - Installing magento/module-swagger-webapi (100.4.3): Extracting archive
     W:   - Installing magento/module-store-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-robots (101.1.3): Extracting archive
     W:   - Installing magento/module-sitemap (100.4.6): Extracting archive
     W:   - Installing magento/module-send-friend (100.4.5): Extracting archive
     W:   - Installing magento/module-send-friend-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-sample-data (100.4.5): Extracting archive
     W:   - Installing magento/module-sales-rule-graph-ql (100.4.0): Extracting archive
     W:   - Installing magento/module-sales-analytics (100.4.4): Extracting archive
     W:   - Installing magento/module-review-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-review-analytics (100.4.4): Extracting archive
     W:   - Installing magento/module-release-notification (100.4.5): Extracting archive
     W:   - Installing magento/module-related-product-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-quote-downloadable-links (100.4.3): Extracting archive
     W:   - Installing magento/module-quote-configurable-options (100.4.3): Extracting archive
     W:   - Installing magento/module-quote-bundle-options (100.4.3): Extracting archive
     W:   - Installing magento/module-quote-analytics (100.4.6): Extracting archive
     W:   - Installing magento/module-product-video (100.4.7): Extracting archive
     W:   - Installing magento/module-persistent (100.4.7): Extracting archive
     W:   - Installing magento/module-paypal-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-paypal-captcha (100.4.4): Extracting archive
     W:   - Installing magento/module-payment-graph-ql (100.4.2): Extracting archive
     W:   - Installing magento/module-order-cancellation (100.4.0): Extracting archive
     W:   - Installing magento/module-order-cancellation-ui (100.4.0-p4): Extracting archive
     W:   - Installing magento/module-order-cancellation-graph-ql (100.4.0): Extracting archive
     W:   - Installing elasticsearch/elasticsearch (v7.17.2): Extracting archive
     W:   - Installing magento/module-elasticsearch (101.0.7): Extracting archive
     W:   - Installing magento/module-open-search (100.4.1): Extracting archive
     W:   - Installing magento/module-async-config (100.4.0): Extracting archive
     W:   - Installing magento/module-offline-shipping (100.4.6): Extracting archive
     W:   - Installing magento/module-offline-payments (100.4.5): Extracting archive
     W:   - Installing magento/module-newsletter-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-new-relic-reporting (100.4.5): Extracting archive
     W:   - Installing magento/module-mysql-mq (100.4.5): Extracting archive
     W:   - Installing magento/module-multishipping (100.4.7): Extracting archive
     W:   - Installing magento/module-msrp-grouped-product (100.4.4): Extracting archive
     W:   - Installing magento/module-msrp-configurable-product (100.4.4): Extracting archive
     W:   - Installing magento/module-message-queue (100.4.7): Extracting archive
     W:   - Installing magento/module-media-gallery-synchronization-metadata (100.4.3): Extracting archive
     W:   - Installing magento/module-media-gallery-synchronization (100.4.6): Extracting archive
     W:   - Installing magento/module-media-gallery-renditions-api (100.4.4): Extracting archive
     W:   - Installing magento/module-media-gallery-renditions (100.4.5): Extracting archive
     W:   - Installing magento/module-media-gallery-metadata (100.4.5): Extracting archive
     W:   - Installing magento/module-media-gallery-integration (100.4.6): Extracting archive
     W:   - Installing magento/module-media-gallery-cms-ui (100.4.4): Extracting archive
     W:   - Installing magento/module-media-gallery-catalog-ui (100.4.4): Extracting archive
     W:   - Installing magento/module-media-gallery-catalog-integration (100.4.4): Extracting archive
     W:   - Installing magento/module-media-gallery-catalog (100.4.4): Extracting archive
     W:   - Installing magento/module-media-content-synchronization-api (100.4.5): Extracting archive
     W:   - Installing magento/module-media-content-synchronization-cms (100.4.4): Extracting archive
     W:   - Installing magento/module-media-content-synchronization-catalog (100.4.4): Extracting archive
     W:   - Installing magento/module-media-content-synchronization (100.4.6): Extracting archive
     W:   - Installing magento/module-media-content-cms (100.4.5): Extracting archive
     W:   - Installing magento/module-media-content-catalog (100.4.5): Extracting archive
     W:   - Installing magento/module-media-content (100.4.5): Extracting archive
     W:   - Installing magento/module-marketplace (100.4.5): Extracting archive
     W:   - Installing magento/module-login-as-customer-api (100.4.6): Extracting archive
     W:   - Installing magento/module-login-as-customer-sales (100.4.6): Extracting archive
     W:   - Installing magento/module-login-as-customer-quote (100.4.5): Extracting archive
     W:   - Installing magento/module-login-as-customer-page-cache (100.4.6): Extracting archive
     W:   - Installing magento/module-login-as-customer-log (100.4.5): Extracting archive
     W:   - Installing magento/module-login-as-customer (100.4.7): Extracting archive
     W:   - Installing magento/module-login-as-customer-assistance (100.4.6): Extracting archive
     W:   - Installing magento/module-login-as-customer-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-login-as-customer-frontend-ui (100.4.6): Extracting archive
     W:   - Installing magento/module-login-as-customer-admin-ui (100.4.7): Extracting archive
     W:   - Installing magento/module-layered-navigation (100.4.7): Extracting archive
     W:   - Installing magento/module-jwt-framework-adapter (100.4.3): Extracting archive
     W:   - Installing magento/module-integration-graph-ql (100.4.0): Extracting archive
     W:   - Installing magento/module-grouped-product-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-grouped-import-export (100.4.5): Extracting archive
     W:   - Installing magento/module-grouped-catalog-inventory (100.4.4): Extracting archive
     W:   - Installing magento/module-graph-ql-new-relic (100.4.0): Extracting archive
     W:   - Installing magento/module-cookie (100.4.7): Extracting archive
     W:   - Installing magento/module-google-gtag (100.4.2): Extracting archive
     W:   - Installing magento/module-google-analytics (100.4.3): Extracting archive
     W:   - Installing magento/module-google-optimizer (100.4.6): Extracting archive
     W:   - Installing magento/module-google-adwords (100.4.4): Extracting archive
     W:   - Installing magento/module-gift-message-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-fedex (100.4.5-p2): Extracting archive
     W:   - Installing magento/module-elasticsearch-7 (100.4.7): Extracting archive
     W:   - Installing magento/module-downloadable-import-export (100.4.6): Extracting archive
     W:   - Installing magento/module-downloadable-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-directory-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-dhl (100.4.6): Extracting archive
     W:   - Installing magento/module-customer-import-export (100.4.7): Extracting archive
     W:   - Installing magento/module-customer-downloadable-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-customer-analytics (100.4.4): Extracting archive
     W:   - Installing magento/module-currency-symbol (100.4.5): Extracting archive
     W:   - Installing magento/module-contact-graph-ql (100.4.0): Extracting archive
     W:   - Installing magento/module-configurable-product-sales (100.4.4): Extracting archive
     W:   - Installing magento/module-configurable-product-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-configurable-import-export (100.4.5): Extracting archive
     W:   - Installing magento/module-compare-list-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-cms-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-cms-url-rewrite-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-checkout-agreements-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-catalog-url-rewrite-graph-ql (100.4.5): Extracting archive
     W:   - Installing magento/module-catalog-rule-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-catalog-rule-configurable (100.4.6): Extracting archive
     W:   - Installing magento/module-catalog-inventory-graph-ql (100.4.4): Extracting archive
     W:   - Installing magento/module-catalog-customer-graph-ql (100.4.6): Extracting archive
     W:   - Installing magento/module-catalog-cms-graph-ql (100.4.3): Extracting archive
     W:   - Installing magento/module-catalog-analytics (100.4.4): Extracting archive
     W:   - Installing magento/module-cardinal-commerce (100.4.5): Extracting archive
     W:   - Installing magento/module-bundle-graph-ql (100.4.7): Extracting archive
     W:   - Installing magento/module-application-performance-monitor (100.4.0): Extracting archive
     W:   - Installing magento/module-application-performance-monitor-new-relic (100.4.0): Extracting archive
     W:   - Installing magento/module-amqp (100.4.4): Extracting archive
     W:   - Installing magento/module-advanced-pricing-import-export (100.4.7): Extracting archive
     W:   - Installing magento/module-admin-notification (100.4.6-p3): Extracting archive
     W:   - Installing magento/module-admin-analytics (100.4.6): Extracting archive
     W:   - Installing magento/language-zh_hans_cn (100.4.0): Extracting archive
     W:   - Installing magento/language-pt_br (100.4.0): Extracting archive
     W:   - Installing magento/language-nl_nl (100.4.0): Extracting archive
     W:   - Installing magento/language-fr_fr (100.4.0): Extracting archive
     W:   - Installing magento/language-es_es (100.4.0): Extracting archive
     W:   - Installing magento/language-en_us (100.4.0): Extracting archive
     W:   - Installing magento/language-de_de (100.4.0): Extracting archive
     W:   - Installing magento/inventory-metapackage (1.2.7-p4)
     W:   - Installing laminas/laminas-feed (2.23.0): Extracting archive
     W:   - Installing colinmollenhour/cache-backend-file (v1.4.8): Extracting archive
     W:   - Installing braintree/braintree_php (6.13.0): Extracting archive
     W:   - Installing paypal/module-braintree-core (4.6.1-p3): Extracting archive
     W:   - Installing paypal/module-braintree-graph-ql (4.6.1-p3): Extracting archive
     W:   - Installing paypal/module-braintree-gift-wrapping (4.6.1-p3): Extracting archive
     W:   - Installing paypal/module-braintree-gift-card-account (4.6.1-p3): Extracting archive
     W:   - Installing paypal/module-braintree-customer-balance (4.6.1-p3): Extracting archive
     W:   - Installing paypal/module-braintree (4.6.1-p3)
     W:   - Installing adobe-commerce/os-extensions-metapackage (1.0.0)
     W:   - Installing magento/product-community-edition (2.4.7-p4)
     W:   - Installing markshust/magento2-module-disabletwofactorauth (2.0.2): Extracting archive
     W:   - Installing n98/magerun2-dist (7.5.0): Extracting archive
     W:    0/461 [>---------------------------]   0%
     W:   17/461 [=>--------------------------]   3%
     W:   39/461 [==>-------------------------]   8%
     W:   47/461 [==>-------------------------]  10%
     W:   81/461 [====>-----------------------]  17%
     W:   99/461 [======>---------------------]  21%
     W:  136/461 [========>-------------------]  29%
     W:  144/461 [========>-------------------]  31%
     W:  182/461 [===========>----------------]  39%
     W:  192/461 [===========>----------------]  41%
     W:  231/461 [==============>-------------]  50%
     W:  260/461 [===============>------------]  56%
     W:  279/461 [================>-----------]  60%
     W:  306/461 [==================>---------]  66%
     W:  330/461 [====================>-------]  71%
     W:  366/461 [======================>-----]  79%
     W:  375/461 [======================>-----]  81%
     W:  412/461 [=========================>--]  89%
     W:  422/461 [=========================>--]  91%
     W:  456/461 [===========================>]  98%
     W:  461/461 [============================] 100%
     W:     ...Module Magento_InventoryApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryApi module
     W:     ...Module Magento_InventorySalesApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySalesApi module
     W:     ...Module Magento_InventoryCatalogApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalogApi module
     W:     ...Module Magento_InventoryAdvancedCheckout recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryAdvancedCheckout module
     W:     ...Module Magento_InventoryBundleImportExport recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryBundleImportExport module
     W:     ...Module Magento_InventoryConfigurationApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryConfigurationApi module
     W:     ...Module Magento_InventoryBundleProduct recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryBundleProduct module
     W:     ...Module Magento_InventorySourceSelectionApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySourceSelectionApi module
     W:     ...Module Magento_Inventory recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_Inventory module
     W:     ...Module Magento_InventorySourceDeductionApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySourceDeductionApi module
     W:     ...Module Magento_InventoryReservationsApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryReservationsApi module
     W:     ...Module Magento_InventorySales recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySales module
     W:     ...Module Magento_InventoryMultiDimensionalIndexerApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryMultiDimensionalIndexerApi module
     W:     ...Module Magento_InventoryIndexer recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryIndexer module
     W:     ...Module Magento_InventoryCatalogAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalogAdminUi module
     W:     ...Module Magento_InventoryBundleProductAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryBundleProductAdminUi module
     W:     ...Module Magento_InventoryBundleProductIndexer recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryBundleProductIndexer module
     W:     ...Module Magento_InventoryCache recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCache module
     W:     ...Module Magento_InventoryCatalogSearch recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalogSearch module
     W:     ...Module Magento_InventoryCatalogSearchBundleProduct recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalogSearchBundleProduct module
     W:     ...Module Magento_InventoryCatalogSearchConfigurableProduct recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalogSearchConfigurableProduct module
     W:     ...Module Magento_InventoryConfiguration recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryConfiguration module
     W:     ...Module Magento_InventoryCatalog recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalog module
     W:     ...Module Magento_InventoryConfigurableProduct recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryConfigurableProduct module
     W:     ...Module Magento_InventoryConfigurableProductAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryConfigurableProductAdminUi module
     W:     ...Module Magento_InventoryConfigurableProductFrontendUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryConfigurableProductFrontendUi module
     W:     ...Module Magento_InventoryConfigurableProductIndexer recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryConfigurableProductIndexer module
     W:     ...Module Magento_InventoryDistanceBasedSourceSelectionApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryDistanceBasedSourceSelectionApi module
     W:     ...Module Magento_InventoryDistanceBasedSourceSelection recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryDistanceBasedSourceSelection module
     W:     ...Module Magento_InventoryDistanceBasedSourceSelectionAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryDistanceBasedSourceSelectionAdminUi module
     W:     ...Module Magento_InventoryElasticsearch recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryElasticsearch module
     W:     ...Module Magento_InventoryExportStockApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryExportStockApi module
     W:     ...Module Magento_InventoryExportStock recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryExportStock module
     W:     ...Module Magento_InventoryGraphQl recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryGraphQl module
     W:     ...Module Magento_InventoryGroupedProduct recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryGroupedProduct module
     W:     ...Module Magento_InventoryGroupedProductAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryGroupedProductAdminUi module
     W:     ...Module Magento_InventoryGroupedProductIndexer recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryGroupedProductIndexer module
     W:     ...Module Magento_InventoryImportExport recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryImportExport module
     W:     ...Module Magento_InventoryInStorePickupApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupApi module
     W:     ...Module Magento_InventoryInStorePickup recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickup module
     W:     ...Module Magento_InventoryAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryAdminUi module
     W:     ...Module Magento_InventoryInStorePickupAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupAdminUi module
     W:     ...Module Magento_InventoryInStorePickupShippingApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupShippingApi module
     W:     ...Module Magento_InventoryInStorePickupSalesApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupSalesApi module
     W:     ...Module Magento_InventoryInStorePickupFrontend recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupFrontend module
     W:     ...Module Magento_InventoryInStorePickupGraphQl recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupGraphQl module
     W:     ...Module Magento_InventoryInStorePickupMultishipping recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupMultishipping module
     W:     ...Module Magento_InventoryInStorePickupQuoteGraphQl recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupQuoteGraphQl module
     W:     ...Module Magento_InventoryInStorePickupSales recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupSales module
     W:     ...Module Magento_InventoryInStorePickupQuote recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupQuote module
     W:     ...Module Magento_InventoryInStorePickupSalesAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupSalesAdminUi module
     W:     ...Module Magento_InventoryInStorePickupShipping recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupShipping module
     W:     ...Module Magento_InventoryInStorePickupShippingAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupShippingAdminUi module
     W:     ...Module Magento_InventoryInStorePickupWebapiExtension recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryInStorePickupWebapiExtension module
     W:     ...Module Magento_InventoryLowQuantityNotificationApi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryLowQuantityNotificationApi module
     W:     ...Module Magento_InventoryLowQuantityNotification recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryLowQuantityNotification module
     W:     ...Module Magento_InventoryLowQuantityNotificationAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryLowQuantityNotificationAdminUi module
     W:     ...Module Magento_InventoryProductAlert recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryProductAlert module
     W:     ...Module Magento_InventoryQuoteGraphQl recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryQuoteGraphQl module
     W:     ...Module Magento_InventoryRequisitionList recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryRequisitionList module
     W:     ...Module Magento_InventoryReservationCli recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryReservationCli module
     W:     ...Module Magento_InventoryReservations recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryReservations module
     W:     ...Module Magento_InventorySalesAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySalesAdminUi module
     W:     ...Module Magento_InventorySalesAsyncOrder recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySalesAsyncOrder module
     W:     ...Module Magento_InventoryCatalogFrontendUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryCatalogFrontendUi module
     W:     ...Module Magento_InventorySalesFrontendUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySalesFrontendUi module
     W:     ...Module Magento_InventorySetupFixtureGenerator recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySetupFixtureGenerator module
     W:     ...Module Magento_InventoryShipping recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryShipping module
     W:     ...Module Magento_InventoryShippingAdminUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryShippingAdminUi module
     W:     ...Module Magento_InventorySourceSelection recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySourceSelection module
     W:     ...Module Magento_InventorySwatchesFrontendUi recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventorySwatchesFrontendUi module
     W:     ...Module Magento_InventoryVisualMerchandiser recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryVisualMerchandiser module
     W:     ...Module Magento_InventoryWishlist recognized as part of Magento Multi Source Inventory implementation
     W:     ...No special rule applied for Magento_InventoryWishlist module
     W: Package laminas/laminas-config is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-crypt is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-file is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-json is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-loader is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-mail is abandoned, you should avoid using it. Use symfony/mailer instead.
     W: Package laminas/laminas-math is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-mime is abandoned, you should avoid using it. Use symfony/mime instead.
     W: Package laminas/laminas-oauth is abandoned, you should avoid using it. No replacement was suggested.
     W: Package laminas/laminas-text is abandoned, you should avoid using it. No replacement was suggested.
     W: Package magento/module-catalog-inventory is abandoned, you should avoid using it. Use magento/inventory-metapackage instead.
     W: Package magento/module-inventory-in-store-pickup-webapi-extension is abandoned, you should avoid using it. No replacement was suggested.
     W: Generating autoload files
     W: 107 packages you are using are looking for funding.
     W: Use the `composer fund` command to find out more!
     W: > php ./vendor/bin/ece-tools schema:generate || true
     Starting schema dist file generation
     Dist file was successfully generated: /app/.magento.env.md
     [2025-02-24T16:32:56.712617+00:00] INFO: Starting scenario(s): scenario/build/generate.xml (magento/ece-tools version: 2002.2.1, magento/magento2-base version: 2.4.7-p4)
     [2025-02-24T16:32:57.437935+00:00] INFO: Verbosity level is -vvv
     [2025-02-24T16:32:57.438525+00:00] NOTICE: Applying patches
     [2025-02-24T16:32:58.810229+00:00] NOTICE: End of applying patches
     [2025-02-24T16:32:58.810347+00:00] INFO: Set Magento application mode to 'production'
     [2025-02-24T16:32:58.810769+00:00] NOTICE: Validating configuration
     [2025-02-24T16:32:59.051745+00:00] NOTICE: Fix configuration with given suggestions:
     [2025-02-24T16:32:59.051847+00:00] WARNING: [1006] The configured state is not ideal
     Your application does not have the "post_deploy" hook enabled.
       In order to minimize downtime, add the following to ".magento.app.yaml":
       hooks:
           post_deploy: |
               php ./vendor/bin/ece-tools run scenario/post-deploy.xml
     [2025-02-24T16:32:59.061519+00:00] NOTICE: End of validation
     [2025-02-24T16:32:59.061650+00:00] NOTICE: Reconciling installed modules with shared config.
     [2025-02-24T16:33:08.705415+00:00] INFO: The following modules have been enabled:
     Magento_ReCaptchaWishlist
     [2025-02-24T16:33:08.705506+00:00] NOTICE: End of reconciling modules.
     [2025-02-24T16:33:08.705736+00:00] INFO: File "front-static.php" was copied
     [2025-02-24T16:33:08.705806+00:00] INFO: Configuring directory nesting level for saving error reports
     [2025-02-24T16:33:08.705942+00:00] NOTICE: The file /app/pub/errors/local.xml with the `config.report.dir_nesting_level` property: `1` was created.
     [2025-02-24T16:33:08.706661+00:00] INFO: Sample data media was not found. Skipping.
     [2025-02-24T16:33:08.706811+00:00] NOTICE: Running DI compilation
     [2025-02-24T16:34:08.970309+00:00] NOTICE: End of running DI compilation
     [2025-02-24T16:34:18.046349+00:00] NOTICE: Generating fresh static content
     [2025-02-24T16:34:18.051208+00:00] INFO: Generating static content for locales: en_US
     Using 4 Threads
     [2025-02-24T16:34:39.536147+00:00] INFO: Set flag: .static_content_deploy
     [2025-02-24T16:34:39.536209+00:00] NOTICE: End of generating fresh static content
     [2025-02-24T16:34:39.536341+00:00] INFO: Scenario(s) finished
     [2025-02-24T16:34:41.440908+00:00] INFO: Starting scenario(s): scenario/build/transfer.xml (magento/ece-tools version: 2002.2.1, magento/magento2-base version: 2.4.7-p4)
     [2025-02-24T16:34:42.385739+00:00] INFO: Static content compression took 0.92567896842957 seconds.
     [2025-02-24T16:34:42.385975+00:00] INFO: Clearing temporary directory.
     [2025-02-24T16:34:42.387313+00:00] NOTICE: Copying data to the ./init directory
     [2025-02-24T16:34:42.406014+00:00] INFO: Create ./init/pub/static
     [2025-02-24T16:34:42.406255+00:00] INFO: Moving static content to init directory
     [2025-02-24T16:34:42.406361+00:00] INFO: Recreating pub/static directory
     [2025-02-24T16:34:42.406601+00:00] INFO: Copying writable directories to /app/init/ directory.
     [2025-02-24T16:34:42.422958+00:00] NOTICE: Skip copying /app/var/view_preprocessed->/app/init/var/view_preprocessed
     [2025-02-24T16:34:42.430047+00:00] INFO: Clearing the app/etc path of all files and folders
     [2025-02-24T16:34:42.432738+00:00] INFO: Clearing the var path of all files and folders
     [2025-02-24T16:34:42.650692+00:00] INFO: Clearing the pub/media path of all files and folders
     [2025-02-24T16:34:42.651316+00:00] INFO: Clearing the pub/static path of all files and folders
     [2025-02-24T16:34:42.651392+00:00] NOTICE: End of copying data to the ./init directory
     [2025-02-24T16:34:42.651480+00:00] INFO: Scenario(s) finished
   
   Executing pre-flight checks...
 
   Compressing application.
   Beaming package to its final destination.
 
 W: Route 'main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site' doesn't map to a domain of the project, using default development hostname.
 
 Provisioning certificates
   Validating 1 new domain
   Provisioned new certificate for 1 domains
   (Next refresh will be at 2025-04-27 15:37:00+00:00.)
   Certificates
   - certificate dd96845: expiring on 2025-05-25 15:37:00+00:00, covering main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site
 
 
 Blackfire configured for application app
 
 Creating environment main
   Starting environment
   Updating endpoints for app and router
   Opening application app and its relationships
   Executing deploy hook for application app
     [2025-02-24T16:46:00.188335+00:00] INFO: Starting scenario(s): scenario/deploy.xml (magento/ece-tools version: 2002.2.1, magento/magento2-base version: 2.4.7-p4)
     [2025-02-24T16:46:09.491622+00:00] NOTICE: Starting pre-deploy.
     [2025-02-24T16:46:09.491992+00:00] INFO: Restoring patch log file
     [2025-02-24T16:46:09.509315+00:00] INFO: Set "env_file_absence" flag
     [2025-02-24T16:46:09.511468+00:00] INFO: Set flag: var/.env_file_absence
     [2025-02-24T16:46:10.348645+00:00] INFO: Updating cache configuration.
     [2025-02-24T16:46:10.365936+00:00] INFO: Static content deployment was performed during build hook, cleaning old content.
     [2025-02-24T16:46:10.366036+00:00] INFO: Clearing pub/static
     [2025-02-24T16:46:10.409148+00:00] INFO: Skip copying directory ./var/view_preprocessed.
     [2025-02-24T16:46:10.409288+00:00] INFO: Clearing ./var/view_preprocessed
     [2025-02-24T16:46:10.947704+00:00] INFO: Clearing redis cache: default
     [2025-02-24T16:46:11.385695+00:00] NOTICE: Recoverable directories were copied back.
     [2025-02-24T16:46:11.386057+00:00] INFO: Set Magento application mode to 'production'
     [2025-02-24T16:46:11.405396+00:00] NOTICE: End of pre-deploy.
     [2025-02-24T16:46:11.405562+00:00] NOTICE: Enabling Maintenance mode
     [2025-02-24T16:46:27.029227+00:00] INFO: Disable cron
     [2025-02-24T16:46:27.082388+00:00] INFO: Trying to kill running cron jobs and consumers processes
     [2025-02-24T16:46:27.229169+00:00] INFO: Running Magento cron and consumers processes were not found.
     [2025-02-24T16:46:27.268087+00:00] NOTICE: Validating configuration
     [2025-02-24T16:46:27.288019+00:00] INFO: Checking if db exists and has tables
     [2025-02-24T16:46:28.149464+00:00] INFO: Version of service 'rabbitmq' is 3.13
     [2025-02-24T16:46:28.187788+00:00] INFO: Version of service 'redis' is 7.2
     [2025-02-24T16:46:28.188089+00:00] INFO: Version of service 'redis-session' is 7.2
     [2025-02-24T16:46:28.188363+00:00] INFO: Version of service 'elasticsearch' is not detected
     [2025-02-24T16:46:28.188445+00:00] INFO: Version of service 'opensearch' is 2
     [2025-02-24T16:46:28.467989+00:00] INFO: Version of service 'mariadb' is 10.6
     [2025-02-24T16:46:28.928197+00:00] NOTICE: Fix configuration with given suggestions:
     [2025-02-24T16:46:28.928309+00:00] NOTICE: Some services are approaching EOL.
     php 8.3.17 is approaching EOL (2025-11-23).
     redis 7.2 is approaching EOL (2025-08-31).
     redis 7.2 is approaching EOL (2025-08-31).
     mariadb 10.6 is approaching EOL (2026-07-31).
     [2025-02-24T16:46:28.928380+00:00] NOTICE: End of validation
     [2025-02-24T16:46:28.928527+00:00] INFO: Checking existence of encryption key
     [2025-02-24T16:46:28.929728+00:00] INFO: Checking if db exists and has tables
     [2025-02-24T16:46:28.967832+00:00] NOTICE: Starting install.
     [2025-02-24T16:46:28.968688+00:00] INFO: Installing Magento.
     [2025-02-24T16:50:27.589157+00:00] INFO: Updating env.php.
     [2025-02-24T16:50:27.603126+00:00] INFO: Updating env.php cron consumers runner configuration.
     [2025-02-24T16:50:27.623691+00:00] INFO: Updating env.php DB connection configuration.
     [2025-02-24T16:50:27.668510+00:00] INFO: Updating env.php AMQP configuration.
     [2025-02-24T16:50:27.681464+00:00] INFO: redis-session will be used for session if it was not override by SESSION_CONFIGURATION
     [2025-02-24T16:50:27.681617+00:00] INFO: Updating session configuration.
     [2025-02-24T16:50:27.707995+00:00] INFO: Updating search engine configuration.
     [2025-02-24T16:50:27.708119+00:00] INFO: Set search engine to: opensearch
     [2025-02-24T16:50:27.728011+00:00] INFO: Updating secure and unsecure URLs
     [2025-02-24T16:50:27.728116+00:00] INFO: Updating secure and unsecure URLs in core_config_data table.
     [2025-02-24T16:50:27.728841+00:00] INFO: Updating secure and unsecure URLs in app/etc/env.php file
     [2025-02-24T16:50:27.748612+00:00] INFO: The value of the property 'directories/document_root_is_pub' set as 'true'
     [2025-02-24T16:50:27.802035+00:00] INFO: The lock provider "db" was set.
     [2025-02-24T16:50:27.817090+00:00] INFO: Run app:config:import command
     [2025-02-24T16:50:55.329796+00:00] NOTICE: End of install.
     [2025-02-24T16:50:55.348232+00:00] INFO: Deleting flag: var/.env_file_absence
     [2025-02-24T16:50:55.348458+00:00] INFO: Static content deployment was performed during the build phase or disabled. Skipping deploy phase static content compression.
     [2025-02-24T16:50:55.348577+00:00] INFO: Disabling Google Analytics
     [2025-02-24T16:50:55.368908+00:00] INFO: Post-deploy hook enabled. Cron enabling, cache flushing and pre-warming operations are postponed to post-deploy stage.
     [2025-02-24T16:51:07.010610+00:00] NOTICE: Maintenance mode is disabled.
     [2025-02-24T16:51:07.010703+00:00] INFO: Scenario(s) finished
 
   Opening environment
   Executing post-deploy hook for application app
     [2025-02-24T16:53:23.667574+00:00] INFO: Starting scenario(s): scenario/post-deploy.xml (magento/ece-tools version: 2002.2.1, magento/magento2-base version: 2.4.7-p4)
     [2025-02-24T16:53:38.047884+00:00] NOTICE: Validating configuration
     [2025-02-24T16:53:38.288239+00:00] NOTICE: End of validation
     [2025-02-24T16:53:38.288398+00:00] INFO: Enable cron
     [2025-02-24T16:53:38.305503+00:00] INFO: Create backup of important files.
     [2025-02-24T16:53:38.340421+00:00] INFO: Successfully created backup /app/app/etc/env.php.bak for /app/app/etc/env.php.
     [2025-02-24T16:53:38.354969+00:00] INFO: Successfully created backup /app/app/etc/config.php.bak for /app/app/etc/config.php.
     [2025-02-24T16:53:38.355125+00:00] INFO: Flushing cache.
     [2025-02-24T16:53:51.149354+00:00] INFO: Cache flushed successfully.
     [2025-02-24T16:53:51.149467+00:00] INFO: Starting page warmup
     [2025-02-24T16:53:51.149511+00:00] INFO: Warmup concurrency set to 1 as specified by the WARM_UP_CONCURRENCY configuration
     [2025-02-24T16:54:33.649756+00:00] INFO: In case when product SKUs weren't provided product limits set to 100
     [2025-02-24T16:54:45.589010+00:00] INFO: Found 0 urls for pattern "product:*:*"
     [2025-02-24T16:54:57.927933+00:00] INFO: Found 0 urls for pattern "category:*:1"
     [2025-02-24T16:55:09.269754+00:00] INFO: Found 1 urls for pattern "store-page:/contact:1"
     [2025-02-24T16:55:09.269847+00:00] INFO: Found 1 urls for pattern "store-page:/privacy-policy-cookie-restriction-mode:1"
     [2025-02-24T16:55:20.731606+00:00] INFO: Warmed up page: https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/index.php
     [2025-02-24T16:55:31.409906+00:00] INFO: Warmed up page: https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/contact
     [2025-02-24T16:55:40.148084+00:00] INFO: Warmed up page: https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/privacy-policy-cookie-restriction-mode
     [2025-02-24T16:55:40.149905+00:00] INFO: Scenario(s) finished
 
   Environment configuration
     app (type: php:8.3, cpu: 0.1, memory: 64, disk: 1024)
     db (type: mariadb:10.6, cpu: 0.1, memory: 448, disk: 256)
     cache (type: redis:7.2, cpu: 0.1, memory: 352)
     session (type: redis-persistent:7.2, cpu: 0.1, memory: 352, disk: 256)
     indexer (type: opensearch:2, cpu: 0.1, memory: 448, disk: 256)
     queue (type: rabbitmq:3.13, cpu: 0.1, memory: 448, disk: 256)
 
   Environment routes
     http://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/ redirects to https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/
     http://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/static/ redirects to https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/static/
     https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/ is served by application `app`
     https://main-bvxea6i-g7baduaayq63y.eu-5.platformsh.site/static/ is served by application `app`
 
 Blackfire post-deploy event sent
 

```
</details>

## Preview your Magento project

Now that your Magento project has been successfully created, you will see the standard Magento layout when you navigate to your preview link:

![Your magento project in preview mode](/images/guides/magento/preview-mage.png) 

## Further resources

### Documentation

- [PHP documentation](/languages/php/)
- [Authenticated Composer repositories](/languages/php/composer-auth)

### Authentication
- [Composer Authentication and Post Installation Setup](https://github.com/platformsh-templates/magentoCE24/blob/main/README.md#composer-authentication-and-post-installation-setup)
- [Magento Repository authentication keys](https://devdocs.magento.com/guides/v2.4/install-gde/prereq/connect-auth.html)


### Community content

- [PHP topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=php)

