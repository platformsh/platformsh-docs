---
title: Monitor Cron job executions
description: Learn how to visualize and interpret your Cron job runs directly in the console.
weight: -5
keywords:
  - "cron"
  - "jobs"
  - "monitor"
  - "logs"
  - "console"
---

You can view your [Cron job](/create-apps/app-reference/single-runtime-image.html#crons) executions directly from your project’s Services > Apps or Services > Workers pages. This visualization helps you quickly understand how scheduled jobs are performing and spot unusual patterns without manually checking logs.

Each execution is represented visually, letting you monitor performance trends and failures at a glance.

This makes it easier to:

- Verify that scheduled jobs are running on time.
- Identify failed or unusually long-running jobs.
- Drill into logs only when something looks wrong.

## How to view Cron job executions

1. Open your project in the Console.  
2. Select your chosen Environment.
3. Navigate to:
   - Services --> Apps & Services --> Apps --> app
   - Services --> Apps & Services --> Apps --> Workers (for background jobs).  
4. Click the **Crons** tab to view your scheduled jobs.  

Each Cron job displays a visual history of its executions over time.

## Understanding the visualization

Each execution appears as a vertical bar in the visualization:

| Visual element | Meaning | Example |
|----------------|----------|----------|
| **Color** | Indicates success or failure. | Green = success, Red = failure |
| **Height** | Proportional to the job’s execution time. | Taller bars indicate longer runtimes |
| **Click a bar** | Opens detailed logs for that specific run. | Review stdout/stderr for debugging |

This combination of color and height helps in spotting outliers, for example:

- A sudden tall red bar indicates a failed job that took longer than usual.
- Consistently tall green bars suggest a job that may need optimization.

Each vertical bar corresponds to a single execution. Hover over any bar to view basic details such as:

- Execution date and time
- Duration
- Status (success/failure)

Click a bar to open the detailed execution log, where you can inspect errors or performance information.

## Troubleshooting and best practices

- **Monitor for patterns**: Look for recurring red (failed) bars or progressively longer runtimes.  
- **Drill into logs**: Clicking a bar takes you directly to logs for that specific execution.  
- **Correlate with metrics**: Combine this view with [application metrics](/increase-observability/application-metrics.html) to identify performance bottlenecks.  
- **Adjust Cron timing**: If jobs overlap or run too frequently, adjust their schedule in your [`crons` configuration](/create-apps/app-reference/single-runtime-image.html#crons).  

{{< note theme="info" title="Investigate consistently high durations" >}}
If you notice that your Cron job runtimes are consistently increasing, this may indicate:

- Growing data volumes,
- Inefficient queries
- Resource limits being reached.

Use profiling tools like [Blackfire](/increase-observability/application-metrics/blackfire.html) to identify and resolve performance issues.

{{< /note >}}

## When to check Cron execution history

| Use case | Why it’s useful |
|-----------|----------------|
| **Autoscaling investigations** | Understand whether jobs are driving unexpected CPU or memory spikes. |
| **Deployment monitoring** | Verify that scheduled jobs resume normally after deployments. |
| **Job failure analysis** | Quickly locate the time and context of a failed execution. |
| **Performance tuning** | Spot trends in runtime duration and optimize resource usage. |

## Related content

- [Define and schedule Cron jobs](/create-apps/app-reference/single-runtime-image.html#crons)  
- [Application metrics](/increase-observability/application-metrics.html)  
- [Consume logs](/increase-observability/logs.html)  
- [Blackfire for PHP and Python](/increase-observability/application-metrics/blackfire.html)  
