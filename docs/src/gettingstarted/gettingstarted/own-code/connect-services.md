---
title: "Connect to services"
weight: 9
toc: false
aliases:
  - "/gettingstarted/own-code/connect-services.html"
---

{{< note >}}
If your application does not require access to services and you left `.platform/services.yaml` blank, feel free to proceed to the next step.
{{< /note >}}

At this point you have configured your application's services as well as its build and deploy process in your `.platform/services.yaml` and `.platform.app.yaml` files. As an example, in your `.platform.app.yaml` file you may have defined a relationship called `database`:

```yaml
relationships:
    database: "mysqldb:mysql"
```

which was configured in `.platform/services.yaml` with

```yaml
mysqldb:
    type: mysql:10.4
    disk: 1024
```

In order to connect to this service and use it in your application, Platform.sh exposes its credentials in the application container within a base64-encoded JSON `PLATFORM_RELATIONSHIPS` environment variable.

To access this variable you can install a Platform.sh configuration reader library

{{< codetabs >}}

---
title=Go
file=none
highlight=bash
markdownify=false
---

go mod edit -require=github.com/platformsh/config-reader-go/v2

<--->

---
title=Node.js
file=none
highlight=bash
markdownify=false
---

npm install platformsh-config --save

<--->

---
title=Java (Gradle)
file=none
highlight=bash
markdownify=false
---

compile group: 'sh.platform', name: 'config', version: 2.2.0'

<--->

---
title=Java (Maven)
file=none
highlight=xml
markdownify=false
---

<dependency>
    <groupId>sh.platform</groupId>
    <artifactId>config</artifactId>
    <version>2.2.0</version>
</dependency>

<--->

---
title=PHP
file=none
highlight=bash
markdownify=false
---

composer install platformsh/config-reader

<--->

---
title=Python
file=none
highlight=bash
markdownify=false
---

pip install platformshconfig

{{< /codetabs >}}


and access the credentials of `database`

{{< codetabs >}}
---
title=PHP
file=none
highlight=php
markdownify=false
---
<?php

use Platformsh\ConfigReader\Config;

$config = new Config();
$credentials = $config->credentials('database');

<--->
---
title=Python
file=none
highlight=python
markdownify=false
---

from platformshconfig import Config

config = Config()
credentials = config.credentials('database')

<--->

---
title=Node.js
file=none
highlight=js
markdownify=false
---

const config = require("platformsh-config").config();
const credentials = config.credentials('database');

<--->

---
title=Java
file=none
highlight=java
markdownify=false
---
import Config;

Config config = new Config();
Credential cred = config.getCredential('database')

<--->

---
title=Go
file=none
highlight=golang
markdownify=false
---

import psh "github.com/platformsh/config-reader-go/v2"

config, err := psh.NewRuntimeConfig()
// Handle err

credentials, err := config.Credentials("database")
// Handle err

{{< /codetabs >}}



or read and decode the environment variable directly.


{{< codetabs >}}

---
title=Node.js
file=none
highlight=js
markdownify=false
---

relationships = JSON.parse(new Buffer(process.env['PLATFORM_RELATIONSHIPS'], 'base64').toString());
credentials = relationships['database'];

<--->

---
title=PHP
file=none
highlight=php
markdownify=false
---
<?php

$relationships = json_decode(base64_decode(getenv('PLATFORM_RELATIONSHIPS')), TRUE);
$credentials = $relationships['database'];

<--->

---
title=Python
file=none
highlight=bash
markdownify=false
---

import os, json, base64

relationships = json.loads(base64.b64decode(os.environ["PLATFORM_RELATIONSHIPS"]))
credentials = relationships['database']

{{< /codetabs >}}

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

You can also find examples of how to connect to each of Platform.sh managed services in multiple languages in the [Services Documentation](/configuration/services.html).

Project configured, services connected - time to commit the changes and push your repository onto your project.

{{< guide-buttons next="I've connected to my services" >}}
