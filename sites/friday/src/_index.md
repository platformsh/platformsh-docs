---
title: Introduction
showTitle: false
editPage: false
feedback: false
---

{{< home >}}

## How the docs are organized

There are different [kinds](https://documentation.divio.com/) of documentation.
Some docs are useful when you are just starting out, 
while others go into detail that's relevant only after you've deployed many projects on {{< vendor/name >}}.

This site is roughly split into four categories of content based on where you are in your journey working with {{< vendor/name >}}, described below.

### Get started

If you've come to this site with only a little familiarity with {{< vendor/name >}} and how it works, _but_ you're also looking to quickly start working with the platform, the **Get started** section is the right place to begin. 

You'll learn the basics of how {{< vendor/name >}} leveraged Git to produce reusable build images, identical environments in staging and development to production (including production data), as well as the basics of monitoring and troubleshooting your environments. 

Ready to get started? [Let's go!](/get-started/)

### Learn

After going through the **Get started** section, you may be interested in some more information about how exactly {{< vendor/name >}} works, and why it works the way that it does. The **[Learn](/learn/_index.md)** section of the documentation it a collection of tutorials and conceptual guides that try to help you understand that much more about {{< vendor/name >}}.

- [**What is {{% vendor/name %}}?**](/learn/overview/_index.md)

    This guide focuses on answering one question - what is the problem {{< vendor/name >}} is trying to solve?
    Here you'll learn more about {{< vendor/name >}}'s how configuration, build and deploy pipelines, and the structure of environments play into the broader philosophy behind reliably deploying applications.

- [**Tutorials**](/learn/tutorials/_index.md)

    After you've familiarized yourself with {{< vendor/name >}}, it's basic rules and philosophy, you may be curious about how you can replicate common workflows in other tools on our platform. 
    From scheduling dependency updates and backups, the [**Tutorials**](/learn/tutorials/_index.md) will give you all the information you need.

- [**Best practices**](/learn/bestpractices/_index.md)

    {{< vendor/name >}} makes deploying and managing infrastructure no different than working with Git.
    As your work becomes more experimental, however, you may be interested in optimizing your workflows, and addressing common constraints of the platform. 
    The [**Best practices**](/learn/bestpractices/_index.md) documentation contains a number of articles that address advanced use cases for caching, microservices, and more.
    
### Frameworks

Once you've familiarized yourself with the basic rules of {{< vendor/name >}}, you'll likely want to deploy some of your own custom code in a chosen framework. 
The **Frameworks** section of the documentation contains a collection of framework-specific how-to guides - from best practices, configuration, local development, and more.

| Language              | Frameworks |
| :----------------     | :------  |
| [Python](/languages/python/_index.md)                |   [Django](/guides/django/_index.md)  |
| [PHP](/languages/php/_index.md)                      |   [Drupal](/guides/drupal9/_index.md)<br/>[Ibexa](/guides/ibexa/_index.md)<br/>[Laravel](/guides/laravel/_index.md)<br/>[Symfony](/guides/symfony/_index.md)<br/>[TYPO3](/guides/typo3/_index.md)<br/>[WordPress](/guides/wordpress/_index.md)   |
| [Javascript/Node.js](/languages/nodejs/_index.md)     |  [Gatsby](/guides/gatsby/_index.md)<br/>[Next.js](/guides/nextjs/_index.md)<br/>[Strapi](/guides/strapi/_index.md)  |
| [Java](/languages/java/_index.md)                  |  [Hibernate](/guides/hibernate/_index.md)<br/>[Jakarta](/guides/jakarta/_index.md)<br/>[Micronaut](/guides/micronaut/_index.md)<br/>[Quarkus](/guides/quarkus/_index.md)<br/>[Spring](/guides/spring/_index.md)  |

### Reference 

The largest section of the documentation, and the content you'll likely spend the most time, is **Reference documentation**. 
It's here that details of configuration, environment variables, activities, and more topics you'll use in your day-to-day work can be found.

{{< home/table "services" >}}
{{< home/table "languages" >}}
{{< home/table "configuration" >}}
{{< home/table "topics" >}}

### More docs, found elsewhere

There are other forms of documentation that don't fit neatly into the categories above, but are nonetheless helpful resources for working with {{< vendor/name >}}. 
Some of the bigger ones are listed below:

| Source            | Links |
| :---------------- | :------ |
| [{{< vendor/name >}} Blog](https://platform.sh/blog)       |   {{< home/links-blog >}}   |
| [Blackfire.io resources](https://platform.sh/blog)       |   {{< home/links-blackfire >}}   |
| [DDEV resources](https://platform.sh/blog)       |   {{< home/links-ddev >}}   |
| [YouTube](https://www.youtube.com/@Platformsh)          |   {{< home/links-youtube >}}    |
| [GitHub](https://github.com/platformsh)    |  {{< home/links-github >}} |

Stay informed of all the latest {{< vendor/name >}} news by joining our newsletter.

<div style="margin-top: 3rem; text-align: center;">
    <a class="start-cta font-semibold text-sm xl:text-base px-4 py-2 bg-skye rounded text-white hover:bg-skye-dark focus:bg-skye-dark"
    href="https://platform.sh/preferences/" rel="noopener">Sign up for the newsletter</a>
</div>


## Getting help & contributing

### Join the community

The {{< vendor/name >}} community meets on both a [Community forum](https://community.platform.sh) and [Slack](https://chat.platform.sh) for questions and discussion. 

Have an experiment you'd like to share? 
Looking for a way to contribute?

<div style="margin-top: 3rem; text-align: center;">
    <a class="start-cta font-semibold text-sm xl:text-base px-4 py-2 bg-skye rounded text-white hover:bg-skye-dark focus:bg-skye-dark"
    href="https://chat.platform.sh" rel="noopener">Join us on Slack</a>
</div>

### How to contribute

Feel free to open an issue or pull request for any of the repositories below, or let us know on [Slack](https://chat.platform.sh) if you find a problem we can help with:

{{< home/links-github >}}

### Support

If you're experiencing issues with your projects, don't hesitate to open a [support ticket](/learn/overview/get-support).

## Config snippets

### `app` file

```yaml {configFile="app"}
{{% snippet name="static-site" config="app" %}}
# The type of the application to build.
type: "nodejs:18"
# Access control to service containers.
relationships:
    mariadb: "mariadb:mysql"
    redis: "redis:redis"
# The web key configures the web server running in front of your app.
web:
    locations:
        "/api": 
            # Static site generators usually output built static files to a specific directory.
            # Define this directory (must be an actual directory inside the root directory of your app)
            # as the root for your static site.
            root: "public"
            # Files to consider when serving a request for a directory.
            index:
                - index.html
{{% /snippet %}}

{{% snippet placeholder="true" config="service" /%}}

{{% snippet placeholder="true" config="route" /%}}
```

### `apps` file

```yaml {configFile="apps"}
{{% snippet name="static-site" config="apps" %}}
# The type of the application to build.
type: "nodejs:{{% latest "nodejs" %}}"
# Access control to service containers.
relationships:
    mariadb: "mariadb:mysql"
    redis: "redis:redis"
# The web key configures the web server running in front of your app.
web:
    locations:
        "/api": 
            # Static site generators usually output built static files to a specific directory.
            # Define this directory (must be an actual directory inside the root directory of your app)
            # as the root for your static site.
            root: "public"
            # Files to consider when serving a request for a directory.
            index:
                - index.html
{{% /snippet %}}

{{% snippet name="another-site" config="apps" globKey="false" %}}
# The type of the application to build.
type: "nodejs:{{% latest "nodejs" %}}"
# Access control to service containers.
relationships:
    mariadb: "mariadb:mysql"
    redis: "redis:redis"
# The web key configures the web server running in front of your app.
web:
    locations:
        "/api": 
            # Static site generators usually output built static files to a specific directory.
            # Define this directory (must be an actual directory inside the root directory of your app)
            # as the root for your static site.
            root: "public"
            # Files to consider when serving a request for a directory.
            index:
                - index.html
{{% /snippet %}}

{{% snippet placeholder="true" config="service" /%}}

{{% snippet placeholder="true" config="route" /%}}
```

### `services` file


```yaml {configFile="services"}
{{% snippet name="mariadb" config="service" %}}
    type: mariadb:{{% latest "mariadb" %}}
    disk: 256
{{% /snippet %}}
{{% snippet name="redis" config="service" globKey="false" %}}
    type: redis:{{% latest "redis" %}}
{{% /snippet %}}

{{% snippet placeholder="true" /%}}

{{% snippet placeholder="true" config="route" /%}}
```

### `routes` file

```yaml {configFile="routes"}
{{% snippet name="static-site" config="route" subDir="api" %}}
    cache:
        enabled: true
        headers: ['Accept', 'Accept-Language', 'X-Language-Locale']
        cookies: ['*']
        default_ttl: 60
{{% /snippet %}}
{{% snippet placeholder="true" /%}}
{{% snippet placeholder="true" config="service" /%}}
