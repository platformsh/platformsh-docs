---
title: "2021 Changelog"
sidebarTitle: "2021"
description: |
  Look here for all the most recent additions to Platform.sh.
---

## October
  * Regions: Added a [second region in Australia](/development/public-ips.md#australia-2-au-2platformsh), `au-2`.
---
## September
  * Organizations: Switched to [organizations](/administration/organizations.md) for managing Platform.sh projects, users, and billing.
  * Vault: Added [Vault service](/configuration/services/vault.md).
  * .Net: We now support [.Net 5.0](/languages/dotnet.md).
---
## May
  * Elasticsearch 6.8: We now support [Elasticsearch 6.8](/configuration/services/elasticsearch.md).
---
## April
  * WAF: [a new page was added](/security/waf.md) describing the filtering rule sets and protections that come with the Platform.sh WAF.
  * [Build environment variables](/development/variables.md#project-variables): environment variables can now accept the same `--visible-build` and `--visible-runtime` flags as project variables when created through the CLI. Build-visible variables are now a part of the build image ID, and therefore triggers a rebuild of the application when the value is updated. 
  * **Breaking change**: The logic by which the build image ID has changed in order to support build environment variables above. Previously, every attribute in `.platform.app.yaml` was included in the build image, used to create the unique build ID, and *accessible* via the `PLATFORM_APPLICATION` environment variable at build time. This is no longer the case, and only a subset of `.platform.app.yaml` attributes are now accessible from `PLATFORM_APPLICATION` at build time. See the [Platform.sh-provided variables](/development/variables.md#variables-available-during-builds-and-at-runtime) section for more information.
---
## March
  * Observability: [a new page was added](/dedicated/architecture/metrics.md) describing observability and metrics available on Dedicated projects.
  * Node.js debugging: [a new page was added](/languages/nodejs/debug.md) that includes tips for debugging Node.js applications.
  * Parallel activities: [project activities](/integrations/activity/reference.md#maximum-activities-and-parallelism) have been split into separate queues, allowing for up to two activities across environments to occur simultaneously.
  * Python 3.9: We now support [Python 3.9](/languages/python.md).
  * Java 14: We now support [Java 14](/languages/java/_index.md).
  * PostgreSQL 13: [multiple databases](/configuration/services/postgresql.md#multiple-databases) are now supported for PostgreSQL 13.
  * Elasticsearch 7.9: We now support [Elasticsearch 7.9](/configuration/services/elasticsearch.md).
---
## February
  * Elasticsearch 5.6: We now support [Elasticsearch 5.6](/configuration/services/elasticsearch.md) on Dedicated projects.
---
## January
  * Default branch: [guide added](/guides/general/default-branch.md) that provides step for changing a project's default branch from `master` to `main`
---
