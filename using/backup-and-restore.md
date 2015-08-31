# Backup and Restore

## Backup

### Manual backup

Backups are triggered directly via the Web Interface or via the CLI. The backup
creates a complete snapshot of the environment. It includes all
persistent data from all running services (MySQL, SOLR...) and any files
stored on the mounted volumes.

> **note**
> Make backups of your live environment before merging an environment to the live environment.

Using the CLI:

```bash
$ platform environment:backup
```

### Manual Restore

You will see the snapshot in the activity feed of you environment in the Platform.sh Web Interface where you can trigger the restore by clicking on the `restore` link.

You can list existing backups using the CLI using:
```bash
$ platform environment:backup --list

Finding backups for the environment master
+---------------------+------------+----------------------+
| Created             | % Complete | Backup name          |
+---------------------+------------+----------------------+
| 2015-06-19 17:11:42 | 100        | 2ca4d90639f706283fee |
| 2015-05-28 15:05:42 | 100        | 1a1fbcb9943849706ee6 |
| 2015-05-21 14:38:40 | 100        | 7dbdcdb16f41f9e1c061 |
| 2015-05-20 15:29:58 | 100        | 4997900d2804d5b2fc39 |
| 2015-05-20 13:31:57 | 100        | c1f2c976263bec03a10e |
| 2015-05-19 14:51:18 | 100        | 71051a8fe6ef78bca0eb |
```

You can restore a specific snapshot with the CLI with:
```bash
$ platform environment:restore 92c9a4b2aa75422efb3d
```


### Automated backups

**Platform.sh Standard**

No backup is triggered automatically on Platform.sh Standard. You can
trigger your backup via the Web Interface or via the CLI.

If you want to automate your backups, you can use Jenkins and trigger
the following CLI command:

```bash
$ platform environment:backup
```

> **note**
> We advise you to backup your environment each time you increase the storage space of your services.

**Platform.sh Enterprise**

Platform.sh Enterprise backups are run daily. Backups are retained for a
month.

In parallel we run EBS snapshots every four hours. Those snapshots are
kept for seven days.

