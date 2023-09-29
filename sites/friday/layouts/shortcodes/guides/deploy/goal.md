{{ $framework := .Get 0 }}
{{ $frameworkPath := .Get 1 }}

## Goal 

Whether you are bringing your own {{ $framework }} project with you to migrate to {{ .Site.Params.vendor.name }},
or you are starting from scratch, this guide will take you through installing the necessary tools, 
and configuring infrastructure and resources to deploy {{ $framework }} on {{ .Site.Params.vendor.name }}.

In the end, you will have 

- The {{ .Site.Params.vendor.name }} CLI installed and authenticated locally
- A {{ $framework }} repository locally, either your own or a skeleton provided by {{ .Site.Params.vendor.name }}
- An organization created on {{ .Site.Params.vendor.name }}, containing one project associated with the repository
- A remote repository on GitHub matching your local copy, and integrated with the {{ .Site.Params.vendor.name }} project
- {{ .Site.Params.vendor.name }} configuration added to the repo, and resources defined for a successful deployment
- Migrated data to production if you are bringing your own project

To get started, click the button below.

{{ printf `{{< guides/buttons next="/get-started/%s/deploy/requirements" >}}` $frameworkPath | .Page.RenderString }}
