<html>
<head>
  <link rel="stylesheet" type="text/css" href="/asciinema/asciinema-player.css" />
  <script src="/asciinema/asciinema-player.js"></script>
</head>
</html>

# Developing with Platform.sh: Live Feature Environments

## Create feature branch

You can activate a branch using the CLI or the management console and Platform.sh will build and deploy an environment for the new feature that you can access and test in your browser, and show to investors or collaborators so that you can be confident that it will work great when it is finally merged.

Let's do exactly that with the template projects we created with the [management console](/gettingstarted/first-project.md) and the [CLI](/gettingstarted/next-steps/cli/start.md). If you have not yet completed these Getting Started guides, please click on the links and go back and do so. If you selected a template that has to be installed once it has deployed (i.e. Drupal), make sure to do that as well.

There are two options for creating new environments on Platform.sh, through the management console and through the CLI, so let's create an environment using both methods.

1. **Create a new branch using the management console**

   The easiest way to create a development environment for a new feature is through the management console. Because Platform.sh uses Git to manage your environments, it will create an exact copy of all of the code and services associated with `Master` into a new environment.
   
   On the main page of the management console, click on one of the projects you created in the previous guide, then enter the `Master` environment by click on `Master` in the "Environment Activity" box on the right.
   
   Once you have entered the project's `Master` environment, click on the `Branch` button at the top of the page. A prompt will appear that will ask you to name the new branch, so name it `new-feature`.
   
   When you have finished click `Create branch`, and Platform.sh will create the new branch `new-feature` with an exact copy of `Master` and activate its environment.
   
   ![Branch via console](/videos/console-branch.gif)
   
   > Note: When the dialog box appears to create the branch, Platform.sh will also provide the CLI command that performs the same action below it, which we will use in the next step.
   
   When the environment has finished building, select the 
   
2. **Create a new branch using the Platform.sh CLI**
   
   Nunc vulputate, urna imperdiet tristique sagittis, velit ligula tincidunt tellus, sit amet blandit dui arcu id mauris. 
   
   {% asciinema_local %}/scripts/asciinema/recordings/list.json{% endasciinema_local %}
   
3. **Pellentesque nec interdum neque** 

   Aenean lacinia venenatis nisl, ut porttitor tortor. Vivamus ut risus in orci scelerisque hendrerit. 
   
   Fusce viverra sodales quam, ut aliquam nibh vulputate sit amet.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/feature-envs/step-1.html" class="buttongen small">Back</a>
<a href="/gettingstarted/feature-envs/step-3.html" class="buttongen small">I have created a feature branch</a>

</center>

<br/><br/>

</body>
</html>

