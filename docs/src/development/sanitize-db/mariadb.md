---
title: "Sanitizing databases: MariaDB and Drupal"
sidebarTitle: MariaDB and Drupal
description: Sanitize MariaDB data in non-production environments directly or by using Drush.
layout: list
---

{{% sanitize-dbs/intro database="MySQL" framework="Drupal" %}}

{{% sanitize-dbs/requirements database="MySQL" framework="Drupal" %}}

{{% sanitize-dbs/sanitize-intro database="MySQL" %}}

{{< codetabs >}}
+++
title=Manually
+++
{{% sanitize-dbs/sanitize-manually database="MySQL" %}}
<--->
+++
title=With Drupal and Drush
+++

To sanitize your database and get rid of sensitive, live information, use the `drush sql:sanitize` command.
Add your script to sanitize the database to [a `deploy` hook](../../create-apps/hooks/hooks-comparison.md#deploy-hook)
for non-production environments:

```yaml
deploy: |
    cd /app/public
    if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
        # Do whatever you want on the production site.
    else
        drush -y sql:sanitize
    fi
    drush -y updatedb
```

More options are available.
These are described in [Drush's documentation](https://www.drush.org/latest/commands/sql_sanitize/).

{{< /codetabs >}}

## What's next

{{% sanitize-dbs/whats-next %}}

If your database contains a lot of data, consider using the [`OPTIMIZE TABLE` statement](https://mariadb.com/kb/en/optimize-table/)
to reduce its size and help improve performance.
