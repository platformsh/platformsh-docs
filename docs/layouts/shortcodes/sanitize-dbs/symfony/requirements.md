{{ $db := .Get "database" }}
{{ $framework := .Get "framework" }}
{{ $pageLink := printf "%s.md" ( $db | lower ) }}
{{ $cli := "" }}
{{ if eq $db "MySQL" }}
  {{ $pageLink = "mysql/_index.md" }}
{{ end }}
{{ if eq $framework "Drupal" }}
  {{ $cli = "[Drush](https://www.drush.org/latest/install/)" }}
{{ else if eq $db "PostgreSQL" }}
  {{ $cli = "<code>pqsl</code>" }}
{{ end }}
## Before you begin

You need:

- A project with a [{{ $db }} database](../../add-services/{{ $pageLink }}).
- A command interface installed:
  - If doing it manually, the [Symfony CLI](https://symfony.com/download).
  - Otherwise, make sure {{ $cli }} is installed in your environment.

This guide is about sanitizing {{ $db }} databases.

This guide doesn't address:

- Sanitizing NoSQL Databases (such as [MongoDB](../../add-services/mongodb.md))
- Input validation and input sanitization, which both help prevent security vulnerabilities
