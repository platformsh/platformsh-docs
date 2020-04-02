---
title: "Connect to services"
weight: 9
---

# Import your own code

## Connect to Services

> **note:**
>
> If your application does not require access to services and you left `.platform/services.yaml` blank, feel free to proceed to the next step.

At this point you have configured your application's services as well as its build and deploy process in your `.platform/services.yaml` and `.platform.app.yaml` files. As an example, in your `.platform.app.yaml` file you may have defined a relationship called `database`:

```yaml
relationships:
    database: "mysqldb:mysql"
```

which was configured in `.platform/services.yaml` with

```yaml
mysqldb:
    type: mysql:10.2
    disk: 1024
```

In order to connect to this service and use it in your application, Platform.sh exposes its credentials in the application container within a base64-encoded JSON `PLATFORM_RELATIONSHIPS` environment variable.

To access this variable you can install a Platform.sh configuration reader library

{{< tabs "Go" "Nodejs" "JavaGradle" "JavaMaven" "PHP" "Python" >}}

{{< tab id="Go" active="true">}}
{{< highlight bash >}}
go mod edit -require=github.com/platformsh/config-reader-go/v2
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Nodejs">}}
{{< highlight bash >}}
npm install platformsh-config --save
{{< /highlight >}}
{{< /tab >}}

{{< tab id="JavaGradle">}}
{{< highlight bash >}}
compile group: 'sh.platform', name: 'config', version: 2.2.0'
{{< /highlight >}}
{{< /tab >}}

{{< tab id="JavaMaven">}}
{{< highlight xml >}}
<dependency>
    <groupId>sh.platform</groupId>
    <artifactId>config</artifactId>
    <version>2.2.0</version>
</dependency>
{{< /highlight >}}
{{< /tab >}}

{{< tab id="PHP">}}
{{< highlight bash >}}
composer install platformsh/config-reader
{{< /highlight >}}
{{< /tab >}}

{{< tab id="Python" >}}
{{< highlight bash >}}
pip install platformshconfig
{{< /highlight >}}
{{< /tab >}}

{{< /tabs >}}


and access the credentials of `database`

{% codetabs name="PHP", type="php" -%}
use Platformsh\ConfigReader\Config;

$config = new Config();
$credentials = $config->credentials('database');
{%- language name="Python", type="py" -%}
from platformshconfig import Config

config = Config()
credentials = config.credentials('database')
{%- language name="Node.js", type="js" -%}
const config = require("platformsh-config").config();
const credentials = config.credentials('database');
{%- language name="Java", type="java" -%}
import Config;

Config config = new Config();
Credential cred = config.getCredential('database')
{%- language name="Go", type="go" -%}
import psh "github.com/platformsh/config-reader-go/v2"

config, err := psh.NewRuntimeConfig()
// Handle err

credentials, err := config.Credentials("database")
// Handle err
{%- endcodetabs %}

or read and decode the environment variable directly.

{% codetabs name="PHP", type="php" -%}
$relationships = json_decode(base64_decode(getenv('PLATFORM_RELATIONSHIPS')), TRUE);
$credentials = $relationships['database'];
{%- language name="Python", type="py" -%}
import os, json, base64

relationships = json.loads(base64.b64decode(os.environ["PLATFORM_RELATIONSHIPS"]))
credentials = relationships['database']
{%- language name="Node.js", type="js" -%}
relationships = JSON.parse(new Buffer(process.env['PLATFORM_RELATIONSHIPS'], 'base64').toString());
credentials = relationships['database'];
{%- endcodetabs %}



{{< tabs "Nodejs" "PHP" "Python" >}}

{{< tab2 id="Nodejs" active="true">}}
```js
relationships = JSON.parse(new Buffer(process.env['PLATFORM_RELATIONSHIPS'], 'base64').toString());
credentials = relationships['database'];
```
{{< /tab2 >}}

{{< tab2 id="PHP">}}
```php
$relationships = json_decode(base64_decode(getenv('PLATFORM_RELATIONSHIPS')), TRUE);
$credentials = $relationships['database'];
```
{{< /tab2 >}}

{{< tab2 id="Python" >}}
```python
import os, json, base64

relationships = json.loads(base64.b64decode(os.environ["PLATFORM_RELATIONSHIPS"]))
credentials = relationships['database']
```
{{< /tab2 >}}

{{< /tabs >}}

In either case, `credentials` can now be used to connect to `database`:

```json
{
  "username": "user",
  "scheme": "mysql",
  "service": "mysql",
  "fragment": null,
  "ip": "169.254.197.253",
  "hostname": "czwb2d7zzunu67lh77infwkm6i.mysql.service._.eu-3.platformsh.site",
  "public": false,
  "cluster": "rjify4yjcwxaa-master-7rqtwti",
  "host": "mysql.internal",
  "rel": "mysql",
  "query": {
    "is_master": true
  },
  "path": "main",
  "password": "",
  "type": "mysql:10.2",
  "port": 3306
}
```

You can find out more information about Platform.sh Config Reader libraries on GitHub:

* [PHP Config Reader](https://github.com/platformsh/config-reader-php)
* [Python Config Reader](https://github.com/platformsh/config-reader-python)
* [Node.js Config Reader](https://github.com/platformsh/config-reader-nodejs)
* [Java Config Reader](https://github.com/platformsh/config-reader-java)
* [Go Config Reader](https://github.com/platformsh/config-reader-go)

You can also find examples of how to connect to each of Platform.sh managed services in multiple languages in the [Services Documentation](/configuration/services.md).

Project configured, services connected - time to commit the changes and push your repository onto your project.

{{< navbuttons next="I have connected to my services">}}
