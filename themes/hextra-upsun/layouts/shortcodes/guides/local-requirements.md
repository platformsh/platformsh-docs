<!-- shortcode start {{ .Name }} -->
{{ $isSymfony := eq ( .Get "name" ) "Symfony" }}
## Before you begin

You need:

- A local copy of the repository for a {{ with .Get "framework" }}[{{ . }}](../deploy/_index.md) {{ end }} project running on {{ .Site.Params.vendor.name }}.

{{ if not $isSymfony }}
  To get one, run <code>{{ `{{< vendor/cli >}}` | .Page.RenderString }} get {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
{{ end }}

  {{ if not $isSymfony }}Alternatively, you can clone{{ else }}You can clone{{ end }} an integrated source repository and set the remote branch.
  To do so, run <code>{{ if $isSymfony }}symfony cloud:{{ else }}{{ `{{< vendor/cli >}}` | .Page.RenderString }} {{ end }}project:set-remote {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
- The {{ if $isSymfony }}[Symfony CLI](https://symfony.com/download){{ else }}[{{ .Site.Params.vendor.name }} CLI](/administration/cli/_index.md){{ end }}
<!-- shortcode end {{ .Name }} -->
