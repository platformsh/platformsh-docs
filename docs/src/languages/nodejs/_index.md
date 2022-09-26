---
title: "Node.js"
description: Get started creating Node.js apps on Platform.sh.
layout: single
---

Node.js is a popular asynchronous JavaScript runtime.
Deploy scalable Node.js apps of all sizes on Platform.sh.
You can also develop a microservice architecture mixing JavaScript and other apps with [multi-app projects](../../create-apps/multi-app.md).

## Supported versions

| Grid and {{% names/dedicated-gen-3 %}} | {{% names/dedicated-gen-2 %}} |
|----------------------------------------|------------------------------ |
|  {{< image-versions image="nodejs" status="supported" environment="grid" >}} | {{< image-versions image="nodejs" status="supported" environment="dedicated-gen-2" >}} |

{{% image-versions-legacy "nodejs" %}}

{{% language-specification type="nodejs" display_name="Node.js" %}}

To use a specific version in a container with a different language, [use a version manager](node-version.md).

{{% deprecated-versions %}}

| Grid | {{% names/dedicated-gen-2 %}} |
| ---- | ----------------------------- |
|  {{< image-versions image="nodejs" status="deprecated" environment="grid" >}} | {{< image-versions image="nodejs" status="deprecated" environment="dedicated-gen-2" >}} |

## Usage example

To use Node.js on Platform.sh and Node.js together, configure the `.platform.app.yaml` file with a few key settings
(a complete example is included at the end).

### 1. Specify the version

Choose a version from the [list above](#supported-versions)
and add it to your [app configuration](../../create-apps/_index.md):

{{< readFile file="src/registry/images/examples/full/nodejs.app.yaml" highlight="yaml" location=".platform.app.yaml" >}}

### 2. Specify any global dependencies

Add the following to your app configuration:

```yaml {location=".platform.app.yaml"}
dependencies:
    nodejs:
        yarn: "*"
```

These are now available as commands, the same as installing with `npm install -g`.

### 3. Build your app

Include any commands needed to build and setup your app in the `hooks`, as in the following example:

```yaml {location=".platform.app.yaml"}
hooks:
    build: |
        npm run setup-assets
        npm run build
```

### 4. Start your app

Specify a command to start serving your app (it must be a process running in the foreground):

```yaml {location=".platform.app.yaml"}
web:
    commands:
        start: node index.js
```

### 5. Listen on the right port

Make sure your Node.js application is configured to listen over the port given by the environment.
The following example uses the [`platformsh-config` helper](#configuration-reader):

```js
// Load the http module to create an http server.
const http = require('http');

// Load the Platform.sh configuration
const config = require('platformsh-config').config();

const server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end("Hello world!");
});

// Listen on the port from the Platform.sh configuration
server.listen(config.port);
```

### Complete example

A complete basic app configuration looks like the following:

```yaml {location=".platform.app.yaml"}
name: node-app

type: nodejs:16

disk: 512

dependencies:
    nodejs:
        yarn: "*"

hooks:
    build: |
        npm run setup-assets
        npm run build

web:
    commands:
        start: "node index.js"
```

## Dependencies

By default, Platform.sh assumes you're using npm as a package manager.
If your code has a `package.json`, the following command is run as part of the default [build flavor](../../create-apps/app-reference.md#build):

```bash
npm prune --userconfig .npmrc && npm install --userconfig .npmrc
```

This means you can specify configuration in a `.npmrc` file in [your app root](../../create-apps/app-reference.md#root-directory).

### Use Yarn as a package manager

To switch to Yarn to manage dependencies, follow these steps:

1. Turn off the default use of npm:

   ```yaml {location=".platform.app.yaml"}
   build:
       flavor: none
   ```

2. Specify the version of Yarn you want:

   ```json {location="package.json"}
   {
     ...
     "packageManager": "yarn@3.2.1"
   }
   ```

What you do next depends on the versions of Yarn and Node.js you want.

{{< codetabs >}}

---
title=Yarn 3.x and Node.js 16
file=none
highlight=false
---

3. Use Corepack to run Yarn in your build hook:

   ```yaml {location=".platform.app.yaml"}
   hooks:
       build: |
           corepack yarn install
   ```

<--->

---
title=Yarn 3.x and Node.js 14
file=none
highlight=false
---

3. Enable Corepack (which is opt-in):

   ```yaml {location=".platform.app.yaml"}
   dependencies:
       nodejs:
           corepack: "*"
   ```

4. Use Corepack to run Yarn in your build hook:

   ```yaml {location=".platform.app.yaml"}
   hooks:
       build: |
           corepack yarn install
   ```

<--->

---
title=Yarn < 3
file=none
highlight=false
---

3. Add Yarn as a global dependency:

   ```yaml {location=".platform.app.yaml"}
   dependencies:
       nodejs:
           yarn: "1.22.19"
   ```

4. Install dependencies in the `build` hook:

   ```yaml {location=".platform.app.yaml"}
   hooks:
       build: |
           yarn --frozen-lockfile
   ```

{{< /codetabs >}}


## Connecting to services

The following examples show how to use Node.js to access various [services](../../add-services/_index.md).
To configure a given service, see the page dedicated to that service.

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


{{% config-reader %}}
[`platformsh-config` package](https://github.com/platformsh/config-reader-nodejs)
{{% /config-reader%}}

## Project templates

{{< repolist lang="nodejs" displayName="Node.js" >}}
