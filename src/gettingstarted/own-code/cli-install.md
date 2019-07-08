# Import your own code

## Install the CLI

In the previous steps you checked that the requirements on your computer were met and configured an SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.

<asciinema-player src="/videos/asciinema/verify-cli-extended.cast" preload=1></asciinema-player>

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

<div class="buttons">
  <a href="#" class="prev-link button-link">Back</a>
  <a href="#" class="next-link button-link">I have installed the CLI</a>
</div>
