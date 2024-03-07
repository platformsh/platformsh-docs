<!-- shortcode start {{ .Name }} -->
## Relationship reference
{{ if eq .Site.Params.vendor.config.version 1 }}
Example information available through the [`{{ .Page.Site.Params.vendor.env_prefix }}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables)
or by running `{{ .Page.Site.Params.vendor.cli }} relationships`.
{{ else}}
For each service [defined via a relationship](#usage-example) to your application,
{{ .Page.Site.Params.vendor.name }} automatically generates corresponding environment variables within your application container,
in the `$"RELATIONSHIP-NAME"_"SERVICE-PROPERTY"` format.

Here is example information available through the [service environment variables](/development/variables/_index.md#service-environment-variables) themselves,
or through the [`{{ .Page.Site.Params.vendor.env_prefix }}_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables).
{{ end }}
<!-- shortcode end {{ .Name }} -->
