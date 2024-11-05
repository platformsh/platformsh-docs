---
title: Data retention
description: |
  {{% vendor/name %}} logs and stores various types of data as a normal part of its business. This information is only retained as needed to perform relevant business functions. Retention periods vary depending on the type of data stored. If a legal obligation, law enforcement request, or ongoing business need so requires, data may be retained after the original purpose for which it was collected ceases to exist.
---

{{% description %}}

## Account information

Information relating to customer accounts (login information, billing information, etc.) is retained for as long as the account is active with {{% vendor/name %}}.

Customers may request that their account be deleted and all related data be purged by opening a [support ticket](/learn/overview/get-support).

## System logs

System level access and security logs are maintained by {{% vendor/name %}} for diagnostic purposes.
These logs aren't customer-accessible.
These logs are retained for at least 6 months and at most 2 years depending upon legal and standards compliance required for each system.

## Application logs

Application logs on each customer environment are retained with the environment.
Individual log files are truncated at 100 MB, regardless of their age.
See how to [access logs](../increase-observability/logs/access-logs.md).

When an environment is deleted, its application logs are deleted as well.

## Grid Backups

[Automated backups](../environments/backup.md#use-automated-backups) are retained for a specific amount of time
depending on their type and your [backup schedule](../environments/backup.md#backup-schedule).

| Type     | Basic  | Advanced | Premium |
| -------- | ------ | -------- | ------- |
| 6-hourly | –      | –        | 1 day   |
| Daily    | 2 days | 1 week   | 1 month |
| Weekly   | –      | 4 weeks  | –       |
| Monthly  | –      | 1 year   | 1 year  |

[Manual backups](../environments/backup.md#create-a-manual-backup) are retained until you delete them or replace them with another backup.

For example, if you currently have 10 manual backups and are on the Advanced schedule,
you keep all 10 manual backups until there are 15 automated backups.
Then the automated backups start replacing the manual ones until you have only your allocated 4 manual backups.

Backups associated with an environment are retained according to the [backup cycles](#backup-cycles) outlined below, so long as the environment still exists in the project.
That is, backups are deleted when the corresponding environment is deleted.

### Backup cycles

Backups are created and retained in a cycle.
As the cycle restarts, the first backup of that stage passes down to the next stage.
The following is an example of the cycle using the shortest stage (6-hourly backups) from the Premium schedule.
The times are just for understanding as actual backup times vary by project.

The first cycle is 4 backups (6-hourly backups) made in one day.

![Four 6-hourly backups get taken on a Monday.](/images/backup-cycles/first-cycle.png "0.215-inline")

The first backup doesn’t expire after one day but is retained for the next cycle.

![The first 6-hourly backup is a daily backup.](/images/backup-cycles/retain.png "0.215-inline")

As additional backups are created, the oldest backups are replaced and no longer available.

![When two backups are taken on Tuesday, the 6-hourly backups from Monday start becoming unavailable.](/images/backup-cycles/replace-backup.png "0.3-inline")

When the next cycle completes, it has replaced the previous cycle.

![When two backups are taken on Tuesday, the 6-hourly backups from Monday start becoming unavailable.](/images/backup-cycles/replace-cycle.png "0.375-inline")

#### Advanced schedule retention

The following diagram shows how the cycle works for the entire Advanced schedule:

![Daily backups are retained for 1 week. The first daily backup is the weekly backup. Weekly backups are retained for 1 month. The first weekly backup is the monthly backup. Monthly backups are retained for 1 year.](/images/backup-cycles/advanced-retention.png "0.6")

#### Premium schedule retention

The following diagram shows how the cycle works for the entire Premium schedule:

![Each 6-hourly backup is retained for 1 day. The first 6-hourly backup is the daily backup. Daily backups are retained for 30 days. The first daily backup is the monthly backup. Monthly backups are retained for 1 year.](/images/backup-cycles/premium-retention.png "0.6")

## {{% names/dedicated-gen-2 %}} backups

Backups for {{% names/dedicated-gen-2 %}} environments are retained based on when they were taken.

| When taken   | Retention            |
| ------------ | -------------------- |
| Days 1--3    | Every backup         |
| Days 4--6    | One backup per day   |
| Weeks 2--6   | One backup per week  |
| Weeks 8--12  | One bi-weekly backup |
| Weeks 12--22 | One backup per month |

See more about [backups of {{% names/dedicated-gen-2 %}} environments](/dedicated-environments/dedicated-gen-2/environment-differences.md#backups).

## Tombstone backups

When a project is deleted, {{% vendor/name %}} takes a final backup of active environments, as well as the Git repository holding user code.
This final backup is to allow {{% vendor/name %}} to recover a recently deleted project in case of accident.

These "tombstone" backups are retained for between 7 days and 6 months depending upon legal and standards compliance required for each system.

## Analytics

{{% vendor/name %}} uses Google Analytics on various web pages, and so Google Analytics stores collected data for a period of time.
We have configured our Google Analytics account to store data for 14 months from the time you last accessed our site, which is the minimum Google allows.
