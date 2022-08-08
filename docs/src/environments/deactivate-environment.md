---
title: Deactivate an environment
description: See how to deactivate environments you aren't using.
---

If you have environments you aren't using, you may want to deactivate them to save resources for what you need.
To deactivate an environment, you need to be an admin for the project or the given environment.

{{< note >}}

Your default environment is protected.
It can't be deactivated through the Console or the CLI.
To change which environment is the default, see how to [rename the default branch](./default-environment.md).

{{< /note >}}

Deactivating the project results in the following:

* The environment becomes [inactive](../other/glossary.md#inactive-environment).
  Unless it's reactivated, it's no longer deployed and isn't accessible from the web or via SSH.
* All services running on this environment are deleted.
* All data specific to the environment is deleted.
  If the environment is reactivated, it syncs data from its parent environment.

## Deactivate an environment

To deactivate an environment, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project with an environment you want to deactivate.</li>
  <li>From the <strong>Environment</strong> menu, select the environment.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with <strong>Status</strong>, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Select the checkbox to show you understand the consequences.</li>
  <li>Click <strong>Deactivate & Delete Data</strong>.</li>
  <li>Confirm your choice.</li>
</ol>

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform environment:deactivate <ENVIRONMENT_NAME>
```

{{< /codetabs >}}

## Delete the branch

Inactive environments still have branches in Git.
To delete the branch entirely, run the following command:

```bash
git push origin --delete <BRANCH_NAME>
```

## Reactivate an environment

Reactivating an environment [syncs](../other/glossary.md#sync) data from its parent environment.

To reactivate an inactive environment, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project with an environment you want to reactivate.</li>
  <li>From the <strong>Environment</strong> menu, select the environment.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with <strong>Status</strong>, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Click <strong>Activate</strong>.</li>
</ol>

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform environment:activate <ENVIRONMENT_NAME>
```

{{< /codetabs >}}
