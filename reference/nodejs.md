# Node.js

Node.js is a popular JavaScript runtime built on Chrome's V8 JavaScript engine.
 Platform.sh supports deploying Node.js applications quickly and easily.

## Supported versions

* 0.12.7 (default)

## Configuration

To use Platform.sh and Node.js together, configure the ``.platform.app.yaml``
file with a few key settings, as described here (a complete example is included
at the end).

1. Specify the `type` as ``nodejs``
2. Specify your dependencies under the `nodejs` key, like this:

   ```yaml
   dependencies:
     nodejs:
       'pm2': "*"
       'react': "^0.13.0"
       'url-loader': "~0.5.5"
   ```
   If you have a `package.json` file at the root of your project you can
   basically copy and paste that list here (but format it as YAML).
3. Configure the command you use to start serving your application (this should
   be a foreground-running process) under the `web` section, e.g.:

   ```yaml
   web:
     commands:
       start: "PM2_HOME=/app/public pm2 start app.js --no-daemon"
   ```

4. Include any relevant commands needed to build and setup your application in
   the `hooks` section, e.g.:

   ```yaml
   hooks:
     build: |
       npm install
       npm run build
   ```

Here's the complete example:

```yaml
name: myapp
type: nodejs

dependencies:
  nodejs:
    'pm2': '*'
    'apicache': "0.0.12"
    'react': "^0.13.0"
    'url-loader': "~0.5.5"

web:
  commands:
    start: "PM2_HOME=/app/public pm2 start start.js --no-daemon"

  locations:
    "/":
      root: "public"
      passthru: true
      expires: 1h

hooks:
  build: |
    npm install
    npm run build

disk: 2048
```

## In your application...
Finally, make sure your Node.js application is configured to listen over the
environment variable ``PORT``, and you're done. Here's an example:

```javascript
var http = require('http');
   
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(process.env.PORT, "127.0.0.1");
```

