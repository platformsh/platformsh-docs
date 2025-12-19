---
title: Organizations
weight: -1
description: See how to manage multiple {{% vendor/name %}} projects at once through organizations.
---

Organizations allow you to manage your {{% vendor/name %}} projects, users, and billing.
You can group multiple projects in one organization and manage them together.

To manage users within your organization, see how to [manage organization users](/administration/users.md#manage-organization-users).

## Manage your organization settings

As an organization owner, you can manage the basic settings for your organization such as its name and URL.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
2. Open the user menu (your name or profile picture).
3. Click **Settings**.
4. Click **Edit** to edit the label or click in the **Organization URL** field to edit the URL.
5. Click **Save**.

<--->
+++
title=Using the CLI
+++

To change the name (URL) and label of the `acme` organization, run:

```bash
{{% vendor/cli %}} organization:info --org acme label "Acme Corp" name acme-corp
```

To verify the changes, run:

```bash
{{% vendor/cli %}} organization:info --org acme-corp
```

{{< /codetabs >}}

## Manage your organization billing

As an organization owner or an organization user with the **Manage billing** permission,
you can access and download invoices and edit billing information such as the stored credit card and billing address.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to the organization you want to manage (or a project in it).
1. Open the user menu (your name or profile picture).
1. Click **Billing**.

{{< /codetabs >}}

## Create a new organization

You can create new organizations with different payment methods and billing addresses
and organize your projects as you want.

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization or a project in it.
1. Open the user menu (your name or profile picture).
1. Click **Create Organization**.
1. Enter the required information (label, organization URL, company name, country, security contact).
1. Click **Create organization**.

<--->
+++
title=Using the CLI
+++

To create an organization with the label `Acme` and the name (URL) `acme`, run:

```bash
{{% vendor/cli %}} organization:create --label "Acme" --name acme --country "United States"
```

To verify the changes, run:

```bash
{{% vendor/cli %}} organization:info --org acme
```

{{< /codetabs >}}

## Delete an existing organization

As an organization owner, you can delete your own organization.

Note that if your organization owns projects or owes remaining invoices, you can not delete it yourself.
To have it deleted, [contact support](/learn/overview/get-support.md).

{{< codetabs >}}

+++
title=Using the Console
+++

1. Navigate to your existing organization or a project in it.
2. Open the user menu (your name or profile picture).
3. Click **Settings**.
4. Click **Delete Organization**.
5. Confirm your decision by clicking **Delete**.

<--->
+++
title=Using the CLI
+++

To delete the organization `acme`, run:

```bash
{{% vendor/cli %}} organization:delete --org acme
```

{{< /codetabs >}}

## Transfer project ownership

You can transfer your plan ownership to a different organization at anytime.
You have to be an organization owner or have the [manage plan permission](/administration/users.md#organization-permissions).

1. Make the new organization owner a [project admin](/administration/users.md#)
   for the project you want to transfer.
2. To ask for the transfer, from your organization account open a [support ticket](/learn/overview/get-support.md).

Once the transfer is completed, the new organization can administer all project settings and billing and receives future invoices.
Ownership transfer automatically transfers subscription charges to the new organization.

## Transfer organization ownership

To transfer an organization to a different owner, first make sure that user is part of the organization.
If they aren't yet, [add them](/administration/users.md#add-a-user-to-an-organization).
Then open a [support ticket](/learn/overview/get-support.md) from the current organization to ask for the transfer.

## Fixed and Flex organizations

### What is an Upsun Fixed organization?
Ideal for workloads that have consistent resource requirements with stable and predictable usage.
Users can select a plan with predefined CPU and Memory resources. You can not adjust these resources, nor scale them automatically. To increase capacity, you’ll need to upgrade to a higher plan.

{{< note theme="note" title="Fixed resources">}}

**Fixed:** Resource from the plan is applied to the production environment. For preview, the user has the default small size for all containers.

{{< /note >}}

### What is an Upsun Flex organization?
Ideal for workloads that evolve over time or have dynamic resource requirements. Flex will suit most use cases. Users will be able to allocate the exact CPU and Memory resources that your applications and services need. You can adjust these resources at any time, or configure them to adapt automatically. You are charged based on the resources you allocate.

{{< note theme="info" title="Flex resources">}}

**Flex:** Users can customize resources per container (per app or service) for **all** environments.

{{< /note >}}


## Create a Fixed organization

**Only {{% vendor/name %}} customers under current contracts can create a Fixed organization, and this is accomplished by opening a support ticket as described below.** 

For all other customers, all new organization types are Flex organizations, which you can create yourself by using the Console or CLI as described above.

To create a Fixed organization, please open a [support ticket](/learn/overview/get-support.md), and indicate the following information in your ticket:

- Indicate that you are requesting the creation of a Fixed organization.
- **Category:** Access  
- **Priority:** Low / Normal (as required)  
- **Description:** Make sure to include the **organization name** you would like.

Our Support team will verify your eligibility for a Fixed organization. Once approved, a Fixed organization will be created on your behalf. Support will notify you when the organization is ready, and your ticket will be closed.


### Feature differences

#### Developer experience

| **Feature** | **Upsun Fixed** | **Upsun Flex** |
|-------------|-----------------|----------------|
| Manual backups | Yes | Yes |
| Health notifications | Yes | Yes |
| Preview environments | Yes | Yes |
| Free SSL certificates | Yes | Yes |
| Source integrations (GitHub, GitLab, Bitbucket) | Yes | Yes |
| Runtime operations | Yes | Yes |
| Custom # of preview environments | No (3 small included, purchase by bulk of 3) | Yes |
| Custom size of preview environments | No | Yes |
| Resource allocation | Project Level Plans | Container Level |
| Custom build resources | No | Yes |
| Autoscaling | No | Yes |
| Horizontal scaling of apps | No | Yes |
| Guaranteed CPU | No | Yes |
| Dedicated architecture | Yes | No |
| Custom domains on preview environments | Enterprise and Elite only | Yes |
| Automated code updates | Enterprise and Elite only | Yes |
| Manual deployment | Enterprise and Elite only | Yes |
| Zero downtime deployment | Enterprise and Elite only | Yes |
| Custom backup retention policies | Different packages | Unlimited (pay for storage) |
| Email SMTP server | Yes | Yes |
| Email validation (DKIM) | Enterprise and Elite only | Yes |
| ElasticSearch (Premium containers) | Enterprise and Elite only | No |
| MongoDB (Premium containers) | Enterprise and Elite only | No |

#### Observability tools

| **Feature** | **Upsun Fixed** | **Upsun Flex** |
|-------------|-----------------|----------------|
| Logs forwarding | Enterprise and Elite only | Yes |
| Blackfire | Enterprise and Elite only (or self-service add-on) | Yes |
| HTTP Traffic | Yes (but longer timeframe with Enterprise) | Yes |
| Continuous profiling | Enterprise and Elite only | Yes |
| Resources | Yes (but longer timeframe with Enterprise) | Yes |

#### User management

| **Feature**    | **Upsun Fixed**                        | **Upsun Flex**   |
|----------------|----------------------------------------|------------------|
| Google SSO     | Enterprise and Elite only              | Yes, with add-on |
| OpenID Connect | Elite only                             | Yes, with add-on |
| Multifactor Authentication  | Enterprise and Elite only | Yes, with add-on |
| Teams          | Enterprise and Elite only              | Yes, with add-on |

#### Support & SLAs

| **Feature** | **Upsun Fixed** | **Upsun Flex** |
|-------------|-----------------|----------------|
| Support SLA | Enterprise and Elite only | Yes, with add-on |
| Uptime SLA | Enterprise and Elite only (Architecture based) | Yes, with add-on |
| CDN | Enterprise and Elite only | Yes |
| Fastly WAF | Enterprise & Elite only as add-on | Yes, with add-on |
| Upsun WAF | Enterprise and Elite only | Yes |

#### Billing

| **Feature** | **Upsun Fixed** | **Upsun Flex** |
|-------------|-----------------|----------------|
| Pay as you go (Monthly) | Yes | Yes |
| Pay with credit card | Yes | Yes |
| Pay with SEPA | Enterprise and Elite only | Yes |
| Volume discounts | No | Yes |

#### Security & Compliance

| **Feature** | **Upsun Fixed** | **Upsun Flex** |
|-------------|-----------------|----------------|
| Privacy regulations | Yes | Yes |
| SOC 2 | Yes | Yes |
| PCI DSS Level 1-compatible | Yes | Yes |
| HIPAA | Enterprise and Elite only in specific regions | Coming soon |


### Fixed and Flex FAQs

#### What happens to my URL?
- `https://auth.api.platform.sh/` will become `https://auth.upsun.com/`.

#### If I had a Fixed organization (previously Platform.sh), will I be redirected to my organizations?  
- Yes. You will be automatically redirected to the new console and can log in using the same credentials.  

#### Will I be able to switch if I have both Fixed and Flex organizations?  
- Yes. You can navigate between organizations (Fixed or Flex) from a drop-down list.  

#### How will Fixed vs Flex be identifiable in the console?  
- Organizations will have tags next to their names in the console.  
- Organizations will also be categorized by organization type in the console.  

#### Will I be able to access Fixed projects via the Upsun CLI?  
- Correct.  

#### Will I still use the same configuration files for Fixed projects?  
- Correct. The same configuration file structures remain (`.platform.app.yaml`, `.platform/services.yaml`, `.platform/routes.yaml`, etc).  

#### Besides the name "Platform.sh" going away, will there be visual changes in the console?  
Yes.
  - There will be a new way to create organizations (you can now choose Fixed or Flex).  
  - Ability to navigate between organization types.  
  - **[15-day free trial](https://auth.upsun.com/register/)** for users creating Flex organizations.  

#### With a unified CLI, will there be a way to identify Fixed vs Flex in the project list?  
- You will see a list of all organizations.  
- There is no field in the CLI that explicitly identifies Fixed vs Flex.  

#### Do Upsun projects run in the same regions as Platform.sh projects?
Correct.

#### How can I anticipate my monthly invoice with usage-based pricing?
Upsun gives a monthly price estimation for the current and next full month based on current usage pattern.

#### Can I use the same credentials / SSO / 2FA on Platform and Upsun?
Yes.

#### Can I use Blackfire for my Upsun applications?
Upsun includes Blackfire by default.

#### Will Upsun be delivered entirely on a “self service” model?
Yes. Additionally, Upsun offers discounts based on volume commitment that is contracted for 1+ Year.

#### Can I try Upsun before buying?
Yes, you can [sign-up for the 15-day trial](https://auth.upsun.com/register/).