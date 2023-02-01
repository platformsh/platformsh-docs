---
title: "Security and data privacy"
weight: 3
sidebarTitle: "Security and data privacy"
description: Learn how security and data privacy are handled on {{% names/dedicated-gen-3 %}} projects.
---

## Project isolation

All Dedicated clusters are single-tenant.
The three virtual machines are exclusively used by a single customer and each cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers).
The network is behind a firewall for incoming connections; only ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 2221 (SFTP) are opened to incoming traffic.
There are **no exceptions** for this rule, so any incoming web service requests, ETL jobs, or otherwise need to transact over one of these protocols.

Outgoing TCP traffic isn't behind a firewall.
Outgoing UDP traffic is disallowed.

The Development Environment deploys each branch as a series of containers hosted on a shared underlying VM.
Many customers generally share the same VM.
All containers are allowed to connect only to other containers in their same environment, and even then only if an explicit "relationship" has been defined by the user via configuration file.

## Security incident handling procedure

Should Platform.sh become aware of a security incident &mdash; such as an active or past hacking attempt, virus or worm, or data breach &mdash; senior personnel including the CTO are promptly notified.

The security incident procedures include isolating the affected systems, collecting forensic evidence for later analysis including a byte-for-byte copy of the affected system, and finally restoring normal operations. Once normal service is restored a root cause analysis is performed to determine exactly what happened.
A Reason for Outage report may be provided to the customer upon request that summarizes the incident, cause, and steps taken.

Platform.sh cooperates with relevant law enforcement, and inform law enforcement in the event of an attempted malicious intrusion.
Depending on the type of incident the root cause analysis may be conducted by law enforcement rather than Platform.sh personnel.

Platform.sh endeavors to notify affected customers within 24 hours in case of a personal data breach and 72 hours in case of a project data breach.

<!-- vale Vale.Spelling = NO -->
<!-- Spelling off because of the French-->
Under the European General Data Protection Regulation (GPDR), Platform.sh is required to notify our supervising authority within 72 hours of a discovered breach that may result in risk to the rights and freedoms of individuals.
Our supervising authority is the French [Commission Nationale de l'Informatique et des Libertés](https://www.cnil.fr/).
<!-- vale Vale.Spelling = YES -->

## Audit trail

As part of the security incident process we record a log of all steps taken to identify, isolate, and respond to the incident.
This log may include:

* A byte-for-byte copy of the affected systems
* How the intrusion was detected
* The steps taken to contain the intrusion
* Any contact with 3rd parties, including law enforcement
* Any conclusions reached regarding the root cause

## Encryption

### AWS

AWS EBS Volumes are encrypted on Platform.sh {{% names/dedicated-gen-3 %}} and {{% names/dedicated-gen-2 %}} sites are fully encrypted. Keys are managed by AWS’s KMS (Key Management Service). AWS automatically rotates these keys every three years. In some cases, temporary storage (such as swap) is stored on unencrypted local storage volumes.

### Azure

By default, data is encrypted using Microsoft Managed Keys for Azure Blobs, Tables, Files and Queues.
