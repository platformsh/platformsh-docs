---
title: "Workers"
sidebarTitle: "Workers"
weight: -110
description: |
    Understand how to configure Symfony workers.
---

**Workers** (or consumers) are a great way to off-load processing in the
background to make an application as snap as possible. Implementing workers in
Symfony is made easy thanks to the [Messenger
component](https://symfony.com/doc/current/components/messenger.html).

To deploy a worker, add an entry under the ``workers`` section:

```yaml {location=".platform.app.yaml"}
workers:
    mails:
        commands:
            start: symfony console messenger:consume --time-limit=60 --memory-limit=128M
```

Note that the `symfony` binary available when using the [Symfony
integration](./integration) in your Platform.sh application configuration.

On Platform.sh, worker containers run the exact same code as the web container.
The container image is built only once, and then deployed multiple times in its
own container along the web one. The *build* hook and dependencies may not vary
but as these containers are independent they can be customized the same way
using common properties (default values are the one defined for the main
container).

{{< note title="Tip">}}

When the container is running in the context of a worker, the
`SYMFONY_IS_WORKER` environment variable is defined and set to `1`.

{{< /note >}}

The ``commands.start`` key is required and specifies the command to use to
launch the application worker. If the command specified by the ``start`` key
terminates it will be restarted automatically.

Follow this link to get more info on [Workers](../../../create-apps/app-reference.html#workers).

{{< note title="Caution">}}

Web and worker containers do not share mounts targets. Sharing files between
those containers using the filesystem is not possible. Every data sharing needs
to be done using services.

{{< /note >}}
