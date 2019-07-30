# GlueScript

Gluescript is powered by  a lightweight JavaScript engine that allows you to run  a script on any activity within Platform.sh. This opens a whole world of new automation use-cases including, but not limited to calling external web services.

This is an **Alpha release**, and while the JavaScript API itself will be relatively stable, the script management will undoubtedly change. 

Scripts are deployed by POSTing a `.js` file to our REST API to create the integration. 

> **CAVEATS**: Currently errors are silent so this is not for the faint-of-heart. This is not a full-blown JavaScript runtime, and you can't use NPM or import libraries.

## Exposed Javascript APIS

[there are helpers, what helpers?]

## Project API

The project API gives you everything you need to know about the project in the context of which the Gluescript is running. 

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
See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch for general information about fetch.


## Crypto API

Many APIs will require you to sign things with HMAC. We have you covered.

### crypto.createHmac(): create an HMAC signature

This allows you to create a secure hash and output a digest.

```javascript
var h = crypto.createHmac("sha256", "foo"); 
h.update("bar"); 
h.digest("hex")
```

* You can use `'sha256'`, `'sha1'` and `'md5'` as hashing functiopns.
* The digest can be `'base64'`, `'hex'` or `''` (empty) and empty digest will yield a byte string.

For example if you wanted to call an AWS API here is how you would calculate the signature:

```Javascript
const awsTest = `
function HMAC(key, value) {
  var h = crypto.createHmac("sha256", key);
  h.update(value);
  return h.digest();
}

var kSecret = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY";
HMAC(HMAC(HMAC(HMAC("AWS4" + kSecret,"20150830"),"us-east-1"),"iam"),"aws4_request");
```

> Example taken from  https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html


# Setup

## 1. Write the script

Create a new `scripts` folder within the `.platform/` folder.

```bash
mkdir .platform/scripts
```

Create a new JavaScript file inside the `scripts` folder with the following content:

```javascript
{
  "type": "script",
  "script": "<CODE>"
}
```

where:
* `CODE` is the JavaScript code of the integration

#### Custom Slack integration

For example, the GlueScript can perform a custom Slack integration as follow:

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

### 2. Commit the script

Commit the script to Git:

```bash
git add .platform/scripts/SCRIPT.js
git commit -m "Committing the GlueScript file."
git push platform master
```

where:
* `SCRIPT` is the name of your Javascript file

### 3. Enable the integration

Enable the GlueScript integration as follows (you need to have the Platform.sh CLI installed):

```bash
platform integration:add --type script --file .platform/scripts/SCRIPT.js
```

where:
* `SCRIPT` is the name of your Javascript file

> **note**
>
> The GlueScript integration can only be managed by the project admin.
