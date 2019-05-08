<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
  <script src="/asciinema/asciinema-player.js"></script>
</head>
</html>

# Start with a template

## Next Steps: Installing the Platform.sh CLI

With all of the requirements met, install the CLI to start developing with Platform.sh.

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

    {% asciinema_local %}/asciinema/recordings/verify-cli-extended.cast{% endasciinema_local %}
   
   You should now be able to see a list of your Platform.sh projects, including the template you made in this guide.
   
   Take a minute to explore some of the commands available with the CLI by using the command `platform list`.
   
That's it! Now that you have the management console set up and the CLI installed on your computer, you're well on your way to exploring all of the ways that Platform.sh can improve your development workflow.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/template/cli-requirements.html" class="buttongen small">Back</a>
<a href="/gettingstarted/template/next-steps.html" class="buttongen small">I have installed the CLI and want to know more</a>

</center>

<br/><br/>

</body>
</html>
