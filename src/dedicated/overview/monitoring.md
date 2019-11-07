# Resource and incident monitoring

All of our Enterprise clusters are monitored 24/7 to ensure uptime and to measure server metrics such as available disk space, memory and disk usage, and several dozen other metrics that give us a complete picture of the health of your application’s infrastructure.  Alerting is set up on these metrics, so if any of them goes outside of normal bounds an operations engineer can react accordingly to maintain the uptime and performance of your cluster.

These alerts are sent to our support and operations teams, and are not directly accessible to the customer.

## Monitoring systems

We use well known open source tooling to collect metrics and to alert our staff if any of these metrics goes out of bounds.  We use Munin for collecting time-series data on server metrics, and dashboarding of these metrics so that we can monitor trends over time.  We also use Nagios as a point in time alerting system for our operations staff.

These tools are internal Platform.sh tools only.

A third-party availability monitoring system is configured for every Enterprise project. The customer can be subscribed to email alerts upon request.

## Application performance monitoring

Platform.sh does not provide application-level performance monitoring.  However, we strongly recommend that customers leverage application monitoring themselves.  Platform.sh is a New Relic reseller and New Relic APM is available on all Platform.sh Enterprise accounts via our partnership with New Relic.  We offer a 10% discount off of the standard list price for whatever size cluster is running your application.  New Relic infrastructure monitoring is not supported.

Blackfire.io is also available on the same model.

## Availability incident handling procedure

Automated monitoring may trigger alerts that will page the on-call engineer, or the end-user may file an urgent or high priority ticket.  PagerDuty will page the on-call using several methods. The on-call engineer responds to the alerts and begins to triage the issue.

Cloud infrastructure issues are handled by the customer success team. *Application problems are escalated to application support specialist if an agreement is part of the customer subscription.  Otherwise, they are returned to the user and may be downgraded*.

When a Urgent/High issue is escalated it will page the on-call application support specialist.  Application support may also escalate infrastructure issues back as Urgent/High.

![Platform.sh Urgent Ticket Workflow](/images/urgent-ticket-flow.svg)
