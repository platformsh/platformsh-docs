# Options

## Staging environments

By default, the staging instance and production instance run on the same trio of virtual machines.  That ensures identical configuration between them but can incur a performance penalty for production if the load generated during QA and UAT in staging is of any appreciable size.

A dedicated single-node staging machine can be provisioned for your application with an identical software configuration to your production hardware, but reduced hardware specs.  This gives the advantages of isolating the staging load from the production hardware as well as having an identical software configuration to perform UAT, but this option does not provide a bed for performance testing as the physical hardware configuration is not the same as production.

## Multiple applications

Each application deployed to the Enterprise Cluster corresponds to a single Git repository in the Development Environment.  Multiple `.platform.app.yaml` files are not supported.  While it is possible to host multiple application code bases in separate subdirectories/subpaths of the application (such as /drupal, /api, /symfony, etc.) controlled by a single `.platform.app.yaml`, it is not recommended and requires additional configuration.  One or more domains may be mapped to the application.

Our experience has shown that hosting multiple applications on a common resource pool is often bad for all applications on the cluster.  We therefore limit the number of applications that may be hosted on a single Enterprise Cluster.  On a PE6 instance, only one application is supported.  On PE12 and larger Enterprise plans multiple applications are supported at an extra cost.  Each application would correspond to a different Development Environment and Git repository and cannot share data or files with other applications.  This configuration is discouraged.

## Multiple-AZ

The default configuration for Platform.sh Enterprise clusters is to launch into a single Availability Zone (AZ).  This is for a few reasons:

* Because the members of your cluster communicate with each other via TCP to perform DB replication, cache lookup, and other associated tasks, the latency between data centers/AZs can become a significant performance liability.  Having your entire cluster within 1 AZ ensure that the latency between cluster members is minimal, having a direct effect on perceived end-user performance.
* Network traffic between AZs is billed, whereas intra-AZ traffic is not.  That leads to higher costs for this decreased performance.

Some clients prefer the peace of mind of hosting across multiple AZs, but it should be noted that multiple-AZ configurations do not improve the contractual 99.99% uptime SLA, nor does our standard, single-AZ configuration decrease the 99.99% uptime SLA.  We are responsible for meeting the 99.99% uptime SLA no matter what, so multiple-AZ deployments should only be considered in cases where it is truly appropriate.

Multi-AZ deployments are available only on select AWS regions.

## Additional application servers

For especially high-traffic sites we can also add additional application-only servers.  These servers will contain just the application code; data storage services (SQL, Solr, Redis, etc.) are limited to the standard three.  The cluster begins to look more like a standard N-Tier architecture at this point, with a horizontal line of web application servers in front of a 3 node (N+1) cluster of Galera database servers.

Speak to your sales representative about the costs associated with adding additional application servers.  This configuration requires a separate setup from the default so advanced planning is required.

## SFTP accounts

In addition to SSH accounts, SFTP accounts can be created with a custom user/password that are restricted to certain directories. These directories must be one of the writeable mounts (or rather, there's no point assigning them to the read-only code directory).  There is no cost for this configuration, and it can be requested at any time via a support ticket. SSH public key based authentication is also supported on the SFTP account.

## Error handling

On Platform.sh Professional, incoming request are held at the edge router temporarily during a deploy.  That allows a site to simply "respond slowly" rather than be offline during a deploy, provided the deploy time is short (a few seconds).

On Platform.sh Enterprise, incoming requests are not held during deploy and receive a 503 error.  As the Enterprise Cluster is almost always fronted by a CDN, the CDN will continue to serve cached pages during the few seconds of deploy so for the vast majority of users there is no downtime or even slowdown.  If a request does pass the CDN during a deploy that is not counted as downtime covered by our Service Level Agreement.

By default, Platform.sh will serve a generic Platform.sh-branded error pages for errors generated before a request reaches the application.  (500 errors, some 400 errors, etc.)  Alternatively you may provide a static error page for each desired error code via a ticket for us to configure with the CDN.  This file may be any static HTML file but is limited to 64 KB in size.

## IP restrictions

Platform.sh supports project-level IP restrictions (whitelisting) and HTTP Basic authentication.  These may be configured through the Development Environment and will be automatically replicated from the `production` and `staging` branches to the production and staging environments, respectively.

> **note**
> Changing access control will trigger a new deploy of the current environment. However, the changes will not propagate to child environments until they are manually redeployed.

## Remote logging

Platform.sh Enterprise supports sending logs to a remote logging service such as Loggly, Papertrail, or Logz using the rsyslog service.  This is an optional feature and you can request that it be enabled via a support ticket.  Once enabled and configured your application can direct log output to the system syslog facility and it will be replicated to the remote service you have configured.

When contacting support to enable rsyslog, you will need:

* The name of the remote logging service you will be using.
* The message template format used by your logging service.
* The specific log files you want forwarded to your logging service.

There is no cost for this functionality.
