{{ $isSymfony := eq ( .Get "name" ) "Symfony" }}
## Before you begin

You will need:

- **[Git](https://git-scm.com/downloads)**.
  
  Git is the primary tool to manage everything your app needs to run.
  Push commits to deploy changes and control configuration through YAML files.
  These files describe your infrastructure, making it transparent and version-controlled.

- **A {{ .Site.Params.vendor.name }} account**.

  If you don't already have one, [register for a trial account]({{ .Site.Params.vendor.urls.register }}).
  You can sign up with an email address or an existing GitHub, Bitbucket, or Google account.
  If you choose one of these accounts, you can set a password for your {{ .Site.Params.vendor.name }} account later.

- **{{ if $isSymfony }}The [Symfony CLI](https://symfony.com/download){{ else }}The [{{ .Site.Params.vendor.name }} CLI](/administration/cli/_index.md){{ end }}**.

  This lets you interact with your project from the command line.
  You can also do most things through the [{{ .Site.Params.vendor.name }} Console](/administration/web/_index.md),
  but this guide focuses on using the CLI.

<!-- Upsun-specific requirements -->
{{ if eq .Site.Params.vendor.config.version 2 }}

## Setting up an organization

When you register for {{ .Site.Params.vendor.name }} for the first time, you will be directed to create an **organization** - the top-level organizing principle on {{ .Site.Params.vendor.name }} - under which many teams of users and projects can be associated. 
To complete any of the getting started steps below, you will need to create that initial organization before going further.

{{ $title := "A note on trials" }}
{{ $theme := "info" }}
{{ $inner := "Within trial periods, it is necessary that a credit card is associated with your account in order to create an organization." }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}

## Recommended: Explore {{ .Site.Params.vendor.name }} with a demo project

Before moving on to the framework-specific Getting Started guides below, it is _strongly recommended_ that you first go through the {{ .Site.Params.vendor.name }} demo project. 
The project is a guided tour of many of the common CLI commands as well as the foundational concepts behind working with {{ .Site.Params.vendor.name }}.

To start the demo project:

1. Visit the [{{ .Site.Params.vendor.name }} Console]({{ .Site.Params.vendor.urls.register }})
1. In the top right-hand corner, choose **+ Create Project**.
1. You'll then be presented with three options for creating the new project. 
    Choose the **Demo project** option by selecting **Explore {{ .Site.Params.vendor.name }}**.
    You can select the organization you created in the previous step from the top dropdown.

    ![Apps and services tree](/images/create-project-choices.png "1.0")

{{ end }}