{{ $source := .Get "source" }}
{{ $pull := "pull"}}
{{ if eq $source "GitLab" }}
  {{ $pull = "merge" }}
{{ end }}
## Environment URL

For {{ $pull }} requests, the integration reports the primary URL for the deployed environment.
So you get a link to the deployed environment right in the {{ $pull }} request.

If you have multiple routes,
ensure the correct one is reported by [specifying the primary route](/define-routes.md#route-configuration-reference).
