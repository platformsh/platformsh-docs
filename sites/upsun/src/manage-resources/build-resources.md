---
title: Project build resources
description: Configure project build resources on {{% vendor/name %}}.
weight: -50
---

When you push changes through Git, your applications are first built, then deployed.

During the build process, {{% vendor/name %}} creates a build image for each of your application, as a dedicated build container, and runs your build hooks inside that build container.
The duration of the build process is directly linked to the amount of resources (CPU and RAM) allocated to that build container.

Every {{% vendor/name %}} project includes a fixed amount of build resources per month:

- 2.5 hours of build CPU
- 5 hours of build memory

You can adjust the amount of build resources that a project can use.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your project.
2. Access the **project settings**.
3. Expand the Project Setting accordion and click **Resources**.
4. Enter the amount of CPU and RAM that your build containers can use.
5. Click **Save**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:
   
   ```bash
   {{% vendor/cli %}} resources:build:set
   ```
2. Enter the amount of CPU.
3. Enter the amount of RAM.


{{< /codetabs >}}

Additional build resources (CPU and RAM) are billed by the hour. 
For more information on the costs incurred, see the [{{% vendor/name %}} pricing page](https://upsun.com/pricing/).

{{% note %}}

Make sure that your build process supports using extra build resources.
Otherwise, the duration of your builds will remain the same despite adding more resources.

{{% /note %}}
