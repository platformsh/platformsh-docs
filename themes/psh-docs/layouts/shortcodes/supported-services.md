<!-- shortcode start {{ .Name }} -->
{{ $baseURL := .Site.Params.registryBaseURL }}
{{- $remote := resources.GetRemote $baseURL -}}
{{- $registry := dict -}}

{{- if and $remote $remote.Content -}}
  {{- $registry = $remote.Content | transform.Unmarshal | default dict -}}

| Service | `type` | Supported versions |
| ------- | ------ | ------------------ |
{{- range sort $registry "type" }}
{{- if eq .runtime false }}
| [{{ .name }}]({{ .docs.url }}){{ if .premium }} {{ partial "premium-features/badge" }}{{ end }} | `{{ .type }}` | {{ delimit .versions.supported ", " }} |
{{- end }}
{{- end }}
{{- end -}}
<!-- shortcode end {{ .Name }} -->
