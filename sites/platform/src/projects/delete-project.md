---
title: Delete a project
description: See how to delete projects you no longer need.
---

To delete a project, you must be an organization owner or have the [manage plans permission](../administration/users.md#organization-permissions).

To delete a {{% vendor/name %}} project, including all data, code, and active environments:

{{< codetabs >}}

+++
title=In the Console
+++

- On the tile of the project you want to delete, click **{{< icon more >}} More**.
- Click **Edit plan**.
- Click **Delete project**.
- To confirm your choice, enter the project's name.
- Click **Yes, Delete Project**.

<--->
+++
title=Using the CLI
+++

1. Run the following command:

   ```bash
   {{% vendor/cli %}} project:delete --project {{< variable "PROJECT_ID" >}}
   ```

2. Read the consequences to deletion and enter `y`.
3. Enter the project title to confirm.

{{< /codetabs >}}

You are billed only for the portion of a month when the project was active.

When you remove all your projects from your user account,
you stop being charged.