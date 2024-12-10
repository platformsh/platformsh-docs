---
title: "JavaScript/Node.js"
description: Get started creating JavaScript apps with Node.js on {{% vendor/name %}}.
layout: single
keywords:
  - Bun runtime
  - bun runtime
---

{{% composable/disclaimer %}}

Node.js is a popular asynchronous JavaScript runtime.
Deploy scalable Node.js apps of all sizes on {{% vendor/name %}}.
You can also develop a microservice architecture mixing JavaScript and other apps with [multi-app projects](../../create-apps/multi-app/_index.md).

## Supported versions

You can select the major version. But the latest compatible minor version is applied automatically and can’t be overridden.

Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.

<table>
    <thead>
        <tr>
            <th>Grid and {{% names/dedicated-gen-3 %}}</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="nodejs" status="supported" environment="grid" >}}</td>
            <td>{{< image-versions image="nodejs" status="supported" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

{{% language-specification type="nodejs" display_name="Node.js" %}}

```yaml {configFile="app"}
type: 'nodejs:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
type: 'nodejs:{{% latest "nodejs" %}}'
```

To use a specific version in a container with a different language, [use a version manager](node-version.md).

{{% deprecated-versions %}}

<table>
    <thead>
        <tr>
            <th>Grid</th>
            <th>Dedicated Gen 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{< image-versions image="nodejs" status="deprecated" environment="grid" >}}</td>
            <td>{{< image-versions image="nodejs" status="deprecated" environment="dedicated-gen-2" >}}</thd>
        </tr>
    </tbody>
</table>

## Usage example

To use JavaScript with Node.js on {{% vendor/name %}}, configure your [app configuration](../../create-apps/_index.md)
(a complete example is included at the end).

### 1. Specify the version

Choose a version from the [list of supported versions](#supported-versions)
and add it to your app configuration:

```yaml {configFile="app"}
type: 'nodejs:{{% latest "nodejs" %}}'
```

### 2. Specify any global dependencies

Add the following to your app configuration:


```yaml {configFile="app"}
type: 'nodejs:{{% latest "nodejs" %}}'
dependencies:
  nodejs:
    sharp: "*"
```

These are now available as commands, the same as installing with `npm install -g`.

### 3. Build your app

Include any commands needed to build and setup your app in the `hooks`, as in the following example:

```yaml {configFile="app"}
type: 'nodejs:{{% latest "nodejs" %}}'
dependencies:
  nodejs:
    sharp: "*"
hooks:
  build: |
    npm run setup-assets
    npm run build
```

### 4. Start your app

Specify a command to start serving your app (it must be a process running in the foreground):

```yaml {configFile="app"}
type: 'nodejs:{{% latest "nodejs" %}}'
dependencies:
  nodejs:
    sharp: "*"
hooks:
  build: |
    npm run setup-assets
    npm run build
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

// Load the {{% vendor/name %}} configuration
const config = require('platformsh-config').config();

const server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end("Hello world!");
});

// Listen on the port from the {{% vendor/name %}} configuration
server.listen(config.port);
```
### Complete example

A complete basic app configuration looks like the following:

```yaml {configFile="app"}
name: node-app

type: 'nodejs:{{% latest "nodejs" %}}'

disk: 512

dependencies:
  nodejs:
    sharp: "*"

hooks:
  build: |
    npm run setup-assets
    npm run build

web:
  commands:
    start: "node index.js"
```

## Dependencies

By default, {{% vendor/name %}} assumes you're using npm as a package manager.
If your code has a `package.json`, the following command is run as part of the default [build flavor](/create-apps/app-reference/single-runtime-image.md#build):

```bash
npm prune --userconfig .npmrc && npm install --userconfig .npmrc
```

This means you can specify configuration in a `.npmrc` file in [your app root](/create-apps/app-reference/single-runtime-image.md#root-directory).

### Use Yarn as a package manager

To switch to Yarn to manage dependencies, follow these steps:

1. Turn off the default use of npm:

```yaml {configFile="app"}
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

+++
title=Yarn 3.x and Node.js 16+
+++

3. Use Corepack to run Yarn in your build hook:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'nodejs:{{% latest "nodejs" %}}'
hooks:
  build: |
    corepack yarn install
{{< /snippet >}}
```

<--->

+++
title=Yarn 3.x and Node.js 14
+++

3. Enable Corepack (which is opt-in):

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'nodejs:{{% latest "nodejs" %}}'
dependencies:
  nodejs:
    corepack: "*"
{{< /snippet >}}
```

4. Use Corepack to run Yarn in your build hook:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'nodejs:{{% latest "nodejs" %}}'
hooks:
  build: |
    corepack yarn install
{{< /snippet >}}
```

<--->

+++
title=Yarn < 3
+++

3. Add Yarn as a global dependency:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'nodejs:{{% latest "nodejs" %}}'
dependencies:
  nodejs:
    yarn: "1.22.19"
{{< /snippet >}}
```

4. Install dependencies in the `build` hook:

```yaml {configFile="app"}
{{< snippet name="myapp" config="app" root="/" >}}
type: 'nodejs:{{% latest "nodejs" %}}'
hooks:
  build: |
    yarn --frozen-lockfile
{{< /snippet >}}
```

{{< /codetabs >}}

### Use Bun as a package manager

{{< partial "bun/body.md" >}}

To switch to Bun to manage dependencies,
use the following configuration:

```yaml {configFile="app"}
# The name of your app.
name: myapp
# Choose Node.js version 20 or above.
type: 'nodejs:20'
# Override the default Node.js build flavor.
build:
  flavor: none
# Use Bun to install the dependencies.
hooks:
  build: bun install
```

#### Use Bun as a runtime

You can even [use Bun as a runtime](https://platform.sh/blog/bun-support-is-here/) by adjusting the `start` command as follows:

```yaml {configFile="app"}
# The name of your app.
name: myapp
# Choose Node.js version 20 or above.
type: 'nodejs:20'
# Override the default Node.js build flavor.
build:
  flavor: none
# Use Bun to install the dependencies.
hooks:
  build: bun install
# In the start command replace node with Bun.
web:
  commands:
    start: 'bun app.js'
```

## Connecting to services

The following examples show how to use Node.js to access various [services](../../add-services/_index.md).
To configure a given service, see the page dedicated to that service.

{{< codetabs v2hide="true" >}}

+++
title=Elasticsearch
file=static/files/fetch/examples/nodejs/elasticsearch
highlight=js
+++

<--->

+++
title=Memcached
file=static/files/fetch/examples/nodejs/memcached
highlight=js
+++

<--->

+++
title=MongoDB
file=static/files/fetch/examples/nodejs/mongodb
highlight=js
+++

<--->

+++
title=MySQL
file=static/files/fetch/examples/nodejs/mysql
highlight=js
+++

<--->

+++
title=PostgreSQL
file=static/files/fetch/examples/nodejs/postgresql
highlight=js
+++

<--->

+++
title=Redis
file=static/files/fetch/examples/nodejs/redis
highlight=js
+++

<--->

+++
title=Solr
file=static/files/fetch/examples/nodejs/solr
highlight=js
+++

{{< /codetabs >}}

{{% config-reader %}}[Node.js configuration reader library](https://github.com/platformsh/config-reader-nodejs){{% /config-reader%}}

## Project templates

{{< repolist lang="nodejs" displayName="Node.js" >}}
