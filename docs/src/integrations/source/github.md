---
title: "GitHub"
description: |
  The [GitHub](https://github.com) integration allows you to manage your Platform.sh environments directly from your GitHub repository.
---

{{< description >}}

**Features supported:**

* Create a new environment when creating a branch or opening a pull request on GitHub.
* Rebuild the environment when pushing new code to GitHub.
* Delete the environment when merging a pull request.

## Setup

{{< note >}}

If the repository you are trying to integrate with a Platform.sh project has a default branch that's not `master` (such as `main`),
there are a few additional steps you need to perform to setup the integration.
See the [Renaming the default branch guide](/guides/general/default-branch.md) for more information.

{{< /note >}}

### 1. Generate a token

To integrate your Platform.sh project with an existing GitHub repository,
[generate a new token](https://github.com/settings/tokens/new) in your GitHub settings.

Give it a description and then ensure the token has the following scopes:

* To integrate with public repositories: `public_repo`
* To integrate with your own private repositories: `repo`
* To integrate with your organization's private repositories:
  `repo` and `read:org`
* To automatically create web hooks: `admin:repo_hook`

Copy the token and make a note of it (temporarily).

Note that for the integration to work,
your GitHub user needs to have permission to push code to the repository.

### 2. Enable the integration

Note that only the project owner can manage integrations.

Open a terminal window (you need to have the Platform.sh CLI installed).
Enable the GitHub integration as follows:

```bash
platform integration:add --type=github --project=PLATFORMSH_PROJECT_ID --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY
```
where
* `PLATFORMSH_PROJECT_ID` is the project ID for your Platform.sh project
* `GITHUB-USER-TOKEN` is the token you generated in step 1
* `USER` is your GitHub user name
* `REPOSITORY` is the name of the repository in GitHub (not the git address)

Note that if your repository belongs to an organization, use ``--repository=ORGANIZATION/REPOSITORY``.

e.g.
```bash
platform integration:add --type=github --project=abcde12345 --token=xxx --repository=platformsh/platformsh-docs
```

Optional parameters:

* `--fetch-branches`: Track and deploy branches (true by default)
* `--prune-branches`: Delete branches that do not exist in the remote GitHub repository (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-draft-pull-requests`: If set to `true`, [draft pull requests](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) will also have an environment created.
  If false they will be ignored.
  If `--build-pull-requests` is `false` this value is ignored.  (`true` by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR.
  `true` to build the result of merging the PR.  (`false` by default)
* `--pull-requests-clone-parent-data`:
  Set to `false` to disable cloning of parent environment data when creating a PR environment,
  so each PR environment starts with no data. (`true` by default)
* `--base-url`: Only set if using GitHub Enterprise, hosted on your own server.
  If so, set this to the base URL of your private server (the part before the user and repository name).

The CLI will create the necessary webhook for you when there's correct permission set in the given token.

Note that the `--prune-branches` option depends on `--fetch-branches` being enabled.
If `--fetch-branches` is disabled, `--prune-branches` is automatically set to false,
even if specifically set to true.

### 3. Add the webhook

If you see the message `Failed to read or write webhooks`, you need to add a webhook manually:

1. Copy the hook URL shown in the message.
2. Go to your GitHub repository and click Settings, select the Webhooks and Services tab, and click Add webhook.
3. Paste the hook URL, choose `application/json` for the content type,
   choose "Send me everything" for the events you want to receive, and click Add webhook.

You can now start pushing code, creating new branches or opening pull requests directly on your GitHub repository.

Note that if you have created your account using the GitHub oAuth Login then in order to use the Platform CLI,
you need to [setup a password](https://accounts.platform.sh/user/password).

### 4. Validate the integration

You can then verify that your integration is functioning properly [using the CLI](/integrations/overview.md#validating-integrations) command

```bash
platform integration:validate
```

## Types of environments

Environments based on GitHub **pull requests** will have the correct 'parent' environment on Platform.sh;
they will be activated automatically with a copy of the parent's data.

However, environments based on (non-pull-request) **branches** cannot have parents;
they will inherit directly from the default branch and start inactive by default.

{{% clone-commit name="GitHub" %}}
