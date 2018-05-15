# GitHub

The [GitHub](https://github.com) integration allows you to manage your Platform.sh environments directly from your GitHub repository.

Features supported:

* Create a new environment when creating a branch or opening a pull request on GitHub.
* Rebuild the environment when pushing new code to GitHub.
* Delete the environment when merging a pull request.

## Setup

### 1. Generate a token

To integrate your Platform.sh project with an existing GitHub repository, you first need to generate a token on your GitHub user profile. Simply go to your Settings, then select `Developer settings` and click `Personal access tokens`. Here you can [Generate a new token](https://github.com/settings/tokens/new).

Give it a description and then ensure the token has the following scopes:

* To integrate with public repositories: `public_repo`
* To integrate with your own private repositories: `repo`
* To integrate with your organization's private repositories: `repo`
    and `read:org`

Copy the token and make a note of it (temporarily).

Note that for the integration to work, your GitHub user needs to have permission to push code to the repository.

### 2. Enable the integration

Note that only the project owner can manage integrations.

Open a terminal window (you need to have the Platform.sh CLI installed). Enable the GitHub integration as follows:

```bash
platform integration:add --type=github --project=PROJECT_ID --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY
```

Optional parameters:
* `--fetch-branches`: Track and deploy branches (true by default)
* `--build-pull-requests`: Track and deploy pull-requests (true by default)
* `--build-pull-requests-post-merge`: `false` to have Platform.sh build the branch specified in a PR. `true` to build the result of merging the PR.  (`false` by default)
* `--pull-requests-clone-parent-data`: Set to `false` to disable cloning of parent environment data when creating a PR environment, so each PR environment starts with no data. (`true` by default)

Note that if your repository belongs to an organization, use ``--repository=ORGANIZATION/REPOSITORY``.

### 3. Add the webhook

The CLI will create the necessary webhook for you when there's correct permission set in the given token. If you see the message `Failed to read or write webhooks`, you will need to add a webhook manually:

1. Copy the hook URL shown in the message.
2. Go to your GitHub repository and click Settings, select the Webhooks and Services tab, and click Add webhook.
3. Paste the hook URL, choose application/json for the content type, choose "Send me everything" for the events you want to receive, and click Add webhook.


You can now start pushing code, creating new branches or opening pull requests directly on your GitHub repository.

Note that if you have created your account using the GitHub oAuth Login then in order to use the Platform CLI, you will need to [setup a password](https://accounts.platform.sh/user/password).

## Types of environments

Environments based on GitHub **pull requests** will have the correct 'parent' environment on Platform.sh; they will be activated automatically with a copy of the parent's data.

However, environments based on (non-pull-request) **branches** cannot have parents; they will inherit directly from `master` and start inactive by default.
