
# Import your own code

## Install the CLI

In the previous steps you checked that the requirements on your computer were met and configured an SSH key on your Platform.sh account. Now all we have to do is install the CLI and you can access your projects from the command line.

{% asciinema_local %}/scripts/asciinema/recordings/list.json{% endasciinema_local %}

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

   Once the installation has completed, you can run the CLI in your terminal with the command `platform`.
   
   You can take a quick glance at some of the commands available with the CLI by typing
   
   ```bash
   platform list
   ```
   
   Lastly, to make sure your SSH key is configured correctly, type the command
   
      ```bash
   platform project:list
   ```
   
Now that you have installed the CLI and it is communicating with Platform.sh, we can create projects from here just like in the management console before.


<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-2.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-4.html" class="buttongen small">I have installed the Platform.sh CLI</a>

</center>

<br/><br/>

</body>
</html>
