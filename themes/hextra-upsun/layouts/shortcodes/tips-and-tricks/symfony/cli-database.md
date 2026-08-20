<!-- shortcode start {{ .Name }} -->
You might find the following commands useful when using the Symfony CLI with a database.

-   Create a local dump of the remote database:

    ```bash
    symfony db:dump --relationship database
    ```

-   Run an SQL query on the remote database:

    ```bash
    symfony sql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    symfony sql < my_database_backup.sql
    ```
<!-- shortcode end {{ .Name }} -->
