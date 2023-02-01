---
title: "Options"
weight: 4
---

## Multiple applications

{{% multi-app-intro %}}

For more information, see how to [configure multiple apps in a single project](../../create-apps/multi-app.md).

## Multiple-AZ

The default configuration for Dedicated clusters is to launch into a single Availability Zone (AZ).
This is for a few reasons:

- Because the members of your cluster communicate with each other via TCP to perform DB replication, cache lookup, and other associated tasks, the latency between data centers/AZs can become a significant performance liability.
Having your entire cluster within one AZ ensures that the latency between cluster members is minimal, having a direct effect on perceived end-user performance.
- Network traffic between AZs is billed, whereas intra-AZ traffic isn't.
That leads to higher costs for this decreased performance.

Some clients prefer the peace of mind of hosting across multiple AZs, but it should be noted that multiple-AZ configurations do not improve the contractual 99.99% uptime SLA, nor does our standard, single-AZ configuration decrease the 99.99% uptime SLA.
We are responsible for meeting the 99.99% uptime SLA no matter what, so multiple-AZ deployments should only be considered in cases where it is truly appropriate.

Multi-AZ deployments are available only on select AWS regions.

## Additional application servers

For especially high-traffic sites we can also add additional application-only servers.
These servers contain just the application code; data storage services (such as SQL, Solr, Redis) are limited to the standard three.
The cluster begins to look more like a standard N-Tier architecture at this point, with a horizontal line of web application servers in front of a 3 node (N+1) cluster of Galera database servers.

Speak to your sales representative about the costs associated with adding additional application servers.
This configuration requires a separate setup from the default so advanced planning is required.

## SFTP accounts

In addition to SSH accounts, SFTP accounts can be created with a custom user/password that are restricted to certain directories. These directories must be one of the writeable mounts (or rather, there's no point assigning them to the read-only code directory).
There is no cost for this configuration, and it can be requested at any time via a support ticket. SSH public key based authentication is also supported on the SFTP account.

## IP restrictions

Platform.sh supports project-level IP restrictions (allow/deny) and HTTP Basic authentication.
These may be configured through the Development Environment and are automatically replicated from the `production` and `staging` branches to the production and staging environments, respectively.

{{< note >}}

Changing access control triggers a new deploy of the current environment.
However, the changes aren't propagate to child environments until they're [manually redeployed](../../development/troubleshoot.md#force-a-redeploy).

{{< /note >}}