---
title: "Cron Jobs"
weight: -105
description: |
    Understand how to configure Symfony cron jobs.
---

Cron jobs allow you to run scheduled tasks at specified times or intervals.
To set up a cron job, add a configuration similar to the following:

```yaml {location=".platform.app.yaml"}
crons:
    snapshot:
        spec: 0 5 * * *
        cmd: |
            croncape symfony ...
```

To run a command in a cron hook for specific environment types,
use the `PLATFORM_ENVIRONMENT_TYPE` environment variable:

```yaml {location=".platform.app.yaml"}
crons:
    snapshot:
        spec: 0 5 * * *
        cmd: |
            # only run for the production environment, aka main branch
            if [ "$PLATFORM_ENVIRONMENT_TYPE" = "production" ]; then
                croncape symfony ...
            fi
```

## Use croncape

When using the [Symfony integration](./integration),
you can use `croncape` to get feedback through emails when something goes wrong.

To specify which email address `croncape` must send the feedback emails to,
add a `MAILTO` environment variable.
To do so, run the following command:

```bash
symfony var:create -y --level=project --name=env:MAILTO --value=sysadmin@example.com
```

To ensure better reliability, `croncape` sends the emails using:

- `project-id@cron.noreply.platformsh.site` as the sender address (`project-id+branch@cron.noreply.platformsh.site` for non-main environments)
- the provided [{{< vendor/name >}}SMTP service](./environment-variables#emails), even if you define your own `MAILER_*` environment variables

To use a custom SMTP and/or custom sender address, follow these steps:

1. To specify a sender address, define a [`MAILFROM` environment variable](./environment-variables.md#symfony-environment-variables).

2. Define the mandatory [environment variables to use your own email service](./environment-variables#emails).
   Note that only SMTP connections are supported.

3. To disable the provided SMTP service, run `symfony cloud:env:info enable_smtp false`.
