1. Visit the [{{ .Site.Params.vendor.name }} Console]({{ .Site.Params.vendor.urls.console }}).
You will be prompted to create your first organization if you haven't done so already.

1. Click **+ Create project**.

1. Select an organization from the dropdown menu where you want the project to live.
Then click **Connect repository** to migrate your application.

    <!-- ![Apps and services tree](/images/create-project-choices.png ".6") -->

1. Click **Connect with GitHub**.

1. The GitHub app will open in your browser.
Click on the GitHub organization where your repository is located.

1. When authorizing the GitHub app, choose **Only select repositories**, 
and select the repository you want to deploy on {{ .Site.Params.vendor.name }}.

1. Click **Install & Authorize**.

1. The GitHub organization and repository names will now be visible in the {{ .Site.Params.vendor.name }} Console.
Click **Continue**.

1. Update the **Project name** if you'd like. 
The GitHub app should automatically detect your production branch name, but update it if necessary. 
Note that this guide assumes your production branch is called `main`.
Select a region to deploy too - ideally a "Green region" with a lower environmental footprint, signified with a leaf icon {{ printf `{{< icon green >}}` | .Page.RenderString }}.

1. Click **Create project**

1. As the project is initializing, you'll generate a project ID that identifies it. 
Copy and run the command provided in the Console:

    ```bash
    {{ .Site.Params.vendor.cli }} project:set-remote <PROJECT_ID>
    ```

Now that you've connected your GitHub repository to {{ .Site.Params.vendor.name }},
it's time to configure your infrastructure.

{{ printf `{{< guides/buttons next="/get-started/%s/deploy/configure" >}}` ( .Get 0 ) | .Page.RenderString }}
