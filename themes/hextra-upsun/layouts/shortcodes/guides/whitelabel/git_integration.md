<!-- shortcode start {{ .Name }} -->
{{ $git := .Get "git" }}
{{ $stack := .Get "stack" }}
{{ $option := "" }}

{{ if in $git "GitHub" }}
  {{ $option = "2" }}
{{ end }}
{{ if in $git "Gitlab" }}
  {{ $option = "3" }}
{{ end }}
{{ if in $git "Bitbucket" }}
  {{ $option = "0" }}
{{ end }}

We assume here that you already have your own {{ $git }} repository with the {{ $stack }} source code you want to host on {{ .Site.Params.vendor.name }}.
To link using this repository, use the following {{ .Site.Params.vendor.name }} CLI command to create a {{ $git }} integration with your project and then let the integration process create one environment per Git branch from your repository:

```shell
$ upsun integration:add
* Integration type (--type)
  Enter a number to choose:
  [0 ] bitbucket
  [1 ] bitbucket_server
  [2 ] github
  [3 ] gitlab
  [4 ] webhook
  [5 ] health.email
  [6 ] health.pagerduty
  [7 ] health.slack
  [8 ] health.webhook
  [10] script
> {{ $option }}

* Token (--token)
  An authentication or access token for the integration
> X1234567890AZERTYUIOP

* Repository (--repository)
  The repository (e.g. 'owner/repository')
> <owner>/<repository>
```
<!-- shortcode end {{ .Name }} -->
