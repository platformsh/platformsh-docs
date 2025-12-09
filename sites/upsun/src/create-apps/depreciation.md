---
title: "Image Lifecycle & Deprecation Policy"
sidebarTitle: Image Lifecycle
description: Understand the support status and lifecycle timelines for all Upsun runtimes and services.
---

{{% vendor/name %}} images follow a clear lifecycle to ensure your applications run on secure, supported, and well-maintained runtimes and services. This policy helps you understand how long an image remains supported, when upgrades are required, and how we communicate lifecycle changes.

Maintaining safe and up-to-date applications is a shared responsibility:
{{% vendor/name %}} provides secure and stable image updates, while users are expected to track support timelines and upgrade before end-of-life.

## Image Lifecycle Stages

Each {{% vendor/name %}} image moves through four lifecycle stages:

| **Stage** | **Description** | **{{% vendor/name %}} Support** | **User Action** |
| ---- | ---- | ---- | ---- |
| **Active** | Latest LTS or community-supported version with ongoing updates. | Full support | No action needed |
| **Deprecated** | Upstream version leaves active support. Upsun still maintains the image, but it will be retired soon. | Full support |Start preparing migration |
| **Retired** | Upstream security support ends. Image is frozen, provided as-is and not maintained. The image will be decomissioned in 180 days |	Limited support	| Upgrade as soon as possible |
| **Decommissioned** | Image is no longer available.
Builds using it will fail. | - | Upgrade required to continue deploying |

These lifecycle stages are aligned with upstream support timelines for each ecosystem. {{% vendor/name %}} only supports:
- LTS versions for ecosystems with formal LTS (e.g., Node.js), and
- Versions receiving upstream security updates for ecosystems without LTS (e.g., Python, PHP).

## Deprecation Timeline

A typical image progresses through the following steps:

### 1. Active → Deprecated

An image becomes Deprecated as soon as the upstream runtime or service ends active support:
- {{% vendor/name %}} continues maintaining the image.
- Upgrade nudges appear in the Console, CLI, or API where applicable.

### 2. Deprecated → Retired

An image becomes Retired as soon as upstream security support ends.
During this Retired phase:
- The image is frozen and no longer maintained.
- It remains available for a **180-day grace period**.
- Deploying with this version is allowed but strongly discouraged.
- Users must migrate to avoid service interruption.

#### 3. Retired → Decommissioned (after 180 days)

Once the 180-day Retired period ends:
- {{% vendor/name %}} reviews usage of the retired image.
- The image is fully decommissioned afterward.
- New and existing projects can no longer build with it.
