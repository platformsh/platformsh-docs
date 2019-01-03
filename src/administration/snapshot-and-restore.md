# Snapshot and Restore

## Snapshots

Snapshots are triggered directly via the Web Interface or via the CLI. The snapshot creates a complete backup of the environment. It includes all persistent data from all running services (MySQL, SOLR,...) and any files stored on the mounted volumes.

You need to have the "admin" role in order to create a snapshot of an environment.

Snapshots on Platform.sh Professional are retained for at least 7 days. They will be purged between 7 days and 6 months, at Platform.sh's discretion. Please see the [data retention](/security/data-retention.md) page for more information.

> **note**
>
> We advise you to make snapshots of your live environment before merging an environment to the live environment, or each time you increase the storage space of your services.

Using the CLI:

```bash
$ platform snapshot:create
```

Please be aware that triggering a snapshot will cause a momentary pause in site availability so that all requests can complete, allowing the snapshot to be taken against a known consistent state. The total interruption is usually only 15 to 30 seconds and any requests during that time are held temporarily, not dropped.

## Restore

You will see the snapshot in the activity feed of you environment in the Platform.sh Web Interface. You can trigger the restore by clicking on the `restore` link.

From the CLI, you can list existing snapshots with the CLI as follows:

```bash
$ platform snapshots

Finding snapshots for the environment master
+---------------------+------------+----------------------+
| Created             | % Complete | Snapshot name        |
+---------------------+------------+----------------------+
| 2015-06-19 17:11:42 | 100        | 2ca4d90639f706283fee |
| 2015-05-28 15:05:42 | 100        | 1a1fbcb9943849706ee6 |
| 2015-05-21 14:38:40 | 100        | 7dbdcdb16f41f9e1c061 |
| 2015-05-20 15:29:58 | 100        | 4997900d2804d5b2fc39 |
| 2015-05-20 13:31:57 | 100        | c1f2c976263bec03a10e |
| 2015-05-19 14:51:18 | 100        | 71051a8fe6ef78bca0eb |
```

You can restore a specific snapshot with the CLI as follows:

```bash
$ platform snapshot:restore 92c9a4b2aa75422efb3d
```

> **note**
> You need "admin" role to restore your environment from a snapshot.

## Snapshots and downtime

A snapshot does cause a momentary pause in service. We recommend running during non-peak hours for your site.

## Automated snapshots

Snapshots are not triggered automatically on Platform.sh Professional.

Snapshots may be triggered by calling the CLI from an automated system such as Jenkins or another CI service, or by installing the CLI tool into your application container and triggering the snapshot via cron.

### Automated snapshots using Cron

> **note**
>
> Snapshots using cron requires you to [install the CLI in your container and set up an API token](/gettingstarted/cli/api-tokens.md).

We ask that you not schedule a backup task more than once a day to minimize data usage.

Once the CLI is installed and an API token configured you can add a cron task to run once a day and trigger a snapshot. The CLI will read the existing environment variables in the container and default to the project and environment it is running on. In most cases such backups are only useful on the `master` production environment.

A common cron specification for a daily backup on the `master` environment looks like this:

```yaml
crons:
  snapshot:
    spec: "0 5 * * *"
    cmd: |
      if [ "$PLATFORM_BRANCH" = master ]; then
          platform snapshot:create --yes --no-wait
      fi
```

The above cron task will run once a day at 5 am (UTC), and, if the current environment is the master branch, it will run `platform snapshot:create` on the current project and environment. The `--yes` flag will skip any user-interaction. The `--no-wait` flag will cause the command to complete immediately rather than waiting for the snapshot to complete.

> **note**
>
> It is very important to include the `--no-wait` flag. If you do not, the cron process will block and you will be unable to deploy new versions of the site until the snapshot creation process is complete.

### Retention

Please see our [Data Retention Page](/security/data-retention.md).
