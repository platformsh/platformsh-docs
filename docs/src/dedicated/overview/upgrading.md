---
title: "Upgrading to the Integrated UI"
weight: 6
sidebarTitle: "Upgrading"
description: |
    Platform.sh Dedicated Generation 1 projects (created prior to October 2017) used a separate Git repository for Production and Staging.
    That also necessitated running most configuration changes through a ticket and maintaining separate SSH credentials for each environment.
---

{{< description >}}

These older projects can be upgraded to the new Integrated UI,
which eliminates the extra Git repositories and many "must be a ticket" configuration changes,
and makes the Production and Staging environments available in the UI.

To add these environments to the Project Web Interface,
review this entire document, complete a few preparatory steps, and submit a ticket.
Your ticket is added to a queue for updating existing Dedicated projects.
The process may take time to complete, so check your ticket for details, timing, and other important information.

This upgrade is recommended for all users.

## New Features

The new Project Web Interface provides the following features for the Pro plan Staging and Production environments:

* Add and manage user access to the environments
* Sync code between Staging and Production to Integration environments
* Merge code from Integration environment to Staging environment to Production environment
* Add and manage environment variables
* Manage build and deploy hooks with the `.platform.app.yaml` file
* Manage PHP versions and variables with the `.platform.app.yaml` file
* Manage cron jobs with the `.platform.app.yaml` file
* Configure environment settings
* Access the environments using SSH and URL
* View status, build logs, and deployment history

You must still submit a support ticket to update and modify the following in the Staging and Production environments information:

* Redirects from `routes.yaml` file
* Managing PHP extensions
* Managing mounts

You can't perform the following:

* Branch from the Staging and Production environments
* Synchronize data from the Staging and Production environments
* Snapshot the Staging and Production environments

### Branching hierarchy

Before converting your project, the branches include a repository for Development, Staging, and Production.
Each repository has deployment targets configured for Staging and Production.

After converting your project, the hierarchical relationships appear in your Project Web Interface
with two main environment branches for Staging and Production.

## Before you upgrade

When we add Staging and Production access to the Project Web Interface,
we use the user accounts, branch user permissions, and environment variables from your main Development environment.

To prepare, verify that your settings and environment variables are correct.

* Verify code matches across environments
* Verify user account access
* Prepare variables

### Verify code

We strongly recommend working in your local development environment,
deploying to Development, deploying to Staging, and, finally, deploying to Production.
All code should match 100% across each of these environments.
Before submitting a ticket, make sure you sync your code.
This process creates a new branch of code for Staging and Production environments.

If you have additional code, such as new extensions in your Production environment without following this workflow,
then deployments from Integration or Staging overwrite your Production code.

### Verify user account access

We recommend verifying your user account access and permissions set in the Integration environment.
When adding Staging and Production to the Project Web Interface, the process includes all user accounts and settings.
You can modify the settings and values for these environments after they're added.

1. Log in to your Platform.sh account.
2. From your project, click your default branch to view the environment information and settings.
3. Click {{< icon settings >}} **Configure environment**.
4. Click the Users tab to review the user accounts and permission configurations.
5. Add, delete, or update users, if needed.

### Prepare variables

When we convert your project to the new Project Web Interface,
we add variables from Development environment to the Staging and Production environments.
You can review, modify, and add variables through the current Project Web Interface prior to conversion.

1. Log in to your Platform.sh account.
2. From your project, click your default branch to view the environment information and settings.
3. Click {{< icon settings >}} **Configure environment**.
4. On the Variables tab, review the environment variables.
5. To create a new variable, click Add Variable.
6. To update an existing variable, click Edit next to the variable.

For environment-specific variables, including sensitive data and values,
you can add those variables after we update your Project Web Interface.
Environment variables defined in `.platform.app.yaml` or a `.environment` file continue to work.
You can add and manage these variables via SSH and CLI commands directly into the Staging and Production environments.

## Enter a ticket for updating the Project Web Interface

Enter a Support ticket with the suggested title "Connect Stg / Prod to Project’s UI".
In the ticket, request to have your project enabled with Staging and Production in the UI
and confirm that you've taken the steps above to prepare your project.

We will review the infrastructure and settings, create user and environment variables for Staging and Production environments,
and update the ticket with results.

Once started the process usually takes less than an hour.
There should be no downtime on your production site, although you shouldn't push any code to Git while the upgrade is in progress.

When done, you can access review your project through the Project Web Interface.

### (Optional) Migrate environment variables

After conversion, you can manually migrate specific environment variables for Staging and Production.

1. Open a terminal and checkout a branch in your local environment.
2. List all environment variables: `platform variable:list`
3. Log in to your Platform.sh account.
4. Click the Projects tab and the name of your project.
5. Click the Staging or Production environment.
6. On the Variables tab, review the environment variables.
7. Enter the variable name and value.
8. Select the Override checkbox if you want variables in the Project Web Interface to override local CLI or database values.
