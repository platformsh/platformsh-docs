---
title: "CLI Command reference"
sidebarTitle: "Command reference"
weight: 2
showTitle: false
---

<style>
    #TableOfContents > ul > li > ul {
      display: none;
    }
</style>

<!-- vale off -->

# Upsun CLI 5.0.15

- [Installation](/administration/cli#1-install)
- [Open an issue](https://github.com/platformsh/cli/issues)

## All commands

* [`clear-cache`](#clear-cache)
* [`decode`](#decode)
* [`docs`](#docs)
* [`help`](#help)
* [`list`](#list)
* [`multi`](#multi)
* [`web`](#web)

**activity**

* [`activity:cancel`](#activitycancel)
* [`activity:get`](#activityget)
* [`activity:list`](#activitylist)
* [`activity:log`](#activitylog)

**app**

* [`app:config-get`](#appconfig-get)
* [`app:config-validate`](#appconfig-validate)
* [`app:list`](#applist)

**auth**

* [`auth:api-token-login`](#authapi-token-login)
* [`auth:browser-login`](#authbrowser-login)
* [`auth:info`](#authinfo)
* [`auth:logout`](#authlogout)
* [`auth:verify-phone-number`](#authverify-phone-number)

**backup**

* [`backup:create`](#backupcreate)
* [`backup:delete`](#backupdelete)
* [`backup:get`](#backupget)
* [`backup:list`](#backuplist)
* [`backup:restore`](#backuprestore)

**certificate**

* [`certificate:add`](#certificateadd)
* [`certificate:delete`](#certificatedelete)
* [`certificate:get`](#certificateget)
* [`certificate:list`](#certificatelist)

**commit**

* [`commit:get`](#commitget)
* [`commit:list`](#commitlist)

**db**

* [`db:dump`](#dbdump)
* [`db:sql`](#dbsql)

**domain**

* [`domain:add`](#domainadd)
* [`domain:delete`](#domaindelete)
* [`domain:get`](#domainget)
* [`domain:list`](#domainlist)
* [`domain:update`](#domainupdate)

**environment**

* [`environment:activate`](#environmentactivate)
* [`environment:branch`](#environmentbranch)
* [`environment:checkout`](#environmentcheckout)
* [`environment:delete`](#environmentdelete)
* [`environment:drush`](#environmentdrush)
* [`environment:http-access`](#environmenthttp-access)
* [`environment:info`](#environmentinfo)
* [`environment:init`](#environmentinit)
* [`environment:list`](#environmentlist)
* [`environment:logs`](#environmentlogs)
* [`environment:merge`](#environmentmerge)
* [`environment:pause`](#environmentpause)
* [`environment:push`](#environmentpush)
* [`environment:redeploy`](#environmentredeploy)
* [`environment:relationships`](#environmentrelationships)
* [`environment:resume`](#environmentresume)
* [`environment:scp`](#environmentscp)
* [`environment:ssh`](#environmentssh)
* [`environment:synchronize`](#environmentsynchronize)
* [`environment:url`](#environmenturl)
* [`environment:xdebug`](#environmentxdebug)

**integration**

* [`integration:activity:get`](#integrationactivityget)
* [`integration:activity:list`](#integrationactivitylist)
* [`integration:activity:log`](#integrationactivitylog)
* [`integration:add`](#integrationadd)
* [`integration:delete`](#integrationdelete)
* [`integration:get`](#integrationget)
* [`integration:list`](#integrationlist)
* [`integration:update`](#integrationupdate)
* [`integration:validate`](#integrationvalidate)

**local**

* [`local:dir`](#localdir)

**metrics**

* [`metrics:all`](#metricsall)
* [`metrics:cpu`](#metricscpu)
* [`metrics:disk-usage`](#metricsdisk-usage)
* [`metrics:memory`](#metricsmemory)

**mount**

* [`mount:download`](#mountdownload)
* [`mount:list`](#mountlist)
* [`mount:upload`](#mountupload)

**operation**

* [`operation:list`](#operationlist)
* [`operation:run`](#operationrun)

**organization**

* [`organization:billing:address`](#organizationbillingaddress)
* [`organization:billing:profile`](#organizationbillingprofile)
* [`organization:create`](#organizationcreate)
* [`organization:delete`](#organizationdelete)
* [`organization:info`](#organizationinfo)
* [`organization:list`](#organizationlist)
* [`organization:subscription:list`](#organizationsubscriptionlist)
* [`organization:user:add`](#organizationuseradd)
* [`organization:user:delete`](#organizationuserdelete)
* [`organization:user:get`](#organizationuserget)
* [`organization:user:list`](#organizationuserlist)
* [`organization:user:projects`](#organizationuserprojects)
* [`organization:user:update`](#organizationuserupdate)

**project**

* [`project:clear-build-cache`](#projectclear-build-cache)
* [`project:create`](#projectcreate)
* [`project:delete`](#projectdelete)
* [`project:get`](#projectget)
* [`project:info`](#projectinfo)
* [`project:init`](#projectinit)
* [`project:list`](#projectlist)
* [`project:set-remote`](#projectset-remote)

**repo**

* [`repo:cat`](#repocat)
* [`repo:ls`](#repols)
* [`repo:read`](#reporead)

**resources**

* [`resources:build:get`](#resourcesbuildget)
* [`resources:build:set`](#resourcesbuildset)
* [`resources:get`](#resourcesget)
* [`resources:set`](#resourcesset)
* [`resources:size:list`](#resourcessizelist)

**route**

* [`route:get`](#routeget)
* [`route:list`](#routelist)

**service**

* [`service:list`](#servicelist)
* [`service:mongo:dump`](#servicemongodump)
* [`service:mongo:export`](#servicemongoexport)
* [`service:mongo:restore`](#servicemongorestore)
* [`service:mongo:shell`](#servicemongoshell)
* [`service:redis-cli`](#serviceredis-cli)

**source-operation**

* [`source-operation:list`](#source-operationlist)
* [`source-operation:run`](#source-operationrun)

**ssh-cert**

* [`ssh-cert:load`](#ssh-certload)

**ssh-key**

* [`ssh-key:add`](#ssh-keyadd)
* [`ssh-key:delete`](#ssh-keydelete)
* [`ssh-key:list`](#ssh-keylist)

**subscription**

* [`subscription:info`](#subscriptioninfo)

**team**

* [`team:create`](#teamcreate)
* [`team:delete`](#teamdelete)
* [`team:get`](#teamget)
* [`team:list`](#teamlist)
* [`team:project:add`](#teamprojectadd)
* [`team:project:delete`](#teamprojectdelete)
* [`team:project:list`](#teamprojectlist)
* [`team:update`](#teamupdate)
* [`team:user:add`](#teamuseradd)
* [`team:user:delete`](#teamuserdelete)
* [`team:user:list`](#teamuserlist)

**tunnel**

* [`tunnel:close`](#tunnelclose)
* [`tunnel:info`](#tunnelinfo)
* [`tunnel:list`](#tunnellist)
* [`tunnel:open`](#tunnelopen)
* [`tunnel:single`](#tunnelsingle)

**user**

* [`user:add`](#useradd)
* [`user:delete`](#userdelete)
* [`user:get`](#userget)
* [`user:list`](#userlist)
* [`user:update`](#userupdate)

**variable**

* [`variable:create`](#variablecreate)
* [`variable:delete`](#variabledelete)
* [`variable:get`](#variableget)
* [`variable:list`](#variablelist)
* [`variable:update`](#variableupdate)

**worker**

* [`worker:list`](#workerlist)

## `clear-cache`

Clear the CLI cache

Aliases: `cc`

### Usage

```
upsun cc
```

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `decode`

Decode an encoded string such as PLATFORM_VARIABLES

### Usage

```
upsun decode [-P|--property PROPERTY] [--] <value>
```

#### Arguments

* `value`(required)
  The variable value to decode

#### Options

* `--property` (`-P`) (expects a value)
  The property to view within the variable

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View "foo" in PLATFORM_VARIABLES:
```
upsun decode "$PLATFORM_VARIABLES" -P foo
```

## `docs`

Open the online documentation

### Usage

```
upsun docs [--browser BROWSER] [--pipe] [--] [<search>]...
```

#### Arguments

* `search`(optional; multiple values allowed)
  Search term(s)

#### Options

* `--browser` (expects a value)
  The browser to use to open the URL. Set 0 for none.

* `--pipe`
  Output the URL to stdout.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Search for information about the CLI:
```
upsun docs CLI
```

## `help`

Displays help for a command

### Usage

```
upsun help [--format FORMAT] [--raw] [--] [<command_name>]
```

The help command displays help for a given command:

  upsun help list

You can also output the help in other formats by using the --format option:

  upsun help --format=json list

To display the list of available commands, please use the list command.

#### Arguments

* `command_name`(optional)
  The command name

#### Options

* `--format` (expects a value)
  The output format (txt, json, or md)

* `--raw`
  To output raw command help

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `list`

Lists commands

### Usage

```
upsun list [--raw] [--format FORMAT] [--all] [--] [<namespace>]
```

The list command lists all commands:

  upsun list

You can also display the commands for a specific namespace:

  upsun list project

You can also output the information in other formats by using the --format option:

  upsun list --format=xml

It's also possible to get raw list of commands (useful for embedding command runner):

  upsun list --raw

#### Arguments

* `command`(required)
  The command to execute

* `namespace`(optional)
  The namespace name

#### Options

* `--raw`
  To output raw command list

* `--format` (expects a value)
  The output format (txt, xml, json, or md)

* `--all`
  Show all commands, including hidden ones

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `multi`

Execute a command on multiple projects

### Usage

```
upsun multi [-p|--projects PROJECTS] [--continue] [--sort SORT] [--reverse] [--] <cmd> (<cmd>)...
```

#### Arguments

* `cmd`(required; multiple values allowed)
  The command to execute

#### Options

* `--projects` (`-p`) (expects a value)
  A list of project IDs, separated by commas and/or whitespace

* `--continue`
  Continue running commands even if an exception is encountered

* `--sort` (expects a value)
  A property by which to sort the list of project options

* `--reverse`
  Reverse the order of project options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* List variables on the "main" environment for multiple projects:
```
upsun multi -p l7ywemwizmmgb,o43m25zns6k2d,3nyujoslhydhx -- var -e main
```

## `web`

Open the project in the Web Console

### Usage

```
upsun web [--browser BROWSER] [--pipe] [-p|--project PROJECT] [-e|--environment ENVIRONMENT]
```

#### Options

* `--browser` (expects a value)
  The browser to use to open the URL. Set 0 for none.

* `--pipe`
  Output the URL to stdout.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `activity:cancel`

Cancel an activity

### Usage

```
upsun activity:cancel [-t|--type TYPE] [-x|--exclude-type EXCLUDE-TYPE] [-a|--all] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<id>]
```

#### Arguments

* `id`(optional)
  The activity ID. Defaults to the most recent cancellable activity.

#### Options

* `--type` (`-t`) (expects a value)
  Filter by type (when selecting a default activity). Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard for the type, e.g. '%var%' to select variable-related activities.

* `--exclude-type` (`-x`) (expects a value)
  Exclude by type (when selecting a default activity). Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard to exclude types.

* `--all` (`-a`)
  Check recent activities on all environments (when selecting a default activity)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `activity:get`

View detailed information on a single activity

### Usage

```
upsun activity:get [-P|--property PROPERTY] [-t|--type TYPE] [-x|--exclude-type EXCLUDE-TYPE] [--state STATE] [--result RESULT] [-i|--incomplete] [-a|--all] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [--] [<id>]
```

#### Arguments

* `id`(optional)
  The activity ID. Defaults to the most recent activity.

#### Options

* `--property` (`-P`) (expects a value)
  The property to view

* `--type` (`-t`) (expects a value)
  Filter by type (when selecting a default activity). Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard for the type, e.g. '%var%' to select variable-related activities.

* `--exclude-type` (`-x`) (expects a value)
  Exclude by type (when selecting a default activity). Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard to exclude types.

* `--state` (expects a value)
  Filter by state (when selecting a default activity): in_progress, pending, complete, or cancelled. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--result` (expects a value)
  Filter by result (when selecting a default activity): success or failure

* `--incomplete` (`-i`)
  Include only incomplete activities (when selecting a default activity). This is a shorthand for --state=in_progress,pending

* `--all` (`-a`)
  Check recent activities on all environments (when selecting a default activity)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Find the time a project was created:
```
upsun activity:get --all --type project.create -P completed_at
```

* Find the duration (in seconds) of the last activity:
```
upsun activity:get -P duration
```

## `activity:list`

Get a list of activities for an environment or project

Aliases: `activities`, `act`

### Usage

```
upsun activities [-t|--type TYPE] [-x|--exclude-type EXCLUDE-TYPE] [--limit LIMIT] [--start START] [--state STATE] [--result RESULT] [-i|--incomplete] [-a|--all] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT]
```

#### Options

* `--type` (`-t`) (expects a value)
  Filter activities by type For a list of types see: https://docs.upsun.com/integrations/activity/reference.html#type Values may be split by commas (e.g. "a,b,c") and/or whitespace. The first part of the activity name can be omitted, e.g. 'cron' can select 'environment.cron' activities. The % or * characters can be used as a wildcard, e.g. '%var%' to select variable-related activities.

* `--exclude-type` (`-x`) (expects a value)
  Exclude activities by type. Values may be split by commas (e.g. "a,b,c") and/or whitespace. The first part of the activity name can be omitted, e.g. 'cron' can exclude 'environment.cron' activities. The % or * characters can be used as a wildcard to exclude types.

* `--limit` (expects a value)
  Limit the number of results displayed

* `--start` (expects a value)
  Only activities created before this date will be listed

* `--state` (expects a value)
  Filter activities by state: in_progress, pending, complete, or cancelled. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--result` (expects a value)
  Filter activities by result: success or failure

* `--incomplete` (`-i`)
  Only list incomplete activities

* `--all` (`-a`)
  List activities on all environments

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: id*, created*, description*, progress*, state*, result*, completed, environments, time_build, time_deploy, time_execute, time_wait, type (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* List recent activities for the current environment:
```
upsun activity:list 
```

* List all recent activities for the current project:
```
upsun activity:list --all
```

* List recent pushes:
```
upsun activity:list --type push
```

* List all recent activities excluding crons and redeploys:
```
upsun activity:list --exclude-type '*.cron,*.backup*'
```

* List pushes made before 15 March:
```
upsun activity:list --type push --start 2015-03-15
```

* List up to 25 incomplete activities:
```
upsun activity:list --limit 25 -i
```

## `activity:log`

Display the log for an activity

### Usage

```
upsun activity:log [--refresh REFRESH] [-t|--timestamps] [--type TYPE] [-x|--exclude-type EXCLUDE-TYPE] [--state STATE] [--result RESULT] [-i|--incomplete] [-a|--all] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<id>]
```

#### Arguments

* `id`(optional)
  The activity ID. Defaults to the most recent activity.

#### Options

* `--refresh` (expects a value)
  Activity refresh interval (seconds). Set to 0 to disable refreshing.

* `--timestamps` (`-t`)
  Display a timestamp next to each message

* `--type` (expects a value)
  Filter by type (when selecting a default activity). Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard for the type, e.g. '%var%' to select variable-related activities.

* `--exclude-type` (`-x`) (expects a value)
  Exclude by type (when selecting a default activity). Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard to exclude types.

* `--state` (expects a value)
  Filter by state (when selecting a default activity): in_progress, pending, complete, or cancelled. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--result` (expects a value)
  Filter by result (when selecting a default activity): success or failure

* `--incomplete` (`-i`)
  Include only incomplete activities (when selecting a default activity). This is a shorthand for --state=in_progress,pending

* `--all` (`-a`)
  Check recent activities on all environments (when selecting a default activity)

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Display the log for the last push on the current environment:
```
upsun activity:log --type environment.push
```

* Display the log for the last activity on the current project:
```
upsun activity:log --all
```

* Display the log for the last push, with microsecond timestamps:
```
upsun activity:log -a -t --type %push --date-fmt 'Y-m-d\TH:i:s.uP'
```

## `app:config-get`

View the configuration of an app

### Usage

```
upsun app:config-get [-P|--property PROPERTY] [--refresh] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE]
```

#### Options

* `--property` (`-P`) (expects a value)
  The configuration property to view

* `--refresh`
  Whether to refresh the cache

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--identity-file` (`-i`) (expects a value)
  [Deprecated option, no longer used]

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `app:config-validate`

Validate the config files of a project

Aliases: `validate`

### Usage

```
upsun app:config-validate
```

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|vv|vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Validate the project configuration files in your current directory:
```
upsun app:config-validate 
```

## `app:list`

List apps in the project

Aliases: `apps`

### Usage

```
upsun apps [--refresh] [--pipe] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--refresh`
  Whether to refresh the cache

* `--pipe`
  Output a list of app names only

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: name*, type*, disk, path, size (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `auth:api-token-login`

Log in to Upsun using an API token

### Usage

```
upsun auth:api-token-login
```

Use this command to log in to your Upsun account using an API token.

You can create an account at:
    https://auth.upsun.com/register

Alternatively, to log in to the CLI with a browser, run:
    upsun auth:browser-login

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `auth:browser-login`

Log in to Upsun via a browser

Aliases: `login`

### Usage

```
upsun login [-f|--force] [--method METHOD] [--max-age MAX-AGE] [--browser BROWSER] [--pipe]
```

Use this command to log in to the Upsun CLI using a web browser.

It launches a temporary local website which redirects you to log in if
necessary, and then captures the resulting authorization code.

Your system's default browser will be used. You can override this using the
--browser option.

Alternatively, to log in using an API token (without a browser), run:
upsun auth:api-token-login

To authenticate non-interactively, configure an API token using the
UPSUN_CLI_TOKEN environment variable.

#### Options

* `--force` (`-f`)
  Log in again, even if already logged in

* `--method` (expects a value)
  Require specific authentication method(s)

* `--max-age` (expects a value)
  The maximum age (in seconds) of the web authentication session

* `--browser` (expects a value)
  The browser to use to open the URL. Set 0 for none.

* `--pipe`
  Output the URL to stdout.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `auth:info`

Display your account information

### Usage

```
upsun auth:info [--no-auto-login] [-P|--property PROPERTY] [--refresh] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--] [<property>]
```

#### Arguments

* `property`(optional)
  The account property to view

#### Options

* `--no-auto-login`
  Skips auto login. Nothing will be output if not logged in, and the exit code will be 0, assuming no other errors.

* `--property` (`-P`) (expects a value)
  The account property to view (alternate syntax)

* `--refresh`
  Whether to refresh the cache

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Print your user ID:
```
upsun auth:info id
```

* Print your email address:
```
upsun auth:info email
```

* Print your user ID (or nothing if not logged in):
```
upsun auth:info id --no-auto-login
```

## `auth:logout`

Log out of Upsun

Aliases: `logout`

### Usage

```
upsun logout [-a|--all] [--other]
```

#### Options

* `--all` (`-a`)
  Log out from all local sessions

* `--other`
  Log out from other local sessions

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `auth:verify-phone-number`

Verify your phone number interactively

### Usage

```
upsun auth:verify-phone-number
```

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `backup:create`

Make a backup of an environment

Aliases: `backup`

### Usage

```
upsun backup [--live] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<environment>]
```

#### Arguments

* `environment`(optional)
  The environment

#### Options

* `--live`
  Live backup: do not stop the environment. If set, this leaves the environment running and open to connections during the backup. This reduces downtime, at the risk of backing up data in an inconsistent state.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Make a backup of the current environment:
```
upsun backup:create 
```

* Request a backup (and exit quickly):
```
upsun backup:create --no-wait
```

* Make a backup avoiding downtime (but risking inconsistency):
```
upsun backup:create --live
```

## `backup:delete`

Delete an environment backup

### Usage

```
upsun backup:delete [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<backup>]
```

#### Arguments

* `backup`(optional)
  The ID of the backup. Required in non-interactive mode.

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `backup:get`

View an environment backup

### Usage

```
upsun backup:get [-P|--property PROPERTY] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--date-fmt DATE-FMT] [--] [<backup>]
```

#### Arguments

* `backup`(optional)
  The ID of the backup. Defaults to the most recent one.

#### Options

* `--property` (`-P`) (expects a value)
  The backup property to display.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `backup:list`

List available backups of an environment

Aliases: `backups`

### Usage

```
upsun backups [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT]
```

#### Options

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: created_at*, id*, restorable*, automated, commit_id, expires_at, index, live, status, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Display backups including the "live" and "commit_id" columns:
```
upsun backup:list -c+live,commit_id
```

## `backup:restore`

Restore an environment backup

### Usage

```
upsun backup:restore [--target TARGET] [--branch-from BRANCH-FROM] [--no-code] [--resources-init RESOURCES-INIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<backup>]
```

#### Arguments

* `backup`(optional)
  The ID of the backup. Defaults to the most recent one

#### Options

* `--target` (expects a value)
  The environment to restore to. Defaults to the backup's current environment

* `--branch-from` (expects a value)
  If the --target does not yet exist, this specifies the parent of the new environment

* `--no-code`
  Do not restore code, only data.

* `--resources-init` (expects a value)
  Set the resources to use for new services: parent, default or minimum. If not set, "parent" will be used.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Restore the most recent backup:
```
upsun backup:restore 
```

* Restore a specific backup:
```
upsun backup:restore 92c9a4b2aa75422efb3d
```

## `certificate:add`

Add an SSL certificate to the project

### Usage

```
upsun certificate:add [--cert CERT] [--key KEY] [--chain CHAIN] [-p|--project PROJECT] [-W|--no-wait] [--wait]
```

#### Options

* `--cert` (expects a value)
  The path to the certificate file

* `--key` (expects a value)
  The path to the certificate private key file

* `--chain` (expects a value)
  The path to the certificate chain file

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `certificate:delete`

Delete a certificate from the project

### Usage

```
upsun certificate:delete [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] <id>
```

#### Arguments

* `id`(required)
  The certificate ID (or the start of it)

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `certificate:get`

View a certificate

### Usage

```
upsun certificate:get [-P|--property PROPERTY] [--date-fmt DATE-FMT] [-p|--project PROJECT] [--] <id>
```

#### Arguments

* `id`(required)
  The certificate ID (or the start of it)

#### Options

* `--property` (`-P`) (expects a value)
  The certificate property to view

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `certificate:list`

List project certificates

Aliases: `certificates`, `certs`

### Usage

```
upsun certificates [--domain DOMAIN] [--exclude-domain EXCLUDE-DOMAIN] [--issuer ISSUER] [--only-auto] [--no-auto] [--ignore-expiry] [--only-expired] [--no-expired] [--pipe-domains] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT]
```

#### Options

* `--domain` (expects a value)
  Filter by domain name (case-insensitive search)

* `--exclude-domain` (expects a value)
  Exclude certificates, matching by domain name (case-insensitive search)

* `--issuer` (expects a value)
  Filter by issuer

* `--only-auto`
  Show only auto-provisioned certificates

* `--no-auto`
  Show only manually added certificates

* `--ignore-expiry`
  Show both expired and non-expired certificates

* `--only-expired`
  Show only expired certificates

* `--no-expired`
  Show only non-expired certificates (default)

* `--pipe-domains`
  Only return a list of domain names covered by the certificates

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: created, domains, expires, id, issuer. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Output a list of domains covered by valid certificates:
```
upsun certificate:list --pipe-domains --no-expired
```

## `commit:get`

Show commit details

### Usage

```
upsun commit:get [-P|--property PROPERTY] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--date-fmt DATE-FMT] [--] [<commit>]
```

#### Arguments

* `commit`(optional)
  The commit SHA. This can also accept "HEAD", and caret (^) or tilde (~) suffixes for parent commits.

#### Options

* `--property` (`-P`) (expects a value)
  The commit property to display.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Display the current commit on the environment:
```
upsun commit:get 
```

* Display the previous commit:
```
upsun commit:get HEAD~
```

* Display the 3rd commit before the current one:
```
upsun commit:get HEAD~3
```

* Display the email address of the last commit author:
```
upsun commit:get -P author.email
```

## `commit:list`

List commits

Aliases: `commits`

### Usage

```
upsun commits [--limit LIMIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [--] [<commit>]
```

#### Arguments

* `commit`(optional)
  The starting Git commit SHA. This can also accept "HEAD", and caret (^) or tilde (~) suffixes for parent commits.

#### Options

* `--limit` (expects a value)
  The number of commits to display.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: author, date, sha, summary. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Display commits on an environment:
```
upsun commit:list 
```

* Display commits starting from two before the current one:
```
upsun commit:list HEAD~2
```

## `db:dump`

Create a local dump of the remote database

### Usage

```
upsun db:dump [--schema SCHEMA] [-f|--file FILE] [-d|--directory DIRECTORY] [-z|--gzip] [-t|--timestamp] [-o|--stdout] [--table TABLE] [--exclude-table EXCLUDE-TABLE] [--schema-only] [--charset CHARSET] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [-r|--relationship RELATIONSHIP]
```

#### Options

* `--schema` (expects a value)
  The schema to dump. Omit to use the default schema (usually "main").

* `--file` (`-f`) (expects a value)
  A custom filename for the dump

* `--directory` (`-d`) (expects a value)
  A custom directory for the dump

* `--gzip` (`-z`)
  Compress the dump using gzip

* `--timestamp` (`-t`)
  Add a timestamp to the dump filename

* `--stdout` (`-o`)
  Output to STDOUT instead of a file

* `--table` (expects a value)
  Table(s) to include

* `--exclude-table` (expects a value)
  Table(s) to exclude

* `--schema-only`
  Dump only schemas, no data

* `--charset` (expects a value)
  The character set encoding for the dump

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Create an SQL dump file:
```
upsun db:dump 
```

* Create a gzipped SQL dump file named "dump.sql.gz":
```
upsun db:dump --gzip -f dump.sql.gz
```

## `db:sql`

Run SQL on the remote database

Aliases: `sql`

### Usage

```
upsun sql [--raw] [--schema SCHEMA] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [-r|--relationship RELATIONSHIP] [--] [<query>]
```

#### Arguments

* `query`(optional)
  An SQL statement to execute

#### Options

* `--raw`
  Produce raw, non-tabular output

* `--schema` (expects a value)
  The schema to use. Omit to use the default schema (usually "main"). Pass an empty string to not use any schema.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Open an SQL console on the remote database:
```
upsun db:sql 
```

* View tables on the remote database:
```
upsun db:sql 'SHOW TABLES'
```

* Import a dump file into the remote database:
```
upsun db:sql < dump.sql
```

## `domain:add`

Add a new domain to the project

### Usage

```
upsun domain:add [--cert CERT] [--key KEY] [--chain CHAIN] [--attach ATTACH] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] <name>
```

#### Arguments

* `name`(required)
  The domain name

#### Options

* `--cert` (expects a value)
  The path to a custom certificate file

* `--key` (expects a value)
  The path to the private key for the custom certificate

* `--chain` (expects a value)
  The path to the chain file(s) for the custom certificate

* `--attach` (expects a value)
  The production domain that this one replaces in the environment's routes. Required for non-production environment domains.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Add the domain example.com:
```
upsun domain:add example.com
```

* Add the domain example.org with a custom SSL/TLS certificate:
```
upsun domain:add example.org --cert example-org.crt --key example-org.key
```

## `domain:delete`

Delete a domain from the project

### Usage

```
upsun domain:delete [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] <name>
```

#### Arguments

* `name`(required)
  The domain name

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Delete the domain example.com:
```
upsun domain:delete example.com
```

## `domain:get`

Show detailed information for a domain

### Usage

```
upsun domain:get [-P|--property PROPERTY] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<name>]
```

#### Arguments

* `name`(optional)
  The domain name

#### Options

* `--property` (`-P`) (expects a value)
  The domain property to view

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `domain:list`

Get a list of all domains

Aliases: `domains`

### Usage

```
upsun domains [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-e|--environment ENVIRONMENT]
```

#### Options

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: name*, ssl*, created_at*, registered_name, replacement_for, type, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `domain:update`

Update a domain

### Usage

```
upsun domain:update [--cert CERT] [--key KEY] [--chain CHAIN] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] <name>
```

#### Arguments

* `name`(required)
  The domain name

#### Options

* `--cert` (expects a value)
  The path to a custom certificate file

* `--key` (expects a value)
  The path to the private key for the custom certificate

* `--chain` (expects a value)
  The path to the chain file(s) for the custom certificate

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Update the custom certificate for the domain example.org:
```
upsun domain:update example.org --cert example-org.crt --key example-org.key
```

## `environment:activate`

Activate an environment

### Usage

```
upsun environment:activate [--parent PARENT] [--resources-init RESOURCES-INIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<environment>]...
```

#### Arguments

* `environment`(optional; multiple values allowed)
  The environment(s) to activate

#### Options

* `--parent` (expects a value)
  Set a new environment parent before activating

* `--resources-init` (expects a value)
  Set the resources to use for new services: parent, default or minimum. If not set, "parent" will be used.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Activate the environments "develop" and "stage":
```
upsun environment:activate develop stage
```

## `environment:branch`

Branch an environment

Aliases: `branch`

### Usage

```
upsun branch [--title TITLE] [--type TYPE] [--no-clone-parent] [--no-checkout] [--resources-init RESOURCES-INIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<id>] [<parent>]
```

#### Arguments

* `id`(optional)
  The ID (branch name) of the new environment

* `parent`(optional)
  The parent of the new environment

#### Options

* `--title` (expects a value)
  The title of the new environment

* `--type` (expects a value)
  The type of the new environment

* `--no-clone-parent`
  Do not clone the parent environment's data

* `--no-checkout`
  Do not check out the branch locally

* `--resources-init` (expects a value)
  Set the resources to use for new services: parent, default or minimum. If not set, "parent" will be used.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Create a new branch "sprint-2", based on "develop":
```
upsun environment:branch sprint-2 develop
```

## `environment:checkout`

Check out an environment

Aliases: `checkout`

### Usage

```
upsun checkout [<id>]
```

#### Arguments

* `id`(optional)
  The ID of the environment to check out. For example: "sprint2"

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Check out the environment "develop":
```
upsun environment:checkout develop
```

## `environment:delete`

Delete one or more environments

### Usage

```
upsun environment:delete [--delete-branch] [--no-delete-branch] [--type TYPE] [-t|--only-type ONLY-TYPE] [--exclude EXCLUDE] [--exclude-type EXCLUDE-TYPE] [--inactive] [--status STATUS] [--only-status ONLY-STATUS] [--exclude-status EXCLUDE-STATUS] [--merged] [--allow-delete-parent] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<environment>]...
```

When a Upsun environment is deleted, it will become "inactive": it will
exist only as a Git branch, containing code but no services, databases nor
files.

This command allows you to delete environments as well as their Git branches.

#### Arguments

* `environment`(optional; multiple values allowed)
  The environment(s) to delete. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

#### Options

* `--delete-branch`
  Delete Git branch(es) for inactive environments, without confirmation

* `--no-delete-branch`
  Do not delete any Git branch(es) (inactive environments)

* `--type` (expects a value)
  Delete all environments of a type (adding to any others selected) Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--only-type` (`-t`) (expects a value)
  Only delete environments of a specific type Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--exclude` (expects a value)
  Environment(s) not to delete. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--exclude-type` (expects a value)
  Environment type(s) of which not to delete Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--inactive`
  Delete all inactive environments (adding to any others selected)

* `--status` (expects a value)
  Delete all environments of a status (adding to any others selected) Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--only-status` (expects a value)
  Only delete environments of a specific status Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--exclude-status` (expects a value)
  Environment status(es) of which not to delete Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--merged`
  Delete all merged environments (adding to any others selected)

* `--allow-delete-parent`
  Allow environments that have children to be deleted

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Delete the currently checked out environment:
```
upsun environment:delete 
```

* Delete the environments "test" and "example-1":
```
upsun environment:delete test example-1
```

* Delete all inactive environments:
```
upsun environment:delete --inactive
```

* Delete all environments merged with their parent:
```
upsun environment:delete --merged
```

## `environment:drush`

Run a drush command on the remote environment

Aliases: `drush`

### Usage

```
upsun drush [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--] [<cmd>]...
```

#### Arguments

* `cmd`(optional; multiple values allowed)
  A command to pass to Drush

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Run "drush status" on the remote environment:
```
upsun environment:drush status
```

* Enable the Overlay module on the remote environment:
```
upsun environment:drush en overlay
```

* Get a one-time login link (using -- before options):
```
upsun environment:drush user-login -- --mail=name@example.com
```

* Alternative syntax (quoting the whole command):
```
upsun environment:drush 'user-login --mail=name@example.com'
```

## `environment:http-access`

Update HTTP access settings for an environment

Aliases: `httpaccess`

### Usage

```
upsun httpaccess [--access ACCESS] [--auth AUTH] [--enabled ENABLED] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait]
```

#### Options

* `--access` (expects a value)
  Access restriction in the format "permission:address". Use 0 to clear all addresses.

* `--auth` (expects a value)
  HTTP Basic auth credentials in the format "username:password". Use 0 to clear all credentials.

* `--enabled` (expects a value)
  Whether access control should be enabled: 1 to enable, 0 to disable

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Require a username and password:
```
upsun environment:http-access --auth myname:mypassword
```

* Restrict access to only one IP address:
```
upsun environment:http-access --access allow:69.208.1.192 --access deny:any
```

* Remove the password requirement, keeping IP restrictions:
```
upsun environment:http-access --auth 0
```

* Disable all HTTP access control:
```
upsun environment:http-access --enabled 0
```

## `environment:info`

Read or set properties for an environment

### Usage

```
upsun environment:info [--refresh] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<property>] [<value>]
```

#### Arguments

* `property`(optional)
  The name of the property

* `value`(optional)
  Set a new value for the property

#### Options

* `--refresh`
  Whether to refresh the cache

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Read all environment properties:
```
upsun environment:info 
```

* Show the environment's status:
```
upsun environment:info status
```

* Show the date the environment was created:
```
upsun environment:info created_at
```

* Enable email sending:
```
upsun environment:info enable_smtp true
```

* Change the environment title:
```
upsun environment:info title "New feature"
```

* Change the environment's parent branch:
```
upsun environment:info parent sprint-2
```

* Unset the environment's parent branch:
```
upsun environment:info parent -
```

## `environment:init`

Initialize an environment from a public Git repository

### Usage

```
upsun environment:init [--profile PROFILE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] <url>
```

#### Arguments

* `url`(required)
  A URL to a Git repository

#### Options

* `--profile` (expects a value)
  The name of the profile

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `environment:list`

Get a list of environments

Aliases: `environments`, `env`

### Usage

```
upsun environments [-I|--no-inactive] [--status STATUS] [--pipe] [--refresh REFRESH] [--sort SORT] [--reverse] [--type TYPE] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT]
```

#### Options

* `--no-inactive` (`-I`)
  Do not show inactive environments

* `--status` (expects a value)
  Filter environments by status (active, inactive, dirty, paused, deleting). Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--pipe`
  Output a simple list of environment IDs.

* `--refresh` (expects a value)
  Whether to refresh the list.

* `--sort` (expects a value)
  A property to sort by

* `--reverse`
  Sort in reverse (descending) order

* `--type` (expects a value)
  Filter the list by environment type(s). Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: id*, title*, status*, type*, created, machine_name, updated (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `environment:logs`

Read an environment's logs

Aliases: `log`

### Usage

```
upsun log [--lines LINES] [--tail] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE] [--] [<type>]
```

#### Arguments

* `type`(optional)
  The log type, e.g. "access" or "error"

#### Options

* `--lines` (expects a value)
  The number of lines to show

* `--tail`
  Continuously tail the log

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Display a choice of logs that can be read:
```
upsun environment:logs 
```

* Read the deploy log:
```
upsun environment:logs deploy
```

* Read the access log continuously:
```
upsun environment:logs access --tail
```

* Read the last 500 lines of the cron log:
```
upsun environment:logs cron --lines 500
```

## `environment:merge`

Merge an environment

Aliases: `merge`

### Usage

```
upsun merge [--resources-init RESOURCES-INIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<environment>]
```

This command will initiate a Git merge of the specified environment into its parent environment.

#### Arguments

* `environment`(optional)
  The environment to merge

#### Options

* `--resources-init` (expects a value)
  Set the resources to use for new services: child, default, minimum or manual. If not set, "child" will be used.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Merge the environment "sprint-2" into its parent:
```
upsun environment:merge sprint-2
```

## `environment:pause`

Pause an environment

### Usage

```
upsun environment:pause [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait]
```

Pausing an environment helps to reduce resource consumption and carbon emissions.

The environment will be unavailable until it is resumed. No data will be lost.

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `environment:push`

Push code to an environment

Aliases: `push`

### Usage

```
upsun push [--target TARGET] [-f|--force] [--force-with-lease] [-u|--set-upstream] [--activate] [--parent PARENT] [--type TYPE] [--no-clone-parent] [--resources-init RESOURCES-INIT] [-W|--no-wait] [--wait] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<source>]
```

#### Arguments

* `source`(optional)
  The Git source ref, e.g. a branch name or a commit hash.

#### Options

* `--target` (expects a value)
  The target branch name. Defaults to the current branch.

* `--force` (`-f`)
  Allow non-fast-forward updates

* `--force-with-lease`
  Allow non-fast-forward updates, if the remote-tracking branch is up to date

* `--set-upstream` (`-u`)
  Set the target environment as the upstream for the source branch. This will also set the target project as the remote for the local repository.

* `--activate`
  Activate the environment. Paused environments will be resumed. This will ensure the environment is active even if no changes were pushed.

* `--parent` (expects a value)
  Set the environment parent (only used with --activate)

* `--type` (expects a value)
  Set the environment type (only used with --activate )

* `--no-clone-parent`
  Do not clone the parent branch's data (only used with --activate)

* `--resources-init` (expects a value)
  Set the resources to use for new services: parent, default, minimum, or manual. Currently the default is "default" but this will change to "parent" in future.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Push code to the current environment:
```
upsun environment:push 
```

* Push code, without waiting for deployment:
```
upsun environment:push --no-wait
```

* Push code, branching or activating the environment as a child of 'develop':
```
upsun environment:push --activate --parent develop
```

## `environment:redeploy`

Redeploy an environment

Aliases: `redeploy`

### Usage

```
upsun redeploy [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait]
```

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `environment:relationships`

Show an environment's relationships

Aliases: `relationships`, `rel`

### Usage

```
upsun relationships [-P|--property PROPERTY] [--refresh] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--] [<environment>]
```

#### Arguments

* `environment`(optional)
  The environment

#### Options

* `--property` (`-P`) (expects a value)
  The relationship property to view

* `--refresh`
  Whether to refresh the relationships

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View all the current environment's relationships:
```
upsun environment:relationships 
```

* View the 'main' environment's relationships:
```
upsun environment:relationships main
```

* View the 'main' environment's database port:
```
upsun environment:relationships main --property database.0.port
```

## `environment:resume`

Resume a paused environment

### Usage

```
upsun environment:resume [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait]
```

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `environment:scp`

Copy files to and from an environment using scp

Aliases: `scp`

### Usage

```
upsun scp [-r|--recursive] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE] [--] [<files>]...
```

#### Arguments

* `files`(optional; multiple values allowed)
  Files to copy. Use the remote: prefix to define remote locations.

#### Options

* `--recursive` (`-r`)
  Recursively copy entire directories

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Copy local files a.txt and b.txt to remote mount var/files:
```
upsun environment:scp a.txt b.txt remote:var/files
```

* Copy remote files c.txt to current directory:
```
upsun environment:scp remote:c.txt .
```

* Copy subdirectory dump/ to remote mount var/files:
```
upsun environment:scp -r dump remote:var/logs
```

* Copy files inside subdirectory dump/ to remote mount var/files:
```
upsun environment:scp -r dump/* remote:var/logs
```

## `environment:ssh`

SSH to the current environment

Aliases: `ssh`

### Usage

```
upsun ssh [--pipe] [--all] [-o|--option OPTION] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE] [--] [<cmd>]...
```

#### Arguments

* `cmd`(optional; multiple values allowed)
  A command to run on the environment.

#### Options

* `--pipe`
  Output the SSH URL only.

* `--all`
  Output all SSH URLs (for every app).

* `--option` (`-o`) (expects a value)
  Pass an extra option to SSH

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Open a shell over SSH:
```
upsun environment:ssh 
```

* Pass an extra option to SSH:
```
upsun environment:ssh -o 'RequestTTY force'
```

* List files:
```
upsun environment:ssh ls
```

* Monitor the app log (use '--' before flags):
```
upsun environment:ssh tail /var/log/app.log -- -n50 -f
```

* Display relationships (use quotes for complex syntax):
```
upsun environment:ssh 'echo $PLATFORM_RELATIONSHIPS | base64 --decode'
```

## `environment:synchronize`

Synchronize an environment's code, data and/or resources from its parent

Aliases: `sync`

### Usage

```
upsun sync [--rebase] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<synchronize>]...
```

This command synchronizes to a child environment from its parent environment.

Synchronizing "code" means there will be a Git merge from the parent to the
child.

Synchronizing "data" means that all files in all services (including
static files, databases, logs, search indices, etc.) will be copied from the
parent to the child.

Synchronizing "resources" means that the parent environment's resource sizes
will be used for all corresponding apps and services in the child environment.

#### Arguments

* `synchronize`(optional; multiple values allowed)
  List what to synchronize: "code", "data", and/or "resources".

#### Options

* `--rebase`
  Synchronize code by rebasing instead of merging

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Synchronize data from the parent environment:
```
upsun environment:synchronize data
```

* Synchronize code and data from the parent environment:
```
upsun environment:synchronize code data
```

* Synchronize code, data and resources from the parent environment:
```
upsun environment:synchronize code data resources
```

## `environment:url`

Get the public URLs of an environment

Aliases: `url`

### Usage

```
upsun url [-1|--primary] [--browser BROWSER] [--pipe] [-p|--project PROJECT] [-e|--environment ENVIRONMENT]
```

#### Options

* `--primary` (`-1`)
  Only return the URL for the primary route

* `--browser` (expects a value)
  The browser to use to open the URL. Set 0 for none.

* `--pipe`
  Output the URL to stdout.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Give a choice of URLs to open (or print all URLs if there is no browser):
```
upsun environment:url 
```

* Print all URLs:
```
upsun environment:url --pipe
```

* Print and/or open the primary route URL:
```
upsun environment:url --primary
```

* Print the primary route URL:
```
upsun environment:url --primary --pipe
```

## `environment:xdebug`

Open a tunnel to Xdebug on the environment

Aliases: `xdebug`

### Usage

```
upsun xdebug [--port PORT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE]
```

#### Options

* `--port` (expects a value)
  The local port

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Connect to Xdebug on the environment, listening locally on port 9000.:
```
upsun environment:xdebug 
```

## `integration:activity:get`

View detailed information on a single integration activity

### Usage

```
upsun integration:activity:get [-P|--property PROPERTY] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [--] [<integration>] [<activity>]
```

#### Arguments

* `integration`(optional)
  An integration ID. Leave blank to choose from a list.

* `activity`(optional)
  The activity ID. Defaults to the most recent integration activity.

#### Options

* `--property` (`-P`) (expects a value)
  The property to view

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  [Deprecated option, not used]

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `integration:activity:list`

Get a list of activities for an integration

Aliases: `integration:activities`

### Usage

```
upsun integration:activities [--type TYPE] [-x|--exclude-type EXCLUDE-TYPE] [--limit LIMIT] [--start START] [--state STATE] [--result RESULT] [-i|--incomplete] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<id>]
```

#### Arguments

* `id`(optional)
  An integration ID. Leave blank to choose from a list.

#### Options

* `--type` (expects a value)
  Filter activities by type. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--exclude-type` (`-x`) (expects a value)
  Exclude activities by type. Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters can be used as a wildcard to exclude types.

* `--limit` (expects a value)
  Limit the number of results displayed

* `--start` (expects a value)
  Only activities created before this date will be listed

* `--state` (expects a value)
  Filter activities by state. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--result` (expects a value)
  Filter activities by result

* `--incomplete` (`-i`)
  Only list incomplete activities

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: id*, created*, description*, type*, state*, result*, completed, progress, time_build, time_deploy, time_execute, time_wait (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  [Deprecated option, not used]

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `integration:activity:log`

Display the log for an integration activity

### Usage

```
upsun integration:activity:log [-t|--timestamps] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<integration>] [<activity>]
```

#### Arguments

* `integration`(optional)
  An integration ID. Leave blank to choose from a list.

* `activity`(optional)
  The activity ID. Defaults to the most recent integration activity.

#### Options

* `--timestamps` (`-t`)
  Display a timestamp next to each message

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  [Deprecated option, not used]

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `integration:add`

Add an integration to the project

### Usage

```
upsun integration:add [--type TYPE] [--base-url BASE-URL] [--bitbucket-url BITBUCKET-URL] [--username USERNAME] [--token TOKEN] [--key KEY] [--secret SECRET] [--license-key LICENSE-KEY] [--server-project SERVER-PROJECT] [--repository REPOSITORY] [--build-merge-requests BUILD-MERGE-REQUESTS] [--build-pull-requests BUILD-PULL-REQUESTS] [--build-draft-pull-requests BUILD-DRAFT-PULL-REQUESTS] [--build-pull-requests-post-merge BUILD-PULL-REQUESTS-POST-MERGE] [--build-wip-merge-requests BUILD-WIP-MERGE-REQUESTS] [--merge-requests-clone-parent-data MERGE-REQUESTS-CLONE-PARENT-DATA] [--pull-requests-clone-parent-data PULL-REQUESTS-CLONE-PARENT-DATA] [--resync-pull-requests RESYNC-PULL-REQUESTS] [--fetch-branches FETCH-BRANCHES] [--prune-branches PRUNE-BRANCHES] [--resources-init RESOURCES-INIT] [--url URL] [--shared-key SHARED-KEY] [--file FILE] [--events EVENTS] [--states STATES] [--environments ENVIRONMENTS] [--excluded-environments EXCLUDED-ENVIRONMENTS] [--from-address FROM-ADDRESS] [--recipients RECIPIENTS] [--channel CHANNEL] [--routing-key ROUTING-KEY] [--category CATEGORY] [--index INDEX] [--sourcetype SOURCETYPE] [--protocol PROTOCOL] [--syslog-host SYSLOG-HOST] [--syslog-port SYSLOG-PORT] [--facility FACILITY] [--message-format MESSAGE-FORMAT] [--auth-mode AUTH-MODE] [--auth-token AUTH-TOKEN] [--verify-tls VERIFY-TLS] [--header HEADER] [-p|--project PROJECT] [-W|--no-wait] [--wait]
```

#### Options

* `--type` (expects a value)
  The integration type ('bitbucket', 'bitbucket_server', 'github', 'gitlab', 'webhook', 'health.email', 'health.pagerduty', 'health.slack', 'health.webhook', 'httplog', 'script', 'newrelic', 'splunk', 'sumologic', 'syslog')

* `--base-url` (expects a value)
  The base URL of the server installation

* `--bitbucket-url` (expects a value)
  The base URL of the Bitbucket Server installation

* `--username` (expects a value)
  The Bitbucket Server username

* `--token` (expects a value)
  An authentication or access token for the integration

* `--key` (expects a value)
  A Bitbucket OAuth consumer key

* `--secret` (expects a value)
  A Bitbucket OAuth consumer secret

* `--license-key` (expects a value)
  The New Relic Logs license key

* `--server-project` (expects a value)
  The project (e.g. 'namespace/repo')

* `--repository` (expects a value)
  The repository to track (e.g. 'owner/repository')

* `--build-merge-requests` (expects a value)
  GitLab: build merge requests as environments

* `--build-pull-requests` (expects a value)
  Build every pull request as an environment

* `--build-draft-pull-requests` (expects a value)
  Build draft pull requests

* `--build-pull-requests-post-merge` (expects a value)
  Build pull requests based on their post-merge state

* `--build-wip-merge-requests` (expects a value)
  GitLab: build WIP merge requests

* `--merge-requests-clone-parent-data` (expects a value)
  GitLab: clone data for merge requests

* `--pull-requests-clone-parent-data` (expects a value)
  Clone the parent environment's data for pull requests

* `--resync-pull-requests` (expects a value)
  Re-sync pull request environment data on every build

* `--fetch-branches` (expects a value)
  Fetch all branches from the remote (as inactive environments)

* `--prune-branches` (expects a value)
  Delete branches that do not exist on the remote

* `--resources-init` (expects a value)
  The resources to use when initializing a new service ('minimum', 'default', 'manual', 'parent')

* `--url` (expects a value)
  The URL or API endpoint for the integration

* `--shared-key` (expects a value)
  Webhook: the JWS shared secret key

* `--file` (expects a value)
  The name of a local file that contains the script to upload

* `--events` (expects a value)
  A list of events to act on, e.g. environment.push

* `--states` (expects a value)
  A list of states to act on, e.g. pending, in_progress, complete

* `--environments` (expects a value)
  The environment IDs to include

* `--excluded-environments` (expects a value)
  The environment IDs to exclude

* `--from-address` (expects a value)
  [Optional] Custom From address for alert emails

* `--recipients` (expects a value)
  The recipient email address(es)

* `--channel` (expects a value)
  The Slack channel

* `--routing-key` (expects a value)
  The PagerDuty routing key

* `--category` (expects a value)
  The Sumo Logic category, used for filtering

* `--index` (expects a value)
  The Splunk index

* `--sourcetype` (expects a value)
  The Splunk event source type

* `--protocol` (expects a value)
  Syslog transport protocol ('tcp', 'udp', 'tls')

* `--syslog-host` (expects a value)
  Syslog relay/collector host

* `--syslog-port` (expects a value)
  Syslog relay/collector port

* `--facility` (expects a value)
  Syslog facility

* `--message-format` (expects a value)
  Syslog message format ('rfc3164' or 'rfc5424')

* `--auth-mode` (expects a value)
  Authentication mode ('prefix' or 'structured_data')

* `--auth-token` (expects a value)
  Authentication token

* `--verify-tls` (expects a value)
  Whether HTTPS certificate verification should be enabled (recommended)

* `--header` (expects a value)
  HTTP header(s) to use in POST requests. Separate names and values with a colon (:).

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Add an integration with a GitHub repository:
```
upsun integration:add --type github --repository myuser/example-repo --token 9218376e14c2797e0d06e8d2f918d45f --fetch-branches 0
```

* Add an integration with a GitLab repository:
```
upsun integration:add --type gitlab --server-project mygroup/example-repo --token 22fe4d70dfbc20e4f668568a0b5422e2 --base-url https://gitlab.example.com
```

## `integration:delete`

Delete an integration from a project

### Usage

```
upsun integration:delete [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] [<id>]
```

#### Arguments

* `id`(optional)
  The integration ID. Leave blank to choose from a list.

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `integration:get`

View details of an integration

### Usage

```
upsun integration:get [-P|--property [PROPERTY]] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [--] [<id>]
```

#### Arguments

* `id`(optional)
  An integration ID. Leave blank to choose from a list.

#### Options

* `--property` (`-P`) (expects a value)
  The integration property to view

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `integration:list`

View a list of project integration(s)

Aliases: `integrations`

### Usage

```
upsun integrations [-t|--type TYPE] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT]
```

#### Options

* `--type` (`-t`) (expects a value)
  Filter by type

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: id, summary, type. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `integration:update`

Update an integration

### Usage

```
upsun integration:update [--type TYPE] [--base-url BASE-URL] [--bitbucket-url BITBUCKET-URL] [--username USERNAME] [--token TOKEN] [--key KEY] [--secret SECRET] [--license-key LICENSE-KEY] [--server-project SERVER-PROJECT] [--repository REPOSITORY] [--build-merge-requests BUILD-MERGE-REQUESTS] [--build-pull-requests BUILD-PULL-REQUESTS] [--build-draft-pull-requests BUILD-DRAFT-PULL-REQUESTS] [--build-pull-requests-post-merge BUILD-PULL-REQUESTS-POST-MERGE] [--build-wip-merge-requests BUILD-WIP-MERGE-REQUESTS] [--merge-requests-clone-parent-data MERGE-REQUESTS-CLONE-PARENT-DATA] [--pull-requests-clone-parent-data PULL-REQUESTS-CLONE-PARENT-DATA] [--resync-pull-requests RESYNC-PULL-REQUESTS] [--fetch-branches FETCH-BRANCHES] [--prune-branches PRUNE-BRANCHES] [--resources-init RESOURCES-INIT] [--url URL] [--shared-key SHARED-KEY] [--file FILE] [--events EVENTS] [--states STATES] [--environments ENVIRONMENTS] [--excluded-environments EXCLUDED-ENVIRONMENTS] [--from-address FROM-ADDRESS] [--recipients RECIPIENTS] [--channel CHANNEL] [--routing-key ROUTING-KEY] [--category CATEGORY] [--index INDEX] [--sourcetype SOURCETYPE] [--protocol PROTOCOL] [--syslog-host SYSLOG-HOST] [--syslog-port SYSLOG-PORT] [--facility FACILITY] [--message-format MESSAGE-FORMAT] [--auth-mode AUTH-MODE] [--auth-token AUTH-TOKEN] [--verify-tls VERIFY-TLS] [--header HEADER] [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] [<id>]
```

#### Arguments

* `id`(optional)
  The ID of the integration to update

#### Options

* `--type` (expects a value)
  The integration type ('bitbucket', 'bitbucket_server', 'github', 'gitlab', 'webhook', 'health.email', 'health.pagerduty', 'health.slack', 'health.webhook', 'httplog', 'script', 'newrelic', 'splunk', 'sumologic', 'syslog')

* `--base-url` (expects a value)
  The base URL of the server installation

* `--bitbucket-url` (expects a value)
  The base URL of the Bitbucket Server installation

* `--username` (expects a value)
  The Bitbucket Server username

* `--token` (expects a value)
  An authentication or access token for the integration

* `--key` (expects a value)
  A Bitbucket OAuth consumer key

* `--secret` (expects a value)
  A Bitbucket OAuth consumer secret

* `--license-key` (expects a value)
  The New Relic Logs license key

* `--server-project` (expects a value)
  The project (e.g. 'namespace/repo')

* `--repository` (expects a value)
  The repository to track (e.g. 'owner/repository')

* `--build-merge-requests` (expects a value)
  GitLab: build merge requests as environments

* `--build-pull-requests` (expects a value)
  Build every pull request as an environment

* `--build-draft-pull-requests` (expects a value)
  Build draft pull requests

* `--build-pull-requests-post-merge` (expects a value)
  Build pull requests based on their post-merge state

* `--build-wip-merge-requests` (expects a value)
  GitLab: build WIP merge requests

* `--merge-requests-clone-parent-data` (expects a value)
  GitLab: clone data for merge requests

* `--pull-requests-clone-parent-data` (expects a value)
  Clone the parent environment's data for pull requests

* `--resync-pull-requests` (expects a value)
  Re-sync pull request environment data on every build

* `--fetch-branches` (expects a value)
  Fetch all branches from the remote (as inactive environments)

* `--prune-branches` (expects a value)
  Delete branches that do not exist on the remote

* `--resources-init` (expects a value)
  The resources to use when initializing a new service ('minimum', 'default', 'manual', 'parent')

* `--url` (expects a value)
  The URL or API endpoint for the integration

* `--shared-key` (expects a value)
  Webhook: the JWS shared secret key

* `--file` (expects a value)
  The name of a local file that contains the script to upload

* `--events` (expects a value)
  A list of events to act on, e.g. environment.push

* `--states` (expects a value)
  A list of states to act on, e.g. pending, in_progress, complete

* `--environments` (expects a value)
  The environment IDs to include

* `--excluded-environments` (expects a value)
  The environment IDs to exclude

* `--from-address` (expects a value)
  [Optional] Custom From address for alert emails

* `--recipients` (expects a value)
  The recipient email address(es)

* `--channel` (expects a value)
  The Slack channel

* `--routing-key` (expects a value)
  The PagerDuty routing key

* `--category` (expects a value)
  The Sumo Logic category, used for filtering

* `--index` (expects a value)
  The Splunk index

* `--sourcetype` (expects a value)
  The Splunk event source type

* `--protocol` (expects a value)
  Syslog transport protocol ('tcp', 'udp', 'tls')

* `--syslog-host` (expects a value)
  Syslog relay/collector host

* `--syslog-port` (expects a value)
  Syslog relay/collector port

* `--facility` (expects a value)
  Syslog facility

* `--message-format` (expects a value)
  Syslog message format ('rfc3164' or 'rfc5424')

* `--auth-mode` (expects a value)
  Authentication mode ('prefix' or 'structured_data')

* `--auth-token` (expects a value)
  Authentication token

* `--verify-tls` (expects a value)
  Whether HTTPS certificate verification should be enabled (recommended)

* `--header` (expects a value)
  HTTP header(s) to use in POST requests. Separate names and values with a colon (:).

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Switch on the "fetch branches" option for a specific integration:
```
upsun integration:update ZXhhbXBsZSB --fetch-branches 1
```

## `integration:validate`

Validate an existing integration

### Usage

```
upsun integration:validate [-p|--project PROJECT] [--] [<id>]
```

This command allows you to check whether an integration is valid.

An exit code of 0 means the integration is valid, while 4 means it is invalid.
Any other exit code indicates an unexpected error.

Integrations are validated automatically on creation and on update. However,
because they involve external resources, it is possible for a valid integration
to become invalid. For example, an access token may be revoked, or an external
repository may be deleted.

#### Arguments

* `id`(optional)
  An integration ID. Leave blank to choose from a list.

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `local:dir`

Find the local project root

Aliases: `dir`

### Usage

```
upsun dir [<subdir>]
```

#### Arguments

* `subdir`(optional)
  The subdirectory to find ('local', 'web' or 'shared')

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `metrics:all`

Show CPU, disk and memory metrics for an environment

Aliases: `metrics`, `met`

### Usage

```
upsun metrics [-B|--bytes] [-r|--range RANGE] [-i|--interval INTERVAL] [--to TO] [-1|--latest] [-s|--service SERVICE] [--type TYPE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT]
```

#### Options

* `--bytes` (`-B`)
  Show sizes in bytes

* `--range` (`-r`) (expects a value)
  The time range. Metrics will be loaded for this duration until the end time (--to). You can specify units: hours (h), minutes (m), or seconds (s). Minimum 5m, maximum 8h or more (depending on the project), default 10m.

* `--interval` (`-i`) (expects a value)
  The time interval. Defaults to a division of the range. You can specify units: hours (h), minutes (m), or seconds (s). Minimum 1m.

* `--to` (expects a value)
  The end time. Defaults to now.

* `--latest` (`-1`)
  Show only the latest single data point

* `--service` (`-s`) (expects a value)
  Filter by service or application name The % or * characters may be used as a wildcard.

* `--type` (expects a value)
  Filter by service type (if --service is not provided). The version is not required. The % or * characters may be used as a wildcard.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: timestamp*, service*, cpu_percent*, mem_percent*, disk_percent*, tmp_disk_percent*, cpu_limit, cpu_used, disk_limit, disk_used, inodes_limit, inodes_percent, inodes_used, mem_limit, mem_used, tmp_disk_limit, tmp_disk_used, tmp_inodes_limit, tmp_inodes_percent, tmp_inodes_used, type (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Show metrics for the last 10m:
```
upsun metrics:all 
```

* Show metrics in five-minute intervals over the last hour:
```
upsun metrics:all -i 5m -r 1h
```

* Show metrics for all SQL services:
```
upsun metrics:all --type mariadb,%sql
```

## `metrics:cpu`

Show CPU usage of an environment

Aliases: `cpu`

### Usage

```
upsun cpu [-r|--range RANGE] [-i|--interval INTERVAL] [--to TO] [-1|--latest] [-s|--service SERVICE] [--type TYPE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT]
```

#### Options

* `--range` (`-r`) (expects a value)
  The time range. Metrics will be loaded for this duration until the end time (--to). You can specify units: hours (h), minutes (m), or seconds (s). Minimum 5m, maximum 8h or more (depending on the project), default 10m.

* `--interval` (`-i`) (expects a value)
  The time interval. Defaults to a division of the range. You can specify units: hours (h), minutes (m), or seconds (s). Minimum 1m.

* `--to` (expects a value)
  The end time. Defaults to now.

* `--latest` (`-1`)
  Show only the latest single data point

* `--service` (`-s`) (expects a value)
  Filter by service or application name The % or * characters may be used as a wildcard.

* `--type` (expects a value)
  Filter by service type (if --service is not provided). The version is not required. The % or * characters may be used as a wildcard.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: timestamp*, service*, used*, limit*, percent*, type (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `metrics:disk-usage`

Show disk usage of an environment

Aliases: `disk`

### Usage

```
upsun disk [-B|--bytes] [-r|--range RANGE] [-i|--interval INTERVAL] [--to TO] [-1|--latest] [-s|--service SERVICE] [--type TYPE] [--tmp] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT]
```

#### Options

* `--bytes` (`-B`)
  Show sizes in bytes

* `--range` (`-r`) (expects a value)
  The time range. Metrics will be loaded for this duration until the end time (--to). You can specify units: hours (h), minutes (m), or seconds (s). Minimum 5m, maximum 8h or more (depending on the project), default 10m.

* `--interval` (`-i`) (expects a value)
  The time interval. Defaults to a division of the range. You can specify units: hours (h), minutes (m), or seconds (s). Minimum 1m.

* `--to` (expects a value)
  The end time. Defaults to now.

* `--latest` (`-1`)
  Show only the latest single data point

* `--service` (`-s`) (expects a value)
  Filter by service or application name The % or * characters may be used as a wildcard.

* `--type` (expects a value)
  Filter by service type (if --service is not provided). The version is not required. The % or * characters may be used as a wildcard.

* `--tmp`
  Report temporary disk usage (shows columns: timestamp, service, tmp_used, tmp_limit, tmp_percent, tmp_ipercent)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: timestamp*, service*, used*, limit*, percent*, ipercent*, tmp_percent*, ilimit, iused, tmp_ilimit, tmp_ipercent, tmp_iused, tmp_limit, tmp_used, type (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `metrics:memory`

Show memory usage of an environment

Aliases: `mem`, `memory`

### Usage

```
upsun mem [-B|--bytes] [-r|--range RANGE] [-i|--interval INTERVAL] [--to TO] [-1|--latest] [-s|--service SERVICE] [--type TYPE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT]
```

#### Options

* `--bytes` (`-B`)
  Show sizes in bytes

* `--range` (`-r`) (expects a value)
  The time range. Metrics will be loaded for this duration until the end time (--to). You can specify units: hours (h), minutes (m), or seconds (s). Minimum 5m, maximum 8h or more (depending on the project), default 10m.

* `--interval` (`-i`) (expects a value)
  The time interval. Defaults to a division of the range. You can specify units: hours (h), minutes (m), or seconds (s). Minimum 1m.

* `--to` (expects a value)
  The end time. Defaults to now.

* `--latest` (`-1`)
  Show only the latest single data point

* `--service` (`-s`) (expects a value)
  Filter by service or application name The % or * characters may be used as a wildcard.

* `--type` (expects a value)
  Filter by service type (if --service is not provided). The version is not required. The % or * characters may be used as a wildcard.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: timestamp*, service*, used*, limit*, percent*, type (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `mount:download`

Download files from a mount, using rsync

### Usage

```
upsun mount:download [-a|--all] [-m|--mount MOUNT] [--target TARGET] [--source-path] [--delete] [--exclude EXCLUDE] [--include INCLUDE] [--refresh] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE]
```

#### Options

* `--all` (`-a`)
  Download from all mounts

* `--mount` (`-m`) (expects a value)
  The mount (as an app-relative path)

* `--target` (expects a value)
  The directory to which files will be downloaded. If --all is used, the mount path will be appended

* `--source-path`
  Use the mount's source path (rather than the mount path) as a subdirectory of the target, when --all is used

* `--delete`
  Whether to delete extraneous files in the target directory

* `--exclude` (expects a value)
  File(s) to exclude from the download (pattern)

* `--include` (expects a value)
  File(s) not to exclude (pattern)

* `--refresh`
  Whether to refresh the cache

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `mount:list`

Get a list of mounts

Aliases: `mounts`

### Usage

```
upsun mounts [--paths] [--refresh] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE]
```

#### Options

* `--paths`
  Output the mount paths only (one per line)

* `--refresh`
  Whether to refresh the cache

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: definition, path. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `mount:upload`

Upload files to a mount, using rsync

### Usage

```
upsun mount:upload [--source SOURCE] [-m|--mount MOUNT] [--delete] [--exclude EXCLUDE] [--include INCLUDE] [--refresh] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-I|--instance INSTANCE]
```

#### Options

* `--source` (expects a value)
  A directory containing files to upload

* `--mount` (`-m`) (expects a value)
  The mount (as an app-relative path)

* `--delete`
  Whether to delete extraneous files in the mount

* `--exclude` (expects a value)
  File(s) to exclude from the upload (pattern)

* `--include` (expects a value)
  File(s) not to exclude (pattern)

* `--refresh`
  Whether to refresh the cache

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--instance` (`-I`) (expects a value)
  An instance ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `operation:list`

List runtime operations on an environment

Aliases: `ops`

### Usage

```
upsun ops [--full] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--full`
  Do not limit the length of command to display. The default limit is 24 lines.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: service*, name*, start*, role, stop (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `operation:run`

Run an operation on the environment

### Usage

```
upsun operation:run [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--worker WORKER] [-W|--no-wait] [--wait] [--] [<operation>]
```

#### Arguments

* `operation`(optional)
  The operation name

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--worker` (expects a value)
  A worker name

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:billing:address`

View or change an organization's billing address

### Usage

```
upsun organization:billing:address [-o|--org ORG] [-p|--project PROJECT] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--] [<property>] [<value>] [<properties>]...
```

#### Arguments

* `property`(optional)
  The name of a property to view or change

* `value`(optional)
  A new value for the property

* `properties`(optional; multiple values allowed)
  Additional property/value pairs

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:billing:profile`

View or change an organization's billing profile

### Usage

```
upsun organization:billing:profile [-o|--org ORG] [-p|--project PROJECT] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--] [<property>] [<value>]
```

#### Arguments

* `property`(optional)
  The name of a property to view or change

* `value`(optional)
  A new value for the property

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:create`

Create a new organization

### Usage

```
upsun organization:create [--label LABEL] [--name NAME] [--country COUNTRY]
```

Organizations allow you to manage your Upsun projects, users and billing. Projects are owned by organizations.

You can add other users to your organization, for collaboratively managing the organization as well as its projects and billing information.

Access to individual projects (API and SSH) is managed separately, for now.

#### Options

* `--label` (expects a value)
  The full name of the organization, e.g. "ACME Inc."

* `--name` (expects a value)
  The organization machine name, used for URL paths and similar purposes.

* `--country` (expects a value)
  The organization country. Used as the default for the billing address.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:delete`

Delete an organization

### Usage

```
upsun organization:delete [-o|--org ORG] [-p|--project PROJECT]
```

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:info`

View or change organization details

### Usage

```
upsun organization:info [-o|--org ORG] [-p|--project PROJECT] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--] [<property>] [<value>]
```

#### Arguments

* `property`(optional)
  The name of a property to view or change

* `value`(optional)
  A new value for the property

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View the organization "acme":
```
upsun organization:info --org acme
```

* Show the organization's label:
```
upsun organization:info --org acme label
```

* Change the organization label:
```
upsun organization:info --org acme label "ACME Inc."
```

## `organization:list`

List organizations

Aliases: `orgs`, `organizations`

### Usage

```
upsun orgs [--my] [--sort SORT] [--reverse] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--my`
  List only the organizations you own

* `--sort` (expects a value)
  An organization property to sort by

* `--reverse`
  Sort in reverse order

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: name*, label*, owner_email*, created_at, id, owner_id, owner_username, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:subscription:list`

List subscriptions within an organization

Aliases: `org:subs`

### Usage

```
upsun org:subs [--page PAGE] [-c|--count COUNT] [-o|--org ORG] [-p|--project PROJECT] [--format FORMAT] [--columns COLUMNS] [--no-header]
```

#### Options

* `--page` (expects a value)
  Page number. This enables pagination, despite configuration or --count.

* `--count` (`-c`) (expects a value)
  The number of items to display per page. Use 0 to disable pagination. Ignored if --page is specified.

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (expects a value)
  Columns to display. Available columns: id*, project_id*, project_title*, project_region*, created_at, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:user:add`

Invite a user to an organization

### Usage

```
upsun organization:user:add [-o|--org ORG] [--permission PERMISSION] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The email address of the user

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--permission` (expects a value)
  Permission(s) for the user on the organization. Valid permissions are: billing, members, plans, projects:create, projects:list

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:user:delete`

Remove a user from an organization

### Usage

```
upsun organization:user:delete [-o|--org ORG] [--] <email>
```

#### Arguments

* `email`(required)
  The email address of the user

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:user:get`

View an organization user

### Usage

```
upsun organization:user:get [-o|--org ORG] [-P|--property PROPERTY] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The email address of the user

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--property` (`-P`) (expects a value)
  A property to display

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:user:list`

List organization users

Aliases: `org:users`

### Usage

```
upsun org:users [-c|--count COUNT] [--sort SORT] [--reverse] [-o|--org ORG] [--date-fmt DATE-FMT] [--format FORMAT] [--columns COLUMNS] [--no-header]
```

#### Options

* `--count` (`-c`) (expects a value)
  The number of items to display per page. Use 0 to disable pagination.

* `--sort` (expects a value)
  A property to sort by (created_at or updated_at)

* `--reverse`
  Reverse the sort order

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (expects a value)
  Columns to display. Available columns: id*, email*, owner*, permissions*, created_at, first_name, last_name, mfa_enabled, sso_enabled, updated_at, username (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:user:projects`

List the projects a user can access

Aliases: `oups`

### Usage

```
upsun oups [-o|--org ORG] [--list-all] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The email address of the user

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--list-all`
  List access across all organizations

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: project_id*, project_title*, roles*, updated_at*, granted_at, organization_id, organization_label, organization_name, region (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `organization:user:update`

Update an organization user

### Usage

```
upsun organization:user:update [-o|--org ORG] [--permission PERMISSION] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The email address of the user

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--permission` (expects a value)
  Permission(s) for the user on the organization. Valid permissions are: billing, members, plans, projects:create, projects:list

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `project:clear-build-cache`

Clear a project's build cache

### Usage

```
upsun project:clear-build-cache [-p|--project PROJECT]
```

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `project:create`

Create a new project

Aliases: `create`

### Usage

```
upsun create [-o|--org ORG] [--title TITLE] [--region REGION] [--plan PLAN] [--environments ENVIRONMENTS] [--storage STORAGE] [--default-branch DEFAULT-BRANCH] [--set-remote] [--no-set-remote]
```

Use this command to create a new project.

An interactive form will be presented with the available options. If the
command is run non-interactively (with --yes), the form will not be displayed,
and the --region option will be required.

A project subscription will be requested, and then checked periodically (every
3 seconds) until the project has been activated, or until the process times
out (15 minutes by default).

If known, the project ID will be output to STDOUT. All other output will be sent
to STDERR.

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--title` (expects a value)
  The initial project title

* `--region` (expects a value)
  The region where the project will be hosted. Get a 3% discount on resources for regions with a carbon intensity of less than 100 gCO2eq/kWh.

* `--plan` (expects a value)
  The subscription plan

* `--environments` (expects a value)
  The number of environments

* `--storage` (expects a value)
  The amount of storage per environment, in GiB

* `--default-branch` (expects a value)
  The default Git branch name for the project (the production environment)

* `--set-remote`
  Set the new project as the remote for this repository. This is the default if no remote project is already set.

* `--no-set-remote`
  Do not set the new project as the remote for this repository

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `project:delete`

Delete a project

### Usage

```
upsun project:delete [-p|--project PROJECT] [--] [<project>]
```

#### Arguments

* `project`(optional)
  The project ID

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `project:get`

Clone a project locally

Aliases: `get`

### Usage

```
upsun get [-e|--environment ENVIRONMENT] [--depth DEPTH] [-p|--project PROJECT] [--] [<project>] [<directory>]
```

#### Arguments

* `project`(optional)
  The project ID

* `directory`(optional)
  The directory to clone to. Defaults to the project title

#### Options

* `--environment` (`-e`) (expects a value)
  The environment ID to clone. Defaults to the project default, or the first available environment

* `--depth` (expects a value)
  Create a shallow clone: limit the number of commits in the history

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Clone the project "abc123" into the directory "my-project":
```
upsun project:get abc123 my-project
```

## `project:info`

Read or set properties for a project

### Usage

```
upsun project:info [--refresh] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] [<property>] [<value>]
```

#### Arguments

* `property`(optional)
  The name of the property

* `value`(optional)
  Set a new value for the property

#### Options

* `--refresh`
  Whether to refresh the cache

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Read all project properties:
```
upsun project:info 
```

* Show the project's Git URL:
```
upsun project:info git
```

* Change the project's title:
```
upsun project:info title "My project"
```

## `project:init`

Initialize a project

Aliases: `ify`

### Usage

```
upsun project:init
```

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|vv|vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Create the starter YAML files for your project:
```
upsun project:init 
```

## `project:list`

Get a list of all active projects

Aliases: `projects`, `pro`

### Usage

```
upsun projects [--pipe] [--region REGION] [--title TITLE] [--my] [--refresh REFRESH] [--sort SORT] [--reverse] [--page PAGE] [-c|--count COUNT] [-o|--org ORG] [--format FORMAT] [--columns COLUMNS] [--no-header] [--date-fmt DATE-FMT]
```

#### Options

* `--pipe`
  Output a simple list of project IDs. Disables pagination.

* `--region` (expects a value)
  Filter by region (exact match)

* `--title` (expects a value)
  Filter by title (case-insensitive search)

* `--my`
  Display only the projects you own (through organizations you own)

* `--refresh` (expects a value)
  Whether to refresh the list

* `--sort` (expects a value)
  A property to sort by

* `--reverse`
  Sort in reverse (descending) order

* `--page` (expects a value)
  Page number. This enables pagination, despite configuration or --count. Ignored if --pipe is specified.

* `--count` (`-c`) (expects a value)
  The number of projects to display per page. Use 0 to disable pagination. Ignored if --page is specified.

* `--org` (`-o`) (expects a value)
  Filter by organization name or ID

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (expects a value)
  Columns to display. Available columns: id*, title*, region*, organization_name*, created_at, organization_id, organization_label, status (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `project:set-remote`

Set the remote project for the current Git repository

Aliases: `set-remote`

### Usage

```
upsun set-remote [<project>]
```

#### Arguments

* `project`(optional)
  The project ID

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Set the remote project for this repository to "abcdef123456":
```
upsun project:set-remote abcdef123456
```

* Unset the remote project for this repository:
```
upsun project:set-remote -
```

## `repo:cat`

Read a file in the project repository

### Usage

```
upsun repo:cat [-c|--commit COMMIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] <path>
```

#### Arguments

* `path`(required)
  The path to the file

#### Options

* `--commit` (`-c`) (expects a value)
  The commit SHA. This can also accept "HEAD", and caret (^) or tilde (~) suffixes for parent commits.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Read the configuration file:
```
upsun repo:cat .upsun/config.yaml
```

## `repo:ls`

List files in the project repository

### Usage

```
upsun repo:ls [-d|--directories] [-f|--files] [--git-style] [-c|--commit COMMIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<path>]
```

#### Arguments

* `path`(optional)
  The path to a subdirectory

#### Options

* `--directories` (`-d`)
  Show directories only

* `--files` (`-f`)
  Show files only

* `--git-style`
  Style output similar to "git ls-tree"

* `--commit` (`-c`) (expects a value)
  The commit SHA. This can also accept "HEAD", and caret (^) or tilde (~) suffixes for parent commits.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `repo:read`

Read a directory or file in the project repository

Aliases: `read`

### Usage

```
upsun read [-c|--commit COMMIT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<path>]
```

#### Arguments

* `path`(optional)
  The path to the directory or file

#### Options

* `--commit` (`-c`) (expects a value)
  The commit SHA. This can also accept "HEAD", and caret (^) or tilde (~) suffixes for parent commits.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `resources:build:get`

View the build resources of a project

Aliases: `build-resources:get`, `build-resources`

### Usage

```
upsun build-resources:get [-p|--project PROJECT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: cpu, memory. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `resources:build:set`

Set the build resources of a project

Aliases: `build-resources:set`

### Usage

```
upsun build-resources:set [--cpu CPU] [--memory MEMORY] [-p|--project PROJECT]
```

#### Options

* `--cpu` (expects a value)
  Build CPU

* `--memory` (expects a value)
  Build memory (in MB)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `resources:get`

View the resources of apps and services on an environment

Aliases: `resources`, `res`

### Usage

```
upsun resources [-s|--service SERVICE] [--app APP] [--worker WORKER] [--type TYPE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--service` (`-s`) (expects a value)
  Filter by service name. This can select any service, including apps and workers.

* `--app` (expects a value)
  Filter by app name

* `--worker` (expects a value)
  Filter by worker name

* `--type` (expects a value)
  Filter by service, app or worker type, e.g. "postgresql"

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: service*, profile_size*, cpu*, memory*, disk*, instance_count*, base_memory, memory_ratio, profile, type (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `resources:set`

Set the resources of apps and services on an environment

### Usage

```
upsun resources:set [-S|--size SIZE] [-C|--count COUNT] [-D|--disk DISK] [-f|--force] [--dry-run] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait]
```

Configure the resources allocated to apps, workers and services on an environment.

The resources may be the profile size, the instance count, or the disk size (MB).

Profile sizes are predefined CPU & memory values that can be viewed by running: upsun resources:sizes

If the same service and resource is specified on the command line multiple times, only the final value will be used.

#### Options

* `--size` (`-S`) (expects a value)
  Set the profile size (CPU and memory) of apps, workers, or services. Items are in the format name:value and may be comma-separated. The % or * characters may be used as a wildcard for the name. List available sizes with the resources:sizes command. A value of 'default' will use the default size, and 'min' or 'minimum' will use the minimum.

* `--count` (`-C`) (expects a value)
  Set the instance count of apps or workers. Items are in the format name:value as above.

* `--disk` (`-D`) (expects a value)
  Set the disk size (in MB) of apps or services. Items are in the format name:value as above. A value of 'default' will use the default size, and 'min' or 'minimum' will use the minimum.

* `--force` (`-f`)
  Try to run the update, even if it might exceed your limits

* `--dry-run`
  Show the changes that would be made, without changing anything

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Set profile sizes for two apps and a service:
```
upsun resources:set --size frontend:0.1,backend:.25,database:1
```

* Give the "backend" app 3 instances:
```
upsun resources:set --count backend:3
```

* Give 512 MB disk to the "backend" app and 2 GB to the "database" service:
```
upsun resources:set --disk backend:512,database:2048
```

* Set the same profile size for the "backend" and "frontend" apps using a wildcard:
```
upsun resources:set --size '*end:0.1'
```

* Set the same instance count for all apps using a wildcard:
```
upsun resources:set --count '*:3'
```

## `resources:size:list`

List container profile sizes

Aliases: `resources:sizes`

### Usage

```
upsun resources:sizes [-s|--service SERVICE] [--profile PROFILE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--service` (`-s`) (expects a value)
  A service name

* `--profile` (expects a value)
  A profile name

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: cpu, memory, size. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `route:get`

View detailed information about a route

### Usage

```
upsun route:get [--id ID] [-1|--primary] [-P|--property PROPERTY] [--refresh] [--date-fmt DATE-FMT] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [-i|--identity-file IDENTITY-FILE] [--] [<route>]
```

#### Arguments

* `route`(optional)
  The route's original URL

#### Options

* `--id` (expects a value)
  A route ID to select

* `--primary` (`-1`)
  Select the primary route

* `--property` (`-P`) (expects a value)
  The property to display

* `--refresh`
  Bypass the cache of routes

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  [Deprecated option, no longer used]

* `--identity-file` (`-i`) (expects a value)
  [Deprecated option, no longer used]

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View the URL to the https://{default}/ route:
```
upsun route:get 'https://{default}/' -P url
```

## `route:list`

List all routes for an environment

Aliases: `routes`

### Usage

```
upsun routes [--refresh] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--] [<environment>]
```

#### Arguments

* `environment`(optional)
  The environment ID

#### Options

* `--refresh`
  Bypass the cache of routes

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: route*, type*, to*, url (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `service:list`

List services in the project

Aliases: `services`

### Usage

```
upsun services [--refresh] [--pipe] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--refresh`
  Whether to refresh the cache

* `--pipe`
  Output a list of service names only

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: disk, name, size, type. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `service:mongo:dump`

Create a binary archive dump of data from MongoDB

Aliases: `mongodump`

### Usage

```
upsun mongodump [-c|--collection COLLECTION] [-z|--gzip] [-o|--stdout] [-r|--relationship RELATIONSHIP] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

#### Options

* `--collection` (`-c`) (expects a value)
  The collection to dump

* `--gzip` (`-z`)
  Compress the dump using gzip

* `--stdout` (`-o`)
  Output to STDOUT instead of a file

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `service:mongo:export`

Export data from MongoDB

Aliases: `mongoexport`

### Usage

```
upsun mongoexport [-c|--collection COLLECTION] [--jsonArray] [--type TYPE] [-f|--fields FIELDS] [-r|--relationship RELATIONSHIP] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

#### Options

* `--collection` (`-c`) (expects a value)
  The collection to export

* `--jsonArray`
  Export data as a single JSON array

* `--type` (expects a value)
  The export type, e.g. "csv"

* `--fields` (`-f`) (expects a value)
  The fields to export

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Export a CSV from the "users" collection:
```
upsun service:mongo:export -c users --type csv -f name,email
```

## `service:mongo:restore`

Restore a binary archive dump of data into MongoDB

Aliases: `mongorestore`

### Usage

```
upsun mongorestore [-c|--collection COLLECTION] [-r|--relationship RELATIONSHIP] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

#### Options

* `--collection` (`-c`) (expects a value)
  The collection to restore

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `service:mongo:shell`

Use the MongoDB shell

Aliases: `mongo`

### Usage

```
upsun mongo [--eval EVAL] [-r|--relationship RELATIONSHIP] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

#### Options

* `--eval` (expects a value)
  Pass a JavaScript fragment to the shell

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Display collection names:
```
upsun service:mongo:shell --eval 'printjson(db.getCollectionNames())'
```

## `service:redis-cli`

Access the Redis CLI

Aliases: `redis`

### Usage

```
upsun redis [-r|--relationship RELATIONSHIP] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--] [<args>]
```

#### Arguments

* `args`(optional)
  Arguments to add to the Redis command

#### Options

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Open the redis-cli shell:
```
upsun service:redis-cli 
```

* Ping the Redis server:
```
upsun service:redis-cli ping
```

* Show Redis status information:
```
upsun service:redis-cli info
```

* Scan keys:
```
upsun service:redis-cli -- --scan
```

* Scan keys matching a pattern:
```
upsun service:redis-cli -- "--scan --pattern '*-11*'"
```

## `source-operation:list`

List source operations on an environment

Aliases: `source-ops`

### Usage

```
upsun source-ops [--full] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--full`
  Do not limit the length of command to display. The default limit is 24 lines.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: app, command, operation. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `source-operation:run`

Run a source operation

### Usage

```
upsun source-operation:run [--variable VARIABLE] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<operation>]
```

#### Arguments

* `operation`(optional)
  The operation name

#### Options

* `--variable` (expects a value)
  A variable to set during the operation, in the format type:name=value

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Run the "update" operation, setting environment variable FOO=bar:
```
upsun source-operation:run update --variable env:FOO=bar
```

## `ssh-cert:load`

Generate an SSH certificate

### Usage

```
upsun ssh-cert:load [--refresh-only] [--new] [--new-key]
```

This command checks if a valid SSH certificate is present, and generates a
new one if necessary.

Certificates allow you to make SSH connections without having previously
uploaded a public key. They are more secure than keys and they allow for
other features.

Normally the certificate is loaded automatically during login, or when
making an SSH connection. So this command is seldom needed.

If you want to set up certificates without login and without an SSH-related
command, for example if you are writing a script that uses an API token via
an environment variable, then you would probably want to run this command
explicitly. For unattended scripts, remember to turn off interaction via
--yes or the UPSUN_CLI_NO_INTERACTION environment variable.

#### Options

* `--refresh-only`
  Only refresh the certificate, if necessary (do not write SSH config)

* `--new`
  Force the certificate to be refreshed

* `--new-key`
  Force a new key pair to be generated

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `ssh-key:add`

Add a new SSH key

### Usage

```
upsun ssh-key:add [--name NAME] [--] [<path>]
```

This command lets you add an SSH key to your account. It can generate a key using OpenSSH.

Notice:
SSH keys are no longer needed by default, as SSH certificates are supported.
Certificates offer more security than keys.

To load or check your SSH certificate, run: upsun ssh-cert:load

#### Arguments

* `path`(optional)
  The path to an existing SSH public key

#### Options

* `--name` (expects a value)
  A name to identify the key

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `ssh-key:delete`

Delete an SSH key

### Usage

```
upsun ssh-key:delete [<id>]
```

This command lets you delete SSH keys from your account.

Notice:
SSH keys are no longer needed by default, as SSH certificates are supported.
Certificates offer more security than keys.

To load or check your SSH certificate, run: upsun ssh-cert:load

#### Arguments

* `id`(optional)
  The ID of the SSH key to delete

#### Options

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Delete the key 123:
```
upsun ssh-key:delete 123
```

## `ssh-key:list`

Get a list of SSH keys in your account

Aliases: `ssh-keys`

### Usage

```
upsun ssh-keys [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

This command lets you list SSH keys in your account.

Notice:
SSH keys are no longer needed by default, as SSH certificates are supported.
Certificates offer more security than keys.

To load or check your SSH certificate, run: upsun ssh-cert:load

#### Options

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: id*, title*, path*, fingerprint (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `subscription:info`

Read or modify subscription properties

### Usage

```
upsun subscription:info [-s|--id ID] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [--] [<property>] [<value>]
```

#### Arguments

* `property`(optional)
  The name of the property

* `value`(optional)
  Set a new value for the property

#### Options

* `--id` (`-s`) (expects a value)
  The subscription ID

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View all subscription properties:
```
upsun subscription:info 
```

* View the subscription status:
```
upsun subscription:info status
```

* View the storage limit (in MiB):
```
upsun subscription:info storage
```

## `team:create`

Create a new team

### Usage

```
upsun team:create [--label LABEL] [--no-check-unique] [-r|--role ROLE] [--output-id] [-o|--org ORG]
```

#### Options

* `--label` (expects a value)
  The team label

* `--no-check-unique`
  Do not error if another team exists with the same label in the organization

* `--role` (`-r`) (expects a value)
  Set the team's project and environment type roles Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters may be used as a wildcard.

* `--output-id`
  Output the new team's ID to stdout (instead of displaying the team info)

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:delete`

Delete a team

### Usage

```
upsun team:delete [-o|--org ORG] [-t|--team TEAM]
```

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:get`

View a team

### Usage

```
upsun team:get [-o|--org ORG] [-p|--project PROJECT] [-t|--team TEAM] [-P|--property PROPERTY] [--date-fmt DATE-FMT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--team` (`-t`) (expects a value)
  The team ID

* `--property` (`-P`) (expects a value)
  The name of a property to view

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:list`

List teams

Aliases: `teams`

### Usage

```
upsun teams [-c|--count COUNT] [--sort SORT] [--reverse] [-o|--org ORG] [-p|--project PROJECT] [--date-fmt DATE-FMT] [--format FORMAT] [--columns COLUMNS] [--no-header]
```

#### Options

* `--count` (`-c`) (expects a value)
  The number of items to display per page. Use 0 to disable pagination.

* `--sort` (expects a value)
  A team property to sort by

* `--reverse`
  Sort in reverse order

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--project` (`-p`) (expects a value)
  The project ID or URL, to auto-select the organization if --org is not used

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (expects a value)
  Columns to display. Available columns: id*, label*, member_count*, project_count*, project_permissions*, created_at, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:project:add`

Add project(s) to a team

### Usage

```
upsun team:project:add [--all] [-o|--org ORG] [-t|--team TEAM] [--] [<projects>]...
```

#### Arguments

* `projects`(optional; multiple values allowed)
  The project ID(s). Values may be split by commas (e.g. "a,b,c") and/or whitespace.

#### Options

* `--all`
  Add all the projects that currently exist in the organization

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:project:delete`

Remove a project from a team

### Usage

```
upsun team:project:delete [-o|--org ORG] [-t|--team TEAM] [--] [<project>]
```

#### Arguments

* `project`(optional)
  The project ID

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:project:list`

List projects in a team

Aliases: `team:projects`, `team:pro`

### Usage

```
upsun team:projects [-c|--count COUNT] [-o|--org ORG] [-t|--team TEAM] [--date-fmt DATE-FMT] [--format FORMAT] [--columns COLUMNS] [--no-header]
```

#### Options

* `--count` (`-c`) (expects a value)
  The number of items to display per page (max: 200). Use 0 to disable pagination

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (expects a value)
  Columns to display. Available columns: id*, title*, granted_at*, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:update`

Update a team

### Usage

```
upsun team:update [--label LABEL] [--no-check-unique] [-r|--role ROLE] [-t|--team TEAM] [-o|--org ORG] [-W|--no-wait] [--wait]
```

#### Options

* `--label` (expects a value)
  Set a new team label

* `--no-check-unique`
  Do not error if another team exists with the same label in the organization

* `--role` (`-r`) (expects a value)
  Set the team's project and environment type roles Values may be split by commas (e.g. "a,b,c") and/or whitespace. The % or * characters may be used as a wildcard.

* `--team` (`-t`) (expects a value)
  The team ID

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:user:add`

Add a user to a team

### Usage

```
upsun team:user:add [-o|--org ORG] [-t|--team TEAM] [--] [<user>]
```

#### Arguments

* `user`(optional)
  The user email address or ID

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:user:delete`

Remove a user from a team

### Usage

```
upsun team:user:delete [-o|--org ORG] [-t|--team TEAM] [--] [<user>]
```

#### Arguments

* `user`(optional)
  The user email address or ID

#### Options

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `team:user:list`

List users in a team

Aliases: `team:users`

### Usage

```
upsun team:users [-c|--count COUNT] [-o|--org ORG] [-t|--team TEAM] [--date-fmt DATE-FMT] [--format FORMAT] [--columns COLUMNS] [--no-header]
```

#### Options

* `--count` (`-c`) (expects a value)
  The number of items to display per page. Use 0 to disable pagination

* `--org` (`-o`) (expects a value)
  The organization name (or ID)

* `--team` (`-t`) (expects a value)
  The team ID

* `--date-fmt` (expects a value)
  The date format (as a PHP date format string)

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (expects a value)
  Columns to display. Available columns: id*, email*, created_at*, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `tunnel:close`

Close SSH tunnels

### Usage

```
upsun tunnel:close [-a|--all] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

#### Options

* `--all` (`-a`)
  Close all tunnels

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `tunnel:info`

View relationship info for SSH tunnels

### Usage

```
upsun tunnel:info [-P|--property PROPERTY] [-c|--encode] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

#### Options

* `--property` (`-P`) (expects a value)
  The relationship property to view

* `--encode` (`-c`)
  Output as base64-encoded JSON

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `tunnel:list`

List SSH tunnels

Aliases: `tunnels`

### Usage

```
upsun tunnels [-a|--all] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--all` (`-a`)
  View all tunnels

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: port*, project*, environment*, app*, relationship*, url (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `tunnel:open`

Open SSH tunnels to an app's relationships

### Usage

```
upsun tunnel:open [-g|--gateway-ports] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP]
```

This command opens SSH tunnels to all of the relationships of an application.

Connections can then be made to the application's services as if they were
local, for example a local MySQL client can be used, or the Solr web
administration endpoint can be accessed through a local browser.

This command requires the posix and pcntl PHP extensions (as multiple
background CLI processes are created to keep the SSH tunnels open). The
tunnel:single command can be used on systems without these
extensions.

#### Options

* `--gateway-ports` (`-g`)
  Allow remote hosts to connect to local forwarded ports

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `tunnel:single`

Open a single SSH tunnel to an app relationship

### Usage

```
upsun tunnel:single [--port PORT] [-g|--gateway-ports] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-A|--app APP] [-r|--relationship RELATIONSHIP]
```

#### Options

* `--port` (expects a value)
  The local port

* `--gateway-ports` (`-g`)
  Allow remote hosts to connect to local forwarded ports

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--app` (`-A`) (expects a value)
  The remote application name

* `--relationship` (`-r`) (expects a value)
  The service relationship to use

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `user:add`

Add a user to the project

### Usage

```
upsun user:add [-r|--role ROLE] [--force-invite] [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The user's email address

#### Options

* `--role` (`-r`) (expects a value)
  The user's project role ('admin' or 'viewer') or environment type role (e.g. 'staging:contributor' or 'production:viewer'). To remove a user from an environment type, set the role as 'none'. The % or * characters can be used as a wildcard for the environment type, e.g. '%:viewer' to give the user the 'viewer' role on all types. The role can be abbreviated, e.g. 'production:v'.

* `--force-invite`
  Send an invitation, even if one has already been sent

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Add Alice as a project admin:
```
upsun user:add alice@example.com -r admin
```

* Add Bob as a viewer on the "production" environment type, and a contributor on "development" environments:
```
upsun user:add bob@example.com -r production:v -r development:c
```

* Add Charlie as viewer on "production" and "development":
```
upsun user:add charlie@example.com -r prod%:v -r dev%:v
```

## `user:delete`

Delete a user from the project

### Usage

```
upsun user:delete [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] <email>
```

#### Arguments

* `email`(required)
  The user's email address

#### Options

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Delete Alice from the project:
```
upsun user:delete alice@example.com
```

## `user:get`

View a user's role(s)

### Usage

```
upsun user:get [-l|--level LEVEL] [--pipe] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [-r|--role ROLE] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The user's email address

#### Options

* `--level` (`-l`) (expects a value)
  The role level ('project' or 'environment')

* `--pipe`
  Output the role to stdout (after making any changes)

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--role` (`-r`) (expects a value)
  [Deprecated: use user:update to change a user's role(s)]

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View Alice's role on the project:
```
upsun user:get alice@example.com
```

* View Alice's role on the current environment:
```
upsun user:get alice@example.com --level environment --pipe
```

## `user:list`

List project users

Aliases: `users`

### Usage

```
upsun users [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT]
```

#### Options

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: email*, name*, role*, id*, granted_at, permissions, updated_at (* = default columns). The character "+" can be used as a placeholder for the default columns. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `user:update`

Update user role(s) on a project

### Usage

```
upsun user:update [-r|--role ROLE] [-p|--project PROJECT] [-W|--no-wait] [--wait] [--] [<email>]
```

#### Arguments

* `email`(optional)
  The user's email address

#### Options

* `--role` (`-r`) (expects a value)
  The user's project role ('admin' or 'viewer') or environment type role (e.g. 'staging:contributor' or 'production:viewer'). To remove a user from an environment type, set the role as 'none'. The % or * characters can be used as a wildcard for the environment type, e.g. '%:viewer' to give the user the 'viewer' role on all types. The role can be abbreviated, e.g. 'production:v'.

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Make Bob an admin on the "development" and "staging" environment types:
```
upsun user:update bob@example.com -r development:a,staging:a
```

* Make Charlie a contributor on all environment types:
```
upsun user:update charlie@example.com -r %:c
```

## `variable:create`

Create a variable

### Usage

```
upsun variable:create [-u|--update] [-l|--level LEVEL] [--name NAME] [--value VALUE] [--json JSON] [--sensitive SENSITIVE] [--prefix PREFIX] [--enabled ENABLED] [--inheritable INHERITABLE] [--visible-build VISIBLE-BUILD] [--visible-runtime VISIBLE-RUNTIME] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] [<name>]
```

#### Arguments

* `name`(optional)
  The variable name

#### Options

* `--update` (`-u`)
  Update the variable if it already exists

* `--level` (`-l`) (expects a value)
  The level at which to set the variable ('project' or 'environment')

* `--name` (expects a value)
  The variable name

* `--value` (expects a value)
  The variable's value

* `--json` (expects a value)
  Whether the variable value is JSON-formatted

* `--sensitive` (expects a value)
  Whether the variable value is sensitive

* `--prefix` (expects a value)
  The variable name's prefix which can determine its type, e.g. 'env'. Only applicable if the name does not already contain a prefix. (e.g. 'none' or 'env:')

* `--enabled` (expects a value)
  Whether the variable should be enabled on the environment

* `--inheritable` (expects a value)
  Whether the variable is inheritable by child environments

* `--visible-build` (expects a value)
  Whether the variable should be visible at build time

* `--visible-runtime` (expects a value)
  Whether the variable should be visible at runtime

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `variable:delete`

Delete a variable

### Usage

```
upsun variable:delete [-l|--level LEVEL] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] <name>
```

#### Arguments

* `name`(required)
  The variable name

#### Options

* `--level` (`-l`) (expects a value)
  The variable level ('project', 'environment', 'p' or 'e')

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* Delete the variable "example":
```
upsun variable:delete example
```

## `variable:get`

View a variable

Aliases: `vget`

### Usage

```
upsun vget [-P|--property PROPERTY] [-l|--level LEVEL] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--pipe] [--] [<name>]
```

#### Arguments

* `name`(optional)
  The name of the variable

#### Options

* `--property` (`-P`) (expects a value)
  View a single variable property

* `--level` (`-l`) (expects a value)
  The variable level ('project', 'environment', 'p' or 'e')

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--pipe`
  [Deprecated option] Output the variable value only

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

### Examples

* View the variable "example":
```
upsun variable:get example
```

## `variable:list`

List variables

Aliases: `variables`, `var`

### Usage

```
upsun variables [-l|--level LEVEL] [--format FORMAT] [-c|--columns COLUMNS] [--no-header] [-p|--project PROJECT] [-e|--environment ENVIRONMENT]
```

#### Options

* `--level` (`-l`) (expects a value)
  The variable level ('project', 'environment', 'p' or 'e')

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: is_enabled, level, name, value. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `variable:update`

Update a variable

### Usage

```
upsun variable:update [--allow-no-change] [-l|--level LEVEL] [--value VALUE] [--json JSON] [--sensitive SENSITIVE] [--enabled ENABLED] [--inheritable INHERITABLE] [--visible-build VISIBLE-BUILD] [--visible-runtime VISIBLE-RUNTIME] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [-W|--no-wait] [--wait] [--] <name>
```

#### Arguments

* `name`(required)
  The variable name

#### Options

* `--allow-no-change`
  Return success (zero exit code) if no changes were provided

* `--level` (`-l`) (expects a value)
  The variable level ('project', 'environment', 'p' or 'e')

* `--value` (expects a value)
  The variable's value

* `--json` (expects a value)
  Whether the variable value is JSON-formatted

* `--sensitive` (expects a value)
  Whether the variable value is sensitive

* `--enabled` (expects a value)
  Whether the variable should be enabled on the environment

* `--inheritable` (expects a value)
  Whether the variable is inheritable by child environments

* `--visible-build` (expects a value)
  Whether the variable should be visible at build time

* `--visible-runtime` (expects a value)
  Whether the variable should be visible at runtime

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--no-wait` (`-W`)
  Do not wait for the operation to complete

* `--wait`
  Wait for the operation to complete (default)

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1

## `worker:list`

Get a list of all deployed workers

Aliases: `workers`

### Usage

```
upsun workers [--refresh] [--pipe] [-p|--project PROJECT] [-e|--environment ENVIRONMENT] [--format FORMAT] [-c|--columns COLUMNS] [--no-header]
```

#### Options

* `--refresh`
  Whether to refresh the cache

* `--pipe`
  Output a list of worker names only

* `--project` (`-p`) (expects a value)
  The project ID or URL

* `--environment` (`-e`) (expects a value)
  The environment ID. Use "." to select the project's default environment.

* `--format` (expects a value)
  The output format: table, csv, tsv, or plain

* `--columns` (`-c`) (expects a value)
  Columns to display. Available columns: commands, name, type. The % or * characters may be used as a wildcard. Values may be split by commas (e.g. "a,b,c") and/or whitespace.

* `--no-header`
  Do not output the table header

* `--help` (`-h`)
  Display this help message

* `--verbose` (`-v|-vv|-vvv`)
  Increase the verbosity of messages

* `--version` (`-V`)
  Display this application version

* `--yes` (`-y`)
  Answer "yes" to confirmation questions; accept the default value for other questions; disable interaction

* `--no-interaction`
  Do not ask any interactive questions; accept default values. Equivalent to using the environment variable: UPSUN_CLI_NO_INTERACTION=1



<!-- vale on -->
