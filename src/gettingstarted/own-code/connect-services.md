# Import your own code

## Connect to Services

> **Note:** If your application does not require access to services and you left `.platform/services.yaml` blank, feel free to proceed to the next step.

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

{% codetabs name="PHP", type="php" -%}
composer install platformsh/config-reader
{%- language name="Python", type="py" -%}
pip install platformshconfig
{%- language name="Node.js", type="js" -%}
npm install platformsh-config --save
{%- endcodetabs %}

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

<div>
  <a href="https://github.com/platformsh/config-reader-php">PHP Config Reader</a><br />
  <a href="https://github.com/platformsh/config-reader-python">Python Config Reader</a><br />
</div>

<div>
  <a href="https://github.com/platformsh/config-reader-java">Java Config Reader</a><br />
  <a href="https://github.com/platformsh/config-reader-nodejs">Node.js Config Reader</a><br />
</div>

You can also find examples of how to connect to each of Platform.sh managed services in multiple languages in the [Services Documentation](/configuration/services.md). Once you have done so, you will next need to handle HTTP requests to your application using the `.platform/routes.yaml` file.

<div id = "buttons"></div>

<script>
    var navNextText = "I have connected to my services to my application";
    var navButtons = {type: "navigation", prev: getPathObj("prev"), next: getPathObj("next", navNextText), div: "buttons"};
    makeButton(navButtons);
</script>
