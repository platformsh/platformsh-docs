# GlueScript

GlueScript scripts are powered by a lightweight Javascript engine that allows you to run a script on any activity within Platform.sh. This opens a whole world of new automation use-cases including, but not limited to, calling external web services.

This is not a full-blown Javascript runtime, and you can't use NPM or import libraries. Keep it short and sweet.

This is very much an **Alpha release**, and while the Javascript API itself will probably be stable enough, the script management will undoubtedly change. For the moment you would simply post a `.js` file to our REST API to create the integration. 

> **CAVEAT**: Currently errors are silent so this is not for the faint of heart.

While you don't get to have NPM GlueScript comes with a bunch of helpers that make it very useful. You can currently access the following APIs: [Project](#project-api), [Activity](#activity-api), [Process](#process-api), [Storage](#storage-api), [Fetch](#crypto-api) and [Crypto](#crypto-api)

# Setting up a GlueScript integration

## 1. Write the script

Create a new `scripts` folder within the `.platform/` folder.

```bash
mkdir .platform/scripts
```

> This is not a requirement, but it is a good practice, and following this pattern is more forward-compatible
> GlueScript scripts are project wide, and don't belong to a specific branch but it is a good practice to consider that whatever you put there in your master branch will be what will be posted to the API. Later we will introduce a more robust management mechanism.

#### Custom Slack integration

For example, the GlueScript can perform a custom Slack integration as follows:

```javascript
var message = activity.text;
var color;

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

> Pushing the script to master won't do anything. Yet. Just a handy place to keep you GlueScript file.

### 3. Enable the integration

Enable the GlueScript integration as follows (you need to have the Platform.sh CLI installed):

```bash
platform integration:add --type script --file .platform/scripts/my_glue_script.js
```

> This is the actual activation of the integration, the script is posted to the API through the CLI. Note that changing the file in Git will not change the integration. To update the integration you will need to use the CLI again.

where:
* `my_glue_script.js` is the name of your Javascript file

> **note**
>
> The GlueScript integration can only be managed by the project admin.

# GlueScript APIs

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

The activity API accessed through `activity` gives you all the metadata about the current activity that invoked the GlueScript. The schema is the same as the one for Webhooks, documented in the [Webhook section](https://docs.platform.sh/administration/integrations/webhooks.html) of our documentation.

## Process API
The process API gives you access to the environment in which the GlueScript is running, such as to environment variables.

For example:

`process.env.FOO` will give you access to the `FOO` environment variable, this is a great place to access API keys, or other secrets.

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

The fetch API allows you to do HTTP calls to external services. This implements a limited, synchronous version of the Fetch API with a hardcoded timeout of 30s, for example:

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

Many APIs will require you to sign things with HMAC. We have you covered.

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



