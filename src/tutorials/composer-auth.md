# Authenticated Composer repositories

Some PHP projects may need to leverage a private, third party Composer repository in addition to the public Packagist.org repository. Often, such third party repositories require authentication in order to download packages, and not everyone is comfortable putting those credentials into their Git repository source code (for obvious reasons).

To handle that situation, you can define a `env:COMPOSER_AUTH` [project variable](/development/variables.md#project-variables) which allows you to set up authentication as an environment variable. The contents of the variable should be a JSON formatted object containing an `http-basic` object (see [composer-auth specifications](https://getcomposer.org/doc/03-cli.md#composer-auth)).

The advantage is that you can control who in your team has access to those variables.

## Specify a third party repository in `composer.json`

For this example, consider that there are several packages we want to install from a private repository hosted at `my-private-repos.example.com`. List that repository in your `composer.json` file.

```json
{
  "repositories": [
    {
      "type": "composer",
      "url": "https://my-private-repos.example.com"
    }
  ]
}
```

## Set the env:COMPOSER_AUTH project variable

Set the Composer authentication by adding a project level variable called `env:COMPOSER_AUTH` as JSON and available only during build time.

That can be done through the [web UI](/administration/web.md) or via the command line, like so:

```bash
platform variable:create --level project --name env:COMPOSER_AUTH \
  --json true --visible-runtime false \
  --value '{"http-basic": {"my-private-repos.example.com": {"username": "your-username", "password": "your-password"}}}'
```

The `env:` prefix will make that variable appear as its own Unix environment variable available by Composer during the build process. The optional `--no-visible-runtime` flag means the variable will only be defined during the build hook, which offers slightly better security.

_Note:_ The authentication credentials may be cached in your project's build container, so please make sure you clear the Composer cache upon changing any authentication credentials. You can use the `platform project:clear-build-cache` command.

## Build your application with Composer

You simply need to enable the default Composer build mode in your `.platform.app.yaml`:

```yaml
build:
  flavor: "composer"
```

In that case, Composer will be able to authenticate and download dependencies from your authenticated repository.

## Private repository hosting

Typically, a private dependency will be hosted in a private Git repository. While Platform.sh supports [private repositories](/development/private-repository.md) for the site itself, that doesn't help for pulling in third party dependencies from private repositories unless they have the same ssh keys associated with them.

Fortunately, most private Composer tools (including Satis, Toran Proxy, and [Private Packagist](https://packagist.com/)) mirror tagged releases of dependencies and serve them directly rather than hitting the Git repository. Therefore as long as your dependencies specify tagged releases there should be no need to authenticate against a remote Git repository and there should be no authentication issue.
