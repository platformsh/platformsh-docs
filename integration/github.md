# GitHub

The [GitHub](https://github.com) integration allows you to manage your
Platform.sh environments directly from your GitHub repository.

Supported:

-   Create a new environment when creating a Git branch or opening a
    pull request.
-   Rebuild an environment when pushing code to a Git branch or a pull
    request.
-   Delete an environment when merging a pull request.

To integrate your Platform.sh project with an existing GitHub
repository, you first need to generate a token on your GitHub user
profile. Simply go to your account page on GitHub and click
`Edit profile`.

Select the *Applications* tab and click [Generate new
token](https://github.com/settings/tokens/new) in the *Personal access
tokens* section.

Give it a description and then ensure the token has the following
scopes:

-   To integrate with public repositories: `public_repo`
-   To integrate with your own private repositories: `repo`
-   To integrate with your organization's private repositories: `repo`
    and `read:org`

Copy the token and make a note of it (temporarily).

Note that for the integration to work, your GitHub user needs to have
permission to push code to the repository.

Now open a command line (you need to have the Platform.sh CLI
installed). To enable the GitHub integration with the CLI:

```bash
platform integration:add --type=github --token=GITHUB-USER-TOKEN --repository=USER/REPOSITORY
```

The two optional parameters, which are both enabled by default, control
whether you want to track branches and/or pull requests:

-   `--build-pull-requests` [true | false]
-   `--fetch-branches` [true | false]

This command returns the Payload URL that you need to paste on your
Github repository webhooks page.

Go to your GitHub repository and click `Settings`. Select the *Webhooks
and Services* tab and click `Add webhook`. Paste the Payload URL, Choose
"Just send me everything" for the events you want to receive. and click
`Add webhook`.

You can now start pushing code, creating new branches or opening pull
requests directly on your GitHub repository.