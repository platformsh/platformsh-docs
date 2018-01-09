# Work with Drush

Drush is a command-line shell and scripting interface for Drupal, a
veritable Swiss Army knife designed to make life easier for those who
spend their working hours hacking away at the command prompt. Drush
commands can, for example, be used to clear the Drupal cache, run module
and database updates, revert features, perform database imports and
dumps, and a whole lot more. You can reference the full set of Drush
commands at [Drush.org](http://www.drush.org). If you have never used
Drush before, you can learn more about it on the [Drush GitHub
Repository](https://github.com/drush-ops/drush#description)

- Platform.sh's Drupal templates have Drush installed automatically.

- All custom environments can utilize Drush commands in the development process if they have `drush` configured as a composer requirement and added it to the environment's `$PATH`. See the section below on [install Drush in custom projects](#install-drush-in-custom-projects)

- In addition, you can use the [Platform.sh CLI](/overview/cli.md) to set up Drush aliases easily for all of your project's environments. See the section below on [use drush aliases](#use-drush-aliases)

> **note**
>
> Platform's CLI requires **Drush 6 or greater**.

## Install Drush locally

Install drush with Composer:

```bash
$ composer global require drush/drush
```

At the end of the installation, you should be able to run:

```bash
$ drush
```

And see a list of available commands.

> -   [Drush repository on Github](https://github.com/drush-ops/drush)

## Install Drush in custom projects

### Make Drush a project requirement

Run this command in the project's repository root folder:
```bash
$ composer require drush/drush
```
Then, commit and push.

Drush will then be available at `vendor/bin/drush`, in the exact same version on your local system and on Platform.sh.

### Add Drush to the project's $PATH

Add a new file named `.environment` to the root of your your project's git repository with this code:
```bash
# Statements in this file will be executed (sourced) by the shell in SSH
# sessions, in deploy hooks, in cron jobs, and in the application's runtime
# environment.

# Allow executable app dependencies from Composer to be run from the path.
export PATH=/app/vendor/bin:$PATH
```

## Use drush aliases

### Create Drush aliases

[Drush aliases](http://drush.readthedocs.org/en/master/usage/index.html#site-aliases) make it easy to manage your development websites. Here's an
example of a [Drush alias
file](https://github.com/drush-ops/drush/blob/master/examples/example.aliases.drushrc.php).

The Platform.sh CLI generates Drush aliases for you automatically when you run `platform get [project_id]`. 

To see the aliases that are created, run `platform drush-aliases` and you should get output similar to that below:

```bash
$ platform drush-aliases
Aliases for My Site (tqmd2kvitnoly):
    @my-site._local
    @my-site.master
    @my-site.staging
    @my-site.sprint1
```

To recreate existing aliases, or after pushing a new branch via git to create the new alias, run `platform drush-aliases -r`
