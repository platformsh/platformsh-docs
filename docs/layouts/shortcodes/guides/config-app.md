
The `.platform.app.yaml` file is the heart of your configuration.
It has an [extensive set of options]({{ relref . "/create-apps/app-reference.md" }}) that allow you to configure nearly any aspect of your app.
Most of it is explained with comments inline.
This file changes over time as you build out your site.

{{ .Inner | .Page.RenderString }}

{{ $file := printf "static/files/fetch/appyaml/%s" (.Get "template" ) }}
{{ highlight ( readFile $file ) "yaml" ""}}
