# GlueScript

GlueScript is a tool for responding to activities in Platform.sh projects and environments, such as branching, merging, synchronizing, activating, deactivating. You can write GlueScript code that runs in the Platform.sh [foundation/coordinator/git ... where does it run?], and is able to respond to these activities and take actions in response. 

GlueScript is powered by a [lightweight JavaScript engine](https://github.com/damz/otto/), and has runtime access to objects representing your Project and Environment. 

Uses for GlueScript include:
* Triggering activities on Platform.sh in response to other activites, e.g. trigger a snapshot before merging
* Calling external webservices, e.g. calling external testing tools, or sending notifications via Slack
* Dynamically provisioning API Keys

GlueScript is stored in the state of your Project [CONFIRM THIS] and you deploy it by POSTing it via the Platform.sh [Integrations API](https://api.platform.sh/docs/#tag/Third-Party-Integrations). There is a CLI command for this as well:

```bash
platform integration:add --type script --file ./my_glue_script.js
```

> **CAVEATS**: This is an *Alpha release*, and while the JavaScript API itself will be relatively stable, the script management will undoubtedly change. Currently, errors are silent so this is not for the faint-of-heart. This is not a full-blown JavaScript runtime, and you can't use NPM or import libraries.

GlueScript comes with helper APIs that make it very useful. You can currently access the following APIs: [Project](#project-api), [Activity](#activity-api), [Process](#process-api), [Storage](#storage-api), [Fetch](#fetch-api) and [Crypto](#crypto-api) [these anchors don't work]

# Setting up a GlueScript integration

## 1. Write the script

Create a new `scripts` folder within the `.platform/` folder.

```bash
mkdir .platform/scripts
```

> Putting the script in this location is not a requirement, but it is a good practice, and following this pattern will be more forward-compatible.
>
> GlueScript scripts currently do not "live in Git". They are project wide, and don't belong to a specific branch. But it is a good practice to consider that whatever you put there in your `master` branch will be what will have been posted to the API. Later we will introduce a more robust management mechanism.

#### Example: Custom Slack integration

For example, a GlueScript can perform a custom Slack integration as follows:

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

You can save the file to `.platform/scripts/my_glue_script.js` for example.

### 2. Commit the script

Commit the script to Git:

```bash
git add .platform/scripts/my_glue_script.js
git commit -m "Committing the GlueScript file."
git push platform master
```

where:
* `my_glue_script.js` is the name of your Javascript file

> Pushing the script to master won't do anything. Yet. Just a handy place to keep your GlueScript file.

### 3. Enable the integration

Enable the GlueScript integration as follows (you need to have the Platform.sh CLI installed):

```bash
platform integration:add --type script --file .platform/scripts/my_glue_script.js
```

where:
* `my_glue_script.js` is the name of your Javascript file

> **note**
> This is the actual activation of the integration, the script is posted to the API through the CLI. Note that changing the file in Git will not change the integration. To update the integration you will need to use the CLI again.
>
> The GlueScript integration can only be managed by the project admin.

# GlueScript APIs

These are the internal Platform.sh APIs that are accessible through GlueScript, API calls are executed with the permissions of the user that created the integration.

## Project API

The project API gives you everything you need to know about the project in the context of which the GlueScript is running. 

For example: `project.environments.master` will give you access to the metadata of the master environment of the current project.

The API starts at `api.project` and is based on a one resource == one object model.

### Properties

The properties of the resource can be access directly on the object, like:

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

The activity API accessed through `activity` gives you all the metadata about the current activity that invoked the Gluescript. The schema is the same as the one for Webhooks, documented here: https://docs.platform.sh/administration/integrations/webhooks.html

## Process API
The Process API gives you access to the environment in the context of which the GlueScript is running .. such as to Environment Variables.

For example:

`process.env.FOO` will give you access to the `FOO` environment variable, this is a great place to access API keys... or other secrets.

## Storage API

A storage API is offered for integrations to store information between calls. E.g. if you want to be able to edit a previous slack message. The storage is scoped per integration.

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

The Fetch API allows you to do HTTP calls to external services. This implements a limited, synchronous version of the Fetch API with a hardcoded timeout of 30s, for example:

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

We provide a minimal set of Crypto APIs to enable you to do signed requests as many APIs will require you to sign things with an HMAC.

### crypto.createHmac(): create an HMAC signature

This allows you to create a secure hash and output a digest.

```javascript
var h = crypto.createHmac("sha256", "foo"); 
h.update("bar"); 
h.digest("hex")
```

* You can use `'sha256'`, `'sha1'` and `'md5'` as hashing functions.
* The digest can be `'base64'`, `'hex'` or `''` (empty) and empty digest will yield a byte string.

For example if you wanted to call an AWS API here is how you would calculate the signature:

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



