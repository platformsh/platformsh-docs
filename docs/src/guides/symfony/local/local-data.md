---
title: ""
sidebarTitle: "Symfony Server with local data"
weight: -80
description: |
    Import Platform.sh data within your local Symfony application to start contributing.
sectionBefore: Supported environments
---

A significant amount of work developing Symfony takes place locally rather than on an active Platform.sh environment.
You want to ensure that the process of local development is as close as possible to a deployed environment.

You can achieve this through various approaches.

To test changes locally, you can pull data from an active Platform.sh environment.

{{% guides/local-requirements name="Symfony" %}}
- your Platform.sh project is not using SQLite (default database engine if you're using 'a fresh Symfony Demo skeleton),
  otherwise, follow the [Use PostgreSQL tutorial](../customize/postgresql.md)

## get your Symfony application

TODO
- symfony get <projectID>
- follow getting start guide
- get existing Symfony application (git clone) + `symfony cloud:init`

## Start your Symfony Server
At first, you need to start your web Server locally to display your Symfony application.

```bash
symfony server:start -d
symfony open:local
```

It will start the Symfony server and open the application in your local browser.

## Dump your Platform.sh project's database

Dump your Platform.sh project's database into a local file by running

```bash
symfony cloud:db:dump -f dump.sql
```

## Import dump file locally
```bash
symfony console doctrine:query:sql < dump.sql
```

## Import assets
```bash
symfony cloud:mount:download --mount public/var --target ./public/var
```

Et voilà, your Symfony application data are sync with your Platform.sh project

{{< note >}}
Another method to get locally your existing Platform.sh project's database and assets is by using [Symfony Server](../local)
{{< /note >}}
