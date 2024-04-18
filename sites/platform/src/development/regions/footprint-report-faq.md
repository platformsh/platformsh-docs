---
title: Footprint Report FAQ
sidebarTitle: CO<sub>2</sub>eq footprint reports
description: |
    {{% vendor/name %}} is committed as an organization to reducing our environment impact. 
    In parallel to that goal, we provide a yearly report to user organizations which details that organization’s annual CO<sub>2</sub>eq emissions for that year. 
    This page contains a number of Frequent Asked Questions about this report.
---

{{% description %}}

## What is the carbon footprint report?

The {{% vendor/name %}} carbon footprint report details the organization’s annual CO<sub>2</sub>eq emissions based on its activities. 
{{% vendor/name %}} will provide this information to its customers by email, beginning with their 2023 data.In part, while the methodology is refined over time and has changed, it is more accurate than in previous years.

The report customers receive by email can be used to report their cloud emissions for the EU’s Corporate Sustainability Reporting Directive (CSRD) or similar carbon disclosure requirements. 
Typically, a full carbon footprint report covers Scopes 1, 2, and 3. 
As noted below, this cloud footprint is one part of an organization’s Scope 3 disclosures. 
Scope 3 emissions are those based on activities from sources not owned or controlled by an organization (e.g., renting cloud instances, airline flights, and more). 

## Why am I receiving this carbon footprint report?

The {{% vendor/name %}} carbon footprint report enables customers to better understand their environmental impact. 
It's a step towards making informed decisions that align with sustainability goals, whether for internal benchmarking or reporting in compliance with environmental, social, and governance criteria.

## How were the emissions for my organization calculated?

The emissions were calculated using the [Greenhouse Gas (GHG) Protocol](https://ghgprotocol.org/) and quantified by [Greenly](https://greenly.earth/en-us/carbon-footprint), a certified carbon auditor. 
Emissions are calculated from both {{% vendor/name %}} allocated grid environments and dedicated clusters, when applicable, associated with your organization's activities annually. 
Calculations involve resource usage, including compute, storage, network, CDN, and Freon leaks. 
By definition, these footprints account for the life cycle analysis of the data center and operational emissions from the data center to the end user’s router.

## How does this report help me?

The report can help you gain insights into the carbon footprint of your digital operations, empowering you to make greener choices. 
It also aids in identifying opportunities to reduce emissions, such as opting for more efficient infrastructure or migrating to data centers powered by low-carbon electricity. 
{{% vendor/name %}} efficiencies and initiatives to reduce cloud carbon emissions can directly contribute to your sustainability goals, offering environmental and potential financial benefits (e.g., discounts for greener data centers).

If you want to migrate projects from a higher-carbon to a lower-carbon data center, please see the [migration procedure](/projects/region-migration). 
Carbon footprint reports will also be available for Upsun, the latest PaaS offering from {{% vendor/name %}}, created for projects built on decoupled, microservices, or composable architecture. [Find out more](https://upsun.com/). 

## How should these emissions be reported as part of a carbon footprint or ESG report?

As mentioned above, the CO<sub>2</sub>eq emissions were calculated using the GHG Protocol method and quantified by Greenly. 
Following the GHG protocol in this approach, the scope of these emissions takes into consideration life cycle analysis (operational and embodied emissions) for the data centers and fixed networks, including up to the clients’ router. 
This cloud footprint falls under Scope 3 for digital emissions, and more specifically, under category 3.8, upstream leased assets.

## Can I get a detailed breakdown of emissions by annual/monthly project consumption?

In this initial version of the report, {{% vendor/name %}} summarizes your organization's total emissions. 
Our team is exploring options to provide more granular information in future reports and welcomes your feedback about specific information that would be valuable to you. [Provide feedback](https://next.platform.sh/tabs/4-under-development).

## What actions are {{% vendor/name %}} taking to reduce its overall cloud carbon emissions?

As noted by Greenly, our carbon auditor, {{% vendor/name %}} CPU usage is up to 12 times more efficient than a standard AWS EC2 deployment.[^1] 
Choosing a data center that uses low-carbon electricity also ensures your project is emitting less CO<sub>2</sub>eq than the same project on a high-carbon grid. 
If you migrate ([external](/learn/tutorials/migrating) or [internal](/projects/region-migration)) a project from a high- to low-carbon electricity grid, you can contribute to de-carbonization efforts. 
The carbon intensities of the underlying grid are shown in the console and CLI. 
On Upsun, you can receive a 3% discount on resource usage when you choose to deploy to a data center in one of six, incentive-eligible greener regions. 
[Learn how](https://upsun.com/blog/greener-region-discount/).

## Why does the geolocation of my data center matter?

The carbon intensity of the underlying electricity grid of the data center you use is the basis for calculating the carbon footprint of your cloud application. 
The GHG Protocol stipulates/follows a location-based approach. 
In contrast, a market-based approach takes into account renewable energy purchases through Power Purchase Agreements and Renewable Energy Certificates. 

## Do you account for different Power Usage Efficiencies (PUEs)?

Yes, our auditor uses publicly available PUEs’ information for the five Infrastructure-as-a-Service providers {{% vendor/name %}} offers—Amazon Web Services, Google Cloud Platform, Microsoft Azure, OVHcloud, and Orange. 

## What is CO<sub>2</sub>eq?

CO<sub>2</sub>eq is the total of all greenhouse gasses and takes into account the global warming potential of all GHGs. 
[Learn more](https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Carbon_dioxide_equivalent#:~:text=A%20carbon%20dioxide%20equivalent%20or,with%20the%20same%20global%20warming). 

## Where can I find my email with my organization’s carbon footprint for the previous year?

It was sent with the subject line [**@todo: insert subject line**]. 
Please check your spam folder if you can’t locate it. 

[^1]: Greenly. _[{{% vendor/name %}} carries out its Carbon Footprint with Greenly](https://greenly.earth/en-gb/case-study/platform.sh1)_. 2022.
