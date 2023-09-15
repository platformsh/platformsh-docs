---
title: "Continous observability with Blackfire"
sidebarTitle: "Blackfire"
weight: -90
description: Set up a continuous observability strategy for your Laravel app with Blackfire.
---

[Blackfire.io](../../../increase-observability/integrate-observability/blackfire.md) continous observability solution is included with your {{< vendor/name >}} subscription and activated out of the box on your PHP and Python applications.

[Blackfire Monitoring](https://blackfire.io/docs/monitoring-cookbooks/index) is enabled by default on all your production environments. You can [trigger profiles](https://blackfire.io/docs/profiling-cookbooks/index) on any of your environments to understand the root cause of identified bottlenecks to the function or service calls level.

[Performance tests](https://blackfire.io/docs/testing-cookbooks/index) for your Laravel applications can be automated and triggered each time a branch is deployed (after a push, merge, or redeploy event).

This `.blackfire.yaml` [example file](https://github.com/platformsh-templates/laravel/blob/master/.blackfire.yaml) may help you bootstrap the writing of your performance tests.

For advanced cases, the Blackfire PHP SDK provides the following integrations with Laravel:
- [Laravel Artisan](https://blackfire.io/docs/php/integrations/laravel/artisan)
- [Laravel Horizon and other queue services](https://blackfire.io/docs/php/integrations/laravel/horizon)
- [Laravel Tests](https://blackfire.io/docs/php/integrations/laravel/tests)
