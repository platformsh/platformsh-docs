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

## Backups

The backups retention depends on the [automated backup policy](../environments/backup.md#automated-backups).

## Tombstone backups

When a project is deleted, {{% vendor/name %}} takes a final backup of active environments, as well as the Git repository holding user code.
This final backup is to allow {{% vendor/name %}} to recover a recently deleted project in case of accident.

These "tombstone" backups are retained for between 7 days and 6 months depending upon legal and standards compliance required for each system.

## Analytics

{{% vendor/name %}} uses Google Analytics on various web pages, and so Google Analytics stores collected data for a period of time.
We have configured our Google Analytics account to store data for 14 months from the time you last accessed our site, which is the minimum Google allows.

## Trials

User data - which includes pushed code and data contained within services - is retained for a shorter period during trials.
See [Trial details](/glossary#trial).