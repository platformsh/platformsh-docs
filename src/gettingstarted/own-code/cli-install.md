# Import your own code

## Install the CLI

In the previous steps you checked that the requirements on your computer were met and configured an SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.

<asciinema-player src="/scripts/asciinema/recordings/verify-cli-extended.cast" preload=1 autoplay=1 loop=1></asciinema-player>

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
   
Now that you have installed the CLI and it is communicating with Platform.sh, you can configure and push your project to Platform.sh.

<div id = "buttons"></div>

<script>
    var navNextText = "I have installed the Platform.sh CLI";
    var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
    makeButton(navButtons);
</script>
