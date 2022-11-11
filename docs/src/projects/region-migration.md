---
title: Change a project's region
sidebarTitle: Change regions
description: See how to change the region your project is in and why you might want to do so.
aliases:
  - /guides/general/region-migration.html
---

To host your project data, Platform.sh offers several [regions](../development/regions.md).
You specify a region when you create a project.

You can also change the project's region after it's created.

## Why migrate between regions

- Different data centers are located in different geographic areas.
  You may want your site close to your users for improved performance.
- You may want to move to a region with a lower [environmental impact](../development/regions.md#environmental-impact).
- Some regions are running older versions of the Platform.sh orchestration system that offers fewer features.
  In particular, the `us` and `eu` regions don't currently offer the following features:

  - [Timeouts in build hooks](../create-apps/hooks/hooks-comparison.md#timeout)
  - [Outbound firewalls](../create-apps/app-reference.md#firewall)
  - [Network Storage service](../add-services/network-storage.md)
  - [Deploy hook activity logs and SSH during deploy hooks](../create-apps/hooks/hooks-comparison.md#deploy-hook)
  - [Cron activity logs](../increase-observability/logs/access-logs.md)
  - [Live backups](../environments/backup.md#live-backups)
  - [Infrastructure metrics](../increase-observability/metrics/_index.md)
  - [Paused crons](../create-apps/app-reference.md#paused-crons)
  - [Static content during deployments](https://platform.sh/blog/2022/upcoming-improvements-deployment-caching-crons)

  These regions are updated in the future.
  If you are on one of those regions and desire these features now,
  migrate to one of the newer regions.

## 1. Plan the migration

Before starting the migration process, you need to plan for it:

- Plan a time frame in which to handle the migration.
  Your code shouldn't change during this time to ensure all changes are copied to the new project.
  Prepare for a brief site outage when you migrate, just as with a relaunch of a site.
- Set your DNS Time-to-Live as low as possible.
  This ensures the switch to the new site propagates as quickly as possible.

## 2. Create a new project

In the target region, [create a new project from scratch]({{% create-project-link scratch=true %}}).

If you plan to test for long, start with a Development plan and upsize it before switching the DNS.
Otherwise, use the desired plan size from the start.

## 3. Add code and environments

{{< codetabs >}}

---
title=Without a source integration
file=none
highlight=false
---

1. Clone your existing project with Git.
2. In the new clone, add a remote for the project:

   ```bash
   platform project:set-remote
   ```

   Select your newly created blank project.

3. Push the code for your production branch:

   ```bash
   platform push --target <PRODUCTION_BRANCH_NAME>
   ```

4. (Optional) Checkout other branches and then push their code:

   ```bash
   platform push --activate --target <BRANCH_NAME> --parent <PRODUCTION_BRANCH_NAME>
   ```

<--->

---
title=With a source integration
file=none
highlight=false
---

For a [source integration](../integrations/source/_index.md) with GitHub, BitBucket, or GitLab,
add the integration to your new project.
Your new project then mirrors the configured repository automatically.

{{< /codetabs >}}

## 4. Copy files

If you have files in a mount, first download them:

```bash
platform mount:download
```

Then upload them to your new project:

```bash
platform mount:upload
```

See more options on [how to export files](../tutorials/exporting.md#downloading-files)
and [how to import files](../tutorials/migrating.md#6-import-files).

## 5. Copy data from services

For services with generated data such as Solr and Redis, you don't need to copy data directly.
Just rebuild the data in the new project.

To download data from persistent services such as databases,
see how to export and then import data for each service:

- [InfluxDB](../add-services/influxdb.md#exporting-data)
- [MongoDB](../add-services/mongodb.md#exporting-data)
- [MariaDB/MySQL](../add-services/mysql/_index.md#exporting-data)
- [PostgreSQL](../add-services/postgresql.md#exporting-data)

## 6. Migrate variables and project settings

Make sure anything else connected to your old project is moved to your new project:

- If you have project or environment variables defined on your old project, add them to your new project.
  Get a list of all variables set outside of code by running `platform variables`.
- Add any users to your new project that you want to continue to have access.
- Add any existing [integrations](../integrations/_index.md).

## 7. Test the site

Verify that the new site is working as desired before continuing.
You can leave the two projects running for as long as you need.
After you have finished all your testing, sync all your data (code, files, database) for the last time.

## 8. Switch to the new site

Now that you know the new project works, switch public traffic to that site:

1. Make sure your new project has the right plan size.
2. If possible, put your site into read-only mode or maintenance mode.
3. Add your domain names to your new project and remove them from the old project.
4. (Optional) Add any custom SSL certificates you have.
5. Update your DNS provider's records to point to the new site. See more on [setting custom domains](../domains/steps/_index.md).

It may take some time for the DNS change and SSL change to propagate.
Until it does, some browsers may not see the new site or may get an SSL mismatch error.
In most cases that resolves itself in 1--3 hours.

## 9. Remove the old project

Once the new project is running and the DNS has fully propagated, delete the old project.

## Alternative process

Although not directly supported by Platform.sh,
an agency named [Contextual Code](https://www.contextualcode.com/) has built a bash migration script.
This script automates most common configurations.
If your site is a typical single app with a single SQL database,
the script should take care of most of the process for you.

See more at the [Platform.sh Project Migration repository](https://gitlab.com/contextualcode/platformsh-migration).
