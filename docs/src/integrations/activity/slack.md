---
title: "Example: Slack"
sidebarTitle: "Example: Slack"
toc: false
---

The following example activity script will post a message to a Slack channel every time it is triggered.

To use it, paste it as-is into a `.js` file and then add it as a new [script integration](/integrations/activity/_index.md#installing).  Be sure to specify which events it should trigger on using the `--events` switch, and if desired which `--environments` you want.

Second, create a new Slack webhook through your Slack administrative interface.  See the [Slack documentation](https://api.slack.com/messaging) for how to do so.  At the end you will be given a URL that points to `https://hooks.slack.com/...`.

Third, add that URL to your project as a [variable](../../development/variables/_index.md) named `SLACK_URL`.

Now, any activities that meet the events/environment criteria you specified will get reported to Slack.

Once you have it working, you're free to modify the code below as desired.  See the [Slack messaging documentation](https://api.slack.com/messaging/composing/layouts) for how to format more complex messages.

{{< note >}}
Uploading the snippet below will work out-of-the-box, given two assumptions:

1. The project-level variable `SLACK_URL` is not set as a ["top-level" environment variable](https://docs.platform.sh/development/variables.html#top-level-environment-variables). That is, it does not include the prefix `env:`. If you do set this variable as `env:SLACK_URL`, you will need to update the snippet accordingly (i.e. `const url = ENV_VARIABLES["env:SLACK_URL"];`).
2. This script will only work if the webhook URL for your Slack workspace and channel is _not_ a sensitive variable. Sensitive variables are not included in the `activity.payload.deployment.variables` object at this time. 
{{< /note >}}

```javascript
function getEnvironmentVariables() {
  return activity.payload.deployment.variables.reduce(
    (vars, { name, value }) => ({
      ...vars,
      [name]: value,
    }),
    {}
  );
}

const ENV_VARIABLES = getEnvironmentVariables();

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
  const url = ENV_VARIABLES.SLACK_URL;

  if (!url) {
    throw new Error("You must define a SLACK_URL project variable.");
  }

  const messageTitle =
    title + (new Date().getDay() === 5) ? " (On a Friday! :calendar:)" : "";

  const color = activity.result === "success" ? "#66c000" : "#ff0000";

  const body = {
    attachments: [
      {
        title: messageTitle,
        text: message,
        color: color,
      },
    ],
  };

  const resp = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    console.log("Sending slack message failed: " + resp.body.text());
  }
}

sendSlackMessage(activity.text, activity.log);
```

Common properties you may want to send to Slack (in the last line of the script) include:

* `activity.text`: A brief, one-line statement of what happened.
* `activity.log`: The complete build and deploy log output, as it would be seen in the Management Console log screen.
