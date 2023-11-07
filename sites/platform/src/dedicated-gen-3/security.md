---
title: "Security and data privacy"
weight: 3
description: Learn how security and data privacy are handled on {{% names/dedicated-gen-3 %}} projects.
---

{{% vendor/name %}} is committed to protecting your data and keeping your site safe, secure, and available at all times.
All Dedicated projects are isolated and their data is fully encrypted.

Should a security breach occur, {{% vendor/name %}} follows a strict [security incident handling procedure](#security-incident-handling-procedure)
to deal with the issue as promptly and efficiently as possible.

{{% project-isolation plan="true" %}}

## Security incident handling procedure

Should {{% vendor/name %}} become aware of a security incident &mdash; such as an active or past hacking attempt, virus or worm, or data breach &mdash;
senior personnel, including the CTO, are promptly notified.

The security incident procedure includes the following steps:

1. Isolating the affected systems.
2. Collecting forensic evidence for later analysis, including a byte-for-byte copy of the affected systems.
3. Restoring normal operations.

Once normal service is restored, a root cause analysis is performed to determine exactly what happened.
Upon request, {{% vendor/name %}} can provide you with a Reason for Outage report that summarizes the incident, cause, and steps taken.

{{% vendor/name %}} cooperates with relevant law enforcement,
and informs law enforcement in the event of an attempted malicious intrusion.
Depending on the type of incident, the root cause analysis may be conducted by law enforcement rather than {{% vendor/name %}} personnel.

{{% vendor/name %}} endeavors to notify affected customers within 24 hours in case of a personal data breach
and 72 hours in case of a project data breach.

<!-- vale Vale.Spelling = NO -->
<!-- Spelling off because of the French-->
Under the European General Data Protection Regulation (GPDR),
{{% vendor/name %}} is required to notify its supervising authority within 72 hours of a discovered breach
that may result in risk to the rights and freedoms of individuals.
The supervising authority for {{% vendor/name %}} is the French [Commission Nationale de l'Informatique et des Libertés](https://www.cnil.fr/).
<!-- vale Vale.Spelling = YES -->

### Audit trail

As part of the security incident process, {{% vendor/name %}} records a log of all steps taken to identify,
isolate, and respond to the incident.
This log may include:

- A byte-for-byte copy of the affected systems
- How the intrusion was detected
- The steps taken to contain the intrusion
- Any contact with third parties, including law enforcement
- Any conclusions reached regarding the root cause

## Encryption

### AWS

AWS EBS Volumes are encrypted on {{% vendor/name %}},
which means {{% names/dedicated-gen-3 %}} and {{% names/dedicated-gen-2 %}} sites are fully encrypted.
Keys are managed by the AWS Key Management Service.
AWS automatically rotates these keys every three years.
In some cases, temporary storage (such as swap) is stored on unencrypted local storage volumes.

### Azure

By default, data is encrypted using [Microsoft-Managed Keys](https://learn.microsoft.com/en-us/compliance/assurance/assurance-encryption)
for Azure Blobs, Tables, Files, and Queues.

### GCP

Data is encrypted using [default encryption at rest](https://cloud.google.com/docs/security/encryption/default-encryption?hl=en).