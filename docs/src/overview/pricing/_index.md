---
title: "Pricing"
weight: 3
description: |
  Platform.sh is the Idea-to-Cloud Application Platform—the end to end solution to develop and deploy web apps and sites. We offer a free trial period so you can test the service and see how great it is.
layout: single
aliases:
  - "/overview/pricing.html"
---

{{% description %}}

All Platform.sh plans include:

* four Environments (3 for staging/development, 1 for the live site).
* one Developer license
* 5GB of Storage per environment
* multiple Backend services (MySQL, PostgreSQL, Elasticsearch, Redis, Solr..)
* support

Full pricing information is available at: https://platform.sh/pricing/

You can switch between plans (downgrade or upgrade) freely,
but note that reducing storage is currently not supported for technical reasons.
If you need to reduce storage, please create a support ticket.
You are always billed for the prorated cost of your plan over the period it was used.

You may cancel your plan at any time. You are only billed for the actual period used.

For Elite, Enterprise, and Agency Plans you can pay by purchase order.
For all other plans, you need to add a credit card to your account.

We offer a free trial period so you can test the services.
If you ever need more time to evaluate Platform.sh,
please contact our sales representatives.
They can issue you an extra voucher to prolong your test.

{{< note theme="info" title="none">}}

Prices below are listed in US Dollars.
You are billed in US Dollars, Euros, British Pounds, or Australian Dollars
depending on where your billing address is.
For a list of current prices, refer to https://platform.sh/pricing.

Euro Prices are presented excluding VAT.
Your bill includes the correct VAT rate as appropriate.

{{< /note >}}

## Extras

All extra consumption is prorated to the time it was actually used.

{{< note theme="info" title="none" >}}

For example, if you added an extra developer for 10 days,
you would be billed around 1/3 of the current price for an extra developer seat.

{{< /note >}}

### Extra developers

Adding a developer to your project adds a monthly per project per user fee
unless you have an Agency or Enterprise account.

### Extra environments

You can add extra staging/development environments to any plan by multiples of 3.

### Extra storage

You can add additional storage at $2.50 per month per 5GB,
per staging/development environment.

{{< note theme="info" title="none" >}}

For example, if you have the default plan (with 3 staging environments)
and you add 10GB (for a total of 15GB per environment),
you would pay an extra $15 a month.

If you added 3 extra environments (for a total of 6 staging environments)
and you added 10GB (for a total of 15GB per environment),
you would pay an extra $30 a month.

{{< /note >}}

You can make any changes up to 100&nbsp;GB yourself.
For storage more than 100&nbsp;GB, open a [support ticket](https://console.platform.sh/-/users/~/tickets).

## Development

The basic plan (Development) starts at $10 per month
and includes 4 environments: 3 staging/development and 1 future production.

{{< note theme="info" title="none" >}}

You can't map a custom domain name to a Development plan.

{{< /note >}}

Application containers on development environments default to the Standard size,
but they can be increased to match your production environment if needed.
Go to the **Edit plan** administration section for your project
and select your desired size under **Environments application size**.
This increases the size for all application containers (but doesn't affect service containers).
The new size increases the cost of your plan,
which you can accept by clicking **Upgrade plan**.

## Production

The live environment of a production plan has more resources than the project's development environments.
https://platform.sh/pricing lists the resources available per plan
(these are always only the production environment resources).
Development environments have their own resources
and aren't counted towards the limit.
You can only map domain names to your production environment.
SSL support is always included.

### Multiple applications in a single project

All Platform.sh plans support multiple applications in a single cluster,
but they share the global resources of the cluster.

The resources of a **Standard plan aren't sufficient to run more than one application** in the same cluster
if there is also a MySQL database as a service.
Useful multi-app projects start at Medium.

For example, a Medium plan can support 3 apps
with a MySQL instance and a Redis instance.

If you aren't sure whether a specific setup would fit in a plan,
don't hesitate to contact support.

## Dedicated Generation 3

For a lower price compared to traditional managed hosting,
you get included development and staging environments
as well as triple redundancy on every element of the stack with:

{{< note theme="info" title="none" >}}

99.99% uptime guaranteed

24/7 white glove onboarding and support

{{< /note >}}

Learn more about [Dedicated Generation 3](/dedicated-gen-3/overview).

[Contact our sales department](https://platform.sh/contact/) to discuss how we can help you.

## Agencies

Agencies have access to several partner levels with many perks.

* Agency partner levels: Registered, Bronze, Silver, Gold, Platinum, and Diamond
* Free user licenses: Silver and above
* Free development plan: Gold and above
* Access to an agency-speciﬁc Small plan price: Bronze and above
* Agency discounts for plans depending on the combination of the account tier and agency partner level:

  | Discount          | Registered | Bronze | Silver | Gold | Platinum | Diamond |
  | ----------------- | ---------- | ------ | ------ | ---- | -------- | ------- |
  | User license      |            |        | Free   | Free | Free     | Free    |
  | Development plan  |            |        |        | Free | Free     | Free    |
  | Professional tier |            |        | 10%    | 10%  | 10%      | 10%     |
  | Premier tier      |            |        | 10%    | 10%  | 10%      | 10%     |
  | Enterprise tier   |            |        | 10%    | 18%  | 20%      | 20%     |
  | Elite tier        |            |        |        |      | 25%      | 30%     |

* Agency partners may host their own agency website for free.
  The size of the plan depends on the agency tier as seen in the following table:

  | Registered | Bronze     | Silver        | Gold        | Platinum   | Diamond    |
  | ---------- | ---------- | ------------- | ----------- | ---------- | ---------- |
  | –          | Small plan | Standard plan | Medium plan | Large plan | Large plan |

[Learn more and join today](https://platform.sh/solutions/digital-agencies/).

If you have any questions, don't hesitate to [contact Sales](https://platform.sh/contact/).
