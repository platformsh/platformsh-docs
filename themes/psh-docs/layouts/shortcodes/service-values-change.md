<!-- shortcode start {{ .Name }} -->
{{ if eq .Site.Params.vendor.config.version 1 }}
Note that the information about the relationship can change when an app is redeployed or restarted
or the relationship is changed.
So your apps should only rely on the `{{ .Page.Site.Params.vendor.env_prefix }}_RELATIONSHIPS` environment variable directly rather than hard coding any values.
{{ else }}
You can obtain the complete list of available service environment variables in your app container by running `{{ .Site.Params.vendor.cli }} ssh env`.

Note that the information about the relationship can change when an app is redeployed or restarted
or the relationship is changed.
So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-environment-variables) directly rather than hard coding any values.
{{ end }}
<!-- shortcode end {{ .Name }} -->
