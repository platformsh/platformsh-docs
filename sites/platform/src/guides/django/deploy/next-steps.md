---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    With Django deployed, set up your local development environment, compliance requirements, and more.
---

## Local development

Once Django has been deployed on {{% vendor/name %}}, you need to set up a local development environment to begin making revisions.
For more information, consult the [Django local development guides](../local/_index.md).

## Package management

pip comes pre-installed on all Python containers.
You can also use Pipenv and Poetry to manage dependencies,
but there are a caveats to keep in mind when using those tools.

For more information, see how to [manage Python dependencies](../../../languages/python/dependencies.md).

## Web servers

The examples in this guide primarily use Gunicorn as a web server for Django apps.
Other servers such as Daphne and Uvicorn are equally supported.

See how to configure [Python web servers](../../../languages/python/server.md).

## Sanitize data

By default, each preview environment automatically inherits all data from its parent environment.
So a developer working on a small feature has access to production data,
including personally identifiable information (PII).
This workflow isn't always desirable or even acceptable based on your compliance requirements.

For how to enforce compliance requirements for user data across environments,
see how to [sanitize databases](../../../development/sanitize-db/_index.md).

{{< guide-buttons type="last" >}}
