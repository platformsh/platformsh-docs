---
title: "Create a new project"
weight: 4
toc: false
aliases:
  - "/gettingstarted/own-code/create-project.html"
---

With the Platform.sh CLI now installed and configured to communicate with your account,
you can create a new project from the command line and connect it to your application.

{{< asciinema src="videos/asciinema/project-create.cast" >}}

1. **Create an empty project**

    Type the command `platform create` in your terminal.

    The CLI asks you to set up some initial project configurations:

    * `Project title`: You need a unique name for each project, so title this one `My CLI Project`.

    * `Region`: In general, choose the region that's closest to where most of your site's traffic is coming from.
      Here, go ahead and begin typing `us-3.platform.sh` and the CLI auto-completes the rest for you.

    * `Plan`: Select the development plan for your trial project.

    * `Environments`: Your default branch becomes the live production environment for your application.
      Additionally, other branches may be activated as fully running environments for developing new features.
      More on that [later](/gettingstarted/developing/dev-environments/_index.md).
      This value selects the maximum number of development environments the project allows.
      You can change this value later at any time.

      For now, press Enter to select the default number of environments.

    * `Storage`: You can modify the amount of storage your application can use from the CLI and from the management console
      as well as upgrade that storage later once your project starts growing.

      For now, press Enter to select the default amount of storage.

    When the CLI has finished creating a project, it outputs your *project ID*.
    This is the primary identifier for making changes to your projects
    and you will need to use it to set Platform.sh as the remote for your repository in the next step.

    You can also retrieve the *project ID* with the command `platform project:list`,
    which lists all of your projects and their IDs in a table.

2. **Set Platform.sh as remote for your application**

    Next, you need to connect to the remote project in order to push your code to Platform.sh.

    If you haven't already initialized your project directory as a Git repository, you first need to do so:

    ```bash
    git init
    ```

    Then you can set Platform.sh as a remote with the command:

    ```bash
    platform project:set-remote <project ID>
    ```

That's it! You have now created an empty project and connected your repository to that project using the CLI.

Move on now to the next step to start configuring your repository to deploy on Platform.sh.

{{< guide-buttons next="I've created a project" >}}
