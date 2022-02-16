---
title: "HIPAA compliance"
sidebarTitle: "HIPAA"
weight: 17
description: |
    Platform.sh HIPAA Compliance
---

Please refer to our [Compliance Guidance](https://docs.platform.sh/security/compliance-guidance.html) page for an overview of our compliance program, including security & compensating controls, and a general allocation of responsibility.

## Overview

Platform.sh provides a Platform as a Service (PaaS) solution that our customers may use for applications requiring HIPAA compliance. All HIPAA workloads will run on the US-4 region.

Platform.sh has SOC 2 Type 2 and PCI certifications. As a part of those third-party audits, we have been audited on overlapping HIPAA controls. Independent third-party audits provide an external examination of the controls we have implemented on our infrastructure and operations and ensure Platform.sh’s commitment to complying with information security standards and industry best practices.

**Please note that there is no certification recognized by the US Department of Health & Human Services for HIPAA compliance. Thus, complying with HIPAA is a shared responsibility between the customer and Platform.sh.**

## Responsibility

Covered Entities who want to run healthcare workloads on Platform.sh must agree to the following:

* The Covered Entity must sign up for our Dedicated offering or Grid offering, with Grid being part of a bundled plan.
* The Covered Entity must sign a Business Associate Agreement with Platform.sh.
* The Covered Entity implements the relevant controls contained in the [Platform.sh HIPAA Shared Responsibility Matrix](https://docs.google.com/spreadsheets/d/1Wsve74Bn8ljfE2vJbN1g8vZA4Jd5_lokmZxgUPcJ98k/edit?usp=sharing) (Excel). This document provides guidance on shared responsibilities required to achieve HIPAA compliance. 
* The Covered Entity is solely responsible for any of its applications' security.
* The Covered entity must run HIPAA workloads on the HIPAA designated region and is responsible for managing access to all environments that are included in the HIPAA designated region.
* The Covered Entity uses [Fastly WAF](https://docs.fastly.com/products/hipaa-compliant-caching-and-delivery) or a Platform.sh-approved equivalent HIPAA-complaint WAF. 
* The Covered Entity will perform, at a minimum on an annual basis, penetration testing and vulnerability scanning against their projects in accordance with industry standards, and will remediate findings in an expedited manner.
* The Covered Entity will [redeploy applications](https://docs.platform.sh/security/updates.html) regularly to be able to pick up patches.

While Platform.sh provides a secure and compliant infrastructure for processing of PHI, the customer is responsible for ensuring that the environment and applications that they host on Platform.sh are properly configured and secured according to HIPAA requirements. Failure to do so results in a non-compliant customer environment.

Covered Entities can contact their Platform Account Manager to request a Business Associate Agreement or for more information regarding HIPAA compliance.
