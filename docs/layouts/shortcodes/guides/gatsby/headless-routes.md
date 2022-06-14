This [`routes.yaml`](/define-routes.html) file defines how requests are handled by Platform.sh.
The following example shows Gatsby being served from the primary domain
and {{ .Get "name" }} being accessible from the `backend` subdomain.

{{ $file := printf "static/files/fetch/routesyaml/%s" (.Get "template") }}
{{ highlight ( readFile $file ) "yaml" ""}}
