<!-- shortcode start {{ .Name }} -->
{{ $isSymfony := .Get "Symfony" }}
{{ $cliCommand := `{{% vendor/cli %}}` | .Page.RenderString }}
{{ if $isSymfony }}
  {{ $cliCommand = "symfony cloud:" }}
{{ end }}
Now you have your configuration for deployment and your app set up to run on {{ .Site.Params.vendor.name }}.
Make sure all your code is committed to Git
and run `{{ if $isSymfony }}symfony cloud:deploy{{ else }}git push{{ end }}` to your {{ .Site.Params.vendor.name }} environment.

Your code is built, producing a read-only image that's deployed to a running cluster of containers.
If you aren't using a source integration, the log of the process is returned in your terminal.
If you're using a source integration, you can get the log by running `{{ $cliCommand }} activity:log --type environment.push`.

When the build finished, you're given the URL of your deployed environment.
Click the URL to see your site.

If your environment wasn't active and so wasn't deployed, activate it by running the following command:

```bash
{{ $cliCommand }} environment:activate
```
<!-- shortcode end {{ .Name }} -->
