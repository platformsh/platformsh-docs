---
title: Use variables
description: See how to use variables that have already been set so you can take control over your app's environment.
---

Get a list of all variables defined on a given environment in [the management console](/administration/web/configure-environment.md#variables)
or use the CLI:

```bash
$ platform var
Variables on the project Example (abcdef123456), environment main:
+------+---------+-------+---------+
| Name | Level   | Value | Enabled |
+------+---------+-------+---------+
| foo  | project | bar   | true    |
+------+---------+-------+---------+
```

## Access variables in a shell

Project and environment variables with the [prefix](./_index.md#top-level-environment-variables) `env:` are available as Unix environment variables in all caps. Access these variables and Platform.sh-provided variables directly like this:

```bash
$ echo $FOO
bar
$ echo $PLATFORM_APPLICATION_NAME
Sample Project
```

Other project and environment variables are listed together in the `$PLATFORM_VARIABLES` variable as a JSON array. Access them like this:

```bash
$ echo $PLATFORM_VARIABLES | base64 --decode
{"theanswer": "42"}
```

You can also get the value for a single variable within the array, such as with this command:

```bash
$ echo $PLATFORM_VARIABLES | base64 --decode | jq '.theanswer'
"42"
```

Variable availability depends on the type and configuration. Variables available during builds can be accessed in `build` hooks and those available at runtime can be accessed in `deploy` hooks.

## Access variables in your app

To access environment variables in your app, check the documentation page for your given language.

* [Shell: The `jq` utility](https://stedolan.github.io/jq/)
* [PHP: The `getenv()` function](http://php.net/manual/en/function.getenv.php)
* [Node.js: The `process.env` object](https://nodejs.org/api/process.html#process_process_env)
* [Python: The `os.environ` object](https://docs.python.org/3/library/os.html#os.environ)
* [Ruby: The `ENV` accessor](https://ruby-doc.org/core/ENV.html)
* [Java: The `System.getenv()` method](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#getenv-java.lang.String-)

{{< codetabs >}}

---
title=Shell
file=none
highlight=bash
markdownify=false
---

export PROJECT_ID = "$PLATFORM_PROJECT"
export VARIABLES = "$(echo "$PLATFORM_VARIABLES" | base64 --decode)"

<--->

---
title=PHP
file=none
highlight=php
markdownify=false
---

<?php

// A simple variable.
$projectId = getenv('PLATFORM_PROJECT');

// A JSON-encoded value.
$variables = json_decode(base64_decode(getenv('PLATFORM_VARIABLES')), TRUE);

<--->

---
title=Python
file=none
highlight=python
markdownify=false
---

import os
import json
import base64

# A simple variable.
project_id = os.getenv('PLATFORM_PROJECT')

# A JSON-encoded value.
variables = json.loads(base64.b64decode(os.getenv('PLATFORM_VARIABLES')).decode('utf-8'))

<--->

---
title=Node.js
file=none
highlight=js
markdownify=false
---

const { env } = process;

// Utility to assist in decoding a packed JSON variable.
function read_base64_json(varName) {
  try {
    return JSON.parse(Buffer.from(env[varName], "base64").toString());
  } catch (err) {
    throw new Error(`no ${varName} environment variable`);
  }
};

// A simple variable.
const projectId = env.PLATFORM_PROJECT;

// A JSON-encoded value.
const variables = read_base64_json('PLATFORM_VARIABLES');

<--->

---
title=Ruby
file=none
highlight=ruby
markdownify=false
---

# A simple variable.
project_id = ENV["PLATFORM_PROJECT"] || nil

# A JSON-encoded value.
variables = JSON.parse(Base64.decode64(ENV["PLATFORM_VARIABLES"]))

<--->

---
title=Java
file=none
highlight=java
markdownify=false
---

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

import static java.lang.System.getenv;
import static java.util.Base64.getDecoder;

public class App {

    public static void main(String[] args) throws IOException {
        // A simple variable.
        final String project = getenv("PLATFORM_PROJECT");
        // A JSON-encoded value.
        ObjectMapper mapper = new ObjectMapper();
        final Map<String, Object> variables = mapper.readValue(
                String.valueOf(getDecoder().decode(getenv("PLATFORM_VARIABLES"))), Map.class);
    }
}

{{< /codetabs >}}

## Access complex values

Variable values can have nested structures. 
The following example shows nested structures introduced in an [app configuration](../../configuration/app/app-reference.md#variables):

```yaml
variables:
    env:
        BASIC: "a string"
        INGREDIENTS:
            - 'peanut butter'
            - 'jelly'
        QUANTITIES:
            "milk": "1 liter"
            "cookies": "1 kg"
    stuff:
        STEPS: ['un', 'deux', 'trois']
        COLORS:
            red: '#FF0000'
            green: '#00FF00'
            blue: '#0000FF'
```

You could access these nested variables as follows:

{{< codetabs >}}

---
title=Shell
file=none
highlight=bash
markdownify=false
---

$ echo $BASIC
a string
$ echo $INGREDIENTS
["peanut butter", "jelly"]
$ echo $QUANTITIES
{"cookies": "1 kg", "milk": "1 liter"}
$ echo "$PLATFORM_VARIABLES" | base64 --decode | jq '."stuff:STEPS"'
[
  "un",
  "deux",
  "trois"
]
$ echo "$PLATFORM_VARIABLES" | base64 --decode | jq '."stuff:COLORS"'
{
  "blue": "#0000FF",
  "green": "#00FF00",
  "red": "#FF0000"
}

<--->

---
title=PHP
file=none
highlight=php
markdownify=false
---
<?php
var_dump($_ENV['BASIC']);
// string(8) "a string"

var_dump($_ENV['INGREDIENTS']);
// string(26) "["peanut butter", "jelly"]"

var_dump($_ENV['QUANTITIES']);
// string(38) "{"milk": "1 liter", "cookies": "1 kg"}"

$variables = json_decode(base64_decode($_ENV['PLATFORM_VARIABLES']), TRUE);

print_r($variables['stuff:STEPS']);
/*
array(3) {
  [0]=>
  string(2) "un"
  [1]=>
  string(4) "deux"
  [2]=>
  string(5) "trois"
}
*/

print_r($variables['stuff:COLORS']);
/*
array(3) {
  ["red"]=>
  string(7) "#FF0000"
  ["green"]=>
  string(7) "#00FF00"
  ["blue"]=>
  string(7) "#0000FF"
}
*/

<--->

---
title=Python
file=none
highlight=python
markdownify=false
---
import os
import json
import base64

print os.getenv('BASIC')
# a string

print os.getenv('INGREDIENTS')
# ["peanut butter", "jelly"]

print os.getenv('QUANTITIES')
# {"milk": "1 liter", "cookies": "1 kg"}

variables = json.loads(base64.b64decode(os.getenv('PLATFORM_VARIABLES')).decode('utf-8'))

print variables['stuff:STEPS']
# [u'un', u'deux', u'trois']
print variables['stuff:COLORS']
# {u'blue': u'#0000FF', u'green': u'#00FF00', u'red': u'#FF0000'}

<--->

---
title=Node.js
file=none
highlight=javascript
markdownify=false
---
const { BASIC, INGREDIENTS, QUANTITIES, PLATFORM_VARIABLES } = process.env;

const { "stuff:STEPS": stuffSteps, "stuff:COLORS": stuffColors } = JSON.parse(
  Buffer.from(PLATFORM_VARIABLES, "base64").toString()
);

console.log(BASIC);
// "a string"
console.log(INGREDIENTS);
// ["peanut butter", "jelly"]
console.log(QUANTITIES);
// {"cookies": "1 kg", "milk": "1 liter"}
console.log(stuffSteps);
// [ 'un', 'deux', 'trois' ]
console.log(stuffColors);
// { blue: '#0000FF', green: '#00FF00', red: '#FF0000' }

{{< /codetabs >}}

## Use Platform.sh-provided variables

Platform.sh also provides a series of variables by default that inform an application about its runtime configuration.
They're always prefixed with `PLATFORM_*` to differentiate them from user-provided values
and you can't set or update them directly.

The most important of these variables is relationship information,
which tells the application how to connect to databases and other services defined in `services.yaml`.

The following table presents the available variables
and whether they're available during builds and at runtime.

| Variable name             | Build | Runtime | Description |
| ------------------------- | ----- | ------- | ----------- |
| PLATFORM_OUTPUT_DIR       | Yes   | No      | The output directory for compiled languages at build time. Equivalent to `PLATFORM_APP_DIR` in most cases. |
| PLATFORM_VARIABLES        | Some  | Some    | A base64-encoded JSON object with all project and environment variables that don't use a [prefix](./_index.md#variable-prefixes). The keys are the variable names and the values the values. Availability during builds and at runtime depends on the specific variable settings. |
| PLATFORM_PROJECT          | Yes   | Yes     | The project ID |
| PLATFORM_TREE_ID          | Yes   | Yes     | The ID of the tree the application was built from, essentially the SHA hash of the tree in Git. Use when you need a unique ID for each build |
| PLATFORM_PROJECT_ENTROPY  | Yes   | Yes     | A random, 56-character value created when the project is created and then stable throughout the project's life. Can be used for Drupal hash salts, Symfony secrets, and other similar values. |
| PLATFORM_APP_DIR          | Yes   | Yes     | The absolute path to the application directory. |
| PLATFORM_APPLICATION_NAME | Yes   | Yes     | The application name as set in the `.platform.app.yaml` file. |
| PLATFORM_APPLICATION      | Yes   | Yes     | A base64-encoded JSON object that describes the application. It maps certain attributes from your `.platform.app.yaml` file, some with more structure. See [notes](#platform_application). |
| PLATFORM_BRANCH           | No    | Yes     | The name of the Git branch. |
| PLATFORM_DOCUMENT_ROOT    | No    | Yes     | The absolute path to the web document root, if applicable. |
| PLATFORM_ENVIRONMENT      | No    | Yes     | The name of the Platform.sh environment. |
| PLATFORM_ENVIRONMENT_TYPE | No    | Yes     | The type of the Platform.sh environment (development, staging or production). |
| PLATFORM_SMTP_HOST        | No    | Yes     | The SMTP host to send email messages through. Is empty when mail is disabled for the current environment. |
| PLATFORM_RELATIONSHIPS    | No    | Yes     | A base64-encoded JSON object of relationships. The keys are the relationship name and the values are arrays of relationship endpoint definitions. The exact format is defined for each [service](/configuration/services/_index.md). |
| PLATFORM_ROUTES           | No    | Yes     | A base64-encoded JSON object that describes the routes for the environment. It maps the content of the `.platform/routes.yaml` file. |

Dedicated instances also have the following variables available:

| Variable name    | Build | Runtime | Description |
| ---------------- | ----- | ------- | ----------- |
| PLATFORM_MODE    | No    | Yes     | `enterprise` in all production and staging Dedicated environments. Note that an Enterprise support plan doesn't always imply a Dedicated environment, but a Dedicated environment always implies an Enterprise support plan. |
| PLATFORM_CLUSTER | No    | Yes     | The cluster ID. |
| PLATFORM_PROJECT | No    | Yes     | The document root. Typically the same as your cluster name for the production environment, while staging environments have `_stg` or similar appended. |

{{< note >}}

The `PLATFORM_CLUSTER`, and `PLATFORM_PROJECT` environment variables aren't yet available on [Dedicated Generation 3](/dedicated-gen-3/overview.md).
If your application contains logic that depends on whether it's running on a Dedicated Generation 3 host, use `PLATFORM_MODE`.

{{< /note >}}

### `PLATFORM_APPLICATION`

`PLATFORM_APPLICATION` is a special case to keep in mind in how it differs between the build and runtime. Each environment's build is associated with a configuration ID that uniquely identifies it. This ID enables reusing builds on merges. The ID itself is a product of your application code and some of its configuration for Platform.sh in `.platform.app.yaml`.

Not every attribute in `.platform.app.yaml` is relevant to builds --
only some of these attributes result in a full app rebuild when they're updated.
So not all of the attributes defined in your `.platform.app.yaml` file are accessible at build time from `PLATFORM_APPLICATION`,
only those actually relevant to builds.

Some attributes that are **not** available in `PLATFORM_APPLICATION` during builds:

* everything under `resources`
* `size`
* `disk`
* everything under `access`
* everything under `relationship`
* everything under `firewall`
* `hooks.deploy` and `hooks.post_deploy`
* everything under `crons`
* everything under  `web`, except `web.mounts`
* everything under `workers`, except `workers.mounts`

The above attributes aren't visible during build
because they aren't included as a part of the configuration component of the build slug.
So modifying any of these values in your [app configuration](../../configuration/app/_index.md) doesn't trigger an app rebuild, only a redeploy.
For more information, read more about [how builds work](../../overview/build-deploy.md#the-build).

### Make scripts behave differently on production, staging and development

While both production and staging Dedicated environments have `enterprise` for the `PLATFORM_MODE` variable, you can distinguish them by environment type. Make sure that the environment types are set correctly via the CLI or the Management Console.

```bash
if [ "$PLATFORM_ENVIRONMENT_TYPE" = production ] ; then
    echo "This is live on production"
else if [ "$PLATFORM_ENVIRONMENT_TYPE" = staging ] ; then
    echo "This is on staging"
else
    echo "We're on development"
fi
```

## Use variables in static files

A few applications require configuration values to be specified in a static, non-executable file (such as a `.ini`, `.xml`, or `.yaml` file)
and do not support reading from environment variables.
These files cannot be populated at build time as environment-specific values are not available,
but cannot be written to in deploy as the file system is read only.

This restriction is not the case for environment variables
that have been explicitly set to be [visible at build time](/development/variables/_index.md#environment-variables) (`--visible-build`),
so it doesn't apply to variables you can set yourself.
For other Platform.sh-provided variables (such as `PLATFORM_RELATIONSHIPS`),
a possible workaround is to symlink the file to a writeable location,
then use a deploy hook script to write files out to that file.
The details of this process will vary by the application, but an outline of this process is shown below.

First, create a non-web-accessible mount point in your `.platform.app.yaml` file:

```yaml
# .platform.app.yaml

mounts:
    /config:
        source: local
        source_path: config
```

Second, create a symbolic link from the config file the application wants to a location in that mount.
For example:

```bash
# From the application root...

ln -s config/db.yaml db.yaml
```

The above assumes that `db.yaml` in the root of the application
is where the application expects to find its configuration file containing database credentials.
That will almost certainly be different for your application so modify it as appropriate.
Ensure that the `db.yaml` symbolic link is committed to Git.

The file `config/db.yaml` does not need to exist.
In fact, that directory should be empty in Git, as it will be created by the file mount.

Third, configure a script that will read from the environment configuration and write out `config/db.yaml`.
That script will run from the `deploy` hook, and can be written in whatever language you prefer.
A basic shell script version could look like this:

```bash
#!/bin/bash

# Empty out the file.
cat '' > config/db.yaml

# Use the jq library to extract database information from the
# PLATFORM_RELATIONSHIPS structure and write out each property
# as one line in the YAML file.  Your application almost certainly
# will need an alternate structure; this is only an example.

printf "host: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].host") >> config/db.yaml
printf "port: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].port") >> config/db.yaml
printf "name: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].path") >> config/db.yaml
printf "user: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].username") >> config/db.yaml
printf "pass: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].password") >> config/db.yaml
```

Save the above script in a file named `export-config.sh`.  Then call it from the `deploy` hook in `.platform.app.yaml`:

```yaml
hooks:
    deploy: |
        bash export-config.sh
```

Now, when the application starts and attempts to parse `db.yaml`,
the symbolic link will redirect it to the writeable `config/db.yaml` instead.
That file is written to on each deploy with updated information by your script.
The application will read the exported values and proceed as expected.

Again, this approach should be viewed as a workaround to the bug in the application
that provides no better alternative for enviroment-sensitive configuration.
