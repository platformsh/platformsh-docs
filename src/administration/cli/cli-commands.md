Platform.sh CLI
===============

* _completion
* activities
* apps
* backup
* bot
* branch
* build
* cc
* certificates
* checkout
* clean
* clear-cache
* clearcache
* create
* dir
* docs
* domains
* drush
* drush-aliases
* environments
* get
* help
* httpaccess
* integrations
* legacy-migrate
* list
* log
* login
* logout
* logs
* merge
* multi
* project-variables
* projects
* push
* pvget
* pvset
* relationships
* routes
* self-update
* snapshots
* sql
* sql-dump
* ssh
* ssh-keys
* sync
* tunnels
* update
* url
* users
* variables
* vget
* vset
* web
* welcome

**activity:**

* activity:list
* activity:log

**app:**

* app:config-get
* app:list

**auth:**

* auth:info
* auth:login
* auth:logout
* auth:token

**certificate:**

* certificate:add
* certificate:delete
* certificate:get
* certificate:list

**db:**

* db:dump
* db:size
* db:sql

**domain:**

* domain:add
* domain:delete
* domain:get
* domain:list
* domain:update

**environment:**

* environment:activate
* environment:backup
* environment:branch
* environment:checkout
* environment:delete
* environment:drush
* environment:http-access
* environment:info
* environment:init
* environment:list
* environment:logs
* environment:merge
* environment:metadata
* environment:push
* environment:relationships
* environment:restore
* environment:routes
* environment:set-remote
* environment:sql
* environment:sql-dump
* environment:ssh
* environment:synchronize
* environment:url

**integration:**

* integration:add
* integration:delete
* integration:get
* integration:list
* integration:update

**local:**

* local:build
* local:clean
* local:dir
* local:drush-aliases
* local:install

**project:**

* project:create
* project:curl
* project:delete
* project:get
* project:info
* project:list
* project:metadata
* project:set-remote
* project:variable:delete
* project:variable:get
* project:variable:list
* project:variable:set

**route:**

* route:get
* route:list

**self:**

* self:install
* self:update

**snapshot:**

* snapshot:create
* snapshot:list
* snapshot:restore

**ssh-key:**

* ssh-key:add
* ssh-key:delete
* ssh-key:list

**subscription:**

* subscription:info

**tunnel:**

* tunnel:close
* tunnel:info
* tunnel:list
* tunnel:open

**user:**

* user:add
* user:delete
* user:list
* user:role

**variable:**

* variable:delete
* variable:get
* variable:list
* variable:set

_completion
-----------

* Description: BASH completion hook.
* Usage:

  * `_completion [-g|--generate-hook] [-p|--program PROGRAM] [-m|--multiple] [--shell-type [SHELL-TYPE]]`

To enable BASH completion, run:

    <comment>eval `[program] _completion -g`</comment>.

Or for an alias:

    <comment>eval `[program] _completion -g -p [alias]`</comment>.


### Options:

**generate-hook:**

* Name: `--generate-hook`
* Shortcut: `-g`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Generate BASH code that sets up completion for this application.
* Default: `false`

**program:**

* Name: `--program`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Program name that should trigger completion
  <comment>(defaults to the absolute application path)</comment>.
* Default: `NULL`

**multiple:**

* Name: `--multiple`
* Shortcut: `-m`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Generated hook can be used for multiple applications.
* Default: `false`

**shell-type:**

* Name: `--shell-type`
* Shortcut: <none>
* Accept value: yes
* Is value required: no
* Is multiple: no
* Description: Set the shell type (zsh or bash). Otherwise this is determined automatically.
* Default: `NULL`

bot
---

* Description: The Platform.sh Bot
* Usage:

  * `platform bot`


### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

clear-cache
-----------

* Description: Clear the CLI cache
* Usage:

  * `platform clear-cache`
  * `clearcache`
  * `cc`


### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

docs
----

* Description: Open the online documentation
* Usage:

  * `platform docs [--browser BROWSER] [--pipe] [--] [<search>]...`


### Arguments:

**search:**

* Name: search
* Is required: no
* Is array: yes
* Description: Search term(s)
* Default: `array ()`

### Options:

**browser:**

* Name: `--browser`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The browser to use to open the URL. Set 0 for none.
* Default: `NULL`

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the URL to stdout.
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

help
----

* Description: Displays help for a command
* Usage:

  * `help [--format FORMAT] [--raw] [--] [<command_name>]`

The <info>help</info> command displays help for a given command:

  <info>php /Users/augustin/.platformsh/bin/platform help list</info>

You can also output the help in other formats by using the <comment>--format</comment> option:

  <info>php /Users/augustin/.platformsh/bin/platform help --format=xml list</info>

To display the list of available commands, please use the <info>list</info> command.

### Arguments:

**command_name:**

* Name: command_name
* Is required: no
* Is array: no
* Description: The command name
* Default: `'help'`

### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format (txt, xml, json, or md)
* Default: `'txt'`

**raw:**

* Name: `--raw`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: To output raw command help
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

legacy-migrate
--------------

* Description: Migrate from the legacy file structure
* Usage:

  * `platform legacy-migrate [--no-backup]`

Before version 3.x, the Platform.sh CLI required a project to have a "repository"
directory containing the Git repository, "builds", "shared" and others. From
version 3, the Git repository itself is treated as the project. Metadata is
stored inside the repository (in .platform/local) and ignored by Git.

This command will migrate from the old file structure to the new one.

### Options:

**no-backup:**

* Name: `--no-backup`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not create a backup of the project.
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

list
----

* Description: Lists commands
* Usage:

  * `list [--raw] [--format FORMAT] [--] [<namespace>]`

The <info>list</info> command lists all commands:

  <info>php /Users/augustin/.platformsh/bin/platform list</info>

You can also display the commands for a specific namespace:

  <info>php /Users/augustin/.platformsh/bin/platform list test</info>

You can also output the information in other formats by using the <comment>--format</comment> option:

  <info>php /Users/augustin/.platformsh/bin/platform list --format=xml</info>

