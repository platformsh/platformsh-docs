<!-- shortcode start {{ .Name }} -->
{{ $title := .Get "title" | .Page.RenderString -}}
{{- $theme := .Get "theme" -}}
{{- $version := .Get "version" -}}
{{- $inner := .Inner -}}
{{- if $version -}}
    {{- if eq ( string .Site.Params.vendor.config.version ) $version -}}
        {{- partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) -}}
    {{- end -}}
{{- else -}}
    {{- partial "note" (dict "context" . "title" $title "theme" $theme "Inner" $inner) -}}
{{- end -}}
<!-- shortcode end {{ .Name }} -->
