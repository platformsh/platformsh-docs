---
title: Server upgrades
description: Information about how {{% vendor/name %}} upgrades servers
weight: 10
---

To ensure your projects get the latest features, improvements, and bug fixes, {{% vendor/name %}} updates the servers that deliver services. 

No action is needed on your part, and no downtime occurs for your projects.

These upgrades are scheduled ahead of time, and you can reschedule one to another weekday if needed.
This is separate from your project's [maintenance window](/learn/overview/build-deploy.md#maintenance-window),
which controls patch updates to your services' container images rather than these servers.

To view these server upgrade events, go to the [activity logs](../increase-observability/logs/access-logs.md#activity-logs) for any project or environment and then select **Upgrade** from the **Filter** list.

## Affected servers

### Project API server

The project API server responds to API calls to make the CLI and Console work for your project.
It acts as the Git server, mirroring the source repository in the case of [source integrations](/integrations/source/_index.md).

It stores your app code and project configuration, provides API interfaces,
and orchestrates the build and deploy process and other tasks for your environments.

### Project metrics server

The project metrics server retrieves information about your environments' use of RAM, CPU, and disk.
You can view this information as part of [environment metrics](/increase-observability/metrics/_index.md).
