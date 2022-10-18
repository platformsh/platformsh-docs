---
title: Pricing
weight: 3
description: See the basics of the plans Platform.sh offers and how to adjust them. 
layout: single
---

Platform.sh offers a variety of plans to fit your needs, including a free trial.

Full pricing information is available at https://platform.sh/pricing/.
The resources listed there are for [production environments](#production-environments).

You can switch between plans freely, adding or removing resources, including [extras](#extras).
You are always billed for the prorated cost over the period it was used.

You may cancel your plan at any time.
You are only billed for the actual period used.

## Plans

### Production plans

Any plan larger than a Development plan counts as a Production plan:
it comes with a [production environment](#production-environments).

### Development plans

A Development plan is useful for developing your apps before they're ready to go live.

With a Development plan, you can't use [custom domain names](../../domains/steps/_index.md).

### Production environments

Production environments are the live environments available to your users.
Each Production plan has one Production environment that can be mapped to a [custom domain name](../../domains/steps/_index.md).

The Production environment has more resources than the project's development environments.
See the main [pricing page](https://platform.sh/pricing) for the resources available per plan for Production environments.

### Development environments

Development environments can't be mapped to [custom domain names](../../domains/steps/_index.md).
Their resources are separate from Production environments.

App containers on development environments default to a size of {{< partial "plans/default-dev-env-size" >}}.
If you have the [`plans` permission](../organizations.md#manage-your-organization-users),
you can increase the size to match your production environment.
To do so, follow these steps:

1. In your project in the Console, click **{{< icon settings >}} Settings**.
2. Click **Edit plan**.
3. Under **Environments application size**, select a new size.
4. Click **Save** to accept the new plan cost.

This increases the size for all app containers.
It doesn't affect service containers.

## Switch plans

To switch plans, follow these steps:

1. In your project in the Console, click **{{< icon settings >}} Settings**.
2. Click **Edit plan**.
3. Under **Plans**, select a new plan.
4. Click **Save** to accept the new plan cost.

## Extras

In addition to the included resources for a plan, you can add extras to help scale your project.

All extra consumption is prorated to the time it was actually used.
For example, if you add an extra user for 10 days,
you're billed around 1/3 of the current price for a full month.

You can add the following extras:

* Users -- for an additional fee per user, except at certain [agency levels](#agencies).
* Environments -- extra staging/development environments can be added in multiples of 3.
* Storage -- extra storage can be added for a fee per 5&nbsp;GB per environment.
  So if you have added 3 additional environments for a total of 6 development environments,
  the fee is multiplied by 6.
  
  You can make any changes up to 100&nbsp;GB yourself.
  For storage over 100&nbsp;GB, create a [support ticket](https://console.platform.sh/-/users/~/tickets).

  You currently can't reduce your storage on your own for technical reasons.
  If you need to reduce storage, create a [support ticket](https://console.platform.sh/-/users/~/tickets).

## Multiple apps in a single project

All plans support multiple containers, but the containers share the plan's global resources.

The resources of a Standard plan can support a single app with services.
But they **aren't sufficient to run more than one app** with a service.
Useful multi-app projects start at {{< partial "plans/multiapp-plan-name" >}}.
For example, a {{< partial "plans/multiapp-plan-name" >}} plan can support 3 apps
with a MySQL service and a Redis service.

If you aren't sure whether a specific setup would fit into a plan,
don't hesitate to [contact support](https://console.platform.sh/-/users/~/tickets).

## {{% names/dedicated-gen-3 %}}

For more resources along with triple redundancy on every element of the stack, use a {{% names/dedicated-gen-3 %}} plan.

Learn more about [{{% names/dedicated-gen-3 %}}](../../dedicated-gen-3/overview.md).

To discuss how {{% names/dedicated-gen-3 %}} could work for you, [contact Sales](https://platform.sh/contact/).

## Agencies

Agencies have access to several partner levels with many perks.

* Agency partner levels: Registered, Bronze, Silver, Gold, Platinum, and Diamond
* Free user licenses: Silver and above
* Free development plan: Gold and above
* Access to an agency-speciﬁc Small plan price: Bronze and above
* Agency discounts for plans depending on the combination of the account tier and agency partner level:

  | Discount          | Registered | Bronze | Silver | Gold | Platinum | Diamond |
  | ----------------- | ---------- | ------ | ------ | ---- | -------- | ------- |
  | User license      | –          | –      | Free   | Free | Free     | Free    |
  | Development plan  | –          | –      | –      | Free | Free     | Free    |
  | Professional tier | –          | –      | 10%    | 10%  | 10%      | 10%     |
  | Premier tier      | –          | –      | 10%    | 10%  | 10%      | 10%     |
  | Enterprise tier   | –          | –      | 10%    | 18%  | 20%      | 20%     |
  | Elite tier        | –          | –      | –      | –    | 25%      | 30%     |

* Agency partners may host their own agency website for free.
  The size of the plan depends on the agency tier as seen in the following table:

  | Registered | Bronze     | Silver        | Gold        | Platinum   | Diamond    |
  | ---------- | ---------- | ------------- | ----------- | ---------- | ---------- |
  | –          | Small plan | Standard plan | Medium plan | Large plan | Large plan |

[Learn more and join today](https://platform.sh/solutions/digital-agencies/).

If you have any questions, don't hesitate to [contact Sales](https://platform.sh/contact/).