It's also possible to get raw list of commands (useful for embedding command runner):

  <info>php /Users/augustin/.platformsh/bin/platform list --raw</info>

### Arguments:

**namespace:**

* Name: namespace
* Is required: no
* Is array: no
* Description: The namespace name
* Default: `NULL`

### Options:

**raw:**

* Name: `--raw`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: To output raw command list
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format (txt, xml, json, or md)
* Default: `'txt'`

multi
-----

* Description: Execute a command on multiple projects
* Usage:

  * `platform multi [-p|--projects PROJECTS] [--continue] [--sort SORT] [--reverse] [--] <cmd>`


### Arguments:

**cmd:**

* Name: cmd
* Is required: yes
* Is array: no
* Description: The command to execute
* Default: `NULL`

### Options:

**projects:**

* Name: `--projects`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A list of project IDs, separated by commas and/or whitespace
* Default: `NULL`

**continue:**

* Name: `--continue`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Continue running commands even if an exception is encountered
* Default: `false`

**sort:**

* Name: `--sort`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A property by which to sort the list of project options
* Default: `'title'`

**reverse:**

* Name: `--reverse`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Reverse the order of project options
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

web
---

* Description: Open the Web UI
* Usage:

  * `platform web [--browser BROWSER] [--pipe] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT]`


### Options:

**browser:**

* Name: `--browser`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The browser to use to open the URL. Set 0 for none.
* Default: `NULL`

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the URL to stdout.
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

welcome
-------

* Description: Welcome to Platform.sh
* Usage:

  * `platform welcome`


### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

activity:list
-------------

* Description: Get a list of activities for an environment or project
* Usage:

  * `platform activities [--type TYPE] [--limit LIMIT] [--start START] [-a|--all] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT]`
  * `activities`


### Options:

**type:**

* Name: `--type`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Filter activities by type
* Default: `NULL`

**limit:**

* Name: `--limit`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Limit the number of results displayed
* Default: `10`

**start:**

* Name: `--start`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Only activities created before this date will be listed
* Default: `NULL`

**all:**

* Name: `--all`
* Shortcut: `-a`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Check activities on all environments
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

activity:log
------------

* Description: Display the log for an activity
* Usage:

  * `platform activity:log [--refresh REFRESH] [--type TYPE] [-a|--all] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--] [<id>]`


### Arguments:

**id:**

* Name: id
* Is required: no
* Is array: no
* Description: The activity ID. Defaults to the most recent activity.
* Default: `NULL`

### Options:

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Log refresh interval (seconds). Set to 0 to disable refreshing.
* Default: `1`

**type:**

* Name: `--type`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Filter activities by type
* Default: `NULL`

**all:**

* Name: `--all`
* Shortcut: `-a`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Check activities on all environments
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

app:config-get
--------------

* Description: View the configuration of an app
* Usage:

  * `platform app:config-get [-P|--property PROPERTY] [--refresh] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE]`


### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The configuration property to view
* Default: `NULL`

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Whether to refresh the cache
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

app:list
--------

* Description: Get a list of all apps in the local repository
* Usage:

  * `platform apps [--format FORMAT]`
  * `apps`


### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

auth:info
---------

* Description: Display your account information
* Usage:

  * `platform auth:info [-P|--property PROPERTY] [--refresh] [--format FORMAT] [--] [<property>]`


### Arguments:

**property:**

* Name: property
* Is required: no
* Is array: no
* Description: The account property to view
* Default: `NULL`

### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The account property to view (alternate syntax)
* Default: `NULL`

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Whether to refresh the cache
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

auth:login
----------

* Description: Log in to Platform.sh
* Usage:

  * `platform login`
  * `login`

Use this command to log in to your Platform.sh account.

You can create an account at:
    <info>https://accounts.platform.sh</info>

If you have an account, but you do not already have a password, you can set one here:
    <info>https://accounts.platform.sh/user/password</info>

### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

auth:logout
-----------

* Description: Log out of Platform.sh
* Usage:

  * `platform logout [-a|--all]`
  * `logout`


### Options:

**all:**

* Name: `--all`
* Shortcut: `-a`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Log out of all sessions
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

auth:token
----------

* Description: Obtain an OAuth 2 access token for requests to Platform.sh APIs
* Usage:

  * `platform auth:token`


### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

certificate:add
---------------

* Description: Add an SSL certificate to the project
* Usage:

  * `platform certificate:add [--cert CERT] [--key KEY] [--chain CHAIN] [-p|--project PROJECT] [--host HOST] [--no-wait]`


### Options:

**cert:**

* Name: `--cert`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The path to the certificate file
* Default: `NULL`

**key:**

* Name: `--key`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The path to the certificate private key file
* Default: `NULL`

**chain:**

* Name: `--chain`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: The path to the certificate chain file
* Default: `array ()`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

certificate:delete
------------------

* Description: Delete a certificate from the project
* Usage:

  * `platform certificate:delete [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <id>`


### Arguments:

**id:**

* Name: id
* Is required: yes
* Is array: no
* Description: The certificate ID (or the start of it)
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

certificate:get
---------------

* Description: View a certificate
* Usage:

  * `platform certificate:get [-P|--property PROPERTY] [--date-fmt DATE-FMT] [-p|--project PROJECT] [--host HOST] [--] <id>`


### Arguments:

**id:**

* Name: id
* Is required: yes
* Is array: no
* Description: The certificate ID (or the start of it)
* Default: `NULL`

### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The certificate property to view
* Default: `NULL`

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

certificate:list
----------------

* Description: List project certificates
* Usage:

  * `platform certificates [--domain DOMAIN] [--issuer ISSUER] [--only-auto] [--no-auto] [--date-fmt DATE-FMT] [--format FORMAT] [-p|--project PROJECT] [--host HOST]`
  * `certificates`


### Options:

**domain:**

* Name: `--domain`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Filter by domain name (case-insensitive search)
* Default: `NULL`

**issuer:**

* Name: `--issuer`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Filter by issuer
* Default: `NULL`

**only-auto:**

* Name: `--only-auto`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Show only auto-provisioned certificates
* Default: `false`

