---
title: "Bitbucket"
weight: 1
description: |
  The Bitbucket integration allows you to manage your Platform.sh environments directly from your Bitbucket repository.
---

{{< description >}}

## Setting up an OAuth consumer

You can integrate your Bitbucket repositories with Platform.sh by creating an [OAuth consumer](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html) for your account.

### On Bitbucket

1. Go to your user account and click "Settings".
2. Under "ACCESS MANAGEMENT" click OAuth.
3. At the bottom of that page under "OAuth consumers", click the "Add consumer" button.
4. Fill out the information for the consumer. In order for OAuth2 to work correctly, it's recommended that you include:
    * **Name:** Give the consumer a recognizable name, like `Platform.sh consumer` or `Platform.sh integration`.
    * **Callback URL:** The URL users will be redirected to after access authorization. It is sufficient to set this value to `http://localhost`.
    * **Set as a private consumer:** At the bottom of the "Details" section, select the "This is a private consumer" checkbox.
    * **Permissions:** Sets the integration permissions for Platform.sh. These permissions will create the webhooks that will enable Platform.sh to mirror actions from the Bitbucket repository.
      * **Account** - Email, Read
      * **Repositories** - Read, Write
      * **Pull requests** - Read
      * **Webhooks** - Read and write
5. After you have completed the form, `Save` the consumer.
6. After you have saved, you will see `Platform.sh consumer` listed in the "OAuth consumers" section. If you open that item, it will expose two variables that you will need to complete the integration using the Platform.sh CLI: `Key` and `Secret`.

### Local

[Install the Platform.sh CLI](/development/cli.html#installation) if you have not already done so.

Retrieve a `PROJECT_ID` for an existing project with `platform project:list` or create a new project with `platform project:create`.

Then run the integration command:

```bash
platform integration:add --type=bitbucket --project <PLATFORMSH_PROJECT_ID> --key <CONSUMER_KEY> --secret <CONSUMER_SECRET> --repository <USER>/<REPOSITORY>
```

where

* `PLATFORMSH_PROJECT_ID` is the project ID for your Platform.sh project.
* `CONSUMER_KEY` is the `Key` variable of the consumer you created.
* `CONSUMER_SECRET` is the `Secret` variable of the consumer you created.
* `USER/REPOSITORY` is the location of the repository.

## Validate the integration

In both cases, you can verify that your integration is functioning properly [using the CLI](/administration/integrations.html#validating-integrations) command

```bash
platform integration:validate
```

## Optional parameters

By default several parameters will be set for the Bitbucket integration. They can be changed using the `platform integration:update` command.

* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that do not exist in the remote Bitbucket repository (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR. `true` to build the result of merging the PR.  (`false` by default)
* `--pull-requests-clone-parent-data`: Set to `false` to disable cloning of parent environment data when creating a PR environment, so each PR environment starts with no data. (`true` by default)

For more information see:

```bash
platform help integration:update
```

{{< note >}}
The --prune-branches option depends on --fetch-branches being enabled. If --fetch-branches is disabled, --prune-branches will automatically be set to false, even if specifically set to true.
{{< /note >}}
