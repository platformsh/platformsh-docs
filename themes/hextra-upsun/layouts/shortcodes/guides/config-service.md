<!-- shortcode start {{ .Name }} -->
{{ $name := .Get "name" }}
## Add services in `{{ partial "vendor/configfile" (dict "context" . "config" "services") }}`

You can add the managed services you need for you app to run in the  `{{ partial "vendor/configfile" (dict "context" . "config" "services") }}` file.
You pick the major version of the service and security and minor updates are applied automatically,
so you always get the newest version when you deploy.
You should always try any upgrades on a development branch before pushing to production.

{{ .Inner | .Page.RenderString }}

{{ if .Get "noService" }}
{{ $name }} doesn't require services to deploy, so you don't need a `{{ partial "vendor/configfile" (dict "context" . "config" "services") }}` file for now.{{ end }}
You can [add other services](/add-services/_index.md) if desired,
such as [Solr](/add-services/solr.md) or [Elasticsearch](/add-services/elasticsearch.md).
You need to configure {{ $name }} to use those services once they're enabled.

{{ if not (.Get "noService") }}
Each service entry has a name (`db`{{ if not (or (.Get "WordPress") (eq $name "Django") (eq (.Get "framework") "Strapi")) }} and `cache`{{ end }} in the example)
and a `type` that specifies the service and version to use.
Services that store persistent data have a `disk` key, to specify the amount of storage.

{{ end }}
<!-- shortcode end {{ .Name }} -->
