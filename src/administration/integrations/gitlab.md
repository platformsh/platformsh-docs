# GitLab

The [GitLab](https://gitlab.com) integration allows you to manage your Platform.sh environments directly from your GitLab repository.

Features supported:

- Create a new environment when creating a branch or opening a pull request on GitLab.
- Rebuild the environment when pushing new code to GitLab.
- Delete the environment when merging a pull request.

## Setup

### 1. Generate a token

To integrate your Platform.sh project with an existing GitLab repository, you first need to generate a token on your GitLab user profile. Simply go to your Settings page on GitLab and click `Access Tokens`.

Fill the `Name` field for example with "Platform.sh Integration" and optionally set an expiration time.

Give it a description and then ensure the token has the following scopes:

- `api` - Access your API
- `read_user` - Read user information
- `read_repository` - Read repositories

Copy the token and make a note of it (temporarily).

Note that for the integration to work, your GitLab user needs to have permission to push code to the repository.

### 2. Enable the integration

Note that only `project owner` or `project admin` can manage the integrations.

Open a terminal window (you need to have the Platform.sh CLI installed). Enable the GitLab integration as follows:

```bash
platform integration:add --type=gitlab --token=THE-TOKEN-YOU-WROTE-DOWN --base-url=https://THE-URL-OF-YOUR-GITLAB --gitlab-project=MY-NAMESPACE/MY-PROJECTNAME
```

Please note that the `--base-url` option is used as the base to call the Gitlab API; you should point it to `https://gitlab.com` if your project is hosted on Gitlab, or the URL for your own Gitlab instance otherwise.
Do **not** append your namespace and project name!

Optional parameters:

- `--build-merge-requests`: Track and deploy merge-requests (true by default)
- `--merge-requests-clone-parent-data` : should merge requests clone the data from the parent environment (true by default)
- `--fetch-branches`: Track and deploy branches (true by default)
- `--prune-branches`: Delete branches that do not exist in the remote GitLab repository (true by default)

Note that the `--prune-branches` option depends on `--fetch-branches` being enabled. If `--fetch-branches` is disabled, `--prune-branches` will automatically be set to false, even if specifically set to true.

### 3. Add the webhook

The previous command, if successful should output the configuration of the integration. The last element would look like:

```
| hook_url | https://{region}.platform.sh/api/projects/{projectid}/integrations/{hook_id}/hook |
```

The CLI will create the necessary webhook using the above URL for you when there's correct permission set in the given token. If you see the message `Failed to read or write webhooks`, you will need to add a webhook manually:

1. Copy the hook URL shown in the message.
2. Go to your GitLab repository and click Settings > Integrations.
3. Paste the hook URL. In the Triggers section choose Push events, Tag push events and Merge Request events. Click on Add webhook.

You can now start pushing code, creating new branches or opening merge requests directly on your GitLab repository. You will see environments get automatically created and updated on the Platform.sh side.

## Types of environments

Environments based on GitLab **merge requests** will have the correct 'parent' environment on Platform.sh; they will be activated automatically with a copy of the parent's data (unless you have set the option `merge-requests-clone-parent-data` to false).

However, environments based on (non-merge-request) **branches** cannot have parents; they will inherit directly from `master` and start inactive by default.
