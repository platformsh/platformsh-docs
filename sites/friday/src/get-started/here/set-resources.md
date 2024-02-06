---
title: Managing resources
sidebarTitle: Resources
weight: 40
description: Flexible resources on {{% vendor/name %}} are easy to use. Find all you need to know about resources allocation there.
---

To define allocated resources to your services and apps, you need to define how much CPU, memory, and disk to assign to the various containers.
Back in your terminal, run:

```bash {location="Terminal"}
{{% vendor/cli %}} resources:set
```

This will launch an interactive prompt to walk you through setting up your application's resources:
```bash {location="Terminal"}
{{% vendor/cli %}} resources:set
Resource configuration for the project app (123456azerty), environment main (type: production):
+-----------------------+---------+---------+-------------+-----------+-----------+
| App or service        | Size    | CPU     | Memory (MB) | Disk (MB) | Instances |
+-----------------------+---------+---------+-------------+-----------+-----------+
| app                   | not set | not set | not set     | N/A       | 1         |
| [<additional-service>]| not set | not set | not set     | not set   | 1         |
+-----------------------+---------+---------+-------------+-----------+-----------+
```
The first question is what profile size you want applied to your application image. For now let's select the minimum `0.1`:
```bash {location="Terminal"}
App: app
Choose a profile size:
  [0.1 ] CPU 0.1, memory 64 MB
  [0.25] CPU 0.25, memory 128 MB
  [0.5 ] CPU 0.5, memory 224 MB
  [1   ] CPU 1, memory 384 MB
  [2   ] CPU 2, memory 704 MB
  [4   ] CPU 4, memory 1216 MB
  [6   ] CPU 6, memory 1728 MB
  [8   ] CPU 8, memory 2240 MB
  [10  ] CPU 10, memory 2688 MB
 > 0.1
```
Next it will ask how many instances of our application container we need deployed. For now let's go with `1`:
```bash {location="Terminal"}
Enter the number of instances (default: 1): 1
```

Last it will ask us to confirm our choices. Select `Y` and {{% vendor/name %}} will take your selections, grab the
previous built images from earlier, apply your resource selections to them and deploy your full application!

{{< guide-buttons previous="Back" next="Revisions" type="*" >}}

