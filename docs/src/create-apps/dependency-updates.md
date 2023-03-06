---
title: Automate your dependency updates
sidebarTitle: Automated dependency updates
description: Learn how to automate your dependency updates through a source operation. You can even trigger your dependency updates automatically using crons.
tier:
  - Elite
  - Enterprise
---

Platform.sh allows you to run automated code updates through [source operations](../create-apps/source-operations.md).

For example, you can set up a source operation to run dependency updates on your project. 
You can then trigger the source operation and therefore your dependency updates automatically using a cron job.

## Before you start

You need:

- The [Platform.sh CLI](../administration/cli/_index.md)
- An [API token](../administration/cli/api-tokens.md) to authenticate the CLI
  and run a cron job in your app container

## 1. Update your dependencies using a source operation

To facilitate dependency updates in your project, set up a source operation depending on your dependency manager:

{{< codetabs >}}

+++
title=Composer
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                composer update
                git add composer.lock
                git commit -m "Update Composer dependencies"
```

<--->

+++
title=npm
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                npm update
                git add package.json package-lock.json 
                git commit -m "Update npm dependencies"
```

<--->

+++
title=Yarn
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                yarn upgrade
                git add yarn.lock
                git commit -m "Update yarn dependencies"
```

<--->

+++
title=Go
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                go get -u
                go mod tidy
                git add go.mod go.sum
                git commit -m "Update Go dependencies"
```

<--->

+++
title=Pipenv
+++

```bash
source:
    operations:
        update:
            command: |
                set -e
                pipenv update
                git add Pipfile Pipfile.lock
                git commit -m "Update Python dependencies"
````

<--->

+++
title=Bundler
+++

```bash
source:
    operations:
        update:
            command: |
                set -e
                bundle update --all
                git add Gemfile Gemfile.lock
                git commit -m "Update Ruby dependencies"
```

{{< /codetabs >}}

## 2. Run your dependency updates automatically with a cron job

After you've set up a source operation to [run dependency updates on your project](#1-update-your-dependencies-using-a-source-operation),
you can [automate it using a cron job](../create-apps/source-operations.md#automated-source-operations-using-a-cron-job).

Make sure you have the [Platform.sh CLI](../administration/cli/_index.md) installed
and [an API token](../administration/cli/api-tokens.md)
so you can run a cron job in your app container.
You can then add a cron job to run your source operation once a day.

Note that it’s best not to run source operations on your production environment,
but rather on a dedicated environment where you can test changes.

To set up a cron job to automatically update your dependencies once a day,
use a configuration similar to the following:

```yaml {location=".platform.app.yaml"}
crons:
   update:
       # Run the 'update' source operation every day at midnight.
       spec: '0 0 * * *'
       commands:
           start: |
               set -e
               if [ "$PLATFORM_BRANCH" = update-dependencies ]; then
                   platform environment:sync code data --no-wait --yes
                   platform source-operation:run update --no-wait --yes
               fi
```