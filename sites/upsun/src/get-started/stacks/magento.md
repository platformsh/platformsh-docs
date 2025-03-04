---
title: Deploy Magento on {{% vendor/name %}}
sidebarTitle: Magento
# sectionBefore: PHP
#layout: single
weight: -62 
description: |
    Complete these steps to successfully deploy Magento on {{% vendor/name %}}.
---

Before attempting to deploy Magento on Upsun, you **must complete the [Getting started guide](/get-started/here)**. 

You can also **check out the [{{% vendor/name %}} demo app](https://console.upsun.com/projects/create-project)** and [Resource configuration guide](https://docs.upsun.com/manage-resources/adjust-resources.html). These provide all of the core concepts and common commands you need to easily follow this Magento guide. 

{{% guides/requirements name="Drupal" %}}

{{< note title="Authentication" theme="info" >}}
You will not need Adobe Commerce authentication keys for this process but if you would like to learn how to set them up if you want to adjust the Composer repository to https://repo.magento.com/, visit [Adobe Commerce Authentication](https://experienceleague.adobe.com/en/docs/commerce-on-cloud/user-guide/develop/authentication-keys).

{{</ note >}}

We will be using the [Upsun Magento example project](https://github.com/platformsh-templates/magentoCE24/blob/main/README.md) for this deployment process. The example specifically features:

- PHP 8.3
- MariaDB 10.6
- Redis 7.2
- OpenSearch 2
- RabbitMQ 3.13
- Automatic TLS certificates
- Composer-based build


The example also features an [Upsun config.yaml](https://github.com/platformsh-templates/magentoCE24/blob/main/.upsun/config.yaml) file. Below is a **shortened example** of the config.yaml file: 

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
              ...
```

## Create project

Copy and run the following command in command line:

`upsun project:create --init-repo https://github.com/platformsh-templates/magentoCE24/`

You will then have to make the following selections:

- Select an organization to create the project under
- Select a title for your project 
- Select a [region to deploy from](https://docs.upsun.com/development/regions.html#regions)
- Select your default branch
- Select whether you would like to set your new project as the remote for any existing repositories that have been detected under your organization

Once you have made your selections, the Upsun bot will activate your project.

When your project is created, you will be provided with the following details to access it:

- `Region`
- `Project ID`
- `Project title`
- `Project URL`
- `Git URL` 

## Configure resources

Copy the Project URL into your browser. You should see your newly created project in the Upsun console. For example, if you had named your Magento project `Mage`, you would see something similar to the screenshot below:

![Your magento project in the Upsun console](/images/guides/magento/mage-console-1.png) 

You will be prompted to configure your resources. At this stage you can select the CPU, RAM, instances and disk size for your Magento project. 

![Configure the resources for your Magento project in the Upsun console](/images/guides/magento/configure-mage-resources.png) 

### Recommended configurations

You will see that the `container_profile` for the app container is using the `BALANCED` profile by default. The standard CPU & RAM recommendation for your app container is a minimum of `0.5 CPU, 1088MB RAM`. Please see the table below for all **recommended minimum settings for your app container**:

| CPU & RAM            | Instances  | Disk/storage |
| ---------------------| ---------- | ------------ | 
| `0.5 CPU, 1088MB RAM`| No minimum | `256MB`      |

All other services will be using their [default container profiles](/manage-resources/adjust-resources.html#advanced-container-profiles) and therefore can be set to `0.1 CPU`, so the above values only apply as recommended minimums for your app container.

Once your project is deployed, you may need to [adjust your resources](/manage-resources/adjust-resources.html) and [adjust the container profiles](/manage-resources/adjust-resources.html#adjust-a-container-profile) of your other services. 


{{< note title="Note" theme="info" >}}

Please note that the deployment after configuring resources may take up to 25 minutes.

{{< /note >}}

## View your log 

Now that your resources have been configured, you can view a log of how Upsun creates your project. In the recents section, click the three dots to the right of the activity about your `updated resource allocation on Main`.

![Navigate to the log to see your Magento project being created](/images/guides/magento/log-console-1.png) 

Below is a **shortened example** of what your log would look like:

```
 Configuring resources
   Setting 'app' resources to 0.5 CPU, 1088MB RAM.
   Setting 'app' disk to 256MB.
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

    ...

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
 
```

## Preview your Magento project

Now that your Magento project has been successfully created, you will see the standard Magento layout when you navigate to your preview link:

![Your magento project in preview mode](/images/guides/magento/preview-mage.png) 

## Fetch your Magento project locally 

First, get your project ID by clicking the three dots in the upper right hand of your console, next to the settings cog wheel. Your project ID will appear in a drop down menu.

![Your project ID in console](/images/guides/magento/project-id-mage-1.png) 

Copy the following command into your command line. 

```upsun get <projectid>```

Make sure to replace `<projectid>` with the Project ID you just copied from console. Once you run the command in command line, you will be asked if you want to set the remote project for any existing repositories to your project. You will also need to specify a directory for your project to be stored in when downloaded. 

Once your project has successfully downloaded, you will be able to access it locally by navigating to the directory you chose.

## Further resources

### Documentation

- [PHP documentation](/languages/php/)
- [Authenticated Composer repositories](/languages/php/composer-auth)
- [Resource configuration guide](https://docs.upsun.com/manage-resources/adjust-resources.html)

### Authentication
- [Composer Authentication and Post Installation Setup](https://github.com/platformsh-templates/magentoCE24/blob/main/README.md#composer-authentication-and-post-installation-setup)
- [Magento Repository authentication keys](https://devdocs.magento.com/guides/v2.4/install-gde/prereq/connect-auth.html)


### Community content

- [PHP topics](https://support.platform.sh/hc/en-us/search?utf8=%E2%9C%93&query=php)

