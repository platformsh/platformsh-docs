{{ $type := .Get "type" }}
### Specify the language

To use {{ .Get "display_name" }}, specify `{{ $type }}` as your [app's `type`](/create-apps/app-reference.html#types):

```yaml {location=".platform.app.yaml"}
{{  printf "type: '%s:<VERSION_NUMBER>'" $type  | safeHTML }}
```

For example:

```yaml {location=".platform.app.yaml"}
{{  readFile (printf "src/registry/images/examples/full/%s.app.yaml" $type )  | safeHTML }}
```
