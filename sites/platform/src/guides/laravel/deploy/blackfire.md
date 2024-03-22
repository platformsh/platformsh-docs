---
title: "Continous observability with Blackfire"
sidebarTitle: "Blackfire"
weight: -90
description: Set up a continuous observability strategy for your Laravel app with Blackfire.
---

[Blackfire.io](../../../increase-observability/integrate-observability/blackfire.md) is the recommended solution for monitoring and profiling web sites and applications. Blackfire works seamlessly with any application built with Laravel, like any PHP application.

For advanced cases, the Blackfire PHP SDK provides the following integrations with Laravel:
- [Laravel Artisan](https://blackfire.io/docs/php/integrations/laravel/artisan)
- [Laravel Horizon and other queue services](https://blackfire.io/docs/php/integrations/laravel/horizon)
- [Laravel Tests](https://blackfire.io/docs/php/integrations/laravel/tests)

A `.blackfire.yaml` file is provided within the [Laravel Template](https://github.com/platformsh-templates/laravel/blob/master/.blackfire.yaml) to help you bootstrap the writing of custom [performance tests](https://blackfire.io/docs/testing-cookbooks/index) and automated [builds](https://blackfire.io/docs/builds-cookbooks/index).

{{< guide-buttons previous="Back" next="Improve performance with Octane" >}}