# Environment variables

Platform.sh exposes environment variables which you can interact with. There are
two sources for these. There are the ones that are set by Platform.sh itself
and that give you all the context you need about the environment (how to 
connect to your database for example). And there are the ones you can set
yourself through the web interface or the CLI.

When you're logged in via SSH to an environment (with the cli: `platform ssh`), 
you can list the environment variables by running:

```bash
web@myp3bmdujgzqe-master--php:~$ export
```
Since they are **base64-encoded JSON object** that maps variable names
to variable values, you can decode the value of a specific variable by
running:

```bash
echo $PLATFORM_VARIABLES | base64 --decode
{"myvar": "this is a value"}
```

In this example we defined for one of our environments a variable we called 
"myvar".

> **note**
> Variables are **hierarchical**, so if a variable is not overriden in an environment, it will take the value it has in the parent environment and use it as `inherited`.
> This allows you to define your development variables only once, and use them on all the child environments.

> **note**
> If a variable is added in the parent environment after the child environments are created, the child environments have to be re-deployed in order to load the inherited variables.

## Platform.sh variables

Environment variables that are specific to Platform.sh are exposed in
the runtime (*ie. PHP*) and prefixed with `PLATFORM_*`.

* **PLATFORM_APP_DIR**: The absolute path to the application directory.
* **PLATFORM_APPLICATION**: A base64-encoded JSON object that describes the application. It maps the content of the `.platform.app.yaml` that you have in Git and it has a few subkeys.
* **PLATFORM_APPLICATION_NAME**: The name of the application, as configured in the `.platform.app.yaml` file.
* **PLATFORM_DOCUMENT_ROOT**: The absolute path to the web document root, if applicable.
* **PLATFORM_ENVIRONMENT**: The name of the environment (*ie. the name of the branch in Git*).
* **PLATFORM_PROJECT**: The ID of the project.
* **PLATFORM_RELATIONSHIPS**: A base64-encoded JSON object whose keys are the relationship name and the values are arrays of relationship endpoint definitions. Each relationship endpoint definition is a decomposed form of a URL. It has a `scheme`, a `host`, a `port`, and optionally a `username`, `password`, `path` and some additional information in `query`.
* **PLATFORM_ROUTES**: Describe the routes that you defined in the environment. It maps the content of the `.platform/routes.yaml`
    file.
* **PLATFORM_TREE_ID**: The ID of the tree the application was built from. It's essentially the SHA of the tree in Git.
* **PLATFORM_VARIABLES**: A base64-encoded JSON object which keys are variables names and values are variable values (*a string*).
* **PLATFORM_PROJECT_ENTROPY**: A random value created when the project is first created, which is then stable throughout the project’s life. This can be used for Drupal hash salt, Symfony secret, or other similar values in other frameworks.

Since values can change over time, the best thing is to just introspect the variable at runtime and use it to configure your application.

For example with Drupal, we use the **PLATFORM_RELATIONSHIPS** variable
to configure your `settings.local.php`.

For example:

```bash
echo $PLATFORM_RELATIONSHIPS | base64 --decode | json_pp
{
    "database": [
        {
            "host": "database.internal",
            "ip": "246.0.97.91",
            "password": "",
            "path": "main",
            "port": 3306,
            "query": {
                "is_master": true
            },
            "scheme": "mysql",
            "username": "user"
        }
    ],
    "redis": [
        {
            "host": "redis.internal",
            "ip": "246.0.97.88",
            "port": 6379,
            "scheme": "redis"
        }
    ],
    "solr": [
        {
            "host": "solr.internal",
            "ip": "246.0.97.90",
            "path": "solr",
            "port": 8080,
            "scheme": "solr"
        }
    ]
}
```

## Custom Environment Variables

You can create simple environment variables outside of the
**PLATFORM_VARIABLES** value by prefixing the variable name with `env:`.

For example, the variable `env:foo` will create an environment variable called
`FOO`.

## Drupal specific variables

You can define variables based on the toolstack you're working with.

For example with Drupal, you would prefix your Environment variables
with `drupal:`. Those variables will then be special-cased by our
`settings.local.php` and directly added to `$conf[]`.

An example variable:

-   `drupal:site_name` which will directly set the site name of your
    Drupal site on an environment.

