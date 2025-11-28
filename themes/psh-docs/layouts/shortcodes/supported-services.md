<!-- shortcode start {{ .Name }} -->
{{ $registry := .Site.Data.registry }}
{{ $currentPlatform := .Site.Params.vendor.altname }}

| Service | `type` | Supported versions |
| ------- | ------ | ------------------ |{{ range sort $registry "type" }}{{ if and (eq .runtime false) (not (in .exclude_from $currentPlatform)) }}
| [{{ .name }}]({{ .docs.url }}){{ if .premium }} {{ partial "premium-features/badge" }}{{ end }} | `{{ .type }}` | {{ delimit .versions.supported ", " }} |{{ end }}{{ end }}
<!-- shortcode end {{ .Name }} -->
