---
title: Cron and scheduled tasks
weight: 12
sidebarTitle: Cron jobs
---

Cron jobs allow you to run scheduled tasks at specified times or intervals.
The `crons` section of `.platform.app.yaml` describes these tasks and the schedule when they're triggered.
Each item in the list is a unique name identifying a separate cron job.
Crons are started right after the build phase.

It has the following keys:

* `spec`: The [CRON specification](https://en.wikipedia.org/wiki/Cron#CRON_expression).
  For example, `*/19 * * * *` to run every 19 minutes.
* `cmd`: The command that's executed, for example `cd public ; drush core-cron`.

## Timing

On Platform.sh Professional projects, cron runs can't be triggered more frequently than every 5 minutes.
If specified for a more frequent time, they're still triggered every 5 minutes.
On Enterprise and Elite plans, crons can be triggered as frequently as every 1 minute.

To minimize cron tasks running simultaneously, a random offset is applied to all cron runs.
The offset is a random number of seconds up to 5 minutes or the cron frequency, whichever is smaller.
The cron task still runs at the frequency specified, but may be offset.
For example, a cron job set to run every 9 minutes may run at 9, 18, 27, ... minutes past the hour
or up to 14, 23, 32, ... minutes past the hour.
A nightly cron task for 3:00 AM may run anywhere from 3:00 AM to 3:05 AM.

A single application container may have any number of cron tasks configured, but only one can run at a time.
So if a cron task is triggered while another cron task is still running,
the new tasks is paused and continued once the first has completed.
To minimize simultaneous triggers, set crons to run at prime number intervals.

If you need to run a cron task in a specific timezone other than UTC,
[configure that timezone](/configuration/app/timezone.md) explicitly.

## Paused crons

Development environments are often used for a limited time and then abandoned.
While it's useful for environments under active development to have scheduled tasks,
unused environments don't need to run cron jobs.
To minimize unnecessary resource use,
crons are paused on Development environments with no deployments for 2 weeks.

Development environments with deployments within the past 2 weeks have crons with the status `running`.
You can see this in the management console
and using the CLI by running `platform environment:info` and looking under `deployment_state`.
If there haven't been any deployments in 14 days, the status is `paused`.

### Restarting paused crons

If the crons on your development environment are paused but you're still using them,
you can push changes to the environment or redeploy it.

To restart crons without changing anything:

{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

1. In the console, go to the correct project.
1. Open the environment where you'd like the crons to run.
1. Click `Redeploy` next to the cron status of `Paused`.

<--->

---
title=Using the CLI
file=none
highlight=false
---

Run the following command (replacing `<PROJECT_ID>` and `<BRANCH_ID>` with the correct values):

```bash
platform repdeploy -p <PROJECT_ID> -e <BRANCH_ID>
```

{{< /codetabs >}}

## Shell

Cron runs are executed using the dash shell, not the bash shell used by normal SSH logins.
In most cases that makes no difference but may impact some more involved cron scripts.

## Cron and workers

If your application has both a `web` instance and a [`worker` instance](/configuration/app/workers.md),
cron tasks are run only on the `web` instance.

## Logging

Cron log output is captured in the at `/var/log/cron.log`.
See the [Log page](/development/logs.md) for more information on logging.

## Example cron jobs

The following example works for a Drupal site.
It runs Drupal's normal cron hook every 19 minutes, using Drush.
It also sets up a second cron task to run Drupal's queue runner on the aggregator_feeds queue every 7 minutes.

```yaml
crons:
    # Run Drupal's cron tasks every 19 minutes.
    drupal:
        spec: '*/19 * * * *'
        cmd: 'cd web ; drush core-cron'
    # But also run pending queue tasks every 7 minutes.
    # Use an odd number to avoid running at the same time as the `drupal` cron.
    drush-queue:
        spec: '*/7 * * * *'
        cmd: 'cd web ; drush queue-run aggregator_feeds'
```
