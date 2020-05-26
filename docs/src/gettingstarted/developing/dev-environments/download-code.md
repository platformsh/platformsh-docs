---
title: "Download the code"
weight: 1
toc: false
aliases:
  - "/gettingstarted/dev-environments/download-code.html"
---

If you have already [pushed your code]({{< relref "/gettingstarted/gettingstarted/own-code/_index.md" >}}) to Platform.sh, then you should already have a local repository that you can build from.

Otherwise, it will be necessary to download a local copy of your project first.

{{< asciinema src="videos/asciinema/local-copy.cast" >}}

1. **Get project ID**

    You will need the your *project ID*. You can retrieve this ID at any time using the CLI commands `platform` or `platform project:list`.

2. **Get a copy of the repository locally**

    Next, use the CLI to download the code in your Platform.sh project using the command

    ```bash
    platform get <project id>
    ```

Now that you have a local copy of your application that is configured to the Platform.sh remote repository, you can create a new .

{{< guide-buttons next="I have a local copy of my code" >}}