**no-auto:**

* Name: `--no-auto`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Show only manually added certificates
* Default: `false`

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

db:dump
-------

* Description: Create a local dump of the remote database
* Usage:

  * `platform db:dump [-f|--file FILE] [-d|--directory DIRECTORY] [-z|--gzip] [-t|--timestamp] [-o|--stdout] [--table TABLE] [--exclude-table EXCLUDE-TABLE] [--schema-only] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-r|--relationship RELATIONSHIP] [-i|--identity-file IDENTITY-FILE]`
  * `sql-dump`
  * `environment:sql-dump`


### Options:

**file:**

* Name: `--file`
* Shortcut: `-f`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A custom filename for the dump
* Default: `NULL`

**directory:**

* Name: `--directory`
* Shortcut: `-d`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A custom directory for the dump
* Default: `NULL`

**gzip:**

* Name: `--gzip`
* Shortcut: `-z`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Compress the dump using gzip
* Default: `false`

**timestamp:**

* Name: `--timestamp`
* Shortcut: `-t`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Add a timestamp to the dump filename
* Default: `false`

**stdout:**

* Name: `--stdout`
* Shortcut: `-o`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output to STDOUT instead of a file
* Default: `false`

**table:**

* Name: `--table`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Table(s) to include
* Default: `array ()`

**exclude-table:**

* Name: `--exclude-table`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Table(s) to exclude
* Default: `array ()`

**schema-only:**

* Name: `--schema-only`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Dump only schemas, no data
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**relationship:**

* Name: `--relationship`
* Shortcut: `-r`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The database relationship to use
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

db:size
-------

* Description: Estimate the disk usage of a database
* Usage:

  * `platform db:size [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-r|--relationship RELATIONSHIP] [--format FORMAT] [-i|--identity-file IDENTITY-FILE]`

This command provides an estimate of the database's disk usage. It is not guaranteed to be reliable.

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**relationship:**

* Name: `--relationship`
* Shortcut: `-r`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The database relationship to use
* Default: `NULL`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

db:sql
------

* Description: Run SQL on the remote database
* Usage:

  * `platform sql [--raw] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-r|--relationship RELATIONSHIP] [-i|--identity-file IDENTITY-FILE] [--] [<query>]`
  * `sql`
  * `environment:sql`


### Arguments:

**query:**

* Name: query
* Is required: no
* Is array: no
* Description: An SQL statement to execute
* Default: `NULL`

### Options:

**raw:**

* Name: `--raw`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Produce raw, non-tabular output
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**relationship:**

* Name: `--relationship`
* Shortcut: `-r`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The database relationship to use
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

domain:add
----------

* Description: Add a new domain to the project
* Usage:

  * `platform domain:add [--cert CERT] [--key KEY] [--chain CHAIN] [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <name>`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The domain name
* Default: `NULL`

### Options:

**cert:**

* Name: `--cert`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The path to the certificate file for this domain
* Default: `NULL`

**key:**

* Name: `--key`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The path to the private key file for the provided certificate.
* Default: `NULL`

**chain:**

* Name: `--chain`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: The path to the certificate chain file or files for the provided certificate
* Default: `array ()`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

domain:delete
-------------

* Description: Delete a domain from the project
* Usage:

  * `platform domain:delete [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <name>`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The domain name
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

domain:get
----------

* Description: Show detailed information for a domain
* Usage:

  * `platform domain:get [-P|--property PROPERTY] [--format FORMAT] [--date-fmt DATE-FMT] [-p|--project PROJECT] [--host HOST] [--] [<name>]`


### Arguments:

**name:**

* Name: name
* Is required: no
* Is array: no
* Description: The domain name
* Default: `NULL`

### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The domain property to view
* Default: `NULL`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

domain:list
-----------

* Description: Get a list of all domains
* Usage:

  * `platform domains [--format FORMAT] [-p|--project PROJECT] [--host HOST]`
  * `domains`


### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

domain:update
-------------

* Description: Update a domain
* Usage:

  * `platform domain:update [--cert CERT] [--key KEY] [--chain CHAIN] [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <name>`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The domain name
* Default: `NULL`

### Options:

**cert:**

* Name: `--cert`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The path to the certificate file for this domain
* Default: `NULL`

**key:**

* Name: `--key`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The path to the private key file for the provided certificate.
* Default: `NULL`

**chain:**

* Name: `--chain`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: The path to the certificate chain file or files for the provided certificate
* Default: `array ()`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:activate
--------------------

* Description: Activate an environment
* Usage:

  * `platform environment:activate [--parent PARENT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<environment>]...`


### Arguments:

**environment:**

* Name: environment
* Is required: no
* Is array: yes
* Description: The environment(s) to activate
* Default: `array ()`

### Options:

**parent:**

* Name: `--parent`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Set a new environment parent before activating
* Default: `NULL`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:branch
------------------

* Description: Branch an environment
* Usage:

  * `platform branch [--title TITLE] [--force] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [-i|--identity-file IDENTITY-FILE] [--] [<id>] [<parent>]`
  * `branch`


### Arguments:

**id:**

* Name: id
* Is required: no
* Is array: no
* Description: The ID (branch name) of the new environment
* Default: `NULL`

**parent:**

* Name: parent
* Is required: no
* Is array: no
* Description: The parent of the new environment
* Default: `NULL`

### Options:

**title:**

* Name: `--title`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The title of the new environment
* Default: `NULL`

**force:**

* Name: `--force`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Create the new environment even if the branch cannot be checked out locally
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the environment to be branched
* Default: `false`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:checkout
--------------------

* Description: Check out an environment
* Usage:

  * `platform checkout [-i|--identity-file IDENTITY-FILE] [--] [<id>]`
  * `checkout`


### Arguments:

**id:**

* Name: id
* Is required: no
* Is array: no
* Description: The ID of the environment to check out. For example: "sprint2"
* Default: `NULL`

### Options:

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:delete
------------------

* Description: Delete an environment
* Usage:

  * `platform environment:delete [--delete-branch] [--no-delete-branch] [--inactive] [--merged] [--exclude EXCLUDE] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<environment>]...`

