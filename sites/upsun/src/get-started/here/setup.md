---
title: Setup
weight: 5
---

{{< note theme="info" title="Got code?" >}}
In order to follow along with this guide, you need a local project.
While the guide has been written to accommodate the following stacks, it is not limited to just those listed and are here only as examples.

<!-- Examples:
- [Express installation guide](https://expressjs.com/en/starter/installing.html)
- [Next.js installation guide](https://nextjs.org/docs/getting-started/installation)
- [Strapi installation guide](https://docs.strapi.io/dev-docs/installation) -->

<details>
  <summary>JavaScript/Node.js</summary>

- [Express installation guide](https://expressjs.com/en/starter/installing.html)
- [Next.js installation guide](https://nextjs.org/docs/getting-started/installation)
- [Strapi installation guide](https://docs.strapi.io/dev-docs/installation)

</details>

<details>
  <summary>PHP</summary>

- [Laravel installation guide](https://laravel.com/docs/10.x#creating-a-laravel-project)
- [Symfony installation guide](/get-started/stacks/symfony/_index.md)

</details>

<details>
  <summary>Python</summary>

- [Flask installation guide](https://flask.palletsprojects.com/en/2.3.x/installation)
- [Django installation guide](https://docs.djangoproject.com/en/5.0/intro/tutorial01/)
</details>

{{< /note >}}

{{% guides/requirements %}}

{{% note theme="info" title="Trials" %}}
When you create your first organization on {{% vendor/name %}}, you are also activating your trial for that organization.
Get [more information on trials](/glossary#trial).
{{% /note %}}

## Initialize your Git repository

A Git repository is required for {{% vendor/name %}} projects.
If you haven't already done so, initialize a Git repository for your codebase, and commit your files:

```bash {location="Terminal"}
git init
git add .
git commit -m "Initial commit."
```

This guide assumes that your repository's default branch is `main`.
Your Git configuration may result in different default branches (like `master`), so please run `git branch -M main` before proceeding.

{{< note theme="info" title="Don't commit dependencies" >}}

Whether you're migrating your own project, or testing {{% vendor/name %}} with a starter project, **never commit your app's dependencies**.
Make sure you ignore directories containing dependencies by updating your `.gitignore` file.

```bash
# JavaScript/Node.js
echo "node_modules" >> .gitignore

# PHP
echo "vendor" >> .gitignore

# Python
echo "env" >> .gitignore

git add .gitignore && git commit -m "Update .gitignore to ignore deps."
```

{{< /note >}}

{{< guide-buttons previous="Back" type="*" next="Create a project" nextLink="/get-started/here/create-project" type="*" >}}
