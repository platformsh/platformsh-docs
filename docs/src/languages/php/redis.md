---
title: "Custom Redis versions"
sidebarTitle: Custom Redis
weight: 7
---

[Redis](../../add-services/redis.md) is a popular structured key-value service, supported by Platform.sh.  It's frequently used for caching.

## Install PhpRedis

The [PhpRedis](https://github.com/phpredis/phpredis) extension is available on Platform.sh's PHP container images.  However, the extension has been known to break its API between versions when removing deprecated functionality.  The version available on each application image is the latest available at the time that PHP version was built, which if your application is very sensitive to PhpRedis versions may not be ideal.

If the version of the PhpRedis extension available for your PHP version is not compatible with your application
and upgrading your application is not feasible,
you can use the script linked below as an alternative to download and compile a precise version of the extension.

Do *not* use this approach unless you really need to.  Using the provided PhpRedis extension is preferred in the vast majority of cases.

To ease the installation of a customer version of PhpRedis, use a [PhpRedis install script](https://github.com/platformsh/snippets/blob/main/src/install-phpredis.sh).
Invoke this script from your build hook, specifying a version.
Any tagged version of the library is acceptable:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        # Install PhpRedis v5.1.1:
        curl -fsS https://raw.githubusercontent.com/platformsh/snippets/main/src/install-phpredis.sh | { bash /dev/fd/3 5.1.1 ; } 3<&0
```

## Install Relay

Relay is a [Redis](../../add-services/redis.md) client
similar to [PhpRedis](https://github.com/phpredis/phpredis) and
[Predis](https://github.com/predis/predis).
It is intended to be a drop-in replacement for those libraries.

That PHP extension is also a shared in-memory cache like APCu. All retrieved keys are held in the PHP master process’ memory, which is shared across all FPM workers.

That means if the FPM Worker #1 fetches the `users:count` key from Redis,
all other FPM workers instantaneously retrieve that key from Relay without having to communicate with Redis.

To ease the installation of a customer version of Relay, use the [Relay install script](https://github.com/platformsh/snippets/blob/main/src/install-relay.sh).
Invoke this script from your build hook, specifying a version.
Any tagged version of the library is acceptable:
## Change extension or version

To change the Redis extension or the version you are using, update the build hook and clear the build cache: `platform project:clear-build-cache`.
The new version is *not* be used until you clear the build cache.

There is no need to declare the extension in the `runtime` block.  That is only for pre-built extensions.

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        set -e
        # Install PhpRedis v0.4.3:
        curl -fsS https://raw.githubusercontent.com/platformsh/snippets/main/src/install-relay.sh | { bash /dev/fd/3 0.4.3 ; } 3<&0
```

## What these scripts do

1. Download the Relay/PhpRedis source code.
2. Check out the version specified in the build hook.
3. Compile the extension.
4. Copy the resulting `redis.so` file to [your app root](../../create-apps/app-reference.md#root-directory).
5. Adds a line to the `php.ini` file in your app root to enable the extension, creating the file if necessary.

If the script does not find a `$PLATFORM_CACHE_DIR` directory defined, it exits silently.  That means if you run the build hook locally it will have no effect.
