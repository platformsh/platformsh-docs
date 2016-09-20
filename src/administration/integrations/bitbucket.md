# Bitbucket

The [Bitbucket add-on](https://platform.sh/bitbucket/) allows you to manage your
Platform.sh environments directly from your Bitbucket repository.

Supported:

-   Create a new environment when creating a branch or opening a
    pull request on Bitbucket.
-   Rebuild the environment when pushing new code to Bitbucket.
-   Delete the environment when merging a pull request.

## Install the add-on

On your Bitbucket account, click on your avatar, select ``Manage Account``, and simply install the Platform.sh add-on by selecting ``Find new add-ons`` from the left menu. The Platform.sh add-on is under the *Deployment* category.

> **note**
> We recommend you install the add-on at the *team*   level (select ``Manage Team`` instead) so that every repository that belongs to the team can use the add-on.

> **note**
> If you have created your account using the bitbucket oAuth Login in order to use the Platform CLI you will need to setup a
> password which you can do by visiting this page [https://accounts.platform.sh/user/password](https://accounts.platform.sh/user/password)

## Get started

To connect your Bitbucket repository to Platform.sh, go to the repository page *as an administrator* on Bitbucket and click on the ``Settings`` icon. Then Click on ``Platform.sh integration`` under ``PLATFORM.SH``.

You can then *Create a new project* or even connect to an existing project if you already have a project on Platform.sh.

The add-on needs access to some information on your repository. Click on ``Grant access``. Choose the region where you want your Platform.sh project to be hosted and click ``Create free project``.

That's it! The bot will build your Platform.sh project and connect it to your Bitbucket repository.

You can already start pushing code (branch, pull request...) to your Bitbucket repository and see those changes automatically deployed on Platform.sh.

## Types of environment

Environments based on Bitbucket **pull requests** will have the correct 'parent' environment on Platform.sh: they will be activated automatically with a copy of the parent's data.

However, environments based on (non-pull-request) **branches** cannot have parents: they will inherit directly from `master` and start inactive by default.
