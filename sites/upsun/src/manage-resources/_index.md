---
title: Manage resources
description: Configure resources per environment for each of your apps and services.
weight: -100
keywords:
  - "resources"
  - "flexible resources"
  - "CPU"
  - "RAM"
  - "disk storage"
  - "horizontal scaling"
  - "vertical scaling"
  - "scaling"
---

{{% vendor/name %}} allows you to configure resources (CPU, RAM, and disk) per environment for each of your apps and services.
You can also add instances for each of your apps depending on your needs.

For information on costs related to resource usage, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

## How resources work on Upsun

Projects on Upsun run on shared Grid hosts, which means the processing power allocated to your containers can be dependent on resources other customers are using on the same Grid hosts. Our orchestration layer works to ensure stable access to resources when possible, however some variability should be expected due to the shared infrastructure of our Grid regions.

{{< note theme="info" >}}

 It should be noted that projects are always kept **strictly isolated** from each other. 

{{< /note >}}
