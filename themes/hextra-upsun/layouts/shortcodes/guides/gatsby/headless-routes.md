<!-- shortcode start {{ .Name }} -->
This [`{{ partial "vendor/configfile" (dict "context" . "config" "routes") }}`](/define-routes.html) file defines how requests are handled by {{ .Site.Params.vendor.name }}.
The following example shows Gatsby being served from the primary domain
and {{ .Get "name" }} being accessible from the `backend` subdomain.

{{ $file := printf "static/files/fetch/routesyaml/%s" (.Get "template") }}
{{ highlight ( readFile $file ) "yaml" ""}}
<!-- shortcode end {{ .Name }} -->
