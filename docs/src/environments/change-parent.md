---
title: Change an environment's parent
sidebarTitle: Change parent
description: Learn how to change.a given environment's parent environment.
toc: false
---

All environments default to having another environment as their parent.
If you [branched](../other/glossary.md#branch) the environment from another,
its parent starts as the environment it was created from.
If you pushed a branch through Git or a [source integration](../integrations/source/_index.md),
the parent defaults to the default environment.

To change the environment's parent, follow these steps:

{{< codetabs >}}

---
title=In the Console
file=none
highlight=false
---

- Select the project where you want to change the parent.
- From the **Environment** menu, select the environment you want to change.
- Click {{< icon settings >}} **Settings**.
- In the row with the environment's name, click **Edit {{< icon chevron >}}**.
- Select a **Parent environment**.
- Click **Save**.

<--->
---
title=Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform environment:info -e <CHILD_ENVIRONMENT_NAME> parent <PARENT_ENVIRONMENT_NAME>
```

So if you have the environment `new-feature` and want to change its parent to `main`, run the following:

```bash
platform environment:info -e new-feature parent main
```

{{< /codetabs >}}
