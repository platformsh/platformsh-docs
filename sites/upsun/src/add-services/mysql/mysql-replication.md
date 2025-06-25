---
title: "MariaDB/MySQL External Replication"
sidebarTitle: "MariaDB/MySQL Replication"
description: In rare cases, it may be useful to maintain a replica instance of your MySQL/MariaDB database outside of {{% vendor/name %}}.
---

{{% description %}}

Typically, an automated backup is better for short-term usage and a `mysqldump` for longer term storage, but in some cases the data set is large enough that `mysqldump` is prohibitive.
In that case, you can enable external replication using an extra permission.

This guide explains replication on the {{% vendor/name %}} side only; you must also set up and maintain your own replica instance. Consult the MySQL or MariaDB documentation for details.

## Create a replication user

To set up replication you need to create a replication-enabled user.
For each database that you'd like to replicate, you need to assign a `replication` permission/role, under a corresponding `endpoint`:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  mariadb:
    type: mariadb:{{% latest "mariadb" %}}
    configuration:
      schemas:
        - main
      endpoints:
        # Restate the default user to be used by your application.
        mysql:
          default_schema: main
          privileges:
            main: admin
        replicator:
          privileges:
            main: replication
```

The preceding example:
- Creates a `replicator` user. 
- Grants read-only and table locking rights on the `main` database (namely `Select_priv`, `Show_view_priv`, `Create_tmp_table_priv`, `Lock_tables_priv` privileges). 
- Grants global replication rights (namely `Repl_slave_priv` and `Repl_client_priv` privileges).
- Grants flushing rights (`Reload_priv` used for flushing before reading the binary log position). 
- If at least one `replication` permission is defined, the bin-logging is enabled on the primary server, which is essential for the replication.

## Define a relationship for the new endpoint

Even if your application won’t access the replication endpoint, you still need to expose it to an application as a relationship so that you can connect to it over SSH.
Add a new relationship to your application container:

```yaml {configFile="app"}
applications:
  # The name of the app container. Must be unique within a project.
  myapp:
    # The location of the application's code.
    source:
      root: "/"

    [...]

    # Relationships enable an app container's access to a service.
    relationships:
      database:
        service: mariadb
        endpoint: mysql
      replication:
        service: mariadb
        endpoint: replicator

```

## Get the primary's binary log co-ordinates

Open the MySQL CLI to the `replication` relationship, either by accessing the credentials while on the app container or using the following command.

```bash
{{% vendor/cli %}} sql -r replication
```

Now you need to prevent any changes to the data while you view the binary log position. You'll use this to tell the replica at exactly which point it should start replicating from. On the primary server, flush and lock all tables by running `FLUSH TABLES WITH READ LOCK`. Keep this session running - exiting it releases the lock. Get the current position in the binary log by running `SHOW MASTER STATUS`:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
Query OK, 0 rows affected (0.016 sec)

mysql> SHOW MASTER STATUS;
+-----------------+----------+--------------+------------------+
| File            | Position | Binlog_Do_DB | Binlog_Ignore_DB |
+-----------------+----------+--------------+------------------+
| binlogs.000002  |  1036    | dflt         |                  |
+-----------------+----------+--------------+------------------+
```

Record the `File` and `Position` details. If binary logging has just been enabled, these are blank. Now, with the lock still in place, copy the data from the primary to the replica.

Login to the app container, then run:

```sh
# Dump the data from primary. Note that it dumps only the databases, which "replicator" user has access to.
$ mysqldump --all-databases --single-transaction -h database.internal -P 3306 -u replicator -p > /path/to/dump.sql
```

Download the dump file, then move it to the server where your replica lives so that the replica can import it.

```bash
# Copy the dump to your replica
$ mysql -u root < /path/to/dump.sql
```

Note for live databases: It is sufficient to make a local copy of the data; you don’t need to keep the primary locked until the replica has imported the data. Once the `mysqldump` has completed, you can release the lock on the primary by running `UNLOCK TABLES`.

```sql
mysql> UNLOCK TABLES;
```

## Set up the replica

### Configure the replica

