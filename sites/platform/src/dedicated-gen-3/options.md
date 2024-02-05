---
title: Optional features
weight: 4
description: You can add optional features to your {{% names/dedicated-gen-3 %}} project.
keywords:
  - SFTP
  - sftp
---

You can enable the following features on your {{% names/dedicated-gen-3 %}} projects.

To enable an optional feature or get more information on potential fees,
[contact Sales](https://platform.sh/contact/).

## Multiple availability zones

The default configuration for Dedicated clusters is to launch them into a single availability zone (AZ)
for the following reasons:

- The members of your cluster communicate with each other via TCP to perform DB replication,
  cache lookup, and other associated tasks.
  Therefore, the latency between data centers or AZs can become a significant performance liability.
  When your entire cluster is deployed within a single AZ, the latency between cluster members is minimal.
  This has a direct effect on perceived end-user performance.

- Network traffic between AZs is billed, whereas intra-AZ traffic isn't.
  So launching Dedicated clusters across multiple AZs leads to higher costs for decreased performance.

If you prefer the peace of mind of hosting across multiple AZs,
you can request a different configuration.
But note that multiple-AZ configurations don't improve the contractual 99.99% uptime SLA
(nor does the standard, single-AZ configuration decrease the 99.99% uptime SLA).
{{% vendor/name %}} is responsible for meeting the 99.99% uptime SLA no matter what,
so multiple-AZ deployments should only be considered in cases where they're truly appropriate.

Multi-AZ deployments are available only on select AWS regions.

## SFTP

In addition to SSH accounts, you can create `sftp` accounts with a custom user/password to [transfer files](/development/file-transfer.md). 

{{< note >}}

On {{% names/dedicated-gen-3 %}} projects, `sftp` access cannot be limited to a specific directory.
Instead, access is given to **the whole application directory** and its mounts.

{{< /note >}}

SSH public key based authentication is also supported on the `sftp` account.