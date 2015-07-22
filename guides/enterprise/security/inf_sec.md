# Information Security Policy

## Audit collection bastion
We store audit trail data on a dedicated infrastructure, separate from all the production accounts and only accessible by Platform.sh's top management.
It consists of:
+ A separate AWS account (in consolidated billing without our main billing account, but otherwise completely separate from any other AWS account we manage);
+ A versioned, write-only S3 bucket that is used to collect AWS CloudTrail data;
+ A set of instances running the OSSEC management daemons.

The OSSEC instances are specifically hardened:
+ They run the minimal set of services;
+ They are configured to auto-update;
+ They are protected by a very restrictive inbound and outbound firewall configuration, which is relaxed on demand to specific IP addresses when SSH access by one of the administrator is required;
+ Administrators of these instances are using SSH keys dedicated for that purpose, stored encrypted on their computer;
+ The data volume of those hosts are encrypted, using EBS encryption, and are snapshotted every hour, with a retention of a month.

## Change detection
Infrastructure change detection: All the infrastructure changes are audited via AWS CloudTrail.

## File integry check
We use the OSSEC agent to perform integrity checks of all the base operating system files and our management fabric.
The integrity of applications hosted on our platform is controlled

## Application integrity check
The integrity of the code of the application hosted on our platform is guaranteed through:
The integrity of the source file stored in Git;
The integrity of the build process through its repeatability;
The integrity of the application runtime and of the application code, both mounted read-only.

## Audit trail collection
Audit trail of cloud activity
We collect the audit trail of all the API activity on all our production accounts using AWS CloudTrail. The data is stored in a versioned, write-only S3 bucket belonging to the audit infrastructure account.
For more information: http://aws.amazon.com/cloudtrail/

## Audit trail of security event on hosts
We use the OSSEC agent to collect security event on each hosts, and forward them to the OSSEC bastion instances for storage and analysis.

## Information Security Manager
Platform.sh’ Information Security Manager is Robert Douglass. 

## Incident Response Plan
Platform.sh will provide a working draft to Enterprise prospects and customers [upon request](mailto:sales@platform.sh).
