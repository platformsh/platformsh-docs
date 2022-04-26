## Supported regions

{{ .Get "featureIntro" }} {{ if (.Get "plural") }}are{{ else }}is{{ end }} available on all regions except the legacy regions:

* `eu.platform.sh`
* `us.platform.sh`

These regions will be upgraded in the future.
If you’re on one of these regions and want {{ .Get "featureShort" }} now,
[migrate your project](/guides/general/region-migration.md) to a newer region.
