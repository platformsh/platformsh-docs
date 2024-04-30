<!-- shortcode start {{ .Name }} -->
<!-- Name the parameters -->
{{ $type := .Get "type" }}
{{ $onlyLanguage := .Get "onlyLanguage" }}
{{ $sectionLink := .Get "sectionLink" }} <!-- The section of the page with more detail. -->
{{ $multipleText := .Get "multipleText" }} <!-- What the explicit endpoints define (what is multiple). -->
{{ $headerLevel := "###" }}
{{ $docVersion := .Site.Params.vendor.config.version }}
{{ if in $type "mongodb" }}
  {{ $headerLevel = "####" }}
{{ end }}

<!-- Get registry data for the service type. -->

{{ $data := index .Site.Data.registry ( $type ) }}
{{ if eq $type "redis-persistent" }}
    {{ $data = index .Site.Data.registry "redis" }}
{{ end }}

{{ $headerLevel }} 1. Configure the service

<!-- Clarify the `type` that should be used. -->
<!-- mysql.md is special, so change the sentence slightly to show all `type`s for the single endpoint. -->
To define the service, use {{ if eq ($type) "mariadb" }}
  the `{{ $type }}` or `mysql` type for MariaDB or the `oracle-mysql` type for Oracle MySQL
  {{ else if eq $type "redis" }}
  the `{{ $type }}` type for ephemeral Redis
  {{ else }}
  the `{{ $type }}` type{{ end }}:

<!-- Create an example services.yaml file from data in the registry. -->
{{ $serviceInner := partial "examples/servicedefn" (dict "context" . "data" $data "docVersion" $docVersion "type" $type) }}

<!-- Create a dummy example `relationships` block from the registry's example naming in `.docs` -->
```yaml {configFile="services"}
{{ partial "snippet" (dict "context" . "name" "<SERVICE_NAME>" "config" "service" "Inner" $serviceInner ) }}
```

