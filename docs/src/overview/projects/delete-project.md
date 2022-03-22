---
title: Delete a project
description: See how to delete projects you no longer need.
toc: false
aliases:
  - /administration/web/delete.html
---

To delete a project, you must be an organization owner or have the [manage plans permission](../../administration/organizations.md#manage-your-organization-users)

To delete a Platform.sh project, including all data, code, and active environments:

{{< codetabs >}}

---
title=In the console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Open the <a href="https://console.platform.sh/">web console</a>.</li>
  <li>On the tile of the project you want to delete, click {{< icon more >}}</strong>More</strong>.</li>
  <li>Click <strong>Delete</strong>.</li>
  <li>To confirm your choice, click <strong>Delete</strong>.</li>
</ol>

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform project:delete --project <PROJECT_NAME>
```

{{< /codetabs >}}

You are billed only for the portion of a month when the project was active.
A user account with no projects has no charges.
