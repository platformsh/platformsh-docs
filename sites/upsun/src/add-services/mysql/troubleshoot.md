---
title: Troubleshoot MySQL
sidebarTitle: Troubleshoot
---

For more general information, see how to [troubleshoot development](/development/troubleshoot).

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
* There is a long running background process executed by your application that holds the lock until it ends.

If you're using [MariaDB 10+](./_index.md), use the SQL query `SHOW FULL PROCESSLIST \G` to list DB queries waiting for locks.
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

There is a single MySQL user, so you can not use "DEFINER" Access Control mechanism for Stored Programs and Views.

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
Just keep in mind it's an estimate and not exact.

Allocate more space to the service by running the `upsun resources:set` command.
For more information, see how to [manage resources](/manage-resources.md).

As table space can grow rapidly,
it's usually advisable to make your database mount size twice the size reported by the `db:size` command.

You may want to add a [low-disk warning](../../integrations/notifications.md#low-disk-warning)
to learn about low disk space before it becomes an issue.

### Packet size limitations

`MySQL server has gone away` errors may be caused by the size of the database packets.
If so, the logs may show warnings like `Error while sending QUERY packet` before the error.

One way to resolve the issue is to use the [`max_allowed_packet` parameter](./_index.md#configure-the-database).

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
However, on {{% vendor/name %}}, you **cannot** configure `max_connections` directly.

### Quick fix

You cannot configure `max_connections` directly in {{% vendor/name %}} service configurations.
However, to solve `Error 1040`, you can increase `max_connections` indirectly.

Given the following services configuration for MariaDB:

```yaml {configFile="services"}
services:
  # The name of the service container. Must be unique within a project.
  mariadb:
    type: mariadb:{{% latest "mariadb" %}}
    configuration:
      properties:
        max_allowed_packet: 16
```

And assuming you have set the resources for that service using the following CLI command:

```bash
{{% vendor/cli %}} resources:set --size mariadb:1
```

`max_connections` in this case is `332` as [set by {{% vendor/name %}}](#how-it-works):

To **increase** `max_connections`, you can **either**:

- **decrease** `max_allowed_packet` (for example, `16` → `15` results in `max_connections=355`)
- or **increase** `size` using the `resources:set` command (for example, `1` → `2`  results in `max_connections=500`)

### How it works

Behind the scenes, `max_connections` is calculated from values that you _can_ change:

1. **`max_allowed_packet`**: `max_allowed_packet` is [directly configurable](/add-services/mysql#configure-the-database) in your `.upsun/config.yaml` file with an integer value.
The default value of `16` is shown below to illustrate:

    ```yaml {configFile="services"}
    services:
      # The name of the service container. Must be unique within a project.
      mariadb:
        type: mariadb:{{% latest "mariadb" %}}
        configuration:
          properties:
            max_allowed_packet: 16
    ```

1. **The memory available to the service**: Resources are provisioned to {{% vendor/name %}} containers according to your definition via the API, often through the `resources:set` CLI command:

    ```bash
    {{% vendor/cli %}} resources:set --size mariadb:1
    ```

    The memory for a given container from its `size` depends on its [container profile](/manage-resources/adjust-resources#advanced-container-profiles).

    For example, [MariaDB](/manage-resources/adjust-resources#default-container-profiles) has a `HIGH_MEMORY` [container profile](/manage-resources/adjust-resources#advanced-container-profiles).
    For `--size mariadb:1`, it means 1 CPU and 2432 MB of memory.


If we assume the configuration above, where:

- `--size  mariadb:1`, which we know is `2432` MB, referred to below as `application_size`
- `mariadb.configuration.properties.max_allowed_packet: 16`
- You are using the default `HIGH_MEMORY` profile assigned to MariaDB containers. [Changing the container profile](/manage-resources/adjust-resources#adjust-a-container-profile) changes the behavior below.

`max_allowed_packet` is `332`, which is determined by {{% vendor/name %}} according to:

\begin{aligned}
\texttt{max_connections} = \text{int}\Biggl[ \min \left( \frac{\texttt{FREE_MEMORY}}{\texttt{max_allowed_packet}}, 500 \right) \Biggr]
\end{aligned}

This calculation uses three additional calculations:

\begin{aligned}
\texttt{FREE_MEMORY} = \texttt{AVAILABLE_MEMORY} - \left( 50 + \texttt{innodb_buffer_pool_size} \right) \newline \newline
\texttt{AVAILABLE_MEMORY} = (\texttt{application_size} * 2) + 512 \newline \newline
\texttt{innodb_buffer_pool_size} = \frac{\text{int}\left( 0.75 \cdot \texttt{application_size} \right)}{1024^{2}}
\end{aligned}

So for our current example, where:

\begin{aligned}
\texttt{application_size} = 2432 \newline
\texttt{max_allowed_packet} = 16
\end{aligned}

You get:

\begin{aligned}
\texttt{innodb_buffer_pool_size} = \frac{\text{int}\left( 0.75 \cdot \texttt{application_size} \right)}{1024^{2}} = \frac{\text{int}\left( 0.75 \cdot \texttt{1280} \right)}{1024^{2}} \approx 1.7395 \times 10^{-3}
\end{aligned}

\begin{aligned}
\texttt{AVAILABLE_MEMORY} = (\texttt{application_size} * 2) + 512 = (1280 * 2) + 512 = 5376
\end{aligned}

\begin{aligned}
\texttt{FREE_MEMORY} = \texttt{AVAILABLE_MEMORY} - \left( 50 + \texttt{innodb_buffer_pool_size} \right) \newline \newline
\texttt{FREE_MEMORY} = 3072 - \left( 50 + 0.0009155... \right) = 5325.998...
\end{aligned}

\begin{aligned}
\texttt{max_connections} = \text{int}\Biggl[ \min \left( \frac{\texttt{FREE_MEMORY}}{\texttt{max_allowed_packet}}, 500 \right) \Biggr] = \text{int}\Biggl[ \min \left( \frac{3021.999084}{16}, 500 \right) \Biggr] = \text{int}\Biggl[ 332.87... \Biggr]
\end{aligned}

\begin{aligned}
\texttt{max_connections} = 332
\end{aligned}

The following table provides additional example calculations of `max_connections` for all `size` settings
and for a number of `max_allow_packet` settings.

<div class="table_component" role="region" tabindex="0">
<table>
    <tbody>
        <tr>
            <td rowspan="2" align="center"><b>MariaDB <code>max_connections</code></td>
            <td colspan="6" align="center"><b><code>application_size</code><br><br><code>size</code> (memory in MB)</b></td>
        </tr>
        <tr align="center">
            <td><b>0.1 (448 MB)</b></td>
            <td><b>0.25 (832 MB)</b></td>
            <td><b>0.5 (1408 MB)</b></td>
            <td><b>1 (2432 MB)</b></td>
            <td><b>2 (4032 MB)</b></td>
            <td><b>4 (6720 MB)</b></td>
            <td><b>6 (9024 MB)</b></td>
            <td><b>8 (11200 MB)</b></td>
        </tr>
        <tr align="center">
            <td><b>1<br>(min)</b></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>2</b></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>8</b></td>
            <td>169</td>
            <td>265</td>
            <td>409</td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>16<br>(default)</b></td>
            <td>84</td>
            <td>132</td>
            <td>204</td>
            <td>332</td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>32</b></td>
            <td>42</td>
            <td>66</td>
            <td>102</td>
            <td>166</td>
            <td>266</td>
            <td>434</td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>64</b></td>
            <td>21</td>
            <td>33</td>
            <td>51</td>
            <td>83</td>
            <td>133</td>
            <td>217</td>
            <td>289</td>
            <td>357</td>
        </tr>
        <tr align="center">
            <td><b>100<br>(max)</b></td>
            <td>13</td>
            <td>21</td>
            <td>32</td>
            <td>53</td>
            <td>85</td>
            <td>139</td>
            <td>185</td>
            <td>228</td>
        </tr>
    </tbody>
</table>
</div>

{{% note %}}
The maximum value for `max_connections` is 500, indicated with italicized integers in the table.

Also, you can **increase** `max_connections` in your environments by either:

- **decreasing** the `max_allow_packet` value in your service configuration
- or **increasing** the service's resources by using the CLI command `resources:set` and the `--size` flag
{{% /note %}}