As mentioned above you have to set up a replica on your own. Assuming that you have a running MariaDB/MySQL replica instance, give the replica a unique `server_id` (distinct from primary). You can find out primary's `server_id` by running:

```sql
mysql> SHOW VARIABLES LIKE 'server_id';

+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| server_id     | 1     |
+---------------+-------+
```

Then set a distinct `server_id` number (e.g. server_id+1) in your replica config (e.g. `my.cnf`) under:

```
[mysqld]
server_id=2
```

Next, reload the replica instance for the changes to take effect.

### Set up SSH tunneling

You need to set up an SSH tunnel from the replica server to the primary, tunneled through the application.

{{< note >}}
The SSH tunnel is interrupted every time the environment redeploys. For replication to continue you must set up an auto-restart for the tunnel. There are many ways to do so that are out of the scope of this documentation.
{{< /note >}}

You can set up an SSH tunnel using one of the following methods:
- Manually using SSH. Using this method makes it easier to set up an auto-restart for the tunnel. Consult the SSH documentation for details on setting up the tunnel and the auto-restart.

- Run the following {{% vendor/name %}} CLI command
(replacing `{{< variable "BRANCH_NAME" >}}` with the name of your production branch):

  ```bash
    {{% vendor/cli %}} tunnel:open --project {{< variable "PROJECT_ID" >}} --environment {{< variable "BRANCH_NAME" >}}
  ```
  This command opens local SSH tunnels to all services accessible from the application. 
  
To configure an auto-restart, you need the project's SSH address, which you can retrieve by running: 

  ```bash
  {{% vendor/cli %}} ssh --pipe --project {{< variable "PROJECT_ID" >}}
  ``` 
For details about this command, see the [{{% vendor/name %}} CLI reference](/administration/cli/reference.md#usage-54).

### Binary log retention and cleanup
When replication is disabled, the MariaDB service stops managing the binary logs and they remain on the file system. **You must delete these logs manually**. If the remote replica has been unreachable for some time, these logs can consume a significant amount of storage.

### Start the Replica

Once the data has been imported, you are ready to start replicating. Begin by running a `CHANGE MASTER TO`, making sure that `MASTER_LOG_FILE` matches the file and `MASTER_LOG_POS` the position returned by the earlier `SHOW MASTER STATUS` on the {{% vendor/name %}} database. For example:

```sql
mysql> CHANGE MASTER TO
  MASTER_HOST='{{< variable "REPLICATION_HOST" >}}',
  MASTER_USER='replicator',
  MASTER_PASSWORD='{{< variable "REPLICATION_PASSWORD" >}}',
  MASTER_PORT=3306,
  MASTER_LOG_FILE='binlogs.000002',
  MASTER_LOG_POS=1036,
  MASTER_CONNECT_RETRY=10;
```

Where `{{< variable "REPLICATION_HOST" >}}` varies depending on the SSH tunneling configuration you have, and the `{{< variable "REPLICATION_PASSWORD" >}}` can be obtained by running `{{% vendor/cli %}} ssh env`.

Now start the replica with the `START SLAVE` command:

```sql
mysql> START SLAVE;
```

Check that the replication is working by running the `SHOW SLAVE STATUS` command:

```sql
mysql> SHOW SLAVE STATUS \G
```

If replication is working correctly, the values of both `Slave_IO_Running` and `Slave_SQL_Running` should be `Yes`:

```sql
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
```

### [Optional/Troubleshooting] Skipping invalid binary log queries

In some cases, after applying primary's dump to the replica and starting the replica, you might experience replication errors (`Slave_SQL_Running: No` and `Error:` in the output of `SHOW SLAVE STATUS \G` above). Each of such errors needs a careful inspection, but you might be able to just skip some of them. For example:

```sql
mysql> STOP SLAVE; SET GLOBAL SQL_SLAVE_SKIP_COUNTER = 1; START SLAVE;
mysql> SHOW SLAVE STATUS \G
```

In case you have multiple errors you would need to repeat the steps above (preferred) or set `SQL_SLAVE_SKIP_COUNTER` (which corresponds to skipping the next N events from the primary) to a larger value.
