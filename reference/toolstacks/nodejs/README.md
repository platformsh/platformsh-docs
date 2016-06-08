# Node.js Beta

Node.js is a popular JavaScript runtime built on Chrome's V8 JavaScript engine.
Platform.sh supports deploying Node.js applications quickly and easily. Using
our Multi-App support you can build a micro-service oriented system mixing both
Javascript and PHP applications.

## Supported versions

* 0.12 (default)
* 4.4
* 6.2

See https://github.com/platformsh/platformsh-example-nodejs/tree/mongodb for a 
full example with MongoDB support.

## Configuration

To use Platform.sh and Node.js together, configure the ``.platform.app.yaml``
file with a few key settings, as described here (a complete example is included
at the end).

1. Specify the `type` as `nodejs` you should definitely specify a version for example `type: nodejs:4.2`
2. Specify your dependencies under the `nodejs` key, like this:

```yaml
 dependencies:
   nodejs:
     pm2: "^0.15.10"
```

These are the global dependencies of your project (the ones you would have
installed with `npm install -g`). Here we specify the pm2, Production process manager that will allow us to run the node process.

3. Configure the command you use to start serving your application (this must
   be a foreground-running process) under the `web` section, e.g.:

```yaml
 web:
   commands:
     start: "PM2_HOME=/app/run pm2 start index.js --no-daemon"
```

If there is a package.json file present at the root of your repository 
Platform.sh will automatically install the dependencies. We suggest including
the `platformsh` helper npm module, that makes it trivial to access the 
running environement.

```javascript
  "dependencies": {
    "platformsh": "^0.0.1"
  }
```

5. Create any Read/Write mounts 
The Platform.sh file system is read only you have to explicitly describe  
writable mounts. In (3) we set the home of the process manager to `/app/run`
so this needs to be writable.

```yaml
  mounts:
    "/run": "shared:files/run"
```


6. Include any relevant commands needed to build and setup your application in
   the `hooks` section, e.g.:

```yaml
hooks:
  build: |
    npm install
    npm run build
    bower install
```

Here's a complete example that also serves static assets (.png from the /public directory):

```yaml
name: node
type: nodejs

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
    pm2: "^0.15.10"
mounts:
  "/run": "shared:files/run"
disk: 512
```

## In your application...
Finally, make sure your Node.js application is configured to listen over the 
port given by the environement (here we use the platformsh helper and get it
from config.port) it is available in the environment variable ``PORT``.
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
