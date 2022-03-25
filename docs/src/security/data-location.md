---
title: "Data location"
description: |
  Data location.
---


## When project data leaves a region

If you create a project in a specific region, data from that project never leaves your chosen region unless you intentionally request an additional dedicated cluster in a different location.

Technically, each region has separate data storage. Data leaves this storage only when you initiate a backup (to a location where the region itself is) or during disaster recovery backups (which use the same storage principle).

## Backups

Backups stay in the same region as the project itself. 

## Access logs

Access logs (such as web and SSH logs) are sent outside of the region to a collection point inside the EU. This is done to ensure that logs are available should the region be affected by availability or integrity issues. Platform.sh also uses the logs for security analysis.
