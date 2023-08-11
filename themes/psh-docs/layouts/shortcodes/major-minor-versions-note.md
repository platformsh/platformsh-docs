{{ $configMinor := .Get "configMinor" }}
{{ if eq $configMinor "true" }}
You can select the major and minor version.
{{ else }}
You can select the major version.
But the latest compatible minor version is applied automatically and can’t be overridden.
{{ end }}
Patch versions are applied periodically for bug fixes and the like.
When you deploy your app, you always get the latest available patches.