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

<!--This is in HTML to get the icon not to break the list. -->
<ol>
  <li>Select the project where you want to change the parent.</li>
  <li>From the <strong>Environment</strong> menu, select the environment you want to change.</li>
  <li>Click {{< icon settings >}} <strong>Settings</strong>.</li>
  <li>In the row with the environment's name, click <strong>Edit {{< icon chevron >}}</strong>.</li>
  <li>Select a <strong>Parent environment</strong>.</li>
  <li>Click <strong>Save</strong>.</li>
</ol>

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
