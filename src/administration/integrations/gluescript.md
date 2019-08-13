# GlueScript

GlueScript is a tool for responding to activities in Platform.sh projects, such as creating or merging branches, synchronizing data with parent environments, or activating new environments. You can write code that is triggered by these activities and takes action in response. 

GlueScript is powered by a [lightweight JavaScript engine](https://github.com/damz/otto/), and has runtime access to objects representing your Project and Environment. 

Uses for GlueScript include:
* Triggering activities on Platform.sh in response to other activites, e.g. trigger a snapshot before merging
* Calling external webservices, e.g. calling external testing tools, or sending notifications via Slack
* Dynamically provisioning API Keys

GlueScript is stored in the state of your Project, and you deploy it by POSTing it via the Platform.sh [Integrations API](https://api.platform.sh/docs/#tag/Third-Party-Integrations). There is a CLI command for this as well:

```bash
platform integration:add --type script --file ./my_glue_script.js
```

> **CAVEATS**: This is an *Alpha release*, and while the JavaScript API itself will be relatively stable, the script management will undoubtedly change. Currently, errors are silent so this is not for the faint-of-heart. GlueScript uses an ES5-compatible implementation of JavaScript, but it is limited in scope and shouldn't be used as a feature-complete JavaScript engine. For example, it cannot import NPM packages or other external libraries. Be sure to keep each script tightly focused on accomplishing a specific action.

GlueScript comes with helper APIs that make it very useful. The following APIs are currently available: [Project](#project-api), [Activity](#activity-api), [Process](#process-api), [Storage](#storage-api), [Fetch](#fetch-api) and [Crypto](#crypto-api).

# Setting up a GlueScript integration

## 1. Write the script

Create a new `scripts` directory within the `.platform/` directory of your project repository.

```bash
mkdir .platform/scripts
```

Putting the script in this location is not a requirement, but it is a good practice, and following this pattern will be more forward-compatible.

> Scripts used by the GlueScript integration currently do not "live in Git." They can be triggered by activities that occur on any branch, including branches that existed before any scripts were added to the project. **Always remember that the most recent version of the script that you have POSTed to the API will be the script that is used by all branches in a project.** In future iterations of this integration, we will introduce a more robust management mechanism.

#### Example: Custom Slack integration

Here is a step-by-step tutorial for setting up a custom Slack integration using GlueScript. This is only one of many possible use cases of this tool.

```javascript
var message = activity.text;
var color;
if (Date.getDay()==6) {
    message = message + "\r\nOn a Friday!";
}

if (activity.state == 'complete') {
  if (activity.result == 'success') {
    color = '#66c000';
  } else {
    color = '#ff0000';
  }
}

var resp = fetch(
  '<SLACK_PAYLOAD_URL>',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'attachments': [{
        'fallback': message,
        'color': color,
        'fields': [{
          'value': message,
        }],
      }],
    }),
  }
);

if (!resp.ok) { throw 'Failed'; }
```

This short example will post a message to a slack channel, on any activity on the Platform.sh project, and will append "On a Friday!", when it happens on Fridays.

where:
* `SLACK_PAYLOAD_URL` is the URL provided by Slack for your custom webhook

You can save the file to `.platform/scripts/my_glue_script.js`, for example.

### 2. Commit the script

Commit the script to Git:

```bash
git add .platform/scripts/my_glue_script.js
git commit -m "Committing the GlueScript file."
git push platform master
```

where:
* `my_glue_script.js` is the name of your JavaScript file

> Remember that adding the script to your repository will have no effect on the integration at this time. However, it is still good practice to commit this code change to your repository so that versions can be tracked and any other developers contributing to this project have access to the file as well.

### 3. Enable the integration

You can now use the [Platform.sh CLI](https://docs.platform.sh/development/cli.html) to enable the GlueScript integration:

```bash
platform integration:add --type script --file .platform/scripts/my_glue_script.js
```

where:
* `my_glue_script.js` is the name of your Javascript file

> **note**
> The above CLI command activates the GlueScript integration for your project, and the specified file is added to your project through our integrations API. At this time, committing file changes to Git will not affect the script that is run by the integration; **the integration always uses the last version of the script that was POSTed to the integrations API.**
>
> The GlueScript integration can only be managed by the project admin.

# GlueScript APIs

These are the Platform.sh APIs that are made available to scripts run by the GlueScript integration. All API calls are executed with the same user permissions as the use that added the integration.

## Project API

The Project API provides an interface to the metadata and actions of the project running the script. 

For example: `project.environments.master` gives you a resource object representing the metadata of the `master` environment of the current project.

The API provided by the GlueScript integration represents each project resource (or sub-resource) as a single object.

### Properties

The metadata properties of a resource object can be accessed directly:

```javascript
project.owner
```

### Sub-objects

Sub-objects can be accessed directly on the object, like:

```javascript
project.settings
```

### Collections

Resources that are collections support iteration:

```javascript
project.environments.forEach(function(env) {
  console.log(env.name);
});
```

They also support direct access to an element:

```javascript
project.environments["master"].name
```

### Actions

Resource actions are accessible as methods on the object:

```javascript
project.environments["master"].branch({
  title="Test",
  name="test",
})
```

## Activity API

The Activity API provides an interface to the metadata and actions of the activity that invoked the script. The schema is the [same as the one for Webhooks](https://docs.platform.sh/administration/integrations/webhooks.html).

## Process API
The `process` resource gives you access to the environment in the context of which the GlueScript is running, such as to Environment Variables.

For example:

`process.env.FOO` will give you access to the `FOO` environment variable, this is a great place to access API keys... or other secrets.

## Storage API

A Storage API is offered for each script run by the integration to store information between calls. The storage is scoped per script.

### `storage.get(key)`: Get a key from the storage

 * `key` (string): The key to get

Returns `null` if the key doesn't exist.

### `storage.set(key, value)`: Create or update a key into the storage

 * `key` (string): The key to set
 * `value` (string): The value to set, must be a string (will not be cast)

### `storage.remove(key)`: Remove a key from the storage

 * `key` (string): The key to remove

No-op if the key doesn't exist

### `storage.clear()`: Clear the storage

## Fetch API

### fetch(): launch an HTTP request

The Fetch API allows you to map HTTP calls to external services. This implements a limited, synchronous version of the Fetch API with a hardcoded timeout of 30s.

```javascript
var resp = fetch(
  "http://example.com/",
  {
    method: "POST",
    body: JSON.stringify({
        "test": "toto",
    }),
  }
)

if (!resp.ok) {
    throw "unable to fetch";
}
```

For more information see this [Mozilla developer network article on Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).


## Crypto API

The GlueScript integration provides a minimal set of crypto APIs that you can use to sign requests. This is useful because many external APIs will require you to sign requests with an HMAC.

### crypto.createHmac(): create an HMAC signature

This allows you to create a secure hash and output a digest.

```javascript
var h = crypto.createHmac("sha256", "foo"); 
h.update("bar"); 
h.digest("hex")
```

* You can use `'sha256'`, `'sha1'` and `'md5'` as hashing functions.
* The digest can be `'base64'`, `'hex'` or `''` (empty) and empty digest will yield a byte string.

For example, if you wanted to call an AWS API, here is how you would calculate the signature:

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



