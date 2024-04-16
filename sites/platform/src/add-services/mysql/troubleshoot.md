---
title: Troubleshoot MySQL
sidebarTitle: Troubleshoot
---

{{% troubleshoot %}}

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

Allocate more space to the service in [`{{< vendor/configfile "services" >}}`](../_index.md).
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

{{% note %}}
The details below pertain to DG3 and Professional/Grid {{% vendor/name %}} projects.
For DG2 projects, feel free to consult with support to set `max_connections` directly.
{{% /note %}}

If you get the [error message](https://mariadb.com/kb/en/e1040/) `Error 1040: Too many connections`, a common way to fix is to increase the `max_connections` property for the MariaDB service's configuration.
On {{% vendor/name %}}, however, [this is not a configurable property](/add-services/mysql#configure-the-database) -- at least not directly.

### TLDR: how to fix

While `max_connections` isn't a property that can be configured directly in {{% vendor/name %}} service configurations, 
there are one of two quick changes you can make to your services configuration to increase `max_connections` and deal with `Error 1040`.

Given the following services configuration for MariaDB:

```yaml {configFile="services"}
# The name of the service container. Must be unique within a project.
mariadb:
    type: mariadb:{{% latest "mariadb" %}}
    disk: 2048
    size: L
    configuration:
        properties:
            max_allowed_packet: 16
```

`max_connections` in this case is `188` as set by {{% vendor/name %}} (see [how it works](#how-it-works)).
`max_connections` can be **increased** by _either_:

- **decreasing** `max_allowed_packet` (i.e. `16` → `15` will result in `max_connections=201`)
- **increasing** `size` (i.e. `L` → `XL` will result in `max_connections=356`)

### How it works

Behind the scenes, `max_connections` (for Professional and DG3 projects) is calculated from a few values that you _can_ change:

1. **`max_allowed_packet`**: `max_allowed_packet` is [directly configurable](/add-services/mysql#configure-the-database) in your `.platform/services.yaml` file with an integer value. 
The default value of `16` is shown below to illustrate:

    ```yaml {configFile="services"}
    # The name of the service container. Must be unique within a project.
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
        disk: 2048
        configuration:
            properties:
                max_allowed_packet: 16
    ```

1. **The memory available to the service**: Each {{% vendor/name %}} plan distributes resources among all of the containers in a cluster. The _strategy_ for how that is done can either be determined for you by {{% vendor/name %}} (equivalent to setting `size: AUTO`) or by setting a container size explicitly:

    ```yaml {configFile="services"}
    # The name of the service container. Must be unique within a project.
    mariadb:
        type: mariadb:{{% latest "mariadb" %}}
        disk: 2048
        size: L
        configuration:
            properties:
                max_allowed_packet: 16
    ```

    The memory for a given container from its `size` is dependent on its [***container profile***](/create-apps/app-reference/single-runtime-image#container-profiles-cpu-and-memory).
    [MariaDB](/create-apps/app-reference/single-runtime-image#container-profile-reference) has a `HIGH_MEMORY` [container profile](/create-apps/app-reference/single-runtime-image#high_memory-container-profile), which for `size: L` has 0.40 CPU and 1280 MB of memory.


If we assume the configuration above, where

- `mariadb.size: L`, which we know now is `1280` MB, referred to below as `application_size`
- `mariadb.configuration.properties.max_allowed_packet: 16`

`max_allowed_packet` is `188`, which is determined by {{% vendor/name %}} according to: 

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
\texttt{application_size} = 1280 \newline
\texttt{max_allowed_packet} = 16
\end{aligned}

We get:

\begin{aligned}
\texttt{innodb_buffer_pool_size} = \frac{\text{int}\left( 0.75 \cdot \texttt{application_size} \right)}{1024^{2}} = \frac{\text{int}\left( 0.75 \cdot \texttt{1280} \right)}{1024^{2}} \approx 9.155 \times 10^{-4}
\end{aligned}

\begin{aligned}
\texttt{AVAILABLE_MEMORY} = (\texttt{application_size} * 2) + 512 = (1280 * 2) + 512 = 3072
\end{aligned}

\begin{aligned}
\texttt{FREE_MEMORY} = \texttt{AVAILABLE_MEMORY} - \left( 50 + \texttt{innodb_buffer_pool_size} \right) \newline \newline
\texttt{FREE_MEMORY} = 3072 - \left( 50 + 0.0009155... \right) = 3021.999084
\end{aligned}

\begin{aligned}
\texttt{max_connections} = \text{int}\Biggl[ \min \left( \frac{\texttt{FREE_MEMORY}}{\texttt{max_allowed_packet}}, 500 \right) \Biggr] = \text{int}\Biggl[ \min \left( \frac{3021.999084}{16}, 500 \right) \Biggr] = \text{int}\Biggl[ 188.87... \Biggr]
\end{aligned}

\begin{aligned}
\texttt{max_connections} = 188
\end{aligned}

You can consult the table below for additional example calculations of `max_connections` for all `size` settings and for a number of `max_allow_packet` settings.

<div class="table_component" role="region" tabindex="0">
<table>
    <tbody>
        <tr>     
            <td rowspan="2" align="center"><b>MariaDB <code>max_connections</code> <br/> for common combinations <br/> of <code>size</code> & <br/> <code>max_allow_packet</code></b></td>
            <td colspan="6" align="center"><b><code>application_size</code><br><code>size</code> (memory in MB)</b></td>
        </tr>
        <tr align="center">
            <td><b>S<br>(128 MB)</b></td>
            <td><b>M<br>(288 MB)</b></td>
            <td><b>L<br>(1280 MB)</b></td>
            <td><b>XL<br>(2624 MB)</b></td>
            <td><b>2XL<br>(5248 MB)</b></td>
            <td><b>4XL<br>(10496 MB)</b></td>
        </tr>
        <tr align="center">
            <td><b>1<br>(min)</b></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>2</b></td>
            <td>358</td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>8</b></td>
            <td>89</td>
            <td>129</td>
            <td>377</td>
            <td><i>500</i></td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>16<br>(default)</b></td>
            <td>44</td>
            <td>64</td>
            <td>188</td>
            <td>356</td>
            <td><i>500</i></td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>32</b></td>
            <td>22</td>
            <td>32</td>
            <td>94</td>
            <td>178</td>
            <td>342</td>
            <td><i>500</i></td>
        </tr>
        <tr align="center">
            <td><b>64</b></td>
            <td>11</td>
            <td>16</td>
            <td>47</td>
            <td>89</td>
            <td>171</td>
            <td>335</td>
        </tr>
        <tr align="center">
            <td><b>100<br>(max)</b></td>
            <td>7</td>
            <td>10</td>
            <td>30</td>
            <td>57</td>
            <td>109</td>
            <td>214</td>
        </tr>
    </tbody>
</table>
</div>

Notice two things:

- The maximum value for `max_connections` is 500, indicated with italicized integers in the table.
- That `max_connections` can be **increased** in your environments by either 1) **decreasing** `max_allow_packet`, or 2) **increasing** the plan `size`.