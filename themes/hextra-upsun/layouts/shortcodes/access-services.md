<!-- shortcode start {{ .Name }} -->
{{ if and ( eq ( .Get "version" ) "2" ) ( eq .Site.Params.vendor.config.version 2 ) }}

You can access service credentials to connect to [managed services](/add-services/) from environment variables present in the application container.
Consult each of the individual service documentation to see how to retrieve and surface credentials into your application.

{{ $servicesBundle := .Site.GetPage "/add-services" }}
{{ range $servicesBundle.Pages }}
{{ $suffix := "use-in-app" }}
{{ if eq .File.Path "add-services/network-storage.md" }}
    {{ $suffix = "usage-example" }}
{{ else if eq .File.Path "add-services/vault.md" }}
    {{ $suffix = "use-vault-kms" }}
{{ else if eq .File.Path "add-services/varnish.md" }}
    {{ $suffix = "usage-example" }}
{{ else if eq .File.Path "add-services/gotenberg.md" }}
    {{ $suffix = "usage-example" }}
{{ else if eq .File.Path "add-services/clickhouse.md" }}
    {{ $suffix = "usage-example" }}
{{ end }}
- [{{ if .Params.sidebarTitle}}{{ .Params.sidebarTitle }}{{ else }}{{ .Title }}{{ end }}]({{ .RelPermalink }}#{{ $suffix }})
{{ end }}

{{ end }}
<!-- shortcode end {{ .Name }} -->
