---
title: "Options"
weight: 4
---

You can enable [staging environments](#staging-environments),
[error handling](#error-handling) features 
and [remote logging](#remote-logging) on your Dedicated Generation 2 projects.
Other optional features include:
- [multiple applications](../../dedicated-gen-3/architecture/options.md#multiple-applications)
- [multiple availability zones](../../dedicated-gen-3/architecture/options.md#multiple-az)
- [additional application servers](../../dedicated-gen-3/architecture/options.md#additional-application-servers)
- [SFTP accounts](../../dedicated-gen-3/architecture/options.md#sftp-accounts)
- and [IP restrictions](../../dedicated-gen-3/architecture/options.md#ip-restrictions)

To enable an optional feature or get more information on potential fees,
[contact Sales](https://platform.sh/contact/).

## Staging environments

A dedicated single-node staging machine is provisioned for your application with an identical software configuration to your production hardware, but reduced hardware specs.
This gives the advantages of isolating the staging load from the production hardware as well as having an identical software configuration to perform UAT, but this option doesn't provide a bed for performance testing as the physical hardware configuration isn't the same as production.

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

## Remote logging

{{% names/dedicated-gen-2 %}} supports sending logs to a remote logging service such as Loggly, Papertrail, or Logz.io using the `rsyslog` service.
This is an optional feature and you can request that it be enabled via a support ticket.
Once enabled and configured your application can direct log output to the system `syslog` facility
and is replicated to the remote service you have configured.

When contacting support to enable `rsyslog`, you need:

- The name of the remote logging service to use.
- The message template format used by your logging service.
- The specific log files you want forwarded to your logging service.

There is no cost for this functionality.