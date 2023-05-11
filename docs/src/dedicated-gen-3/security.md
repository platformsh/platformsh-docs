---
title: "Security and data privacy"
weight: 3
description: Learn how security and data privacy are handled on {{% names/dedicated-gen-3 %}} projects.
---

Platform.sh is committed to protecting your data and keeping your site safe, secure, and available at all times.
All Dedicated projects are isolated and their data is fully encrypted.

Should a security breach occur, Platform.sh follows a strict [security incident handling procedure](#security-incident-handling-procedure)
to deal with the issue as promptly and efficiently as possible.

## Project isolation

All Dedicated clusters are single-tenant.
The [three virtual machines](./_index.md) are exclusively used by a single customer
and each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers).

The network is behind a firewall for incoming connections.
Only ports 22 (SSH), 80 (HTTP), 443 (HTTPS), and 2221 (SFTP) are opened to incoming traffic.

{{< note >}}

There are **no exceptions** for this rule, so any incoming web service requests,
ETL jobs, or otherwise need to transact over one of these protocols.

{{</note >}}

Outgoing TCP traffic isn't behind a firewall.
Outgoing UDP traffic is disallowed.

Each branch is deployed as a series of containers hosted on a shared underlying virtual machine.
Many customers generally share the same virtual machine.
For containers to be allowed to connect to each other, the following requirement must be met:

- The containers must live in the same environment.
- You need to define an explicit `relationship` between the containers
  in your [app configuration](../create-apps/app-reference.md#relationships).

## Security incident handling procedure

Should Platform.sh become aware of a security incident &mdash; such as an active or past hacking attempt, virus or worm, or data breach &mdash;
senior personnel, including the CTO, are promptly notified.

The security incident procedure includes the following steps:

1. Isolating the affected systems.
2. Collecting forensic evidence for later analysis, including a byte-for-byte copy of the affected systems.
3. Restoring normal operations.

Once normal service is restored, a root cause analysis is performed to determine exactly what happened.
Upon request, Platform.sh can provide you with a Reason for Outage report that summarizes the incident, cause, and steps taken.

Platform.sh cooperates with relevant law enforcement,
and informs law enforcement in the event of an attempted malicious intrusion.
Depending on the type of incident, the root cause analysis may be conducted by law enforcement rather than Platform.sh personnel.

Platform.sh endeavors to notify affected customers within 24 hours in case of a personal data breach
and 72 hours in case of a project data breach.

<!-- vale Vale.Spelling = NO -->
<!-- Spelling off because of the French-->
Under the European General Data Protection Regulation (GPDR),
Platform.sh is required to notify its supervising authority within 72 hours of a discovered breach
that may result in risk to the rights and freedoms of individuals.
The supervising authority for Platform.sh is the French [Commission Nationale de l'Informatique et des Libertés](https://www.cnil.fr/).
<!-- vale Vale.Spelling = YES -->

### Audit trail

As part of the security incident process, Platform.sh records a log of all steps taken to identify,
isolate, and respond to the incident.
This log may include:

- A byte-for-byte copy of the affected systems
- How the intrusion was detected
- The steps taken to contain the intrusion
- Any contact with third parties, including law enforcement
- Any conclusions reached regarding the root cause

## Encryption

### AWS

AWS EBS Volumes are encrypted on Platform.sh,
which means {{% names/dedicated-gen-3 %}} and {{% names/dedicated-gen-2 %}} sites are fully encrypted.
Keys are managed by the AWS Key Management Service.
AWS automatically rotates these keys every three years.
In some cases, temporary storage (such as swap) is stored on unencrypted local storage volumes.

### Azure

By default, data is encrypted using Microsoft Managed Keys for Azure Blobs, Tables, Files, and Queues.

[comment]: <> (What about other cloud providers? Is this section really needed/complete/valuable?)