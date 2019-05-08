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

<html>
<head>
    <title>Runtime Supported Versions</title>
    <script src="jquery.js"></script>
    <script>
        $(function(){
            $("#includedContent").load("/gettingstarted/own-code/more-info/config-readers.html");
        });
    </script>
</head>
<body>
<div id="includedContent"></div>
</body>
</html>

You can also find examples of how to connect to each of Platform.sh managed services in multiple languages in the [Services Documentation](/configuration/services.md). Once you have done so, you will next need to handle HTTP requests to your application using the `.platform/routes.yaml` file.

<html>
<head>
<link rel="stylesheet" href="/styles/styles.css">
</head>
<body>

<br/><br/>

<center>

<a href="/gettingstarted/own-code/step-7.html" class="buttongen small">Back</a>
<a href="/gettingstarted/own-code/step-9.html" class="buttongen small">I have connected to my services to my application</a>

</center>

<br/><br/>

</body>
</html>
