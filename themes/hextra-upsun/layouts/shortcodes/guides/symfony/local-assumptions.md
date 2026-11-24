<!-- shortcode start {{ .Name }} -->
{{ $redisGuide := .Get "redis-guide-link" }}
{{ $postgresqlGuide := .Get "postgresql-guide-link" }}

## Assumptions

This example makes a few assumptions, which you may need to adjust for your own circumstances.

It assumes that you've already [deployed a Symfony project on {{ .Site.Params.vendor.name }}](../getting-started/_index.md)
that has production data in a [PostgreSQL database]({{ $postgresqlGuide }}) and use [Redis component]({{ $redisGuide }}).

It's assumed that your project has the following service definitions:

```yaml {configFile="services"}
database:
   type: postgresql:14
   disk: 1024

cache:
   type: redis:7.0
   configuration:
       maxmemory_policy: volatile-lru
       # any other finetuning here
```

This is assumed to have the following relationship definitions:

```yaml {configFile="app"}
relationships:
   database: "database:postgresql"
   rediscache: "cache:redis"
```

Finally, this example mostly assumes that a {{ .Site.Params.vendor.name }} is the primary remote for the project.
When using source integrations, the steps will be identical in most cases and addressed otherwise.
<!-- shortcode end {{ .Name }} -->
