---
title: Use variables
description: See how to use variables that have already been set so you can take control over your app's environment.
---

Get a list of all variables defined on a given environment in [the Console](../../administration/web/configure-environment.md#variables)
or use the CLI:

```bash
{{% vendor/cli %}} var
```

You get output similar to the following:

```bash
Variables on the project Example (abcdef123456), environment main:
+------+---------+-------+---------+
| Name | Level   | Value | Enabled |
+------+---------+-------+---------+
| foo  | project | bar   | true    |
+------+---------+-------+---------+
```

## Access variables in a shell

Project and environment variables with the [prefix](./_index.md#top-level-environment-variables) `env:`
are available as Unix environment variables in all caps.
Access these variables and {{% vendor/name %}}-provided variables directly like this:

```bash
echo $FOO
bar
echo $PLATFORM_APPLICATION_NAME
Sample Project
```

Other project and environment variables are listed together in the `PLATFORM_VARIABLES` variable as a base64-encoded JSON object.
Access them like this:

```bash
echo $PLATFORM_VARIABLES | base64 --decode
{"theanswer": "42"}
```

You can also get the value for a single variable within the array, such as with this command,
which uses the [`jq` processor](https://stedolan.github.io/jq/):

```bash
echo $PLATFORM_VARIABLES | base64 --decode | jq '.theanswer'
"42"
```

Variable availability depends on the type and configuration.
Variables available during builds can be accessed in `build` hooks and those available at runtime can be accessed in `deploy` hooks.

## Access variables in your app

To access environment variables in your app, use a built-in method for the given language.

* PHP: The [`getenv()` function](https://www.php.net/manual/en/function.getenv.php)
* Python: The [`os.environ` object](https://docs.python.org/3/library/os.html#os.environ)
* Node.js: The [`process.env` object](https://nodejs.org/api/process.html#process_process_env)
* Ruby: The [`ENV` accessor](https://ruby-doc.org/current/ENV.html)
* Java: The [`System.getenv()` method](https://docs.oracle.com/javase/8/docs/api/java/lang/System.html#getenv-java.lang.String-)

{{< codetabs >}}

+++
title=PHP
+++

```php
<?php

// A simple variable.
$projectId = getenv('PLATFORM_PROJECT');

// An encoded JSON object.
$variables = json_decode(base64_decode(getenv('PLATFORM_VARIABLES')), TRUE);
```

<--->
+++
title=Python
+++

```python
import os
import json
import base64

# A simple variable.
project_id = os.getenv('PLATFORM_PROJECT')

# An encoded JSON object.
variables = json.loads(base64.b64decode(os.getenv('PLATFORM_VARIABLES')).decode('utf-8'))
```

<--->
+++
title=Node.js
+++

```js
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

// An encoded JSON object.
const variables = read_base64_json('PLATFORM_VARIABLES');
```

<--->

+++
title=Ruby
+++

```ruby
# A simple variable.
project_id = ENV["PLATFORM_PROJECT"] || nil

# An encoded JSON object.
variables = JSON.parse(Base64.decode64(ENV["PLATFORM_VARIABLES"]))
```

<--->
+++
title=Java
+++

```java
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
        // An encoded JSON object.
        ObjectMapper mapper = new ObjectMapper();
        final Map<String, Object> variables = mapper.readValue(
                String.valueOf(getDecoder().decode(getenv("PLATFORM_VARIABLES"))), Map.class);
    }
}
```

{{< /codetabs >}}

### Access complex values

Variables can have nested structures.
The following example shows nested structures in an [app configuration](/create-apps/app-reference/single-runtime-image.md#variables):

```yaml {configFile="app"}
applications:
  {{< variable "APP_NAME" >}}:
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
        STEPS: ['one', 'two', 'three']
        COLORS:
          red: '#FF0000'
          green: '#00FF00'
          blue: '#0000FF'
```

You can access these nested variables as follows:

{{< codetabs >}}

+++
title=Shell
+++

```bash
echo $BASIC
a string
echo $INGREDIENTS
["peanut butter", "jelly"]
echo $QUANTITIES
{"cookies": "1 kg", "milk": "1 liter"}
echo "$PLATFORM_VARIABLES" | base64 --decode | jq '."stuff:STEPS"'
[
  "one",
  "two",
  "three"
]
echo "$PLATFORM_VARIABLES" | base64 --decode | jq '."stuff:COLORS"'
{
  "blue": "#0000FF",
  "green": "#00FF00",
  "red": "#FF0000"
}
```

<--->
+++
title=PHP
+++

```php
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
  string(2) "one"
  [1]=>
  string(4) "two"
  [2]=>
  string(5) "three"
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
```

<--->
+++
title=Python
+++

```python
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
# [u'one', u'two', u'three']
print variables['stuff:COLORS']
# {u'blue': u'#0000FF', u'green': u'#00FF00', u'red': u'#FF0000'}
```

<--->
+++
title=Node.js
+++

```java
scriptconst { BASIC, INGREDIENTS, QUANTITIES, PLATFORM_VARIABLES } = process.env;

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
// [ 'one', 'two', 'three' ]
console.log(stuffColors);
// { blue: '#0000FF', green: '#00FF00', red: '#FF0000' }
```

{{< /codetabs >}}

## Use provided variables

{{% vendor/name %}} also provides a series of variables to inform your app about its runtime configuration.
They're mostly prefixed with `PLATFORM_` to differentiate them from user-provided values.
You can't set or update them directly.

The following table presents all available variables
and whether they're available at build time (during [build hooks](../../administration/../create-apps/hooks/hooks-comparison.md#build-hook))
and at runtime.

| Variable name               | Build | Runtime | Description |
| --------------------------- | ----- | ------- | ----------- |
| `{{< vendor/prefix >}}_APP_DIR`          | Yes   | Yes     | The absolute path to the app directory. |
| `{{< vendor/prefix >}}_APPLICATION`      | Yes   | Yes     | A base64-encoded JSON object that describes the app. It maps certain attributes from your [app configuration](../../create-apps/_index.md), some with more structure. See [notes](#platform_application). |
| `{{< vendor/prefix >}}_APPLICATION_NAME` | Yes   | Yes     | The app name as set in your [app configuration](../../create-apps/_index.md). |
| `{{< vendor/prefix >}}_BRANCH`           | No    | Yes     | The name of the Git branch. |
| `{{< vendor/prefix >}}_CACHE_DIR`        | Yes   | No      | The directory where files are cached from one build to the next. The directory is shared among all branches, so the same cache is used for all environments. |
| `{{< vendor/prefix >}}_DOCUMENT_ROOT`    | No    | Yes     | The absolute path to the web document root, if applicable. |
| `{{< vendor/prefix >}}_ENVIRONMENT`      | No    | Yes     | The name of the {{% vendor/name %}} environment. |
| `{{< vendor/prefix >}}_ENVIRONMENT_TYPE` | No    | Yes     | The environment type of the {{% vendor/name %}} environment (`development`, `staging`, or `production`). |
| `{{< vendor/prefix >}}_OUTPUT_DIR`       | Yes   | No      | The output directory for compiled languages at build time. Equivalent to `PLATFORM_APP_DIR` in most cases. |
| `{{< vendor/prefix >}}_PROJECT`          | Yes   | Yes     | The project ID. |
| `{{< vendor/prefix >}}_PROJECT_ENTROPY`  | Yes   | Yes     | A random, 56-character value created at project creation and then stable throughout the project's life. Can be used for Drupal hash salts, Symfony secrets, and other similar values. |
| `{{< vendor/prefix >}}_RELATIONSHIPS`    | No    | Yes     | The `{{< vendor/prefix >}}_RELATIONSHIPS` variable is automatically broken down into [service environment variables](./_index.md#service-environment-variables), so your app can seamlessly connect to databases and other services defined in `{{< vendor/configfile "services" >}}`.</br></br>For some advanced use cases, you may need to use the `{{< vendor/prefix >}}_RELATIONSHIPS` variable itself. It is a base64-encoded JSON object of relationships, with keys that indicate the relationship names, and values that are arrays of relationship endpoint definitions. The exact format is defined differently for each [service](../../add-services/_index.md).</br>You may need to gather `{{< vendor/prefix >}}_RELATIONSHIPS` information in a ``.environment`` file. See how to [use ``.env`` files](./set-variables.md#use-env-files), and refer to [dedicated service pages](/add-services/_index.md) for examples. |
| `{{< vendor/prefix >}}_ROUTES`           | No    | Yes     | A base64-encoded JSON object that describes the routes for the environment. It maps the content of your [routes configuration](../../define-routes/_index.md). Note that this information is also available in your `/run/config.json` file. |
| `{{< vendor/prefix >}}_SMTP_HOST`        | No    | Yes     | The SMTP host to send email messages through. Is empty when mail is disabled for the current environment. |
| `{{< vendor/prefix >}}_SOURCE_DIR`       | Yes   | No      | The path to the root directory of your code repository in the context of a running [source operation](../../create-apps/source-operations.md). The directory contains a writable copy of your repository that you can commit to during the operation. |
| `{{< vendor/prefix >}}_TREE_ID`          | Yes   | Yes     | The ID of the tree the application was built from, essentially the SHA hash of the tree in Git. Use when you need a unique ID for each build. |
| `{{< vendor/prefix >}}_VARIABLES`        | Some  | Some    | A base64-encoded JSON object with all user-defined project and environment variables that don't use a [prefix](./_index.md#variable-prefixes). The keys are the variable names and the values are the variable values. Availability during builds and at runtime depends on the settings for each variable. See how to [access individual variables](#access-variables-in-a-shell). |
| `{{< vendor/prefix >}}_VENDOR`        | Yes  | No    |  Allows you to change the behavior of the build according to the vendor ({{< vendor/name >}} or {{< vendor/psh_ref >}}). |
| `PORT`                      | No    | Yes     | A `string` representing the port to which requests are sent if the [`web.upstream.socket_family` property](/create-apps/app-reference/single-runtime-image.md#upstream) is unset or set to `tcp`. |
| `SOCKET`                    | No    | Yes     | A `string` representing the path to the Unix socket file to use if the [`web.upstream.socket_family` property](/create-apps/app-reference/single-runtime-image.md#upstream) is set to `unix`. |

### `PLATFORM_APPLICATION`

The `PLATFORM_APPLICATION` variable is available both at build time and in the runtime environment.
But the specific attributes it contains differ in each case.

Each environment's build is associated with a configuration ID that identifies it uniquely so builds can be reused.
The ID is a product of your app code and some of its [configuration for {{% vendor/name %}}](../../create-apps/_index.md).
Not every attribute your app configuration is relevant to the build.
Only those attributes that are relevant to builds are accessible at build time from `PLATFORM_APPLICATION`.

Attributes that are **not** available in `PLATFORM_APPLICATION` during builds:

- Everything under `access`
- Everything under `relationship`
- Everything under `firewall`
- `hooks.deploy` and `hooks.post_deploy`
- Everything under `crons`
- Everything under  `web`, except `web.mounts`
- Everything under `workers`, except `workers.mounts`

These attributes aren't visible during build because they aren't included as a part of the configuration component of the build slug.
So modifying these values in your [app configuration](../../create-apps/_index.md) doesn't trigger an app rebuild, only a redeploy.
For more information, read about [how builds work](/learn/overview/build-deploy.md#the-build).

## Use variables in static files

Some apps require configuration values to be specified in a static, non-executable file (such as a `.ini`, `.xml`, or `.yaml` file)
and don't support reading from environment variables.

To populate these files with variables you set yourself,
make sure the variables are set to be [visible at build time](./set-variables.md#variable-options).

The files can't be populated with {{% vendor/name %}}-provided variables not available at build time (such as `PLATFORM_RELATIONSHIPS` or [service environment variables](/development/variables/_index.md#service-environment-variables)).
You also can't write to them in a `deploy` hook as the file system is read only.

One workaround is to create a symbolic link to a writable location and then write to it in a [`deploy` hook](../../create-apps/hooks/hooks-comparison.md#deploy-hook).
The following example shows the process, though you have to modify it to fit your needs.

1. Create a mount that isn't accessible to the web in your [app configuration](../../create-apps/_index.md):

   ```yaml {configFile="app"}
   applications:
    {{< variable "APP_NAME" >}}
       mounts:
           /config:
               source: storage
               source_path: config
   ```

2. Create a symbolic link from the config file the application wants to a location in that mount:

   ```bash
   # From the application root...

   ln -s config/db.yaml db.yaml
   ```

   This example assumes the app wants a `db.yaml` file in its root for configuration.
3. Commit the symbolic link and an empty `config` directory to Git.
4. Configure a script to read from environment variables and write to `config/db.yaml` through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves, or through the [`{{% vendor/prefix %}}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
   <BR>Create a file with a shell script similar to this:

{{< codetabs >}}
+++
title= Service environment variables
+++
   ```bash {location="export-config.sh"}
   #!/bin/bash

   # Ensure the file is empty.
   cat '' > config/db.yaml

   # Map the database information from the service environment variable into the YAML file.
   # Use this process to use whatever variable names your app needs.
   # For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables.html#service-environment-variables.

   printf "host: %s\n" $(echo $DATABASE_HOST) >> config/db.yaml
   printf "user: %s\n" $(echo $DATABASE_USERNAME) >> config/db.yaml
   ```

<--->

+++
title= `PLATFORM_RELATIONSHIPS` environment variable
+++

   ```bash {location="export-config.sh"}
   #!/bin/bash

   # Ensure the file is empty.
   cat '' > config/db.yaml

   # Map the database information from the PLATFORM_RELATIONSHIPS variable into the YAML file.
   # Use this process to use whatever variable names your app needs.
   # For more information, please visit {{< vendor/urlraw "docs" >}}/development/variables/use-variables.md#use-provided-variables.

   printf "host: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].host") >> config/db.yaml
   printf "user: %s\n" $(echo $PLATFORM_RELATIONSHIPS | base64 --decode | jq -r ".database[0].username") >> config/db.yaml
   ```
{{< /codetabs >}}

5. Call the script from the `deploy` hook your [app configuration](../../create-apps/_index.md):

    ```yaml {configFile="app"}
    applications:
      {{< variable "APP_NAME" >}}
        hooks:
          deploy: |
            bash export-config.sh
    ```

Now, when your app starts and attempts to parse `db.yaml`, the symbolic link redirects it to `config/db.yaml`.
Your script writes to that file on each deploy with updated information.
Your app reads the exported values and proceeds as expected.
