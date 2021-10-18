---
title: "PCI compliance"
sidebarTitle: "PCI"
weight: 18
description: |
    Platform.sh is PCI DSS certified.
---

Refer to our [Compliance Guidance](https://docs.platform.sh/security/compliance-guidance.html)
for an overview of our compliance program, including security & compensating controls, and a general allocation of responsibility.

## Overview

Payment Card Industry (PCI) Data Security Standards (DSS) is a set of network security and business best practice guidelines
that establish a "minimum security standard" to protect payment card information.
While Platform.sh doesn't handle credit cards, many of our customers do.

Platform.sh undergoes an annual third-party audit to maintain PCI DSS recertification.
Note that the FR-1 and FR-3 regions are excluded from our PCI certification.

{{< note >}}

Cardholder processing activity is discouraged.
Please use a third-party processor.

{{< /note >}}

## Responsibility

Customers who want to run PCI workloads on Platform.sh must agree to and implement
the measures contained in the [Platform.sh PCI Responsibility Matrix](https://docs.google.com/spreadsheets/d/1zLkHpdUoX1VNC3wTipl3g-Z4eHjou-57IrQxE8GH6oA/edit#gid=238986323) (Excel).
This document provides guidance on shared responsibilities to achieve PCI DSS compliance using PCI DSS 3.2 as a reference.

While Platform.sh provides a secure and PCI compliant infrastructure,
the customer is responsible for ensuring that the environment and applications that they host on Platform.sh
are properly configured and secured according to PCI requirements.
Failure to do so will result in a non-compliant customer environment.
