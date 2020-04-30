#  Custom activity scripts

Platform.sh supports custom scripts that can fire in response to any activity.  These scripts allow you to take arbitrary actions in response to actions in your project, such as when it deploys, when a new branch is created, etc.

Activity scripts are written in a scope-limited version of Javascript ES5.  That means they do not support newer ES6 and later features such as classes, nor do they support installing additional packages.  A series of utility functions you can reuse are included below.

## Managing scripts

### Installing

Activity scripts are configured as integrations.  That means they are at the *project level*, not at the level of an individual environment.  While you can store the scripts in your Git repository for easy access, they will have no effect there.

To install a new activity script, use the [Platform.sh CLI](/development/cli.md).

```bash
platform integration:add --type script --file ./my_script.js
```

That will install and enable the `my_script.js` file as an activity script on the current project.  You can get its ID by listing the integrations on the current project:

```bash
platform integrations

+---------------+--------------+--------------+
| ID            | Type         | Summary      |
+---------------+--------------+--------------+
| nadbowmhd67do | script       | ...          |
| rcqf6b69jdcx6 | health.email | From:        |
|               |              | To: #admins  |
+---------------+--------------+--------------+
```

The just-installed script's ID in this example is `nadbowmhd67do`.

Do not run the `integration:add` command a second time, or it will install a second integration that happens to have the same code.

### Updating

To update an existing activity script, use the `integration:update` command.  You will need the ID Of the integration to update (as above).

```bash
platform integration:update --file ./my_script.js nadbowmhd67do
```

That will update the integration in place, permanently overwriting the previous version.

### Removing

To disable an activity script, use the `integration:delete` command:

```bash
platform integration:delete nadbowmhd67do
```

## Debugging

Activity logs are available through their own CLI command, `platform integration:activities`.  Every time your activity script runs it will generate a new log entry, including the output from the script.  Any output produced by `console.log` will be available in the activity log, and that is the recommended way to debug scripts.

