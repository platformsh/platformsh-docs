{{ $version := .Get "version" }}
{{ if $version }}
    {{ if eq ( string .Site.Params.vendor.config.version ) $version }}

## Use a framework

If you use one of the following frameworks, follow its guide:

{{ .Inner | .Page.RenderString }}

For more implementation ideas, consult a [template](/development/templates.md).

    {{ end }}
{{ else }}

## Use a framework

If you use one of the following frameworks, follow its guide:

{{ .Inner | .Page.RenderString }}

For more implementation ideas, consult a [template](/development/templates.md).

{{ end }}
