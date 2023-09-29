Once you have fulfilled the requirements on the previous page, you have two options for the deployment.

1. First, you already have an Express codebase you want to deploy on {{ .Site.Params.vendor.name }} - something you have cloned locally and/or pushed to an external Git hosting provider like GitHub. 
If that's the case for you, click the button below to proceed to integrating your custom codebase with {{ .Site.Params.vendor.name }}.

{{ `{{< guides/buttons next="#connect-a-repository" text="Connect your code base" >}}` | .Page.RenderString }}

2. Second, if your are starting from nothing - you are just trying out {{ .Site.Params.vendor.name }} for the first time and seeing how it works - you'll need to generate a repository to deploy. 
Even if you are bringing your own codebase, this starter project will be used alongside instructions as an example.
If that's the case for you, click the button below to proceed to setting up an initial {{ .Page.Params.framework }} codebase.

{{ `{{< guides/buttons next="#generate-a-repository" text="Generate starter code" >}}` | .Page.RenderString }}
