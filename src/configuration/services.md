---
search:
    keywords: ['services', 'services.yaml', '.platform/services.yaml']
---

# Configure Services

Platform.sh allows you to completely define and configure the topology
and services you want to use on your project.

Unlike other PaaS services, Platform.sh is *batteries included* which means
that you don't need to subscribe to an external service to get a cache or
a search engine. And that those services are managed. When you back up your
project, all of the services are backed-up.

Services are configured through the `.platform/services.yaml`
file you will need to commit to your Git repository. This section describes
specifics you might want to know about for each service.

![Services](/images/config_diagrams/services.svg)

If you don't have a `.platform` folder, you need to create one:

```bash
mkdir .platform
touch .platform/services.yaml
```

Here is an example of a `services.yaml` file:

```yaml
database1:
  type: mysql:10.1
  disk: 2048

database2:
  type: postgresql:9.6
  disk: 1024
```

### Name

The `name` you want to give to your service. You are free to name each service as you wish
(*lowercase alphanumeric only*).

**WARNING**: Because we support multiple services of the same type (you can have 3 different MySQL instances), changing the name of the service in ``services.yaml`` will be interpreted as destroying the existing service and creating a new one. This will make **all the data in that service disappear forever**. Remember to always snapshot your environment in which you have important data before modifying this file.

### Type

The `type` of your service. It's using the format ``type:version``.

If you specify a version number which is not available, you'll see this error when pushing your changes:

```bash
Validating configuration files.
E: Error parsing configuration files:
    - services.mysql.type: 'mysql:5.6' is not a valid service type.
```

### Disk

The `disk` attribute is the size of the persistent disk (in MB) allocated to the service.

For example, the current default storage amount per project is 5GB (meaning 5120MB) which you can distribute between your application (as defined in `.platform.app.yaml`) and each of its services.  For memory-resident-only services such as `memcache` or `redis`, the `disk` key is not available and will generate an error if present.

> **notes**
> Currently we do not support downsizing the persistent disk of a service.

### Size

By default, Platform.sh will allocate CPU and memory resources to each container automatically.  Some services are optimized for high CPU load, some for high memory load.  By default, Platform.sh will try to allocate the largest "fair" size possible to all services, given the available resources on the plan.  That is not always optimal, however, and you can customize that behavior on any service or on any application container.  See the [application sizing](/configuration/app/size.md) page for more details.

## Service timezones

All services have their system timezone set to UTC by default.  In most cases that is the best option.  For some applications it's possible to change the application timezone, which will affect only the running application itself.

* MySQL - You can change the per-connection timezone by running SQL `SET time_zone = <timezone>;`.
* PostgreSQL - You can change the timezone of current session by running SQL `SET TIME ZONE <timezone>;`.

## Using the services

In order for a service to be available to an application in your project (Platform.sh supports not only multiple backends but also multiple applications in each project) you will need to refer to it in the [.platform.app.yaml](/configuration/app-containers.md) file which configures the *relationships* between applications and services.


## Endpoints

All services offer one or more `endpoints`.  An endpoint is simply a named set of credentials that can be used to access the service from other applications or services in your project.  Only some services support multiple user-defined endpoints.  If you do not specify one then one will be created with a standard defined name, generally the name of the service type (e.g., `mysql` or `solr`).  An application container, defined by a `.platform.app.yaml` file, always exposes and endpoint named `http` to allow the [router](/configuration/routes.md) to forward requests to it.

When defining relationships in a configuration file you will always address a service as `<servicename>`:`<endpoint>`.  See the appropriate service page for details on how to configure multiple endpoints for each service that supports it.


## Connecting to a service

Once a service is running and exposed as a relationship, its appropriate credentials (host name, username if appropriate, etc.) will be exposed through the `PLATFORM_RELATIONSHIPS` environment variable.  The structure of each is documented on the appropriate service's page, along with sample code for how to connect to it from your application. Note that different applications manage configuration differently so the exact code will vary from one application to another.

Be aware that the keys in the `PLATFORM_RELATIONSHIPS` structure are fixed but the values they hold may change on any deployment or restart.  Never hard-code connection credentials for a service into your application.  You should re-check the environment variable every time your script or application starts.

To connect to a remote service from your local computer, the easiest way is to use the [Platform CLI](/overview/cli.md) to open an SSH tunnel.

```bash
platform tunnel:open
```

That will open an SSH tunnel to all services on the current environment, and give an output similar to:

```bash
SSH tunnel opened on port 30000 to relationship: redis
SSH tunnel opened on port 30001 to relationship: database
Logs are written to: /home/myuser/.platformsh/tunnels.log

List tunnels with: platform tunnels
View tunnel details with: platform tunnel:info
Close tunnels with: platform tunnel:close
```

In this example, we can now securely connect to the database or redis server on our environment by connecting to the specified local ports.  The `platform tunnels` command will list all open tunnels:

```text
+-------+---------------+-------------+-----------+--------------+
| Port  | Project       | Environment | App       | Relationship |
+-------+---------------+-------------+-----------+--------------+
| 30000 | a43m75zns6k4c | master      | [default] | redis        |
| 30001 | a43m75zns6k4c | master      | [default] | database     |
+-------+---------------+-------------+-----------+--------------+
```
