<!-- shortcode start {{ .Name }} -->
Note that the information about the relationship can change when an app is redeployed or restarted
or the relationship is changed.
So your apps should only rely on the [service environment variables](/development/variables/_index.md#service-specific-variables) or the [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables) directly rather than hard coding any values.
<!-- shortcode end {{ .Name }} -->
