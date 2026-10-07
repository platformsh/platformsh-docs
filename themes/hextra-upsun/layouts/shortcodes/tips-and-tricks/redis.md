<!-- shortcode start {{ .Name }} -->
{{ $cliCommand := `{{< vendor/cli >}}` | .Page.RenderString }}
{{ if eq ( .Get "framework" ) "Symfony" }}
  {{ $cliCommand = "symfony cloud:" }}
{{ end }}
You might find the following commands useful when using Redis with your Symfony app.

-   Connect to a remote Redis service:

    ```bash
    {{ $cliCommand }} redis
    ```

-   Connect to a local Redis instance using the [Redis CLI](https://redis.io/docs/getting-started/):

    ```bash
    redis-cli
    ```
<!-- shortcode end {{ .Name }} -->
