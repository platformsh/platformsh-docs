---
title: "Dedicated backup and restores"
weight: 1
sidebarTitle: "Dedicated backups"
layout: single
description:  "Backups are retained for different periods depending on various factors and whether you’re using a Dedicated Gen 2 or Dedicated Gen 3 environment. These processes can be either manual or automated."
---

{{% description %}}


## Dedicated Generation 2 Backups

Platform.sh takes a byte-for-byte snapshot of Dedicated Gen 2 production environments every 6 hours. Backups are retained for different durations depending on when they were taken. 

|When taken      |Retention            | 
|----------------|---------------------|
| Days 1–3       | Every backup        |  
| Days 4–6       | One backup per day  |   
| Weeks 2–6      | One backup per week |
| Weeks 8–12     | One bi-weekly backup|   
| Weeks 12–22    | One backup per month|  

Backups are created using snapshots saved to encrypted elastic block storage (EBS) volumes. An EBS snapshot is immediate, but the time it takes to write to the storage service depends on the volume of changes.

-   Recovery Point Objective (RPO) is 6 hours (maximum time to last backup).
-   Recovery Time Objective (RTO) depends on the size of the storage. Large EBS volumes take more time to restore.

These backups are only used in cases of catastrophic failure and can only be restored by Platform.sh. To request a restoration, open a [support ticket](/learn/overview/get-support.md).

## Dedicated Generation 2 restoration
 
The restoration process for Dedicated Generation 2 environments may take a few hours, depending on the infrastructure provider in use. In the ticket, specify if you want backups of files, MySQL, or both. Uploaded files are placed in an SSH-accessible directory on the Dedicated Gen 2 cluster. 

MySQL is provided as a MySQL dump file on the server. You may restore these to your site at your leisure. You are also free to make your own backups using standard tools (mysqldump, rsync, etc.).

{{< note title="Note" theme="info" >}}

Platform.sh does not proactively overwrite your production site with a backup. You are responsible for determining a “safe” time to restore the backup, or for selectively restoring individual files if desired.

{{< /note >}} 

## Dedicated Generation 3 

For Dedicated Generation 3 environments, [automated backups](environments/backup.md#use-automated-backups) are retained for a specific amount of time depending on their type and your [backup schedule](/environments/backup.md#backup-schedule). [Manual backups](/environments/backup.md#create-a-manual-backup) are retained until you delete them or replace them with another backup.

|Type            |Basic                |Advanced         |Premium    |
|----------------|---------------------|-----------------|-----------|
| 6-hourly       | -                   | -               |1 day      |                
| Daily          | 2 days              | 1 week          |1 month    |
| Weekly         | -                   | 4 weeks         |-          |
| Monthly        | -                   | 1 year          |1 year     | 


## Dedication Generation 3 restores

Dedicated Generation 3 environments allow for backups and restores the same way as Grid, so you can use them with the management console and the [Platform.sh CLI](/administration/cli/_index.md).