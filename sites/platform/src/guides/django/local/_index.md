---
title: Local development
weight: -110
description: |
    Sync {{% vendor/name %}} with your local environments to start contributing.
---

A significant amount of work developing Django takes place locally rather than on an active {{% vendor/name %}} environment.
You want to ensure that the process of local development is as close as possible to a deployed environment.

You can achieve this through various approaches.
Each of these examples:

- Creates a local development environment for a Django site.
- Syncs data from the active {{% vendor/name %}} environment where team review takes place.
- Commits aspects of that local development method to the project so collaborators can replicate configuration to contribute.

If you're already using Docker Compose,
consult the Community guide on [using Docker Compose with Django and {{% vendor/name %}}](https://community.platform.sh/t/using-docker-compose-with-django/1205).
