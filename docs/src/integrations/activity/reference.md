---
title: "Activity reference"
sidebarTitle: "Activity reference"
weight: -10
description: Reference for the activities
---

Activities are responses to actions in your project, including when you deploy your app or when a new branch is created.

## Activity schema

Any activity has a JSON object linked to it containing all information for that activity such as timestamps,
duration, configuration, and much more.
That object can be parsed and reacted to through custom hooks.
You can use these hooks to automate your workflows.

Depending on the activity, the JSON object response differs and not all fields are always available.

When referring to a JSON object, the term "property" is used and "element" for a JSON array, according to the [JSON terminology](https://json-schema.org/draft-04/json-schema-core.html#rfc.section.3).

This reference contains everything you need to get the relevant information out of the activity schema.

For a quick test, see the [webhook setup](./webhooks.md#setup).

### Example response

Here is a shortened example of what a JSON object response looks like for the [sync of an environment](../../other/glossary.md#sync):

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

The `created_at`, `started_at`, `updated_at`, `cancelled_at`, `completed_at`, `expires_at` values are all timestamps in UTC.
If you need only a point in time when a given action happened, use `completed_at`.
If needed, you can use these properties to compute the duration of the different steps of a task.
For more time computation, [see `timings`](#timings).

### `parameters`

The parameters property include detailed information regarding which user ID triggered the activity,
the environment impacted, the ID of the git commits, commands run with crons, or if changes in the codebase happened.
The response changes based on the activity.

### `project`

The ID value of the project in which the activity took place.
Use the `project`'s value if you want to have multiple projects `POST` to the same URL.

Not to be mistaken with the [`Project` type action](#type).

### `type`

The `type` value is a combination of the scope and the action itself for that event.
Its scope can be in one of the following categories:

- [Project](#project-event-value)
- [Environment](#environment-event-value)
- [Integration](#integration-event-value)

#### `Project` event value

This value describes the action that happened on a given project, its value can be any from the following table.

| Name | Description |
|------|-------------|
| `project.modify.title` | The human-friendly title of the project has been changed. |
| `project.create` | A project has been created. Although it appears in the activity feed exactly once, it's not sent via a webhook as it always happens before a webhook can be configured. |
| `project.variable.create` | A new project variable has been created. |
| `project.variable.delete` | A project variable has been deleted. |
| `project.variable.update` | A project variable has been modified. |

For an overview of the different actions that can take place, see [the type](#type).

#### `Environment` event value

This value describes the action that happened on a project's environment, its value can be any from the following table.

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
| `environment.route.create` | A new route has been created through the API or the Console. This doesn't fire for route edits made to the `routes.yaml` file directly. |
| `environment.route.delete` | A route has been deleted through the API or the Console. This doesn't fire for route edits made to the `routes.yaml` file directly. |
| `environment.route.update` | A route has been modified through the API or the Console. This doesn't fire for route edits made to the `routes.yaml` file directly. |
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

Note that changes regarding user access to an environment/project aren't available anymore through the environment object.

For an overview of the different actions that can take place, see [the type](#type).

#### `Integration` event value

This value describes the action that happened on a project's integration, its value can be any from the following table.

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

For an overview of the different actions that can take place, see [the type](#type).

### `environments`

An array listing the `environments` that were involved in the activity.
This is usually a single-value element.

### `state`

The current state of the activity.
Its value can be `pending`, `in_progress`, or `complete`.

### `completion_percent`

The completion percentage value of the activity.

### `result`

Whether the activity itself completed successfully or not.
Its value is `success` if all went as planned.
The result isn't taking into account if your crons executed properly or if the (re)deploy ran successfully.

### `timings`

The amount of time required by the activity.

This property includes the following values:

- `wait`: The time delay if a command is set to wait before being executed.
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

The payload element contains all settings and details about the activity itself.
Its content is based on the type of activity.

| Name | Description |
|------|-------------|
| `payload.user` | The user object that triggered the activity. See [`user`](#user). |
| `payload.environment` | The environments impacted by the activity. See [`environment`](#environment). |
| `payload.commits` | The git metadata for the changes. |
| `payload.commits_count` | The amount of git commits.  |
| `payload.deployment` | See [`deployment`](#deployment). |

#### `user`

This element contains information about the Platform.sh user that triggered the activity.

| Name | Description |
|------|-------------|
| `payload.user.created_at` | The date the user was created. |
| `payload.user.display_name` | The human-friendly name of the user that triggered the activity. |
| `payload.user.id` | The user ID of the user. |
| `payload.user.updated_at` | The date that user was updated. |

#### `environment`

This element contains information about the environment itself,
its settings and cron commands that have been run,
after the action has taken place.
The most notable values of this element are:

| Name | Description |
|------|-------------|
| `payload.environment.name` | The name of the branch. |
| `payload.environment.machine_name` | The name of the environment. |
| `payload.environment.type` | The type of the environment. |
| `payload.environment.head_commit` | The Git commit ID that triggered the event. |
| `payload.environment.edge_hostname` | The edge hostname of the environment. |

Not to be mistaken with the [`Environment` type action](#type).

#### `deployment`

This element contains information about all services in the environment.
The most notable values of this element are:

| Name | Description |
|------|-------------|
| `payload.deployment.routes` | All the URLs made available by the environment. Note that some are redirects. To find those that are live URLs filter to those objects whose `type` is `upstream`. |
| `payload.deployment.services` | All the services on your environment. |
| `payload.deployment.variables` | The variables you [set on the environment](../../administration/web/configure-environment.md#variables).  |

The deployment block includes the configuration extracted from:

- [your routes](../../define-routes/_index.md)
- [your app configuration](../../create-apps/_index.md)
- [your services](../../add-services/_index.md) (if any)

## Maximum activities and parallelism

Project activities are distributed across separate queues,
which enables **two* simultaneous activities to occur in parallel across your environments.
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
