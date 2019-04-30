# Getting Started with the Platform.sh CLI

## Initialize a template

Now that you have created a project using the Platform.sh CLI, we can fill that project with a maintained template right from our terminal.

1. **Template repository**

   We won't be able to see the available templates here, but you can visit the [documentation](gettingstarted/templates.md) to find an extended list of those we support.
   
   Pick the language you chose in the previous guide or another one you like working with.
   
   * [PHP templates](/gettingstarted/templates.md#php)
   * [Python templates](/gettingstarted/templates.md#python)
   * [Ruby templates](/gettingstarted/templates.md#ruby)
   * [Node.js templates](/gettingstarted/templates.md#nodejs)
   * [Go templates](/gettingstarted/templates.md#go)

2. **Select a template**

   Once you have picked a template from your language's list, you will need to copy the repository url address so that we can pass it to the CLI.
   
   You can either click the template link and copy the url in the address bar on GitHub, or right-click the template link and select `Copy Link Address`.
   
   For example, the url for the Drupal 8 template for PHP is
   
   ```bash
   https://github.com/platformsh/template-drupal8
   ```
   
3. **Initialize the template on your new project**

    Now that we've created a project and selected a template, all we need to do is pass that template url to the CLI and Platform.sh will take care of the rest. 
    
    In general the command to do this is
    
    ```bash
    platform e:init -p <project ID> -e <environment> <template url>
    ```
    
    For example, to set up the Drupal 8 template on the `Master` environment of `My CLI Project`, which has a project ID `znu6i74kun7oq`, the command will be
    
    ```bash
    platform e:init -p znu6i74kun7oq -e master https://github.com/platformsh/template-drupal8
    ```
    
    If you do not know your project ID number from the previous step, you can retrieve it at any time by listing your active projects with `platform project:list`.
    
4. **That's it!**

    The Platform.sh CLI will communicate with your account to initialize `My CLI Project` with the template you selected, build, and deploy it.

    {% asciinema_local %}/scripts/asciinema/recordings/list.json{% endasciinema_local %}

    
Now that the template project has been created and initialized using the CLI, we can verify everything worked as planned the same way you did with the management console here.
    
<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/next-steps/cli/step-4.html" class="buttongen small">Back</a>
<a href="/gettingstarted/next-steps/cli/step-6.html" class="buttongen small">I have intialized a template on my project</a>

</center>

<br/><br/>

</body>
</html>
