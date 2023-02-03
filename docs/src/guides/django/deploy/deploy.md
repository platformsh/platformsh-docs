---
title: "Deploy Django"
sidebarTitle: "Deploy"
weight: -80
description: |
    Now that your site is ready, push it to Platform.sh and import your data.
---

## Deployment

{{< guides/deployment >}}

{{% guides/data-migration %}}

{{% /guides/data-migration %}}

{{< note >}}
The example Django application used in this guide can be migrated solely by importing data into the database. 
Other forms of data within mounts - user uploads, for example - also need to be migrated in the way described above. 
Consult the [mounts](/create-apps/app-reference#mounts) documentation to view the syntax for defining directories that retain write access at runtime, then follow the commands above to upload that data to them.
{{< /note >}}

Go forth and Deploy (even on Friday)!

{{< guide-buttons next="More resources" >}}
