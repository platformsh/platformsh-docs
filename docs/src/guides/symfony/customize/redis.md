---
title: "Configure Symfony to use Redis component"
sidebarTitle: "Use Redis"
weight: -101
description: |
    Modify your Symfony site to use Redis.
---

Now that your code contains all needed configuration to deploy on Platform.sh,
it's time to make your Symfony site itself ready to use a Redis cache system.


## Create a new branch
From your terminal, at the root of your Symfony application, create a new Git branch:

```bash
symfony cloud:branch feat-add-redis
```

## Configure your Symfony Application to use Redis

1. Create a DockerFile for Redis
   The generated docker-compose.yml file already contains PostgreSQL as a service:
   ```yaml
   version: '3'

   services:
      cache:
        image: redis:7-alpine
        restart: always
        command: redis-server --save 20 1 --loglevel warning
        volumes:
          - cache:/data

   volumes:
     cache:
       driver: local
   ```

   This will install a Redis server locally.

   Then, expose the Redis port (`6379`) of the container to the local host:

    ```yaml {location="./docker-compose.override.yml"}
    version: '3'

    services:
    ###> doctrine/doctrine-bundle ###
      cache:
        ports:
          - '6379:6379'
    ###< doctrine/doctrine-bundle ###
    ```

1. Start Docker Compose

   Start Docker Compose in the background (-d):
    ```bash
    docker-compose up -d
    ```

    {{< note >}}When using [Docker with Symfony Server](https://symfony.com/doc/current/setup/docker.html), then your Symfony Server can automatically detect your Docker services and expose them as environment variables. {{< /note >}}

1. Configure your Symfony application to use this Redis component

   You need to configure your Symfony application to use Redis by modifying your `config/packages/cache.yaml` with the following:

    ```yaml {location="config/packages/cache.yaml"}
    framework:
      cache:
        # Redis
        app: cache.adapter.redis
        default_redis_provider: '%env(REDIS_URL)%'
    ```
1. Create a new environment variable `REDIS_URL`
    ```yaml
    REDIS_URL=redis://cache:6379
    ```

1. Clear Symfony Cache pool
    ```bash
    symfony console cache:clear
         // Clearing the cache for the dev environment with debug true
         [OK] Cache for the "dev" environment (debug=true) was successfully cleared.
    symfony console cache:pool:clear cache.app
        // Clearing cache pool: cache.app
        [OK] Cache was successfully cleared.
    ```

6. Use Symfony Cache component within your application


{{< codetabs >}}
+++
title=In a Controller
+++
```php {location="src/Controller/MyController.php"}
<?php

namespace App\Controller;

use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class MyController
{
    public function someMethod(CacheInterface $cache): Response
    {
        return new Response($cache->get('item_0', function(ItemInterface $item) {
            $item->expiresAfter(7200);
            // return whatever you want to store into $item
            return 'foo';
        }));
    }
}
```
<--->
+++
title=In a Service
+++
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
{{< /codetabs >}}

Et voilà, your Symfony application is using Redis locally.

## Make your Platform.sh project use Redis

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
      redis: "cache:redis"
   ```

   Follow this link to get more info on [relationships](../../../create-apps/app-reference.html#relationships).
   {{< note >}}
   Relationship key ``redis`` is important because it conditions the name of the corresponding auto-generated Symfony environment variable `REDIS_URL` as defined above in the [`config/packages/cache.yaml` file](#configure-your-symfony-application-to-use-redis).</br>
   Follow this link to get more info on [Symfony Environment Variables](../environment-variables.md#redis)
   {{< /note >}}

1. Add the PHP Redis extension

   For PHP to communicate with your Redis component, a php-ext is needed.
   All PHP extensions that need to be installed during runtime are listed in the `.platform.app.yaml` file, section `runtime`:

   ```bash {location=".platform.app.yaml"}
   runtime:
      extensions:
          - ...
          - redis
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
   `symfony merge` command merge your environment `feat-add-redis` to your production environment, but it doesn't pull back the merge result locally. That’s why you need to run `git pull -r` before doing anything else on that branch.
   {{< /note >}}


## Tips and tricks

{{% tips-and-tricks/redis framework="Symfony" %}}
