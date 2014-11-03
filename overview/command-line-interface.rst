.. _cli:

Command Line Interface (CLI)
============================

What is the CLI?
----------------

The :ref:`Command Line Interface (CLI) <cli>` is the official tool to use and manage your Platform.sh projects directly from your terminal. Anything you can do in the :ref:`platform_ui` can be done with the :ref:`Command Line Interface (CLI) <cli>`.

How do I get it?
----------------

You can download the :ref:`Command Line Interface (CLI) <cli>` from `Github <https://github.com/platformsh/platform-cli>`_. 

Installation instructions can be found on the `README.md <https://github.com/platformsh/platformsh-cli/blob/development/README.md>`_.

What can I do with the CLI?
---------------------------

The :ref:`Command Line Interface (CLI) <cli>` is using the :ref:`api` to trigger commands (*Branch, Merge...*) on your Platform.sh project. 

It's also very useful when you work locally since it can simulate a local build of your codebase as if you were pushing a change to Platform.sh.

Once you have the :ref:`Command Line Interface (CLI) <cli>` installed, run ``platform list`` to see all of the available commands.

.. code-block:: console

  $ platform list
  Platform.sh CLI version 1.2.2

  Usage:
    [options] command [arguments]

  Options:
    --help           -h Display this help message.
    --quiet          -q Do not output any message.
    --verbose        -v|vv|vvv Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
    --version        -V Display this application version.
    --yes            -y Answer "yes" to all prompts.
    --no             -n Answer "no" to all prompts.
    --shell          -s Launch the shell.

  Available commands:
    branch                      Branch an environment.
    build                       Builds the current project.
    checkout                    Check out an environment.
    clean                       Remove project builds.
    domains                     Get a list of all domains.
    drush                       Invoke a drush command using the site alias for the current environment.
    drush-aliases               Determine and/or recreate the project's Drush aliases (if any).
    environments                Get a list of all environments.
    get                         Does a git clone of the referenced project.
    help                        Displays help for a command
    list                        Lists commands
    login                       Log in to Platform.sh
    logout                      Log out of Platform.sh
    projects                    Get a list of all active projects.
    ssh                         SSH to the current environment.
    ssh-keys                    Get a list of all added SSH keys.
    url                         Get the public URL to an environment, and open it in a browser.
  domain
    domain:add                  Add a new domain to the project.
    domain:delete               Delete a domain from the project.
  environment
    environment:activate        Activate an environment.
    environment:backup          Make a backup of an environment.
    environment:branch          Branch an environment.
    environment:checkout        Check out an environment.
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
    project:drush-aliases       Determine and/or recreate the project's Drush aliases (if any).
    project:get                 Does a git clone of the referenced project.
  ssh-key
    ssh-key:add                 Add a new SSH key.
    ssh-key:delete              Delete an SSH key.

You can preface any command with ``help`` to see more information on how to use that command.

.. code-block:: console

  $ platform help domain:add

  Usage:
  domain:add [--project[="..."]] [--cert="..."] [--key="..."] [--chain="..."] [name]

  Arguments:
   name                  The name of the domain

  Options:
   --project             The project ID
   --cert                The path to the certificate file for this domain.
   --key                 The path to the private key file for the provided certificate.
   --chain               The path to the certificate chain file or files for the provided certificate. (multiple values allowed)
   --help (-h)           Display this help message.
   --quiet (-q)          Do not output any message.
   --verbose (-v|vv|vvv) Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
   --version (-V)        Display this application version.
   --yes (-y)            Answer "yes" to all prompts.
   --no (-n)             Answer "no" to all prompts.
   --shell (-s)          Launch the shell.