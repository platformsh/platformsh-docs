---
search:
    keywords: ['.platform.app.yaml', 'worker', 'queue']
---

# Workers

Every application may optionally define zero or more worker instances.  A worker instance runs as its own container independently of the web instance and has no Nginx instance running.  The router service cannot direct public requests to it, either, so running your own web server on a worker (using Node.js or Go) is not useful.

A worker instance is the exact same code and compilation output as a web instance.  The container image is built only once, and then deployed multiple times if needed.  That is, the `build` hook and `dependencies` may not vary from one instance to another.  What may vary is how the container is then configured and how resources are allocated.

Worker instances are well suited for background tasks such as queue workers, updating indexes, or for running periodic reporting tasks that are too long to make sense as a cron job.  (Although those should often be broken up into queue tasks.)

A basic, common worker configuration could look like this:

```yaml
workers:
    queue:
        size: S
        commands:
            start: |
                php worker.php
```

That defines a single worker named `queue`, which will be a "small" container, and wil run the command `php worker.php` on startup.  If `worker.php` ever exits it will be automatically restarted.

Any number of workers may be defined with their own distinct name, subject to available resources on your plan.

## Commands

The `commands` key defines the command to launch the worker application.  For now there is only a single command, `start`, but more will be added in the future.  The `commands.start` property is required.

The `start` key specifies the command to use to launch your worker application.  It may be any valid shell command, although most often it will run a command in your application in the language of your application.  If the command specified by the `start` key terminates it will be restarted automatically.

## Inheritance

Any top-level definitions for [`size`](/configuration/app/size.md), [`relationships`](/configuration/app/relationships.md), [`access`](/configuration/app/access.md), [`disk` and `mount`](/configuration/app/storage.md), and [`variables`](/configuration/app/variables.md) will be inherited by every worker, unless overridden explicitly.

That means, for example, that the following two `.platform.app.yaml` definitions produce identical workers.

```yaml
name: app

type: python:3.5

disk: 256
mounts:
    "test": "shared:files/test"

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
            "test": "shared:files/test"
        relationships:
            database: 'mysqldb:mysql'
    mail:
        commands:
            start: |
                python mail-worker.py
        disk: 256
        mounts:
            "test": "shared:files/test"
        relationships:
            database: 'mysqldb:mysql'
```

In both cases, there will be two worker instances named `queue` and `mail`.  Both will have access to a MySQL/MariaDB service defined in `services.yaml` named `mysqldb` through the `database` relationship.  Both will also have their own separate, independent local disk mount at `/app/test` with 256 MB of allowed space.

## Customizing a worker

The most common properties to set in a worker to override the top-level settings are `size` and `variables`.  `size` lets you allocate fewer resources to a container that will be running only a single background process (unlike the web site which will be handling many requests at once), while `variables` lets you instruct the application to run differently as a worker than as a web site.

For example, consider this `.platform.app.yaml`:

```yaml
name: app

type: "python:3.6"

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
        "uploads": "shared:files/uploads"
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
            "scratch": "shared:files/scratch"

        
    mail:
        size: 'S'
        commands:
            start: |
                python mail-worker.py
        variables:
            env:
                type: 'worker'
        disk: 128
        mounts: {}
        relationships:
            emails: 'rabbitqueue:rabbitmq'
```

There's a lot going on here, but it's all reasonably straightforward.  This configuration will take a single Python 3.6 code base from your repository, download all dependencies in `requirements.txt`, and the install Gunicorn.  That artifact (your code plus the downloaded dependencies) will be deployed as three separate container instances, all running Python 3.6.

The `web` instance will start a gunicorn process to serve a web application.  

* It will run the gunicorn process to serve web requests, defined by the `project/wsgi.py` file which contains an `application`definition. 
* It will have an environment variable named `TYPE` with value `web`.
* It will have a writeable mount at `/app/uploads` with a maximum space of 2048 MB.
* It will have access to both a MySQL database and a RabbitMQ server, both of which are defined in `services.yaml`.
* Platform.sh will automatically allocate resources to it as available on the plan, once all fixed-size containers are allocated.

The `queue` instance will be a worker that is not web-accessible.

* It will run the `queue-worker.py` script, and restart it automatically if it ever terminates.
* It will have an environment variable named `TYPE` with value `worker`.
* It will have a writeable mount at `/app/scratch` with a maximum space of 512 MB.
* It will have access to both a MySQL database and a RabbitMQ server, both of which are defined in `services.yaml` (because it doesn't specify otherwise).
* It will have "Medium" levels of CPU and RAM allocated to it, always.

The `mail` instance will be a worker that is not web-accessible.

* It will run the `mail-worker.py` script, and restart it automatically if it ever terminates.
* It will have an environment variable named `TYPE` with value `worker`.
* It will have no writeable file mounts at all.
* It will have access only to the RabbitMQ server, through a different relationship name than on the `web` instance.  It will have no access to MySQL whatsoever.
* It will have "Small" levels of CPU and RAM allocated to it, always.

This way, the web instance has a large upload space, the queue instance has a small amount of scratch space for temporary files, and the mail instance has no writeable disk space at all as it doesn't need it.  The mail instance also does not need any access to the SQL database so for security reasons it has none.  The workers have known fixed sizes, while web can scale to as large as the plan allows.  Each instance can also check the `TYPE` environment variable to detect how it's running and, if appropriate, vary its behavior accordingly.
