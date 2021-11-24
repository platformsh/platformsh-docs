---
title: "Bitbucket"
description: |
  The Bitbucket integration allows you to manage your Platform.sh environments directly from your Bitbucket repository.
---

{{< description >}}

It's possible to integrate a Platform.sh project with either the freely available Bitbucket Cloud product
or with the self-hosted [Bitbucket Server](https://confluence.atlassian.com/bitbucketserver/).
In both cases, you need to [install the Platform.sh CLI](/development/cli/_index.md#installation), if you haven't already done so,
to set up the integration.

{{< note >}}

If the repository you are trying to integrate with a Platform.sh project has a default branch that is not `master` (such as `main`),
there are a few additional steps you need to perform to setup the integration.
See the [Renaming the default branch guide](/guides/general/default-branch.md) for more information.

{{< /note >}}

## Bitbucket Cloud

### 1. Set up an OAuth consumer

You can integrate your Bitbucket repositories with Platform.sh
by creating an [OAuth consumer](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html) for your Workspace.

1. Go to your Bitbucket Workspace and click "Settings".
2. Under "APPS AND FEATURES" click "OAuth Consumers".
3. Click the "Add consumer" button.
4. Fill out the information for the consumer. In order for the integration to work correctly, it's required that you include:
    * **Name:** Give the consumer a recognizable name, like `Platform.sh consumer` or `Platform.sh integration`.
    * **Callback URL:** The URL users will be redirected to after access authorization. It is sufficient to set this value to `http://localhost`.
    * **Set as a private consumer:** At the bottom of the "Details" section, select the "This is a private consumer" checkbox.
    * **Permissions:** Sets the integration permissions for Platform.sh.
      These permissions will create the webhooks that will enable Platform.sh to mirror actions from the Bitbucket repository.
      * **Account** - Email, Read
      * **Repositories** - Read, Write
      * **Pull requests** - Read
      * **Webhooks** - Read and write
5. After you have completed the form, `Save` the consumer.
6. After you have saved, you will see your consumer listed in the "OAuth consumers" section.
   If you open that item, it exposes two variables that you need to complete the integration using the Platform.sh CLI: `Key` and `Secret`.

### 2. Enable the integration

Retrieve a `PROJECT_ID` for an existing project with `platform project:list`
or create a new project with `platform project:create`.

Then run the integration command:

```bash
 platform integration:add --type=bitbucket --project <PLATFORMSH_PROJECT_ID> --key <CONSUMER_KEY> --secret <CONSUMER_SECRET> --repository <USER>/<REPOSITORY>
```

where

* `PLATFORMSH_PROJECT_ID` is the project ID for your Platform.sh project.
* `CONSUMER_KEY` is the `Key` variable of the consumer you created.
* `CONSUMER_SECRET` is the `Secret` variable of the consumer you created.
* `USER/REPOSITORY` is the location of the repository.

## Bitbucket Server

### 1. Generate a token

To integrate your Platform.sh project with a repository on a Bitbucket Server instance,
you first need to create an access token associated with your account.
Click the avatar icon in the top right-hand corner, and then select "Manage account".
From your account settings go to "Personal access tokens", and then "Create a token".

Name the token, and give it at least "Read" access to projects and "Write" access to repositories.

![Bitbucket server token](/images/integrations/bitbucket_server.png "0.3")

Copy the token and make a note of it (temporarily).

### 2. Enable the integration

Retrieve a `PROJECT_ID` for an existing project with `platform project:list`
or create a new project with `platform project:create`.

Then run the integration command:

```bash
platform integration:add --type=bitbucket_server --project <PLATFORMSH_PROJECT_ID> --base-url=<BASE_URL> --username=<USERNAME> --token=<TOKEN> --repository=<REPOSITORY>
```

Where

* `PLATFORMSH_PROJECT_ID` is the project ID for your Platform.sh project.
* `BASE_URL`: The base URL of the server installation.
* `USERNAME`: Your Bitbucket Server username.
* `TOKEN`: The access token you created for the integration.
* `REPOSITORY`: The repository  (e.g. 'owner/repository').

## Validate the integration

In both cases, you can verify that your integration is functioning properly [using the CLI](/integrations/overview.md#validating-integrations):

```bash
platform integration:validate
```

## Optional parameters

By default several parameters will be set for the Bitbucket integration.
They can be changed using the `platform integration:update` command.

* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that do not exist in the remote Bitbucket repository (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR.
  `true` to build the result of merging the PR.  (`false` by default)
* `--pull-requests-clone-parent-data`:
  Set to `false` to disable cloning of parent environment data when creating a PR environment,
  so each PR environment starts with no data. (`true` by default)

For more information see:

```bash
platform help integration:update
```

{{< note >}}

The `--prune-branches` option depends on `--fetch-branches` being enabled.
If `--fetch-branches` is disabled, `--prune-branches` is automatically set to false,
even if specifically set to true.

{{< /note >}}

## Clones and commits

You can clone your codebase by running `platform get <projectID>`
or in your project in the console by going to Code > Git and running the `git clone` command.

When you perform this action, you are actually cloning from your remote integrated repository,
so long as you have the [appropriate access to do so](/administration/users.md#user-access-and-integrations).

Your Bitbucket repository is considered by Platform.sh to be the "source of truth" for the project.
The project is only a mirror of that repository and all commits should be pushed only to Bitbucket.

