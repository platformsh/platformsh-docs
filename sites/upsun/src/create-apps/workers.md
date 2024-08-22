---
title: "Work with workers"
description: Interact with your worker instances to handle background tasks for your apps.
---

Workers are instances of your code that aren't open to connections from other apps or services or the outside world.
They're good for handling background tasks.
See how to [configure a worker](/create-apps/app-reference/single-runtime-image.md#workers) for your app.

## Access the worker container

Like with any other application container,
{{% vendor/name %}} allows you to connect to the worker instance through SSH to inspect logs and interact with it.

Use the `--worker` switch in the {{% vendor/name %}} CLI, like so:

```bash
{{% vendor/cli %}} ssh --worker=queue
```

## Stopping a worker

If a worker instance needs to be updated during a new deployment,
a `SIGTERM` signal is first sent to the worker process to allow it to shut down gracefully.
If your worker process can't be interrupted mid-task, make sure it reacts to `SIGTERM` to pause its work gracefully.

If the process is still running after 15 seconds, a `SIGKILL` message is sent that force-terminates the worker process,
allowing the container to be shut down and restarted.

To restart a worker manually, [access the container](#access-the-worker-container) and run the following commands:

```bash
sv stop app
sv start app
```

## Workers vs cron jobs

Worker instances don't run cron jobs.
Instead, both worker instances and cron tasks address similar use cases.
They both address out-of-band work that an application needs to do
but that shouldn't or can't be done as part of a normal web request.
They do so in different ways and so are fit for different use cases.

A cron job is well suited for tasks when:

* They need to happen on a fixed schedule, not continually.
* The task itself isn't especially long, as a running cron job blocks a new deployment.
* It's long but can be divided into many small queued tasks.
* A delay between when a task is registered and when it actually happens is acceptable.

A dedicated worker instance is a better fit if:

* Tasks should happen "now", but not block a web request.
* Tasks are large enough that they risk blocking a deploy, even if they're subdivided.
* The task in question is a continually running process rather than a stream of discrete units of work.

The appropriateness of one approach over the other also varies by language;
single-threaded languages would benefit more from either cron or workers than a language with native multi-threading, for instance.
If a given task seems like it would run equally well as a worker or as a cron,
cron is generally more efficient as it doesn't require its own container.

## Commands

The `commands` key defines the command to launch the worker application.
For now there is only a single command, `start`, but more will be added in the future.
The `commands.start` property is required.

The `start` key specifies the command to use to launch your worker application.
It may be any valid shell command, although most often it runs a command in your application in the language of your application.
If the command specified by the `start` key terminates, it's restarted automatically.

Note that [`deploy` and `post_deploy` hooks](./hooks/_index.md) as well as [`cron` commands](/create-apps/app-reference/single-runtime-image.md#crons)
run only on the [`web`](/create-apps/app-reference/single-runtime-image.md#web) container, not on workers.

## Inheritance

Any top-level definitions for [`relationships`](/create-apps/app-reference/single-runtime-image.md#relationships),
[`access`](/create-apps/app-reference/single-runtime-image.md#access), [`mount`](/create-apps/app-reference/single-runtime-image.md#mounts), and [`variables`](/create-apps/app-reference/single-runtime-image.md#variables)
are inherited by every worker, unless overridden explicitly.

Likewise [resources defined for the application container](/manage-resources/_index.md) are inherited by every worker, unless overridden explicitly.

That means, for example, that the following two `{{< vendor/configfile "app" >}}` definitions produce identical workers.

```yaml {configFile="app"}
applications:
  myapp: #The name of the app, which must be unique within the project.
    type: python:{{% latest "python" %}}
    mounts:
      test:
        source: storage
        source_path: test
    relationships:
      mysql:
    workers:
      queue:
        commands:
          start: |
            python queue-worker.py
      mail:
        commands:
          start: |
            python mail-worker.py
services:
  mysql:
    type: mariadb:{{% latest "mariadb" %}}
```

```yaml {configFile="app"}
applications:
  myapp: #The name of the app, which must be unique within the project.
    type: python:{{% latest "python" %}}
    workers:
      queue:
          commands:
            start: |
              python queue-worker.py
          mounts:
            test:
              source: storage
              source_path: test
          mysql:
      mail:
        commands:
          start: |
            python mail-worker.py
        mounts:
          test:
            source: storage
            source_path: test
        mysql:
services:
  mysql:
    type: mariadb:{{% latest "mariadb" %}}
```

In both cases, there are two worker instances named `queue` and `mail`.
Both have access to a MySQL/MariaDB service defined in `{{< vendor/configfile "services" >}}`,
through a [relationship](/create-apps/app-reference/single-runtime-image.md#relationships) that is identical to the _name_ of that service (`mysql`).
Both also have their own separate [`storage` mount](/create-apps/app-reference/single-runtime-image.md#mounts).

## Customizing a worker

The most common properties to set in a worker to override the top-level settings are `variables` and its resources.
`variables` lets you instruct the application to run differently as a worker than as a web site,
whereas you can allocate [fewer worker-specific resources](/manage-resources/_index.md) for a container that is running only a single background process
(unlike the web site which is handling many requests at once).

For example, consider the following configuration:

```yaml {configFile="app"}
applications:
  myapp: #The name of the app, which must be unique within the project.
    type: "python:{{% latest "python" %}}"
    hooks:
      build: |
        pip install -r requirements.txt
        pip install -e .
        pip install gunicorn
    relationships:
      mysql:
      rabbitmq:
    variables:
      env:
          type: 'none'
    web:
      commands:
        start: "gunicorn -b $PORT project.wsgi:application"
      variables:
        env:
          type: 'web'
      mounts:
        uploads:
          source: storage
          source_path: uploads
      locations:
        "/":
          root: ""
          passthru: true
          allow: false
        "/static":
          root: "static/"
          allow: true
    workers:
      queue:
        commands:
          start: |
            python queue-worker.py
        variables:
          env:
            type: 'worker'
        mounts:
          scratch:
            source: storage
            source_path: scratch
      mail:
        commands:
          start: |
            python mail-worker.py
        variables:
          env:
            type: 'worker'
        mounts: {}
        relationships:
          rabbitmq:
services:
  mysql:
    type: 'mariadb:{{% latest "mariadb" %}}'
  rabbitmq:
    type: 'rabbitmq:{{% latest "rabbitmq" %}}'
```

There's a lot going on here, but it's all reasonably straightforward.
The configuration in `{{< vendor/configfile "app" >}}` takes a single Python {{% latest "python" %}} code base from your repository,
downloads all dependencies in `requirements.txt`, and then installs Gunicorn.
That artifact (your code plus the downloaded dependencies) is deployed as three separate container instances, all running Python {{% latest "python" %}}.

The `web` instance starts a Gunicorn process to serve a web application.

- It runs the Gunicorn process to serve web requests, defined by the `project/wsgi.py` file which contains an `application` definition.
- It has an environment variable named `TYPE` with value `web`.
- It has a writable mount at `/app/uploads`.
- It has access to both a MySQL database and a RabbitMQ server, both of which are defined in `{{< vendor/configfile "services" >}}`.

The `queue` instance is a worker that isn't web-accessible.

- It runs the `queue-worker.py` script, and restart it automatically if it ever terminates.
- It has an environment variable named `TYPE` with value `worker`.
- It has a writable mount at `/app/scratch`.
- It has access to both a MySQL database and a RabbitMQ server,
  both of which are defined in `{{< vendor/configfile "services" >}}` (because it doesn't specify otherwise).

The `mail` instance is a worker that isn't web-accessible.

- It runs the `mail-worker.py` script, and restart it automatically if it ever terminates.
- It has an environment variable named `TYPE` with value `worker`.
- It has no writable file mounts at all.
- It has access only to the RabbitMQ server, through a different relationship name than on the `web` instance.
  It has no access to MySQL.

{{< note >}}

{{% vendor/name %}} automatically allocates [default resources](/manage-resources/resource-init) to each instance,
unless you [define a different resource initialization strategy](/manage-resources/resource-init#specify-a-resource-initialization-strategy).
You can also [adjust resources](/manage-resources/adjust-resources.md) after your project has been deployed.

{{< /note >}}

For example, if you want the `web` instance to have a large upload space
and the `queue` instance to have a small amount of scratch space for temporary files,
you can allocate more CPU and RAM to the `web` instance than to the `queue` instance.

The `mail` instance has no persistent writable disk space at all, as it doesn't need it.
The `mail` instance also doesn't need any access to the SQL database, so for security reasons it has none.

Each instance can also check the `TYPE` environment variable to detect how it's running
and, if appropriate, adjust its behavior accordingly.

## Mounts

When defining a [worker](../create-apps/app-reference/single-runtime-image.md#workers) instance,
keep in mind what mount behavior you want.

`tmp` and `instance` local mounts are a separate storage area for each instance,
while `storage` mounts can be shared between instances.

For example, you can define a `storage` mount (called `shared_dir`) to be used by a `web` instance,
and a `tmp` mount (called `local_dir`) to be used by a `queue` worker instance:

```yaml {configFile="app"}
applications:
  myapp: #The name of the app, which must be unique within the project.
    type: "nodejs:{{% latest "nodejs" %}}"

    # Define a web instance
    web:
      locations:
        "/":
          root: "public"
          passthru: true
          index: ['index.html']

    mounts:
      # Define a storage mount that's available to both instances together
      'shared_dir':
        source: storage
        service: files
        source_path: our_stuff

      # Define a local mount that's available to each instance separately
      'local_dir':
        source: tmp
        source_path: my_stuff

    # Define a worker instance from the same code but with a different start
    workers:
      queue:
        commands:
          start: ./start.sh
```

Both the `web` instance and `queue` worker have their own, dedicated `local_dir` mount.
Note that:
- Each `local_dir` mount is a [`tmp` mount](/create-apps/app-reference/single-runtime-image.md#mounts) with a **maximum allocation of 8 GB**.</br>
- `tmp` mounts **may be removed** during infrastructure maintenance operations.

Both the `web` instance and `queue` worker also have a `shared_dir` mount pointing to the same network storage space.
They can both read and write to it simultaneously.
