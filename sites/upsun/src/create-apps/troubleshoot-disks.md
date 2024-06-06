---
title: "Troubleshoot disks"
---

For more general information, see how to [troubleshoot development](/development/troubleshoot).

## Low disk space

If you have set up [health notifications](../integrations/notifications.md),
you may receive a notification of low disk space.

To solve this issue:

* [Check mount usage](./troubleshoot-mounts.md#disk-space-issues)
* [Check your database disk space](#check-your-database-disk-space) (if applicable)
* [Increase the available disk space](#increase-available-disk-space) (if necessary)

### Check your database disk space

To get approximate disk usage for a database, run the command `{{% vendor/cli %}} db:size`.
This returns an estimate such as the following:

```text
+----------------+-----------------+--------+
| Allocated disk | Estimated usage | % used |
+----------------+-----------------+--------+
| 1.0 GiB        | 520.3 MiB       | ~ 51%  |
+----------------+-----------------+--------+
```

Keep in mind that this estimate doesn't represent the exact real size on disk.
But if you notice that the usage percentage is high, you may need to increase the available space.

### Increase available disk space

If you find that your application or service is running out of disk space,
you can increase the available storage.

To increase the space available for applications and services,
use the `{{% vendor/cli %}} resources:set` command.
For more information, see how to [manage resources](/manage-resources.md).
## No space left on device

During the `build` hook, you may see the following error:

```text
W: [Errno 28] No space left on device: ...
```

This is caused by the amount of disk provided to the build container before deployment.
Application images are restricted to 8&nbsp;GB during build, no matter how much writable disk has been set aside for the deployed application.

Some build tools (yarn/npm) store cache for different versions of their modules.
This can cause the build cache to grow over time beyond the maximum.
Try [clearing the build cache](../development/troubleshoot.md#clear-the-build-cache) and [triggering a redeploy](../development/troubleshoot.md#force-a-redeploy).

If for some reason your application absolutely requires more than 8&nbsp;GB during build,
you can open a [support ticket](/learn/overview/get-support) to have this limit increased.
