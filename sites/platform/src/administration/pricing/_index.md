---
title: Pricing
weight: 3
description: See the basics of the plans {{% vendor/name %}} offers and how to adjust them.
layout: single
---

{{% vendor/name %}} offers a variety of plans to fit your needs, including a free trial.

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

A Development plan provides all the tools you need to build your website
before it's ready to go live.

With a Development plan, you can't use [custom domain names](../../domains/steps/_index.md).
You also can't use a Development plan for production
since it doesn’t allow for full production-level resources.

After your project is complete and ready for production,
choose [another plan](../pricing/_index.md) to go live.

### Production environments

Production environments are the live environments available to your users.
Each Production plan has one Production environment that can be mapped to a [custom domain name](../../domains/steps/_index.md).

The production environment has more resources than the project's preview environments.
See the main [pricing page](https://platform.sh/pricing) for the resources available per plan for Production environments.

### Preview environments

Preview environments can't use the same custom domain as a production environment.
Instead, you can set up specific [custom domains for each of your preview environments](../../domains/steps/custom-domains-preview-environments.md).

Preview environments use resources that are separate from production environments.

App containers on preview environments default to a size of {{< partial "plans/default-dev-env-size" >}}.
If you have the [manage plans permission](../users.md#organization-permissions),
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
* Environments -- extra preview environments can be added in multiples of 3.
* Storage -- extra storage can be added for a fee per 5&nbsp;GB per environment.
  So if you have added 3 additional environments for a total of 6 preview environments,
  the fee is multiplied by 6.
  To ensure environments are available on demand, the fee applies to all environments you have added
  even if you aren't currently actively using them.

  You can make any changes up to 100&nbsp;GB yourself.
  For storage over 100&nbsp;GB, open a [support ticket](/learn/overview/get-support).

  You currently can't reduce your storage on your own for technical reasons.
  If you need to reduce storage, open a [support ticket](/learn/overview/get-support).

## Multiple apps in a single project

All plans support multiple containers, but the containers share the plan's global resources.

The resources of a Standard plan can support a single app with services.
But they **aren't sufficient to run more than one app** with a service.
Useful multi-app projects start at {{< partial "plans/multiapp-plan-name" >}}.
For example, a {{< partial "plans/multiapp-plan-name" >}} plan can support 3 apps
with a MySQL service and a Redis service.

If you aren't sure whether a specific setup would fit into a plan,
don't hesitate to [contact support](https://console.platform.sh/-/users/~/tickets).

{{< version/only "1" >}}

## {{% names/dedicated-gen-3 %}}

For more resources along with triple redundancy on every element of the stack, use a {{% names/dedicated-gen-3 %}} plan.

Learn more about [{{% names/dedicated-gen-3 %}}](/dedicated-environments/dedicated-gen-3/_index.md).

To discuss how {{% names/dedicated-gen-3 %}} could work for you, [contact Sales](https://platform.sh/contact/).

{{< /version/only >}}

## Enterprise overages

**The following applies to all Enterprise and Elite subscriptions.**

If your apps happen to receive and send more traffic during the month than your plan includes,
you are charged the overage rate for additional bandwidth consumption.

If you experience repeated overages, please reach out to your Customer Success Manager to review your existing contract.

Plans with a Fastly CDN service or the extra Fastly Service include the following:

- 1&nbsp;TB of egress (outgoing) bandwidth on the CDN (Fastly) per month
- 50 million ingress (incoming) requests on the CDN per month

*Plans without the Fastly Service are instead charged at the following origin prices.*

### Overage prices

| SKU             | Description                                                                             | USD  | EUR  | AUD    | CAD    | GBP  |
|-----------------|-----------------------------------------------------------------------------------------|------|------|--------|--------|------|
| `EDGE-ORN-OVERAGE-1TB`    | Origin Egress Bandwidth: 1TB               | $209  | €155  | AU$303 | CA$284 | £161  |
| `EDGE-BDW-OVERAGE-1TB`    | Edge Egress Bandwidth: 1TB               | $88  | €65  | AU$128 | CA$119 | £68  |
| `EDGE-REQ-OVERAGE-50M`    | Ingress Requests: 50M               | $66  | €49  | AU$96 | CA$90 | £51  |


### DDoS surge protection

If your site is suffering from a DDoS attack, overages may apply.
You can contact your Customer Success Manager to add DDoS surge protection to your plan.

| SKU                    | Description                                | USD    | EUR    | AUD      | CAD      | GBP    |
|------------------------|--------------------------------------------|--------|--------|----------|----------|--------|
| `EDGE-DDOS-PROTECTION` | Surge protection for DDoS related overages | $2,400 | €1778 | AU$3,480 | CA$3,257 | £1,847 |

## Agencies

Agencies have access to several partner levels with many perks.

* Agency partner levels: Registered, Bronze, Silver, Gold, Platinum, and Diamond
* Free user licenses: Silver and above
* Free development plan: Gold and above
* Access to an agency-speciﬁc Small plan price: Bronze and above
* Agency discounts for plans depending on the combination of the account tier and agency partner level:

  | Discount          | Registered | Bronze | Silver | Gold | Platinum | Diamond |
  |-------------------|------------|--------|--------|------|----------|---------|
  | User license      | –          | –      | Free   | Free | Free     | Free    |
  | Development plan  | –          | –      | –      | Free | Free     | Free    |
  | Professional tier | –          | –      | 10%    | 10%  | 10%      | 10%     |
  | Premier tier      | –          | –      | 10%    | 10%  | 10%      | 10%     |
  | Enterprise tier   | –          | –      | 10%    | 18%  | 20%      | 20%     |
  | Elite tier        | –          | –      | –      | –    | 25%      | 30%     |

* Agency partners may host their own agency website for free.
  The size of the plan depends on the agency tier as seen in the following table:

  | Registered | Bronze     | Silver        | Gold        | Platinum   | Diamond    |
  |------------|------------|---------------|-------------|------------|------------|
  | –          | Small plan | Standard plan | Medium plan | Large plan | Large plan |

[Learn more and join today](https://platform.sh/solutions/digital-agencies/).

If you have any questions, don't hesitate to [contact Sales](https://platform.sh/contact/).

## Sponsored sites

{{% vendor/name %}} provides sponsored hosting for Free Software projects, tech community events and organizations as part of our effort to support the Free Software community. 
That offering can include either a project on {{% vendor/name %}}, or profilable environments through Blackfire.io, depending on the needs of the project. 

## Dunning process

In instances where a payment has failed, {{% vendor/name %}} will make three separate attempts to take the outstanding balance from your account. 

These attempts will be made on the 4th, 11th and 15th of the month. If your payment fails after the third attempt, your projects will be suspended the following day. All projects on the billing subscription will be affected.  

<div align="center">

{{< get-started/next-button next="https://platform.sh/community/open-source/apply/" nextText="Apply" >}}

</div>
