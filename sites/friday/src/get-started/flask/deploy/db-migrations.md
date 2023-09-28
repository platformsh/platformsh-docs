---
title: Setting up the Database
sidebarTitle: "Handle migrations"
description: Steps required for preparing Database migrations.
weight: -50
---

You may have noticed that we haven't done anything with regard to a database. This application uses
[Flask-migrate](https://flask-migrate.readthedocs.io/en/latest/) and since this is a brand-new application, we'll
need to set up the initial migrations, and commit them so we can then have them applied to our {{% vendor/name %}}
database. However, because the migrate command needs access to the database, we'll need to set up a temporary local
environment and give it a way to access the database service.

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
When we did the push to {{% vendor/name %}} previously, it created and deployed our database service. The
{{% vendor/name %}} CLI tool gives us a method to communicate to our application's services:
[{{% vendor/cli %}} tunnel](/development/ssh/_index.md#use-a-direct-tunnel)

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
migration changes are automatically applied. Re-open the `{{< vendor/configfile "app" >}}` and find the `deploy` hook
where we added `npm run build`. On the next line, add `flask db upgrade`.

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

Congrats! You've now successfully deployed your Flask application to {{% vendor/name %}}! Take a moment to visit your
site and test it out!
