---
title: Introduction
showTitle: false
editPage: false
feedback: false
---

{{< home >}}

## How the docs are organized

There are different [kinds](https://documentation.divio.com/) of documentation.
Some docs are useful when you're just starting out,
while others go into detail that's relevant only after you've deployed many projects on {{% vendor/name %}}.

This site is roughly split into categories based on where you are in your journey working with {{% vendor/name %}}, described below.

### Get started

If you're still unfamiliar with {{% vendor/name %}} and how it works, _but_ you're also looking to quickly start working with the platform, the **Get started** section is the right place to begin.

Learn the basics of how {{% vendor/name %}} leverages Git to produce reusable build images, identical-to-production environments in staging and development (including production data), as well as the basics of monitoring and troubleshooting your environments.

Ready to get started? [Let's go!](/get-started/here)

### Learn

After going through the **Get started** section, you may want to know more about how {{% vendor/name %}} works and the logic behind it. The **[Learn](/learn/_index.md)** section is a collection of tutorials and conceptual guides to help you understand the ins and outs of {{% vendor/name %}}.

- [**What is {{% vendor/name %}}?**](/learn/overview/_index.md)

    With this guide, find out which problem {{% vendor/name %}} is trying to solve.
    Learn how {{% vendor/name %}}'s configuration, build and deploy pipelines, and the structure of environments play into the broader philosophy behind reliably deploying applications.

- [**Tutorials**](/learn/tutorials/_index.md)

    Once you're familiar with {{% vendor/name %}}, its basic rules and philosophy, you may be curious about how you can replicate common workflows in other tools on our platform.
    From scheduling dependency updates and backups to exporting data, the [**Tutorials**](/learn/tutorials/_index.md) provide all the information you need.

- [**Best practices**](/learn/bestpractices/_index.md)

    {{% vendor/name %}} makes deploying and managing infrastructure no different than working with Git.
    As your work becomes more experimental, however, you may be interested in optimizing your workflows, and addressing common constraints of the platform.
    The [**Best practices**](/learn/bestpractices/_index.md) documentation contains articles that address advanced use cases for caching, microservices, and more.

### Frameworks

Now that you understand the basic rules of {{% vendor/name %}}, you're likely ready to deploy your own custom code in a chosen framework.
The **Frameworks** section is a collection of framework-specific how-to guides - from best practices to configuration, local development, and more.

{{< frameworks-landing >}}

### Reference

The **Reference documentation** section is the largest and most comprehensive.
It includes details of configuration, environment variables, activities, and much more material you can use in your day-to-day work.

{{< home/table "services" >}}
{{< home/table "languages" >}}
{{< home/table "configuration" >}}
{{< home/table "topics" >}}

### API documentation

Find out more about {{% vendor/name %}}'s GIT implementation and REST API, and how you can leverage them to manage every aspect of your projects, through {{% vendor/name %}}'s [API documentation](https://api.platform.sh/docs/).

## Connect with us

### Join the community

The {{% vendor/name %}} community meets on both a [Community forum](https://support.platform.sh/hc/en-us/community/topics) and [Discord](https://discord.gg/PkMc2pVCDV) for questions and discussion.

Have an experiment you'd like to share?
Looking for a way to contribute?

<div style="margin-top: 3rem; text-align: center;">
    <a class="start-cta font-semibold text-sm xl:text-base px-4 py-2 bg-skye rounded text-white hover:bg-skye-dark focus:bg-skye-dark"
    href="https://discord.gg/PkMc2pVCDV" rel="noopener">Join us on Discord</a>
</div>

### Contribute
Feel free to open an issue or pull request for any of the repositories below, or let us know on [Discord](https://discord.gg/PkMc2pVCDV) if you find a problem we can help with:

{{< home/links-github >}}

### Get support

If you're experiencing issues with your projects, don't hesitate to open a [support ticket](/learn/overview/get-support).

