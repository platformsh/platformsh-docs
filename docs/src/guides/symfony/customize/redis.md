---
title: "Configure Symfony to use Redis component"
sidebarTitle: "Use Redis"
weight: -101
description: |
    Modify your Symfony site to use Redis.
---

Now that your code contains all needed configuration to deploy on Platform.sh,
it's time to make your Symfony site itself ready to use a Redis cache system.


## Make your Platform.sh project use Redis


1. From your terminal, at the root of your Symfony Demo application, create a new GIT branch:

     ```bash
     symfony branch feat-add-redis
     ```
1. Add a Redis component

   All components used for your Platform.sh environment are listed in `.platform/services.yaml` file.
   Cache component is part of it and you need to add a new Redis component in this file.
    ```php {location=".platform/services.yaml"}
    cache:
      type: redis:7.0
      configuration:
        maxmemory_policy: volatile-lru
        # any other finetuning here
    ```

   Follow this link to get more info on [all available components](../../../add-services#available-services).

1. Add a new relationship

   To manage access to containers within your project, you need to define a relationship to it.
   These relationships are defined in the `.platform.app.yaml` file, section `relationships`.

   ```bash
   relationships:
      rediscache: "cache:redis"
   ```

   Follow this link to get more info on [relationships](../../../create-apps/app-reference.html#relationships).

1. Add the Redis PHP extension

   For PHP to communicate with your Redis component, a php-ext is needed.
   All PHP extensions that need to be installed during runtime are listed in the `.platform.app.yaml` file, section `runtime`

   ```bash {location=".platform.app.yaml"}
   runtime:
      extensions:
          - ...
          - redis
   ```

1. Configure Symfony to use Redis locally

{{< codetabs >}}
+++
title=Using DDEV
+++
Assumption:

- Your project is already running locally using [Symfony Server](../local/tethered.md)

When managing many projects, it’s complex to handle all the dependencies.
DDEV is useful to embed those needed components into Docker containers without needs of writing complex DockerFile files.
To add a Redis service to your DDEV project, follow this steps:

1. Add DDEV Redis service to your DDEV project
    ```bash
    ddev get ddev/ddev-redis
    ddev restart
    ddev status
    ```
    From the latest command, you should see a new Redis service in the list.

1. Configure your Symfony application to use this new Redis component

    You need to configure your Symfony application to use Redis by modifying your `config/packages/cache.yaml` with the following:

    ```yaml {location="config/packages/cache.yaml"}
      framework:
         cache:
             # Redis
             app: cache.adapter.redis
             default_redis_provider: redis://redis:6379
    ```

1. Clear Symfony Cache pool
    ```bash
    ddev php bin/console cache:clear
        // Clearing the cache for the prod environment with debug false
        [OK] Cache for the "prod" environment (debug=false) was successfully cleared.
    ddev php bin/console cache:pool:clear cache.app
        // Clearing cache pool: cache.app
        [OK] Cache was successfully cleared.
    ```
    If no error is displayed, your new Redis component is in use
<--->
+++
title=Using Symfony Server
+++

1. To install Redis locally, follow steps from the [official Documentation](https://redis.io/docs/getting-started/installation/)

1. Configure your Symfony application to use this new Redis component

   You need to configure your Symfony application to use Redis by modifying your `config/packages/cache.yaml` with the following:

    ```yaml {location="config/packages/cache.yaml"}
      framework:
         cache:
             # Redis
             app: cache.adapter.redis
             default_redis_provider: redis://localhost:6379
    ```
1. Clear Symfony Cache pool
    ```bash
    symfony bin/console cache:clear
        // Clearing the cache for the prod environment with debug false
        [OK] Cache for the "prod" environment (debug=false) was successfully cleared.
    symfony bin/console cache:pool:clear cache.app
        // Clearing cache pool: cache.app
        [OK] Cache was successfully cleared.
    ```
   If no error is displayed, your new Redis component is in use
{{< /codetabs >}}

6. Use Symfony Cache component within your application

    ```php {location="src/Service/SomeClass.php"}
    <?php

    namespace App\Service;

    use Symfony\Contracts\Cache\CacheInterface;
    use Symfony\Contracts\Cache\ItemInterface;

    class SomeClass
    {
        public function __construct(private CacheInterface $cache) {}

        public function someMethod()
        {
            return $this->cache->get('item_0', function(ItemInterface $item) {
                $item->expiresAfter(7200);
                // return whatever you want to store into $item
                return 'foo';
            });
        }
    }
    ```

7. Commit your files and deploy

    Commit your modified files into your git branch and then deploy it to your environment.
    ```bash
    git add . && git commit -m "Add Redis 7.0 component" && symfony cloud:deploy
    ```
    After deployment, the Redis component is up and ready to use.

8. Deploy Redis in production

    If there is no issue on your Platform.sh environment using the Redis component, you can deploy it to production.
    ```bash
    symfony checkout main
    symfony merge feat-add-redis
    git pull -r
   ```

   {{< note >}}
   `symfony merge` command merge your environment `feat-add-redis` to your production environment, but it doesn't pull the merge result locally. That’s why you need to run `git pull -r` before doing anything else on that branch.
   {{< /note >}}


## Tips and tricks

{{% tips-and-tricks/redis framework="Symfony" %}}