{{ if eq $type "redis-persistent" }}
Persistent Redis requires disk space to store data.
If you want to use ephemeral Redis instead, [use the `redis` type](/add-services/redis.md#ephemeral-redis).

{{ else if eq $type "network-storage" }}
`<SERVICE_NAME>` must be [RFC 1123](https://tools.ietf.org/html/rfc1123) compliant, and as such it must:
- Contain at most 63 characters
- Contain only lowercase alphanumeric characters or `-` (underscores `_` are not allowed)
- Start with an alphanumeric character
- End with an alphanumeric character

This is due to the fact that `<SERVICE_NAME>` is used as hostname for the network storage.

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

To define the relationship, use the following configuration:

<!-- Network storage services are different and handled below -->
{{ if ne $type "network-storage" }}

<!-- Create a dummy example `relationships` block from the registry's example naming in `.docs` -->
{{ $serviceInner := partial "examples/servicedefn" (dict "context" . "data" $data "docVersion" $docVersion "type" $type) }}
{{ $relationshipInner := partial "examples/relationship" (dict "context" . "data" $data ) }}

```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" "<APP_NAME>" "config" "app" "root" "false" "Inner" $relationshipInner ) }}
{{ partial "snippet" (dict "context" . "name" "<SERVICE_NAME>" "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```

<!-- Adds a note about naming conventions between relationship and service names. Keep em unique. -->
You can define `<SERVICE_NAME>` as you like, so long as it's unique between all defined services 
and matches in both the application and services configuration.

The example above leverages [default endpoint](/create-apps/app-reference/single-runtime-image#relationships) configuration for relationships.
That is, it uses default endpoints behind-the-scenes, providing a [relationship](/create-apps/app-reference/single-runtime-image#relationships)
(the network address a service is accessible from) that is identical to the _name_ of that service.

Depending on your needs, instead of default endpoint configuration,
you can use [explicit endpoint configuration](/create-apps/app-reference/single-runtime-image#relationships).

With the above definition, the application container {{ if eq $docVersion 2 }}(`<APP_NAME>`) {{ end }}
{{- if ne (.Get "noApp" ) true -}}
now has [access to the service](#use-in-app) via the relationship `<RELATIONSHIP_NAME>` and its corresponding {{ if eq $docVersion 2 }}[service environment variables](/development/variables/_index.md#service-environment-variables){{ else }}[`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables){{ end }}.
{{- else -}}
now has access to the service via the relationship `<RELATIONSHIP_NAME>` and its corresponding {{ if eq $docVersion 2 }}[service environment variables](/development/variables/_index.md#service-environment-variables){{ else }} [`PLATFORM_RELATIONSHIPS` environment variable](/development/variables/use-variables.md#use-provided-variables){{ end }}.
{{- end -}}

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

{{ $extensionsComment := "# PHP extensions." }}
{{ $inner := printf "\n%s\nruntime:\n    extensions:\n        - %s" $extensionsComment $extension_name }}

{{ if eq $docVersion 2 }}
    {{ $relationshipInner := partial "examples/relationship" (dict "context" . "data" $data ) }}
    {{ $inner = printf "%s%s" $inner $relationshipInner }}
{{ end }}

```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" "<APP_NAME>" "config" "app" "root" "false" "Inner" $inner ) }}

{{ partial "snippet" (dict "context" . "name" "<SERVICE_NAME>" "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```
{{ end }}

<!-- For services with a Python extension -->
{{ if ( .Get "python" ) }}
For Python, include the proper dependency:

{{ $extensionsComment := "# Build dependencies per runtime." }}
{{ $inner := printf "\n%s\ndependencies:\n    python:\n        python-%s: '*'" $extensionsComment $type }}

{{ if eq $docVersion 2 }}
    {{ $relationshipInner := partial "examples/relationship" (dict "context" . "data" $data ) }}
    {{ $inner = printf "%s%s" $inner $relationshipInner }}
{{ end }}

```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" "<APP_NAME>" "config" "app" "root" "false" "Inner" $inner ) }}

{{ partial "snippet" (dict "context" . "name" "<SERVICE_NAME>" "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```

{{ end }}

<!-- Add explanation for the Vault service -->
{{ if eq ($type) "vault-kms" }}
If you split the service into multiple endpoints, define multiple relationships.
{{ end }}

<!-- Describe app configuration for network storage services -->
{{ else }}
{{$inner := "\nmounts:\n    '<TARGET_PATH>':\n        source: service\n" }}
{{ $inner = printf "%s        service: <SERVICE_NAME>\n        source_path: <SOURCE_PATH>" $inner }}

```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" "<APP_NAME>" "config" "app" "root" "false" "Inner" $inner ) }}

{{ partial "snippet" (dict "context" . "name" "<SERVICE_NAME>" "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```

- `<MOUNT_PATH>` is the path to your mount within the app container (relative to the app’s root).
- `<SERVICE_NAME>` is the name you [defined in step 1](#1-configure-the-service).
- `<SOURCE_PATH>` specifies where the mount points inside the service.</br>
  If the `source_path` is an empty string (`""`), your mount points to the entire service.</br>
  If you don’t define a `source_path`, {{ .Site.Params.vendor.name }} uses the `MOUNT_PATH` as default value, without leading or trailing slashes.
  For example, if your mount lives in the `/my/files/` directory within your app container, it will point to a `my/files` directory within the service.

{{ end }}
{{ end }} <!-- end check for Varnish -->

<!-- Add example heading for all but MariaDB/Oracle MySQL -->
{{ $skip_heading := slice "mariadb" }}
{{ if not (in $skip_heading $type) }}
{{ $headerLevel }} Example Configuration
{{ end }}

{{ if eq $type "mariadb" }}
### MariaDB example
{{ end }}

{{ $appName := "myapp" }}
{{ $varnishRelName := "application" }}

<!-- Create an example services.yaml file from data in the registry. -->
{{ if eq $type "redis-persistent" }}
    {{ $data = index .Site.Data.registry "redis" }}
{{ end }}

{{ $serviceName := index $data "docs" "service_name" }}
{{ $serviceInner := "" }}
{{ if eq $type "varnish" }}
  {{ $serviceInner = partial "examples/servicedefn" (dict "context" . "data" $data "latest" "true" "relName" "application" "appName" $appName "docVersion" $docVersion "type" $type ) }}
{{ else if eq $type "vault-kms" }}
  {{ $latest := partial "examples/latest" (dict "data" $data )}}
  {{ if eq $docVersion 2 }}
    {{ $serviceInner = printf "\n    type: vault-kms:%s" $latest }}
  {{ else }}
    {{ $serviceInner = printf "\n    type: vault-kms:%s\n    disk: 512" $latest }}
  {{ end }}
  {{ $serviceInner = printf "%s\n    configuration:\n        endpoints:\n            manage_keys:" $serviceInner }}
  {{ $serviceInner = printf "%s\n                - policy: admin" $serviceInner }}
  {{ $serviceInner = printf "%s\n                  key: vault-sign" $serviceInner }}
  {{ $serviceInner = printf "%s\n                  type: sign" $serviceInner }}
  {{ $serviceInner = printf "%s\n                - policy: sign" $serviceInner }}
  {{ $serviceInner = printf "%s\n                  key: vault-sign" $serviceInner }}
  {{ $serviceInner = printf "%s\n                  type: sign" $serviceInner }}
  {{ $serviceInner = printf "%s\n                - policy: verify" $serviceInner }}
  {{ $serviceInner = printf "%s\n                  key: vault-sign" $serviceInner }}
  {{ $serviceInner = printf "%s\n                  type: sign" $serviceInner }}
{{ else }}
  {{ $serviceInner = partial "examples/servicedefn" (dict "context" . "data" $data "latest" "true" "docVersion" $docVersion "type" $type ) }}
{{ end }}

{{ if eq $docVersion 1 }}
#### [Service definition](/add-services)
```yaml {configFile="services"}
{{ partial "snippet" (dict "context" . "name" $serviceName "config" "service" "Inner" $serviceInner ) }}
```
{{ end }}

{{ if and (eq $type "varnish") (eq $docVersion 1) }}
Notice the `relationship` (`{{ $varnishRelName }}`) defined for the service `{{ $serviceName }}` granting access to the application container `{{ $appName }}`.
{{ end }}

{{ if eq $docVersion 2 }}
#### [App](/create-apps) and [Service configuration](/add-services)
{{ else if ne $type "varnish" }}
#### [App configuration](/create-apps)
{{ end }}

{{ $appInner := "" }}

{{ if eq $type "network-storage" }}

    {{ $appInner = "\nmounts:\n    'my/files':\n        source: service\n" }}
    {{ $appInner = printf "%s        service: network-storage\n        source_path: files" $appInner }}

{{ else if eq $type "varnish" }}
    {{ $appInner = "\n..." }}

{{ else if eq $type "vault-kms" }}
    {{ $appInner = "\nrelationships:\n    vault_secret: \"vault-kms:manage_keys\"" }}
{{ else }}

    {{ $relationshipName := index $data "docs" "relationship_name" }}
    {{ $appInner = partial "examples/relationship" (dict "context" . "data" $data "servName" $serviceName "relName" $relationshipName) }}

{{ end }}

{{ if and (eq $type "varnish") (eq $docVersion 1) }}
  <!-- Varnish + API version 2 -->
{{ else }}
```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" $appName "config" "app" "root" "false" "Inner" $appInner ) }}

{{ partial "snippet" (dict "context" . "name" $serviceName "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```
{{ end }}

{{ if and (eq $type "varnish") (eq $docVersion 2) }}
Notice the `relationship` (`{{ $varnishRelName }}`) defined for the service `{{ $serviceName }}` granting access to the application container `{{ $appName }}`.
{{ end }}


{{ if eq $type "vault-kms" }}

### Multiple endpoints example

{{ $serviceInner := "" }}
{{ $latest := partial "examples/latest" (dict "data" $data )}}
{{ if eq $docVersion 2 }}
  {{ $serviceInner = printf "\n    type: vault-kms:%s" $latest }}
{{ else }}
  {{ $serviceInner = printf "\n    type: vault-kms:%s\n    disk: 512" $latest }}
{{ end }}
{{ $serviceInner = printf "%s\n    configuration:\n        endpoints:\n            management:" $serviceInner }}
{{ $serviceInner = printf "%s\n                - policy: admin" $serviceInner }}
{{ $serviceInner = printf "%s\n                  key: admin-key" $serviceInner }}
{{ $serviceInner = printf "%s\n                  type: sign" $serviceInner }}
{{ $serviceInner = printf "%s\n            sign_and_verify:" $serviceInner }}
{{ $serviceInner = printf "%s\n                - policy: sign" $serviceInner }}
{{ $serviceInner = printf "%s\n                  key: signing-key" $serviceInner }}
{{ $serviceInner = printf "%s\n                  type: sign" $serviceInner }}
{{ $serviceInner = printf "%s\n                - policy: verify" $serviceInner }}
{{ $serviceInner = printf "%s\n                  key: signing-key" $serviceInner }}
{{ $serviceInner = printf "%s\n                  type: sign" $serviceInner }}

{{ $appInner = "\nrelationships:\n    vault_manage:\n        service: vault-kms\n        endpoint: management\n    vault_sign:\n        service: vault-kms\n        endpoint: sign_and_verify" }}

{{ if eq $docVersion 1 }}
#### [Service definition](/add-services)
```yaml {configFile="services"}
{{ partial "snippet" (dict "context" . "name" $serviceName "config" "service" "Inner" $serviceInner ) }}
```
{{ end }}

{{ if eq $docVersion 2 }}
#### [App](/create-apps) and [Service configuration](/add-services)
{{ else }}

#### [App configuration](/create-apps)
{{ end }}

```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" $appName "config" "app" "root" "false" "Inner" $appInner ) }}

{{ partial "snippet" (dict "context" . "name" $serviceName "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```
{{ end }}

<!-- {{ partial "examples/config_links" ( dict "type" $type "onlyLanguage" $onlyLanguage ) }} -->

{{ if eq ($type) "elasticsearch" }}
If you're using a [premium version](add-services/elasticsearch.md#supported-versions),
use the `elasticsearch-enterprise` type in the service definition.
{{ end }}

{{ if eq $type "mariadb" }}
### OracleMySQL example

{{ $serviceName := "oraclemysql" }}
{{ $serviceInner := "\n    type: oracle-mysql:8.0" }}

{{ if eq $docVersion 1 }}
{{ $serviceInner := "\n    type: oracle-mysql:8.0\n    disk: 256" }}
#### [Service definition](/add-services)
```yaml {configFile="services"}
{{ partial "snippet" (dict "context" . "name" $serviceName "config" "service" "Inner" $serviceInner ) }}
```
{{ end }}

{{$appInner := "relationships:\n    oraclemysql: " }}

{{ if eq $docVersion 2 }}
#### [App](/create-apps) and [Service configuration](/add-services)
{{ else }}

#### [App configuration](/create-apps)
{{ end }}

```yaml {configFile="app"}
{{ partial "snippet" (dict "context" . "name" $appName "config" "app" "root" "false" "Inner" $appInner ) }}

{{ partial "snippet" (dict "context" . "name" $serviceName "config" "service" "placeholder" "true" "Inner" $serviceInner ) }}
```

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
<!-- shortcode end {{ .Name }} -->