When a Platform.sh environment is deleted, it will become "inactive": it will
exist only as a Git branch, containing code but no services, databases nor
files.

This command allows you to delete environment(s) as well as their Git branches.

### Arguments:

**environment:**

* Name: environment
* Is required: no
* Is array: yes
* Description: The environment(s) to delete
* Default: `array ()`

### Options:

**delete-branch:**

* Name: `--delete-branch`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Delete the remote Git branch(es) too
* Default: `false`

**no-delete-branch:**

* Name: `--no-delete-branch`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not delete the remote Git branch(es)
* Default: `false`

**inactive:**

* Name: `--inactive`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Delete all inactive environments
* Default: `false`

**merged:**

* Name: `--merged`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Delete all merged environments
* Default: `false`

**exclude:**

* Name: `--exclude`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Environments not to delete
* Default: `array ()`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:drush
-----------------

* Description: Run a drush command on the remote environment
* Usage:

  * `platform drush [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE] [--] [<cmd>]`
  * `drush`


### Arguments:

**cmd:**

* Name: cmd
* Is required: no
* Is array: no
* Description: A command and arguments to pass to Drush
* Default: `'status'`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:http-access
-----------------------

* Description: Update HTTP access settings for an environment
* Usage:

  * `platform httpaccess [--access ACCESS] [--auth AUTH] [--enabled ENABLED] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait]`
  * `httpaccess`


### Options:

**access:**

* Name: `--access`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Access restriction in the format "permission:address"
* Default: `array ()`

**auth:**

* Name: `--auth`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Authentication details in the format "username:password"
* Default: `array ()`

**enabled:**

* Name: `--enabled`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Whether access control should be enabled: 1 to enable, 0 to disable
* Default: `NULL`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:info
----------------

* Description: Read or set properties for an environment
* Usage:

  * `platform environment:info [--refresh] [--date-fmt DATE-FMT] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<property>] [<value>]`
  * `environment:metadata`


### Arguments:

**property:**

* Name: property
* Is required: no
* Is array: no
* Description: The name of the property
* Default: `NULL`

**value:**

* Name: value
* Is required: no
* Is array: no
* Description: Set a new value for the property
* Default: `NULL`

### Options:

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Whether to refresh the cache
* Default: `false`

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:init
----------------

* Description: <none>
* Usage:

  * `platform environment:init [--profile PROFILE] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] <url>`


### Arguments:

**url:**

* Name: url
* Is required: yes
* Is array: no
* Description: A URL to a Git repository
* Default: `NULL`

### Options:

**profile:**

* Name: `--profile`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The name of the profile
* Default: `NULL`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:list
----------------

* Description: Get a list of environments
* Usage:

  * `platform environments [-I|--no-inactive] [--pipe] [--refresh REFRESH] [--sort SORT] [--reverse] [--format FORMAT] [-p|--project PROJECT] [--host HOST]`
  * `environments`


### Options:

**no-inactive:**

* Name: `--no-inactive`
* Shortcut: `-I`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not show inactive environments
* Default: `false`

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output a simple list of environment IDs.
* Default: `false`

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Whether to refresh the list.
* Default: `1`

**sort:**

* Name: `--sort`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A property to sort by
* Default: `'title'`

**reverse:**

* Name: `--reverse`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Sort in reverse (descending) order
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:logs
----------------

* Description: Read an environment's logs
* Usage:

  * `platform log [--lines LINES] [--tail] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [--] [<type>]`
  * `log`
  * `logs`


### Arguments:

**type:**

* Name: type
* Is required: no
* Is array: no
* Description: The log type, e.g. "access" or "error"
* Default: `NULL`

### Options:

**lines:**

* Name: `--lines`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The number of lines to show
* Default: `100`

**tail:**

* Name: `--tail`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Continuously tail the log
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:merge
-----------------

* Description: Merge an environment
* Usage:

  * `platform merge [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<environment>]`
  * `merge`

This command will initiate a Git merge of the specified environment into its parent environment.

### Arguments:

**environment:**

* Name: environment
* Is required: no
* Is array: no
* Description: The environment to merge
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:push
----------------

* Description: Push code to an environment
* Usage:

  * `platform push [--target TARGET] [-f|--force] [--force-with-lease] [--no-wait] [--activate] [--parent PARENT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-i|--identity-file IDENTITY-FILE] [--] [<source>]`
  * `push`


### Arguments:

**source:**

* Name: source
* Is required: no
* Is array: no
* Description: The source ref: a branch name or commit hash
* Default: `'HEAD'`

### Options:

**target:**

* Name: `--target`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The target branch name
* Default: `NULL`

**force:**

* Name: `--force`
* Shortcut: `-f`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Allow non-fast-forward updates
* Default: `false`

**force-with-lease:**

* Name: `--force-with-lease`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Allow non-fast-forward updates, if the remote-tracking branch is up to date
* Default: `false`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: After pushing, do not wait for build or deploy
* Default: `false`

**activate:**

* Name: `--activate`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Activate the environment after pushing
* Default: `false`

**parent:**

* Name: `--parent`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Set a new environment parent (only used with --activate)
* Default: `NULL`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:relationships
-------------------------

* Description: Show an environment's relationships
* Usage:

  * `platform relationships [-P|--property PROPERTY] [--refresh] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE] [--] [<environment>]`
  * `relationships`


### Arguments:

**environment:**

* Name: environment
* Is required: no
* Is array: no
* Description: The environment
* Default: `NULL`

### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The relationship property to view
* Default: `NULL`

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Whether to refresh the relationships
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:set-remote
----------------------

* Description: Set the remote environment to map to a branch
* Usage:

  * `platform environment:set-remote <environment> [<branch>]`


### Arguments:

**environment:**

* Name: environment
* Is required: yes
* Is array: no
* Description: The environment machine name. Set to 0 to remove the mapping for a branch
* Default: `NULL`

**branch:**

* Name: branch
* Is required: no
* Is array: no
* Description: The Git branch to map (defaults to the current branch)
* Default: `NULL`

### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:ssh
---------------

* Description: SSH to the current environment
* Usage:

  * `platform ssh [--pipe] [--all] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE] [--] [<cmd>]`
  * `ssh`


### Arguments:

**cmd:**

* Name: cmd
* Is required: no
* Is array: no
* Description: A command to run on the environment.
* Default: `NULL`

### Options:

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the SSH URL only.
* Default: `false`

**all:**

* Name: `--all`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output all SSH URLs (for every app).
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:synchronize
-----------------------

* Description: Synchronize an environment's code and/or data from its parent
* Usage:

  * `platform sync [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<synchronize>]...`
  * `sync`

This command synchronizes to a child environment from its parent environment.

Synchronizing "code" means there will be a Git merge from the parent to the
child. Synchronizing "data" means that all files in all services (including
static files, databases, logs, search indices, etc.) will be copied from the
parent to the child.

### Arguments:

**synchronize:**

* Name: synchronize
* Is required: no
* Is array: yes
* Description: What to synchronize: "code", "data" or both
* Default: `array ()`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

environment:url
---------------

* Description: Get the public URLs of an environment
* Usage:

  * `platform url [--browser BROWSER] [--pipe] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT]`
  * `url`


### Options:

**browser:**

* Name: `--browser`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The browser to use to open the URL. Set 0 for none.
* Default: `NULL`

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the URL to stdout.
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

integration:add
---------------

* Description: Add an integration to the project
* Usage:

  * `platform integration:add [--type TYPE] [--token TOKEN] [--repository REPOSITORY] [--build-pull-requests BUILD-PULL-REQUESTS] [--fetch-branches FETCH-BRANCHES] [--room ROOM] [--url URL] [--events EVENTS] [--states STATES] [--environments ENVIRONMENTS] [-p|--project PROJECT] [--host HOST] [--no-wait]`


### Options:

**type:**

* Name: `--type`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The integration type ('github', 'hipchat', 'webhook')
* Default: `NULL`

**token:**

* Name: `--token`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An OAuth token for the integration
* Default: `NULL`

**repository:**

* Name: `--repository`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: GitHub: the repository to track (the URL, e.g. 'https://github.com/user/repo')
* Default: `NULL`

**build-pull-requests:**

* Name: `--build-pull-requests`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: GitHub: build pull requests as environments
* Default: `true`

**fetch-branches:**

* Name: `--fetch-branches`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: GitHub: sync all branches
* Default: `true`

**room:**

* Name: `--room`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: HipChat room ID
* Default: `NULL`

**url:**

* Name: `--url`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Generic webhook: a URL to receive JSON data
* Default: `NULL`

**events:**

* Name: `--events`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Events to report, e.g. environment.push
* Default: `array (  0 => '*',)`

**states:**

* Name: `--states`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: States to report, e.g. pending, in_progress, complete
* Default: `array (  0 => 'complete',)`

**environments:**

* Name: `--environments`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Generic webhook: the environments relevant to the hook
* Default: `array (  0 => '*',)`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

integration:delete
------------------

* Description: Delete an integration from a project
* Usage:

  * `platform integration:delete [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <id>`


### Arguments:

**id:**

* Name: id
* Is required: yes
* Is array: no
* Description: The integration ID
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

integration:get
---------------

* Description: View details of an integration
* Usage:

  * `platform integration:get [-P|--property [PROPERTY]] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [--] [<id>]`


### Arguments:

**id:**

* Name: id
* Is required: no
* Is array: no
* Description: An integration ID. Leave blank to choose from a list.
* Default: `NULL`

### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: no
* Is multiple: no
* Description: The integration property to view
* Default: `NULL`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

integration:list
----------------

* Description: View a list of project integration(s)
* Usage:

  * `platform integrations [--format FORMAT] [-p|--project PROJECT] [--host HOST]`
  * `integrations`


### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

integration:update
------------------

* Description: Update an integration
* Usage:

  * `platform integration:update [--type TYPE] [--token TOKEN] [--repository REPOSITORY] [--build-pull-requests BUILD-PULL-REQUESTS] [--fetch-branches FETCH-BRANCHES] [--room ROOM] [--url URL] [--events EVENTS] [--states STATES] [--environments ENVIRONMENTS] [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <id>`


### Arguments:

**id:**

* Name: id
* Is required: yes
* Is array: no
* Description: The ID of the integration to update
* Default: `NULL`

### Options:

**type:**

* Name: `--type`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The integration type ('github', 'hipchat', 'webhook')
* Default: `NULL`

**token:**

* Name: `--token`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An OAuth token for the integration
* Default: `NULL`

**repository:**

* Name: `--repository`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: GitHub: the repository to track (the URL, e.g. 'https://github.com/user/repo')
* Default: `NULL`

**build-pull-requests:**

* Name: `--build-pull-requests`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: GitHub: build pull requests as environments
* Default: `true`

**fetch-branches:**

* Name: `--fetch-branches`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: GitHub: sync all branches
* Default: `true`

**room:**

* Name: `--room`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: HipChat room ID
* Default: `NULL`

**url:**

* Name: `--url`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Generic webhook: a URL to receive JSON data
* Default: `NULL`

**events:**

* Name: `--events`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Events to report, e.g. environment.push
* Default: `array (  0 => '*',)`

**states:**

* Name: `--states`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: States to report, e.g. pending, in_progress, complete
* Default: `array (  0 => 'complete',)`

**environments:**

* Name: `--environments`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Generic webhook: the environments relevant to the hook
* Default: `array (  0 => '*',)`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

local:build
-----------

* Description: Build the current project locally
* Usage:

  * `platform build [-a|--abslinks] [-s|--source SOURCE] [-d|--destination DESTINATION] [-c|--copy] [--clone] [--run-deploy-hooks] [--no-clean] [--no-archive] [--no-backup] [--no-cache] [--no-build-hooks] [--no-deps] [--working-copy] [--concurrency CONCURRENCY] [--lock] [--] [<app>]...`
  * `build`


### Arguments:

