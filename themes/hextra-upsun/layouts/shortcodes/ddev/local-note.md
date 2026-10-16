<!-- shortcode start {{ .Name }} -->
{{ $name := .Get "name" }}
{{ $link := .Get "link" }}

This guide is an example for setting up a local development environment for {{ $name }}.
The recommended tool for local development is DDEV.
See the [{{ $name }} DDEV guide]({{ $link }}).
<!-- shortcode end {{ .Name }} -->
