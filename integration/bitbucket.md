# Bitbucket

The [Bitbucket add-on](https://platform.sh/bitbucket) allows you to manage your
Platform.sh environments directly from your Bitbucket repository.

## Install the add-on

On your Bitbucket account, click on your avatar, select ``Manage Account``, and simply install the Platform.sh add-on by selecting ``Find new add-ons`` from the left menu. The Platform.sh add-on is under the *Deployment* category.

> **note**
> You can also install the add-on at the *team* level so that every repository that belong to the team can use the add-on.

## Get started

To connect your Bitbucket repository to Platform.sh, go to the repository page on Bitbucket and click on the ``Settings`` icon. Then Click on ``Platform.sh integration`` under ``PLATFORM.SH``.

> **note**
> You need to be an administrator on the repository to connect the repository to Platform.sh.

You can then *Create a new project* or even connect to an existing project if you already have a project on Platform.sh.

The add-on needs access to some information on your repository. Click on ``Grant access``. Choose the region where you want your Platform.sh project to be hosted and click ``Create free project``.

That's it! The bot will build your Platform.sh project and connect it to your Bitbucket repository.

You can already start pushing code (branch, pull request...) to your Bitbucket repository and see those changes automatically deployed on Platform.sh.

> **warning**
> The following steps are *REQUIRED* for deploying your code to Platform.sh. 
> In Platform.sh, the configuration of your project architecture and the services that are running is stored in YAML files that you need to commit to your Git repository.

## Set up your configuration files

Depending on the language (PHP) and the stack that you are running (Symfony, WordPress, Drupal...), your configuration file might be slightly different.

### Configure your application

> **see also**
> ...

### Configure your services

> **see also**
> ...