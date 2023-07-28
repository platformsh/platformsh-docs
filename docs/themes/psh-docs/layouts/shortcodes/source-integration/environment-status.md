{{ $source := .Get "source" }}
{{ $pull := "pull"}}
{{ if eq $source "GitLab" }}
  {{ $pull = "merge" }}
{{ end }}
## Environment parent and status

When a **branch** is created in {{ $source }},
an environment is created in Platform.sh with the default branch as its parent.
It starts as an [inactive environment](/other/glossary.html#inactive-environment) with no data or services.

When a **{{ $pull }} request** is opened in {{ $source }},
an environment is created in Platform.sh with the {{ $pull }} request's target branch as its parent.
It starts as an [active environment](/other/glossary.html#active-environment) with a copy of its parent's data.
