---
title: "Dependencies"
weight: 140
description:
---

{{% note title="Disclaimer" %}}
The ``dependencies`` key is valid only if you set your runtime using [built-in image (``type:``)](/create-apps/app-reference/images/builtin-image.md).
{{% /note %}}

Installs global dependencies as part of the build process.
They're independent of your app's dependencies
and are available in the `PATH` during the build process and in the runtime environment.
They're installed before the `build` hook runs using a package manager for the language.

| Language | Key name              | Package manager |
| -------- | --------------------- | --------------- |
| PHP      | `php`                 | [Composer](https://getcomposer.org/) |
| Python 2 | `python` or `python2` | [Pip 2](https://packaging.python.org/tutorials/installing-packages/) |
| Python 3 | `python3`             | [Pip 3](https://packaging.python.org/tutorials/installing-packages/) |
| Ruby     | `ruby`                | [Bundler](https://bundler.io/) |
| Node.js  | `nodejs`              | [npm](https://www.npmjs.com/) (see [how to use yarn](/languages/nodejs/_index.md#use-yarn-as-a-package-manager))|
| Java     | `java`                | [Apache Maven](https://maven.apache.org/), [Gradle](https://gradle.org/), or [Apache Ant](https://ant.apache.org/) |

The format for package names and version constraints are defined by the specific package manager.

An example of dependencies in multiple languages:

```yaml {configFile="app"}
applications:
    myapp:
        source:
            root: "/"
        type: 'nodejs:{{% latest "nodejs" %}}'
        dependencies:
            php: # Specify one Composer package per line.
                drush/drush: '8.0.0'
                composer/composer: '^2'
            python2: # Specify one Python 2 package per line.
                behave: '*'
                requests: '*'
            python3: # Specify one Python 3 package per line.
                numpy: '*'
            ruby: # Specify one Bundler package per line.
                sass: '3.4.7'
            nodejs: # Specify one NPM package per line.
                pm2: '^4.5.0'
```
