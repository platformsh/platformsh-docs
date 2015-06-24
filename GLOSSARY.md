#.platform.app.yaml
This is the main Platform.sh configuration file. It allows you to configure the stack you are using as well as many parameters like build, deploy, cron, runtime dependencies...

#API
Platform.sh provides a REST API (Application Programming Interface) which allows you to interact whith it. Both the Web Interface and the CLI are fully integrated with the Platform.sh API.

#Application
An application regroups all the code and configuration files that you want to deploy. Platform.sh supports multiple application per Git repository.

#Branch
A versioned copy of your Git content. A branch is used to develop a specific feature and test an update, before it is synchronized and deployed on the production. Platform.sh extends the concept of a Git branch to the environment level (code + services + files).

#Commerce Kickstart
Commerce Kickstart is the quickest way to get up and running with Drupal Commerce.

#Configuration files
Those files are stored in your Git repository and allow you to easily interact with Platform.sh topology and routes.

#CLI
A Command Line Interface tool to use and manage your Platform.sh projects directly from within your terminal. Anything you can do in the Platform.sh Web Interface can be done in your terminal with the Platform.sh CLI.

#Domain name
Domain names are managed by Registrars (such as Namecheap.com) and you are responsible for using appropriate DNS tools for pointing domains to your Platform.sh Master environment.

#Drupal 
A powerful open source software package that allows you to easily organize, manage, and publish your content with an endless variety of customization (see <https://drupal.org/drupal-7.0> for more information).

#Drupal Commerce
A no-assumption, first-of-a-kind framework that can power the most demanding ecommerce projects. (see <https://drupal.org/project/commerce> for more information).

#Drush
Drush is a command-line shell and scripting interface for Drupal.

#Drush aliases
Drush aliases allow you to run a drush commands on your local server but actually execute the command on a remote server.

#Environment
An environment is a Git branch, plus all the services which are serving that branch.

#Active Environment 
An environment which is deployed. You can deactivate an active environment from the environment configuration page on Platform.sh Web Interface.

#Inactive environment
An environment which is not deployed. You can activate an inactive environment from the
environment configuration page on Platform.sh Web Interface.

#Environment variables
Variables exposed by Platform.sh to the runtime environment which allow you to define any specific configuration at the environment level.

#Git
An open source version control system. Platform.sh environments are deployed and managed via Git.

#Hook
Allows you to run various actions during the build and/or deployment of your environment.

#Make
A process by which we make stuff.

#Make file
A file used in combination with Drupal and Drush to download external dependencies for your project (modules, libraries, themes).

#Master
The production website. Master is the only environment which doesn’t have a parent and which has the most of the resources that you can get based on your subscription plan.

#Merge
The act of combining one environment's or branch's code with another.

#Parent
Platform.sh provides an organized hierarchy for your Git branches. Each environment has a parent and can have multiple children. You can merge code to a parent environment, and synchronize code and/or data to any child environment.

#Production plan
A subscription level which allows you to host your production website by adding a domain and an SSL certificate.

#Project
A Platform.sh account that consists of a specific set of environments, users, size, and storage.

#Pull
The act of combining code from a remote branch to a local branch.

#Push
The act of moving and combining code from a local branch to a remote branch.

#Relationship 
The relationships of the application with the services that are deployed. They are defined in your .platform.app.yaml.

#Routes
A route describes how an incoming URL is going to be processed by Platform.sh to serve a project. See also .platform/routes.yaml.

#Service
A web technology utilized as part of a server setup and/or configuration. See also service grid.

#Service Grid
A server setup that allows seperate functionality and scale of services as needed. See also service grid.

#Sprint
A short-term initiative or release in an Agile development cycle.

#SSH
A cryptographic network protocol for secure data communication, remote command-line login, remote command execution, and other sercure network services between two networked computers.

#SSH Key
A means to identify yourself to an SSH server securely.

#SSL Certificate
A certificate used to serve and secure your site.

#Symfony
Symfony is a PHP web application framework for MVC applications. Symfony is free software and released under the MIT license (see <http://symfony.com/> for more information).

#Sync
The act of updating an environment with code and or data from a parent environment.

#Toolstack
A specific set of tools that you're project is built with. It can be a CMS (Drupal), a framework (Symfony)...