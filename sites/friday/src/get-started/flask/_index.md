---
title: Flask
description: This guide provides instructions for deploying, and working with Flask on {{% vendor/name %}}.
---

# Guide to deploying a Flask app on {{% vendor/name %}}

If you're more of a just-give-me-the-steps type of person, you can jump straight to the
[TL;DR step-by-step](#tldr-step-by-step) included at the end of this guide.

This guide provides instructions for deploying, and working with [Flask](https://flask.palletsprojects.com/) on {{% vendor/name %}}.
If you are unfamiliar with Flask, it is a lightweight and popular web framework for building web applications using
Python. It is often referred to as a "micro" framework because it provides the essential components for building web
applications but leaves many decisions and extensions up to the developer.

## Setting up the application and repository
For the purposes of this guide, we'll start by generating a
[Flask package project](https://github.com/cookiecutter-flask/cookiecutter-flask) from
[Cookiecutter](https://github.com/cookiecutter/cookiecutter). From there we'll walk through the steps needed to deploy
the project on {{% vendor/name %}}. With all things in tech, there are many ways to accomplish the same goal; the correct way will
depend on your specific needs and goals, and the makeup of your project. The following guide is simply one way to
accomplish deploying a flask application on {{% vendor/name %}}.

From a terminal/command line prompt, first install Cookiecutter:
```shell
$ pip3 install cookiecutter
```


Next we need to generate the Flask template from cookiecutter. If this is your first time generating a Flask
Cookiecutter template, you will need to point to the full GitHub repository address:
```shell
$ cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git
```

Otherwise, you can just indicate the specific template you want to generate:
```shell
$ cookiecutter cookiecutter-flask
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
$ git init .
```

By default, git will still use `master` as the name for the initial branch. If you wish to change the default
branch name, you can do so with the `git branch -m` command. I'll rename mine to `main`:
```shell
$ git branch -m main
```

## {{% vendor/name %}} configuration files
Now that we have the repository initialized, and our template generated, we're ready to prepare it for use on
{{% vendor/name %}}. Before attempting the next command, make sure you have the
[{{% vendor/name %}} CLI tool installed](https://docs.platform.sh/administration/cli.html) and working, and
have [authenticated the cli tool](https://docs.platform.sh/administration/cli.html#2-authenticate) with your {{% vendor/name %}}
account. We're now ready to have the {{% vendor/name %}} cli tool generate the configuration files we'll need to deploy on {{% vendor/name %}}.

```shell
$ {{% vendor/cli %}} project:init
```

This command is also available as `{{% vendor/cli %}} ify`

The {{% vendor/name %}} cli tool will now ask you a series of questions to determine your project's requirements:

```shell
$ {{% vendor/cli %}} project:init
Welcome to {{% vendor/name %}}!
Let's get started with a few questions.

We need to know a bit more about your project. This will only take a minute!

What language is your project using? We support the following:
Use arrows to move up and down, type to filter
  C#/.Net Core
  Elixir
  Go
  Java
  Lisp
  JavaScript/Node.js
  PHP
> Python
  Ruby
```

Scroll down and select `Python`. It should then automatically detect your dependency manager.

```shell
What language is your project using? We support the following: [Python]

✓ Detected dependency managers: Pip
```

It will then ask for the name of your application. From there it should prompt you for services your project
needs. Select each one and then hit Enter. For this demonstration, I only need `PostgreSQL`

```shell

                       (\_/)
We’re almost done...  =(^.^)=

Last but not least, unless you’re creating a static website, your project uses services. Let’s define them:

Select all the services you are using:
Use arrows to move, space to select, type to filter
  [ ]  MariaDB
  [ ]  MySQL
> [x]  PostgreSQL
  [ ]  Redis
  [ ]  Redis Persistent
  [ ]  Memcached
  [ ]  OpenSearch
```

It will then generate a series of configuration files for you:

```shell

┌───────────────────────────────────────────────────┐
│   CONGRATULATIONS!                                │
│                                                   │
│   We have created the following files for your:   │
│     - .environment                                │
│     - {{< vendor/configfile "app" >}}                         │
│                                                   │
│   We’re jumping for joy! ⍢                        │
└───────────────────────────────────────────────────┘
         │ /
         │/
         │
  (\ /)
  ( . .)
  o (_(“)(“)

You can now deploy your application to {{% vendor/name %}}!
To do so, commit your files and deploy your application using the {{% vendor/name %}} CLI:
  $ git add .
  $ git commit -m 'Add {{% vendor/name %}} configuration files'
  $ {{% vendor/cli %}} project:set-remote
  $ {{% vendor/cli %}} push
```

Last, we need to add all of our generated files, from both Cookiecutter and the {{% vendor/name %}} CLI tool to our git
repository:
```shell
$ git add .
$ git commit -m "initial commit"
```

Before we can deploy our application, we'll need to create a new project on {{% vendor/name %}}. From the command line:
```shell
$ {{% vendor/cli %}} project:create
```
The CLI tool will now walk you through the creation of a project asking you for your organization, the project's
title, the region where you want the application housed, and the branch name (use the same one we set
earlier). For now, allow the cli tool to set {{% vendor/name %}} as your repository's remote, and then select `Y` to
allow the tool to create the project. The {{% vendor/name %}} bot will begin the generation of your {{% vendor/name %}} project and once
done, will report back the details of your project including the project's ID, and URL to where you can
manage the project from the {{% vendor/name %}} web console. Don't worry if you forget any of this information: you can
retrieve it later with:
```shell
$ {{% vendor/cli %}} project:info
```

And you can launch the web console for your project at any time by doing
```shell
$ {{% vendor/cli %}} web
```

Now that we have our {{% vendor/name %}} project created, our local project generated and associated with the {{% vendor/name %}} project,
the only thing left to do is add configurations that are specific to the application. To start, we need to
add an environment variable for `FLASK_APP` for all environments that points to our `autoapp.py` file. Open
the file `{{< vendor/configfile "app" >}}` that the cli tool generated and locate the commented
line that starts with

```yaml
# Variables to control the environment.
```

We need to uncomment the next two lines underneath this line, and add our environmental variable to the list:

```yaml {configFile="app"}
    # Variables to control the environment.
    variables:
      env:
        FLASK_APP: autoapp.py
```

{{< note >}}
When uncommenting this section, or any others in a yaml file make sure you remove both the comment marker `#`
as well as the extra space. If you don't remove the extra space, you will end up with a
`Invalid block mapping key indent` error when the configuration file is validated.
{{< /note >}}

Since this project uses npm in addition to Python, we're going to want {{% vendor/name %}} to also run an `npm install`
when it builds the application image. In the `{{< vendor/configfile "app" >}}` find the line that starts with:

```yaml {configFile="app"}
# Hooks allow you to customize your code/environment
```

Beneath that line will be a section for `build:`. The
[build hook](https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#build-hook) allows us to make changes to
the application before it is finalized and deployed. You should notice that when the cli tool generated the
configuration file for us, it automatically added `pip install -r requirements.txt` for us! This same section is where
we'll also instruct {{% vendor/name %}} to install our npm packages. But before that, I usually like to upgrade pip before
I run `pip install` so I'm going to add a new line above that and add in `pip install --upgrade pip`. Then
I'll add another line after the initial `pip install` and add `npm install`:

```yaml {configFile="app"}
    # Hooks allow you to customize your code/environment
    hooks:
      build: |
        set -eux
        pip install --upgrade pip
        pip install -r requirements.txt
        npm install
```

We also need to inform {{% vendor/name %}} what should occur when our application is deployed. The
[deploy hook](https://docs.platform.sh/create-apps/hooks/hooks-comparison.html#deploy-hook) is
similar to the build hook but runs after the application image has been built. At this stage the
application image is read-only, <!-- might not be true -->but our writable disk space has been mounted and
is now accessible<!-- /end might not be true -->. Find the `deploy:` yaml key, add a new line after
`set -eux` and add `npm run build`:

```yaml {configFile="app"}
      deploy: |
        set -eux
        npm run build
```

Next we need to configure how {{% vendor/name %}} will handle requests to this application image. In the `{{< vendor/configfile "app" >}}`
file locate the line that starts with:

```yaml {configFile="app"}
# The web key configures the web server running in front of your app.
```

Beneath that line there should be a yaml property of `web`. A few lines beneath that line
will be a yaml property of `start:` Once again, the cli tool already added some information here, but
since it doesn't know the specifics of what needs to be used, has simply left instructions. For now, we
only need the basic Flask server, so we'll replace the current contents with `flask run -p $PORT`.

```yaml {configFile="app"}
    # The web key configures the web server running in front of your app.
    web:
      # Commands are run once after deployment to start the application process.
      commands:
        # The command to launch your app. If it terminates, it’s restarted immediately.
        # You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream
        start: "flask run -p $PORT"
```

Since we're using the flask server (for now), we also need to change the `socket_family` from `unix`
to `tcp`:

```yaml {configFile="app"}
        start: "flask run -p $PORT"
      # You can listen to a UNIX socket (unix) or a TCP port (tcp, default).
      upstream:
        # Whether your app should speak to the webserver via TCP or Unix socket. Defaults to tcp
        socket_family: tcp
```

We've now added all the configuration {{% vendor/name %}} needs to be able to build and deploy our application! Let's
go ahead and commit these changes:
```shell
$ git add {{< vendor/configfile "app" >}}
$ git commit -m "adds FLASK_APP env var, adds mount for static builds, build commands, npm run build on deploy, web start command"
```

{{< note >}}
By default, the `{{% vendor/cli %}} project:init` command will set the language runtime to the latest possible version. If
your project requires an older version, you will need to change it before pushing your code to {{% vendor/name %}}. To change
the runtime version, locate the `type` key near the top of the `{{< vendor/configfile "app" >}}` file, and change it the desired
version. A [complete list of supported versions of Python](https://docs.upsun.com/languages/python.html#supported-versions)
is available in the documentation. Do not forget to add and commit your changes to git before pushing your code.
{{< /note >}}

## Preparing the application for {{% vendor/name %}}
While we've finished telling {{% vendor/name %}} what it needs to do in order to build and deploy our application,
our application still needs to know some things about {{% vendor/name %}}. This type of information typically goes
into your `.env` file. {{% vendor/name %}} generates all of this type of data and exposes it to the application as
environmental variables in the deployed image. Since the information is dynamic, and changes from
environment to environment, we don't want to commit those static values in a `.env` file. Instead, {{% vendor/name %}}
supports a `.environment` file that is sourced in the application image, as well as your shell when you
ssh into the application. For a list of all the variables that {{% vendor/name %}} generates, please refer to the
[documentation on provided environmental variables](https://docs.platform.sh/development/variables/use-variables.html#use-provided-variables).

Open the `.environment` file that the cli tool generated earlier. Notice it has already created some
environmental variables for you that point back to those variables that {{% vendor/name %}} will generate. We'll
need to add a few more for our Flask application so flask has what it needs to be able to function properly.
To start, we need to update the `DATABASE_URL` variable. Change the line from:

```shell
export DATABASE_URL="${DB_CONNECTION}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```
to :
```shell
export DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}
```

Now we need to add the remainder of the variables that are defined in `.env`. We already took care of
`FLASK_APP` in the `{{< vendor/configfile "app" >}}` file, and updated `DATABASE_URL` so that leaves:
* `FLASK_ENV`
* `FLASK_DEBUG`
* `LOG_LEVEL`
* `SEND_FILE_MAX_AGE_DEFAULT`
* `SECRET_KEY`
* `GUNICORN_WORKERS`

{{% vendor/name %}} provides us information about what type of environment the application is running in via an
environmental variable named `PLATFORM_ENVIRONMENT_TYPE` whose values can be `production`, `development`,
and `staging`. Inside the .environment file, add the following line:

```shell
export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
```

However, several of the other environmental variables also need to change depending on whether we are on a
production environment, so we can leverage the information in `PLATFORM_ENVIRONMENT_TYPE` to not only set
`FLASK_ENV` but also several of the other variables. We only want `FLASK_DEBUG` enabled (`1`) if we're not
running in production. Inside the `.environment` file, add the following line:

```shell
export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
```

If the environment we're on is production, we'll return `0` (disabled), otherwise we'll return `1` (enabled).
Let's do something similar for `LOG_LEVEL`. Inside the `.environment` file, add the following line:

```shell
export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
```

If the environment we're on is production, we'll set `LOG_LEVEL` to `info`, otherwise we'll set it to
`debug`. The last environmental variable that needs to be different based on environment type is
`SEND_FILE_MAX_AGE_DEFAULT` where we want it to be `0` if we're not on production, but a higher value if
we are. Inside the `.environment file`, add the following line:

```shell
export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
```

The next environmental variable we need to set is `SECRET_KEY`. It is used for securely signing the session
cookie and can be used for any other security related needs by extensions or your application. It should
be a long random string. Again, {{% vendor/name %}} provides us with something for exactly this purpose as an environmental
variable: `PLATFORM_PROJECT_ENTROPY`.  Inside the `.environment` file, add the following line:

```shell
export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
```

Last is the easiest, and while we aren't using Gunicorn yet, we will later in production. Inside the
`.environment` file, add the following line:

```shell
export GUNICORN_WORKERS=1
```

Since we've made changes to our `.environment` file, we'll need to commit those changes before we push
the repository to {{% vendor/name %}}:

```shell
$ git add .environment
$ git commit -m "adds needed flask environmental variables"
```

Now we can push the changes to {{% vendor/name %}} and activate our initial environment:

```shell
$ {{% vendor/cli %}} environment:push
```

Answer `Y` to the question "Are you sure you want to push to the main (type: production) branch?"

{{% vendor/name %}} will now read your configuration files, and begin building your application image. **Your first push
will fail**; don't worry, this is expected. At this point {{% vendor/cli %}} is not aware of the resources
our application needs. We need to tell it what kind of CPU, Memory, and disk to assign to the various containers. Back
in your terminal, run:

```shell
$ {{% vendor/cli %}} resources:set
```

This will launch an interactive prompt to walk you through setting up your application's resources:

```shell
❯ {{% vendor/cli %}} resources:set
Resource configuration for the project my_flask_cookie (zh5v7xxqzetqm), environment main (type: production):
+-----------------------+---------+---------+-------------+-----------+-----------+
| App or service        | Size    | CPU     | Memory (MB) | Disk (MB) | Instances |
+-----------------------+---------+---------+-------------+-----------+-----------+
| my_flask_cookie       | not set | not set | not set     | N/A       | 1         |
| postgresql            | not set | not set | not set     | not set   | 1         |
+-----------------------+---------+---------+-------------+-----------+-----------+
```

The first question is what profile size you want applied to your application image. For now let's select `1`:
```shell
App: my_flask_cookie

Choose a profile size:
  [0.1 ] CPU 0.1, memory 64 MB
  [0.25] CPU 0.25, memory 128 MB
  [0.5 ] CPU 0.5, memory 224 MB
  [1   ] CPU 1, memory 384 MB
  [2   ] CPU 2, memory 704 MB
  [4   ] CPU 4, memory 1216 MB
  [6   ] CPU 6, memory 1728 MB
  [8   ] CPU 8, memory 2240 MB
  [10  ] CPU 10, memory 2688 MB
 > 1
```
Next it will ask how many instances of our application container we need deployed. For now let's go with `1`:
```shell
Enter the number of instances (default: 1): 1
```

Now that we've defined the resources for our application container, the CLI will proceed through the same process for
each service we added previously. In this case, we just have our PostgreSQL service. Let's choose a profile size of `1`
for it as well:
```shell
Service: postgresql

Choose a profile size:
  [0.1 ] CPU 0.1, memory 448 MB
  [0.25] CPU 0.25, memory 832 MB
  [0.5 ] CPU 0.5, memory 1408 MB
  [1   ] CPU 1, memory 2432 MB
  [2   ] CPU 2, memory 4032 MB
  [4   ] CPU 4, memory 6720 MB
  [6   ] CPU 6, memory 9024 MB
  [8   ] CPU 8, memory 11200 MB
  [10  ] CPU 10, memory 13184 MB
 > 1
```
Since this is a database, it will need persistent disk storage in order to save our data. Each {{% vendor/name %}}
project starts with 5GB of data that is shared across all services. Let's go ahead and give our PostgreSQL service
2GB (`2048`MB):
```shell
Enter a disk size in MB: 2048
```
Last it will ask us to confirm our choices. Select `Y` and the {{% vendor/name %}} will take your selections, grab the
previous built images from early, apply our resource selections to them and deploy our full application!

However, you'll notice that NPM reported errors near the end of the deploy process when it tried to create static assets.
This is because application containers are read-only by default, and NPM needs a place to write its files. We'll need
to define some some writable disk space to hold the static assets that npm builds and flask-static-digest generates.
This directory exists under our application package name as `./<application-name>/static`. In
`{{< vendor/configfile "app" >}}`, find the line that starts with:

```yaml {configFile="app"}
# Mounts define directories that are writable after the build is complete
```

We'll need to uncomment the line `# mounts:` and then add an entry describing where we want a writable
mount added:

```yaml {configFile="app"}
    # Mounts define directories that are writable after the build is complete.
    mounts:
      "my_flask_cookies/static": # Represents the path in the app.
        source: "local" # "local" sources are unique to the app, while "service" sources can be shared among apps.
        source_path: "static_assets" # The subdirectory within the mounted disk (the source) where the mount should point.
```

`source` indicates if this is a local storage mount or a service. `source_path` is the subdirectory within
the mounted disk (the source) where the mount should point. For further information, please see the
[documentation on mounts](https://docs.platform.sh/create-apps/app-reference.html#mounts).

Because we've now defined a mount, we'll need to inform {{% vendor/name %}} that we want to add persistent disk to our
application container. In your terminal, let's define 1024MB of disk for our application container, where the format for
disk is `--disk=<app-container-name><disk-in-mb>`:

```shell
$ {{% vendor/cli %}} resources:set --disk=my_flask_cookie_upsun:1024
```
It will ask us to confirm your update. Select `Y` and the {{% vendor/name %}} will apply the new mount to your
application, redeploy all our containers, and at the end of the process, report back the URLs associated with our
project.

## Setting up the Database

You may have noticed that we haven't done anything in regards to a database. This application uses
[Flask-migrate](https://flask-migrate.readthedocs.io/en/latest/) and since this is a brand-new application, we'll
need to set up the initial migrations, and commit them so we can then have them applied to our {{% vendor/name %}} db. However,
because the migrate command needs access to the database, we'll need to set up a temporary local environment and give
it a way to access the database service.

Let's first set up a virtual environment to run our project inside of:
```shell
$ python3 -m venv env && source venv/bin/activate
```

Just like in our build hook, let's update pip and install our requirements:
```shell
$ pip install –upgrade pip
$ pip install -r requirements.txt
```

Next, we're going to need to set up this local instance so it can communicate with our database service.
When we did the push to {{% vendor/name %}} previously, it created and deployed our database service. The {{% vendor/name %}} CLI tool
gives us a method to communicate to our application's services: [upsun tunnel](https://docs.platform.sh/development/ssh.html#use-a-direct-tunnel)

```shell
$ {{% vendor/cli %}} tunnel:open -y
```

This opens an ssh tunnel to all the services for the application, and we can now use it to allow our local
instance to communicate with them as if they too were local. To do that though, we'll need to configure
some environmental variables similarly to how we did previously for {{% vendor/name %}}. If you reopen the
`.environment` file, you'll notice at the top that we make use of an environment variable named
`$PLATFORM_RELATIONSHIPS` in order to retrieve information about services and their credentials. `{{% vendor/cli %}} tunnel`
provides us a method to generate that same data locally:

```shell
$ export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"
```

If you now try `echo $PLATFORM_RELATIONSHIPS` you'll see it has been set to a fairly large base64 encoded value.
This string contains our services, their definitions, locations, and most importantly, their credentials.
Because we have this environmental variable set locally, we can reuse our `.environment` file for {{% vendor/name %}} to
recreate many of the other environmental variables we need to run locally.

However, we have a few that aren't set via `PLATFORM_RELATIONSHIPS` that we still need to set up:

```shell
$ export PLATFORM_ENVIRONMENT_TYPE=production
$ export PORT=8888
$ export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)
```

And last, source our `.environment` file to finish setting up all the environmental variables in our current
shell:

```shell
$ source ./.environment
```

We now have everything we need for Flask-Migrate to be able to connect to the database and generate our
migration files. First we need to have Flask-Migrate initiate the migrations directory and prepare for the
migrate command:

```shell
$ flask db init
```

Now we can have Flask-migrate generate our migrations:

```shell
$ flask db migrate
```

And now commit our generated migrations:

```shell
$ git add migrations/*
$ git commit -m "adds migrations"
```

We now need to instruct {{% vendor/name %}} to run the Flask-migrate upgrade command when deploying so we know any
migration changes are automatically applied. Re-open the `{{< vendor/configfile "app" >}}` and find the `deploy` hook where we
added `npm run build`. On the next line, add `flask db upgrade`.

```yaml {configFile="app"}
      deploy: |
        set -eux
        npm run build
        flask db upgrade
```

Commit the changes:

```shell
$ git add {{< vendor/configfile "app" >}}
$ git commit -m "adds flask db upgrade to deploy hook"
```

And finally, push everything up to our {{% vendor/name %}} environment!

```shell
$ {{% vendor/cli %}} environment:push -y
```

Congrats! You've now successfully deployed your Flask application to {{% vendor/name %}}! Take a moment to visit your site
and test it out!

## Local Development
Now that we have our flask application working on {{% vendor/name %}} we'll need a local environment to be able to make
quick changes. Luckily flask already has a development server we can take advantage of! And we can utilize
everything we set up previously with the flask development server.

When we pushed our changes to {{% vendor/name %}} in the last section, it caused our database service to be redeployed
which closed our tunnel, so first we'll need to reopen it:

```shell
$ {{% vendor/cli %}} tunnel:open -y
```

You can verify the tunnel is open and working again by running the following command:

```shell
$ {{% vendor/cli %}} tunnel:info
```

Next we'll do the same steps we added to our build hook:

```shell
$ npm install
$ npm run build
```

Now we can run npm start which will run start up webpack watch and start up our flask dev server:

```shell
$ npm run start
```

You can now view http://127.0.0.1:5000 in your browser to see your local instance.
{{< note >}}
Please note that you are
connected to your production database so any changes you make locally in the interface (like adding a new
user) are being added to production. In the next guide will discuss setting up a local development environment
that creates copies of your database to run locally as well.
{{< /note >}}

## Switching from the Flask server to an alternative Web Server
While lightweight and easy to use, Flask’s built-in server is not suitable for production as it doesn’t
scale well. {{% vendor/name %}} [supports several different web servers](https://docs.platform.sh/languages/python/server.html) for Python that you can use instead. The specific
web server you choose will depend on your application and specific requirements. Let's look at how we can
switch our project to use [gunicorn](https://gunicorn.org/) + PORT.

Reopen the `{{< vendor/configfile "app" >}}` file. Locate the `web:commands:start` section where in the previous section we
added `flask run -p $PORT`. We now want to change it to `gunicorn -w 4 'autoapp:app'`

```yaml {configFile="app"}
    web:
      # Commands are run once after deployment to start the application process.
      commands:
        # The command to launch your app. If it terminates, it’s restarted immediately.
        # You can use the $PORT or the $SOCKET environment variable depending on the socket family of your upstream
        start: "gunicorn -w 4 'autoapp:app'"
```

Commit the changes and push them up to your environment:

```shell
$ git add {{< vendor/configfile "app" >}}
$ git commit -m "changes project to use gunicorn"
$ {{% vendor/cli %}} e:push -y
```

## Conclusion
Now that you have your Flask application up and running on {{% vendor/name %}}, we'll explore the different options you
have for a more robust local development environment, adding a source control integration, and adding
various services to your project. But for now, go forth and Deploy (even on Fridays)!






## TL;DR Step-by-Step
`T:` - run the line in a terminal/command prompt

1. T: `pip3 install cookiecutter`
2. T: `cookiecutter https://github.com/cookiecutter-flask/cookiecutter-flask.git`
3. Answer questions
   1. Name
   5. Email
   6. Github_username
   7. Project name
   8. App name
   9. Description
   10. Pipenv
   11. Python version
   12. Node version
   13. heroku
14. Cd into directory (should be what you answered for 3.5)
15. T: `git init .`
16. T: `git branch -m main`
17. T: `{{% vendor/cli %}} project:init`
    1. Select Python
    19. Select Postgres
20. T: `git add .`
21. T: `git commit -m "init commit"`
22. T: `{{% vendor/cli %}} p:create`
23. Answer questions
    1. Choose your org
    25. Give it a title
    26. Choose a region
    27. Enter the branch name from #6
    28. Set the project as the remote (for now)
    29. Select Y to "continue"
30. Open `{{< vendor/configfile "app" >}}`
    1. Find the section describing "Variables"
    32. Uncomment `# variables` and the next line `env:`
    33. On the next line, add `FLASK_APP: autoapp.py`
    43. Find the section for `hooks:build`
    44. On the line before `pip install`, add the following:
        ```yaml {configFile="app"}
        pip install --upgrade pip
        npm install
        ```
    48. Scroll down to the `deploy` section
    49. On the line after `set -eux`, add
        ```yaml
        npm run build
        ```
    51. Find the section `web:commands:start` and change it to
        ```yaml {configFile="app"}
        start: flask run -p $PORT
        ```
    53. Below this find the section for `upstream:socket_family` and either comment out both lines, or change `unix` to `tcp`
54. T: `git add {{< vendor/configfile "app" >}}`
55. T: `git commit -m "adds FLASK_APP env var, adds mount for static builds, build commands, npm run build on deploy, web start command"`
56. Open `.environment` file
    1. Change `DATATABASE_URL` to: `postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
    58. Add the following lines to .environment:
        ```shell
           export SECRET_KEY="${PLATFORM_PROJECT_ENTROPY}"
           export FLASK_DEBUG=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 0 || echo 1)
           export FLASK_ENV="${PLATFORM_ENVIRONMENT_TYPE}"
           export GUNICORN_WORKERS=1
           export LOG_LEVEL=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo "info" || echo "debug")
           # In production, set to a higher number, like 31556926
           export SEND_FILE_MAX_AGE_DEFAULT=$( [ "${PLATFORM_ENVIRONMENT_TYPE}" = "production" ] && echo 31556926 || echo 0)
        ```
66. T: `git add .enviornment`
67. T: `git commit -m "adds needed flask env vars"`
68. T: `{{% vendor/cli %}} e:push`
    1. Answer Y <-- push will fail, and is _expected_
70. T: `upsun resources:set`
    1. Set application to profile size `1`
    2. Set number of application instances to `1`
    3. Set postgresql profile size to `1`
    4. Set persistent disk for postgresql to `2048`
    5. Select `Y` to confirm choices
1. Find the section describing `mounts`
35. Uncomment `# mounts:`
36. On the next line add
      ```yaml {configFile="app"}
      "<name-of-your-app-from-3.5-above>/static":
        source: local
        source_path: static_build
      ```
37. T: `upsun resources:set --disk=<name-of-your-app-from-3.5-above>:1024`
38. Select `Y` to confirm changes to your application resources
71. T: `python3 -m venv env`
72. T: `source venv/bin/activate`
73. T: `pip install --upgrade pip`
74. T: `pip install -r requirements.txt`
75. T: `{{% vendor/cli %}} tunnel:open -y`
76. T: `export PLATFORM_RELATIONSHIPS="$({{% vendor/cli %}} tunnel:info --encode)"`
77. T: `export PORT=8888`
78. T: `export PLATFORM_PROJECT_ENTROPY=$(openssl rand -base64 32)`
79. T: `export PLATFORM_ENVIRONMENT_TYPE=production`
80. T: `source ./.environment`
81. T: `flask db init`
82. T: `flask db migrate`
83. Open `{{< vendor/configfile "app" >}}`
    1. Find the section for `hooks:deploy`
    85. On a new line after `npm run build`, add `flask db upgrade`
86. T: `git add migrations/*`
87. T: `git commit -m "adds migrations"`
88. T: `git add {{< vendor/configfile "app" >}}`
89. T: `git commit -m "adds flask db upgrade to deploy hook"`
90. T: `{{% vendor/cli %}} environment:push`

The above steps do not include setting up a local development environment, or switching to gunicorn as a web server.
