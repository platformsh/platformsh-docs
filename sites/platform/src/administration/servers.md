---
title: Server upgrades
description: Information about how {{% vendor/name %}} updates servers
weight: 10
---

To ensure your projects get the latest features, improvements, and bug fixes, {{% vendor/name %}} updates the servers that deliver services. You can view these events in the [activity logs](/increase-observability/logs/access-logs.md#activity-logs) of any project or environment.

No action is needed on your part, and no downtime occurs for your projects. 

## Affected servers

### Project API server

The project API server responds to API calls to make the CLI and Console work for your project.
It acts as the Git server, mirroring the source repository in the case of [source integrations](/integrations/source/_index.md).

It stores your app code and project configuration, provides API interfaces,
and orchestrates the build and deploy process and other tasks for your environments.

### Project metrics server

The project metrics server retrieves information about your environments' use of RAM, CPU, and disk.
You can view this information as part of [environment metrics](/increase-observability/metrics/_index.md).
