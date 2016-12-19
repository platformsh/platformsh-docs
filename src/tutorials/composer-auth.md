# Authenticated Composer repositories

Some PHP projects may need to leverage a private, third party Composer repository in addition to the public Packagist.org repository.  Often, such third party repositories require authentication in order to download packages, and not everyone is comfortable putting those credentials into their Git repository source code (for obvious reasons).  To handle that situation, you can use [project variables](/development/variables.md#project-variables).

## Specify a third party repository in `composer.json`

For this example, consider that there are several packages we want to install from a private repository hosted at `my-private-repos.example.com`.  List that repository in `composer.json`. 

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

## Set project variable credentials

Now set the composer authentication key and password as project variables. That can be done through the UI or via the command line, like so:

```bash
platform project:variable:set env:composer_key abc123 --no-visible-runtime
platform project:variable:set env:composer_password abc123 --no-visible-runtime
```

The `env:` prefix will make those variables appear as their own Unix environment variables, which makes the next step easier.  The optional `--no-visible-runtime` flag means the variable will only be defined during the build hook, which offers slightly better security.

The variable names used here are arbitrary, as long as they match what's in the build hook below.

## Use a custom Composer command

You'll need to run your own custom Composer command, so first disable the default composer build mode.  Add or modify the following in `.platform.app.yaml`:

```yaml
build:
    flavor: "none"
```

Then in your build hook set the authentication information for the remote server, using the environment variables defined above.  Then run `composer install` as normal.


```yaml
hooks:
    build: |
        set -e
        composer config my-private-repos.example.com $COMPOSER_KEY $COMPOSER_PASSWORD
        composer install --no-dev --prefer-dist --no-progress --no-interaction --optimize-autoloader
  ```

The specific switches in the `composer install` line are what Platform.sh would run by default, but you can customize that as needed.  They important part is the `composer config` line, which tells composer to use the key and password from the environment when connecting to `my-private-repos.example.com`.

From here on, everything should proceed as normal.  Composer will download all listed packages from whatever repositories are appropriate, authenticating against them as needed, build the application, and then it will deploy as normal.  Because the variables are defined above to not be visible at runtime they will not appear at all in the running application.
