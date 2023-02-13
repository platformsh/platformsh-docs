---
title: Local development
weight: -110
description: |
    Sync Platform.sh with your local environments to start contributing.
---

A significant amount of work developing Django takes place locally rather than on an active Platform.sh environment.
You want to ensure that the process of local development is as close as possible to a deployed environment.

There are various approaches to achieve this.
Each of these examples:

- Creates a local development environment for a Django site.
- Syncs data from the active Platform.sh environment where team review takes place.
- Commits aspects of that local development method to the project so collaborators can replicate configuration to contribute.

If already using Docker Compose with Django, consult the [Community guide](https://community.platform.sh/t/using-docker-compose-with-django/1205) for more information about syncing those environments with Platform.sh projects.
