<!-- shortcode start {{ .Name }} -->
{{ $db := .Get "database" }}
{{ $pageLink := printf "%s.md" ( $db | lower ) }}
{{ if eq $db "MySQL" }}
  {{ $pageLink = "mysql/_index.md" }}
{{ end }}
{{ $cliCommand := `{{< vendor/cli >}}` | .Page.RenderString }}
{{ if eq ( .Get "framework" ) "Symfony" }}
  {{ $cliCommand = "symfony" }}
{{ end }}
## Sanitize the database

Make sure that you only sanitize preview environments and **never** the production environment.
Otherwise you may lose most or even all of the relevant data stored in your database.

First, take a [database dump](../../add-services/{{ $pageLink }}#exporting-data) of your preview environment.
This is just a safety precaution.
Production data isn't altered.
To get a database dump, run the following command:
<code>{{ $cliCommand }} db:dump -e {{ `{{< variable "DEVELOPMENT_ENVIRONMENT_NAME" >}}` | .Page.RenderString }}</code>.
<!-- shortcode end {{ .Name }} -->
