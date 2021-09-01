---
title: "Install the CLI"
weight: 3
toc: false
aliases:
  - "/gettingstarted/own-code/cli-install.html"
---

In the previous steps, you checked that the requirements on your computer were met and configured an SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.

{{< asciinema src="videos/asciinema/verify-cli-extended.cast" >}}

1. **Install the CLI**

    In your terminal, run the following command depending on your operating system:

{{< codetabs >}}
---
title=Linux/macOS
file=none
highlight=bash
markdownify=false
---

curl -fsS https://platform.sh/cli/installer | php

<--->

---
title=Windows
file=none
highlight=bash
markdownify=false
---

curl -f https://platform.sh/cli/installer -o cli-installer.php
php cli-installer.php
{{< /codetabs >}}

2. **Authenticate and verify**

   Once the installation has completed, run the CLI in your terminal with the command:

   ```bash
   platform
   ```

   Log in using a browser. Then take a moment to view some of the available commands with the command:

   ```bash
   platform list
   ```

Now that you have installed the CLI and it is communicating with Platform.sh, you can configure and push your project to Platform.sh.

{{< guide-buttons next="I've installed the CLI" >}}
