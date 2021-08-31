---
title: "Resource and incident monitoring"
weight: 2
sidebarTitle: "Incident Monitoring"
description: |
  All of our Dedicated clusters are monitored 24/7 to ensure uptime and to measure server metrics such as available disk space, memory and disk usage, and several dozen other metrics that give us a complete picture of the health of your application’s infrastructure.
---

{{< description >}}

Alerting is set up on these metrics, so if any of them goes outside of normal bounds an operations engineer can react accordingly to maintain the uptime and performance of your cluster.

These alerts are sent to our support and operations teams, and are not directly accessible to the customer.

## Monitoring systems

Platform.sh uses well-known open source tooling to collect metrics and to alert our staff if any of these metrics goes out of bounds.  That includes the use of Munin for collecting time-series data on server metrics, and dashboarding of these metrics so that our team can monitor trends over time.  It also includes use Nagios as a point in time alerting system for our operations staff.

These tools are internal Platform.sh tools only.

A third-party availability monitoring system is configured for every Dedicated project.

## Application performance monitoring

Platform.sh does not provide application-level performance monitoring.  However, we strongly recommend that customers configure application monitoring for themselves.

Platform.sh owns and recommends [Blackfire.io](/integrations/observability/blackfire.md#on-a-dedicated-cluster). By using Blackfire on Platform.sh, you will benefit from an enhanced experience and support, as well as upcoming unique features. You can contact your sales representative to get a quote for whatever size cluster is running your application.

Platform.sh also [supports New Relic APM](/integrations/observability/new-relic/_index.md#on-a-dedicated-cluster). After you have signed up with New Relic and gotten your license key, open a support ticket so that it can be installed on your project. New Relic infrastructure monitoring is not supported.

## Availability incident handling procedure

Automated monitoring may trigger alerts that will page the on-call engineer, or the end-user may file an urgent priority ticket.  PagerDuty will page the on-call using several methods. The on-call engineer responds to the alerts and begins to triage the issue.

Cloud infrastructure issues are handled by the customer success team. *Application problems are escalated to an application support specialist if an agreement is part of the customer subscription.  Otherwise, they are returned to the user and may be downgraded*.

When a Urgent/High issue is escalated it will page the on-call application support specialist.  Application support may also escalate infrastructure issues back as Urgent/High.

![Platform.sh Urgent Ticket Workflow](/images/dedicated/urgent-ticket-flow.svg "0.5")
