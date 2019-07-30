# GlueScript

The GlueScript integration allows you to run JavaScript code to make your Platform.sh projects interact with external tools.

## Setup

### 1. Write the script

Create a new `scripts` folder within the `.platform/` folder.

```bash
mkdir .platform/scripts
```

Create a new Javascript file inside the `scripts` folder with the following content:

```javascript
{
  "type": "script",
  "script": "<CODE>"
}
```

where:
* `CODE` is the Javascript code of the integration

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
> The GlueScript integration can only be managed by the project owner.
