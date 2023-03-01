{{ $cliCommand := "platform" }}
{{ if eq ( .Get "framework" ) "Symfony" }}
  {{ $cliCommand = "symfony" }}
{{ end }}
You may find the following commands useful when using Redis.

-   Connect to a remote Redis service:

    ```bash
    {{ $cliCommand }} redis
    ```

-   Connect to a DDEV Redis service:

    ```bash
    ddev redis-cli
    ```

-   Connect to a local Redis instance using the [Redis CLI](https://redis.io/docs/getting-started/):

    ```bash
    redi-cli
    ```
