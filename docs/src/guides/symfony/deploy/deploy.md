---
title: "Deploy Symfony on Platform.sh"
sidebarTitle: "Deploy"
weight: -80
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

{{% guides/symfony/deployment %}}

{{% guides/symfony/data-migration /%}}

Go forth and Deploy (even on Friday)!

{{< note >}}
Another method to get locally from your Platform.sh project your existing database and files is by using [DDEV](../local/ddev.md)
{{< /note >}}

### Load Symfony Demo fixtures
Symfony Demo comes with fixtures.
To initialize your Platform.sh project database with fixtures, run the following:
```bash
symfony ssh -- php bin/console doctrine:schema:update --force
symfony ssh -- php bin/console doctrine:fixture:load -e dev
```

{{< note >}}
Note that Doctrine fixture commands are only available in Symfony dev environment, explaining why option `-e dev` is needed
{{< /note >}}

{{< guide-buttons next="More resources" >}}
