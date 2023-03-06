{{ $redisGuide := .Get "redis-guide-link" }}
{{ $postgresqlGuide := .Get "postgresql-guide-link" }}

## Assumptions

This example makes a few assumptions, which you may need to adjust for your own circumstances.

It assumes that you've already [deployed a Symfony project on Platform.sh](../getting-started/_index.md)
that has production data in a [PostgreSQL database]({{ $postgresqlGuide }}) and use [Redis component]({{ $redisGuide }}).

It's assumed that your project has the following service definitions:

```yaml {location=".platform/services.yaml"}
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

```yaml {location=".platform.app.yaml"}
relationships:
   database: "database:postgresql"
   rediscache: "cache:redis"
```

Finally, this example mostly assumes that a Platform.sh is the primary remote for the project.
When using source integrations, the steps will be identical in most cases and addressed otherwise.
