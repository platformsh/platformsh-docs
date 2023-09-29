---
title: Deploy the Flask application on {{% vendor/name %}}
sidebarTitle: "Deploy resources"
weight: -100
description: Steps required for deploying a configured Flask application to {{% vendor/name %}}.
---

Our application is now ready for us to push the changes to {{% vendor/name %}} and activate our initial environment:

```shell
{{% vendor/cli %}} environment:push
```

Answer `Y` to the question "Are you sure you want to push to the main (type: production) branch?"

{{% vendor/name %}} will now read your configuration files, and begin building your application image. **Your first push
will fail**; don't worry, this is expected. At this point {{% vendor/cli %}} is not aware of the resources
our application needs. We need to tell it what kind of CPU, Memory, and disk to assign to the various containers. Back
in your terminal, run:

```shell
{{% vendor/cli %}} resources:set
```

This will launch an interactive prompt to walk you through setting up your application's resources:

```shell
❯ {{% vendor/cli %}} resources:set
Resource configuration for the project my_flask_cookie (zh5v7xxqzetqm), environment main (type: production):
+-----------------------+---------+---------+-------------+-----------+-----------+
| App or service        | Size    | CPU     | Memory (MB) | Disk (MB) | Instances |
+-----------------------+---------+---------+-------------+-----------+-----------+
| my_flask_cookie       | not set | not set | not set     | N/A       | 1         |
| postgresql            | not set | not set | not set     | not set   | 1         |
+-----------------------+---------+---------+-------------+-----------+-----------+
```

The first question is what profile size you want applied to your application image. For now let's select `1`:
```shell
App: my_flask_cookie

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
 > 1
```
Next it will ask how many instances of our application container we need deployed. For now let's go with `1`:
```shell
Enter the number of instances (default: 1): 1
```

Since we have defined a mount in `{{< vendor/configfile "app" >}}`, the CLI will next ask us how much disk space we
want to reserve for the mount. For the purposes of this demo, I'll select `1024`MB:

```shell
Enter a disk size in MB: 1024
```

Now that we've defined the resources for our application container, the CLI will proceed through the same process for
each service we added previously. In this case, we just have our PostgreSQL service. Let's choose a profile size of `1`
for it as well:
```shell
Service: postgresql

Choose a profile size:
  [0.1 ] CPU 0.1, memory 448 MB
  [0.25] CPU 0.25, memory 832 MB
  [0.5 ] CPU 0.5, memory 1408 MB
  [1   ] CPU 1, memory 2432 MB
  [2   ] CPU 2, memory 4032 MB
  [4   ] CPU 4, memory 6720 MB
  [6   ] CPU 6, memory 9024 MB
  [8   ] CPU 8, memory 11200 MB
  [10  ] CPU 10, memory 13184 MB
 > 1
```
Since this is a database, it will need persistent disk storage in order to save our data. Each {{% vendor/name %}}
project starts with 5GB of data that is shared across all services. Let's go ahead and give our PostgreSQL service
2GB (`2048`MB):
```shell
Enter a disk size in MB: 2048
```
Last it will ask us to confirm our choices. Select `Y` and the {{% vendor/name %}} will take your selections, grab the
previous built images from early, apply our resource selections to them and deploy our full application!

{{< guide-buttons next="Handle migrations" >}}
