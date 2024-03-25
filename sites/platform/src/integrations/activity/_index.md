---
title: "Activity scripts"
weight: -5
description: |
  {{% vendor/name %}} supports custom scripts that can fire in response to any activity. These scripts allow you to take arbitrary actions in response to actions in your project, such as when it deploys, when a new branch is created, etc.
layout: single
---

{{% description %}}

Check out examples from other users on the {{% vendor/name %}} [Community site](https://community.platform.sh/c/activity-scripts/10).

## Installing

Activity scripts are configured as integrations.
That means they're at the *project level*, not at the level of an individual environment.
While you can store the scripts in your Git repository for access, they have no effect there.

To install a new activity script, use [`integration:add` command](/administration/cli/reference.md#integrationadd) from the [{{% vendor/name %}} CLI](/administration/cli/_index.md).

```bash
{{% vendor/cli %}} integration:add --type script --file ./my_script.js
```

That installs and enables the `my_script.js` file as an activity script on the current project.

Don't run the `integration:add` command a second time,
or it installs a second integration with the same code.

## Updating

To update an existing activity script, follow these steps:

1. Get the activity script's ID by running the following command:

   ```bash
   {{% vendor/cli %}} integrations
   ```

   This returns something like the following:

   ```bash
   +---------------+--------------+--------------+
   | ID            | Type         | Summary      |
   +---------------+--------------+--------------+
   | nadbowmhd67do | script       | ...          |
   | rcqf6b69jdcx6 | health.email | From:        |
   |               |              | To: #admins  |
   +---------------+--------------+--------------+
   ```

2. Update the integration by running the following command:

   ```bash
   {{% vendor/cli %}} integration:update --file ./my_script.js {{<variable "SCRIPT_ID" >}}
   ```

   This [`integration:update` command](/administration/cli/reference.md#integrationupdate) updates the integration in place, permanently overwriting the previous version.

3. Test the activity script update by [triggering a redeployment](/administration/cli/reference.md#environmentredeploy) with the following command:

   ```bash
   {{% vendor/cli %}} redeploy
   ```

## Removing

To disable an activity script, follow these steps:

1. Get the activity script's ID by running the following command:

   ```bash
   {{% vendor/cli %}} integrations
   ```

   This returns something like the following:

   ```bash
   +---------------+--------------+--------------+
   | ID            | Type         | Summary      |
   +---------------+--------------+--------------+
   | nadbowmhd67do | script       | ...          |
   | rcqf6b69jdcx6 | health.email | From:        |
   |               |              | To: #admins  |
   +---------------+--------------+--------------+
   ```

2. [Delete the integration](/administration/cli/reference.md#integrationdelete) by running the following command:

   ```bash
   {{% vendor/cli %}} integration:delete {{<variable "SCRIPT_ID" >}}
   ```

## Debugging

Get activity logs by running the following command:

```bash
{{% vendor/cli %}} integration:activities
```

Every time your activity script runs it generates a new log entry, including the output from the script.
Any output produced by `console.log` is available in the activity log, which is the recommended way to debug scripts.

See the [activity log](../overview.md#debug-integrations) documentation for further details.

To get a more readable output of a variable you're trying to debug, you can make `JSON.stringify` use human-friendly formatting.

```javascript
console.log(JSON.stringify(project, null, 2));
```

## Configuring scripts

There are many types of activity to which a script could respond.
By default, it will activate only after a successful `git push` operation.
That trigger is configurable via command line switches when adding or updating a script.

For example, to have a script trigger any time an environment is activated or deactivated, run:

```bash
{{% vendor/cli %}} integration:update --events='environment.activate,environment.deactivate' {{<variable "SCRIPT_ID" >}}
```

A complete list of possible events is available in the [Activity script type documentation](/integrations/activity/reference.md#type).
Any of those Activity Script types can be added to the `--events=event1,event2,...` option.

Scripts can also trigger only when an action reaches a [given state](/integrations/activity/reference.md#state), such as `pending`, `in_progress`, `complete`, `cancelled`, or `scheduled`.
The default is only when they reach `complete`.
To have a script execute when a synchronize action first starts, for example, you would run:

```bash
{{% vendor/cli %}} integration:update --events=environment.synchronize --states=in_progress {{<variable "SCRIPT_ID" >}}
```

It's also possible to restrict scripts to certain environments by name.
Most commonly, that's used to have them execute only for your production environment or for all other environments.

The following example executes only for backup actions on the `production` environment:

```bash
{{% vendor/cli %}} integration:update --events=environment.backup --environments=production {{<variable "SCRIPT_ID" >}}
```

As a general rule, it's better to have an activity script only execute on the specific events and branches you're interested in
rather than firing on all activities and then filtering out undesired use cases in the script itself.

## Activity script variables

Some activities don't have access to [project and environment variables](/development/variables/_index.md#variable-types).
In this case, to avoid hardcoding sensitive variables (such as API tokens) and therefore prevent security breaches,
add a variable to your activity script.

You can add activity script variables through the {{% vendor/name %}} CLI.
Activity script variables are only visible in the activity script itself,
inside the `variables` variable.

### Add an activity script variable

To add a variable to your activity script at the integration level,
use the following `POST` request:

```bash
POST /api/projects/{{< variable "PROJECT_ID" >}}/integrations/{{< variable "INTEGRATION_ID" >}}/variables
```

You get a payload similar to the following:

```json
{
  "name": "string",
  "attributes": {
    "property1": "string",
    "property2": "string"
  },
  "value": "string",
  "is_json": true,
  "is_sensitive": true
}
```

### Delete or patch an activity script variable

To delete an activity script variable,
use the following `DELETE` request:

```
DELETE /api/projects/{{< variable "PROJECT_ID" >}}/integrations/{{< variable "INTEGRATION_ID" >}}/variables
```

You can also patch your activity script variable.
To do so, send the same request using the `PATCH` method instead of the `DELETE` one.

### List an activity script variable

To list all your activity script variables at the integration level,
use the following `GET` request:

```
GET /api/projects/{{< variable "PROJECT_ID" >}}/integrations/{{< variable "INTEGRATION_ID" >}}/variables
```

## Available APIs

Activity scripts can be written in ES2021 and don't support installing additional packages.
There are a series of [utility functions you can reuse](./utility.md)
as well as the following libraries, APIs, and global variables to facilitate building out custom functionality.

### `underscore.js`

[`Underscore.js`](https://github.com/jashkenas/underscore) is available out-of-the-box to make writing Activity scripts more pleasant.
See [Underscore's documentation](https://underscorejs.org/) for available functions and utilities.

### `activity`

Every activity script has a global variable `activity` that contains detailed information about the activity,
including embedded, JSON-ified versions of the routes configuration and relevant `{{< vendor/configfile "app" >}}` files.
The `activity` variable is the same as the [webhook payload](/integrations/activity/webhooks.md).
See the documentation there for details and a complete example.

Several of the utility functions below work by pulling out common portions of the `activity` object.

### `project`

The `project` global variable includes information about the project subscription itself.
That includes its ID and name, how many users are associated with the project, its SSH public key, and various other values.
An example of this object is below:

```json
{
  "attributes": {},
  "created_at": "2024-03-15T19:50:09.514267+00:00",
  "default_domain": null,
  "description": "",
  "id": "azertyuiopqsdfghjklm",
  "owner": "...",
  "region": "eu-1.{{< vendor/urlraw "host" >}}",
  "repository": {
    "client_ssh_key": "ssh-rsa ...",
    "url": "azertyuiopqsdfghjklm@git.eu-1.{{< vendor/urlraw "host" >}}:kqyhl5f5nuzky.git"
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

Activity scripts have access to a limited key/value storage API to persist values from one execution to another.
The API is similar to the JavaScript `LocalStorage` API.

```javascript
// Access the storage API.
// It isn't pre-required.
var storage = require("storage");

// Retrieve a stored value. If the value isn't set it will return null.
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

Activity scripts support a modified version of the browser "Fetch API" for issuing HTTP requests.
Unlike the typical browser version, however, they only support synchronous requests.
That means the return value of `fetch()` is a `Response`, not a `Promise` for one.
The returned `Response` is also a bit different: only the `ok`, `status` and `statusText` properties
as well as the `text` and `json` methods are available.
Note that because of the synchronous nature of our `fetch` implementation,
the `Response.text` and `Response.json` methods are also synchronous,
so they directly return a `string` and an `object`, respectively.
The API is otherwise essentially the same as that [in the MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

For instance, this example sends a GET request every time it executes:

```javascript
var resp = fetch("http://example.com/site-deployed");

// The fetch call above being synchronous, we can directly access resp properties.
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
} else {
  // resp.json() is synchronous so this will log an object, not `Promise { <pending> }`
  console.log(resp.json());
}
```

For more `fetch()` options, see the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

### Cryptographic API

A minimalist cryptographic API is also available to activity scripts.
Its main use is for signing requests to 3rd party APIs.

The `crypto.createHmac()` function allows you to create a secure HMAC hash and digest.

```javascript
var h = crypto.createHmac("sha256", "foo");
h.update("bar");
h.digest("hex")
```

* The available hashing functions are `'sha256'`, `'sha1'` and `'md5'` as hashing functions.
* The available digest formats are `'base64'`, `'hex'` or `''` (empty).
An empty digest will yield a byte string.

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
