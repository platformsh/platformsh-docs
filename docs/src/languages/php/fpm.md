---
title: "PHP-FPM sizing"
weight: 5
---


## Glossary

- Worker: An instance of your code that runs background processes.
  Workers handle requests that don't hit your site's cache.
  The number of workers available to your site can therefore affect its performances.
  For more information, see how to [work with workers](../../create-apps/workers.md).

- Heuristic: a method of solving a problem using approximations rather than precise calculations 
  to provide quicker solutions.

## Introduction

Platform.sh uses a heuristic to automatically set the number of workers of the PHP-FPM runtime 
depending on how much server memory is available for the PHP container. 
This heuristic is based on assumptions about how much memory is necessary on average to process a request. 
You can adjust those assumptions if your application typically uses more or less memory.

Note that these assumptions are used only for determining the number of PHP-FPM workers to start.
They are independent of the `memory_limit` set in `php.ini`, 
which is the maximum amount of memory a single PHP process can use before it is automatically terminated.

## The heuristic

The heuristic is based on three input parameters:

- The memory available for the container, which depends on the size of the container (`S`, `M`, `L`).
- The memory that an average request is expected to require.
- The memory that needs to be reserved for things that aren't specific to a request 
  (memory for `nginx`, the op-code cache, some OS page cache, etc.).

The number of workers is calculated as:

![FPM](/images/php/phpfpmworkers.png "0.3")


## Adjust default assumptions 

The default assumptions used by the heuristic are:

 - `45 MB` for the average per-request memory.
 - `70 MB` for the reserved memory.

These values allow most programs to run but you can adjust them to fit your needs.

To do so, in your `.platform.app.yaml` file, adjust the values of the `runtime.sizing_hints.reserved_memory` and `runtime.sizing_hints.request_memory` keys.

For example, if your application consumes on average `110 MB` of memory for a request, you can use:

```yaml {location=".platform.app.yaml"}
runtime:
    sizing_hints:
        request_memory: 110
```

Note that the minimum value for the `request_memory` key is 10 MB
and the minimum value for the `reserved_memory` key is 70 MB.
If you set lower values, they are automatically overridden with those minimums.

For information on how to estimate the best `request_memory` value depending on your needs, 
see how to [measure PHP worker memory usage](./fpm.md#measure-php-worker-memory-usage). 

To check the maximum number of PHP-FPM workers available to your site,
open an [SSH session](/development/ssh/_index.md) and run the following command:

```bash
grep -e '^pm.max_children' /etc/php/*/fpm/php-fpm.conf
```

You get output similar to the following,
where workers are referred to as `children`:

```bash
pm.max_children = 2
```

## Measure PHP worker memory usage

To see how much memory your PHP worker processes use, 
open an [SSH session](/development/ssh/_index.md) 
and look at the PHP access log:

```bash
less /var/log/php.access.log
```

In the fifth column of the output, 
you can see the peak memory usage that occurred when each request was handled. 
The optimal request memory is somewhere between the average and worst case memory usages listed.

To help determine what the optimal request memory is, run the following command:

```bash
tail -n5000 /var/log/php.access.log | awk '{print $6}' | sort -n | uniq -c
```

Note that the above command takes into account the last 5000 requests that reached PHP-FPM.
You can adjust this number depending on the amount of traffic on your site.

In the output, you can see how many requests used how much memory, in KB.
For example:

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

In the above output:

- The majority of requests (4800) peaked at 2048 KB of memory, 
  likely thanks to application caching.
- Most other requests (3206) used up to around 10 MB of memory.
- 758 requests used more than 10 MB and up to around 18 MB of memory.
- Only 6 requests peaked at 131 MB of memory, 
  likely due to cache clears.

In such a situation, you might want to remain cautious and set an average request memory of 16 MB.
A more aggressive approach might be for you to set an average request memory of 10 MB instead.
Note that, with the more aggressive approach, there is a risk of allowing more concurrent requests 
and needing to use swap memory. 
This can result in latencies.

For further help in estimating your optimal average request memory, 
you can use the [log analyzer tool for Platform.sh](https://github.com/pixelant/platformsh-analytics) 
from the web agency [Pixelant](https://www.pixelant.net/). 
This tool offers a better visualization of access logs to determine how much memory requests use on average.
It also offers additional insights into the operation of your site. 
These can help further optimize your configuration 
and provide guidance on when to increase your plan size.
Note that this tool is maintained by a third party, not by Platform.sh.

For information on how to set an average request memory, see how to [adjust default assumptions](./fpm.md#adjust-default-assumptions).

