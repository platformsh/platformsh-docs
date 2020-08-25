---
title: "Download the code"
weight: 1
toc: false
aliases:
  - "/gettingstarted/local-development/download-code.html"
---


If you have already [pushed your code]({{< relref "/gettingstarted/introduction/own-code/_index.md" >}}) to Platform.sh, then you should already have a local repository that you can build from.

Otherwise, it will be necessary to download a local copy of your project first.

{{< asciinema src="videos/asciinema/local-copy.cast" >}}

1. **Get project ID**

    You will need the your *project ID*. You can retrieve this ID at any time using the CLI command `platform`.

2. **Get a copy of the repository locally**

    Next, use the CLI to download the code in your Platform.sh project using the command

    ```bash
    platform get <project id>
    ```

Next you can now connect to its services and build it on your machine.

<div class="buttons">
  <a class="button-link prev" onclick="gitbook.navigation.goPrev()">Back</a>
  <a class="button-link next" onclick="gitbook.navigation.goNext()">I have a local copy of my code</a>
</div>

{{< guide-buttons next="I have a local copy of my code" >}}
