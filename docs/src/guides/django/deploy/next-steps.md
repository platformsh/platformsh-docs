---
title: "Additional resources"
sidebarTitle: "Next steps"
weight: -70
description: |
    With Django deployed, set up your local development environment, compliance requirements, and more.
---

## Local development

Once Django has been deployed on Platform.sh, you'll need to set up a local development environment to beging making revisions.
Below are a few of the available guides to get you and the rest of your team started:

- [DDEV](/guides/django/local#ddev)
- [Docker Compose](/guides/django/local#docker-compose)
- [Tethered local](/guides/django/local#tethered-local)

## Package management

pip comes pre-installed in all Python containers on Platform.sh.
You are also free to use Pipenv and Poetry to manage dependencies locally and on project environments, but there are a few set of caveats to keep in mind when using those tools.

Consult the [managing Python dependencies](/languages/python/dependencies) documentation for more information.

## Web servers

The examples in this guide primarily use Gunicorn as a webserver for Django apps, but additional servers like Daphne, Uvicorn, and more are equally supported. 

Consult the [Python web servers](/languages/python/server) documentation for more information about how to configure them. 

## PII & sanitizing data

Each development environment on Platform.sh automatically inherits all data from their parent environments by default.
As a consequence, a developer working on a small feature will have access to production data - including PII - in that environment. 

This workflow is not always desireable, or even acceptable based on your compliance requirements.

Consult the [sanitizing databases](/development/sanitize-db) documentation for more information about how to enforce compliance requirements for user data across environments.

/development/sanitize-db

{{< guide-buttons type="last" >}}
