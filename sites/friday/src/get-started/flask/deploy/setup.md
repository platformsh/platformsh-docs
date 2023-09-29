---
title: Set up your Flask app and repository
sidebarTitle: Setup your app and repo
description: Steps required for setting up a Flask app and repository to deploy on {{% vendor/name %}} infrastructure.
weight: -250
---

For the purposes of this guide, we'll start by generating a
[Flask package project](https://github.com/cookiecutter-flask/cookiecutter-flask) from
[Cookiecutter](https://github.com/cookiecutter/cookiecutter). From there we'll walk through the steps needed to deploy
the project on {{% vendor/name %}}. With all things in tech, there are many ways to accomplish the same goal; the
correct way will depend on your specific needs and goals, and the makeup of your project. The following guide is simply
one way to accomplish deploying a Flask application on {{% vendor/name %}}.

From a terminal/command line prompt, first install Cookiecutter:
```shell
pip3 install cookiecutter
```


Next we need to generate the Flask template from cookiecutter. If this is your first time generating a Flask
Cookiecutter template, you will need to point to the full GitHub repository address:
```shell
cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git
```

Otherwise, you can just indicate the specific template you want to generate:
```shell
cookiecutter cookiecutter-flask
```

Cookiecutter will next ask you a series of 10 questions.
```shell
[1/10] full_name (): Paul Gilzow
[2/10] email (): paul.gilzow@platform.sh
[3/10] github_username (): gilzow
[4/10] project_name (): my_flask_project
[5/10] app_name (): my_flask_cookie
[6/10] project_short_description (): A demonstration project
[7/10] use_pipenv (): n
[8/10] python_version (): 3.11
[9/10] node_version (): 18
[10/10] use_heroku (): N
```

Answer each one, paying attention to what you use for the `app_name` question as we will need it later. Once
cookiecutter has generated the template, cd into the directory it just created; it will be the same name you
gave for the `app_name` question. For the purposes of this guide, I named mine `my_flask_cookie` and will refer to
it throughout the remainder of the guide.

We need to initiate the contents of this directory as a git repository so before doing anything else, initialize
the repository:
```shell
git init .
```

By default, git will still use `master` as the name for the initial branch. If you wish to change the default
branch name, you can do so with the `git branch -m` command. I'll rename mine to `main`:
```shell
git branch -m main
```

{{< guide-buttons next="Configure your infrastructure" >}}
