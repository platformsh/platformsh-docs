---
title: "SCA"
sidebar-title: "SCA"
alt-title: "Strong Customer Authentication (SCA)"
weight: 2
toc: false
description: |
  In accordance with Article 14(1) of the [Commission Delegated Regulation (EU) 2018/389](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32018R0389), Platform.sh has implemented strong customer authentication (SCA) for customers using payment methods from the EU.
---

{{< description >}}

The article states:

> Payment service providers shall apply strong customer authentication when a payer creates, amends, or initiates for the first time, a series of recurring transactions with the same amount and with the same payee.

SCA is part of the [Revised Payment Services Directive](https://ec.europa.eu/info/law/payment-services-psd-2-directive-eu-2015-2366_en), acting as a regulatory requirement to reduce fraud and to make online transactions more secure.

The law went into effect September 14, 2019, and European card holders have been required since October 1, 2019 to authenticate recurring payments with their payment institutions.

If you set up a payment method prior to October 1, 2019 and have *not* added authentication, you see a warning in the management console to update your payment settings.

![SCA post-change warning](/images/sca/sca-postchange.png)

There is a grace period in the first few weeks following the change, but when that period has ended projects that have not set up payment authentication through the console will be suspended, so it is important for you to do so as soon as possible.
