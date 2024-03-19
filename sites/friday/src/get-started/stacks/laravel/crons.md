---
title: "Cron Jobs"
weight: -105
description: |
    Understand how to configure Symfony cron jobs.
---

Cron jobs allow you to run scheduled tasks at specified times or intervals.
To set up a cron job, add a configuration similar to the following:

```yaml {configFile="app"}
crons:
    snapshot:
        spec: 0 5 * * *
        cmd: |
            croncape symfony ...
```

To run a command in a cron hook for specific environment types,
use the `PLATFORM_ENVIRONMENT_TYPE` environment variable:

```yaml {configFile="app"}
crons:
    snapshot:
        spec: 0 5 * * *
        cmd: |
            # only run for the production environment, aka main branch
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
                croncape symfony ...
            fi
```
