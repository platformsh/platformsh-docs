{{ $isSymfony := eq ( .Get "name" ) "Symfony" }}
## Before you begin

You will need:

- **[Git](https://git-scm.com/downloads)**.
  
  Git is the primary tool to manage everything your app needs to run.
  Push commits to deploy changes and control configuration through YAML files.
  These files describe your infrastructure, making it transparent and version-controlled.

- **A {{ .Site.Params.vendor.name }} account**.

{{ if eq .Site.Params.vendor.config.version 1 }}  
  If you don't already have one, [register for a trial account]({{ .Site.Params.vendor.urls.register }}).
  You can sign up with an email address or an existing GitHub, Bitbucket, or Google account.
  If you choose one of these accounts, you can set a password for your {{ .Site.Params.vendor.name }} account later.
{{ else }}
  If you don't already have one, register for a trial account. 
  During the closed Beta period, you will receive an invite to set up your account.
  You can sign up with an email address or an existing GitHub, Bitbucket, or Google account.
  If you choose one of these accounts, you can set a password for your {{ .Site.Params.vendor.name }} account later.
{{ end }}


- **{{ if $isSymfony }}The [Symfony CLI](https://symfony.com/download){{ else }}The [{{ .Site.Params.vendor.name }} CLI](/administration/cli/_index.md){{ end }}**.

  This lets you interact with your project from the command line.
  You can also do most things through the [{{ .Site.Params.vendor.name }} Console](/administration/web/_index.md),
  but this guide focuses on using the CLI.

  To install the CLI:

{{ if eq .Site.Params.vendor.config.version 1 }}  

  * Use the installation script

    ```bash
    curl -fsSL https://raw.githubusercontent.com/platformsh/cli/main/installer.sh | bash
    ```

  * Using Homebrew

    ```bash
    brew install platformsh/tap/platformsh-cli
    ```

  * Using Scoop

    ```bash
    scoop bucket add platformsh https://github.com/platformsh/homebrew-tap.git
    scoop install platform
    ```

{{ else if eq .Site.Params.vendor.config.version 2 }}

  * Use the installation script

    ```bash
    curl -fsSL https://raw.githubusercontent.com/platformsh/cli/main/installer.sh | VENDOR=upsun bash
    ```

  * Using Homebrew

    ```bash
    brew install platformsh/tap/upsun-cli
    ```

  * Using Scoop

    ```bash
    scoop bucket add platformsh https://github.com/platformsh/homebrew-tap.git
    scoop install upsun
    ```

{{ end }}

<!-- Upsun-specific requirements -->
{{ if eq .Site.Params.vendor.config.version 2 }}

## Setting up an organization

When you register for {{ .Site.Params.vendor.name }} for the first time, you will be directed to create an **organization** - the top-level organizing principle on {{ .Site.Params.vendor.name }} - under which many teams of users and projects can be associated. 
To complete any of the getting started steps below, you will need to create that initial organization before going further.

{{ $title := "A note on trials" }}
{{ $theme := "info" }}
{{ $inner := "Within trial periods, it is necessary that a credit card is associated with your account in order to create an organization." }}
{{ partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) }}

If you have created an account, but not yet created an organization, you can do so with the following command:

```bash
upsun org:create
```

{{ end }}