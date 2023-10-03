## Current status

Go to the [{{ .Site.Params.vendor.name }} Console]({{ .Site.Params.vendor.urls.console }}), locate and click on your project. 
You can also find the direct location of your project by running the following command:

```bash
{{ .Site.Params.vendor.cli }} web
```

From the project view you will see under the **Environments** list, an environment for your default branch:

![Production environment](/images/prod.png "0.2")

Click on the **Main** environment.

Near the bottom of the page, you'll see the **Activity** section.
Under **Recent** activities, you'll see two activities listed:

- {{ printf `{{< icon success >}}` | .Page.RenderString }} **{{ .Site.Params.vendor.name }}** created a new project [**Your project name**]
- {{ printf `{{< icon failure >}}` | .Page.RenderString }} **GitHub integration** pushed to **Main**

On the failed {{ printf `{{< icon failure >}}` | .Page.RenderString }} push activity, click on {{ printf `{{< icon more >}}` | .Page.RenderString }} **More**, then **View log**.
You will see the activity failed with the following message.

```bash
Found 1 commit

E: Error parsing configuration files:
    - : Configuration directory '{{ .Site.Params.vendor.config.dir }}' not found.

E: Error: Invalid configuration files, aborting build
```

The activity has failed because you haven't yet defined your infrastructure, builds, or deploys, which all takes place in the configuration file `{{ .Site.Params.vendor.config.files.app }}`.
