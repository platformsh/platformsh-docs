---
title: "Upgrade to a maintained version of a runtime or service"
sidebarTitle: "Upgrade runtimes and services"
description: "Upgrade a runtime or service to a maintained version to avoid build failures and stay protected against known CVEs."
keywords:
  - runtime migration
  - service migration
  - version upgrade
  - end of life
  - deprecated runtime
  - deprecated service
  - sunset
  - decommissioned
  - retired version
  - image status
  - supported version
---

Use a maintained runtime or service image.
Outdated images can fail to build and may carry known CVEs.
See [Image statuses](#image-statuses) to check your image's status and what to do next.

Once you know you need to upgrade, the steps are the same regardless of which runtime or service you use.
For version-specific details, see the docs page for your runtime in [Languages](/languages/_index.md)
or your service in [Add services](/add-services/_index.md).

## Image statuses

"Maintained" means **Active** or **Supported**, depending on the classification below.

{{< note >}}

Some runtimes and services (for example, [Redis](/add-services/redis.md) Grid) use the **Active/Sunset/Decommissioned** classification below.

Others currently use the **Supported/Deprecated/Retired** classification, until they migrate to **Active/Sunset/Decommissioned**.

{{< /note >}}

{{< codetabs >}}

+++
title=Active/Sunset/Decommissioned
+++

The Console shows an image's status as a banner on your project's Overview page, or as a decoration on the relevant activity in the **Activity** panel. Active images show no decoration, since they're always supported.

An image using this classification moves through the following statuses over its lifecycle:

| Status | What it means | What to do |
| --- | --- | --- |
| Active | Fully maintained. {{% vendor/name %}} applies software and security updates received from upstream. | No action needed. |
| Sunset | Existing projects, including code pushes, keep working. New projects can't use this image. {{% vendor/name %}} applies only critical security updates from upstream, and the image is decommissioned 180 calendar days after entering Sunset. | Upgrade to an active version before the decommission date. |
| Decommissioned | {{% vendor/name %}} no longer supports this image. Existing projects with a decommissioned image continue to run as is, but all code pushes are blocked. | Upgrade to an active version to continue deploying. |

<--->

+++
title=Supported/Deprecated/Retired
+++

Each runtime or service page using this classification lists its versions under one of the following statuses:

| Status | What it means | What to do |
| --- | --- | --- |
| Supported | Fully maintained. {{% vendor/name %}} applies software and security updates received from upstream. | No action needed. |
| [Deprecated](/glossary.md#deprecated-versions) | Still available and functional, but at end of life and no longer receiving security updates from upstream. It may stop working at some point. | Switch to a supported version to keep receiving security updates. |
| Retired | No longer available from upstream and not receiving further updates. This reflects the upstream project's own status only — {{% vendor/name %}} doesn't enforce it, so the image keeps working with no scheduled decommission date. | Upgrade to a supported version, since no further security updates are available. |
| Decommissioned* | No longer supported by upstream. This reflects the upstream project's own status only — {{% vendor/name %}} doesn't enforce it, so builds and deployments aren't blocked. | Upgrade to a supported version as soon as possible. |

\* At this time, decommissioned images under this classification aren't listed in the product docs.

{{< /codetabs >}}

## Before you upgrade

Test any version change on a non-production [environment](/environments/_index.md) before merging.

## Upgrade a runtime

The `type` key on your application in `{{< vendor/configfile "app" >}}` defines the runtime.
Updating to a new version means changing that value and pushing it.

1. Check the supported versions on the runtime page under [Languages](/languages/_index.md), then update the `type` key with the correct version number:

   ```yaml {configFile="app"}
   applications:
     myapp:
       type: 'php:{{% latest "php" %}}'
   ```

2. Push to a non-production branch. If you don't already have one, create it first:

   ```bash
   {{% vendor/cli %}} branch upgrade-runtime
   git add {{< vendor/configfile "app" >}}
   git commit -m "Update runtime version"
   {{% vendor/cli %}} push
   ```

   Pushing triggers {{% vendor/name %}} to automatically build and deploy the environment.

3. Verify that your app builds and behaves correctly. Check the deploy log for errors:

   ```bash
   {{% vendor/cli %}} activity:log
   ```

   Then open the environment and test your app manually:

   ```bash
   {{% vendor/cli %}} environment:url --primary
   ```

4. Merge to production:

   ```bash
   {{% vendor/cli %}} merge
   ```

   If your project uses a [source integration](/integrations/source/_index.md) (GitHub, GitLab, Bitbucket),
   merge through a pull request or merge request in your Git provider instead.


## Upgrade a service

Services are defined under the `services` key in `{{< vendor/configfile "services" >}}`.
Updating the `type` value triggers a version change on the next deploy.
Whether data migrates automatically depends on the service.
Check the supported versions on your service's page under [Add services](/add-services/_index.md) before you begin.

### In-place upgrade

Some services upgrade automatically when you change the version.
PostgreSQL 10 and later, for example, include a built-in upgrade utility that runs at deploy time.

1. Update the `type` key for your service:

   ```yaml {configFile="services"}
   services:
     database:
       type: postgresql:{{% latest "postgresql" %}}
   ```

2. Push to a non-production branch. If you don't already have one, create it first:

   ```bash
   {{% vendor/cli %}} branch upgrade-service
   git add {{< vendor/configfile "services" >}}
   git commit -m "Update service version"
   {{% vendor/cli %}} push
   ```

   Pushing triggers {{% vendor/name %}} to automatically build and deploy the environment.

3. Confirm the service starts and your app connects. Check the deploy log for errors:

   ```bash
   {{% vendor/cli %}} activity:log
   ```

   Then open the environment and test your app manually:

   ```bash
   {{% vendor/cli %}} environment:url --primary
   ```

4. [Create a backup](/environments/backup.md), then merge to production:

   ```bash
   {{% vendor/cli %}} backup:create --environment main
   {{% vendor/cli %}} merge
   ```

   If your project uses a [source integration](/integrations/source/_index.md) (GitHub, GitLab, Bitbucket),
   merge through a pull request or merge request in your Git provider instead.

Downgrading isn't supported after an in-place upgrade. If you need to roll back, [restore from a backup](/environments/restore.md).

### Manual data migration

When a service doesn't support in-place upgrades, or when you're moving across several major versions,
export your data, provision a new service at the target version, and import the data.

1. [Export your data](/learn/tutorials/exporting.md) from the current service.

2. Rename the service in `{{< vendor/configfile "services" >}}` and set the target version.
   Renaming forces {{% vendor/name %}} to create a fresh service container.

   ```yaml {configFile="services"}
   services:
     database-target:
       type: postgresql:{{% latest "postgresql" %}}
   ```

3. Update the `relationships` of any application that references the old service name:

   ```yaml {configFile="app"}
   applications:
     myapp:
       relationships:
         database:
           service: database-target
           endpoint: postgresql
   ```

4. Push to a non-production branch and import your data into the new service.

5. Verify your app works correctly, then merge to production.
