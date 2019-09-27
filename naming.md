@devrel_team - some follow-up on our Service Naming Convention conversation we had a few weeks ago. Feedback welcome.

A few weeks ago we started using a new naming convention for documenting services in the docs/templates - https://platformsh.slack.com/archives/CDCCS5ZUN/p1567701095239900

- relationship names: use case and type (`rediscache`, `essearch`, `solrsearch`) except for the primary SQL database (`database`).
- service names: use case (`cache`, `search`, `search`) and for the primary SQL database (`db`).

Reasoning:
- descriptive relationship names that did not break pre-existing bridge libraries.
- Type, service, and relationship names were all distinct for a service, but still related strings.

The console team is including example config files in the upcoming Project Setup Wizard. When a user covers service configurations they can select multiple services and build a `services.yaml` as they go. Their matching relationships are then copied over to a generated `.platform.app.yaml` file when they select a runtime. It's great.

The new convention has collisions _between_ services for service names (i.e. `search` used both for Elasticsearch and Solr), and for relationship names (`database` for PostgreSQL & MongoDB, which could conceivably be configured together in real apps).

Here's what we came up with to handle this:

- relationship names: only the primary database convention will change. The primary database _should_ be `database`, unless there are more than one, in which case type + database is used like every other service.
  - MariaDB: `database`
  - MongoDB: `mongodatabase`
  - PostgreSQL: `postgresdatabase`
  - Oracle MySQL: `oracledatabase`
- service names: use case with service name abbreviation attached
  - RabbitMQ: `queuerabbit`
  - Kafka: `queuekafka`
  - Elasticsearch: `searchelastic`
  - Solr: `searchsolr`
  - MariaDB: `db`
  - MongoDB: `dbmongo`
  - PostgreSQL: `dbpostgres`
  - Oracle MySQL: `dboracle`

  Reasoning:
  - descriptive relationship names still do not break pre-existing bridge libraries.
  - Type, service, and relationship names were all distinct for a service, but still related strings.
  - No service/relationship name collisions in docs and wizard

@patrickklima @tlattimore


Console feedback
https://platformsh.slack.com/archives/C1MLDA6HE/p1569496755104400
