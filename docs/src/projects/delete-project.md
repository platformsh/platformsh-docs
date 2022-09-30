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

- On the tile of the project you want to delete, click **{{< icon more >}} More**.
- Click **Edit plan**.
- Click **Delete project**.
- To confirm your choice, enter the project's name.
- Click **Yes, Delete Project**.

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
