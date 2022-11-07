---
title: "Authenticated Composer repositories"
sidebarTitle: "Authenticated Composer"
description: |
  Some PHP projects may need to use a private, third party Composer repository in addition to the public Packagist.org repository. Often, such third party repositories require authentication to download packages. These credentials shouldn't be located in the Git repository source code for security reasons.
aliases:
  - /guides/general/composer-auth.html
---

{{% description %}}

To handle that situation, you can define a `env:COMPOSER_AUTH` [project variable](../../development/variables/set-variables.md#create-project-variables) which allows you to set up authentication as an environment variable. The contents of the variable should be a JSON formatted object containing a `http-basic` object (see [composer-auth specifications](https://getcomposer.org/doc/03-cli.md#composer-auth)).

The advantage is that you can control who in your team has access to those variables.

## Specify a third party repository in `composer.json`

For this example, consider that there are several packages to install from a private repository.
List that repository in your `composer.json` file.

```json {location="composer.json"}
{
    "repositories": [
        {
            "type": "composer",
            "url": "https://{{<variable "PRIVATE_REPOSITORY_URL" >}}"
        }
    ]
}
```

## Set a project variable

Set the Composer authentication by adding a project level variable called `env:COMPOSER_AUTH` as JSON and available only during build time.

That can be done through the [Console](/administration/web/_index.md) or via the command line, like so:

```bash
platform variable:create --level project --name env:COMPOSER_AUTH \
  --json true --visible-runtime false --sensitive true --visible-build true \
  --value '{"http-basic": {"{{<variable "PRIVATE_REPOSITORY_URL" >}}": {"username": "{{<variable "USERNAME" >}}", "password": "{{<variable "PASSWORD" >}}"}}}'
```

The `env:` prefix will make that variable appear as its own Unix environment variable available by Composer during the build process. The optional `--no-visible-runtime` flag means the variable will only be defined during the build hook, which offers slightly better security.

Note: The authentication credentials may be cached in your project's build container, so please make sure you clear the Composer cache upon changing any authentication credentials by running this [CLI command](../../administration/cli/_index.md):

```bash
platform project:clear-build-cache
```

## Build your app with Composer

Enable the default Composer build mode:

```yaml {location=".platform.app.yaml"}
build:
    flavor: "composer"
```

In that case, Composer can authenticate and download dependencies from your authenticated repository.

## Private repository hosting

Typically, a private dependency is hosted in a private Git repository.
While Platform.sh supports [private repositories](/development/private-repository.md) for the site itself, that doesn't help for pulling in third party dependencies from private repositories unless they have the same SSH keys associated with them.

Fortunately, most private Composer tools (including Satis, Toran Proxy, and [Private Packagist](https://packagist.com/)) mirror tagged releases of dependencies and serve them directly rather than hitting the Git repository.
As long as your dependencies specify tagged releases, there should be no need to authenticate against a remote Git repository and there should be no authentication issue.
