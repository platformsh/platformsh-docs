<!-- shortcode start {{ .Name }} -->
{{ $source := .Get "source" }}
{{ $pull := "pull"}}
{{ if eq $source "GitLab" }}
  {{ $pull = "merge" }}
{{ end }}
## {{ $pull | title }} request URLs

When a {{ $pull }} request is deployed, the integration reports the primary URL for the deployed environment.
So you get a link to the deployed environment right in the {{ $pull }} request.

If you have multiple routes,
ensure the correct one is reported by [specifying the primary route](/define-routes.html#route-configuration-reference).
<!-- shortcode end {{ .Name }} -->
