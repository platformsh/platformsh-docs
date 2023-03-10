---
title: Automate your dependency updates
sidebarTitle: Automated dependency updates
description: Learn how to automate your dependency updates through a source operation. You can even trigger your dependency updates automatically using crons.
tier:
  - Elite
  - Enterprise
---

Platform.sh allows you to run automated code updates through [source operations](../create-apps/source-operations.md).

For example, you can set up a source operation to run dependency updates on your project. 
You can then trigger the source operation and therefore your dependency updates automatically using a cron job.

To get notified of every dependency update,
set up an [activity script](#notifications-through-an-activity-script) or a [webhook](#notifications-through-a-webhook).

## Before you start

You need:

- The [Platform.sh CLI](../administration/cli/_index.md)
- An [API token](../administration/cli/api-tokens.md) to authenticate the CLI
  and run a cron job in your app container

## 1. Update your dependencies using a source operation

To facilitate dependency updates in your project,
set up a source operation in your [application file](../create-apps/_index.md#a-minimal-application)
depending on your dependency manager:

{{< codetabs >}}

+++
title=Composer
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                composer update
                git add composer.lock
                git commit -m --allow-empty "Update Composer dependencies"
```

<--->

+++
title=npm
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                npm update
                git add package.json package-lock.json 
                git commit -m --allow-empty "Update npm dependencies"
```

<--->

+++
title=Yarn
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                yarn upgrade
                git add yarn.lock
                git commit -m --allow-empty "Update yarn dependencies"
```

<--->

+++
title=Go
+++

```yaml
source:
    operations:
        update:
            command: |
                set -e
                go get -u
                go mod tidy
                git add go.mod go.sum
                git commit -m --allow-empty "Update Go dependencies"
```

<--->

+++
title=Pipenv
+++

```bash
source:
    operations:
        update:
            command: |
                set -e
                pipenv update
                git add Pipfile Pipfile.lock
                git commit -m --allow-empty "Update Pipenv dependencies"
````

<--->

+++
title=Pipenv
+++

```bash
source:
    operations:
        update:
            command: |
                set -e
                poetry update
                git add pyproject.toml poetry.lock
                git commit -m --allow-empty "Update Poetry dependencies"
````

<--->

+++
title=Bundler
+++

```bash
source:
    operations:
        update:
            command: |
                set -e
                bundle update --all
                git add Gemfile Gemfile.lock
                git commit -m --allow-empty "Update Ruby dependencies"
```

{{< /codetabs >}}

{{< note >}}

- **Pipenv:** The Pipenv example above assumes [`pipenv` is installed as a build dependency](https://docs.platform.sh/languages/python/dependencies.html#pipenv).
- **Poetry:** The Poetry example above assumes [Poetry is installed with an external script](https://docs.platform.sh/languages/python/dependencies.html#poetry).

{{< /note >}}

## 2. Run your dependency updates automatically with a cron job

After you've set up a source operation to [run dependency updates on your project](#1-update-your-dependencies-using-a-source-operation),
you can [automate it using a cron job](../create-apps/source-operations.md#automated-source-operations-using-a-cron-job).

Make sure you have the [Platform.sh CLI](../administration/cli/_index.md) installed
and [an API token](../administration/cli/api-tokens.md)
so you can run a cron job in your app container.
You can then add a cron job to run your source operation once a day.

Note that it’s best not to run source operations on your production environment,
but rather on a dedicated environment where you can test changes and handle conflicts.
In the example below, a dedicated `update-dependencies` development environment has been
set aside for this task.

To set up a cron job to automatically update your dependencies once a day,
use a configuration similar to the following:

```yaml {location=".platform.app.yaml"}
crons:
   update:
       # Run the 'update' source operation every day at midnight.
       spec: '0 0 * * *'
       commands:
           start: |
               set -e
               if [ "$PLATFORM_BRANCH" = update-dependencies ]; then
                   platform environment:sync code data --no-wait --yes
                   platform source-operation:run update --no-wait --yes
               fi
```

## 3. Optional: Set up notifications about dependency updates

To get notified every time a source operation is triggered
and therefore every time a dependency is updated,
you can set up [activity scripts](../integrations/activity/_index.md)
or [webhooks](../integrations/activity/webhooks.md).

### Notifications through an activity script

After you've set up a source operation to [run dependency updates on your project](#1-update-your-dependencies-using-a-source-operation),
you can set up an [activity script](../integrations/activity/_index.md) 
to receive notifications every time a dependency update is triggered.

{{< note title="Example" >}}

You want to get notified of every dependency update
through a message posted on a Slack channel.
To do so, follow these steps:

1.  Add the following code to a `.js` file:

    ```javascript
    /**
     * Sends a color-coded formatted message to Slack.
     *
     * To control what events trigger it, use the --events switch in
     * the Platform.sh CLI.
     *
     * Replace SLACK_URL in the following script with your webhook URL:
     * https://api.slack.com/messaging/webhooks 
     * 
     * activity.text: a brief, one-line statement of what happened.
     * activity.log: the complete build and deploy log output, as it would be seen in the Console log screen.
     */
    function sendSlackMessage(title, message) {
      const url = SLACK_URL;

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

2.  To add the `.js` script above as a [new script integration](../integrations/activity/_index.md#installing),
    run the following [Platform.sh CLI](../administration/cli/_index.md) command:

    ```bash
    platform integration:add --type script --file ./my_script.js --events=environment.source-operation
    ```
    Optional: to only get notifications about specific environments,
    add the following flag to the command: `--environments=your_environment_name`.

Anytime a dependency is updated via a source operation,
the activity script now reports it to Slack. 

{{< /note >}}

## Notifications through a webhook

After you've set up a source operation to [run dependency updates on your project](#1-update-your-dependencies-using-a-source-operation),
you can set up a [webhook](../integrations/activity/_index.md) 
to receive notifications every time a dependency update is triggered.

[Webhooks](../integrations/activity/webhooks.md) allow you to host a script yourself externally.
This script receives the same payload as an [activity script](../integrations/activity/_index.md)
and responds to the same events,
but can be hosted on your own server and in your own language.

To set up the integration between your webhook and your source operation,
run the following [Platform.sh CLI](../administration/cli/_index.md) command:

```bash
platform integration:add --type=webhook --url=URL_TO_RECEIVE_JSON --events=environment.source-operation
```

Optional: to only get notifications about specific environments,
add the following flag to the command: `--environments=your_environment_name`.

To test the integration,
you can generate a URL from a service such as `webhook.site`
and use the generated URL as `URL_TO_RECEIVE_JSON`.

Anytime a dependency is updated via a source operation,
the webhook now receives a POST message.
This POST message contains complete information about the entire state of the project at that time.