#API
Platform.sh provides a REST API (Application Programming
Interface) which allows you to interact whith it. Both the
Platform UI and the Platform CLI are fully integrated with the
Platform API.

#Application
Your application regroups all your code and configuration files
that you want to deploy.

#Branch
A versioned copy of your Git content. A branch is used to develop
a specific feature and test an update, before it is synchronize
and deployed on the live environment. Platform.sh extends the
concept of a Git branch to the environment level.

#Commerce Marketplace
A marketplace of services that extend Drupal Commerce.

#Commerce Kickstart
Commerce Kickstart is the quickest way to get up and running with
Drupal Commerce.

#Configuration files
Those files are stored in Git and allow you to easily interact
with Platform topology and routes.

#Container

CLI Command Line Interface The official tool to use and manage your
Platform projects directly from within your terminal. Anything you can
do in the Platform UI, you can do in your terminal with Platform CLI.

#Deployment hooks
Allows you to run various actions during the deployment of your
environment.

#Domain name
Domain names are managed by Registrars (such as Namecheap.com) and
you are responsible for using appropriate DNS tools for pointing
domains to your Platform.sh Master environment.

#Drupal 
A powerful open source software package that allows
you to easily organize, manage, and publish your content with an
endless variety of customization (see <https://drupal.org/drupal-7.0>
for more information).

#Drupal Commerce
A no-assumption, first-of-a-kind framework that can power the most
demanding ecommerce projects. (see
<https://drupal.org/project/commerce> for more information).

#Drush
Drush is a command-line shell and scripting interface for Drupal.

#Environment
An environment is a Git branch, plus all the services \<service\>
which are serving that branch.

#Active Environment 
An environment which is deployed. You can deactivate an active environment from the
environment configuration page on Platform UI.

#Inactive environment
An environment which is not
deployed. You can activate an inactive environment from the
environment configuration page on Platform UI.

#Environment variables
Variables exposed by Platform to the runtime environment which allow you to define any
specific configuration at the environment level.

#Git
An open source version control system. Also see git.

#Make file
A file used in comination with Drupal and Drush \<drush\> to
download a series of modules, libraries, and repositories. Also
see drush\_make\_files.

#Master
The production website. Master is the only environment which
doesn’t have a parent and which has the most of the resources that
you can get.

#Merge
The act of combining one environment's or branch's code with
another.

#Parent
Platform.sh provides an organized hierarchy for your Git branches.
Each environment has a parent and can have multiple children. You
can merge code to a parent environment, and synchronize code
and/or data to any child environment.


#Platform CLI 
Platform CLI is the official command line
shell and Unix scripting interface for Platform. It ships with all the
useful commands to interact with your Platform projects. You can get
download it [here](https://github.com/commerceguys/platform-cli).

#Production plan
A subscription level which allows you to host your production
website by adding a domain and an SSL certificate.

#Project
A Platform account that consists of a specific set of
environments, users, size, and storage.

#Pull
The act of combining code from a remote branch to a local branch.

#Push
The act of moving and combining code from a local branch to a
remote branch.
Relationship Relationships The relationships of the application with
services or other applications. See also
relationships \<relationships\>.

#Routes
A route describes how an incoming URL is going to be processed by
Platform.sh to serve a project. See also routes\_configuration.

#Scope


#Service
A web technology utilized as part of a server setup and/or
configuration. See also service grid \<service\_grid\>.

#Service Grid
A server setup that allows seperate functionality and scale of
services as needed. See also service grid \<service\_grid\>.

#Sprint
A short-term initiative or release in an agile development cycle.

#SSH
A cryptographic network protocol for secure data communication,
remote command-line login, remote command execution, and other
sercure network services between two networked computers. See also
ssh.

#SSH Key
A means to identify yourself to an SSH server securely.

#SSL Certificate
A certificate used to serve and secure your site.

#Symfony
Symfony is a PHP web application framework for MVC applications.
Symfony is free software and released under the MIT license (see
<http://symfony.com/> for more information).

#Sync
The act of updating an environment with code and data from a
parent environment.

#Toolstack
A specific set of tools that you're project is built with. It can
be a CMS (Drupal), a framework (Symfony)...