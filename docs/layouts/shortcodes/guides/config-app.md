{{ $template := .Get "template" }}
## Configure apps in `.platform.app.yaml`

Your app configuration in a  `.platform.app.yaml` file is allows you to configure nearly any aspect of your app.
For all of the options, see a [complete reference]({{ relref . "/create-apps/app-reference.md" }}).
The following example shows a complete configuration with comments to explain the various settings.

{{ .Inner | .Page.RenderString }}

{{ if not ( .Get "noExample" ) }}
```yaml {location=".platform.app.yaml"}
{{ readFile ( printf "static/files/fetch/appyaml/%s" $template ) }}
```
{{ end }}
