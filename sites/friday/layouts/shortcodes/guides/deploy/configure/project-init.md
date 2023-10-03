## Add {{ .Site.Params.vendor.name }} configuration files

Before attempting the next commands, make sure you have the {{ .Site.Params.vendor.name }} CLI installed, working, and authenticated with your {{ .Site.Params.vendor.name }} account.

1. In your local repository, create a new branch

    ```bash
    git checkout -b {{ .Site.Params.vendor.cli }}ify
    ```

1. Run the command:

    ```bash
    {{ .Site.Params.vendor.cli }} project:init
    ```

    The {{ .Site.Params.vendor.name }} CLI will now ask you a series of questions to determine your project’s requirements:

    ```bash
    $ {{ .Site.Params.vendor.cli }} project:init

    Welcome to Upsun!
    
    Let's get started with a few questions.

    We need to know a bit more about your project. This will only take a minute!
    ```

<!-- Framework-specific -->

{{ .Inner }}

<!-- End of framework specific -->

1. **Commit & push**. With your configuration in place, commit the changes:

    ```bash
    git add . && git commit -m "Add {{ .Site.Params.vendor.name }} configuration."
    ```

    Then push to your repository:

    ```bash
    {{ .Site.Params.vendor.cli }} push
    ```

    If the CLI asks you follow-up questions at this point, be sure to choose `{{ .Site.Params.vendor.cli }}ify` as the target branch, but choose **No** if it asks you to activate the environment. 
    You will do this in a later step.

1. Go to your repository on GitHub, and open a pull request for the `{{ .Site.Params.vendor.cli }}ify` branch.

You've committed all the configuration you need to deploy {{ .Page.Params.framework }} on {{ .Site.Params.vendor.name }} at this point. 
You'll notice, however, that once the build and deploy has finished - the integration on your pull request has failed.

![Production environment](/images/pr-failure.png ".5")

What gives?

While you've _committed_ all that's necessary to deploy {{ .Page.Params.framework }} on {{ .Site.Params.vendor.name }}, {{ .Site.Params.vendor.name }} doesn't yet know _how much_ resources you want for the containers you're trying to deploy. 

All that's left is to define those resources, and you will have finished your first deployment on {{ .Site.Params.vendor.name }}. 
