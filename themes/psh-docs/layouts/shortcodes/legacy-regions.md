{{ $level := .Get "level" }}
{{ if eq $level 6 }}######{{ else if eq $level 5 }}#####{{ else if eq $level 4 }}####{{ else if eq $level 3 }}###{{ else }}##{{ end }} Supported regions

{{ .Get "featureIntro" }} {{ if (.Get "plural") }}are{{ else }}is{{ end }} available on all regions except the legacy regions:

* `eu.platform.sh`
* `us.platform.sh`

These regions will be upgraded in the future.
If you’re on one of these regions and want {{ .Get "featureShort" }} now,
[migrate your project](/projects/region-migration.md) to a newer region.
