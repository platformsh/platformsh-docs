# Working with Drush in Drupal 7

Drush is a command-line shell and scripting interface for Drupal, a veritable Swiss Army knife designed to make life easier for those who spend their working hours hacking away at the command prompt. 

You can use the CLI to set up Drush aliases, to easily run Drush commands on specific remote Platform.sh environments.

See the [documentation on Drush in Drupal 8](frameworks/drupal8/drush.html) for installation, drush aliases, and other general information

## Working with Make files

You can easily add Drush to your project using the `dependencies` property in `.platform.app.yaml`.

```
dependencies:
    php:
        "drush/drush": "^8.0"
```

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

> -   [Install Drush](https://github.com/drush-ops/drush)

## Use drush aliases

### Create Drush aliases

[Drush aliases](http://drush.readthedocs.org/en/master/usage/index.html#site-aliases) make it easy to manage your development websites. Here's an example of a [Drush alias file](https://github.com/drush-ops/drush/blob/master/examples/example.aliases.drushrc.php).

The CLI generates Drush aliases for you automatically, when you run `platform get [project_id]`. To see the aliases that are created, run `platform drush-aliases` and you should get output similar to that below:

```bash
$ platform drush-aliases
Aliases for My Site (tqmd2kvitnoly):
    @my-site._local
    @my-site.master
    @my-site.staging
    @my-site.sprint1
```

### Create a make file

Platform.sh can automatically build your site using Drush make files. This allows you to easily test specific versions, apply patches and keep your site up to date. It also keeps your working directory much cleaner, since it only contains your custom code.

Your make file can be called: `project.make` or `drupal-org.make`.

You can find an example make file on
[GitHub](https://github.com/platformsh/platformsh-example-drupal7/blob/master/project.make).

When building as a profile, you **need a make file for Drupal core** called: `project-core.make`:

```bash
api = 2
core = 7.x

projects[drupal][type] = core
```

### Generate a make file from an existing site

If you want to generate a make file from your existing site, you can
run:

```bash
$ drush make-generate project.make
```

This will output a make file containing all your contributed modules,
themes and libraries.

> [Make generate command](http://www.drushcommands.com/drush-6x/make/make-generate)

### Apply patches

You can apply **contributed patches** to your modules, themes or
libraries within your `project.make`:

```bash
projects[features][version] = "2.2"
projects[features][patch][] = "https://www.drupal.org/files/issues/alter_overrides-766264-45.patch"
```

You can also apply **self-hosted patches**. Simply create a `PATCHES`
folder at the root of your repository and add the patch as follow:

```bash
projects[uuid][version] = "1.0-alpha5"
projects[uuid][patch][] = "PATCHES/fix-non-uuid-entity-load.patch"
```

### Work with a DEV version

When you are using a module that is in a DEV version, the best practice
is to always target a specific commit ID so that you're always building
the same "version" of the module:

```bash
; CKEditor module: version 7.x-1.15+2-dev
projects[ckeditor][download][revision] = "b29372fb446b547825dc6c30587eaf240717695c"
projects[ckeditor][download][type] = "git"
projects[ckeditor][download][branch] = "7.x-1.x"
projects[ckeditor][type] = "module"
```
