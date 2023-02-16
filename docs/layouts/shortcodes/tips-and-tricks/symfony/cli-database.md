Create a local dump of the remote database
  ```bash
  symfony db:dump --relationship database
  ```

Run SQL query on the remote database
  ```bash
  symfony sql 'SHOW TABLES'
  ```

Import local SQL file to remote database
  ```bash
  symfony sql < my_database_backup.sql
  ```
