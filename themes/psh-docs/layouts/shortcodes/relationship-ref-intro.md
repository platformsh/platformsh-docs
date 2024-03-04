<!-- shortcode start {{ .Name }} -->
## Relationship reference
{{ if eq .Site.Params.vendor.config.version 1 }}
Example information available through the [`{{ .Page.Site.Params.vendor.env_prefix }}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{ .Page.Site.Params.vendor.cli }} relationships`.
{{ else}}
Example information available through the [service environment variables](/development/variables/_index.md#service-specific-variables) or through the [`{{ .Page.Site.Params.vendor.env_prefix }}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
{{ end }}
<!-- shortcode end {{ .Name }} -->
