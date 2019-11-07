# Security & Data privacy

## Updates &amp; upgrades

Platform.sh updates the core software of the Enterprise Cluster (operating system, web server, PHP, MySQL, etc.) periodically, and after any significant security vulnerability is disclosed.  These updates are deployed automatically with no additional work required by the user.  We attempt to maintain parity with your development environment, but we do not guarantee absolute parity of point versions of your Enterprise environments with their corresponding development environments.  I.e, your development environment may have a php container running 5.6.30, but your production environment may lag behind at 5.6.22.  We can upgrade point releases on request and will always upgrade the underlying software in the event of security release.

Updates to application software (PHP code, Javascript, etc.) are the responsibility of the customer.

## Project isolation

All Enterprise Clusters are single-tenant.  The three VMs are exclusively used by a single customer and each Enterprise cluster is launched into its own isolated network (VPC on AWS, equivalent on other providers).  The network is firewalled to incoming connections; only ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 2221 (SFTP) are opened to incoming traffic.  There are **no exceptions** for this rule, so any incoming web service requests, ETL jobs, or otherwise will need to transact over one of these protocols.

Outgoing TCP traffic is not firewalled.  Outgoing UDP traffic is disallowed.

The Development Environment deploys each branch as a series of containers hosted on a shared underlying VM.  Many customers will generally share the same VM.  However, all containers are whitelisted to connect only to other containers in their same environment, and even then only if an explicit "relationship" has been defined by the user via configuration file.

## Security incident handling procedure

Should Platform.sh become aware of a security incident &mdash; such as an active or past hacking attempt, virus or worm, or data breach &mdash; senior personnel including the CTO will be promptly notified.  

Our security incident procedures include isolating the affected systems, collecting forensic evidence for later analysis including a byte-for-byte copy of the affected system, and finally restoring normal operations. Once normal service is restored we perform a root cause analysis to determine exactly what happened.  A Reason for Outage report may be provided to the customer upon request that summarizes the incident, cause, and steps taken.

Platform.sh will cooperate with relevant law enforcement, and inform law enforcement in the event of an attempted malicious intrusion.  Depending on the type of incident the root cause analysis may be conducted by law enforcement rather than Platform.sh personnel.

Platform.sh will endeavor to notify affected customers within 24 hours in case of a personal data breach and 72 hours in case of a project data breach.

Under the European General Data Protection Regulation (GPDR), Platform.sh is required to notify our supervising authority within 72 hours of a discovered breach that may result in risk to the rights and freedoms of individuals.  Our supervising authority is the French [Commission Nationale de l'Informatique et des Libertés](https://www.cnil.fr/).

## Audit trail

As part of the security incident process we record a log of all steps taken to identify, isolate, and respond to the incident.  This log may include:

* A byte-for-byte copy of the affected systems
* How the intrusion was detected
* The steps taken to contain the intrusion
* Any contact with 3rd parties, including law enforcement
* Any conclusions reached regarding the root cause

## Encryption

### AWS

AWS EBS Volumes are encrypted on Platform.sh Enterprise sites are fully encrypted. Keys are managed by AWS’s KMS (Key Management Service). AWS automatically rotates these keys every three years. In some cases, temporary storage (eg swap) is stored on unencrypted local storage volumes.

### Azure

By default, data is encrypted using Microsoft Managed Keys for Azure Blobs, Tables, Files and Queues.

