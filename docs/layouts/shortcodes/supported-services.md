{{ $registry := .Site.Data.registry }}

| Service | `type` | Supported versions |
| ------- | ------ | ------------------ |{{ range sort $registry "type" }}{{ if eq .runtime false }}
| [{{ .name }}]({{ .docs.url }}) | `{{ .type }}` | {{ delimit .versions.supported ", " }} |{{ end }}{{ end }}