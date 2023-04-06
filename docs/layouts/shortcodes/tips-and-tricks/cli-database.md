{{ $cliCommand := "platform " }}
{{ $cliName := "Platform.sh CLI" }}
{{ if eq ( .Get "framework" ) "Symfony" }}
  {{ $cliCommand = "symfony cloud:" }}
  {{ $cliName = "Symfony CLI" }}
{{ end }}

You may find the following commands useful when using a database with your Symfony application.

-   Create a local dump of the remote database:

    ```bash
    {{ $cliCommand }}db:dump --relationship database
    ```

-   Run a SQL query on the remote database:

    ```bash
    {{ $cliCommand }}sql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    {{ $cliCommand }}sql < my_database_backup.sql
    ```