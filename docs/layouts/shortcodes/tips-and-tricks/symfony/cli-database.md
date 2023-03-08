You may find the following commands useful when using a database with your Symfony application.

-   Create a local dump of the remote database:

    ```bash
    symfony db:dump --relationship database
    ```

-   Run a SQL query on the remote database:

    ```bash
    symfony sql 'SHOW TABLES'
    ```

-   Import a local SQL file into a remote database:

    ```bash
    symfony sql < my_database_backup.sql
    ```
