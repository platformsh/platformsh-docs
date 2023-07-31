{{ $image := .Get 0 }}

{{ with (index .Site.Data.registry $image "versions" ) }}
  {{ if index . "legacy" }}
  {{ $legacy := index . "legacy" }}

The following versions aren't available in the EU and US regions:

{{ range ( index . "supported" ) }}
  {{ if ( not ( in $legacy . ) ) }}
* {{ . }}
  {{ end }}
{{ end }}

Consider [region migration](/projects/region-migration.html) if your project is in those regions.

  {{ end }}
{{ end }}
