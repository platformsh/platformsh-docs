# Getting Started with the Platform.sh CLI

## Install the Platform.sh CLI

In the previous steps you checked your requirements on your computer and configured and SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.


1. **Install the CLI**

    In your terminal run the following command:

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

    <html>
    <head>
      <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
      <script src="/asciinema/asciinema-player.js"></script>
    </head>
    <body>
    
      <asciinema-player src="/asciinema/recordings/verify-cli.cast"></asciinema-player>
    
    </body>
    </html>

   
   
Now that you have installed the CLI and it is communicating with Platform.sh, we can create projects from here just like in the management console before.

   
   
<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/next-steps/cli/step-2.html" class="buttongen small">Back</a>
<a href="/gettingstarted/next-steps/cli/step-4.html" class="buttongen small">I have installed the Platform.sh CLI</a>

</center>

<br/><br/>

</body>
</html>
