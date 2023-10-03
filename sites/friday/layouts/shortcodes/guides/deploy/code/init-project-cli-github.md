1. Before we can deploy our application, we’ll need to create a new project on {{ .Site.Params.vendor.name }}. 
From the command line:

    ```bash
    {{ .Site.Params.vendor.cli }} project:create
    ```

    The {{ .Site.Params.vendor.name }} CLI will now walk you through the creation of a project asking you for your organization, the project’s title, the region where you want the application housed, and the branch name (use the same one we set earlier).

    For now, allow the {{ .Site.Params.vendor.name }} CLI to set {{ .Site.Params.vendor.name }} as your repository’s remote, and then select `Y` to allow the tool to create the project.

    The {{ .Site.Params.vendor.name }} bot will begin the generation of your {{ .Site.Params.vendor.name }} project and once done, will report back the details of your project including the project’s ID, and URL to where you can manage the project from the Upsun web console.

    Don’t worry if you forget any of this information; you can retrieve it later with the CLI.
    You can retrieve the project ID, for example, with the following command

    ```bash
    {{ .Site.Params.vendor.cli }} project:info id
    ```

    <!-- And you can launch the web console for your project at any time by doing:

    ```bash
    {{ .Site.Params.vendor.cli }} web
    ``` -->

1. To integrate your {{ .Site.Params.vendor.name }} project with an existing GitHub repository,
you need to [generate a new token](https://github.com/settings/tokens/new).
You can generate a classic personal access token,
or a [fine-grained personal access token](https://github.blog/changelog/2022-10-18-introducing-fine-grained-personal-access-tokens/)
for even greater control over the permissions you grant.

    Create a new token, and be sure to configure the correct scope according to the tables below.

    For **classic personal access tokens**:

    | Scope                 | Purpose                                                                |
    | --------------------- | ---------------------------------------------------------------------- |
    | `admin:repo_hook`     | To create webhooks for events in repositories. Always needed.          |
    | `public_repo`         | To integrate with public repositories.                                 |
    | `repo`                | To integrate with your private repositories.                           |
    | `repo` and `read:org` | To integrate with private repositories in organizations you belong to. |

    For fine-grained personal access tokens:

    | Permission        | Access level    |
    | ------------------| ----------------|
    | `Commit statuses` | Read and write  |
    | `Contents`        | Read and write  |
    | `Metadata`        | Read-only       |
    | `Pull request`    | Read and write  |
    | `Webhooks`        | Read and write  |

    After you've set the needed scopes or permissions, generate and copy your token.

1. Lastly, use the GitHub token and the {{ .Site.Params.vendor.name }} project ID to configure the integration.
Select all of the default options your are prompted after running the commands.

    ```bash
    {{ .Site.Params.vendor.cli }} integration:add \
        --project PROJECT_ID \
        --type github \
        --repository YOUR_GITHUB_USERNAME/REPOSITORY \
        --token GITHUB_ACCESS_TOKEN 
    ```

Now that you've connected your GitHub repository to {{ .Site.Params.vendor.name }},
it's time to configure your infrastructure.

{{ printf `{{< guides/buttons next="/get-started/%s/deploy/configure" >}}` ( .Get 0 ) | .Page.RenderString }}
