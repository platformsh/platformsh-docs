What is the CLI?
================

The cli is the official tool to use and manage your Platform.sh projects
directly from your terminal. Anything you can do in the ui\_overview can
be done with the cli.

How do I get it?
================

You can install the cli easily using Composer:

``` {.sourceCode .console}
composer global require platformsh/cli:@stable
```

You can find the system requirements and more information in the
[installation instructions on
GitHub](https://github.com/platformsh/platformsh-cli/blob/master/README.md).

> -   install\_cli

What can I do with the CLI?
===========================

The cli uses the platform\_api to trigger commands (*Branch, Merge...*)
on your Platform.sh project.

It's also very useful when you work locally since it can simulate a
local build of your codebase as if you were pushing a change to
Platform.sh.

Once you have the cli installed, run `platform list` to see all of the
available commands.

``` {.sourceCode .console}
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
  docs                                      Open the Platform.sh online documentation
  help                                      Displays help for a command
  list                                      Lists commands
  login                                     Log in to Platform.sh
  logout                                    Log out of Platform.sh
  web                                       Open the Platform.sh Web UI
activity
  activity:list (activities)                Get the most recent activities for an environment
  activity:log                              Display the log for an environment activity
domain
  domain:add                                Add a new domain to the project
  domain:delete                             Delete a domain from the project
  domain:list (domains)                     Get a list of all domains
environment
  environment:activate                      Activate an environment
  environment:backup                        Make a backup of an environment
  environment:branch (branch)               Branch an environment
  environment:checkout (checkout)           Check out an environment
  environment:delete                        Delete an environment
  environment:drush (drush)                 Run a drush command on the remote environment
  environment:http-access (httpaccess)      Update HTTP access settings for an environment
  environment:list (environments)           Get a list of all environments
  environment:merge (merge)                 Merge an environment
  environment:metadata                      Read or set metadata for an environment
  environment:relationships (relationships) List an environment's relationships
  environment:restore                       Restore an environment backup
  environment:routes (routes)               List an environment's routes
  environment:sql (sql)                     Run SQL on the remote database
  environment:sql-dump (sql-dump)           Create a local dump of the remote database
  environment:ssh (ssh)                     SSH to the current environment
  environment:synchronize (sync)            Synchronize an environment
  environment:url (url)                     Get the public URL of an environment
integration
  integration:add                           Add an integration to the project
  integration:delete                        Delete an integration from a project
  integration:get (integrations)            View project integration(s)
  integration:update                        Update an integration
local
  local:build (build)                       Build the current project locally
  local:clean (clean)                       Remove old project builds
  local:drush-aliases (drush-aliases)       Find the project's Drush aliases
  local:init (init)                         Create a local project file structure from a Git repository
project
  project:get (get)                         Clone and build a project locally
  project:list (projects)                   Get a list of all active projects
  project:metadata                          Read or set metadata for a project
ssh-key
  ssh-key:add                               Add a new SSH key
  ssh-key:delete                            Delete an SSH key
  ssh-key:list (ssh-keys)                   Get a list of SSH keys in your account
subscription
  subscription:metadata                     Read metadata for a subscription
user
  user:add                                  Add a user to the project
  user:delete                               Delete a user
  user:list (users)                         List project users
  user:role                                 View or change a user's role
variable
  variable:delete                           Delete a variable from an environment
  variable:get (variables, vget)            Get a variable for an environment
  variable:set (vset)                       Set a variable for an environment
```

You can preface any command with `help` to see more information on how
to use that command.

``` {.sourceCode .console}
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
```
