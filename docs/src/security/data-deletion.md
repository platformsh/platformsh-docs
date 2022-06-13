---
title: Data deletion
description: |
  Data deletion is handled via our backend providers. When a volume is released back to the provider, the provider performs a wipe on the data utilizing [NIST 800-88](https://csrc.nist.gov/publications/detail/sp/800-88/rev-1/final). This wipe is done immediately before reuse.
---

{{% description %}}

All projects, except those hosted on OVH, utilize encrypted volumes.
The encryption key is destroyed when the volume is released back to the provider,
which adds another layer of protection.

## Media destruction

Media destruction is handled via our backend providers. When the provider decommissions media it undergoes destruction as outlined in NIST 800-88.

## Data subject removal

Data subject deletion requests where Platform is the controller are handled via a [support ticket](https://docs.platform.sh/overview/getting-help.html). For contracts designating Platform as the processor, deletion requests should be sent to the controller and we will forward any that we receive.

Our product is a Platform as a Service. Platform does not directly edit customer data to ensure data confidentiality, security, and integrity. All data deletion requests for customer data must be handled by the concerned data controller.
