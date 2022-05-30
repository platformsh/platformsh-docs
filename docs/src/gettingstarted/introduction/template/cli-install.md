---
title: "Install the CLI"
sidebarTitle: "Install the CLI"
actualTitleBreaksNavs: "Next Steps: Installing the Platform.sh CLI"
weight: 5
toc: false
aliases:
  - "/gettingstarted/template/cli-install.html"
---

With all of the requirements met, install the CLI to start developing with Platform.sh.

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


2. **Authenticate and Verify**

   Once the installation has completed, you can run the CLI in your terminal with the command

   ```bash
   platform
   ```

   {{< note >}}

   If you opened your free trial account using another login (such as GitHub),
   you can't authenticate with this command until you setup your account password with Platform.sh in the console.

   {{< /note >}}

   You should now see a list of your Platform.sh projects, including the template you made in this guide.
   You can copy its *project ID* hash, and then download a local copy of the repository with this command:

   ```bash
   platform get <project ID>
   ```

   With a local copy, you can create branches, commit to them, and push your changes to Platform.sh right away!

   ```bash
   git push platform main
   ```

   Take a minute to explore some of the commands available with the CLI using the command `platform list`.

That's it!
Now that you have the management console set up and the CLI installed on your computer,
you're well on your way to exploring all of the ways that Platform.sh can improve your development workflow.

{{< guide-buttons next="I've installed the CLI" >}}
