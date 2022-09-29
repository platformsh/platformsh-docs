---
title: Vulnerability scanning and penetration testing
sidebarTitle: Security scans
description: |
  Platform.sh understands the need for application owners to ensure the integrity, and standards compliance, of their applications. Because there could be adverse impacts to other clients which would violate our terms of service, we only permit certain types of tests.
---

{{% description %}}

Currently, we do not offer the possibility to activate/deactivate the Intrusion Prevention System (IPS) on demand.
On Platform.sh's side, there is no automatic IP or range blocking. Blocking IP's (or not) is usually left to the appreciation of the on-call engineer based on the specific circumstances.

## Approved Activities

* Vulnerability scanning of your web application. You are free to perform this as often as required without approval from Platform.sh.
* Web application penetration tests that don't result in high network load.
  You are free to perform this as often as required without approval from Platform.sh.
* Application level load testing that don't result in high network load. If the load test may result in the application to be down, we ask to open an urgent ticket as a courtesy 30 to 60 minutes before the load test begins. Typically application level load tests will trigger one or many NodePing alerts. Knowing that a load test is in progress will allow the on-call engineer to immediately snooze alerts.

## Approved Activities by Prior Arrangement

* For Dedicated customers, we do permit infrastructure penetration testing (but not load testing) by prior arrangement.
  This requires special advanced preparation.
  You must submit a support ticket request a minimum of **three (3) weeks** in advance for us to coordinate this on your behalf.

## Prohibited Activities

* Vulnerability scanning of web applications which you do not own.
* Denial of Service tests and any other type of load testing which results in heavy network load.
* Social engineering tests of Platform.sh services including falsely representing yourself as a Platform.sh employee.
* Infrastructure penetration tests for non-Dedicated customers. This includes SSH and database testing.

## Rate Limits

* Please limit scans to a maximum of 20 Mb per second and 50 requests per second to prevent triggering denial of service bans.

## Troubleshooting

If your vulnerability scanning suggests there may be an issue with Platform.sh's service, please ensure your container is [updated](/security/updates.md) and retest. If the problem remains, please [contact support](/overview/get-support.md).
