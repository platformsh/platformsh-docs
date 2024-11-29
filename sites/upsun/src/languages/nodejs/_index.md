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

Patch versions are applied periodically for bug fixes and the like. When you deploy your app, you always get the latest available patches.

{{< image-versions image="nodejs" status="supported" environment="grid" >}}

### Specify the language

To use Node.js, specify ``nodejs`` as your [app’s type](/create-apps/app-reference/single-runtime-image.md#types):

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  <APP_NAME>:
    type: 'nodejs:<VERSION_NUMBER>'
```

For example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'nodejs:{{% latest "nodejs" %}}'
```

To use a specific version in a container with a different language, [use a version manager](node-version.md).

{{% deprecated-versions %}}

{{< image-versions image="nodejs" status="deprecated" environment="grid" >}}

## Usage example

To use JavaScript with Node.js on {{% vendor/name %}}, configure your [app configuration](../../create-apps/_index.md)
(a complete example is included at the end).

### 1. Specify the version

Choose a version from the [list of supported versions](#supported-versions)
and add it to your app configuration:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'nodejs:{{% latest "nodejs" %}}'
```

### 2. Specify any global dependencies

Add the following to your app configuration:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'nodejs:{{% latest "nodejs" %}}'
    dependencies:
      nodejs:
        sharp: "*"
```

These are now available as commands, the same as installing with `npm install -g`.

### 3. Build your app

Include any commands needed to build and setup your app in the `hooks`, as in the following example:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  myapp:
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
applications:
  # The app's name, which must be unique within the project.
  myapp:
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

```js
// Load the http module to create an http server.
const http = require('http');
const PORT = process.env.PORT || 8888;

const server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.end("Hello world!");
});

// Listen on the port from the {{% vendor/name %}} configuration
server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
```
### Complete example

A complete basic app configuration looks like the following:

```yaml {configFile="app"}
applications:
  # The app's name, which must be unique within the project.
  'node-app':
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
applications:
  # The app's name, which must be unique within the project.
  myapp:
    type: 'nodejs:{{% latest "nodejs" %}}'
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
applications:
  # The name of your app.
  myapp:
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
applications:
  # The name of your app.
  myapp:
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

{{% access-services version="2" %}}

{{< repolist lang="nodejs" displayName="Node.js" >}}

## Frameworks

All major Javascript/Node.js web frameworks can be deployed on {{% vendor/name %}}.
See dedicated guides for deploying and working with them:

- [Express](/get-started/stacks/express)
- [Next.js](/get-started/stacks/nextjs.md)
- [Strapi](/get-started/stacks/strapi)
