{{ if and ( eq ( .Get "version" ) "2" ) ( eq .Site.Params.vendor.config.version 2 ) }}

{{ $servicesBundle := .Site.GetPage "/add-services" }}
{{ range $servicesBundle.Pages }}
{{ $suffix := "use-in-app" }}
{{ if eq .File.Path "add-services/network-storage.md" }}
    {{ $suffix = "usage-example" }}
{{ else if eq .File.Path "add-services/vault.md" }}
    {{ $suffix = "use-vault-kms" }}
{{ else if eq .File.Path "add-services/varnish.md" }}
    {{ $suffix = "usage-example" }}
{{ end }}
- [{{ if .Params.sidebarTitle}}{{ .Params.sidebarTitle }}{{ else }}{{ .Title }}{{ end }}]({{ .RelPermalink }}#{{ $suffix }})
{{ end }}

{{ end }}
