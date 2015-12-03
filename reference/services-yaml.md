# `.platform/services.yaml`

## Configure Services

Platform.sh allows you to completely define and configure the topology
and services you want to use on your project.

Unlike other PaaS services, Platform.sh is *batteries included* which means
that you don't need to subscribe to an external service to get a cache or
a search engine. And that those services are managed. When you back up your
project, all of the services are backed-up.

Services are configured through the [.platform/services.yaml](reference/services-yaml.md)
file you will need to commit to your git repository. This section describes
specifics you might want to know about for each service.

If you don't have a `.platform` folder, you need to create one:

```bash
mkdir .platform
touch .platform/services.yaml
```

Here is an example of a `services.yaml` file:

```yaml
database1:
  type: mysql:5.5
  disk: 2048

database2:
  type: postgresql:9.3
  disk: 1024
```

## Name

The `name` you want to give to your service. You are free to name each service as you wish
(*lowercase alphanumeric only*). 

Usually you will see in our examples that we simply call the mysql: `mysql`. Note that you can have multiple instances of each service.

**WARNING**: Because we support multiple services of the same type (you can have 3 different MySQL instances), changing the name of the service in ``services.yaml`` will be interpreted as destroying the existing service and creating a new one. This will make **all the data in that service disappear forever**. Remember to always snapshot your environment in which you have important data before modifying this file.

### Type

The `type` of your service. It's using the format ``type:version``. 

The version number is optional. If you don't specify a version number, the *default* version will be loaded.

If you specify a version number which is not available, you'll see this error when pushing your changes:

```bash
Validating configuration files.
E: Error parsing configuration files:
    - services.mysql.type: 'mysql:5.6' is not a valid service type.
```

### Disk

The `disk` attribute is the size of the persistent disk (in MB) allocated to the service. 

For example, the current default storage amount per project is 5GB (meaning 5120MB) which you can distribute between your application (as defined in `.platform.app.yaml`) and each of its services.

## Using the services

In order for a service to be available to an application in your project (Platform.sh supports not only multiple backends but also multiple applications in each project) you will need to refer to it in the `.platform.app.yaml` file which configures the *relationships* between applications and services, [documented here](/user_guide/reference/platform-app-yaml.html).

## Defaults

If you do not provide a `services.yaml` file, the following default one will be loaded:

```yaml
mysql:
    type: mysql:5.5
    disk: 2048

redis:
    type: redis:2.8

solr:
    type: solr:3.6
    disk: 1024
```
