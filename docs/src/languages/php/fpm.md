---
title: "PHP-FPM sizing"
weight: 5
---

Platform.sh uses a heuristic to automatically set the number of workers of the PHP-FPM runtime based on the memory available in the container.
This heuristic is based on assumptions about the memory necessary on average to process a request.
You can tweak those assumptions if your app typically uses considerably more or less memory.

Note that this value is independent of the `memory_limit` set in the [PHP settings](./_index.md#php-settings), which is the maximum amount of memory a single PHP process can use before it's automatically terminated.
These estimates are used only for determining the number of PHP-FPM workers to start.

## The heuristic

The heuristic is based on three input parameters:

- The memory available for the container, which depends on the size of the container (`S`, `M`, `L`),
- The memory that an average request is expected to require,
- The memory that should be reserved for things that aren't specific to a request (such as memory for `nginx`, the op-code cache, some OS page cache)

The number of workers is calculated as:

![FPM](/images/php/phpfpmworkers.png "0.3")

## Defaults

The default assumptions are:

- `45 MB` for the average per-request memory
- `70 MB` for the reserved memory

These are deliberately conservative values that should allow most programs to run without modification.

You can change them by using the `runtime.sizing_hints.reserved_memory` and `runtime.sizing_hints.request_memory` in your `.platform.app.yaml`.
For example, if your app consumes on average `110 MB` of memory for a request use:

```yaml {location=".platform.app.yaml"}
runtime:
    sizing_hints:
        request_memory: 110
```

The `request_memory` has a lower limit of 10 MB while `reserved_memory` has a lower limit of 70 MB.
Values lower than those are replaced with those minimums.

You can check the maximum number of PHP-FPM workers by opening an [SSH session](/development/ssh/_index.md) and running following command (example for PHP 7.x):

```bash
grep -e '^pm.max_children' /etc/php/*/fpm/php-fpm.conf
pm.max_children = 2
```

## Measuring PHP worker memory usage

To see how much memory your PHP worker processes are using, you can open an [SSH session](/development/ssh/_index.md) and look at the PHP access log:

```bash
less /var/log/php.access.log
```

The fifth column displays the peak memory usage that occurred while each request was handled.
The peak usage varies between requests, but to avoid the severe performance costs that come from swapping, your size hint should be somewhere between the average and worst case memory usages that you observe.

A good way to determine an optimal request memory is with the following command:

```bash
tail -n 5000 /var/log/php.access.log | strings | awk '{print $6}' | sort -n | uniq -c
```

This prints out a table of how many requests used how much memory, in KB, for the last 5,000 requests that reached PHP-FPM.
On a busy site you may need to increase that number.

As an example, consider the following output:

```text
      1
   4800 2048
    948 4096
    785 6144
    584 8192
    889 10240
    492 12288
    196 14336
     68 16384
      2 18432
      1 22528
      6 131072
```

This indicates that the majority of requests (4,800) used 2048 KB of memory.
In this case, that's likely app caching at work.
Most requests used up to around 10 MB of memory, while a few used as much as 18 MB and a very few (6 requests) peaked at 131 MB (probably cache clears).

A conservative approach would suggest an average request memory of 16 MB should be sufficient.
A more aggressive stance would suggest 10 MB.
The more aggressive approach would potentially allow for more concurrent requests at the risk of some requests needing to use swap memory, thus slowing them down.
