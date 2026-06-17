---
title: Troubleshoot MySQL
sidebarTitle: Troubleshoot
---

For more general information, see how to [troubleshoot development](/development/troubleshoot.md).

## Lock wait timeout

If a process running in your application acquired a lock from MySQL for a long period of time,
you receive MySQL error messages like this:

```sql
SQLSTATE[HY000]: General error: 1205 Lock wait timeout exceeded;
```

This is typically caused by one of the following:

* There are multiple places acquiring locks in different order.
  For example, code path 1 first locks record A and then locks record B,
  while code path 2 first locks record B and then locks record A.
* There is a long-running background process executed by your application that holds the lock until it ends.

If you're using [MariaDB 10+](/add-services/mysql/_index.md), use the SQL query `SHOW FULL PROCESSLIST \G` to list DB queries waiting for locks.
To determine where to debug, find output like the following:

```sql
< skipped >
Command: Query
Time: ...
State: Waiting for table metadata lock
Info: SELECT ...
< skipped >
```

To find active background processes, run `ps aufx` on your application container.

Make sure that locks are acquired in a pre-defined order and released as soon as possible.

## Definer/invoker of view lack rights to use them

There is a single MySQL user, so you cannot use the "DEFINER" Access Control mechanism for Stored Programs and Views.

When creating a `VIEW`, you may need to explicitly set the `SECURITY` parameter to `INVOKER`:

```sql
CREATE OR REPLACE SQL SECURITY INVOKER
VIEW `view_name` AS
SELECT
```

## Server has gone away

### Disk space issues

Errors such as `PDO Exception 'MySQL server has gone away'` are usually the result of exhausting your available disk space.
Get an estimate of current disk usage using the CLI command `{{% vendor/cli %}} db:size`.
Note that this is an estimate, not an exact value.

Allocate more space to the service in [`{{< vendor/configfile "services" >}}`](/add-services/_index.md).
As table space can grow rapidly,
set your database mount size to twice the size reported by the `db:size` command.

Consider adding a [low-disk warning](/integrations/notifications.md#low-disk-warning)
to get notified about low disk space before it becomes an issue.

### Packet size limitations

`MySQL server has gone away` errors may be caused by the size of the database packets.
If so, the logs may show warnings like `Error while sending QUERY packet` before the error.

One way to resolve the issue is to use the [`max_allowed_packet` parameter](/add-services/mysql/_index.md#configure-the-database).

### Worker timeout

`MySQL server has gone away` errors may be caused by server timeouts.
MySQL has a built-in timeout for idle connections, which defaults to 10 minutes.
Most typical web connections end long before that's ever approached,
but a long-running worker may idle and not need the database for longer than the timeout, leading to a "server has gone away" message.

The best approach is to wrap your connection logic in code that detects a "server has gone away" exception
and tries to re-establish the connection.

Alternatively, if your worker is idle for too long it can self-terminate.
{{% vendor/name %}} automatically restarts the worker process and the new process can establish a new database connection.

## Too many connections

You may get the following [error message](https://mariadb.com/kb/en/e1040/): `Error 1040: Too many connections`.
A common way to solve this issue is to increase the `max_connections` property in your MariaDB service configuration.
However, on {{% vendor/name %}}, you **cannot** configure `max_connections`, as it is calculated automatically based on available memory.

{{% note theme="info"%}}
This information applies to Professional/Grid {{% vendor/name %}} projects.
For Dedicated Gen 2 projects, [contact Support](/learn/overview/get-support.md) to configure the `max_connections` property.
{{% /note %}}

The `max_connections` property cannot be configured in {{% vendor/name %}} service configurations, nor can it be influenced by any other config. It is calculated automatically based on available container memory and increases automatically when the container size increases.

### How it works

The following formula determines `max_connections` for a given container:

```
        avg_memory_per_connection_mb = 4
        free = container_memory - (50 + container_memory * 0.70)
        max_connections = int(free // avg_memory_per_connection_mb)
```

The memory for a given container from its `size` depends on its [container profile](/create-apps/image-properties/size.html#container-profiles-cpu-and-memory).

For example, [MariaDB](/create-apps/image-properties/size.md#container-profile-reference) has a [`HIGH_MEMORY` container profile](/create-apps/image-properties/size.html#container-profiles-cpu-and-memory).
For `size: L`, this means 0.40 CPU and 1280 MB of memory.

Using the configuration above, where `mariadb.size: L` is 1280 MB, the calculation becomes:

```
        avg_memory_per_connection_mb = 4
        free = 1280 - (50 + 1280 * 0.70) # 1280 - 946 = 334
        max_connections = int(free // avg_memory_per_connection_mb) # 334 / 4 = 83.5 -> max_connections = 83
```

{{% note%}}
Additionally, `max_connections` has a minimum value of 15 and a maximum value of 500.
If the result is less than 15, it is set to 15.
If the result is greater than 500, it is capped at 500.
{{% /note%}}
