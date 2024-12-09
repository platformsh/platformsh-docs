---
title: "Configure workers"
sidebarTitle: "Workers"
weight: -110
description: |
    Understand how to configure Symfony workers.
---

Workers (or consumers) are a great way to off-load processing in the background
to make an app as fast as possible.
You can implement workers in Symfony smoothly thanks to the [Messenger component](https://symfony.com/doc/current/components/messenger.html).

To deploy a worker, add an entry under the `workers` section [in your app configuration](/create-apps/_index.md):

```yaml {configFile="app"}
applications:
  myapp:
    workers:
      mails:
        commands:
          start: symfony console messenger:consume --time-limit=60 --memory-limit=128M
```

Note that the `symfony` binary is available when you use the [Symfony
integration](./integration) in your {{% vendor/name %}} app configuration.

On {{% vendor/name %}}, worker containers run the exact same code as the web container.
The container image is built only once and deployed multiple times in its own container alongside the web container.
The *build* hook and dependencies might not vary but,
as these containers are independent, they can be customized the same way using common properties.
The values defined for the main container are used as default values.

{{< note title="Tip">}}

When the container is running in the context of a worker, the
`SYMFONY_IS_WORKER` environment variable is defined and set to `1`.

{{< /note >}}

The `commands.start` key is required.
It specifies the command you can use to launch the application worker.
If the command specified by the `start` key terminates, it's restarted automatically.

For more information, see [Workers](/create-apps/app-reference/single-runtime-image#workers).

{{< note title="Warning">}}

Web and worker containers don't share mounts targets.
So you can't share files between those containers using the filesystem.
To share data between containers, use [services](/add-services/_index.md).

{{< /note >}}

{{< guide-buttons previous="Back" next="Set up cron jobs" nextLink="/get-started/stacks/symfony/crons.md" type="*" >}}
