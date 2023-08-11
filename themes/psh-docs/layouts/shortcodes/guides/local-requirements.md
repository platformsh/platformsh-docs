{{ $isSymfony := eq ( .Get "name" ) "Symfony" }}
## Before you begin

You need:

- A local copy of the repository for a {{ with .Get "framework" }}[{{ . }}](../deploy/_index.md) {{ end }} project running on Platform.sh.

{{ if not $isSymfony }}
  To get one, run <code>platform get {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
{{ end }}

  {{ if not $isSymfony }}Alternatively, you can clone{{ else }}You can clone{{ end }} an integrated source repository and set the remote branch. 
  To do so, run <code>{{ if $isSymfony }}symfony cloud:{{ else }}platform {{ end }}project:set-remote {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
- The {{ if $isSymfony }}[Symfony CLI](https://symfony.com/download){{ else }}[Platform.sh CLI](/administration/cli/_index.md){{ end }}
