---
title: "{{% vendor/name %}} YAML tags"
weight: 0
description: "A description of custom YAML tags available for {{% vendor/name %}} files."
---

In addition to the [basic functions you should be familiar with](./what-is-yaml.md), YAML allows for special tags.
{{% vendor/name %}} accepts certain custom tags to facilitate working with configuration files.

These tags work with {{% vendor/name %}} configuration files, but may not elsewhere.

## Include

Use the `!include` tag to embed external files within a given YAML file.

The tag requires two properties:

| Property | Type     | Possible values               | Description                                                                                             |
| -------- | -------- | ----------------------------- |---------------------------------------------------------------------------------------------------------|
| `type`   | `string` | `string`, `binary`, or `yaml` | See the descriptions of [strings](#string), [binaries](#binary), and [YAML](#yaml). Defaults to `yaml`. |
| `path`   | `string` |                               | The path to the file to include, relative to the application directory or `source.root` if defined.     |


By default, `path` is relative to the current application's directory (what you would define with `source.root`).

For example, to include another ``.platform/app1.yaml`` file in the main `{{% vendor/configfile "apps" %}}`, follow these steps:

1. Write and save your ``.platform/app1.yaml`` file:

```yaml {location=".platform/app1.yaml"}
source:
  root: "/"
type: "nodejs:20"
web:
  commands:
    start: "node index.js"
upstream:
  socket_family: tcp
locations:
  "/":
    passthru: true
```

And including it:

```yaml {configFile="apps"}
myapp: !include
  type: yaml
  path: ./app1.yaml
# or as default type is "yaml", it could be:
#api: !include ./app1.yaml
```

You can also include files from a directory that is parent to the folder.

For example, for the following project structure:

```bash
.
├── {{< vendor/configdir >}}
|   └── {{< vendor/configfile "apps" "strip" >}}
├── backend
│   ├── main.py
│   ├── requirements.txt
│   └── scripts
│       ├── ...
│       └── common_build.sh
└── frontend
    ├── README.md
    ├── package-lock.json
    ├── package.json
    ├── public
    ├── scripts
    │   └── clean.sh
    └── src
```

This configuration is valid:

```yaml {configFile="apps"}
frontend:
  source:
    root: frontend
  # ...
  hooks:
    build: !include
      type: string
      path: ../backend/scripts/common_build.sh
```

{{% note theme="info" %}}

{{% vendor/name %}} will execute this ``../backend/scripts/common_build.sh`` script using [Dash](https://wiki.archlinux.org/title/Dash).

{{% /note %}}

### `string`

Use `string` to include an external file inline in the YAML file as if entered as a multi-line string.

For example, if you have a build hook like the following:

```yaml {configFile="apps"}
frontend:
  hooks:
    build: |
      set -e
      cp a.txt b.txt
```

You could create a file for the script:

```text {location="build.sh"}
set -e
cp a.txt b.txt
```

And replace the hook with an include tag for an identical result:

```yaml {configFile="apps"}
frontend:
  hooks:
    build: !include
      type: string
      path: build.sh
```

This helps you break longer configuration like build scripts out into a separate file for easier maintenance.

### `binary`

Use `binary` to include an external binary file inline in the YAML file.
The file is base64 encoded.

For example, you could include a `favicon.ico` file in the same folder as your app configuration.
Then you can include it as follows:

```yaml {configFile="apps"}
properties:
  favicon: !include
    type: binary
    path: favicon.ico
```

### `yaml`

Use `yaml` to include an external YAML file inline as if entered directly.
Because `yaml` is the default, you can use it without specifying the type.

For example, you could have your configuration for works defined in a `worker.yaml` file:

```yaml {location="worker.yaml"}
size: S
commands:
  start: python queue-worker.py
variables:
  env:
    type: worker
```

Then the following three configurations are exactly equivalent:

```yaml {configFile="app"}
workers:
  queue1: !include "worker.yaml"
```

```yaml {configFile="app"}
workers:
  queue1: !include
    type: yaml
    path: 'worker.yaml'
```

```yaml {configFile="app"}
workers:
  queue1:
    size: S
    commands:
      start: python queue-worker.py
    variables:
      env:
        type: worker
```

This can help simplify more complex files.

## Archive

Use the `!archive` tag for a reference to an entire directory specified relative to where the YAML file is.

For example, you might want to define a configuration directory for your [Solr service](/add-services/solr.md).
You might do so as follows:

```yaml {configFile="services"}
mysearch:
  type: solr:8.0
  disk: 1024
  configuration:
    conf_dir: !archive "solr/conf"
```

The `!archive` tag means that the value for `conf_dir` isn't the string `solr/conf` but the entire `solr/conf` directory.
This directory is in the `{{< vendor/configdir >}}` directory, since that's where the `{{< vendor/configfile "services" >}}` file is.
The `solr/conf` directory is then copied into the {{% vendor/name %}} management system to use with the service.
