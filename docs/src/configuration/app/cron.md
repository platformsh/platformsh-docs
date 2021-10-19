---
title: "Cron jobs"
weight: 12
sidebarTitle: "Cron and scheduled tasks"
---

## Configuration

Cron jobs allow you to run scheduled tasks at specified times or intervals. The `crons` section of `.platform.app.yaml` describes these tasks and the schedule when they are triggered.  Each item in the list is a unique name identifying a separate cron job. Crons are started right after build phase.

It has a few subkeys listed below:

* `spec`: The [cron specification](https://en.wikipedia.org/wiki/Cron#CRON_expression). For example: `*/19 * * * *` to run every 19 minutes.
* `commands`: A set of lifecycle commands to execute.

On Platform.sh Professional projects, cron runs may not trigger more frequently than every five (5) minutes.  If specified for a more frequent time, they will still trigger every 5 minutes.  On Enterprise and Elite plans crons may trigger as often as every one minute.

Additionally, a random offset is applied to all cron runs in order to minimize cron tasks running simultaneously.  The offset is a random number of seconds up to 5 minutes or the cron frequency, whichever is smaller.  The cron task will still run at the frequency specified, but may be offset.  For example, a cron job set to run every 9 minutes may run at 9, 18, 27, etc. minutes past the hour or up to 14, 23, 32, etc. minutes past the hour.  A nightly cron task for 3:00 am may run anywhere from 3:00 am to 3:05 am.

A single application container may have any number of cron tasks configured, but only one may be running at a time.  That is, if a cron task fires while another cron task is still running it will pause and then continue normally once the first has completed.  In general, it is a good idea to set crons to run on prime number minutes so that they fire simultaneously as rarely as possible.

Cron runs are executed using the dash shell, not the bash shell used by normal SSH logins. In most cases that makes no difference but may impact some more involved cron scripts.

If an application defines both a `web` instance and a `worker` instance, cron tasks will be run only on the `web` instance.

If running the cron task in a specific timezone that is different than UTC is required, you will need to [configure that timezone](/configuration/app/timezone.md) explicitly.

{{< note >}}
Cron log output is captured in the at `/var/log/cron.log`.  See the [Log page](/development/logs.md) for more information on logging.
{{< /note >}}

### Commands

There are two cron-related commands you can specify, one required and one optional.

```yaml
crons:
    mycommand:
        spec: '*/17 * * * *'
        commands:
            start: <command here>
            stop: <command here>
            shutdown_timeout: 10
```

| Command            | Required? | Type    | Description |
| ------------------ | --------- | ------- | ----------- |
| `start`            | Yes       | string  | The cron command that should execute according to the specified schedule. It is often all you need. |
| `stop`             | No        | string  |The command that is issued to give the cron command a chance to shutdown gracefully, such as to finish an active item in a list of tasks. Issued when a cron task is interrupted by a user through the CLI or management console. If not specified, a `SIGTERM` signal is sent to the process. |
| `shutdown_timeout` | No        | integer | The number of seconds after which a `SIGKILL` signal is sent to the process to force terminate it. The default is 10 seconds. |

If the cron activity is in a `pending` or `in_progress` state, it can then be cancelled through the CLI using the `platform activity:cancel ACTIVITY_ID` command. In the management console, you can also select the **Stop run** option in the dropdown for that environment's running activity. 

A legacy syntax uses `cmd` and specifies only a start command, resulting in the default `shutdown_timeout` and `stop` command behavior described above. That is, the following two declarations are equivalent:

```yaml
# Current recommended syntax
crons:
    sendemails:
        spec: '*/7 * * * *'
        commands:
            start: cd public && send-pending-emails.sh
            shutdown_timeout: 10

# Legacy syntax
crons:
    sendemails:
        spec: '*/7 * * * *'
        cmd: cd public && send-pending-emails.sh
```

The first version, with `commands`, is preferred.

### How do I setup Cron for a typical Drupal site?

The following example runs Drupal's normal cron hook every 19 minutes, using Drush.  It also sets up a second cron task to run Drupal's queue runner on the aggregator_feeds queue every 7 minutes.

```yaml
crons:
    # Run Drupal's cron tasks every 19 minutes.
    drupal:
        spec: '*/19 * * * *'
        commands:
            start: 'cd web ; drush core-cron'
    # But also run pending queue tasks every 7 minutes.
    # Use an odd number to avoid running at the same time as the `drupal` cron.
    drush-queue:
        spec: '*/7 * * * *'
        commands:
            start: 'cd web ; drush queue-run aggregator_feeds'
```
