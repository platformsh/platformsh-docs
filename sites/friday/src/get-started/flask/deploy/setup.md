---
title: Set up your app and repository
sidebarTitle: Set up your app and repo
description: Steps required for setting up a Flask app and Git repository to deploy on {{% vendor/name %}} infrastructure.
weight: -250
---

You can start with an existing Flask app, or generate a new app using [Cookiecutter](https://github.com/cookiecutter/cookiecutter).

{{< note >}}

If you already have a Flask app, jump straight to [initializing your Git repository](#2-initialize-your-git-repository).

{{< /note >}}

## Optional: Generate a Flask project with Cookiecutter

1. To generate a Flask project with [Cookiecutter](https://github.com/cookiecutter/cookiecutter), run the following command:

   ```bash {location="Terminal"}
   cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git
   ```

   Alternatively, if you've already generated a Flask project with Cookiecutter before, indicate the specific template you want to use: 
   
   ```bash {location="Terminal"}
   cookiecutter cookiecutter-flask
   ```

2. To configure your Flask project, follow the prompts and enter responses similar to the following:

   ```bash
   [1/10] full_name (): John Doe
   [2/10] email (): john.doe@upsun.com
   [3/10] github_username (): jdoe
   [4/10] project_name (): my_flask_project
   [5/10] app_name (): my_flask_app
   [6/10] project_short_description (): A demonstration project
   [7/10] use_pipenv (): n
   [8/10] python_version (): 3.11
   [9/10] node_version (): 18
   [10/10] use_heroku (): N
   ```

   Keep note of your `app_name` for later use.</br>
   After you've gone through all the prompts, your Flask project is generated.

## Initialize your Git repository

1. Navigate to your Flask project directory.</br>
   If you’ve generated your Flask project with Cookiecutter,
   run the following command, using the `app_name` [defined previously](#1-optional-generate-a-flask-project-with-cookiecutter):

   ```bash {location="Terminal"}
   cd {{< variable "app_name" >}}
   ```

2. To initialize the contents of the directory as a Git repository, run the following command:

   ```bash {location="Terminal"}
   git init
   ```

   By default, Git uses `master` as the name for the initial branch.</br>
   To change the default branch name, run `git branch -m {{< variable "NEW_BRANCH_NAME" >}}`.</br>

{{< guide-buttons next="Configure your infrastructure" >}}