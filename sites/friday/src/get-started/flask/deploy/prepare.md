---
title: Prepare the Flask application for {{% vendor/name %}}
sidebarTitle: "Environment variables"
description: Steps required for setting up a Flask app and repository to deploy on {{% vendor/name %}} infrastructure.
weight: -150
---

While we've finished telling {{% vendor/name %}} what it needs to do in order to build and deploy our application,
our application still needs to know some things about {{% vendor/name %}}. This type of information typically goes
into your `.env` file. {{% vendor/name %}} generates all of this type of data and exposes it to the application as
environmental variables in the deployed image. Since the information is dynamic, and changes from
environment to environment, we don't want to commit those static values in a `.env` file. Instead, {{% vendor/name %}}
supports a `.environment` file that is sourced in the application image, as well as your shell when you
ssh into the application. For a list of all the variables that {{% vendor/name %}} generates, please refer to the
[documentation on provided environmental variables](/development/variables/use-variables/_index.md#use-provided-variables).

Open the `.environment` file that the {{% vendor/name %}} CLI generated earlier. Notice it has already created some
environmental variables for you that point back to those variables that {{% vendor/name %}} will generate. We'll
need to add a few more for our Flask application so Flask has what it needs to be able to function properly.
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
be a long random string. Again, {{% vendor/name %}} provides us with something for exactly this purpose as an
environmental variable: `PLATFORM_PROJECT_ENTROPY`.  Inside the `.environment` file, add the following line:

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
git add .environment && git commit -m "adds needed flask environmental variables"
```

Now we're prepared to push our application to {{% vendor/name %}}.

{{< guide-buttons next="Deploy resources" >}}
