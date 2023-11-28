<!-- shortcode start {{ .Name }} -->
{{ $registry := .Site.Data.registry }}

| Service | `type` | Supported versions |
| ------- | ------ | ------------------ |{{ range sort $registry "type" }}{{ if eq .runtime false }}
| [{{ .name }}]({{ .docs.url }}){{ if .premium }} {{ partial "premium-features/badge" }}{{ end }} | `{{ .type }}` | {{ delimit .versions.supported ", " }} |{{ end }}{{ end }}
<!-- shortcode end {{ .Name }} -->