See the [activity log](/adminsitration/integrations.md#debugging-integrations) documentation for further details.

To get more readable output of a variable you're trying to debug, you can make `JSON.stringify` use human-friendly formatting.

```javascript
console.log(JSON.stringify(project, null, 2));
```

## Configuring scripts

There are many types of activity to which a script could respond.  By default, it will activate only after a successful `git push` operation.  That trigger is configurable via command line switches when adding or updating a script.

For example, to have a script trigger any time an environment is activated or deactivated, you would run:

```bash
platform integration:update --events=['environment:activate', 'environment:deactivate'] nadbowmhd67do
```

A complete list of possible events is available in the [webhook documentation](/administration/webhooks.md).

Scripts can also trigger only when an action reaches a given state, such as "pending", "in_progress", or "complete".  The default is only when they reach "complete".  To have a script execute when a synchronize action first starts, for example, you would run:

```bash
platform integration:update --events=['environment:synchronize'] --states="in_progress" nadbowmhd67do
```

It is also possible to restrict scripts to certain environments by name.  Most commonly that is used to have them execute only for the `master` environment, or for all environments except `master`.

The following example executes only for backup actions on the `master` environment:

```bash
platform integration:update --events=['environment:backup'] --environments="master" nadbowmhd67do
```

There is also an `--exclude-environments` switch to blacklist environments by name rather than whitelist.

As a general rule, it is better to have an activity script only execute on the specific events and branches you're interested in rather than firing on all activities and then filtering out undesired use cases in the script itself.

## Available APIs

Activity scripts have a series of APIs available to them to facilitate building out custom functionality.

### `activity`

Every activity script has a global variable `activity` that contains detailed information about the activity, including embedded, JSON-ified versions of the routes configuration and relevant `.platform.app.yaml` files.  The `activity` variable is the same as the [webhook payload](/administration/webhooks.md).  See the documentation there for details and a complete example.

Several of the utility functions below work by pulling out common portions of the `activity` object.  Most notably, scripts can be configured via [Project-level variables](/development/variables.md#project-variables) that can be accessed from the `activity` object.

### `project`

The `project` global variable includes information about the project subscription itself.  That includes its ID and name, how many users are associated with the project, it's SSH public key, and various other values.  An example of this object is below:

```json
{
  "attributes": {},
  "created_at": "2020-04-15T19:50:09.514267+00:00",
  "default_domain": null,
  "description": "",
  "id": "kpyhl5f8nuzef",
  "owner": "...",
  "region": "eu-3.platform.sh",
  "repository": {
    "client_ssh_key": "ssh-rsa ...",
    "url": "kqyhl5f5nuzky@git.eu-3.platform.sh:kqyhl5f5nuzky.git"
  },
  "status": {
    "code": "provisioned",
    "message": "ok"
  },
  "subscription": {
    "environments": 3,
    "included_users": 1,
    "license_uri": "...",
    "plan": "development",
    "restricted": false,
    "storage": 5120,
    "subscription_management_uri": "...",
    "suspended": false,
    "user_licenses": 1
  },
  "timezone": "Europe/Dublin",
  "title": "Activity script examples",
  "updated_at": "2020-04-21T17:15:35.526498+00:00"
}
```

### Storage API

Activity scripts have access to a limited key/value storage API to persist values from one execution to another.  The API is similar to the Javscript `LocalStorage` API.

```javascript
// Access the storage API.  It is not pre-required.
var storage = require("storage");

// Retireve a stored value. If the value is not set it will return null.
var counter = storage.get('counter') || 0;

if (counter) {
    // Generate debug output.
    console.log("Counter is: " + counter);
}

// Write a value into the storage. Only string-safe values are supported.
// To save an object or array, run JSON.stringify() on it first.
storage.set('counter', counter + 1);

// Remove a value completely.
storage.remove('counter');

// Remove all values in storage, unconditionally.
storage.clear();
```

### Fetch API

Activity scripts support a modified version of the browser "Fetch API" for issuing HTTP requests.  Unlike the typical browser version, however, they only support synchronous requests.  That means the return value of `fetch()` is a response object, not a Promise for one.  The API is otherwise essentially the same as that [documented by Mozilla](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

For instance, this example sends a GET request every time it executes:

```javascript
var resp = fetch("http://example.com/site-deployed.php");

// resp.ok is true if the response was a 2xx, false otherwise.
if (!resp.ok) {
    console.log("Well that didn't work.");
}
```

While this example sends a POST request with a JSON string as the body:

```javascript
var body = JSON.stringify({
  "some": "value",
});

var resp = fetch("http://example.com/", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
    },
    body: body,
  }
)
if (!resp.ok) {
    console.log("Couldn't POST.");
}
```

See the Mozilla Dev Network link above for more `fetch()` options.

## Cryptographic API

A minimalist cryptographic API is also available to activity scripts.  Its main use is for signing requests to 3rd party APIs.

### crypto.createHmac(): create an HMAC signature

The `crypto.createHmac()` function allows you to create a secure hash and digest.

```javascript
var h = crypto.createHmac("sha256", "foo");
h.update("bar");
h.digest("hex")
```

* The available hashing functions are `'sha256'`, `'sha1'` and `'md5'` as hashing functions.
* The available digest formats are `'base64'`, `'hex'` or `''` (empty).  An empty digest will yield a byte string.

For example, if you wanted to call an AWS API, you would calculate the signature like so:

```Javascript
function HMAC(key, value) {
  var h = crypto.createHmac("sha256", key);
  h.update(value);
  return h.digest();
}
var kSecret = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY";
HMAC(HMAC(HMAC(HMAC("AWS4" + kSecret,"20150830"),"us-east-1"),"iam"),"aws4_request");
```

> Example taken from the [AWS documentation for signing API requests](https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html).

## Utility routines

The following utility routines can help simplify common tasks in your activity scripts.  They are free to copy, modify, bend, fold, spindle, and mutilate as needed for your own scripts.  They also demonstrate some common patterns for working with the `activity` and `project` data structures in ES5 code.

### General utilities

```javascript
/**
 * Formats a string, injecting values in for placeholders.
 *
 * @param {string} format
 *   A format string with placeholders in the form {0}, {1}, etc.
 * @param {string} args
 *   A variable number of strings to replace by position.
 * @return {string}
 *   The formatted string.
 */
function formatString (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}
```

```javascript
/**
 * Returns a key/value object containing all variables relevant for the activity.
 *
 * That includes project level variables, plus any variables visible for
 * the relevant environment for the activity, if any.
 *
 * Note that JSON-encoded values will show up as a string, and need to be
 * decoded with JSON.parse().
 */
function variables() {
    var vars = {};
    activity.payload.deployment.variables.forEach(function(variable) {
        vars[variable.name] = variable.value;
    });

    return vars;
}
```


### Route access

```javascript
/**
 * Returns just those routes that point to a valid upstream.
 *
 * This method is similar to routes(), but filters out redirect routes that are rarely
 * useful for app configuration.  If desired it can also filter to just those routes
 * whose upstream is a given application name.  To retrieve routes that point to the
 * current application where the code is being run, use:
 *
 * routes =  getUpstreamRoutes(applicationName);
 *
 * @param {string|null} appName
 *   The name of the upstream app on which to filter, if any.
 * @return {object}
 *   An object map of route definitions.
 */
function getUpstreamRoutes(appName) {
    var upstreams = {};
    Object.keys(activity.payload.deployment.routes).forEach(function (url) {
        var route = activity.payload.deployment.routes[url];
        if (route.type === "upstream") {
            if (!appName || appName === route.upstream.split(':')[0]) {
                route.url = url;
                upstreams[url] = route;
            }
        }
    });
    return upstreams;
}
```

```javascript
/**
 * Returns the primary route.
 *
 * The primary route is the one marked primary in `routes.yaml`, or else
 * the first non-redirect route in that file if none are marked.
 *
 * @return {object}
 *   The route definition.  The generated URL of the route is added as a "url" key.
 */
function getPrimaryRoute() {
    var primary = {};
    Object.keys(activity.payload.deployment.routes).forEach(function (url) {
        var route = activity.payload.deployment.routes[url];
        if (route.primary) {
            route.url = url;
            primary = route;
        }
    });
    return primary;
}
```

```javascript
/**
 * Returns a single route definition.
 *
 * Note: If no route ID was specified in routes.yaml then it will not be possible
 * to look up a route by ID.
 *
 * @param {string} id
 *   The ID of the route to load.
 * @return {object}
 *   The route definition.  The generated URL of the route is added as a "url" key.
 * @throws {Error}
 *   If there is no route by that ID, an exception is thrown.
 */
function getRoute(id) {
    var found = null;
    Object.keys(activity.payload.deployment.routes).forEach(function (url) {
        var route = activity.payload.deployment.routes[url];
        if (route.id === id) {
            route.url = url;
            found = route;
        }
    });

    if (found) {
        return found;
    }
    throw new Error("No such route id found: " + id);
}
```

## Slack

The following example activity script will post a message to a Slack channel every time it is triggered.

To use it, paste it as-is into a `.js` file and then add it as a new integration.  Be sure to specify which events it should trigger on using the `--events` switch, and if desired which `--environments` you want.

Second, create a new Slack webhook through your Slack administrative interface.  See the [Slack documentation](https://api.slack.com/messaging) for how to do so.  At the end you will be given a URL that points to `https://hooks.slack.com/...`.

Third, add that URL to your project as a [variable](/development/variables.md) named `SLACK_URL`.

Now, any activities that meet the events/environment criteria you specified will get reported to Slack.

Once you have it working, you're free to modify the code below as desired.  See the [Slack messaging documentation](https://api.slack.com/messaging/composing/layouts) for how to format more complex messages.

```javascript
/**
 * Sends a color-coded formatted message to Slack.
 *
 * You must first configure a Platform.sh variable named "SLACK_URL".
 * That is the group and channel to which the message will be sent.
 *
 * To control what events it will run on, use the --events switch in
 * the Platform.sh CLI.
 *
 * @param {string} title
 *   The title of the message block to send.
 * @param {string} message
 *   The message body to send.
 */
function sendSlackMessage(title, message) {

    console.log((new Date).getDay());

    if ((new Date).getDay() === 5) {
        message += "\r\nOn a Friday! :calendar:";
    }

    var color = activity.result === 'success'
        ? '#66c000'
        : '#ff0000';

    var body = {
        'attachments': [{
            "title": title,
            "text": message,
            "color": color,
        }],
    };

    var url = variables()['SLACK_URL'];

    if (!url) {
        throw new Error('You must define a SLACK_URL project variable.');
    }

    var resp = fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        console.log("Sending slack message failed: " + resp.body.text());
    }
}

function variables() {
    var vars = {};
    activity.payload.deployment.variables.forEach(function(variable) {
        vars[variable.name] = variable.value;
    });

    return vars;
}

sendSlackMessage(activity.text, activity.log);
```

Common properties you may want to send to Slack (in the last line of the script) include:

* `activity.text`: A brief, one-line statement of what happened.
* `activity.log`: The complete build and deploy log output, as it would be seen in the Management Console log screen.
