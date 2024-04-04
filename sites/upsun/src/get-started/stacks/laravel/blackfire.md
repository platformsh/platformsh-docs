---
title: "Manage continous observability with Blackfire"
sidebarTitle: "Blackfire"
weight: -90
description: Set up a continuous observability strategy for your Laravel app with Blackfire.
---

[Blackfire.io](/increase-observability/application-metrics/blackfire.md) is the recommended solution
for monitoring and profiling web sites and apps.
Blackfire works seamlessly with any app built with Laravel.

Blackfire PHP SDK provides the following [integrations with
Laravel](https://docs.blackfire.io/php/integrations/laravel/index):

- [Laravel Artisan](https://docs.blackfire.io/php/integrations/laravel/artisan)
- [Laravel Horizon and queue services](https://docs.blackfire.io/php/integrations/laravel/horizon)
- [Laravel Tests](https://docs.blackfire.io/php/integrations/laravel/tests)
- [Laravel Octane](https://docs.blackfire.io/php/integrations/laravel/octane)

Please refer to the [Blackfire documentation](https://docs.blackfire.io/testing-cookbooks/tests#the-code-blackfire-yaml-code-file) to set up a `.blackfire.yml` configuration to enable custom [performance tests](https://docs.blackfire.io/testing-cookbooks/index)
and automated [builds](https://docs.blackfire.io/builds-cookbooks/index).

{{< guide-buttons previous="Back" next="Debug with Telescope" nextLink="/get-started/stacks/laravel/laravel-telescope.md" type="*" >}}