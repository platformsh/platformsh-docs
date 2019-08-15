# Platform.sh Configuration File Generator

This is a simple library for generating valid and up-to-date configuration YAML files for Platform.sh written in Node.js. It uses the `pshregistry-helper` library to access data in a `registry.json` to generate those files.

## Usage Example

This is an early stage of the registry project.

At this point, common actions like adding a newly supported version to an existing image requires you to manually add that new version to the `<image>.versions.supported` attribute in the `registry.json` file, located here:

```
src/registry/images/registry.json
```

Once you have done that, docs will use this library to rewrite all example configuration files by running

```
node src/scripts/updateConfigs.js
```

during the build hook.

## Generated example configuration files

The library creates example YAML files that fall into three main categories:

* `commented`: Full configuration file used in a project, including heavy commenting. For Elasticsearch,

  ```
  # The name given to the Elasticsearch service (lowercase alphanumeric only).
  mysearch:
    # The type of your service (elasticsearch), which uses the format
    # 'type:version'. Be sure to consult the Elasticsearch documentation
    # (https://docs.platform.sh/configuration/services/elasticsearch.html#supported-versions)
    # when choosing a version. If you specify a version number which is not available,
    # the CLI will return an error.
    type: elasticsearch:7.2
    # The disk attribute is the size of the persistent disk (in MB) allocated to the service.
    disk: 256
  ```

* `full`: Full configuration file used in a project. For the Elasticsearch `.platform.app.yaml`,

  ```
  relationships:
    elasticsearch: "mysearch:elasticsearch"
  ```

* `snippet`: Partial configuration file. Single-line for that image that can be used to append to another file if we ever want to have tools that generate complete configuration files for the user. For the Elasticsearch `.platform.app.yaml` snippet,

  ```
    elasticsearch: "mysearch:elasticsearch"
  ```

Each of these files for every image in a Registry object is generated from the `write()` method:


```
// updateConfigs.js
const psh = require("pshconfig-generator");


var registryLocation = "src/registry/images/registry.json";

var cg = psh.configGenerator(registryLocation);
cg.write();

```

but you can also write files for individual images (i.e. Elasticsearch) with

```
cg.write("elasticsearch");
```

It is not necessary to designate a save location for the example files, as `pshconfig-generator` assumes the `examples` subdirectory will be in the same location as `registry.json`. If `examples` or any of its subdirectories does not exist, they will be created.

## Future work

1. Make a dependency

  This is currently just a module within docs from the start, but really should exist in its own repository and pulled in as a dependency.
2. Use other places in the docsVersions
  `pshconfig-generator` includes `supported()` and `deprecated()` functions, that are not currently used. They return the content that will be useful for filling out other areas of the docs with version information (i.e. Getting Started tables and )
3. Generating the registry
  Right now we will have to edit the `registry.json` by hand, but ideally this library will point at a "ground truth" repo somewhere else (that updates regularly) to get its data, and the `registry.json` file will be eliminated from docs altogether.
