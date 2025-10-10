<!-- shortcode start {{ .Name }} -->
{{- $supported := .Site.Data.composable_versions.composable.versions.supported -}}
{{- if and $supported (gt (len $supported) 0) }}

### Supported Nix channels

A Nix channel represents a curated, tested snapshot of the Nixpkgs repository, which contains a collection of Nix expressions (code for building packages and configuring systems).

Using the latest stable Nix channel ensures that you get stable, verified packages - not every commit to the `master` branch is thoroughly tested before being merged.

<!-- Upsun typically supports only the most recent channel, but sometimes support for a previous channel is extended. -->

The following channels are supported:

{{ partial "composable-version-list.html" (dict "context" . "status" "supported") }}
{{ end }}

{{- $available := .Site.Data.composable_versions.composable.versions.available -}}
{{- if and $available (gt (len $available) 0) }}

### Available Nix channels

The following channels are available but no longer supported.
They're available, but they no longer receive security updates from the Nix community and aren't guaranteed to work.
They'll be removed in the future – consider migrating to a [supported Nix channel](#supported-nix-channels).

{{ partial "composable-version-list.html" (dict "context" . "status" "available") }}
{{ end }}
<!-- shortcode end {{ .Name }} -->
