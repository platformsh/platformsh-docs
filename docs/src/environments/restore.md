---
title: Restore an environment from a backup
sidebarTitle: Restore environments
description: See how to restore an environment from a previous state.
weight: -10
---

Once you have [backups of your environment](./backup.md), you can restore data from a previous point.

To restore an environment, you need an [Admin role for that environment type](../administration/users.md).

## 1. List available backups

To restore an environment, first select one of the available backups:

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform backups
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
---
title=In the Console
file=none
highlight=false
---

1. Navigate to the environment where you want to see backups.
2. Click **Backups**.

Select one of the backups marked as having completed successfully {{< icon success >}}.

{{< /codetabs >}}

## 2. Restore from a backup

To restore the backup you've selected, follow these steps:

{{< codetabs >}}
---
title=Using the CLI
file=none
highlight=false
---

1. Run the following command:
   
   ```bash
   platform backup:restore {{< variable "BACKUP_ID" >}}
   ```

2. Press `enter` to agree with the consequences and continue.

<--->
---
title=In the Console
file=none
highlight=false
---

1. Next to the backup you've selected, click **More** {{< icon more >}}.
2. Click **Restore**.
3. Read through the consequences and click **Yes, Restore**.

{{< /codetabs >}}

The data is restored and your backed-up environment is deployed.
This deployment uses the built app, including variables, from when the backup was taken.
But the Git repository stays as it was before the restore, not when the backup was taken.
So any future (re)deployments use the current Git repository to build the environment.

## Restore to a different environment

You can restore backups to a different environment than they were created on using the CLI:

1. Switch to the branch where the backup was created.
2. Run the following command:

   ```bash
   platform backup:restore --target=<TARGET_BRANCH_NAME> <BACKUP_ID>
   ```

{{% legacy-regions featureIntro="Restoring backups to different environments" featureShort="to restore to different environments" %}}

You can also open a [support ticket](https://console.platform.sh/-/users/~/tickets) to ask that a backup be restored to a different environment for you.
