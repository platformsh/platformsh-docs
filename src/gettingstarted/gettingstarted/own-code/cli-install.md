---
title: "Install the CLI"
weight: 3
toc: false
---

In the previous steps you checked that the requirements on your computer were met and configured an SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.

{{< asciinema src="videos/asciinema/verify-cli-extended.cast" >}}

1. **Install the CLI**

    In your terminal run the following command depending on your operating system:

    * **Installing on OSX or Linux**

       ```bash
       curl -sS https://platform.sh/cli/installer | php
       ```

    * **Installing on Windows**

       ```bash
       curl https://platform.sh/cli/installer -o cli-installer.php
       php cli-installer.php
       ```

2. **Authenticate and Verify**

   Once the installation has completed, you can run the CLI in your terminal with the command

   ```bash
   platform
   ```

   Take a moment to view some of the available commands with the command

   ```bash
   platform list
   ```

Now that you have installed the CLI and it is communicating with Platform.sh, you can configure and push your project to Platform.sh.

{{< guide-buttons next="I've installed the CLI" >}}
