# `.platform/services.yaml`
## Configure Services

Platform.sh allows you to completely define and configure the topology
and services you want to use on your project.

The topology is stored into a `services.yaml` file which should be added
inside the `.platform` folder at the root of your Git repository.

If you don't have a `.platform` folder, you need to create one:

```bash
$ mkdir .platform
```

Here is an example of a `services.yaml` file:

```yaml
# .platform/services.yaml
mysql:
  type: mysql
  disk: 2048

solr:
  type: solr
  disk: 1024
```

**Available services**

-   mysql
-   solr
-   redis

> **note**
> Platform.sh uses Solr 3.6 by default, but Solr 4.10 is also supported. You can request it by specifying the service type as ``solr:4.10``.


