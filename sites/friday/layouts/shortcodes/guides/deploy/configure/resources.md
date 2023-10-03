## Allocate preview resources

In the [{{ .Site.Params.vendor.name }} Console]({{ .Site.Params.vendor.urls.console }}), you'll see two new things:

- an _inactive_ environment for the branch you've committed to
- an _active_ environment for the pull request you've opened

There are other was to setup a source integration, but this is the default behavior.

![Production environment](/images/pr-env.png ".4")

In the **Activity** section, you'll see a failed activity:

<div style="text-align: center">

{{ printf `{{< icon failure >}}` | .Page.RenderString }} **GitHub integration** pushed to **PR #1 Add {{ .Site.Params.vendor.name }} configuration**

</div>

On the failed {{ printf `{{< icon failure >}}` | .Page.RenderString }} push activity, click on {{ printf `{{< icon more >}}` | .Page.RenderString }} **More**, then **View log**.
At the end of the build and deploy phases, at the bottom of the logs, 
you will see the activity failed with a message similar to the below:

{{ .Inner }}

You see this message because while you have pushed infrastructure configuration to {{ .Site.Params.vendor.name }}, {{ .Site.Params.vendor.name }} doesn't yet know how much disk, CPU, and memory to allocated to those containers. 

Run the following command:

```bash
{{ .Site.Params.vendor.cli }} resources:set
```

Follow the prompts to configure and confirm resources for each of the containers in the environment.
Once you have done so, {{ .Site.Params.vendor.name }} will reuse the build image created during the previous push to deploy the application on the infrastructure you've just defined.

When the activity has completed, the environment's URL will be accessible from the integration status link on GitHub,
or with the command:

```bash
{{ .Site.Params.vendor.cli }} url -e pr-1 --primary
```

making sure to replace the environment name `pr-1` with the pull request number you've opened, if different. 

## Promote to production

With the steps above complete, you're just two short steps away from moving what you've worked on to production.

1. **Merge**. On GitHub, merge the pull request.

1. **Reconfigure tested resources**. Notice that you once again receive the following error, this time for the production environment `main`:

{{ .Inner }}

Same as before, configure and confirm production resources using the following command:

```bash
{{ .Site.Params.vendor.cli }} resources:set
```

Congrats! 
You’ve now successfully deployed a production {{ .Page.Params.framework }} application on {{ .Site.Params.vendor.name }}! 

Take a moment to visit your site and test it out.
When your ready to continue expanding your {{ .Page.Params.framework }} workflow on {{ .Site.Params.vendor.name }}, explore some of the additional topics available below.

{{ printf `{{< guides/steps desc="true" title="More topics" skipFirst="true" root="/get-started/django" >}}` | .Page.RenderString }}
