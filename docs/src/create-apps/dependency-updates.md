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
To do, use one of the following configurations depending on your dependency manager:

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

After you've set up your source operation,
you might want to automatically trigger it.
To do so, [set up a cron job](../create-apps/source-operations.md#automated-source-operations-using-a-cron-job).