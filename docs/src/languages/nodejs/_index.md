---
title: "Node.js"
description: |
  Node.js is a popular JavaScript runtime built on Chrome's V8 JavaScript engine.  Platform.sh supports deploying Node.js applications quickly and easily. Using our Multi-App support you can build a micro-service oriented system mixing both Javascript and PHP applications.
layout: single
---

{{< description >}}

## Supported versions

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="nodejs" status="supported" environment="grid" >}} | {{< image-versions image="nodejs" status="supported" environment="dedicated" >}} |

If you need other versions or a version in a container running something other than Node.js,
[use a version manager like `nvm`](/languages/nodejs/nvm.md).

{{% deprecated-versions %}}

| **Grid** | **Dedicated** |
|----------------------------------|---------------|
|  {{< image-versions image="nodejs" status="deprecated" environment="grid" >}} | {{< image-versions image="nodejs" status="deprecated" environment="dedicated" >}} |

## Build flavor

Node.js images use the `default` build flavor,
which runs `npm prune --userconfig .npmrc && npm install --userconfig .npmrc` if a `package.json` file is detected.
Note that this also allows you to provide a custom `.npmrc` file in the root of your application
(as a sibling of the `.platform.app.yaml` file.)

### Use yarn as a package manager

The default build flavor uses npm as a package manager.
To switch to yarn to manage dependencies, you need to switch to a build flavor of `none` and add yarn as a dependency.
You can then install dependencies in the `build` hook:

```yaml
build:
    flavor: none

dependencies:
    nodejs:
        yarn: "1.22.17"

hooks:
    build: |
        yarn
        yarn build
```

## Support libraries

While it's possible to read the environment directly from your application,
it's generally easier and more robust to use the [`platformsh-config`](https://github.com/platformsh/config-reader-nodejs) NPM library,
which handles decoding of service credential information for you.

## Configuration

To use Platform.sh and Node.js together, configure the `.platform.app.yaml` file with a few key settings,
as described here (a complete example is included at the end).

1. Specify the language of your application (available versions are listed above):

    {{< readFile file="src/registry/images/examples/full/nodejs.app.yaml" highlight="yaml" >}}

2. Specify your dependencies under the `nodejs` key, like this:

   ```yaml
   dependencies:
       nodejs:
           pm2: "^4.5.0"
   ```

   These are the global dependencies of your project (the ones you would have installed with `npm install -g`).
   This specifies the `pm2` process manager to run the node process.

3. Configure the command you use to start serving your application (this must be a foreground-running process) under the `web` section,
   such as:

   ```yaml
   web:
       commands:
           start: "PM2_HOME=/app/run pm2 start index.js --no-daemon"
   ```

   If there is a package.json file present at the root of your repository,
   Platform.sh automatically installs the dependencies.
   We suggest including the `platformsh-config` helper NPM module,
   which makes it trivial to access the running environment.

   ```json
   {
     "dependencies": {
       "platformsh-config": "^2.0.0"
     }
   }
   ```

   {{< note >}}
  If using the `pm2` process manager to start your application, it is recommended that you do so directly in `web.commands.start` as described above, rather than by calling a separate script that contains the command. Calling `pm2 start` at `web.commands.start` from within a script, even with the `--no-daemon` flag, has been found to daemonize itself and block other processes (such as backups) with continuous respawns.
   {{< /note >}}

4. Create any Read/Write mounts. The root file system is read only. You must explicitly describe writable mounts. In (3) we set the home of the process manager to `/app/run` so this needs to be writable.

   ```yaml
   mounts:
       run:
           source: local
           source_path: run
   ```

5. Include any relevant commands needed to build and setup your application in the `hooks` section, e.g.:

   ```yaml
   hooks:
       build: |
           npm install
           npm run build
   ```

6. Setup the routes to your Node.js application in `.platform/routes.yaml`.

   ```yaml
   "https://{default}/":
       type: upstream
       upstream: "app:http"
   ```

7. (Optional) If Platform.sh detects a `package.json` file in your repository, it automatically includes a `default` [`build` flavor](../../configuration/app/app-reference.md#build), that runs `npm prune --userconfig .npmrc && npm install --userconfig .npmrc`.

   See how to use [yarn as a package manager](#use-yarn-as-a-package-manager) or specify a different manager.


Here's a complete example that also serves static assets (PNGs from the `/public` directory):

```yaml
name: node
type: nodejs:14

web:
    commands:
        start: "PM2_HOME=/app/run pm2 start index.js --no-daemon"
        #in this setup you will find your application stdout and stderr in /app/run/logs
    locations:
        "/public":
            passthru: false
            root: "public"
            # Whether to allow files not matching a rule or not.
            allow: true
            rules:
                '\.png$':
                    allow: true
                    expires: -1
dependencies:
    nodejs:
        pm2: "^4.5.0"
mounts:
    run:
        source: local
        source_path: run
disk: 512
```

## In your application...

Finally, make sure your Node.js application is configured to listen over the port given by the environment
(here using the `platformsh-config` helper and getting it from `config.port`),
which is available in the environment variable ``PORT``.
Here's an example:

```js
// Load the http module to create an http server.
const http = require('http');

// Load the Platform.sh configuration
const config = require('platformsh-config').config();

const server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "application/json"});
  response.end(JSON.stringify(config));
});

server.listen(config.port);
```

## Accessing services

To access various [services](/configuration/services/_index.md) with Node.js, see the following examples.
The individual service pages have more information on configuring each service.

{{< codetabs >}}

---
title=Elasticsearch
file=static/files/fetch/examples/nodejs/elasticsearch
highlight=js
---

<--->

---
title=Memcached
file=static/files/fetch/examples/nodejs/memcached
highlight=js
---

<--->

---
title=MongoDB
file=static/files/fetch/examples/nodejs/mongodb
highlight=js
---

<--->

---
title=MySQL
file=static/files/fetch/examples/nodejs/mysql
highlight=js
---

<--->

---
title=PostgreSQL
file=static/files/fetch/examples/nodejs/postgresql
highlight=js
---

<--->

---
title=Redis
file=static/files/fetch/examples/nodejs/redis
highlight=js
---

<--->

---
title=Solr
file=static/files/fetch/examples/nodejs/solr
highlight=js
---

{{< /codetabs >}}

## Project templates

A number of project templates for Node.js applications and typical configurations are available on GitHub. Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

{{< repolist lang="nodejs" >}}
