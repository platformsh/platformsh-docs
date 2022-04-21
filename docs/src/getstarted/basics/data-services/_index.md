---
title: "How data works"
weight: 2
layout: single
description: |
  Learn the basics of data inheritance, and how Platform.sh handles data to provide true staging environments.
---

## Staging environments

As you saw in the previous section, Platform.sh uses Git to associate the unique state of a repository (tree) with all of the components that make up how you're applications are built and deployed.
Application code, dependencies, build-visible variables, and infrastructure become a part of a unique build image, that is inherited during the creation of new environments and is reused during merges.

But data is different - at least, it usually is.
DevOps engineers spend a lot of time developing and maintaining in-house tooling that allows a development team to work on environments that include production data. 
The developers themselves place a request for a feature in a "development" environment to move into "staging", at which point this "as close to production as possible" space has to be set up before work can resume. 

All of this is time-consuming, but essential to operate DevOps workflows properly.
Without production data, there's no clear way to know for sure that a newly introduced feature won't break the production site when it's merged. 

## Data on Platform.sh

In the previous section you saw how Git was leveraged in the creation of new environments.
In this section, you will see how that exact same logic applies not only to the inheritance of infrastructure, but also to production data. 

{{< guide-buttons next="Show me the data" type="first" >}}
