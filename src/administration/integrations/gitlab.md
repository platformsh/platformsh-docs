# GitLab

The [GitLab](https://gitlab.com) integration allows you to manage your
Platform.sh environments directly from your GitLab repository.

Features supported:

* Create a new environment when creating a branch or opening a
    pull request on GitLab.
* Rebuild the environment when pushing new code to GitLab.
* Delete the environment when merging a pull request.

## Setup

### 1. Generate a token

To integrate your Platform.sh project with an existing GitLab
repository, you first need to generate a token on your GitLab user
profile. Simply go to your Settings page on GitLab and click
`Access Tokens`.

Fill the `Name` field for example with "Platform.sh Integration" and optionally
set an expiration time.

Give it a description and then ensure the token has the following scopes:

 * `api`  - Access your API
 * `read_user` - Read user information
 * `read_registry` - Read Registry

Copy the token and make a note of it (temporarily).

Note that for the integration to work, your GitLab user needs to have permission to push code to the repository.

### 2. Enable the integration

Note that only `project owner` or `project admin` can manage the integrations.

Open a terminal window (you need to have the Platform.sh CLI installed). Enable the GitLab integration as follows:

```bash
platform integration:add --type=gitlab --token=THE-TOKEN-YOU-WROTE-DOWN --base-url=https://THE-URL-OF-YOUR-GITLAB/ --gitlab-project=MY-NAMESPACE/MY-PROJECTNAME
```

Optional parameters:
* `--fetch-branches`: Track and deploy branches (true by default)
* `--build-merge-requests`: Track and deploy merge-requests (true by default)
* `--merge-requests-clone-parent-data` : should merge requests clone the data from the parent environment (true by default)

### 3. Add the webhook

The previous command, if succesful should output the configuration of the integration. The last element would look like
```| hook_url                         | https://{region}.platform.sh/api/projects/{projectid}/integrations/{hook_id}/hook |`

Now, copy the hook URL 

Go to your GitLab repository and click `Settings > Integrations` and paste the Payload URL, in the Triggers secrion choose 
`Push events`, `Tag push events` and `Merge Request events`. And click on `Add bebhook`.

You can now start pushing code, creating new branches or opening merge
requests directly on your GitLab repository. You will see environments get automatically created and updated on the Platform.sh side.


## Types of environments

Environments based on GitLab **merge requests** will have the correct 'parent' environment on Platform.sh; they will be activated automatically with a 
copy of the parent's data (unless you have set the option `merge-requests-clone-parent-data` to false).

However, environments based on (non-merge-request) **branches** cannot have parents; they will inherit directly from `master` and start inactive by default.
