# Developing with Drupal

## Push changes to an environment

Here, we'll see how to make code changes to an environment.

> **note**
> You should never be working on the Master branch since it's supposed to be your production environment.

Make sure you're on a working environment. In this example we're on the
*sprint1* branch:

```bash
$ git checkout sprint1
```

Now that you're set up on your working branch, you can start developing
on your website by making code changes and pushing those changes to
Platform.sh to test them live.

There are three common ways you will be making code changes to Platform:

1.  Add contributed modules, themes, distributions, third-party
    libraries in the make file
2.  Create custom code (*modules, themes, profiles, libraries*) and
    commit them to your Platform.sh codebase
3.  Modify the services grid configuration

### Add contributed projects

Each time you push a commit, Platform.sh will rebuild your environment
and run the Composer command if a proper `composer.json` file has been found.

#### Add a Drupal module or theme

Each Drupal module or theme you want to install on your project should be
included in your `composer.json` file.  For example:

```bash
$ composer require drupal/token
```

That will update your `composer.json` and `composer.lock` files, which you can then commit.

If you're using Composer, 3rd party PHP libraries can be added in the exact same way as Drupal modules.

### Add custom code

To commit your custom modules, themes, or libraries, add those to the `web/modules/custom` or `web/themes/custom` directory and commit them to Git as normal.

### Change the services configuration

You can change and define the topology of the services used in an
environment, by modifying the configuration files.

This means that you're able to define and configure the services you
want to use.

### Push your changes

When you're done, commit your changes to test them on your online
environment.

```bash
$ git add .
$ git commit -m "Made changes to my files."
$ git push
```

You will see that Platform has found a make file and is starting to
rebuild your environment.

When it's completed, you can see your changes on your site by clicking
`View this website` under the name of **Sprint1** environment on the
Platform.sh Web Interface.

> **note**
> The build process makes no changes to your Git repository.  Your Git repository is the *input* of the process. A PHP container containing your code and dependencies is the *output*. You can see the directory structure that has been created by connecting via SSH to the environment. See the information in the `Access information` below the title of the environment

## Merge code changes to Master

Once you've got a branch with some changes, you'll want to be able to
push those changes up to your live environment. Platform.sh has a great
button called `Merge` that you can click on and it will push the
appropriate changes to master.

![Merge your changes.](/images/merge.png)

Just click on the "Merge" button and all of the commits you made on your
branch will be merged into the master environment.

## Synchronizing data

The easiest way to do that is to use Drush and the sql-sync command.
You'll need to have Drush aliases for both your
Platform.sh site and your local site. If you are using the CLI and
you've run `platform get [platform_id]` for a project, then your Drush
aliases have already been set up.

With the Drush aliases (depending on how yours are set up), you
could use a command similar to this:

```bash
$ drush sql-sync @platform.master @platform._local
```

An alternate method that is appropriate for larger databases is to use
the pipe | to stream the data, instead of making a copy of the dump file.

```bash
$ drush @platform.master sql-dump | drush @platform._local sqlc
```