**app:**

* Name: app
* Is required: no
* Is array: yes
* Description: Specify application(s) to build
* Default: `array ()`

### Options:

**abslinks:**

* Name: `--abslinks`
* Shortcut: `-a`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Use absolute links
* Default: `false`

**source:**

* Name: `--source`
* Shortcut: `-s`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The source directory. Defaults to the current project root.
* Default: `NULL`

**destination:**

* Name: `--destination`
* Shortcut: `-d`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The destination, to which the web root of each app will be symlinked. Default: _www
* Default: `NULL`

**copy:**

* Name: `--copy`
* Shortcut: `-c`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Copy to a build directory, instead of symlinking from the source
* Default: `false`

**clone:**

* Name: `--clone`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Use Git to clone the current HEAD to the build directory
* Default: `false`

**run-deploy-hooks:**

* Name: `--run-deploy-hooks`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Run post-deploy hooks
* Default: `false`

**no-clean:**

* Name: `--no-clean`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not remove old builds
* Default: `false`

**no-archive:**

* Name: `--no-archive`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not create or use a build archive
* Default: `false`

**no-backup:**

* Name: `--no-backup`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not back up the previous build
* Default: `false`

**no-cache:**

* Name: `--no-cache`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Disable caching
* Default: `false`

**no-build-hooks:**

* Name: `--no-build-hooks`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not run post-build hooks
* Default: `false`

**no-deps:**

* Name: `--no-deps`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not install build dependencies locally
* Default: `false`

**working-copy:**

* Name: `--working-copy`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Drush: use git to clone a repository of each Drupal module rather than simply downloading a version
* Default: `false`

**concurrency:**

* Name: `--concurrency`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Drush: set the number of concurrent projects that will be processed at the same time
* Default: `4`

**lock:**

* Name: `--lock`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Drush: create or update a lock file (only available with Drush version 7+)
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

local:clean
-----------

* Description: Remove old project builds
* Usage:

  * `platform clean [--keep KEEP] [--max-age MAX-AGE] [--include-active]`
  * `clean`


### Options:

**keep:**

* Name: `--keep`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The maximum number of builds to keep
* Default: `5`

**max-age:**

* Name: `--max-age`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The maximum age of builds, in seconds. Ignored if not set.
* Default: `NULL`

**include-active:**

* Name: `--include-active`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Delete active build(s) too
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

local:dir
---------

* Description: Find the local project root
* Usage:

  * `platform dir [<subdir>]`
  * `dir`


### Arguments:

**subdir:**

* Name: subdir
* Is required: no
* Is array: no
* Description: The subdirectory to find ('local', 'web' or 'shared')
* Default: `NULL`

### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

local:drush-aliases
-------------------

* Description: Find the project's Drush aliases
* Usage:

  * `platform drush-aliases [-r|--recreate] [-g|--group GROUP] [--pipe]`
  * `drush-aliases`


### Options:

**recreate:**

* Name: `--recreate`
* Shortcut: `-r`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Recreate the aliases.
* Default: `false`

**group:**

* Name: `--group`
* Shortcut: `-g`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Recreate the aliases with a new group name.
* Default: `NULL`

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the current group name (do nothing else).
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:create
--------------

* Description: Create a new project
* Usage:

  * `platform create [--title TITLE] [--region REGION] [--plan PLAN] [--environments ENVIRONMENTS] [--storage STORAGE]`
  * `create`


### Options:

**title:**

* Name: `--title`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The initial project title
* Default: `'Untitled Project'`

**region:**

* Name: `--region`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The region where the project will be hosted
* Default: `NULL`

**plan:**

* Name: `--plan`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The subscription plan
* Default: `'development'`

**environments:**

* Name: `--environments`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The number of environments
* Default: `3`

**storage:**

* Name: `--storage`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The amount of storage per environment, in GiB
* Default: `5`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:curl
------------

* Description: Run a cURL request on a project's API
* Usage:

  * `platform project:curl [-X|--request REQUEST] [-d|--data DATA] [-i|--include] [-I|--head] [-H|--header HEADER] [-p|--project PROJECT] [--host HOST] [--] [<path>]`


### Arguments:

**path:**

* Name: path
* Is required: no
* Is array: no
* Description: The API path
* Default: `NULL`

### Options:

**request:**

* Name: `--request`
* Shortcut: `-X`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The request method to use
* Default: `NULL`

**data:**

* Name: `--data`
* Shortcut: `-d`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Data to send
* Default: `NULL`

**include:**

* Name: `--include`
* Shortcut: `-i`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Include headers in the output
* Default: `false`

**head:**

* Name: `--head`
* Shortcut: `-I`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Fetch headers only
* Default: `false`

**header:**

* Name: `--header`
* Shortcut: `-H`
* Accept value: yes
* Is value required: yes
* Is multiple: yes
* Description: Extra header(s)
* Default: `array ()`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:delete
--------------

* Description: Delete a project
* Usage:

  * `platform project:delete [-p|--project PROJECT] [--host HOST] [--] [<project>]`


### Arguments:

**project:**

* Name: project
* Is required: no
* Is array: no
* Description: The project ID
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:get
-----------

* Description: Clone a project locally
* Usage:

  * `platform get [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--build] [-i|--identity-file IDENTITY-FILE] [--] [<project>] [<directory>]`
  * `get`


### Arguments:

**project:**

* Name: project
* Is required: no
* Is array: no
* Description: The project ID
* Default: `NULL`

**directory:**

* Name: directory
* Is required: no
* Is array: no
* Description: The directory to clone to. Defaults to the project title
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID to clone. Defaults to 'master' or the first available environment
* Default: `NULL`

**build:**

* Name: `--build`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Build the project after cloning
* Default: `false`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:info
------------

* Description: Read or set properties for a project
* Usage:

  * `platform project:info [--refresh] [--date-fmt DATE-FMT] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [--no-wait] [--] [<property>] [<value>]`
  * `project:metadata`


### Arguments:

**property:**

* Name: property
* Is required: no
* Is array: no
* Description: The name of the property
* Default: `NULL`

