---
title: "Options"
weight: 4
aliases:
  - /dedicated/architecture/options.html
---

## Staging environments

By default, the staging instance and production instance run on the same trio of virtual machines.
That ensures identical configuration between them but can incur a performance penalty for production if the load generated during quality assurance (QA) and user acceptance testing (UAT) in staging is of any appreciable size.

A dedicated single-node staging machine can be provisioned for your application with an identical software configuration to your production hardware, but reduced hardware specs.
This gives the advantages of isolating the staging load from the production hardware as well as having an identical software configuration to perform UAT, but this option doesn't provide a bed for performance testing as the physical hardware configuration isn't the same as production.

## Multiple applications

Each application deployed to a {{% names/dedicated-gen-2 %}} cluster corresponds to a single Git repository in the Development Environment.
Multiple `.platform.app.yaml` files aren't supported.
While you can host multiple application code bases in separate subdirectories
(such as `/app` and `/api`) controlled by a single `.platform.app.yaml`,
it isn't recommended and requires additional configuration.

You can map one or more domains to your app.

Experience has shown that hosting multiple apps on a common resource pool is often bad for all apps in the cluster.
So the number of apps you can host on a single {{% names/dedicated-gen-2 %}} cluster is limited.
On a D6 instance, you can only have only one app.
On D12 and larger {{% names/dedicated-gen-2 %}} plans, you can have multiple applications at an extra cost.
Each application would correspond to a different Development Environment and Git repository.
It can't share data or files with other apps.
This configuration is discouraged.

## Multiple-AZ

The default configuration for {{% names/dedicated-gen-2 %}} clusters is to launch into a single Availability Zone (AZ).
This is for a few reasons:

* Because the members of your cluster communicate with each other via TCP to perform DB replication, cache lookup, and other associated tasks, the latency between data centers/AZs can become a significant performance liability.
Having your entire cluster within one AZ ensures that the latency between cluster members is minimal, having a direct effect on perceived end-user performance.
* Network traffic between AZs is billed, whereas intra-AZ traffic isn't.
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

## Error handling

On Grid projects, incoming requests are held at the edge router temporarily during a deploy.
That allows a site to "respond slowly" rather than be offline during a deploy, provided the deploy time is short (a few seconds).

On {{% names/dedicated-gen-2 %}} projects, incoming requests aren't held during deploy and receive a 503 error.
As the {{% names/dedicated-gen-2 %}} cluster is almost always fronted by a CDN,
the CDN continues to serve cached pages during the few seconds of deploy,
so for the vast majority of users there is no downtime or even slow down.
If a request does pass the CDN during a deploy, it isn't counted as downtime covered by our Service Level Agreement.

By default, Platform.sh serves generic Platform.sh-branded error pages for errors generated before a request reaches the application.
(500 errors, some 400 errors, etc.)  Alternatively you may provide a static error page for each desired error code via a ticket for us to configure with the CDN.
This file may be any static HTML file but is limited to 64 KB in size.

## IP restrictions

Platform.sh supports project-level IP restrictions (allow/deny) and HTTP Basic authentication.
These may be configured through the Development Environment and are automatically replicated from the `production` and `staging` branches to the production and staging environments, respectively.

{{< note >}}

Changing access control triggers a new deploy of the current environment.
However, the changes aren't propagate to child environments until they're [manually redeployed](../../development/troubleshoot.md#force-a-redeploy).

{{< /note >}}

## Remote logging

{{% names/dedicated-gen-2 %}} supports sending logs to a remote logging service such as Loggly, Papertrail, or Logz.io using the `rsyslog` service.
This is an optional feature and you can request that it be enabled via a support ticket.
Once enabled and configured your application can direct log output to the system `syslog` facility
and is replicated to the remote service you have configured.

When contacting support to enable `rsyslog`, you need:

* The name of the remote logging service to use.
* The message template format used by your logging service.
* The specific log files you want forwarded to your logging service.

There is no cost for this functionality.
