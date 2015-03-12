.. _cli:

What is the CLI?
----------------

The :ref:`cli` is the official tool to use and manage your Platform.sh projects directly from your terminal. Anything you can do in the :ref:`ui_overview` can be done with the :ref:`cli`.

How do I get it?
----------------

You can install the :ref:`cli` easily using Composer:

.. code-block:: console

  composer global require 'platformsh/cli:1.*'

You can find the system requirements and more information in the `installation instructions on GitHub <https://github.com/platformsh/platformsh-cli/blob/master/README.md>`_.

.. seealso::
  * :ref:`install_cli`

What can I do with the CLI?
---------------------------

The :ref:`cli` uses the :ref:`platform_api` to trigger commands (*Branch, Merge...*) on your Platform.sh project.

It's also very useful when you work locally since it can simulate a local build of your codebase as if you were pushing a change to Platform.sh.

Once you have the :ref:`cli` installed, run ``platform list`` to see all of the available commands.

.. code-block:: console

  $ platform list
  Platform.sh CLI

  Global options:
    --help           -h Display this help message
    --quiet          -q Do not output any message
    --verbose        -v|vv|vvv Increase the verbosity of messages
    --version        -V Display this application version
    --yes            -y Answer "yes" to all prompts
    --no             -n Answer "no" to all prompts
    --shell          -s Launch the shell

  Available commands:
    help                                    Displays help for a command
    list                                    Lists commands
    login                                   Log in to Platform.sh
    logout                                  Log out of Platform.sh
  domain
    domain:add                              Add a new domain to the project
    domain:delete                           Delete a domain from the project
    domain:list (domains)                   Get a list of all domains
  environment
    environment:activate                    Activate an environment
    environment:backup                      Make a backup of an environment
    environment:branch (branch)             Branch an environment
    environment:checkout (checkout)         Check out an environment
    environment:deactivate                  Deactivate an environment
    environment:delete                      Delete an environment
    environment:drush (drush)               Run a drush command on the remote environment
    environment:list (environments)         Get a list of all environments
    environment:merge (merge)               Merge an environment
    environment:relationships               List the environment's relationships
    environment:ssh (ssh)                   SSH to the current environment
    environment:synchronize (sync)          Synchronize an environment
    environment:url (url)                   Get the public URL of an environment
  project
    project:build (build)                   Builds the current project
    project:clean (clean)                   Remove project builds
    project:drush-aliases (drush-aliases)   Find the project's Drush aliases
    project:get (get)                       Clone and build a project locally
    project:init (init)                     Initialize from a plain Git repository
    project:list (projects)                 Get a list of all active projects
  ssh-key
    ssh-key:add                             Add a new SSH key
    ssh-key:delete                          Delete an SSH key
    ssh-key:list (ssh-keys)                 Get a list of all added SSH keys
  variable
    variable:delete                         Delete a variable from an environment
    variable:get (vget)                     Get a variable for an environment
    variable:set (vset)                     Set a variable for an environment

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