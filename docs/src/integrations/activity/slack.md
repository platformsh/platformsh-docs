---
title: "Example: Slack"
sidebarTitle: "Example: Slack"
toc: false
---

The following example activity script posts a message to a Slack channel every time it's triggered.

To use it, follow these steps:

1. Paste the code below into a `.js` file.
2. Add it as a new [script integration](./_index.md#installing).

   Specify which events should trigger it using the `--events` flag.
   Optionally specify environments with the `--environments` flag.
3. Create a new Slack webhook In your Slack administrative interface, [create a new Slack webhook](https://api.slack.com/messaging/webhooks).
   You get a URL starting with `https://hooks.slack.com/`.
4. Add that URL to your project as a [variable](../../development/variables/_index.md) named `SLACK_URL`.

   The variable can't be set as sensitive.
   Sensitive variables aren't currently included in activity script payload.

   Note the variable isn't added to the environment as a ["top-level" environment variable](https://docs.platform.sh/development/variables.html#top-level-environment-variables).
   If you set this variable as `env:SLACK_URL`, update the script accordingly (`const url = ENV_VARIABLES["env:SLACK_URL"];`).

Now, any activities that meet the events/environment criteria you specified are reported to Slack.

Once you have it working, you're free to modify the code below as desired.
For formatting more complex messages, see the [Slack messaging documentation](https://api.slack.com/messaging/composing/layouts).

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
* `activity.log`: The complete build and deploy log output, as it would be seen in the Console log screen.
