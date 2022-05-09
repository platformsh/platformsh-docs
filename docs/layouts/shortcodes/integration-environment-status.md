{{ $source := .Get "source" }}
{{ $pull := "pull"}}
{{ if eq $source "GitLab" }}
  {{ $pull = "merge" }}
{{ end }}
## Environment parent and status

Environments based on {{ $source }} **{{ $pull }} requests** have their target branch set as their parent on Platform.sh.
They're added as [active environments](/glossary.html#active-environment) with a copy of the parent's data.

Environments based on **branches** always have the default branch set as their parent on Platform.sh.
They're added as [inactive environments](/glossary.html#inactive-environment) with no data or services.
