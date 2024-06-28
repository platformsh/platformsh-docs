---
title: Restore an environment from a backup
sidebarTitle: Restore an environment
description: See how to restore an environment from a previous state.
weight: -10
---

Once you have [backups of your environment](./backup.md), you can restore data from a previous point.

To restore an environment, you need an [Admin role for that environment type](../administration/users.md).

## 1. List available backups

To restore an environment, first select one of the available backups:

{{< codetabs >}}
+++
title=Using the CLI
+++

Run the following command:

```bash
{{% vendor/cli %}} backups
```

You get a response similar to the following:

```bash
Backups on the project My Project (1234567abcdef), environment main (type: production):
+---------------------------+----------------------------+------------+
| Created                   | Backup ID                  | Restorable |
+---------------------------+----------------------------+------------+
| 2022-08-15T09:48:58+01:00 | 5ouvtgo4v75axijww7sqnftste | true       |
| 2022-07-09T14:17:17+01:00 | 7jks7dru5xpx5p5id5wtypur2y | true       |
| 2022-06-22T18:33:29+01:00 | f3jbyxlhtmalco67fmfoxs7n4m | true       |
+---------------------------+----------------------------+------------+
```

Select one of the backups marked as **Restorable** and copy its **Backup ID**.

<--->
+++
title=In the Console
+++

1. Navigate to the environment where you want to see backups.
2. Click **Backups**.

Select one of the backups marked as having completed successfully {{< icon success >}}.

{{< /codetabs >}}

## 2. Restore from a backup

To restore the backup you've selected, follow these steps:

{{< codetabs >}}
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} backup:restore {{< variable "BACKUP_ID" >}}
   ```

2. Press `enter` to agree with the consequences and continue.

<--->
+++
title=In the Console
+++

1. Next to the backup you've selected, click **More** {{< icon more >}}.
2. Click **Restore**.
3. Read through the consequences and click **Yes, Restore**.

{{< /codetabs >}}

The data is restored and your backed-up environment is deployed.
This deployment uses the built app, including variables, from when the backup was taken.

{{< note theme="warning" title="Warning" >}}

The code is also initially restored, but {{% vendor/name %}} doesn't modify your Git repository.
So any future (re)deployments use the current Git repository to build the environment.

To restore your code to its previous state when the backup was taken,
use Git commands such as [revert](https://git-scm.com/docs/git-revert).

Note that you can also opt out of restoring the code entirely by using the `--no-code` flag.
For more information, see [how backup and restore works on {{% vendor/name %}}](../environments/backup.md#how-backup-and-restore-works).

Also, see [how resource allocation works](/manage-resources/resource-init.html#backup-restoration) when you restore a backup.

{{< /note >}}

## Restore to a different environment

You can restore backups to a different environment than they were created on using the CLI:

1. Switch to the branch where the backup was created.
2. To restore your backup to an existing environment, run the following command: 

   ```bash
   {{% vendor/cli %}} backup:restore --target={{% variable "TARGET_ENVIRONMENT_NAME" %}} {{% variable "BACKUP_ID" %}}
   ```
   
   If your target environment doesn't exist yet, you can create it by [branching an existing environment](/glossary.md#branch).
   The new target environment will be an exact copy of the existing (parent) environment.
   
   To do so, use the `--branch-from` option to specify the parent of your new target environment:

   ```bash
   {{% vendor/cli %}} backup:restore --target={{% variable "TARGET_ENVIRONMENT_NAME" %}} --branch-from={{% variable "PARENT_ENVIRONMENT_NAME" %}} {{% variable "BACKUP_ID" %}}
   ```