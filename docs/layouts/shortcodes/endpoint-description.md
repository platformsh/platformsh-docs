<!-- Name the parameters -->
{{ $type := .Get "type" }}
{{ $onlyLanguage := .Get "onlyLanguage" }}
{{ $sectionLink := .Get "sectionLink" }} <!-- The section of the page with more detail. -->
{{ $multipleText := .Get "multipleText" }} <!-- What the explicit endpoints define (what is multiple). -->

<!-- Get registry data for the service type. -->

{{ $data := index .Site.Data.registry ( $type ) }}

### 1. Configure the service

<!-- Clarify the `type` that should be used. -->
<!-- mysql.md is special, so change the sentence slightly to show all `type`s for the single endpoint. -->
Use {{ if eq ($type) "mariadb" }}
  the `{{ $type }}` or `mysql` type for MariaDB or the `oracle-mysql` type for Oracle MySQL
  {{ else }}
  the `{{ $type }}` type
  {{ end }}to define the service:

<!-- Create a dummy example services.yaml file from the registry's example naming in `.docs` -->
{{ partial "examples/servicedefn" $data }}

<!-- Extra text to explain service configuration -->
{{ .Inner }}

### 2. Add the relationship

<!-- Network storage services are different and handled below -->
{{ if ne $type "network-storage" }}
<!-- Clarify the endpoint that should be used. -->
<!-- If a link and text have been set, adds exception that directs users to the subsection that describes explicit endpoints. -->
<!-- The check for Varnish is a hack to get around the escaping of the + sign -->
Use the {{if eq $type "varnish"}}`http+stats` endpoint{{ else if eq $type "vault-kms" }}endpoint
you [defined in step 1](#1-configure-the-service){{ else }}`{{ $data.endpoint }}`endpoint{{ end }}
to define the relationship{{ if and (gt (len ( $sectionLink )) 0) (gt (len ( $multipleText )) 0) }}
(unless you have [multiple {{$multipleText}}]({{ $sectionLink }})){{ end }}:

<!-- Create a dummy example `relationships` block from the registry's example naming in `.docs` -->
{{ partial "examples/relationship" $data }}

<!-- Adds a note about naming conventions between relationship and service names. Keep em unique. -->
You can define `<SERVICE_NAME>` and `<RELATIONSHIP_NAME>` as you like, but it's best if they're distinct.

<!-- For services with a PHP extension -->
{{ if ( .Get "php" ) }}
For PHP, enable the [extension](/languages/php/extensions.html) for the service:

```yaml {location=".platform.app.yaml"}
runtime:
    extensions:
        - {{ if ne ($type) "postgresql" }}{{$type}}{{else}}pdo_pgsql{{end}}
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

```yaml {location=services.yaml}
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

<!-- Add example heading for all but MariaDB/Oracle MySQL, which need two -->
{{ if ne ($type) "mariadb" }}
### Example Configuration
{{ end }}

{{ partial "examples/config_links" ( dict "type" $type "onlyLanguage" $onlyLanguage ) }}

<!-- Turn this section off for ones in Guides that continue differently-->
{{ if not (.Get "noApp" )}}
### Use in app

<!-- Don't add use in app intro to Headless Chrome, which has different content -->
{{ if ne ($type) "chrome-headless" }}
Then use the service in your app with a configuration file like the following:
{{ end }}
{{ end }}
