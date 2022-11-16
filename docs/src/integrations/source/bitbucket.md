---
title: "Bitbucket"
description: |
  The Bitbucket integration allows you to manage your Platform.sh environments directly from your Bitbucket repository.
---

{{% description %}}

It's possible to integrate a Platform.sh project with either the freely available Bitbucket Cloud product
or with the self-hosted [Bitbucket Server](https://confluence.atlassian.com/bitbucketserver/).

{{% source-integration/requirements %}}

## Bitbucket Cloud

### 1. Set up an OAuth consumer

You can integrate your Bitbucket repositories with Platform.sh
by creating an [OAuth consumer](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html) for your Workspace.

1. Go to your Bitbucket Workspace and click "Settings".
2. Under "APPS AND FEATURES" click "OAuth Consumers".
3. Click the "Add consumer" button.
4. Fill out the information for the consumer. In order for the integration to work correctly, it's required that you include:
    * **Name:** Give the consumer a recognizable name, like `Platform.sh consumer` or `Platform.sh integration`.
    * **Callback URL:** The URL users are redirected to after access authorization. It is sufficient to set this value to `http://localhost`.
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

### 2. Enable the Cloud integration

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

[Generate a token](https://confluence.atlassian.com/display/BitbucketServer/HTTP+access+tokens).
and give it at least read access to projects and admin access to repositories.
Copy the token and make a note of it (temporarily).

### 2. Enable the Server integration

To enable the integration, use either the [CLI](../../administration/cli/_index.md)
or the [Console](../../administration/web/_index.md).

{{< codetabs >}}
---
title:Using the CLI
file=none
highlight=false
---

Run the following command:

```bash
platform integration:add --type=bitbucket_server --base-url={{< variable "BITBUCKET_URL" >}} --username={{< variable "USERNAME" >}} --token={{< variable "BITBUCKET_ACCESS_TOKEN" >}} --repository={{< variable "REPOSITORY" >}} --project={{< variable "PLATFORM_SH_PROJECT_ID" >}}
```

* `BITBUCKET_URL`: The base URL of the server installation.
* `USERNAME`: Your Bitbucket Server username.
* `BITBUCKET_ACCESS_TOKEN`: The access token you created for the integration.
* `REPOSITORY`: The repository  (in the form `owner/repository`).
* `PLATFORM_SH_PROJECT_ID`: The project ID for your Platform.sh project.

Optional parameters:

* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that don't exist in the remote Bitbucket repository (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR.
  `true` to build the result of merging the PR.
  (`false` by default)


Note that the `--prune-branches` option depends on `--fetch-branches` being enabled.
If `--fetch-branches` is disabled, `--prune-branches` is automatically set to false, even if specifically set to true.

<--->
---
title:In the Console
file=none
highlight=false
---

1. Select the project where you want to enable the integration.
2. Click {{< icon settings >}} **Settings**.
3. Under **Project settings**, click **Integrations**.
4. Click **+ Add integration**.
5. On the **Bitbucket server** integration, click **+ Add**.
6. Complete the form with the URL of your server, your username, the token you generated, the project name,
   and the repository  (in the form `owner/repository`).
7. Check that the other options match what you want.
8. Click **Add integration**.

{{< /codetabs >}}

## Validate the integration

In both cases, verify that your integration is functioning properly [using the CLI](../overview.md#validating-integrations):

```bash
platform integration:validate
```

{{% source-integration/environment-status source="Bitbucket" %}}

{{% source-integration/clone-commit name="Bitbucket" %}}

{{% source-integration/url source="Bitbucket" %}}
