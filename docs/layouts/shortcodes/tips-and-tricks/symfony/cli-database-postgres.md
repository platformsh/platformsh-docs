You may find the following commands useful when using a PostgreSQL database with your Symfony application.

-   Create a dump of the local database:

    ```bash
    symfony run pg_dump --data-only
    ```

-   Run a SQL query on the remote database:

    ```bash
    symfony run psql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    symfony run psql < dump.sql
    ```
