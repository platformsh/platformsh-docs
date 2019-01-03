# Data retention

Platform.sh logs and stores all sorts of data as a normal part of its business. This information is retained as needed for business purposes and old data is purged. The retention time varies depending on the type of data stored.

## Account information

Information relating to customer accounts (login information, billing information, etc.) is retained for as long as the account is active with Platform.sh.

Customers may request that their account be deleted and all related data be purged by filing an issue ticket.

## System logs

System level access and security logs are maintained by Platform.sh for diagnostic purposes. These logs are not customer-accessible. These logs are retained for at least _6 months_ and at most _1 year_.

General system level logs are retained for at least _30 days_ and at most _1 year_.

## Payment processing logs

Logs related to payment processing are retained for at least _3 months_ and at most _1 year_. This is consistent with PCI recommendations.

## Application logs

Application logs on each customer environment are retained with the environment. Individual log files are truncated at 10 MB, regardless of their age. See the [accessing logs](/development/logs.md) page for instructions on how to access them.

When an environment is deleted its application logs are deleted as well.

## Snapshots

Snapshots on Platform.sh Professional are retained for at least _7 days_. They will be purged between 7 days and _6 months_, at Platform.sh's discretion.

## Enterprise backups

Platform.sh takes a backup of Platform.sh Enterprise environments every 6 hours. These snapshots are retained for _2 weeks_.

## Tombstone backups

When a project is deleted Platform.sh takes a final snapshot of active environments as well as the Git repository holding user code. This final snapshot is to allow Platform.sh to recover a recently-deleted project in case of accident.

These "tombstone" backups are retained for between _7 days_ and _6 months_.

## Analytics

Platform.sh uses Google Analytics on various web pages, and therefore Google Analytics will store collected data for a period of time. We have configured our Google Analytics account to store data for _14 months_ from the time you last accessed our site, which is the minimum Google allows.
