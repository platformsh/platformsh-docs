---
title: ""
sidebarTitle: "Symfony Server with local data"
weight: -80
description: |
    Import Platform.sh data within your local Symfony application to start contributing.
---

{{% guides/symfony/local-development-intro %}}

To do so, when testing changes locally, you can pull data from an active Platform.sh environment.

{{% guides/local-requirements name="Symfony" %}}
- A Platform.sh project using PostgreSQL.
  See how to switch to, or [set up PostgreSQL](../services/postgresql.md) from scratch.

## 1. Start your Symfony Server

To start your Symfony Server locally and display your Symfony app,
run the following command:

```bash
symfony server:start -d
symfony open:local
```

This starts the Symfony Server and opens the app in your local browser.

## 2. Dump your Platform.sh project database

To dump your Platform.sh project database into a local file,
run the following command:

```bash
symfony cloud:db:dump -f dump.sql
```

## 3. Import the dump file locally

To import the dump file locally, run the following command:

```bash
symfony console doctrine:query:sql < dump.sql
```

## 4. Import assets

To import assets, run the following commands:

```bash
symfony cloud:mount:download --mount public/var --target ./public/var
```

Your local Symfony app is now synced with your Platform.sh project.

{{% guides/symfony/local-next-steps-start %}}
{{< readFile file="snippets/guides/symfony/local.sh" highlight="yaml" location="init-local.sh" >}}
{{% guides/symfony/local-next-steps-end %}}
