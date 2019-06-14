# Import your own code

## Create a new project

With the Platform.sh CLI now installed and configured to communicate with your projects, you can create a new project from the command line and connect it to your application.

<asciinema-player src="/videos/asciinema/project-create.cast" preload=1 autoplay=1 loop=1></asciinema-player>

1. **Create an empty project**

    Type the command `platform create` in your terminal.

    The CLI will then ask you to set up some initial project configurations:

    * `Project title`: We need a unique name for each project, so title this one `My CLI Project`.

    * `Region`: In general you will choose the region that is closest to where most of your site's traffic is coming from. Here, go ahead and begin typing `de-2.platform.sh` and the CLI will auto-complete the rest for you.

    * `Plan`: The standard size will be fine for this guide, so type `1` and Enter.

    * `Environments`: The `master` branch in the previous guide once built becomes the `Master` environment, the live production environment for your application. Additionally, you will receive other environments that will be useful for developing new features that you can view in your browser, but we will cover what those are and how to use them in the next guide.

       For now, press Enter to select the default number of environments.

    * `Storage`: You can modify the amount of storage your application can use from the CLI and from the management console, as well as upgrade that storage later once your project starts growing.

       For now, press Enter to select the default amount of storage.

    When the CLI has finished creating a project, it will output your *project ID*. This is the primary identifier for making changes to your projects, and you will need to use it to set Platform.sh as the remote for your repository in the next step.

    You can also retrieve the *project ID* with the command `platform project:list`, which lists all of your projects and their IDs in a table.

2. **Set Platform.sh as remote for your application**

    Next you will need to connect to the remote project in order to push your code to Platform.sh.

    If you have not already initialized your project directory as a Git repository, you will first need to do so
    ```
    git init
    ```

    Then you can set Platform.sh as a remote with the command
    ```
    platform project:set-remote <project ID>
    ```

That's it! You have now created an empty project and connected your repository to that project using the CLI. Move on now to the next step to start configuring your repository to deploy on Platform.sh.

<div id = "buttons"></div>

<script>
$(document).ready(function(){
  var navNextText = "I created a project with the CLI";
  var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
  makeButton(navButtons);
});
</script>
