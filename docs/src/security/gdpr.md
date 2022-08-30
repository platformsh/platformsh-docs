---
title: GDPR overview
sidebarTitle: GDPR
toc: false
description: |
  Platform.sh has taken numerous steps to ensure GDPR compliance.
---

Platform.sh has taken numerous steps to ensure compliance with the General Data Protection Regulation (GDPR).

## Measures

As part of our measures, we have implemented the following:

* **Data Protection Officer**: Appointment of a Security Officer who also holds the Data Protection Officer (DPO) role.
* **Data Breach Policy**: We updated our data breach policy and procedures
  and confirmed that all of our suppliers are compliant with breach notification requirements.
* **Consent**: We confirmed that all of our customer communication, both business and marketing-related, is opt-in,
  and we do not collect customers' information without their consent.
* **Data Governance**: All vendors undergo a compliance review and a security review.
  We utilize Data Processing Agreements (DPAs) and Standard Contractual Clauses (SCCs) with all vendors that process personal data.
  We do not use Privacy Shield.
* **Data Protection by design**: We implemented company policies to ensure that all of our employees receive the necessary compliance training
  and follow proper protocols regarding security.
  Further, privacy and data protection implications are assessed at the start of every new project. 
* **Enhanced Rights**: The GDPR provides rights to individuals such as the right to portability, the right to rectification, and the right to be forgotten.
  We comply with these individual rights.
  Nearly all information can be edited through a user's account,
  and we can delete accounts upon request.
* **Personally identifiable information (PII)**: We audited our systems to confirm that your personal data is encrypted and protected. 
* **Data Flows**: We identified and classified data, and created a high-level data flow diagram that maps out data shared with vendors,
  including cross-border transfers.
* **Privacy Impact Assessment (PIA)**: We perform internal PIAs to ensure that we comply with GDPR principles and obligations.
* **Security**: We created [https://platform.sh/security](https://platform.sh/security) to document our security features.
* **Data Collection**: We documented information about [what data we collect](/security/data-collection.md).
* **Data Retention**: We documented information about our [data retention](/security/data-retention.md) practices.
* **Data Processing Agreement (DPA)**: We revised our [Terms of Service](https://platform.sh/tos) and [Privacy Policy](https://platform.sh/privacy-policy)
  to align with the GDPR,
  and we offer an [EU DPA](https://platform.sh/dpa/) that automatically becomes part of your agreement
  if you are in the EU or a country with EU adequacy and sign our Terms of Service.
  We also execute the most recent version of the Standard Contractual Clauses released by the EU Commission with our non-EU vendors. 
* **Audits:** We undergo a yearly third-party audit of our privacy practices which includes GDPR.

## Controller vs Processor

### Overview

Under Article 7 of the GDPR, a Controller is defined as a body that "determines the purposes and means of the processing of personal data."
A Processor is defined as a body that "processes personal data on behalf of the controller."

### Platform.sh roles under the GDPR

In technical terms, Platform.sh operates a:

* Infrastructure Control Plane: This is Platform.sh’s orchestration, control, and management environment.
* Customer Data Plane: This is the customer's data app and project environment.

With respect to the GDPR, Platform.sh is both a Controller and Processor:

* We are a *Controller* for the overall PaaS service and in particular when we have a direct relationship
  with data subjects (our customers) who are explicitly the users of our services.
  Further, because the minimal personal data we collect comes from our direct customers in our account systems,
  we also act as the Controller for our Infrastructure Control Plane
  when we use this information to establish and operate regions, provision services, networks, and so on.
  Our Infrastructure Control Plane is unique to our service and cannot be modified by our customers.
  The one exception to this situation is that incoming connections transit this infrastructure
  from the internet to our customers' cardholder data environment,
  which may hold IP addresses and unencrypted URLs.
* We are a *Processor* for the customers' project environment
  * **Note:** While we provide the project environment to the customer (Controller) and store the data that the customer puts on their environment,
  we do not know whether this includes personal data as defined by the GDPR
  nor are we responsible for the Controller's obligations as it relates to the collection of such personal data.
  We operate under the assumption that the Controller's project environment includes personal data
  and possibly even sensitive personal data
  and we treat the environment accordingly,
  such as applying appropriate security and data protection safeguards that are audited by third-party auditors.

GDPR Data Processing Agreements (DPAs) executed with our customers apply to our processing activities
related to the Customer Data Plane when we are acting as a Processor.
A description of how we process personal data as Processor can be found in the Annexes of our [EU DPA](https://platform.sh/dpa/).

### Description of processing (PSH as a Controller)

Because Platform.sh also functions as a Controller as described above,
we have added details here to explain how we may process personal data as a Controller:

Categories of data subjects whose personal data is processed:

* Personnel of the controller who uses our services

Categories of personal data processed:

* The names, emails addresses, and other contact details of the controller's personnel
  with whom we need to liaise in the provision of the services.
* Platform.sh may also collect the following data elements from the controller's personnel:
  (a) names; (b) addresses; (c) countries; (d) email addresses, (e) telephone numbers;
  (f) financial data relating to orders; (g) IP Addresses; and (h) log files;
  as may be necessary to perform the services and/or bill for such services.

Sensitive data processed (if applicable) and applied restrictions or safeguards:

* When we are hosting a marketing conference or event,
  we may collect health information regarding attendees' specific dietary or disability needs.
* **Note:** This request for information is optional and is only used for the purpose of providing accommodations to our attendees.
  Attendees will be asked to provide explicit consent for the utilization of their health information and can revoke consent at any time.

Nature of the processing:

* Collection of personal data
* Use of personal data
* Consultation of personal data
* Recording of personal data
* Organization of personal data
* Structuring of personal data
* Conservation of personal data
* Erasure of personal data
* Destruction of personal data
* Storing of personal data

Purposes for which the personal data is processed:

* To collect customer information to provide PaaS services to the customer, for example when the customer signs up for an account.
* To liaise with customer personnel in the provisioning and deprovisioning of the PaaS services.
* To perform financial transactions relating to the services.
* To inform the customer of relevant offers where the customer has opted in and consented to such communications.
* To analyze certain usage data and/or patterns of the customer to enhance our PaaS services.
* To orchestrate, control, and manage the Infrastructure Control Plane.
* To respond to support requests from the customer.
* To comply with legal obligations.

Duration of the processing:

* Until expressly stopped by customer, or
* Until deletion of all customer data pursuant to termination of the customer's subscription to our services, whichever event occurs first.

### Subprocessors

Find the most up-to-date list at the [Trust Center](https://platform.sh/trust-center/).

We execute GDPR contracts with all third parties whose services we utilize if we are sending them EU personal information.
Specifically, we execute relevant Standard Contractual Clauses (SCCs)
to ensure compliance with obligations related to international transfers under the GDPR.
When Platform.sh acts as a Processor of our customer's data, we may use subprocessors to assist us with such processing,
such as backend hosting providers.

Similarly, when Platform.sh acts as a Controller of our customer's data, we may engage processors to help us with certain processing,
such as account management, marketing, or processing payments. 

For more information on when and with whom we execute DPAs or SCCs, see a [blog post on SCCs](https://platform.sh/blog/2022/platformsh-publishes-new-sccs).
