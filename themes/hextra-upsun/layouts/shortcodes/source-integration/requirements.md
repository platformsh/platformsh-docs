<!-- shortcode start {{ .Name }} -->
{{ $source := .Get "source" }}
{{ if eq $source "Bitbucket" }}
  {{ $source = "Bitbucket Cloud or Bitbucket Server" }}
{{ end }}
## Before you begin

To manage source integrations, you need to be a [project admin](../../administration/users.md).

You also need a {{ $source }} repository with working code.
<!-- shortcode end {{ .Name }} -->
