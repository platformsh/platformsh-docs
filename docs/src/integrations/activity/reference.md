---
title: "Activity reference"
sidebarTitle: "Activity reference"
weight: -10
description: Reference for the activities
---

Activities are responses to actions in your project, including when you deploy your app or when a new branch is created.

## Activity schema

Any activity has a JSON object linked to it containing all information for that activity such as timestamps, duration, configuration, and much more.
That object can be parsed and reacted to through custom hooks.
These hooks can be used to automate your workflows.

Depending on the activity, the JSON object response differs and not all fields are always available.
This reference contains everything that's needed to get the relevant information out of the activity schema.

For a quick test, see the [webhook setup](./webhooks.md#setup).

### Example response

A shortened example of what a JSON object response can look like for the [sync of an environment](../../other/glossary.md#sync):

``` json
{
  "id": "abcdefg123456",
  ...
  "created_at": "2022-12-16T14:28:17.890467+00:00",
  "updated_at": null,
  "type": "environment.synchronize",
  "parameters": {
    ...
  },
  "project": "abcdefgh1234567",
  "environments": [
    "feature"
  ],
  "state": "complete",
  "result": "success",
  "started_at": "2022-12-16T14:28:18.188888+00:00",
  "completed_at": "2022-12-16T14:31:48.809068+00:00",
  "completion_percent": 100,
  "cancelled_at": null,
  "timings": {
    "wait": 0,
    "build": 0.349,
    "deploy": 209.986,
    "execute": 210.508
  },
  "log": "Building application 'app' (runtime type: php:8.2, tree: 9851a01)\n  Reusing existing build for this tree ID\n\nProvisioning certificates\n  Certificates\n  - certificate 5684968: expiring on 2023-03-15 13:25:28+00:00, covering {,www}.feature-abcd123-abcdefgh1234567.eu.platformsh.site\n\n\nRedeploying environment test, as a clone of main\n  Taking a temporary backup of the parent environment\n  Preparing to restore from a temporary backup\n  Preparing deployment\n  Closing all services\n  Opening application app and its relationships\n  Executing deploy hook for application app\n    hello world\n\n  Opening environment\n  Deleting temporary backups (1)\n  Environment configuration\n    app (type: php:8.0, size: S, disk: 2048)\n\n  Environment routes\n    http://feature-abcd123-abcdefgh1234567.eu.platformsh.site/ redirects to https://feature-abcd123-abcdefgh1234567.eu.platformsh.site/\n    http://www.feature-abcd123-abcdefgh1234567.eu.platformsh.site/ redirects to https://www.feature-abcd123-abcdefgh1234567.eu.platformsh.site/\n    https://feature-abcd123-abcdefgh1234567.eu.platformsh.site/ is served by application `app`\n    https://www.feature-abcd123-abcdefgh1234567.eu.platformsh.site/ redirects to https://feature-abcd123-abcdefgh1234567.eu.platformsh.site/\n",
  "payload": {
    ...
  },
  "description": "<user data-id=\"abcdefghijk123456789\">Cloé Weber</user> synchronized <environment data-id=\"test\">test</environment>'s <strong>data</strong> from <environment data-id=\"main\">Main</environment>",
  "text": "Cloé Weber synchronized test's **data** from Main",
  "expires_at": "2023-12-16T14:28:17.890467+00:00"
}
```

### `id`

A unique `id` value to identify the activity itself.

### `*_at`

The `created_at`, `started_at`, `updated_at`, `cancelled_at`, `completed_at`, `expires_at` properties are all timestamps in UTC.
If you need only a point in time when the action happened, use `completed_at`.
You can also combine it with `started_at` to see how long the activity itself took.
See also `timings` for more time computation.

### `parameters`

The parameters include detailed information regarding which user ID triggered the activity, the environment impacted, commands run with crons, or if changes in the codebase happened the ID of the git commits.
The response changes based on the activity.

### `project`

The ID of the project in which the activity took place.
Use the `project` value if you want to have multiple projects `POST` to the same URL.

### `type`

The `type` specifies the type of event that happened.
Its value is one of:

- [Project](#project)
- [Environment](#environment)
- [Integration](#integration)

#### `Project`

The project type contains all changes relative to a project.

| Name | Description |
|------|-------------|
| `project.modify.title` | The human-friendly title of the project has been changed. |
| `project.create` | A project has been created. Although it appears in the activity feed exactly once, it's not sent via a webhook as it always happens before a webhook can be configured. |
| `project.variable.create` | A new project variable has been created. |
| `project.variable.delete` | A project variable has been deleted. |
| `project.variable.update` | A project variable has been modified. |

#### `Environment`

The environment type contains all changes relative to a project's environment.

| Name | Description |
|------|-------------|
| `environment.domain.create` | A new domain has been associated with the environment. |
| `environment.domain.delete` | A domain associated with the environment has been removed. |
| `environment.domain.update` | A domain associated with the environment has been updated, such as having its SSL certificate modified. |
| `environment.backup` |  A user triggered a [backup](../../environments/backup.md). |
| `environment.backup.delete` | A user deleted a [backup](../../environments/backup.md) |
| `environment.restore` | A user restored a [backup](../../environments/backup.md). |
| `environment.push` | A user has pushed code to a branch, either existing or new. |
| `environment.branch` | A new branch has been created via the Console. (A branch created via a push shows up as `environment.push`.) |
| `environment.activate` | A branch has been "activated", and an environment created for it. |
| `environment.initialize` | The default branch of the project has just been initialized with its first commit. |
| `environment.deactivate` | A branch has been "deactivated". The code is still there, but the environment was destroyed. |
| `environment.synchronize` | An environment has had its data and/or code re-copied from its parent environment. |
| `environment.merge` | A branch was merged through the Console or Platform.sh API. A basic Git merge doesn't trigger this event. |
| `environment.redeploy` | An environment was redeployed. |
| `environment.delete` | A branch was deleted. |
| `environment.route.create` | A new route has been created through the Console. This doesn't fire for route edits made to the `routes.yaml` file directly. |
| `environment.route.delete` | A route has been deleted through the Console. This doesn't fire for route edits made to the `routes.yaml` file directly. |
| `environment.route.update` | A route has been modified through the Console. This doesn't fire for route edits made to the `routes.yaml` file directly. |
| `environment.variable.create` | A new variable has been created. |
| `environment.variable.delete` | A variable has been deleted. |
| `environment.variable.update` | A variable has been modified. |
| `environment.update.http_access` | HTTP access rules for an environment have been modified. |
| `environment.update.smtp` | Sending of emails has been enabled/disabled for an environment. |
| `environment.update.restrict_robots` | The block-all-robots feature has been enabled/disabled. |
| `environment.subscription.update` | The production environment has been resized because the subscription has changed. There's no content changes. |
| `environment.cron` | A cron task just completed. |
| `environment.source-operation` | A source operation triggered and has completed. |
| `environment.certificate.renewal` | An environment's SSL certificate has been renewed. |

#### `Integration`

The integration type contains all changes relative to a project's integration.

| Name | Description |
|------|-------------|
| `integration.bitbucket.fetch` | Changes in BitBucket repository have been pulled. |
| `integration.bitbucket.register_hooks` | Integration hook have been registered on BitBucket. |
| `integration.bitbucket_server.fetch` | Changes in BitBucket repository have been pulled. |
| `integration.bitbucket_server.register_hooks` | Integration hook have been registered on BitBucket. |
| `integration.github.fetch` | Changes in GitHub repository have been pulled. |
| `integration.gitlab.fetch` | Changes in GitLab repository have been pulled. |
| `integration.health.email` | Health event sent by email. |
| `integration.health.pagerduty` | Health event sent to PagerDuty. |
| `integration.health.slack` | Health event sent to slack. |
| `integration.webhook` | Webhook triggered. |
| `integration.script` | An activity script has run. |

### `environments`

An array listing the `environments` that were involved in the activity.
This is usually single-value.

### `state`

The current state of the activity.
It can be `pending`, `in_progress`, or `complete`.

### `completion_percent`

The completion percentage of the activity.

### `result`

Whether the activity itself completed successfully or not.
It should be `success` if all went as planned.
The result isn't taking into account if your crons executed properly or if the (re)deploy ran successfully.

### `timings`

The amount of time required by the activity.

- `wait`: The time delay if a command is set to wait before beeing executed.
- `build`: The execution time for the build hook.
- `deploy`: The execution time for the deploy hook.
- `execute`: The execution time for your script or your cron task.

### `log`

A text description of the action that happened.
This is a human-friendly string that may be displayed to a user
but shouldn't be parsed for data as its structure isn't guaranteed.

### `description`

A short, non-human-readable description of the activity.

### `text`

A short, human-readable description of the activity.

### `payload`

The payload contains all settings and details about the activity itself.
Its content is based on the type of activity.

| Name | Description |
|------|-------------|
| `payload.user` | The user object that triggered the activity. |
| `payload.environment` | The environments impacted by the activity. See [`environment`](#environment). |
| `payload.commits` | The git metadata for the changes. |
| `payload.commits_count` | The amount of git commits.  |
| `payload.deployment` | See [`deployment`](#deployment). |

#### `user`

The Platform.sh user (`payload.user.display_name`) that triggered the activity.

#### `environment`

This block contains information about the environment itself and its settings or cron commands that have been run, after the action has taken place.
The most notable properties of this key are:

| Name | Description |
|------|-------------|
| `payload.environment.name` | The name of the branch. |
| `payload.environment.machine_name` | The name of the environment. |
| `payload.environment.type` | The type of the environment. |
| `payload.environment.head_commit` | The Git commit ID that triggered the event. |
| `payload.environment.edge_hostname` | The edge hostname of the environment. |

#### `deployment`

The `deployment` block returns information about all services in the environment.

| Name | Description |
|------|-------------|
| `payload.deployment.routes` | All the URLs made available by the environment. Note that some are redirects. To find those that are live URLs filter to those objects whose `type` is `upstream`. |
| `payload.deployment.variables` | The variables you [set on the environment](../../administration/web/configure-environment.md#variables).  |

That configuration includes the resulting configuration objects derived from:

- [your routes](../../define-routes/_index.md)
- [your app configuration](../../create-apps/_index.md)
- [your services](../../add-services/_index.md) (if any)

## Maximum activities and parallelism

Project activities are distributed across separate queues, which enables **two* simultaneous activities to occur in parallel across your environments.
For a given environment, only one activity can run at a time.
Those queues include:

| Name | Description |
|------|-------------|
| `default` | these include the most common activities on repositories (pushes, merges) and environments (syncs, redeployments). |
| `integrations` | source and webhook integration activities. |
| `backup` | backup activities. |
| `cron` | cron activities. |

Production activities are prioritized across all queues.
While it's still possible for a non-production environment activity to block production activities,
it's temporary and unlikely, since the moment that production activity is triggered it jumps to the top of the queue automatically.
