---
title: "Upgrade plan"
weight: 2
toc: false
aliases:
  - "/gettingstarted/going-live/upgrade-plan.html"
---

"Development" plan projects can't be assigned a domain name,
so you can't go live until you upgrade to at least a Standard plan.
This can be done using the Console.

{{< video src="videos/management-console/upgrade-plan.mp4" >}}

Development plans come with four environments: three development environments and one "future" production environment,
which is based on your default branch.

For example, "Small" plan sizes provide a production environment
but restrict your application to the use of a single service (such as a database).

On your project, click the **Go live** button in the top right hand corner of your project preview image.
This lets you edit the project's plan.

Select the plan size that's appropriate for the needs of your application.
This is also the page where you can increase the number of development environments and the amount of storage.
Make your changes and then click **Update plan** at the bottom of the page.
Your application is redeployed.

{{< guide-buttons next="I've upgraded my plan size">}}
