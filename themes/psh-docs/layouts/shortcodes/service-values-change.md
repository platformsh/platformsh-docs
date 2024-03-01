<!-- shortcode start {{ .Name }} -->
Note that the information about the relationship can change when an app is redeployed or restarted
or the relationship is changed.
So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-specific-variables) directly rather than hard coding any values.
You can obtain the complete list of available service environment variables in your app container by running `{{ .Site.Params.vendor.cli }} ssh env`.
<!-- shortcode end {{ .Name }} -->
