Once you have fulfilled the requirements on the previous page, you have two options for the deployment.

1. If you are starting from nothing - you are just trying out {{ .Site.Params.vendor.name }} for the first time and seeing how it works - you'll need to generate a repository to deploy. 
If that's the case for you, click the button below to proceed to setting up an initial {{ .Page.Params.framework }} codebase.
Even if you are bringing your own codebase, this starter project will be used alongside instructions as an example, so feel free to follow along.

{{ `{{< guides/buttons next="#start-from-scratch" text="Start from scratch" >}}` | .Page.RenderString }}

2. You already have a {{ .Page.Params.framework }} codebase you want to deploy on {{ .Site.Params.vendor.name }} hosted on GitHub. 
If that's the case for you, click the button below to proceed to integrating your custom codebase with {{ .Site.Params.vendor.name }}.

{{ `{{< guides/buttons next="#migrate-your-codebase" text="Migrate your codebase" >}}` | .Page.RenderString }}