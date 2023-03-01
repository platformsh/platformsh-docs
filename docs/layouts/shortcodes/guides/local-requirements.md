{{ $isSymfony := eq ( .Get "name" ) "Symfony" }}
## Before you begin

You need:

- A local copy of the repository for a {{ with .Get "framework" }}[{{ . }}](../deploy/_index.md) {{ end }} project running on Platform.sh.

  To get one, run the following command:
  <code>{{ if $isSymfony }}symfony{{ else }}platform{{ end }} get {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.<br>
  Or clone an integrated source repository
  and set the remote branch by running the following command:
  <code>{{ if $isSymfony }}symfony{{ else }}platform{{ end }} project:set-remote {{ `{{< variable "PROJECT_ID" >}}` | .Page.RenderString }}</code>.
- The {{ if $isSymfony }}[Symfony CLI](https://symfony.com/download){{ else }}[Platform.sh CLI](/administration/cli/_index.md){{ end }}.
