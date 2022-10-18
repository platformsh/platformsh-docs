{{ $image := .Get 0 }}

{{ with (index .Site.Data.registry $image "versions" ) }}
  {{ if index . "legacy" }}
  {{ $legacy := index . "legacy" }}

The following versions aren't available in the EU-1 and US-1 regions:

{{ range ( index . "supported" ) }}
  {{ if ( not ( in $legacy . ) ) }}
* {{ . }}
  {{ end }}
{{ end }}

Consider [region migration](/guides/general/region-migration.html) if your project is in those regions.

  {{ end }}
{{ end }}
