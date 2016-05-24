# Snapshot and Restore

## Snapshot

### Manual snapshot

Snapshots are triggered directly via the Web Interface or via the CLI. The snapshot
creates a complete backup of the environment. It includes all
persistent data from all running services (MySQL, SOLR...) and any files
stored on the mounted volumes.

> **note**
> We advise you to make snapshots of your live environment before merging an environment 
> to the live environment, or each time you increase the storage space of your services.

> **note**
> You need "admin" role to take a snapshot of your environment.

Using the CLI:

```bash
$ platform snapshot:create
```

### Manual Restore

You will see the snapshot in the activity feed of you environment in the Platform.sh Web Interface where you can trigger the restore by clicking on the `restore` link.

You can list existing snapshots using the CLI using:
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

You can restore a specific snapshot with the CLI with:
```bash
$ platform snapshot:restore 92c9a4b2aa75422efb3d
```

> **note**
> You need "admin" role to restore your environment from a snapshot.

### Automated snapshots

No snapshot is triggered automatically on Platform.sh Standard. You can
trigger your snapshot via the Web Interface or via the CLI.

If you want to automate your snapshots, you can use Jenkins and trigger
the following CLI command:

```bash
$ platform snapshot:create --yes
```

### Retention

Your snapshots are kept for 14 days.
