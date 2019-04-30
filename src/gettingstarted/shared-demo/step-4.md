# Getting Started with the Platform.sh CLI

## Create a project

With the Platform.sh CLI now installed and configured to communicate with your projects, lets create a new project from the command line.

Type the command `platform create` in your terminal.

The CLI will ask that you set up some initial project configurations just like you did with the management console:

1. Project title

   We need a unique name for each project, so title this one `My CLI Project`.

2. Region

   In general you will choose the region that is closest to where most of your site's traffic is coming from. Here, go ahead and begin typing `de-2.platform.sh` and the CLI will auto-complete the rest for you.
  
3. Plan

   The standard size will be fine for this guide, so type `1` and Enter.

4. Environments

   The `master` branch in the previous guide once built becomes the `Master` environment, the live production environment for your application. Additionally, you will receive other environments that will be useful for developing new features that you can view in your browser, but we will cover what those are and how to use them in the next guide.
   
   For now, press Enter to select the default number of environments.

5. Storage

   You can modify the amount of storage your application can use from the CLI and from the management console, as well as upgrade that storage later once your project starts growing.
   
   For now, press Enter to select the default amount of storage.

{% asciinema_local %}/scripts/asciinema/recordings/list.json{% endasciinema_local %}


That's it! You have now created a project from your own computer using the CLI.

At the end of the setup the CLI will output the name of your project along with its region and *project ID*. When you interact with your projects using the CLI, this *project ID* will be the primary identifier for making changes to projects, and you will need to copy it to initialize a template repository in the next step.

  
<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/next-steps/cli/step-3.html" class="buttongen small">Back</a>
<a href="/gettingstarted/next-steps/cli/step-5.html" class="buttongen small">I have created a project using the CLI</a>

</center>

<br/><br/>

</body>
</html>
