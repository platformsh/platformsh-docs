# Backups & snapshots

Platform.sh takes a byte-for-byte snapshot of production environments every six (6) hours.  They are retained on a sliding scale, so more recent time frames have more frequent backups.

| Time frame | Backup retention     |
|-----------------------------------|
| Days 1-3   | Every backup         |
| Days 4-6   | One backup per day   |
| Weeks 2-6  | One backup per week  |
| Weeks 8-12 | One bi-weekly backup |
| Weeks 12-22| One backup per month |

Platform.sh Enterprise creates the backup using snapshots to encrypted elastic block storage (EBS) volumes. An EBS snapshot is immediate, but the time it takes to write to the simple storage service (S3) depends on the volume of changes.

* **Recovery Point Objective (RPO)** is 6 hours (maximum time to last backup).
* **Recovery Time Objective (RTO)** depends on the size of the storage. Large EBS volumes take more time to restore.

These backups are only used in cases of catastrophic failure and can only be restored by Platform.sh. A ticket must be opened by the customer to request a restoration.

The restoration process may take a few hours, depending on the infrastructure provider in use.  In the ticket, specify if you want backups of files, MySQL, or both.  Uploaded files will be placed in an SSH-accessible directory on the Enterprise Cluster.  MySQL will be provided as a MySQL dump file on the server.  You may restore these to your site at your leisure.  (We will not proactively overwrite your production site with a backup; you are responsible for determining a "safe" time to restore the backup, or for selectively restoring individual files if desired.)

Customers are welcome to make their own backups using standard tools (mysqldump, rsync, etc.) at their own leisure.
