# Getting Started with the Platform.sh CLI

## Install the Platform.sh CLI

In the previous steps you checked your requirements on your computer and configured and SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.

1. **Installing on OSX or Linux**

   ```bash
   curl -sS https://platform.sh/cli/installer | php
   ```
   
2. **Installing on Windows**

   ```bash
   curl https://platform.sh/cli/installer -o cli-installer.php
   php cli-installer.php
   ```
   
3. **Authenticate and Verify**

   Once the installation has completed, you can run the CLI in your terminal with the command `platform`.
   
   You can take a quick glance at some of the commands available with the CLI by typing
   
   ```bash
   platform list
   ```
   
   Lastly, to make sure your SSH key is configured correctly, type the command
   
      ```bash
   platform project:list
   ```
   
   You should now be able to see a list of your Platform.sh projects, which includes the template you made in the previous guide.
   
   {% asciinema_local %}/scripts/asciinema/recordings/list.json{% endasciinema_local %}

   
   
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
