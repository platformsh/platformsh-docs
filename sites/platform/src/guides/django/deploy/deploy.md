---
title: "Deploy Django"
sidebarTitle: "Deploy"
weight: -80
description: |
    Now that your site is ready, push it to {{% vendor/name %}} and import your data.
---

{{% guides/deployment %}}

{{% guides/data-migration /%}}

{{< note >}}

The example Django app used in this guide can be migrated solely by importing data into the database.
Other forms of data, such as user uploads, also need to be migrated in the way described above.

To see how to define directories that are writable at runtime, see the [mounts reference](/create-apps/app-reference/single-runtime-image#mounts).
Then adjust the previous commands to upload files to them.

{{< /note >}}

Go forth and Deploy (even on Friday)!

{{< guide-buttons previous="Back" next="More resources" >}}
