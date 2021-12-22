<!-- Name the parameters -->
{{ $type := .Get "type" }}
{{ $sectionLink := .Get "sectionLink" }} <!-- The section of the page with more detail. -->
{{ $multipleText := .Get "multipleText" }} <!-- What the explicit endpoints define (what is multiple). -->

<!-- Get registry data for the service type. -->

{{ $data := index .Site.Data.registry ( $type )}}

<!-- Clarify the `type` that should be used. -->
<!-- mysql.md is special, so change the sentence slightly to show all `type`s for the single endpoint. -->
Use {{ if eq ($type) "mariadb" }}
  the `{{ $type }}` or `mysql` type for MariaDB or the `oracle-mysql` type for Oracle MySQL
  {{ else }}
  the `{{ $type }}` type
  {{ end }}to define the service:

<!-- Create a dummy example services.yaml file from the registry's example naming in `.docs` -->
{{ partial "examples/servicedefn" $data }}

<!-- Clarify the endpoint that should be used. -->
<!-- If a link and text have been set, adds exception that directs users to the subsection that describes explicit endpoints. -->
Then use the `{{ $data.endpoint }}` endpoint to [define the relationship](/configuration/app/app-reference.md){{ if and (gt (len ( $sectionLink )) 0) (gt (len ( $multipleText )) 0) }} (unless you have [multiple {{$multipleText}}]({{ $sectionLink }})){{ end }}:

<!-- Create a dummy example `relationships` block from the registry's example naming in `.docs` -->
{{ partial "examples/relationship" $data }}

<!-- Adds a note about naming conventions between relationship and service names. Keep em unique. -->
You can define `service_name` and `relationship_name` as you like, but it's best if they're distinct.

<!-- Add example heading for all but MariaDB/Oracle MySQL, which need two -->
{{ if ne ($type) "mariadb" }}
### Example Configuration
{{ end }}

{{ .Inner }}

<!-- Turn this section off for ones in Guides that continue differently-->
{{ if not (.Get "noApp" )}}
### Use in app

<!-- Don't add use in app intro to Headless Chrome, which has different content -->
{{ if ne ($type) "chrome-headless" }}
Then use the service in your app with a configuration file like the following:
{{ end }}
{{ end }}
