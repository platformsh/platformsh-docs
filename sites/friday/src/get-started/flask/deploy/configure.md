---
title: Configure infrastructure for a Flask app on {{% vendor/name %}}
sidebarTitle: Configure your infrastructure
description: This guide provides instructions for deploying, and working with Flask on {{% vendor/name %}}.
weight: -200
---

## {{% vendor/name %}} configuration files
Now that we have the repository initialized, and our template generated, we're ready to prepare it for use on
{{% vendor/name %}}. Before attempting the next command, make sure you have the
[{{% vendor/name %}} CLI installed](/administration/cli/_index.md) and working, and
have [authenticated the cli tool](/administration/cli/_index.md#2-authenticate) with your {{% vendor/name %}}
account. We're now ready to have the {{% vendor/name %}} CLI generate the configuration files we'll need to deploy
on {{% vendor/name %}}.

```shell
{{% vendor/cli %}} project:init
```

This command is also available as `{{% vendor/cli %}} ify`.

The {{% vendor/name %}} CLI will now ask you a series of questions to determine your project's requirements:

```shell
❯ {{% vendor/cli %}} project:init
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
needs. Select each one and then hit **Enter**. For this demonstration, I only need `PostgreSQL`

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

Last, we need to add all of our generated files, from both Cookiecutter and the {{% vendor/name %}} CLI to our git
repository:
```shell
git add . && git commit -m "initial commit"
```

Before we can deploy our application, we'll need to create a new project on {{% vendor/name %}}. From the command line:
```shell
{{% vendor/cli %}} project:create
```
The {{% vendor/name %}} CLI will now walk you through the creation of a project asking you for your organization,
the project's title, the region where you want the application housed, and the branch name (use the same one we set
earlier). For now, allow the {{% vendor/name %}} CLI to set {{% vendor/name %}} as your repository's remote, and then
select `Y` to allow the tool to create the project. The {{% vendor/name %}} bot will begin the generation of your
{{% vendor/name %}} project and once done, will report back the details of your project including the project's ID, and
URL to where you can manage the project from the {{% vendor/name %}} web console. Don't worry if you forget any of this
information; you can retrieve it later with:
```shell
{{% vendor/cli %}} project:info
```

And you can launch the web console for your project at any time by doing
```shell
{{% vendor/cli %}} web
```


Now that we have our {{% vendor/name %}} project created, our local project generated and associated with the
{{% vendor/name %}} project, the only thing left to do is add configurations that are specific to the application. To
start, we need to add an environment variable for `FLASK_APP` for all environments that points to our `autoapp.py` file.
Open the file `{{< vendor/configfile "app" >}}` that the {{% vendor/name %}} CLI generated and locate the commented line that starts
with:

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
When uncommenting this section, or any others in a YAML file make sure you remove both the comment marker `#`
as well as the extra space. If you don't remove the extra space, you will end up with a
`Invalid block mapping key indent` error when the configuration file is validated.
{{< /note >}}

Next we're going to need some writable disk space to hold the static assets that npm builds and
flask-static-digest generates. This directory exists under our application package name as
`./<application-name>/static`. In
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
`source` indicates if this is a local storage mount or a service. `source_path` is the subdirectory within the mounted
disk (the source) where the mount should point. For further information, please see the
[documentation on mounts](/create-apps/app-reference.md#mounts).

Since this project uses npm in addition to Python, we're going to want {{% vendor/name %}} to also run an `npm install`
when it builds the application image. In the `{{< vendor/configfile "app" >}}` find the line that starts with:

```yaml {configFile="app"}
# Hooks allow you to customize your code/environment
```

Beneath that line will be a section for `build:`. The
[build hook](/create-apps/hooks/hooks-comparison/_index.md#build-hook) allows us to make changes to
the application before it is finalized and deployed. You should notice that when the {{% vendor/name %}} CLI generated
the configuration file for us, it automatically added `pip install -r requirements.txt` for us! This same section is
where we'll also instruct {{% vendor/name %}} to install our npm packages. But before that, I usually like to upgrade
pip before I run `pip install` so I'm going to add a new line above that and add in `pip install --upgrade pip`. Then
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
[deploy hook](/create-apps/hooks/hooks-comparison/_index.md#deploy-hook) is
similar to the build hook but runs after the application image has been built. At this stage the
application image is read-only, <!-- might not be true -->but our writable disk space has been mounted and
is now accessible<!-- /end might not be true -->. Find the `deploy:` YAML key, add a new line after
`set -eux` and add `npm run build`:

```yaml {configFile="app"}
      deploy: |
        set -eux
        npm run build
```

Next we need to configure how {{% vendor/name %}} will handle requests to this application image. In the
`{{< vendor/configfile "app" >}}` file locate the line that starts with:

```yaml {configFile="app"}
# The web key configures the web server running in front of your app.
```

Beneath that line there should be a YAML property of `web`. A few lines beneath that line
will be a YAML property of `start:` Once again, the {{% vendor/name %}} CLI already added some information here, but
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
git add {{< vendor/configfile "app" >}}
```
```shell
git commit -m "adds FLASK_APP env var, adds mount for static builds, build commands, npm run build on deploy, web start command"
```

{{< note >}}
By default, the `{{% vendor/cli %}} project:init` command will set the language runtime to the latest possible version.
If your project requires an older version, you will need to change it before pushing your code to {{% vendor/name %}}.
To change the runtime version, locate the `type` key near the top of the `{{< vendor/configfile "app" >}}` file, and
change it the desired version. A
[complete list of supported versions of Python](/languages/python/_index.md#supported-versions) is available in the
documentation. Do not forget to add and commit your changes to git before pushing your code.
{{< /note >}}

{{< guide-buttons next="Environment variables" >}}
