---
title: Delete a project
description: See how to delete projects you no longer need.
aliases:
  - /administration/web/delete.html
---

To delete a project, you must be an organization owner or have the [manage plans permission](../administration/organizations.md#manage-your-organization-users)

To delete a Platform.sh project, including all data, code, and active environments:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>On the tile of the project you want to delete, click {{< icon more >}}</strong>More</strong>.</li>
  <li>Click <strong>Edit plan</strong>.</li>
  <li>Click <strong>Delete project</strong>.</li>
  <li>To confirm your choice, enter the project's name.</li>
  <li>Click <strong>Yes, Delete Project</strong>.</li>
</ol>

<--->
---
title=Using the CLI
file=none
highlight=false
---

1. Run the following command:

   ```bash
   platform project:delete --project <PROJECT_ID>
   ```

2. Read the consequences to deletion and enter `y`.
3. Enter the project title to confirm.

{{< /codetabs >}}

You are billed only for the portion of a month when the project was active.
A user account with no projects has no charges.
