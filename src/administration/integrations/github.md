# GitHub

The [GitHub](https://github.com) integration allows you to manage your
Platform.sh environments directly from your GitHub repository.

Features supported:

* Create a new environment when creating a branch or opening a
    pull request on GitHub.
* Rebuild the environment when pushing new code to GitHub.
* Delete the environment when merging a pull request.

## Setup

### 1. Generate a token

To integrate your Platform.sh project with an existing GitHub
repository, you first need to generate a token on your GitHub user
profile. Simply go to your account page on GitHub and click
`Edit profile`.

Select the *Personal access tokens* tab and click on [Generate new
token](https://github.com/settings/tokens/new).

Give it a description and then ensure the token has the following scopes:

-   To integrate with public repositories: `public_repo`
-   To integrate with your own private repositories: `repo`
-   To integrate with your organization's private repositories: `repo`
    and `read:org`

Copy the token and make a note of it (temporarily).

Note that for the integration to work, your GitHub user needs to have permission to push code to the repository.

### 2. Enable the integration

Note that only `project owner` or `project admin` can manage the integrations.

Open a terminal window (you need to have the Platform.sh CLI installed). Enable the GitHub integration as follows:

```bash
platform integration:add --type=github --project=PROJECT_ID --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY --build-pull-requests=true --fetch-branches=false
```

Optional parameters:
* `fetch-branches`: Track and deploy branches (true by default)
* `build-pull-requests`: Track and deploy pull-requests (true by default)

Note that if your repository belongs to an organization, use ``--repository=ORGANISATION/REPOSITORY``.

### 3. Add the webhook

Copy the Payload URL that is returned by the previous command.

Go to your GitHub repository and click `Settings`. Select the *Webhooks
and Services* tab and click `Add webhook`. Paste the Payload URL, Choose
"Send me everything" for the events you want to receive and click
`Add webhook`.

You can now start pushing code, creating new branches or opening pull
requests directly on your GitHub repository.

Note that if you have created your account using the GitHub oAuth Login then in order to use the Platform CLI, you will need to [setup a password](https://accounts.platform.sh/user/password).

## Types of environments

Environments based on GitHub **pull requests** will have the correct 'parent' environment on Platform.sh; they will be activated automatically with a copy of the parent's data.

However, environments based on (non-pull-request) **branches** cannot have parents; they will inherit directly from `master` and start inactive by default.
