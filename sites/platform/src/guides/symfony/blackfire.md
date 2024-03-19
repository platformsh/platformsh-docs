---
title: "Continous Observability with Blackfire"
sidebarTitle: "Blackfire"
weight: -90
description: Set up a continuous observability strategy for your Symfony app with Blackfire.
---

[Blackfire.io](../../../increase-observability/integrate-observability/blackfire.md) is the recommended solution
for monitoring and profiling web sites and apps.
Blackfire works seamlessly with any app built with Symfony.

Blackfire PHP SDK provides the following [integrations with
Symfony](https://blackfire.io/docs/php/integrations/symfony/index):

- [Symfony HTTPClient](https://blackfire.io/docs/php/integrations/symfony/http-client)
- [Symfony Messenger](https://blackfire.io/docs/php/integrations/symfony/messenger)
- [Symfony CLI Commands Monitoring](https://blackfire.io/docs/php/integrations/symfony/cli-commands-monitoring)
- [Symfony Functional Tests Production](https://blackfire.io/docs/php/integrations/symfony/functional-tests)

A `.blackfire.yaml` file is provided within the [Symfony Templates](https://github.com/symfonycorp/platformsh-symfony-template/blob/6.2/.blackfire.yaml)
to help you bootstrap the writing of custom [performance tests](https://blackfire.io/docs/testing-cookbooks/index)
and automated [builds](https://blackfire.io/docs/builds-cookbooks/index).

{{< guide-buttons previous="Back" next="Local development" >}}