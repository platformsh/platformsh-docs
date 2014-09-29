.. _glossary-label:

Glossary
========

.. glossary::
  :sorted:
  
  API
    Application programming interface. Control :term:`Platform` from your programs (and also from the :term:`Platform UI` and :term:`Platform CLI`).

  Application
    Your application regroups all your code and configuration files that you want to deploy.

  Branch
    A copy of your :term:`git` content. A :term:`branch` is used to develop and test an update, before it is :term:`merge` d with the master. Create and use branches often. 

  CLI
    Command Line Interface. The original text-based interface for controlling a computer. 
    Useful for running technically advanced commands.
    Platform.sh provides you with the :term:`Platform CLI` (and the :term:`Platform UI` for web-based work).

  Commerce Marketplace
    A marketplace of services that extend Drupal Commerce.

  Commerce Kickstart
    Commerce Kickstart is the quickest way to get up and running with Drupal Commerce.

  Configuration files
    Those files are stored in Git and allow you to easily interact with Platform topology and routes.

  Container
    .. todo:: Platform team to write description.

  CLI
  Command Line Interface
    The official tool to use and manage your Platform projects directly from within your terminal. Anything you can do in the Platform UI, you can do in your terminal with Platform CLI.

  Deployment hooks
    Allows you to run various actions during the deployment of your environment.

  Drupal
  Drupal 7
    A powerful open source software package that allows you to easily organize, manage, and publish your content with an endless variety of customization (see https://drupal.org/drupal-7.0 for more information).

  Drupal Commerce
    A no-assumption, first-of-a-kind framework that can power the most
    demanding ecommerce projects. (see https://drupal.org/project/commerce for more information).

  Drush
    Drush is a command-line shell and scripting interface for Drupal.

  Environment
    An environment is a Git branch, plus all the :term:`services <service>` which are serving that branch.

  Environment active
  Active environment
    An environment which is deployed. You can deactivate an active environment from the environment configuration page on Platform UI.

  Environment inactive
  Inactive environment
    An environment which is not deployed. You can activate an inactive environment from the environment configuration page on :term:`Platform UI`.

  Environment variables
  Environment variable
    Variables exposed by Platform to the runtime environment which allow you to define any specific configuration at the environment level.
  
  Git
    An open source version control system. Your Platform project work is stored in :term:`git`. 
    Also see :ref:`git`

  Make file
    A file used in comination with Drupal and :ref:`Drush <drush>` to download a series of modules, libraries, and repositories. Also see :ref:`drush_make`.

  Master
    The production website. Master is the only environment which doesn’t have a :term:`parent` and which has the most of the resources that you can get.

  Merge
    The act of combining one :term:`environment`'s or :term:`branch`'s code with another.

  Parent
    A :term`git` term for the content a branch was copied from. 
    The original content is the parent and the branched content is the child.

  Platform
    The best thing that happened to your web projects since :term:`Drupal`.

  Platform UI
    Platform UI is a :term:`web UI` control panel for :term:`Platform` work. 
    The UI for the best thing that happened to your web projects since Drupal.
    Platform.sh provides you with and the :term:`Platform UI` for web-based work (and the :term:`Platform CLI` for command line work).

  Platform API
    The API for the best thing that happened to your web projects since Drupal.

  Platform CLI
    Platform CLI is a :term:`CLI` helper for :term:`Platform` work. 
    The :term:`Platform CLI` is the official command line shell and Unix scripting interface for Platform. It ships with all the useful commands to interact with your Platform projects. Download Platform CLI `here <https://github.com/commerceguys/platform-cli>`_.

  Project
    A Platform account that consists of a specific set of environments, users, size, and storage.

  Pull
    The act of combining code from a remote branch to a local branch.

  Push
    The act of moving and combining code from a local branch to a remote branch.

  Scope
    .. todo:: Platform team to write description.

  Service
    A web technology utilized as part of a server setup and/or configuration. See also :ref:`service grid <service_grid>`.

  Service Grid
    A server setup that allows seperate functionality and scale of services as needed. See also :ref:`service grid <service_grid>`.

  Sprint
    A short-term initiative or release in an agile development cycle.

  SSH
    A cryptographic network protocol for secure data communication, remote command-line login, remote command execution, and other sercure network services between two networked computers. See also :ref:`ssh`.

  SSH Key
    A means to identify yourself to an SSH server securely.

  Symfony
    Symfony is a PHP web application framework for MVC applications. Symfony is free software and released under the MIT license (see http://symfony.com/ for more information).

  Sync
    The act of updating an environment with code and data from a parent environment.

  Toolstack
    A specific set of tools that you're project is built with. It can be a CMS (Drupal), a framework (Symfony)...

  Web UI
    WWW-based control panel for common tasks. Platform's control panel is :term:`Platform UI`.
