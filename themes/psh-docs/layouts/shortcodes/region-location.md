<!-- shortcode start {{ .Name }} -->
{{ $registry := .Site.Data.regions_location }}

| Name | Provider | Geographic Zone | Timezone |
| ------- | ------ | ------------------ |------------------|-----------------------| {{ range sort $registry "name" }}
| {{ .name }} |  {{ .provider }} | {{ .zone }} | {{ .timezone }} |{{ end }}
<!-- shortcode end {{ .Name }} -->
