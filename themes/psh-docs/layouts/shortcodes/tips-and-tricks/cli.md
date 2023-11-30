<!-- shortcode start {{ .Name }} -->
{{ $cliCommand := `{{< vendor/cli >}}` | .Page.RenderString }}
{{ $cliName := "{{ .Site.Params.vendor.name }} CLI" }}
{{ if eq ( .Get "framework" ) "Symfony" }}
  {{ $cliCommand = "symfony cloud:" }}
  {{ $cliName = "Symfony CLI" }}
{{ end }}

You might find the following commands useful when using the {{ $cliName }}.

-   Open the web administration console:

    ```bash
    {{ $cliCommand }} web
    ```

-   Open the URL of the current environment:

    ```bash
    {{ $cliCommand }} url
    ```

-   Open an SSH connection to your environment:

    ```bash
    {{ $cliCommand }} ssh
    ```
<!-- shortcode end {{ .Name }} -->
