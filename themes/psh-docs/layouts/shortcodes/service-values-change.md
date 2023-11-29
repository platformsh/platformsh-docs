<!-- shortcode start {{ .Name }} -->
Note that the information about the relationship can change when an app is redeployed or restarted
or the relationship is changed.
So your apps should only rely on the `{{ .Page.Site.Params.vendor.env_prefix }}_RELATIONSHIPS` environment variable directly rather than hard coding any values.
<!-- shortcode end {{ .Name }} -->
