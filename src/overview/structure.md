# Structure

Every application you deploy on Platform.sh is built as a *virtual cluster*, containing a series of containers.  The master branch of your Git repository is always deployed as a production cluster.  Any other branch can be deployed as a development cluster.  By default you can have up to three live development clusters at once but you can buy more on a per-project basis.

There are three types of containers within your cluster: One *Router*, one or more *Applications*, and zero or more *Services*.  When deployed, they conceptually look like this:

![](https://platform.sh/sites/default/files/scalable-images/architecture-simple.svg)


All of those containers are managed by three special files in your Git repository: `.platform/routes.yaml`, `.platform/services.yaml`, and `.platform.app.yaml`.

In most cases, that means your repository will look like this:

```
yourproject/
  .git/
  .platform/
    services.yaml
    routes.yaml
  .platform.app.yaml
  <your files here>
```

## Router

There is always exactly one Router per cluster.  The Router of a cluster is a single nginx process.  It is configured by the `routes.yaml` file.  Its purpose is to map incoming requests to an Application container, and to provide basic caching of responses if so configured. It has no persistent storage.

## Service

Service containers are configured by the `services.yaml` file.  There may be zero or more service containers in a cluster, depending on the `services.yaml` file.  The code for a Service is provided by Platform.sh in a pre-built container image, along with default configuration.  Depending on the service it may also have user-provided configuration in the `services.yaml` file.  Examples of services include MySQL/MariaDB, Elasticsearch, Redis, and RabbitMQ.

## Application

There is always at least one Application container per cluster, but there may be more.  Each application container corresponds to a `.platform.app.yaml` file in the repository.  If there are 3 `.platform.app.yaml` files, there will be three Application containers.  Application containers hold the code you provide via your Git repository.  Application containers are always built off of one of the Platform.sh-provided language-specific images, such as “PHP 5.6”, “PHP 7.2”, or “Python 3.6”. And different application containers can be running different languages or versions.

For most typical applications there is only one `.platform.app.yaml` file, which is generally placed at the repository root.
