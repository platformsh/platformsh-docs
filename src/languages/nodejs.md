# Node.js

Node.js is a popular JavaScript runtime built on Chrome's V8 JavaScript engine.
Platform.sh supports deploying Node.js applications quickly and easily. Using
our Multi-App support you can build a micro-service oriented system mixing both
Javascript and PHP applications.

## Supported versions

* 0.12
* 4.7
* 4.8
* 6.9
* 6.10
* 6.11
* 8.9

See https://github.com/platformsh/platformsh-example-nodejs/tree/mongodb for a
full example with MongoDB support.

## Configuration

To use Platform.sh and Node.js together, configure the ``.platform.app.yaml``
file with a few key settings, as described here (a complete example is included
at the end).

1. Specify the language of your application (available versions are listed above):

   ```yaml
   # .platform.app.yaml
   type: "nodejs:6.9"
   ```

2. Specify your dependencies under the `nodejs` key, like this:

   ```yaml
   dependencies:
     nodejs:
       pm2: "^2.5.0"
   ```

   These are the global dependencies of your project (the ones you would have
   installed with `npm install -g`). Here we specify the `pm2` process manager
   that will allow us to run the node process.

3. Configure the command you use to start serving your application (this must
   be a foreground-running process) under the `web` section, e.g.:

   ```yaml
   web:
     commands:
       start: "PM2_HOME=/app/run pm2 start index.js --no-daemon"
   ```

   If there is a package.json file present at the root of your repository,
   Platform.sh will automatically install the dependencies. We suggest including
   the `platformsh` helper npm module, which makes it trivial to access the
   running environement.

   ```javascript
   "dependencies": {
     "platformsh": "^0.0.1"
   }
   ```

4. Create any Read/Write mounts. The root file system is read only.
   You must explicitly describe writable mounts. In (3) we set the
   home of the process manager to `/app/run` so this needs to be writable.

   ```yaml
   mounts:
     "/run": "shared:files/run"
   ```

5. Include any relevant commands needed to build and setup your application in
   the `hooks` section, e.g.:

   ```yaml
   hooks:
     build: |
       npm install
       npm run build
       bower install
   ```

6. Setup the routes to your nodejs application in `.platform/routes.yaml`.

```yaml
"https://{default}/":
  type: upstream
  upstream: "app:http"
```

Here's a complete example that also serves static assets (.png from the /public directory):

```yaml
name: node
type: nodejs:6.9

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
    pm2: "^2.5.0"
mounts:
  "/run": "shared:files/run"
disk: 512
```

## In your application...
Finally, make sure your Node.js application is configured to listen over the
port given by the environment (here we use the platformsh helper and get it
from config.port) that is available in the environment variable ``PORT``.
Here's an example:

```javascript
// Load the http module to create an http server.
var http = require('http');
// Load the Platform.sh configuration
var config= require("platformsh").config();

var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.end("<html><head><title>Hello Node.js</title></head><body><h1><img src='public/js.png'>Hello Node.js</h1><h3>Platform configuration:</h3><pre>"+JSON.stringify(config, null, 4) + "</pre></body></html>");
});

server.listen(config.port);
```

## Project templates

A number of project templates for Node.js applications and typical configurations are available on GitHub.  Not all of them are proactively maintained but all can be used as a starting point or reference for building your own website or web application.

Platform.sh also provides a [helper library](https://github.com/platformsh/platformsh-nodejs-helper) for Node.js applications that simplifies presenting environment information to your application.  It is not required to run Node.js applications on Platform.sh but is recommended.
 
* [Generic Node.js](https://github.com/platformsh/platformsh-example-nodejs)
* [Parse](https://github.com/platformsh/platformsh-example-parseit)
* [Node.js-based microservices](https://github.com/platformsh/platformsh-example-nodejs-microservices)
