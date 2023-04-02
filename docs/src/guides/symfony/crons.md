---
title: "Cron Jobs"
sidebarTitle: "Cron Jobs"
weight: -105
description: |
    Understand how to configure Symfony cron jobs.
---

**Cron jobs** allow you to run scheduled tasks at specified times or intervals:

```yaml {location=".platform.app.yaml"}
crons:
    snapshot:
        spec: 0 5 * * *
        cmd: |
            croncape symfony ...
```

If you want to run a command in a cron hook for specific environment types,
check the `PLATFORM_ENVIRONMENT_TYPE` environment variable:

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

## Using croncape

To get feedback when something goes wrong, prefix the command with `croncape`
(which is available when using the [Symfony integration](./integration)).
`croncape` will send an email to the address defined by the `MAILTO`
environment variable. Don't forget to set it first via the following command:

```bash
symfony var:create -y --level=project --name=env:MAILTO --value=sysadmin@example.com
```

To ensure better reliability, `croncape` sends its emails using
`project-id@cron.noreply.platformsh.site` as the sender address
(`project-id+branch@cron.noreply.platformsh.site` for non-main environments)
and the provided :ref:`Platform.sh SMTP <email-env-vars>` service; even if you
define your own `MAILER_*` environment variables.

If you wish to use a custom SMTP and/or use a custom sender address you need to follow these steps:

1. Define the sender address by defining the `MAILFROM` environment variable;
2. Define the environment variables required to use your own email service, refers to the [emails](./environment-variables#emails) documentation to check their names.
   Please note that only SMTP connections are supported;
3. Disable the provided SMTP service using `symfony cloud:env:info enable_smtp false`
