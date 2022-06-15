{{ $type := .Get "type" }}
### Specify the language

To use {{ .Get "display_name" }}, specify `{{ $type }}` as your [app's `type`](/create-apps/app-reference.html#types):

<!-- vale off -->
<div class="highlight-location">.platform.app.yaml</div>
{{ highlight ( printf "type: '%s:<VERSION_NUMBER>'" $type ) "yaml" "" }}

For example:

<div class="highlight-location">.platform.app.yaml</div>
{{ highlight ( readFile (printf "src/registry/images/examples/full/%s.app.yaml" $type ) ) "yaml" "" }}
