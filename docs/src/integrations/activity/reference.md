---
title: "Activity reference"
sidebarTitle: "Activity reference"
weight: -10
description: Reference for the activities
---

Activities are responses to actions in your project,
including when you deploy your app,
when you [push code](#push) or when a [cron job is run](#cron).

## Activity schema

Any activity has a JSON object linked to it containing all information for that activity such as timestamps,
duration, configuration, and much more.
In practice a big part of that JSON object's content can be ignored.
The most commonly used values are documented on this reference.

The JSON object can be parsed and reacted to through custom hooks.
You can use these hooks to automate your workflows.

Depending on the activity, the JSON object response differs and not all fields are always available.

When referring to a JSON object, the term "property" is used and "element" for a JSON array, according to the [JSON terminology](https://json-schema.org/draft-04/json-schema-core.html#rfc.section.3).

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
The result doesn't take into account if your cron task executed properly or if the (re)deploy ran successfully.

### `timings`

The amount of time required by the activity.

This property includes the following values:

- `wait`: The time delay if a command is set to wait before being executed.
- `build`: The execution time for the build hook.
- `deploy`: The execution time for the deploy hook.
- `execute`: The execution time for your script or your cron task.

### `log`

A human-friendly text description of the action that happened.
The log shouldn't be parsed for data as its structure isn't guaranteed.

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

## Examples

The usual content of the JSON object response is long, the examples provided are shortened by ellipses.
Remember, that depending on the activity, the JSON object response differs and not all fields are always available.
For a quick test, see the [webhook setup](./webhooks.md#setup).

### Cron

When a cron job is triggered, the activity contains all [the job's information](../../create-apps/app-reference.md#crons).
The activity looks like:

``` json
{
  "id": "ypalrypnezbye",
  "_links": {
    "self": {
      "href": "https://eu-3.platform.sh/api/projects/abcdefgh1234567/activities/ypalrypnezbye"
    },
    "log": {
      "href": "/api/projects/abcdefgh1234567/activities/ypalrypnezbye/log"
    }
  },
  "created_at": "2022-12-13T16:06:08.081312+00:00",
  "updated_at": null,
  "type": "environment.cron",
  "parameters": {
    "user": "admin",
    "cluster": "abcdefgh1234567-main-abcd123",
    "environment": "main",
    "application": "app",
    "cron": "saybye",
    "spec": {
      "spec": "5 * * * *",
      "commands": {
        "start": "sleep 60 && echo \"hello world\" && date",
        "stop": null
      },
      "shutdown_timeout": null,
      "timeout": 86400
    }
  },
  "project": "abcdefgh1234567",
  "environments": [
    "main"
  ],
  "state": "complete",
  "result": "success",
  "started_at": "2022-12-13T16:06:08.258090+00:00",
  "completed_at": "2022-12-13T16:07:09.658339+00:00",
  "completion_percent": 100,
  "cancelled_at": null,
  "timings": {
    "wait": 0,
    "execute": 61.244
  },
  "log": "hello world\nTue Dec 13 16:07:09 UTC 2022",
  "payload": {
    "user": {
      "id": "admin",
      "created_at": "2022-12-13T16:06:08.066085+00:00",
      "updated_at": null,
      "display_name": "Platform.sh Bot"
    },
    "project": {
      "id": "abcdefgh1234567",
      "created_at": "2022-03-22T15:47:28.739099+00:00",
      "updated_at": "2022-12-01T09:42:19.860188+00:00",
      "attributes": {},
      "title": "php-test",
      "description": "",
      "owner": "c9926428-44dc-4b10-be03-a26dd43b44c1",
      "namespace": "platformsh",
      "organization": "01FF4NBNVMMDWP1NVK0G4EGJW0",
      "default_branch": "main",
      "status": {
        "code": "provisioned",
        "message": "ok"
      },
      "timezone": "Europe/Dublin",
      "region": "eu-3.platform.sh",
      "repository": {
        "url": "abcdefgh1234567@git.eu-3.platform.sh:abcdefgh1234567.git",
        "client_ssh_key": "ssh-rsa aaaaaaabbbbbbbcccccccddddddd abcdefgh1234567@platformsh"
      },
      "default_domain": null,
      "subscription": {
        "license_uri": "https://accounts.platform.sh/api/v1/licenses/2291467",
        "plan": "development",
        "environments": 3,
        "storage": 5120,
        "included_users": 1,
        "subscription_management_uri": "https://console.platform.sh/-/users/abcd12345/billing/plan/12345678",
        "restricted": false,
        "suspended": false,
        "user_licenses": 1
      }
    },
    "environment": {
      "id": "main",
      "created_at": "2022-03-22T15:47:43.750880+00:00",
      "updated_at": "2022-11-29T16:16:37.085719+00:00",
      "name": "main",
      "machine_name": "main-abcd123",
      "title": "Main",
      "attributes": {},
      "type": "production",
      "parent": null,
      "default_domain": null,
      "clone_parent_on_create": true,
      "deployment_target": "local",
      "is_pr": false,
      "status": "active",
      "enable_smtp": true,
      "restrict_robots": true,
      "edge_hostname": "main-abcd123-abcdefgh1234567.eu-3.platformsh.site",
      "deployment_state": {
        "last_deployment_successful": true,
        "last_deployment_at": "2022-11-29T16:16:37.085609+00:00",
        "crons": {
          "enabled": true,
          "status": "running"
        }
      },
      "resources_overrides": {},
      "last_active_at": "2022-12-13T15:07:10.862854+00:00",
      "last_backup_at": null,
      "project": "abcdefgh1234567",
      "is_main": true,
      "is_dirty": false,
      "has_code": true,
      "head_commit": "6aac318907b50252976c47e4e62ed95d438af0ea",
      "merge_info": {
        "commits_ahead": 0,
        "commits_behind": 0,
        "parent_ref": null
      },
      "has_deployment": true
    },
    "cron": "saybye"
  },
  "description": "<user data-id=\"admin\">Platform.sh Bot</user> ran cron <strong>saybye</strong>",
  "text": "Platform.sh Bot ran cron **saybye**",
  "expires_at": "2023-01-12T16:06:08.081293+00:00"
}
```

For a cron specific activity, see the `parameters` property:

``` json
...
  "parameters": {
    "user": "admin",
    "cluster": "abcdefgh1234567-main-abcd123",
    "environment": "main",
    "application": "app",
    "cron": "saybye",
    "spec": {
      "spec": "5 * * * *",
      "commands": {
        "start": "sleep 60 && echo \"hello world\" && date",
        "stop": null
      },
      "shutdown_timeout": null,
      "timeout": 86400
    }
...
```

In that example, the cron is scheduled to run every five minutes (`5 * * * *`),
runs `sleep 60 && echo \"hello world\" && date` and timeouts after 86400 seconds.

### Push

A git push to your project will trigger an activity similar to the following:

``` json
{
  "id": "a1kz6ffxui7em",
  "_links": {
    "self": {
      "href": "https://eu-3.platform.sh/api/projects/abcdefgh1234567/activities/a1kz6ffxui7em"
    },
    "log": {
      "href": "/api/projects/abcdefgh1234567/activities/a1kz6ffxui7em/log"
    }
  },
  "created_at": "2022-12-14T15:41:05.821145+00:00",
  "updated_at": null,
  "type": "environment.push",
  "parameters": {
    "user": "c9926428-44dc-4b10-be03-a26dd43b44c1",
    "environment": "main",
    "old_commit": "6aac318907b50252976c47e4e62ed95d438af0ea",
    "new_commit": "2bab04e050279ac078d5d34016f5dd9c466e948d"
  },
  "project": "abcdefgh1234567",
  "environments": [
    "main"
  ],
  "state": "complete",
  "result": "success",
  "started_at": "2022-12-14T15:41:05.969872+00:00",
  "completed_at": "2022-12-14T15:41:57.635442+00:00",
  "completion_percent": 100,
  "cancelled_at": null,
  "timings": {
    "wait": 0,
    "parse_commits": 0.63,
    "build": 0.506,
    "deploy": 49.954,
    "execute": 51.516
  },
  "log": "Found 1 new commit\n\nBuilding application 'app' (runtime type: php:8.0, tree: 9851a01)\n  Reusing existing build for this tree ID\n\nProvisioning certificates\n  Certificates\n  - certificate 5093946: expiring on 2023-02-23 11:09:20+00:00, covering {,www}.main-abcd123-abcdefgh1234567.eu-3.platformsh.site\n\n\nRedeploying environment main\n  Preparing deployment\n  Closing service app\n  Opening application app and its relationships\n  Executing deploy hook for application app\n    hello world\n\n  Opening environment\n  Environment configuration\n    app (type: php:8.0, size: S, disk: 2048)\n\n  Environment routes\n    http://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/ redirects to https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/\n    http://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/ redirects to https://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/\n    https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/ is served by application `app`\n    https://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/ redirects to https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/\n",
  "payload": {
    "user": {
      "id": "c9926428-44dc-4b10-be03-a26dd43b44c1",
      "created_at": "2022-12-14T15:40:16.891889+00:00",
      "updated_at": null,
      "display_name": "Cloé Weber"
    },
    "environment": {
      "id": "main",
      "created_at": "2022-03-22T15:47:43.750880+00:00",
      "updated_at": "2022-11-29T16:16:37.085719+00:00",
      "name": "main",
      "machine_name": "main-abcd123",
      "title": "Main",
      "attributes": {},
      "type": "production",
      "parent": null,
      "default_domain": null,
      "clone_parent_on_create": true,
      "deployment_target": "local",
      "is_pr": false,
      "status": "active",
      "enable_smtp": true,
      "restrict_robots": true,
      "edge_hostname": "main-abcd123-abcdefgh1234567.eu-3.platformsh.site",
      "deployment_state": {
        "last_deployment_successful": true,
        "last_deployment_at": "2022-11-29T16:16:37.085609+00:00",
        "crons": {
          "enabled": true,
          "status": "sleeping"
        }
      },
      "resources_overrides": {},
      "last_active_at": "2022-12-13T16:07:09.788910+00:00",
      "last_backup_at": null,
      "project": "abcdefgh1234567",
      "is_main": true,
      "is_dirty": false,
      "has_code": true,
      "head_commit": "6aac318907b50252976c47e4e62ed95d438af0ea",
      "merge_info": {
        "commits_ahead": 0,
        "commits_behind": 0,
        "parent_ref": null
      },
      "has_deployment": true
    },
    "commits": [
      {
        "sha": "2bab04e050279ac078d5d34016f5dd9c466e948d",
        "author": {
          "email": "cloeweber@example.com",
          "name": "Cloé Weber",
          "date": 1671032461
        },
        "parents": [
          "6aac318907b50252976c47e4e62ed95d438af0ea"
        ],
        "message": "Replace sleep with wait"
      }
    ],
    "commits_count": 1,
    "deployment": {
      "id": "current",
      "created_at": "2022-03-22T15:48:05.396979+00:00",
      "updated_at": "2022-12-14T15:41:57.264813+00:00",
      "cluster_name": "abcdefgh1234567-main-abcd123",
      "project_info": {
        "name": "abcdefgh1234567",
        "settings": {
          "initialize": {
            "values": {
              "initialize": true,
              "start": false,
              "base": {
                "files": [],
                "profile": "PHP",
                "config": null,
                "repository": "https://github.com/platformsh-templates/php.git@master",
                "title": "PHP"
              }
            }
          },
          "product_name": "Platform.sh",
          "product_code": "platformsh",
          "variables_prefix": "PLATFORM_",
          "bot_email": "bot@platform.sh",
          "application_config_file": ".platform.app.yaml",
          "project_config_dir": ".platform",
          "use_drupal_defaults": false,
          "use_legacy_subdomains": false,
          "development_service_size": "S",
          "development_application_size": "S",
          "enable_certificate_provisioning": true,
          "certificate_style": "ecdsa",
          "certificate_renewal_activity": true,
          "development_domain_template": null,
          "enable_state_api_deployments": true,
          "temporary_disk_size": null,
          "cron_minimum_interval": 5,
          "cron_maximum_jitter": 20,
          "concurrency_limits": {
            "internal": null,
            "integration": 4,
            "backup": 2,
            "cron": 10,
            "default": 2
          },
          "flexible_build_cache": false,
          "strict_configuration": true,
          "has_sleepy_crons": true,
          "crons_in_git": true,
          "custom_error_template": null,
          "app_error_page_template": null,
          "environment_name_strategy": "name-and-hash",
          "data_retention": null,
          "enable_codesource_integration_push": true,
          "enforce_mfa": false,
          "systemd": true,
          "router_gen2": false,
          "chorus": {
            "enabled": true,
            "exposed": true
          },
          "build_resources": {
            "cpu": 1,
            "memory": 2048
          },
          "outbound_restrictions_default_policy": "allow",
          "self_upgrade": true,
          "additional_hosts": {},
          "max_allowed_routes": 50000,
          "max_allowed_redirects_paths": 50000,
          "enable_incremental_backups": true,
          "sizing_api_enabled": false,
          "enable_cache_grace_period": true,
          "enable_zero_downtime_deployments": false,
          "enable_admin_agent": true,
          "certifier_url": "https://ssh.api.platform.sh",
          "centralized_permissions": false,
          "glue_server_max_request_size": 10
        }
      },
      "environment_info": {
        "name": "main",
        "is_main": true,
        "is_production": false,
        "reference": "refs/heads/main",
        "machine_name": "main-abcd123",
        "environment_type": "production"
      },
      "deployment_target": "local",
      "vpn": null,
      "http_access": {
        "is_enabled": true,
        "addresses": [],
        "basic_auth": {}
      },
      "enable_smtp": true,
      "restrict_robots": true,
      "variables": [
        {
          "name": "php:memory_limit",
          "value": "512M",
          "is_sensitive": false
        }
      ],
      "access": [
        {
          "entity_id": "c9926428-44dc-4b10-be03-a26dd43b44c1",
          "role": "admin"
        }
      ],
      "subscription": {
        "license_uri": "https://accounts.platform.sh/api/v1/licenses/12345678",
        "plan": "development",
        "environments": 3,
        "storage": 5120,
        "included_users": 1,
        "subscription_management_uri": "https://console.platform.sh/-/users/abcd12345/billing/plan/12345678",
        "restricted": false,
        "suspended": false,
        "user_licenses": 1
      },
      "services": {},
      "routes": {
        "https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/": {
          "primary": true,
          "id": null,
          "production_url": "https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "attributes": {},
          "type": "upstream",
          "tls": {
            "strict_transport_security": {
              "enabled": null,
              "include_subdomains": null,
              "preload": null
            },
            "min_version": null,
            "client_authentication": null,
            "client_certificate_authorities": []
          },
          "original_url": "https://{default}/",
          "restrict_robots": true,
          "cache": {
            "enabled": true,
            "default_ttl": 0,
            "cookies": [
              "*"
            ],
            "headers": [
              "Accept",
              "Accept-Language"
            ]
          },
          "ssi": {
            "enabled": false
          },
          "upstream": "app:http",
          "redirects": {
            "expires": "-1s",
            "paths": {}
          }
        },
        "https://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/": {
          "primary": false,
          "id": null,
          "production_url": "https://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "attributes": {},
          "type": "redirect",
          "tls": {
            "strict_transport_security": {
              "enabled": null,
              "include_subdomains": null,
              "preload": null
            },
            "min_version": null,
            "client_authentication": null,
            "client_certificate_authorities": []
          },
          "original_url": "https://www.{default}/",
          "restrict_robots": true,
          "to": "https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "redirects": {
            "expires": "-1s",
            "paths": {}
          }
        },
        "http://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/": {
          "primary": false,
          "id": null,
          "production_url": "http://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "attributes": {},
          "type": "redirect",
          "tls": {
            "strict_transport_security": {
              "enabled": null,
              "include_subdomains": null,
              "preload": null
            },
            "min_version": null,
            "client_authentication": null,
            "client_certificate_authorities": []
          },
          "original_url": "http://{default}/",
          "restrict_robots": true,
          "to": "https://main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "redirects": {
            "expires": "-1s",
            "paths": {}
          }
        },
        "http://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/": {
          "primary": false,
          "id": null,
          "production_url": "http://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "attributes": {},
          "type": "redirect",
          "tls": {
            "strict_transport_security": {
              "enabled": null,
              "include_subdomains": null,
              "preload": null
            },
            "min_version": null,
            "client_authentication": null,
            "client_certificate_authorities": []
          },
          "original_url": "http://www.{default}/",
          "restrict_robots": true,
          "to": "https://www.main-abcd123-abcdefgh1234567.eu-3.platformsh.site/",
          "redirects": {
            "expires": "-1s",
            "paths": {}
          }
        }
      },
      "webapps": {
        "app": {
          "resources": null,
          "size": "AUTO",
          "disk": 2048,
          "access": {
            "ssh": "contributor"
          },
          "relationships": {},
          "additional_hosts": {},
          "mounts": {
            "/web/uploads": {
              "source": "local",
              "source_path": "uploads"
            },
            "/private": {
              "source": "local",
              "source_path": "private"
            }
          },
          "timezone": null,
          "variables": {},
          "firewall": null,
          "initial_size": null,
          "container_profile": null,
          "instance_count": null,
          "name": "app",
          "type": "php:8.0",
          "runtime": {},
          "preflight": {
            "enabled": true,
            "ignored_rules": []
          },
          "tree_id": "9851a01081f3c2f943f75f62c38b67f8bc0ec15c",
          "slug_id": "abcdefgh1234567-app-9851a01081f3c2f943f75f62c38b67f8bc0ec15c-73985064e66fd2299f4b83931cff46891249a964",
          "app_dir": "/app",
          "web": {
            "locations": {
              "/": {
                "root": "web",
                "expires": "-1s",
                "passthru": "/index.php",
                "scripts": true,
                "allow": true,
                "headers": {},
                "rules": {}
              }
            },
            "move_to_root": false
          },
          "hooks": {
            "build": "set -e\n",
            "deploy": "set -e\n",
            "post_deploy": null
          },
          "crons": {
            "saybye": {
              "spec": "5 * * * *",
              "commands": {
                "start": "wait 60 && echo \"hello world\" && date",
                "stop": null
              },
              "shutdown_timeout": null,
              "timeout": 86400
            }
          }
        }
      },
      "workers": {},
      }
    }
  },
  "description": "<user data-id=\"c9926428-44dc-4b10-be03-a26dd43b44c1\">Cloé Weber</user> pushed to <environment data-id=\"main\">Main</environment>",
  "text": "Cloé Weber pushed to Main",
  "expires_at": "2023-12-14T15:41:05.821145+00:00"
}
```

The `environment` property contains your environment's settings:

``` json
...
    "environment": {
      "id": "main",
      "created_at": "2022-03-22T15:47:43.750880+00:00",
      "updated_at": "2022-11-29T16:16:37.085719+00:00",
      "name": "main",
      "machine_name": "main-abcd123",
      "title": "Main",
      "attributes": {},
      "type": "production",
      "parent": null,
      "default_domain": null,
      "clone_parent_on_create": true,
      "deployment_target": "local",
      "is_pr": false,
      "status": "active",
      "enable_smtp": true,
      "restrict_robots": true,
      "edge_hostname": "main-abcd123-abcdefgh1234567.eu-3.platformsh.site",
      "deployment_state": {
        "last_deployment_successful": true,
        "last_deployment_at": "2022-11-29T16:16:37.085609+00:00",
        "crons": {
          "enabled": true,
          "status": "sleeping"
        }
      },
      "resources_overrides": {},
      "last_active_at": "2022-12-13T16:07:09.788910+00:00",
      "last_backup_at": null,
      "project": "abcdefgh1234567",
      "is_main": true,
      "is_dirty": false,
      "has_code": true,
      "head_commit": "6aac318907b50252976c47e4e62ed95d438af0ea",
      "merge_info": {
        "commits_ahead": 0,
        "commits_behind": 0,
        "parent_ref": null
      },
      "has_deployment": true
    },
...
```

The `deployment` contains your deployment's settings such as the [image type](../../create-apps/app-reference.md#types),
the [resource allocation](../../create-apps/app-reference.md#sizes) and much more.

A shortened excerpt of that property looks like:

``` json
...
 "deployment": {
      "id": "current",
      "created_at": "2022-03-22T15:48:05.396979+00:00",
      "updated_at": "2022-12-14T15:41:57.264813+00:00",
      "cluster_name": "abcdefgh1234567-main-abcd123",
      "project_info": {
          "deployment": {
      "id": "current",
      "created_at": "2022-03-22T15:48:05.396979+00:00",
      "updated_at": "2022-12-14T15:41:57.264813+00:00",
      "cluster_name": "abcdefgh1234567-main-abcd123",
      "project_info": {
        "name": "abcdefgh1234567",
        "settings": {
          "initialize": {
            "values": {
              "initialize": true,
              "start": false,
              "base": {
                "files": [],
                "profile": "PHP",
                "config": null,
                "repository": "https://github.com/platformsh-templates/php.git@master",
                "title": "PHP"
              }
            }
          },
          ...
          "application_config_file": ".platform.app.yaml",
          "project_config_dir": ".platform",
          ...
          "development_service_size": "S",
          "development_application_size": "S",
          "enable_certificate_provisioning": true,
          "certificate_style": "ecdsa",
          "certificate_renewal_activity": true,
          ...
          "cron_minimum_interval": 5,
          "cron_maximum_jitter": 20,
          "concurrency_limits": {
            "internal": null,
            "integration": 4,
            "backup": 2,
            "cron": 10,
            "default": 2
          },
          ...
          "build_resources": {
            "cpu": 1,
            "memory": 2048
          },
          ...
          "max_allowed_routes": 50000,
          "max_allowed_redirects_paths": 50000,
          "enable_incremental_backups": true,
          ...
        }
      },
...
```

The `commits` property contains everything related to the git push you made:

``` json
...
    "commits": [
      {
        "sha": "2bab04e050279ac078d5d34016f5dd9c466e948d",
        "author": {
          "email": "cloeweber@example.com",
          "name": "Cloé Weber",
          "date": 1671032461
        },
        "parents": [
          "6aac318907b50252976c47e4e62ed95d438af0ea"
        ],
        "message": "Replace sleep with wait"
      }
    ],
...
```
