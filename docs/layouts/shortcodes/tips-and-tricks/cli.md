{{ $cliCommand := "platform " }}
{{ $cliName := "Platform.sh CLI" }}
{{ if eq ( .Get "framework" ) "Symfony" }}
  {{ $cliCommand = "symfony cloud:" }}
  {{ $cliName = "Symfony CLI" }}
{{ end }}

You may find the following commands useful when using the {{ $cliName }}.

-   Open the web administration console:

    ```bash
    {{ $cliCommand }}web
    ```

-   Open the current environment's URL:

    ```bash
    {{ $cliCommand }}url
    ```

-   Open an SSH connection to your environment:

    ```bash
    {{ $cliCommand }}ssh
    ```
