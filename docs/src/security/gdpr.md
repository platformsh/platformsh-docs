---
title: "GDPR Overview Page"
sidebarTitle: "GDPR"
weight: 1
toc: false
description: |
  Platform.sh has taken numerous steps to ensure GDPR compliance.
---

{{< description >}}

# Measures

As part of our measures we have implemented the following:

* **Data Protection Officer**: Appointment of a Security Officer who also holds the Data Protection Officer (DPO) role.
* **Data Breach Policy**: We updated our data breach policy and procedures, and confirmed that all of our suppliers are compliant with breach notification requirements.
* **Consent**: We confirmed that all of our customer communication, both business and marketing-related, is opt-in, and we do not collect customers' information without their consent.
* **Data Governance**: All vendors undergo a compliance review and a security review. We utilize DPAs and SCCs with all vendors that process Personal Data. We do not use Privacy Shield.
* **Data Protection by design**: We implemented company policies to ensure that all of our employees receive the necessary compliance training and follow proper protocols regarding security. Further, privacy and data protection implications are assessed at the start of every new project. 
* **Enhanced Rights**: The GDPR provides rights to individuals such as the right to portability, the right to rectification, and the right to be forgotten.  We comply with these individual rights. Nearly all information can be edited through a user's account, and we can delete accounts upon request.
* **Personally identifiable information (PII)**: We audited our systems to confirm that your personal data is encrypted and protected. 
* **Data Flows**: We identified and classified data, and created a high-level data flow diagram that maps out data shared with vendors, including cross-border transfers.
* **Privacy Impact Assessment (PIA)**: We perform internal PIAs to ensure that we comply with GDPR principles and obligations.
* **Security**: We created [https://platform.sh/security](https://platform.sh/security) to document our security features.
* **Data Collection**: We documented information about [what data we collect](/security/data-collection.md).
* **Data Retention**: We documented information about our [data retention](/security/data-retention.md) practices.
* **Data Processing Agreement (DPA)**: We revised our [Terms of Service](https://platform.sh/tos) and [Privacy Policy](https://platform.sh/privacy-policy) to align with the GDPR, and we offer a pre-signed DPA agreement that can be downloaded at the top of the [Privacy Policy](https://platform.sh/privacy-policy).
* **Audits:** We undergo a yearly third-party audit of our privacy practices which includes GDPR.



# Controller vs Processor

With respect to the EU GDPR, Platform.sh is both a Controller and Processor:

* We are a Controller for the overall service and in particular when we are in charge of data subjects who are explicitly the users of our services.
* We are a Processor for our customers (Controllers) that are in charge of data subjects that they have collected.

In technical terms, we operate a:

* Infrastructure Control Plane - This is Platform.sh’s orchestration, control, and management environment.
* Customer Data Plane - This the customer’s data app and data environment.

We are the Controller for the Infrastructure Control Plane (and our PaaS service). We are the Processor for the Customer Data Plane. 

GDPR Data Processing Agreements (DPAs) and EU Standard Contractual Clauses executed with our customers apply to our processing activities contained in the Customer Data Plane.
