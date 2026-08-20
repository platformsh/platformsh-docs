<!-- shortcode start {{ .Name }} -->
{{ $source := .Get "source" }}
{{ $pull := "pull"}}
{{ if eq $source "GitLab" }}
  {{ $pull = "merge" }}
{{ end }}
If you have code in a {{ $source }} repository, you might want to connect it to a {{ .Site.Params.vendor.name }} project.
This means you can keep your {{ $source }} workflows
and treat the {{ $source }} repository as the source of truth for your code.

Your {{ .Site.Params.vendor.name }} project becomes a mirror of your {{ $source }} repository.
This means you shouldn't push code directly to {{ .Site.Params.vendor.name }}.
Any changes you push directly get overwritten by the integration when changes happen in the {{ $source }} repository.

When you set up an integration with {{ $source }},
it automates the following processes for you:

- Creating a new environment when a branch is created or a {{ $pull }} request is opened.
- Rebuilding the environment when new code is pushed to {{ $source }}.
- Deleting the environment when a {{ $pull }} request is merged.
<!-- shortcode end {{ .Name }} -->