**value:**

* Name: value
* Is required: no
* Is array: no
* Description: Set a new value for the property
* Default: `NULL`

### Options:

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Whether to refresh the cache
* Default: `false`

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:list
------------

* Description: Get a list of all active projects
* Usage:

  * `platform projects [--pipe] [--host HOST] [--title TITLE] [--my] [--refresh REFRESH] [--sort SORT] [--reverse] [--format FORMAT]`
  * `projects`


### Options:

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output a simple list of project IDs
* Default: `false`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Filter by region hostname (exact match)
* Default: `NULL`

**title:**

* Name: `--title`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Filter by title (case-insensitive search)
* Default: `NULL`

**my:**

* Name: `--my`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display only the projects you own
* Default: `false`

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Whether to refresh the list
* Default: `1`

**sort:**

* Name: `--sort`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A property to sort by
* Default: `'title'`

**reverse:**

* Name: `--reverse`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Sort in reverse (descending) order
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:set-remote
------------------

* Description: Set the remote project for the current Git repository
* Usage:

  * `platform project:set-remote <project>`


### Arguments:

**project:**

* Name: project
* Is required: yes
* Is array: no
* Description: The project ID
* Default: `NULL`

### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:variable:delete
-----------------------

* Description: Delete a variable from a project
* Usage:

  * `platform project:variable:delete [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <name>`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The variable name
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:variable:get
--------------------

* Description: View variable(s) for a project
* Usage:

  * `platform project:variable:get [--pipe] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [--] [<name>]`
  * `project-variables`
  * `pvget`
  * `project:variable:list`


### Arguments:

**name:**

* Name: name
* Is required: no
* Is array: no
* Description: The name of the variable
* Default: `NULL`

### Options:

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the full variable value only (a "name" must be specified)
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

project:variable:set
--------------------

* Description: Set a variable for a project
* Usage:

  * `platform pvset [--json] [--no-visible-build] [--no-visible-runtime] [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <name> <value>`
  * `pvset`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The variable name
* Default: `NULL`

**value:**

* Name: value
* Is required: yes
* Is array: no
* Description: The variable value
* Default: `NULL`

### Options:

**json:**

* Name: `--json`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Mark the value as JSON
* Default: `false`

**no-visible-build:**

* Name: `--no-visible-build`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not expose this variable at build time
* Default: `false`

**no-visible-runtime:**

* Name: `--no-visible-runtime`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not e\Expose this variable at deploy and runtime
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

route:get
---------

* Description: View a resolved route
* Usage:

  * `platform route:get [-P|--property PROPERTY] [--refresh] [--date-fmt DATE-FMT] [-i|--identity-file IDENTITY-FILE] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [--] [<route>]`


### Arguments:

**route:**

* Name: route
* Is required: no
* Is array: no
* Description: The route's original URL
* Default: `NULL`

### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The property to display
* Default: `NULL`

**refresh:**

* Name: `--refresh`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Bypass the cache of routes
* Default: `false`

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

route:list
----------

* Description: List all routes for an environment
* Usage:

  * `platform routes [--format FORMAT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--] [<environment>]`
  * `routes`
  * `environment:routes`


### Arguments:

**environment:**

* Name: environment
* Is required: no
* Is array: no
* Description: The environment ID
* Default: `NULL`

### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

self:install
------------

* Description: Install or update CLI configuration files
* Usage:

  * `platform self:install`
  * `local:install`

This command automatically installs shell configuration for the Platform.sh CLI,
adding autocompletion support and handy aliases. Bash and ZSH are supported.

### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

self:update
-----------

* Description: Update the CLI to the latest version
* Usage:

  * `platform self-update [--no-major] [--unstable] [--manifest MANIFEST] [--current-version CURRENT-VERSION] [--timeout TIMEOUT]`
  * `self-update`
  * `update`


### Options:

**no-major:**

* Name: `--no-major`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Only update between minor or patch versions
* Default: `false`

**unstable:**

* Name: `--unstable`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Update to a new unstable version, if available
* Default: `false`

**manifest:**

* Name: `--manifest`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Override the manifest file location
* Default: `NULL`

**current-version:**

* Name: `--current-version`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Override the current version
* Default: `NULL`

**timeout:**

* Name: `--timeout`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A timeout for the version check
* Default: `30`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

snapshot:create
---------------

* Description: Make a snapshot of an environment
* Usage:

  * `platform snapshot:create [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<environment>]`
  * `backup`
  * `environment:backup`


### Arguments:

**environment:**

* Name: environment
* Is required: no
* Is array: no
* Description: The environment
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the snapshot to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

snapshot:list
-------------

* Description: List available snapshots of an environment
* Usage:

  * `platform snapshots [--limit LIMIT] [--start START] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT]`
  * `snapshots`


### Options:

**limit:**

* Name: `--limit`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Limit the number of snapshots to list
* Default: `10`

**start:**

* Name: `--start`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: Only snapshots created before this date will be listed
* Default: `NULL`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

snapshot:restore
----------------

* Description: Restore an environment snapshot
* Usage:

  * `platform snapshot:restore [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] [<snapshot>]`
  * `environment:restore`


### Arguments:

**snapshot:**

* Name: snapshot
* Is required: no
* Is array: no
* Description: The name of the snapshot. Defaults to the most recent one
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

ssh-key:add
-----------

* Description: Add a new SSH key
* Usage:

  * `platform ssh-key:add [--name NAME] [--] [<path>]`


### Arguments:

**path:**

* Name: path
* Is required: no
* Is array: no
* Description: The path to an existing SSH public key
* Default: `NULL`

### Options:

**name:**

* Name: `--name`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A name to identify the key
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

ssh-key:delete
--------------

* Description: Delete an SSH key
* Usage:

  * `platform ssh-key:delete [<id>]`


### Arguments:

**id:**

* Name: id
* Is required: no
* Is array: no
* Description: The ID of the SSH key to delete
* Default: `NULL`

### Options:

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

ssh-key:list
------------

* Description: Get a list of SSH keys in your account
* Usage:

  * `platform ssh-keys [--format FORMAT]`
  * `ssh-keys`


### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

subscription:info
-----------------

* Description: Read subscription properties
* Usage:

  * `platform subscription:info [--date-fmt DATE-FMT] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [--] [<property>] [<value>]`


### Arguments:

**property:**

* Name: property
* Is required: no
* Is array: no
* Description: The name of the property
* Default: `NULL`

**value:**

* Name: value
* Is required: no
* Is array: no
* Description: Set a new value for the property
* Default: `NULL`

### Options:

**date-fmt:**

* Name: `--date-fmt`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The date format (as a PHP date format string)
* Default: `'c'`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

tunnel:close
------------

* Description: Close SSH tunnels
* Usage:

  * `platform tunnel:close [-a|--all] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP]`


### Options:

**all:**

* Name: `--all`
* Shortcut: `-a`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Close all tunnels
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

tunnel:info
-----------

* Description: View relationship info for SSH tunnels
* Usage:

  * `platform tunnel:info [-P|--property PROPERTY] [-c|--encode] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [--format FORMAT]`


### Options:

**property:**

* Name: `--property`
* Shortcut: `-P`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The relationship property to view
* Default: `NULL`

**encode:**

* Name: `--encode`
* Shortcut: `-c`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output as base64-encoded JSON
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

tunnel:list
-----------

* Description: List SSH tunnels
* Usage:

  * `platform tunnels [-a|--all] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [--format FORMAT]`
  * `tunnels`


### Options:

**all:**

* Name: `--all`
* Shortcut: `-a`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: View all tunnels
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

tunnel:open
-----------

* Description: Open SSH tunnels to an app's relationships
* Usage:

  * `platform tunnel:open [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE]`


### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**app:**

* Name: `--app`
* Shortcut: `-A`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The remote application name
* Default: `NULL`

**identity-file:**

* Name: `--identity-file`
* Shortcut: `-i`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: An SSH identity (private key) to use
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

user:add
--------

* Description: Add a user to the project
* Usage:

  * `platform user:add [--role ROLE] [-p|--project PROJECT] [--host HOST] [--no-wait] [--] [<email>]`


### Arguments:

**email:**

* Name: email
* Is required: no
* Is array: no
* Description: The new user's email address
* Default: `NULL`

### Options:

**role:**

* Name: `--role`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The new user's role: 'admin' or 'viewer'
* Default: `NULL`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

user:delete
-----------

* Description: Delete a user
* Usage:

  * `platform user:delete [-p|--project PROJECT] [--host HOST] [--no-wait] [--] <email>`


### Arguments:

**email:**

* Name: email
* Is required: yes
* Is array: no
* Description: The user's email address
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

user:list
---------

* Description: List project users
* Usage:

  * `platform users [--format FORMAT] [-p|--project PROJECT] [--host HOST]`
  * `users`


### Options:

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

user:role
---------

* Description: View or change a user's role
* Usage:

  * `platform user:role [-r|--role ROLE] [-l|--level LEVEL] [--pipe] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] <email>`


### Arguments:

**email:**

* Name: email
* Is required: yes
* Is array: no
* Description: The user's email address
* Default: `NULL`

### Options:

**role:**

* Name: `--role`
* Shortcut: `-r`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: A new role for the user
* Default: `NULL`

**level:**

* Name: `--level`
* Shortcut: `-l`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The role level ('project' or 'environment')
* Default: `NULL`

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the role only
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

variable:delete
---------------

* Description: Delete a variable from an environment
* Usage:

  * `platform variable:delete [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] <name>`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The variable name
* Default: `NULL`

### Options:

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

variable:get
------------

* Description: View variable(s) for an environment
* Usage:

  * `platform variable:get [--pipe] [--format FORMAT] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--] [<name>]`
  * `variables`
  * `vget`
  * `variable:list`


### Arguments:

**name:**

* Name: name
* Is required: no
* Is array: no
* Description: The name of the variable
* Default: `NULL`

### Options:

**pipe:**

* Name: `--pipe`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Output the full variable value only (a "name" must be specified)
* Default: `false`

**format:**

* Name: `--format`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The output format ("table", "csv", or "tsv")
* Default: `'table'`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`

variable:set
------------

* Description: Set a variable for an environment
* Usage:

  * `platform vset [--json] [-p|--project PROJECT] [--host HOST] [-e|--environment ENVIRONMENT] [--no-wait] [--] <name> <value>`
  * `vset`


### Arguments:

**name:**

* Name: name
* Is required: yes
* Is array: no
* Description: The variable name
* Default: `NULL`

**value:**

* Name: value
* Is required: yes
* Is array: no
* Description: The variable value
* Default: `NULL`

### Options:

**json:**

* Name: `--json`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Mark the value as JSON
* Default: `false`

**project:**

* Name: `--project`
* Shortcut: `-p`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project ID
* Default: `NULL`

**host:**

* Name: `--host`
* Shortcut: <none>
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The project's API hostname
* Default: `NULL`

**environment:**

* Name: `--environment`
* Shortcut: `-e`
* Accept value: yes
* Is value required: yes
* Is multiple: no
* Description: The environment ID
* Default: `NULL`

**no-wait:**

* Name: `--no-wait`
* Shortcut: <none>
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not wait for the operation to complete
* Default: `false`

**help:**

* Name: `--help`
* Shortcut: `-h`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this help message
* Default: `false`

**quiet:**

* Name: `--quiet`
* Shortcut: `-q`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Do not output any message
* Default: `false`

**verbose:**

* Name: `--verbose`
* Shortcut: `-v|-vv|-vvv`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Increase the verbosity of messages
* Default: `false`

**version:**

* Name: `--version`
* Shortcut: `-V`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Display this application version
* Default: `false`

**yes:**

* Name: `--yes`
* Shortcut: `-y`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "yes" to all prompts; disable interaction
* Default: `false`

**no:**

* Name: `--no`
* Shortcut: `-n`
* Accept value: no
* Is value required: no
* Is multiple: no
* Description: Answer "no" to all prompts
* Default: `false`