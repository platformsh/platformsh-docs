---
title: "Download the code"
weight: 1
toc: false
aliases:
  - "/gettingstarted/local-development/download-code.html"
---


If you have already [pushed your code](/gettingstarted/introduction/own-code/_index.md) to Platform.sh, then you should already have a local repository that you can build from.

Otherwise, you need to download a local copy of your project first.

{{< asciinema src="videos/asciinema/local-copy.cast" >}}

1. **Get project ID**

    Retrieve the **ID** of your project, using the command:  `platform`.

2. **Get a copy of the repository locally**

    Next, use the CLI to download the code in your Platform.sh project using the command:

    ```bash
    platform get <PROJECT_ID>
    ```

Next you can now connect to its services and build it on your machine.

{{< guide-buttons next="I have a local copy of my code" >}}
