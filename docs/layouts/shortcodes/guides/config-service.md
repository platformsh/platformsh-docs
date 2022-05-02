{{ $name := .Get "name" }}
The `services.yaml` file lists the pre-packaged services you need for your application to run.
You pick the major version of the service and Platform.sh updates the patch version periodically
so that you always get the newest version when you deploy.

{{ .Inner | .Page.RenderString }}

{{ if .Get "noService" }}
{{ $name }} doesn't require services to deploy, so you don't need a `services.yaml` file for now.{{ end }}
You can [add other services](/add-services/_index.md) if desired,
such as [Solr](/add-services/solr.md) or [Elasticsearch](/add-services/elasticsearch.md).
You need to configure {{ $name }} to use those services once they're enabled.

{{ if not (.Get "noService") }}
Each service entry has a name (`db` {{ if not (or (.Get "WordPress") (eq (.Get "framework") "Strapi")) }}and `cache`{{ end }} in the example below)
as well as a `type` that specifies the service and version to use.
Note that not all services support clean version upgrades, and none support downgrades.
If you want to try upgrading a service,
confirm on its service page that it's supported
and test on a branch before pushing to your production branch.

If a service stores persistent data,
then it also has a `disk` key, which specifies the amount of storage to give it, in MB.

{{ end }}
