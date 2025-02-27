<!-- shortcode start {{ .Name }} -->
You might find the following commands useful when using a PostgreSQL database with your Symfony app.

-   Create a dump of the local database:

    ```bash
    symfony run pg_dump --data-only
    ```

-   Run an SQL query on the remote database:

    ```bash
    symfony run psql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    symfony run psql < dump.sql
    ```
<!-- shortcode end {{ .Name }} -->
