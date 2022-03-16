The `services.yaml` file lists the pre-packaged services you need for your application to run.
You pick the major version of the service and Platform.sh updates the patch version periodically
so that you always get the newest version when you deploy.

{{ .Inner | .Page.RenderString }}

You can add [other services](/configuration/services/_index.md) if desired,
such as [Solr](/configuration/services/solr.md) or [Elasticsearch](/configuration/services/elasticsearch.md).
You need to configure {{ .Get "framework" }} to use those services as well once the service is enabled.

Each service entry has a name (`db` {{if not (or (.Get "WordPress") (eq (.Get "framework") "Strapi")) }}and `cache`{{ end }} in the example below)
as well as a `type` that specifies the service and version to use.
Note that not all services support clean version upgrades, and none support downgrades.
If you want to try upgrading a service,
confirm on its service page that it's supported
and test on a branch before pushing to your production branch.

If a service stores persistent data,
then it also has a `disk` key, which specifies the amount of storage to give it, in MB.
