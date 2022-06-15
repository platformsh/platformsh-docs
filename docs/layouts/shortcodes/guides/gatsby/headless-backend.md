{{ $name := .Get "name" }}
{{ $template := $name }}
{{ if eq $name "Drupal" }}
  {{ $template = "Drupal9"}}
{{ end }}
The multi-app template has a single modification to Platform.sh's [standard {{ $name }} template](https://github.com/platformsh-templates/{{ anchorize ( $template ) }}):
the `name` attribute in {{ $name }}'s `.platform.app.yaml` has been updated to `{{ anchorize ( $name )}}`.
This value is used to define the [relationship between Gatsby and {{ $name }}](#gatsby)
and in the [routes configuration](#platformroutesyaml).
