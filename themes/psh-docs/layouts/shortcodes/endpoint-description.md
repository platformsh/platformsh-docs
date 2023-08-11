<!-- Name the parameters -->
{{ $type := .Get "type" }}
{{ $onlyLanguage := .Get "onlyLanguage" }}
{{ $sectionLink := .Get "sectionLink" }} <!-- The section of the page with more detail. -->
{{ $multipleText := .Get "multipleText" }} <!-- What the explicit endpoints define (what is multiple). -->
{{ $headerLevel := "###" }}
{{ if in $type "mongodb" }}
  {{ $headerLevel = "####" }}
{{ end }}

<!-- Get registry data for the service type. -->

{{ $data := index .Site.Data.registry ( $type ) }}

{{ $headerLevel }} 1. Configure the service

<!-- Clarify the `type` that should be used. -->
<!-- mysql.md is special, so change the sentence slightly to show all `type`s for the single endpoint. -->
To define the service, use {{ if eq ($type) "mariadb" }}
  the `{{ $type }}` or `mysql` type for MariaDB or the `oracle-mysql` type for Oracle MySQL
  {{ else if eq $type "redis" }}
  the `{{ $type }}` type for persistent Redis
  {{ else }}
  the `{{ $type }}` type{{ end }}:

<!-- Create an example services.yaml file from data in the registry. -->
{{ partial "examples/servicedefn" $data }}

{{ if eq $type "redis-persistent" }}
Note that persistent Redis requires `disk` to store data.
For more information, refer to the [dedicated Redis page](/add-services/redis.md).

If want to use ephemeral Redis instead, use the `redis` type:

  {{ $redis_data := index .Site.Data.registry "redis" }}
  {{ partial "examples/servicedefn" $redis_data }}

{{ else if eq $type "network-storage" }}
You can define `<SERVICE_NAME>` as you like, but it shouldn't include underscores (`_`).
{{ else if eq $type "elasticsearch" }}
If you're using a [premium version](add-services/elasticsearch.md#supported-versions),
use the `elasticsearch-enterprise` type instead.
{{ end }}

Note that changing the name of the service replaces it with a brand new service
and all existing data is lost.
Back up your data before changing the service.

<!-- Extra text to explain service configuration -->
{{ .Inner }}

<!-- Exclude Varnish because it would create a circular relationship -->
{{ if ne $type "varnish" }}

{{ $headerLevel }} 2. Add the relationship

<!-- Network storage services are different and handled below -->
{{ if ne $type "network-storage" }}
<!-- Clarify the endpoint that should be used. -->
<!-- If a link and text have been set, adds exception that directs users to the subsection that describes explicit endpoints. -->
To define the relationship, use the {{ if eq $type "vault-kms" }}endpoint you [defined 
in step 1](#1-configure-the-service){{ else }}`{{ $data.endpoint }}` endpoint{{ end }}
{{ if and (gt (len ( $sectionLink )) 0) (gt (len ( $multipleText )) 0) }} (unless you have [multiple {{$multipleText}}]({{ $sectionLink }})){{ end }}:

<!-- Create a dummy example `relationships` block from the registry's example naming in `.docs` -->
{{ partial "examples/relationship" $data }}

<!-- Adds a note about naming conventions between relationship and service names. Keep em unique. -->
You can define `<SERVICE_NAME>` and `<RELATIONSHIP_NAME>` as you like, but it's best if they're distinct.

<!-- For services with a PHP extension -->
{{ if ( .Get "php" ) }}
  {{ $extension_name := $type}}
  {{ if eq $type "mongodb-enterprise" }}
    {{ $extension_name = "mongodb" }}
  {{ end }}
  {{ if eq $type "postgresql" }}
   {{ $extension_name = "pdo_pgsql" }}
  {{ end }}
  {{ if eq $type "redis-persistent" }}
   {{ $extension_name = "redis" }}
  {{ end }}
For PHP, enable the [extension](/languages/php/extensions.html) for the service:

```yaml {location=".platform.app.yaml"}
runtime:
    extensions:
        - {{ $extension_name }}
```
{{ end }}

<!-- For services with a Python extension -->
{{ if ( .Get "python" ) }}
For Python, include the proper dependency:

```yaml {location=".platform.app.yaml"}
dependencies:
    python:
        python-{{$type}}: '*'
```
{{ end }}

<!-- Add explanation for the Vault service -->
{{ if eq ($type) "vault-kms" }}
If you split the service into multiple endpoints, define multiple relationships.
{{ end }}

<!-- Describe app configuration for network storage services -->
{{ else }}
Add the service to your app configuration:

```yaml {location=app.platform.yaml}
mounts:
    '<TARGET_PATH>':
        source: service
        service: <SERVICE_NAME>
        source_path: <SOURCE_PATH>
```

* `<TARGET_PATH>` is where you want your service to be, the path on your app container that has a writable mount.
* `<SERVICE_NAME>` is the name you [defined in step 1](#1-configure-the-service).
* `<SOURCE_PATH>` is the path within the service that the mounts point to.
  Usually the same as the `<SERVICE_NAME>`.
{{ end }}
{{ end }} <!-- end check for Varnish -->

<!-- Add example heading for all but MariaDB/Oracle MySQL and Redis, which need two -->
{{ $skip_heading := slice "mariadb" "redis"}}
{{ if not (in $skip_heading $type) }}
{{ $headerLevel }} Example Configuration
{{ end }}

{{ partial "examples/config_links" ( dict "type" $type "onlyLanguage" $onlyLanguage ) }}

{{ if eq ($type) "elasticsearch" }}
If you're using a [premium version](add-services/elasticsearch.md#supported-versions),
use the `elasticsearch-enterprise` type in the service definition.
{{ end }}

<!-- Turn this section off for ones in Guides that continue differently-->
{{ if not (.Get "noApp" )}}
### Use in app

<!-- Don't add use in app intro to Headless Chrome, which has different content -->
{{ if ne ($type) "chrome-headless" }}
To use the configured service in your app,
add a configuration file similar to the following to your project.
{{ end }}
{{ end }}
