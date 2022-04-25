---
title: "Work with workers"
description: Interact with your worker instances to handle background tasks for your apps.
---

Workers are instances of your code that can't interact with the outside world.
They're good for handling background tasks.
See how to [configure a worker](./app-reference.md#workers) for your app.

## Accessing the Worker Container

Like with any other application container,
Platform.sh allows you to connect to the worker instance through SSH to inspect logs and interact with it.

Use the `--worker` switch in the Platform.sh CLI, like so:

```bash
platform ssh --worker=queue
```

## Stopping a worker

If a worker instance needs to be updated during a new deployment,
a `SIGTERM` signal will first be sent to the worker process to allow it to shut down gracefully.
If your worker process cannot be interrupted mid-task, make sure it reacts to `SIGTERM` to pause its work gracefully.

If the process is still running after 15 seconds, a `SIGKILL` message will be sent that force-terminates the worker process,
allowing the container to be shut down and restarted.

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
It may be any valid shell command, although most often it will run a command in your application in the language of your application.
If the command specified by the `start` key terminates it will be restarted automatically.

Note that [`deploy` and `post_deploy` hooks](/configuration/app/hooks/_index.md) as well as [`cron` commands](./app-reference.md#crons)
run only on the [`web`](/configuration/app/app-reference.md#web) container, not on workers.

## Inheritance

Any top-level definitions for [`size`](./app-reference.md#sizes), [`relationships`](./app-reference.md#relationships),
[`access`](/configuration/app/app-reference.md#access), [`disk`](/configuration/app/app-reference.md), [`mount`](/configuration/app/app-reference.md#mounts), and [`variables`](/configuration/app/app-reference.m#variables)
are inherited by every worker, unless overridden explicitly.

That means, for example, that the following two `.platform.app.yaml` definitions produce identical workers.

```yaml
name: app

type: python:3.5

disk: 256
mounts:
    test:
        source: local
        source_path: test

relationships:
    database: 'mysqldb:mysql'

workers:
    queue:
        commands:
            start: |
                python queue-worker.py
    mail:
        commands:
            start: |
                python mail-worker.py
```

```yaml
name: app

type: python:3.5

workers:
    queue:
        commands:
            start: |
                python queue-worker.py
        disk: 256
        mounts:
            test:
                source: local
                source_path: test
        relationships:
            database: 'mysqldb:mysql'
    mail:
        commands:
            start: |
                python mail-worker.py
        disk: 256
        mounts:
            test:
                source: local
                source_path: test
        relationships:
            database: 'mysqldb:mysql'
```

In both cases, there will be two worker instances named `queue` and `mail`.
Both will have access to a MySQL/MariaDB service defined in `services.yaml` named `mysqldb` through the `database` relationship.
Both will also have their own separate, independent local disk mount at `/app/test` with 256 MB of allowed space.

## Customizing a worker

The most common properties to set in a worker to override the top-level settings are `size` and `variables`.
`size` lets you allocate fewer resources to a container that will be running only a single background process
(unlike the web site which will be handling many requests at once),
while `variables` lets you instruct the application to run differently as a worker than as a web site.

For example, consider this `.platform.app.yaml`:

```yaml
name: app

type: "python:3.7"

disk: 2048

hooks:
    build: |
       pip install -r requirements.txt
       pip install -e .
       pip install gunicorn

relationships:
    database: 'mysqldb:mysql'
    messages: 'rabbitqueue:rabbitmq'

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
            source: local
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
        size: 'M'
        commands:
            start: |
                python queue-worker.py
        variables:
            env:
                type: 'worker'
        disk: 512
        mounts:
            scratch:
                source: local
                source_path: scratch



    mail:
        size: 'S'
        commands:
            start: |
                python mail-worker.py
        variables:
            env:
                type: 'worker'
        disk: 256
        mounts: {}
        relationships:
            emails: 'rabbitqueue:rabbitmq'
```

There's a lot going on here, but it's all reasonably straightforward.
This configuration will take a single Python 3.7 code base from your repository,
download all dependencies in `requirements.txt`, and the install Gunicorn.
That artifact (your code plus the downloaded dependencies) will be deployed as three separate container instances, all running Python 3.7.

The `web` instance will start a Gunicorn process to serve a web application.

* It will run the Gunicorn process to serve web requests, defined by the `project/wsgi.py` file which contains an `application` definition.
* It will have an environment variable named `TYPE` with value `web`.
* It will have a writable mount at `/app/uploads` with a maximum space of 2048 MB.
* It will have access to both a MySQL database and a RabbitMQ server, both of which are defined in `services.yaml`.
* Platform.sh will automatically allocate resources to it as available on the plan, once all fixed-size containers are allocated.

The `queue` instance will be a worker that is not web-accessible.

* It will run the `queue-worker.py` script, and restart it automatically if it ever terminates.
* It will have an environment variable named `TYPE` with value `worker`.
* It will have a writable mount at `/app/scratch` with a maximum space of 512 MB.
* It will have access to both a MySQL database and a RabbitMQ server,
  both of which are defined in `services.yaml` (because it doesn't specify otherwise).
* It will have "Medium" levels of CPU and RAM allocated to it, always.

The `mail` instance will be a worker that is not web-accessible.

* It will run the `mail-worker.py` script, and restart it automatically if it ever terminates.
* It will have an environment variable named `TYPE` with value `worker`.
* It will have no writable file mounts at all.
* It will have access only to the RabbitMQ server, through a different relationship name than on the `web` instance.
  It will have no access to MySQL whatsoever.
* It will have "Small" levels of CPU and RAM allocated to it, always.

This way, the web instance has a large upload space, the queue instance has a small amount of scratch space for temporary files,
and the mail instance has no persistent writable disk space at all as it doesn't need it.
The mail instance also does not need any access to the SQL database so for security reasons it has none.
The workers have known fixed sizes, while web can scale to as large as the plan allows.
Each instance can also check the `TYPE` environment variable to detect how it's running
and, if appropriate, vary its behavior accordingly.
