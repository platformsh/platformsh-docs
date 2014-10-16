.. _cli:

Command Line Interface (CLI)
============================


What is the Platform.sh CLI?
----------------------------

The `Platform.sh <https://platform.sh>`_ CLI is the official tool to use and manage your Platform projects directly from within your terminal. Anything you can do in the Platform UI, you can do in your terminal with Platform CLI.


Where do I get it?
------------------

Platform CLI is hosted on `Github <https://github.com/commerceguys/platform-cli>`_.


What can I do with Platform CLI?
--------------------------------

Once you have the Platform CLI installed, run **\`platform list\`** to see all of the available commands.

.. code-block:: console

  $ platform list
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
      branch                    Branch an environment.
      build                     Builds the current project.
      checkout                  Checkout an environment.
      drush                     Invoke a drush command using the site alias for the current environment.
      environments              Get a list of all environments.
      get                       Does a git clone of the referenced project.
      help                      Displays help for a command
      list                      Lists commands
      projects                  Get a list of all active projects.
      ssh-keys                  Get a list of all added SSH keys.
    environment
      environment:backup        Backup an environment.
      environment:branch        Branch an environment.
      environment:checkout      Checkout an environment.
      environment:delete        Delete an environment.
      environment:merge         Merge an environment.
      environment:synchronize   Synchronize an environment.
    project
      project:build             Builds the current project.
      project:delete            Delete a project.
      project:get               Does a git clone of the referenced project.
    ssh-key
      ssh-key:add               Add a new SSH key.
      ssh-key:delete            Delete an SSH key.

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
