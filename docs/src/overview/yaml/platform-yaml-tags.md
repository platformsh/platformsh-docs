---
title: Platform.sh YAML tags
weight: 0
description: A description of custom YAML tags available for Platform.sh files.
---

YAML allows for special "tags" on values that change their meaning.
These tags may be customized for individual applications so may vary from one system to another.

## Includes

The main Platform.sh "local tag" is `!include`, which allows for external files to be logically embedded within the YAML file.  The referenced file is always relative to the YAML file's directory.

### `string`

The `string` type allows an external file to be inline in the YAML file as though it had been entered as a multi-line string.  For example, given this file on disk named `build.sh`:

```text
set -e
cp a.txt b.txt
```

Then the following two YAML fragments are exactly equivalent:

```yaml
hooks:
    build: |
        set -e
        cp a.txt b.txt
```

```yaml
hooks:
    build: !include
        type: string
        path: build.sh
```

That is primarily useful for breaking longer build scripts or inline configuration files out to a separate file for easier maintenance.

### `binary`

The `binary` type allows an external binary file to be inline in the YAML file.  The file will be base64 encoded.  For example:

```yaml
properties:
    favicon: !include
        type: binary
        path: favicon.ico
```

will reference the `favicon.ico` file, which will be provided to Platform.sh's management system.

### `yaml`

Finally, the `yaml` type allows an external YAML file to be inline into the file as though it had been typed in directly.  That can help simplify more complex files, such a `.platform.app.yaml` file with many highly customized `web.locations` blocks.

The `yaml` type is the default, meaning it may reference a file inline without specifying a type.

For example, given this file on disk named `main.yaml`:

```yaml
root: 'web'
expires: 5m
passthru: '/index.php'
allow: false
rules:
    '\.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$':
        allow: true
    '^/robots\.txt$':
        allow: true
    '^/sitemap\.xml$':
        allow: true
```

Then the following three `location` definitions are exactly equivalent:

```yaml
web:
    locations:
        '/': !include "main.yaml"
```

```yaml
web:
    locations:
        '/': !include
            type: yaml
            path: 'main.yaml'
```

```yaml
web:
    locations:
        '/':
            root: 'web'
            expires: 5m
            passthru: '/index.php'
            allow: false
            rules:
                '\.(jpe?g|png|gif|svgz?|css|js|map|ico|bmp|eot|woff2?|otf|ttf)$':
                    allow: true
                '^/robots\.txt$':
                    allow: true
                '^/sitemap\.xml$':
                    allow: true
```


### `!archive`

Another custom tag available is `!archive`, which specifies a value is a reference to a directory on disk, relative to the location of the YAML file.  Essentially it defines the value of key as "this entire directory".  Consider this `services.yaml` fragment:

```yaml
mysearch:
    type: solr:8.0
    disk: 1024
    configuration:
        conf_dir: !archive "solr/conf"
```

In this case, the `mysearch.configuration.conf_dir` value is not the string `solr/conf`, but the contents of the `solr/conf` directory (relative to the `services.yaml` file).  On Platform.sh, that is used primarily for service definitions in [`services.yaml`](../../add-services/_index.md) to provide a directory of configuration files for the service (such as Solr in this case).  Platform.sh will use that directive to copy the entire specified directory into our management system so that it can be deployed with the specified service.