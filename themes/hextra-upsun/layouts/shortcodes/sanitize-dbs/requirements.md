<!-- shortcode start {{ .Name }} -->
{{ $db := .Get "database" }}
{{ $framework := .Get "framework" }}
{{ $pageLink := printf "%s.md" ( $db | lower ) }}
{{ if eq $db "MySQL" }}
  {{ $pageLink = "mysql/_index.md" }}
{{ end }}
{{ $cli := "<code>pqsl</code>" }}
{{ if eq $framework "Drupal" }}
  {{ $cli = "[Drush](https://www.drush.org/latest/install/)" }}
{{ end }}
{{ $cliLink := "[Platform CLI](../../administration/cli/_index.md)" }}
{{ if eq $.Site.Params.vendor.config.version 2 }}
  {{ $cliLink = "[Upsun CLI](../../administration/cli/_index.md)" }}
{{ end }}
{{ if eq $framework "Symfony" }}
  {{ $cliLink = "[Symfony CLI](https://symfony.com/download)" }}
{{ end }}
## Before you begin

You need:

- A project with a [{{ $db }} database](../../add-services/{{ $pageLink }}).
- A command interface installed:
  - If doing it manually, the {{ $cliLink }}.
  - Otherwise, make sure {{ $cli }} is installed in your environment.

This guide is about sanitizing {{ $db }} databases.

This guide doesn't address:

- Sanitizing NoSQL Databases (such as [MongoDB](../../add-services/mongodb.md))
- Input validation and input sanitization, which both help prevent security vulnerabilities
<!-- shortcode end {{ .Name }} -->
