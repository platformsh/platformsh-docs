<!-- shortcode start {{ .Name }} -->
You can optionally combine the application configuration (`{{ partial "vendor/configfile" (dict "context" . "config" "services") }}`) for Gatsby
and {{ .Get "name" }} into a [single configuration file](/create-apps/multi-app/project-structure.md#unified-app-configuration).
Like `{{ partial "vendor/configfile" (dict "context" . "config" "services") }}` and `{{ partial "vendor/configfile" (dict "context" . "config" "routes") }}`, this file is shared across the project and resides in the `.platform` subdirectory.
You need to explicitly define the source of each application.
<!-- shortcode end {{ .Name }} -->
