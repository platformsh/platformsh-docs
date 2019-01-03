# Cron jobs

Cron jobs allow you to run scheduled tasks at specified times or intervals. The `crons` section of `.platform.app.yaml` describes these tasks and the schedule when they are triggered. Each item in the list is a unique name identifying a separate cron job. Crons are started right after build phase.

It has a few subkeys listed below:

- **spec**: The [cron specification](https://en.wikipedia.org/wiki/Cron#CRON_expression). For example: `*/20 * * * *` to run every 20 minutes.
- **cmd**: The command that is executed, for example `cd public ; drush core-cron`

The minimum interval between cron runs is 5 minutes, even if specified as less. Additionally, a variable delay is added to each cron job in each project in order to prevent host overloading should every project try to run their nightly tasks at the same time. Your crons will _not_ run exactly at the time that you specify, but will be delayed by 0-300 seconds.

A single application container may have any number of cron tasks configured, but only one may be running at a time. That is, if a cron task fires while another cron task is still running it will pause and then continue normally once the first has completed.

Cron runs are executed using the dash shell, not the bash shell used by normal SSH logins. In most cases that makes no difference but may impact some more involved cron scripts.

If an application defines both a `web` instance and a `worker` instance, cron tasks will be run only on the `web` instance.

## How do I setup Cron for a typical Drupal site?

The following example runs Drupal's normal cron hook every 20 minutes, using Drush. It also sets up a second cron task to run Drupal's queue runner on the aggregator_feeds queue every 5 minutes.

```yaml
crons:
  # Run Drupal's cron tasks every 20 minutes.
  drupal:
    spec: "*/20 * * * *"
    cmd: "cd web ; drush core-cron"
  # But also run pending queue tasks every 7 minutes.
  # Use an odd number to avoid running at the same time as the `drupal` cron.
  drush-queue:
    spec: "*/7 * * * *"
    cmd: "cd web ; drush queue-run aggregator_feeds"
```
