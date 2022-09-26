---
title: Compliance guidance and shared responsibilities
---

## Overview

Platform.sh provides a Platform as a Service (PaaS) solution and has many customers that require us to maintain various certifications.
These certifications contain requirements to ensure certain measures are implemented to meet industry standards.
Some requirements are the responsibility of the host, some are the responsibility of the application developer,
and others are a shared responsibility.

Basic compliance questions can be handled by our support team via a ticket.
For more advanced questions, including help with an audit, please contact your Platform.sh Account Manager.


## Security & Compensating Controls

* For a list of security measures, please see our [Security page](https://platform.sh/security).
* Customer environments are deployed in a read-only instance, segregated with GRE tunnels and encrypted using TLS,
  which often permits compensating controls to be claimed for several PCI requirements.
* Because customers can use our PaaS in a variety of ways,
  the best approach with auditors is to focus on "What do I (the customer) control/configure, and how is it managed in a compliant manner?"
* The `FR-1` and `FR-3` regions are excluded from our PCI and SOC2 certifications.
* HIPAA workloads are strictly run on our `US-4` region.

## Responsibility

Platform.sh and customers often have shared responsibility for ensuring an up-to-date and secure environment.
The customer is responsible for achieving and maintaining their own certifications and compliance.

The following is a general allocation of responsibilities between Platform.sh and the customer.
For more guidance on responsibility for specific certification requirements,
refer to the relevant documentation (such as PCI Compliance) to access the relevant shared responsibility matrix.

Platform.sh is responsible for:

* **Physical and Environmental controls**:
  We use third-party hosting and thus these requirements are passed through to those providers (such as AWS).
* **Patch Management**:
  Platform.sh is responsible for patching and fixing underlying system software, management software, and environment images.
* **Configuration Management**:
  Platform.sh maintains the configuration of its infrastructure and devices.
* **Awareness and Training**:
  Platform.sh trains its own employees in secure software development and management.
* **Capacity Management**:
  Platform.sh is responsible for capacity management of the infrastructure, such as server allocation and bandwidth management.
* **Access Control**:
  Platform.sh is responsible for providing access control mechanisms to customers and for vetting all Platform.sh personnel access.
* **Backups**:
  Platform.sh is responsible for backing up the infrastructure and management components of the system.
  On {{% names/dedicated-gen-2 %}}, Platform.sh also backs up application code and databases on behalf of customers.

Customers are responsible for:

* **Patch Management**:
  Customers are responsible for maintaining and patching application code uploaded to Platform.sh, either written by them or by a third-party.
* **Configuration Management**:
  Customers are responsible for the secure configuration of their application, including Platform.sh configuration and routes managed through YAML files.
* **Awareness and Training**:
  Customers are responsible for training their own employees and users on secure software practices.
* **Capacity Management**:
  Customers are responsible for ensuring their application containers have sufficient resources for their selected tasks.
* **Access Control**:
  Customers are responsible for effectively leveraging available access control mechanisms, including proper access control settings, secrets management, SSH key management, and the use of two-factor authentication.
* **Backups**:
  On Platform.sh, Professional customers are responsible for all application and database backups.
