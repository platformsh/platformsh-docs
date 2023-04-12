{{ $isSymfony := eq ( .Get "name" ) "Symfony" }}
## Before you begin

You need:

- [Git](https://git-scm.com/downloads).
  Git is the primary tool to manage everything your app needs to run.
  Push commits to deploy changes and control configuration through YAML files.
  These files describe your infrastructure, making it transparent and version-controlled.
- A Platform.sh account.
  If you don't already have one, [register for a trial account](https://auth.api.platform.sh/register).
  You can sign up with an email address or an existing GitHub, Bitbucket, or Google account.
  If you choose one of these accounts, you can set a password for your Platform.sh account later.
- {{ if $isSymfony }}The [Symfony CLI](https://symfony.com/download){{ else }}Optional: the [Platform.sh CLI](/administration/cli/_index.md){{ end }}.
  This lets you interact with your project from the command line.
  You can also do most things through the [Web Console](/administration/web/_index.md),
  but this guide focuses on using the CLI.
