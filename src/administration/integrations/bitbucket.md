# Bitbucket

There are two options for setting up Bitbucket integrations with Platform.sh.

* [Using the Platform.sh add-on](#platformsh-bitbucket-add-on).
* [Setting up an OAuth consumer manually](#setting-up-an-oauth-consumer).

## Platform.sh Bitbucket add-on

The [Bitbucket add-on](https://platform.sh/bitbucket/) allows you to manage your Platform.sh environments directly from your Bitbucket repository.

Supported:

* Create a new environment when creating a branch or opening a pull request on Bitbucket.
* Rebuild the environment when pushing new code to Bitbucket.
* Delete the environment when merging a pull request.

### Install the add-on

On your Bitbucket account, click on you avatar and select [App Marketplace](https://bitbucket.org/account/addon-directory/). Filter the list of available add-ons for the "Deployment" category. Add the add-on titled "Platform.sh PHP PaaS" and grant its access to the account.

![Bitbucket add-on](/images/integrations/bitbucket-addon.png)

> **Notes**
> * The Bitbucket Integration can only be connected by the Platform.sh account owner.
> * Platform.sh recommends you install the add-on at the *team* level (select ``Manage Team`` instead) so that every repository that belongs to the team can use the add-on.
> * If you have created your account using the bitbucket oAuth Login in order to use the Platform CLI you will need to setup a password which you can do by visiting this page [https://accounts.platform.sh/user/password](https://accounts.platform.sh/user/password)

### Setup the integration

To connect your Bitbucket repository to Platform.sh, go to the repository page *as an administrator*  and click on the `Settings` icon. Then click `Platform.sh integration` under the `PLATFORM.SH` section.

The add-on will give you two options when you grant Platform.sh access to the repository:

1. Create a new project: this will allow you to choose the region and create a project for the repository.
2. Connect to an existing project: (bottom of the page) will allow you to connect the repository to a pre-initialized empty project.

## Setting up an OAuth consumer

In some cases when the Platform.sh add-on cannot correctly configure an integration, you can do so manually by creating an [OAuth consumer](https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html) for your account.

### On Bitbucket

1. Go to your user account and click "Settings".
2. Under "ACCESS MANAGEMENT" click OAuth.
3. At the bottom of that page under "OAuth consumers", click the "Add consumer" button.
4. Fill out the information for the consumer. In order for OAuth2 to work correctly, it's recommended that you include:
  * **Name:** Give the consumer a recognizable name, like `Platform.sh consumer` or `Platform.sh integration`.
  * **Callback URL:** The URL users will be redirected to after access authorization. It is sufficient to set this value to `http://localhost`.
  * **Permissions:** Sets the integration permissions for Platform.sh. These permissions will create the webhooks that will enable Platform.sh to mirror actions from the Bitbucket repository.
    * **Account** - Email, Read
    * **Repos** - Read, Write
    * **Pull requests** - Read
    * **Webhooks** - Read and write
5. After you have completed the form, `Save` the consumer.
6. After you have saved, you will see `Platform.sh consumer` listed in the "OAuth consumers" section. If you open that item, it will expose two variables that you will need to complete the integration using the Platform.sh CLI: "Key" and "Secret".

### Local

[Install the Platform.sh CLI](/development/cli.html#installation) if you have not already done so.

Retrieve a `PROJECT_ID` for an existing project with `platform project:list` or create a new project with `platform project:create`.

Then run the integration command:

```
platform integration:add --type=bitbucket --project <PLATFORMSH_PROJECT_ID> --key <CONSUMER_KEY> --secret <CONSUMER_SECRET> --repository <USER>/<REPOSITORY>
```

where

* `PLATFORMSH_PROJECT_ID` is the project ID for your Platform.sh project.
* `CONSUMER_KEY` is the "Key" variable of the consumer you created.
* `CONSUMER_SECRET` is the "Secret" variable of the consumer you created.
* `USER/REEPOSITORY` is the location of the repository.

Optional parameters:

* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that do not exist in the remote GitHub repository (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR. `true` to build the result of merging the PR.  (`false` by default)
* `--pull-requests-clone-parent-data`: Set to `false` to disable cloning of parent environment data when creating a PR environment, so each PR environment starts with no data. (`true` by default)

## Validate the integration

In both cases, you can verify that your integration is functioning properly [using the CLI](/administration/integrations.md#validating-integrations) command

```
$ platform integration:validate
```
