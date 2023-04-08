---
title: "Configure Symfony to use Redis"
sidebarTitle: "Redis"
weight: -101
description: "Use Redis with your Symfony project."
---

Once you've set up your Symfony app [to be deployed on Platform.sh](../get-started.md),
you can configure it to use a Redis cache system.
To do so, follow these steps:

## 1. Create a new branch

Run the following command at the root of your Symfony app:

```bash
symfony cloud:branch feat-add-redis
```

## 2. Configure your Symfony app to use Redis

1. Create a DockerFile for Redis.

   The generated `docker-compose.yml` file already contains Redis as a service:

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

   This installs a Redis server locally.

2. Expose the Redis port (`6379`) of the container to the local host:

    ```yaml {location="./docker-compose.override.yml"}
    version: '3'

    services:
    ###> doctrine/doctrine-bundle ###
      cache:
        ports:
          - '6379:6379'
    ###< doctrine/doctrine-bundle ###
    ```

3. Start Docker Compose in the background (`-d`):

   ```bash
   docker-compose up -d
   ```
   
   {{< note >}}
   
   When you use [Docker with Symfony Server](https://symfony.com/doc/current/setup/docker.html),
   your Symfony Server can automatically detect your Docker services and expose them as environment variables.
   
   {{< /note >}}

4. To configure your Symfony app to use the Redis component,
   update your `config/packages/cache.yaml` file with the following configuration:

    ```yaml {location="config/packages/cache.yaml"}
    framework:
      cache:
        # Redis
        app: cache.adapter.redis
        default_redis_provider: '%env(REDIS_URL)%'
    ```

5. To create a new `REDIS_URL` environment variable,
   run the following command:

    ```yaml
    REDIS_URL=redis://cache:6379
    ```

6. To clear the Symfony cache pool, run the following commands:

    ```bash
    symfony console cache:clear
         // Clearing the cache for the dev environment with debug true
         [OK] Cache for the "dev" environment (debug=true) was successfully cleared.
    symfony console cache:pool:clear cache.app
         // Clearing cache pool: cache.app
         [OK] Cache was successfully cleared.
    ```

7. Use the Symfony cache component within your app:

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

Your Symfony app is now using Redis locally.

## 3. Make your Platform.sh project use Redis

1. Add a Redis component.

   [All the components](../../../add-services#available-services) used for your Platform.sh environment,
   including the cache component, are listed in the `.platform/services.yaml` file.
   To add a new Redis component, add the following configuration:

    ```yaml {location=".platform/services.yaml"}
    cache:
      type: redis:7.0
      configuration:
        maxmemory_policy: volatile-lru
        # any other finetuning here
    ```

2. Add a new relationship.

   To manage access to containers within your project, 
   define [relationships](../../../create-apps/app-reference.html#relationships)
   in the `relationships` section of your `.platform.app.yaml` file.
   To do so, add the following configuration:

   ```yaml {location=".platform.app.yaml"}
   relationships:
      redis: "cache:redis"
   ```

   {{< note >}}

   The ``redis`` relationship key conditions the name of the corresponding [auto-generated `REDIS_URL` Symfony environment variable](#2-configure-your-symfony-app-to-use-redis).
   For more information, see [Symfony environment variables](../environment-variables.md#redis).

   {{< /note >}}

3. Add the PHP Redis extension.

   For PHP to communicate with your Redis component, a `php-ext` is needed.
   All the PHP extensions that need to be installed during runtime are listed
   in the `runtime` section of your `.platform.app.yaml` file.
   To add the PHP Redis extension, use the following configuration:

   ```yaml {location=".platform.app.yaml"}
   runtime:
      extensions:
          - ...
          - redis
   ```

4. Commit your files and deploy.

   To commit your modified files to your Git branch and deploy those changes to your environment,
   run the following command:

   ```bash
   git add . && git commit -m "Add Redis 7.0 component" && symfony cloud:deploy
   ```

    After deployment, the Redis component is up and ready to use.

5. To deploy Redis in production, run the following commands:

   ```bash
   symfony checkout main
   symfony merge feat-add-redis
   git pull -r
   ```

   {{< note >}}

   The `symfony merge` command merges your `feat-add-redis` environment into your production environment.
   But it doesn't pull the merge result locally. To do so, run `git pull -r` before doing anything else on the branch.

   {{< /note >}}

## Tips and tricks

{{% tips-and-tricks/redis framework="Symfony" %}}
