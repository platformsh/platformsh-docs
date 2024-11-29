---
title: "Sanitizing databases: MariaDB and Drupal"
sidebarTitle: MariaDB and Drupal
description: Sanitize MariaDB data in preview environments directly or by using Drush.
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
for preview environments:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      deploy: |

        # ...

        cd /app/public
        if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ]; then
          # Do whatever you want on the production site.
        else
          drush -y sql:sanitize
        fi
        drush -y updatedb
```

More options are available.
These are described in the [Drush documentation](https://www.drush.org/latest/commands/sql_sanitize/).

To sanitize only on the initial deploy and not all future deploys,
use [Drush state](https://www.drush.org/latest/commands/state_set/) as in the following example:

```yaml {configFile="app"}
applications:
  myapp:
    hooks:
      deploy: |

        # ...

        cd /app/public
        if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ] || [ "$(drush state:get --format=string mymodule.sanitized)" != yes ]; then
          # Do whatever you want on the production site.
        else
          drush -y sql:sanitize
          drush state:set --input-format=string mymodule.sanitized yes
        fi
```

{{< /codetabs >}}

## What's next

{{% sanitize-dbs/whats-next %}}

If your database contains a lot of data, consider using the [`OPTIMIZE TABLE` statement](https://mariadb.com/kb/en/optimize-table/)
to reduce its size and help improve performance.
