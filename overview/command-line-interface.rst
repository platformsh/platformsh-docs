.. _cli:

Command Line Interface (CLI)
============================

What is the Platform.sh CLI?
----------------------------

The :ref:`Command Line Interface (CLI) <cli>` is the official tool to use and manage your Platform.sh projects directly from your terminal. Anything you can do in the :ref:`platform_ui` can be done with the :ref:`Command Line Interface (CLI) <cli>`.


Where do I get it?
------------------

You can download the :ref:`Command Line Interface (CLI) <cli>` from `Github <https://github.com/platformsh/platform-cli>`_. 

Installation instructions can be found on the `README.md <https://github.com/platformsh/platformsh-cli/blob/development/README.md>`_.

What can I do with Platform CLI?
--------------------------------

Once you have the Platform CLI installed, run **\`platform list\`** to see all of the available commands.

.. code-block:: console

  $ platform list
  Platform CLI version 1.1.0
  
  Usage:
    [options] command [arguments]
  
  Options:
    --help           -h Display this help message.
    --quiet          -q Do not output any message.
    --verbose        -v|vv|vvv Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
    --version        -V Display this application version.
    --no-interaction -n Do not ask any interactive question.
    --shell          -s Launch the shell.
  
  Available commands:
    branch                      Branch an environment.
    build                       Builds the current project.
    checkout                    Checkout an environment.
    clean                       Remove project builds.
    domains                     Get a list of all domains.
    drush                       Invoke a drush command using the site alias for the current environment.
    drush-aliases               Determine and/or recreate the project's Drush aliases (if any).
    environments                Get a list of all environments.
    get                         Does a git clone of the referenced project.
    help                        Displays help for a command
    list                        Lists commands
    login                       Login to platform
    logout                      Log out of the Platform CLI
    projects                    Get a list of all active projects.
    ssh                         SSH to the current environment.
    ssh-keys                    Get a list of all added SSH keys.
    url                         Get the public URL to an environment, and open it in a browser.
  domain
    domain:add                  Add a new domain to the project.
    domain:delete               Delete a domain from the project.
  environment
    environment:activate        Activate an environment.
    environment:backup          Backup an environment.
    environment:branch          Branch an environment.
    environment:checkout        Checkout an environment.
    environment:deactivate      Deactivate an environment.
    environment:delete          Delete an environment.
    environment:merge           Merge an environment.
    environment:relationships   List the environment's relationships.
    environment:ssh             SSH to the current environment.
    environment:synchronize     Synchronize an environment.
    environment:url             Get the public URL to an environment, and open it in a browser.
  project
    project:build               Builds the current project.
    project:clean               Remove project builds.
    project:delete              Delete a project.
    project:drush-aliases       Determine and/or recreate the project's Drush aliases (if any).
    project:get                 Does a git clone of the referenced project.
  ssh-key
    ssh-key:add                 Add a new SSH key.
    ssh-key:delete              Delete an SSH key.

.. note::
   You can preface any command with 'help' to see information about options for that command.

   .. code-block:: console

      $ platform help list
        Usage:
          list [--xml] [--raw] [--format="..."] [namespace]

        Arguments:
          namespace  The namespace name

        Options:
          --xml      To output list as XML
          --raw      To output raw command list
          --format   To output list in other formats (default: "txt")

        Help:
          The list command lists all commands:

            platform list

          You can also display the commands for a specific namespace:

            platform list test

          You can also output the information in other formats by using the --format option:

            platform list --format=xml

          It's also possible to get raw list of commands (useful for embedding command runner):

            platform list --raw
