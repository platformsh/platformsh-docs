---
title: "Deploy Symfony on Platform.sh"
sidebarTitle: "Deploy"
weight: -90
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

## Create a Project in the Cloud

{{< guides/initialize name="Symfony" template="symfony" />}}


## Deploying a Project

To deploy your project to the cloud, run:

```bash
symfony deploy
```

{{% guides/deployment Symfony=true %}}

{{% guides/data-migration Symfony=true /%}}

Go forth and Deploy (even on Friday)!

{{< note >}}
Another method to get locally from your Platform.sh project your existing database and files is by using [Symfony Server](../local-development-symfony-server.md)
{{< /note >}}

### Load Symfony Demo fixtures in the Cloud
Symfony Demo comes with fixtures.
To initialize your Platform.sh project database with fixtures, run the following:
```bash
symfony ssh -- php bin/console doctrine:schema:update --force
symfony ssh -- php bin/console doctrine:fixture:load -e dev
```

{{< note >}}
Note that Doctrine fixture commands are only available in Symfony development environments,
which is why `-e dev` is needed.
{{< /note >}}

{{< guide-buttons next="Configure Symfony application" >}}






